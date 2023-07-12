import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { serverURL } from '../../config';
import { isEmpty, toastr } from "../../config";
import { setUser } from "./authSlice";
import store from "..";

const initialState = {
    clientList: [],
    currentClient: {},
    errors: {},
    redirect: false
}

export const setClientList = createAsyncThunk(
    'clients/setClientList',
    async () => {
        try {
            const res = await axios.get(serverURL + '/api/client/list');
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

export const newClient = createAsyncThunk(
    'clients/newClient',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/client/new', param);
            const data = await res.data;
            if (!data.status) {
                toastr.success('Successfully added');
            }
            else {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
            }
            return data;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const updateClient = createAsyncThunk(
    'clients/updateClient',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/client/update', param);
            const data = await res.data;
            if (!data.status) {
                toastr.success('Successfully updated');
            }
            else if (!isEmpty(data.message))
                toastr.warning(data.message);
            return data;

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

export const findOne = createAsyncThunk(
    'clients/findOne',
    async (id) => {
        try {

            const res = await axios.get(serverURL + '/api/client/findOne', { params: { id } });
            const data = await res.data;
            if (!data.status)
                return data
            else if (!isEmpty(data.message))
                toastr.warning(data.message);

        } catch (error) {
            store.dispatch(setUser({}));
        }
    }
)

const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setErrors: (state, action) => { state.errors = action.payload },
        setRedirect: (state, action) => { state.redirect = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(newClient.fulfilled, (state, action) => {
            const data = action.payload;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.redirect = true;
                state.errors = {}
            }
        })
        builder.addCase(updateClient.fulfilled, (state, action) => {
            const data = action.payload;
            if (data.status === 1) state.errors = data.errors;
            else if (!data.status) {
                state.redirect = true;
                state.errors = {}
            }
        })
        builder.addCase(setClientList.fulfilled, (state, action) => {
            state.clientList = action.payload;
            setClientList();
        })
        builder.addCase(findOne.fulfilled, (state, action) => {
            state.currentClient = action.payload.client;
        })
    }
})

export const { setErrors, setRedirect } = clientsSlice.actions;
export default clientsSlice.reducer;