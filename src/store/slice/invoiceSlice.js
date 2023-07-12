import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import axios from "axios";
import { isEmpty, serverURL, toastr } from '../../config';
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    invoiceList: [],
    currentInvoice: {},
    errors: {},
    redirect: false,
    previewInvoice: {},
    previewType: ''
}

export const sendQuotation = createAsyncThunk(
    'invoice/sendQuotation',
    async (param) => {
        try {
            console.log(param);
            const res = await axios.post(serverURL + '/api/invoice/send-quotation', param);
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return;
            }
            store.dispatch(setInvoiceList());
            toastr.success('Invoice sent successfully');
            return;

        } catch (error) {
            console.error(error);
            store.dispatch(setUser({}));
        }
    }
)

export const getInvoicePreview = createAsyncThunk(
    'invoice/getInvoicePreview',
    async (param) => {
        try {
            const res = await axios.get(serverURL + '/api/mailed-quotation/view-quotation', { params: { uuid: param } });
            const data = await res.data;
            console.log(data);
            if (!data.status) return data;
            else if (!isEmpty(data.message))
                toastr.warning(data.message);

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)


export const setInvoiceList = createAsyncThunk(
    'invoice/setInvoiceList',
    async (param, {dispatch}) => {
        try {
            const res = await axios.get(serverURL + '/api/invoice/list');
            const data = await res.data;

            if (!data.status) return data.list;
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return [];

        } catch (error) {
            dispatch(setUser({}));
            return [];
        }
    }
)

export const newInvoice = createAsyncThunk(
    'invoice/newInvoice',
    async (param) => {
        try {

            const res = await axios.post(serverURL + '/api/invoice/new', param);
            const data = await res.data;

            console.log(data);

            if (!data.status)
                toastr.success('Successfully added');
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return data;


        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const findOneInvoice = createAsyncThunk(
    'invoice/findOneInvoice',
    async (id) => {
        try {
            const res = await axios.get(serverURL + '/api/invoice/findOne', { params: { id } });
            const data = await res.data;
            if (!data.status)
                return data
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return null;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const updateInvoice = createAsyncThunk(
    'invoice/updateInvoice',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/invoice/update', param);
            const data = await res.data;
            if (!data.status)
                toastr.success('Successfully updated')
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return data;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setErrors: (state, action) => { state.errors = action.payload },
        setRedirect: (state, action) => { state.redirect = action.payload },
        setCurrentInvoice: (state, action) => { state.currentInvoice = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(newInvoice.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.redirect = true;
                state.errors = {}
            }
        })
        builder.addCase(updateInvoice.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.redirect = true;
                state.errors = {}
            }
        })
        builder.addCase(setInvoiceList.fulfilled, (state, action) => {
            state.invoiceList = action.payload;
        })
        builder.addCase(findOneInvoice.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            state.currentInvoice = { ...action.payload.invoice, items: action.payload.items };
        })
        builder.addCase(getInvoicePreview.fulfilled, (state, action) => {
            console.log(action);
            const data = action.payload;
            if(isEmpty(data)) return;
            if(!isEmpty(data.invoice)) {
                state.previewInvoice = { ...data.invoice, items: data.items };
                state.previewType = 'invoice';
            }
            if(!isEmpty(data.quotation)) {
                state.previewInvoice = { ...data.quotation, items: data.items };
                state.previewType = 'quotation';
            }
        })
    }
})

export const { setErrors, setRedirect, setCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;