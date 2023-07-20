import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    historyList: [],
    roleList: [],
    categoryList: [],
    currentJob: {}
}

export const setHistoryList = createAsyncThunk(
    'history/setHistoryList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/history/list');
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                toastr.warning(data.message);
                return [];
            }
            return data.list;

        } catch (error) {
            store.dispatch(setUser({}));
            return [];
        }
    }
)

export const newJob = createAsyncThunk(
    'history/newJob',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/job/new', param);
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message)){
                    toastr.warning(data.message);
                    return { id: -1, list: [] };
                }
                if(!isEmpty(data.errors)){
                    toastr.warning(data.errors.message);
                    return { id: -1, list: []};
                }
            }
            else
                toastr.success('Successfully added');

        } catch (error) {
            store.dispatch(setUser({}));
            return { id: -1, list: [] };
        }
    }
)

export const findOneJob = createAsyncThunk(
    'history/findOneJob',
    async (id) => {
        try {
            const res = await axios.get(serverURL + '/api/jobs/findOne', { params: { id } });
            const data = await res.data;
            if (!data.status)
                return data
            else {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
            }
            return null;
        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const updateJob = createAsyncThunk(
    'history/updateJob',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/job/update', param);
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message)){
                    toastr.warning(data.message);
                    return []
                }
                if(!isEmpty(data.errors)){
                    toastr.warning(data.errors.message);
                    return []
                }
            }
            toastr.success('Successfully updated');

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
            state.historyList = action.payload;
        })
    }
})

export default historySlice.reducer;