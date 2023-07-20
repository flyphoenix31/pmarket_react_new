import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    jobsList: [],
    roleList: [],
    categoryList: [],
    currentJob: {},
    errors: {},
    redirect: false,
}

export const setJobsList = createAsyncThunk(
    'jobs/setJobsList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/jobs/list');
            const data = await res.data;

            if (!data.status) {
                return data.list;
            }
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return [];

        } catch (error) {
            store.dispatch(setUser({}));
            return [];
        }
    }
)

export const setRoleList = createAsyncThunk(
    'jobs/setRoleList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/role/developerList');
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

export const setCategoryList = createAsyncThunk(
    'jobs/setCategoryList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/jobs/categories');
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
    'jobs/newJob',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/jobs/new', param);
            const data = await res.data;
            if (!data.status){
                toastr.success('Successfully added');
            }
            if (!isEmpty(data.message)){
                toastr.warning(data.message);
            }
            if(!isEmpty(data.errors)){
                console.log("===========jobserrors", data.errors);
            }
            return data;
            // if (data.status) {
            //     if (!isEmpty(data.message)){
            //         toastr.warning(data.message);
            //         return { id: -1, list: [] };
            //     }
            //     if(!isEmpty(data.errors)){
            //         toastr.warning(data.errors.message);
            //     }                 
            // }
            // else{
            //     toastr.success('Successfully added');
            // }

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const findOneJob = createAsyncThunk(
    'jobs/findOneJob',
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
    'jobs/updateJob',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/jobs/update', param);
            const data = await res.data;
            if (!data.status)
                toastr.success('Successfully updated')
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return data;
            toastr.success('Successfully updated');

        } catch (error) {
            store.dispatch(setUser({}));
            return [];
        }
    }
)

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setErrors: (state, action) => { state.errors = action.payload },
        setRedirect: (state, action) => { state.redirect = action.payload },
        setCurrentJobs: (state, action) => { state.currentJob = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(newJob.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            if(data.status === 1) {
                state.errors = data.errors;
                console.log("----------new jobs errorss", state.errors);
            }
            else if(!data.status){
                state.redirect = true;
                state.errors = {}
            }
        })

        builder.addCase(updateJob.fulfilled, (state, action) => {
            const data = action.payload;
            if(isEmpty(data)) return;
            if(data.status === 1) state.errors = data.errors;
            else if(!data.status){
                state.redirect = true;
                state.errors = {};
            }
        })

        builder.addCase(setJobsList.fulfilled, (state, action) => {
            state.jobsList = action.payload;
        })
        builder.addCase(setCategoryList.fulfilled, (state, action) => {
            state.categoryList = action.payload;
        })
        builder.addCase(setRoleList.fulfilled, (state, action) => {
            state.roleList = action.payload;
        })
        builder.addCase(findOneJob.fulfilled, (state, action) => {
            state.currentJob = action.payload;
        })
    }
})

export const { setErrors, setRedirect, setCurrentJobs } = jobsSlice.actions;
export default jobsSlice.reducer;