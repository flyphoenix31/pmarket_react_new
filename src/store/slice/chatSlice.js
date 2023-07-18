import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { isEmpty, serverURL, toastr } from '../../config';
import { setUser } from "./authSlice";
// import store from "..";

const initialState = {
    contactList: [],
    onlineUsers: [],
    messageList: [],
    currentId: -1,
    notification: false
}

// export const setContactList = createAsyncThunk(
//     'chat/setContactList',
//     async () => {
//         try {
//             const res = await axios.post(serverURL + '/api/chat/contacts');
//             const data = await res.data;
//             if (data.status) {
//                 if (!isEmpty(data.message))
//                     toastr.warning(data.message);
//                 return [];
//             }
//             return data.contacts;

//         } catch (error) {
//             store.dispatch(setUser({}));
//             return [];
//         }
//     }
// )

// export const getMessageList = createAsyncThunk(
//     'chat/getMessageList',
//     (id) => {
//         return async (dispatch) => {
//             try {
//                 const res = await axios.post(serverURL + '/api/chat/list', { id });
//                 const data = await res.data;
//                 if (data.status) {
//                     if (!isEmpty(data.message))
//                         toastr.warning(data.message);
//                     return { id: -1, list: [] };
//                 }
//                 return ({ id, list: data.messages });

//             } catch (error) {
//                 // store.dispatch(setUser({}));
//                 dispatch(setUser({}));
//                 dispatch({ id, list: data.messages });
//             }
//         }
//     }
// )

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (param) => {
        try {
            const res = await axios.post(serverURL + '/api/chat/sendMessage',
                param,
                // { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const data = await res.data;
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
            }

        } catch (error) {
            toastr.warning('Please try again later');
        }
    }
)

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => { state.onlineUsers = action.payload },
        setNewMessage: (state, action) => { state.messageList = [...state.messageList, action.payload] },
        setNotification: (state, action) => { state.notification = action.payload },
        setContactList: (state, action) => { state.contactList = action.payload },
        getMessageList: (state, action) => { state.currentId = action.payload.id, state.messageList = action.payload.list }
    },
    extraReducers: (builder) => {
        // builder.addCase(setContactList.fulfilled, (state, action) => {
        //     state.contactList = action.payload;
        // })
        // builder.addCase(getMessageList.fulfilled, (state, action) => {
        //     state.currentId = action.payload.id;
        //     state.messageList = action.payload.list;
        // })
    }
})

export const { setOnlineUsers, setNewMessage, setNotification, setContactList, getMessageList } = chatSlice.actions;

export default chatSlice.reducer;