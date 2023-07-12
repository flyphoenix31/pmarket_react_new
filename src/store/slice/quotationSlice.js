import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import axios from "axios";
import { isEmpty, serverURL, toastr } from '../../config';
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    quotationList: [],
    currentQuotation: {},
    errors: {},
    redirect: false,
    previewQuotation: {}
}

export const sendQuotation = createAsyncThunk(
    'quotation/sendQuotation',
    async (param) => {
        try {
            console.log(param);
            const res = await axios.post(serverURL + '/api/quotation/send-quotation', param);
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return;
            }
            store.dispatch(setQuotationList());
            toastr.success('Quotation sent successfully');
            return;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const getQuotationPreview = createAsyncThunk(
    'quotation/getQuotationPreview',
    async (param) => {
        try {
            const res = await axios.get(serverURL + '/api/quotation/view-quotation', { params: { uuid: param } });
            const data = await res.data;
            if (!data.status) return data;
            else if (!isEmpty(data.message))
                toastr.warning(data.message);

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)


export const setQuotationList = createAsyncThunk(
    'quotation/setQuotationList',
    async (param, {dispatch}) => {
        try {
            const res = await axios.get(serverURL + '/api/quotation/list');
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

export const newQuotation = createAsyncThunk(
    'quotation/newQuotation',
    async (param) => {
        try {

            const res = await axios.post(serverURL + '/api/quotation/new', param);
            const data = await res.data;

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

export const findOneQuotation = createAsyncThunk(
    'quotation/findOneQuotation',
    async (id) => {
        try {
            const res = await axios.get(serverURL + '/api/quotation/findOne', { params: { id } });
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

export const updateQuotation = createAsyncThunk(
    'quotation/updateQuotation',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/quotation/update', param);
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

const quotationSlice = createSlice({
    name: 'quotation',
    initialState,
    reducers: {
        setErrors: (state, action) => { state.errors = action.payload },
        setRedirect: (state, action) => { state.redirect = action.payload },
        setCurrentQuotation: (state, action) => { state.currentQuotation = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(newQuotation.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.redirect = true;
                state.errors = {}
            }
        })
        builder.addCase(updateQuotation.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.redirect = true;
                state.errors = {}
            }
        })
        builder.addCase(setQuotationList.fulfilled, (state, action) => {
            state.quotationList = action.payload;
        })
        builder.addCase(findOneQuotation.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            state.currentQuotation = { ...action.payload.quotation, items: action.payload.items };
        })
        builder.addCase(getQuotationPreview.fulfilled, (state, action) => {
            console.log(action);
            const data = action.payload;
            if(isEmpty(data)) return;
            state.previewQuotation = { ...action.payload.quotation.quotation, items: action.payload.quotation.items };
        })
    }
})

export const { setErrors, setRedirect, setCurrentQuotation } = quotationSlice.actions;
export default quotationSlice.reducer;