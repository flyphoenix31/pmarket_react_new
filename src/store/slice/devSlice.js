import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "../index";

const initialState = {
    userList: [],
    roleList: []
}

export const setUserList = createAsyncThunk(
    'dev/setUserList',
    async () => {
        try {
            console.log(12);
            const res = await axios.get(serverURL + '/api/user/list');
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return []
            }
            return data.users;

        } catch (error) {
            store.dispatch(setUser({}));
            return [];
        }
    }
)

export const setRoleList = createAsyncThunk(
    'dev/setRoleList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/role/list');
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

export const newUser = createAsyncThunk(
    'dev/newUser',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/user/register', param, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return []
            }
            else
                toastr.success('Successfully added');
            return data.list;

        } catch (error) {
            store.dispatch(setUser({}));
            return [];
        }
    }
)

export const updateUser = createAsyncThunk(
    'dev/updateUser',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/user/update', param, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return []
            }
            else 
                toastr.success('Successfully updated');
            return data.list;

        } catch (error) {
            store.dispatch(setUser({}));
            return [];
        }
    }
)

const devSlice = createSlice({
    name: 'dev',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setUserList.fulfilled, (state, action) => {
            state.userList = action.payload;
            setUserList();
        })
        builder.addCase(setRoleList.fulfilled, (state, action) => {
            state.roleList = action.payload;
            setUserList();
        })
    }
})

export default devSlice.reducer;