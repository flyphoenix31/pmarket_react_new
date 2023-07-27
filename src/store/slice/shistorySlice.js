import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    shistoryList: [],
    pageInfo: {},
}

export const setHistoryList = createAsyncThunk(
    'shistory/setHistoryList',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/shared/history', param);
            const data = await res.data;
            console.log('==========sharedHistory:', data);

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

const shistorySlice = createSlice({
    name: 'shistory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setHistoryList.fulfilled, (state, action) => {
            state.shistoryList = action.payload.history;
            state.pageInfo = action.payload
        })
    }
})

export default shistorySlice.reducer;