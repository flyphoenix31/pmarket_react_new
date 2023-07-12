import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    quotationList: [],
    errors: {},
    redirect: false
}

export const setQuotationList = createAsyncThunk(
    'quotation/setQuotationList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/quotation/list');
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return []
            }
            return data.list;

        } catch (error) {
            store.dispatch(setUser({}));
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

const quotationSlice = createSlice({
    name: 'quotation',
    initialState,
    reducers: {
        setErrors: (state, action) => { state.errors = action.payload },
        setRedirect: (state, action) => { state.redirect = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(newQuotation.fulfilled, (state, action) => {
            // state.invoiceList = action.payload;
            const data = action.payload;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.redirect = true;
                state.errors = {}
            }
        })
        builder.addCase(setQuotationList.fulfilled, (state, action) => {
            state.quotationList = action.payload;
            setQuotationList();
        })
    }
})

export const { setErrors, setRedirect } = quotationSlice.actions;
export default quotationSlice.reducer;