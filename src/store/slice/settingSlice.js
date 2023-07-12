import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    data: {},
    errors: {}
}

export const getSetting = createAsyncThunk(
    'setting/getSetting',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/setting/get');
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return {}
            }
            return data.setting;

        } catch (error) {
            return {};
        }
    }
)

export const setSetting = createAsyncThunk(
    'setting/setSetting',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/setting/set', param);
            const data = await res.data;
            if (!data.status)
                toastr.success('Successfully updated');
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return data;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setErrors: (state, action) => { state.errors = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getSetting.fulfilled, (state, action) => {
            // state.invoiceList = action.payload;
            const data = action.payload;
            state.data = data;
        })
        builder.addCase(setSetting.fulfilled, (state, action) => {
            // state.invoiceList = action.payload;
            const data = action.payload;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.errors = {}
            }
        })
    }
})

export const { setErrors } = settingSlice.actions;
export default settingSlice.reducer;