import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isEmpty, serverURL } from "../../config";
import axios from "axios";
import { toastr } from "../../config";

const initialState = {
    isAuthenticated: false,
    userInfo: {},
    theme: 'dark'
}

export const setUserInformation = createAsyncThunk(
    'auth/setUserInformation',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/user/login', param);
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return {}
            } else {
                toastr.success(`Welcome ${data.user.name}!`);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.user.id);
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
                return data.user;
            }

        } catch (error) {
            return {};
        }
    }
)

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (param) => {
        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
            const res = await axios.get(serverURL + '/api/user/current', param);
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return {}
            } else {
                return data.user;
            }

        } catch (error) {
            return {};
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTheme: (state, action) => { state.theme = action.payload },
        setUser: (state, action) => {
            console.log('setUser occured', action.payload);
            state.userInfo = action.payload;
            state.isAuthenticated = !isEmpty(action.payload);
            axios.defaults.headers.common['Authorization'] = '';
            localStorage.setItem('token', '');
            localStorage.setItem('user_id', '');
            localStorage.setItem('role_name', '');
            localStorage.clear();
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setUserInformation.fulfilled, (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = !isEmpty(action.payload);
        })
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = !isEmpty(action.payload);
            if (isEmpty(action.payload) && window.location.pathname !== '/member/auth/signin') {
                axios.defaults.headers.common['Authorization'] = '';
                localStorage.setItem('token', '');
            }
        })
    }
})

export const { setUser } = authSlice.actions;

export default authSlice.reducer;