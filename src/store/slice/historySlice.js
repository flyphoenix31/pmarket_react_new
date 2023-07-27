import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    historyList: [],
    pageInfo: {},
}

export const setHistoryList = createAsyncThunk(
    'history/setHistoryList',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/history/list', param);
            const data = await res.data;
            console.log('==========chatHistory:', data);

            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return [];
            }
            return data;

        } catch (error) {
            store.dispatch(setUser({}));
            return [];
        }
    }
)

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setHistoryList.fulfilled, (state, action) => {
            state.historyList = action.payload.history;
            state.pageInfo = action.payload
        })
    }
})

export default historySlice.reducer;