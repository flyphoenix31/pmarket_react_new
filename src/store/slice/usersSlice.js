import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
// import store from "../index";

const initialState = {
    userList: [],
    roleList: [],
    errors: {},
    redirect:false,
}

export const setUserList = createAsyncThunk(
    'users/setUserList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/user/list');
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return []
            }
            return data.users;

        } catch (error) {
            console.log(error);
            store.dispatch(setUser({}));
            return [];
        }
    }
)

export const setRoleList = createAsyncThunk(
    'users/setRoleList',
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
            console.log(error);
            // store.dispatch(setUser({}));
            return [];
        }
    }
)

export const newUser = createAsyncThunk(
    'users/newUser',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/user/register', param, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = await res.data;
            if(!data.status){
                toastr.success('Successfully added');
            }
            if (!isEmpty(data.message)) {
                toastr.warning(data.message);
            }
            if(!isEmpty(data.errors)){
            }
            console.log("======new user", data);
            return data;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/user/update', param, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = await res.data;
            if(!data.status){
                toastr.success('Successfully updated');
            }
            if(!isEmpty(data.message)){
                toastr.warning(data.message);
            }
            if(!isEmpty(data.errors)){
                console.log("=======update user", data);
            }
            return data;

        } 
        catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setErrors: (state, action) => { state.errors = action.payload },
        setRedirect: (state, action) => { state.redirect = action.payload },
    },
    extraReducers: (builder) => {
        builder.addCase(newUser.fulfilled, (state, action) => {
            const data = action.payload;
            console.log("--------new user errors", data);
            if(isEmpty(data)) return;
            if(data.status === 1 ) {
                state.errors = data.errors;
            }
            else if(!data.status){
                state.redirect = true;
                state.errors = {};
            }
        })  
        builder.addCase(updateUser.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            if(data.status === 1) {
                state.errors = data.errors;
                console.log("---------",state.errors);
            }
            else if(!data.status){
                state.redirect = true;
                state.errors = {};
            }
        })
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
export const { setErrors ,setRedirect } = usersSlice.actions;
export default usersSlice.reducer;