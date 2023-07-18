import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    notificationList: []
}

export const setNotificationList = createAsyncThunk(
    'notification/setNotificationList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/notification/unreadList');
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

export const makeReadNotification = createAsyncThunk(
    'notification/makeReadNotification',
    async (id) => {
        try {
            const res = await axios.post(serverURL + '/api/notification/makeRead', { id });
            const data = await res.data;
            return data;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setNotificationList.fulfilled, (state, action) => {
            state.notificationList = action.payload;
        })
        builder.addCase(makeReadNotification.fulfilled, (state, action) => {
            setNotificationList();
        })
    }
})

export default notificationSlice.reducer;