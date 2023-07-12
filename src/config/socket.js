import { io } from 'socket.io-client';
import { isEmpty, serverURL } from '.';
import { toast } from 'react-toastify';
import store from '../store';
import { setUserList } from '../store/slice/usersSlice';
import { setOnlineUsers, setNewMessage } from '../store/slice/chatSlice';
import { setNotificationList } from '../store/slice/notificationSlice';
import { setContactList } from '../utils';

const socket = io(isEmpty(serverURL) ? '/' : serverURL, { transports: ["websocket"] });
socket.disconnect();

socket.on("connect", () => {
    console.log('connected: ', socket.id);
});

socket.on("disconnect", () => {
    console.log('disconnected');
});

socket.on('newMessage', (data) => {
    // store.dispatch(addNewMessage(data));

    const chatStore = store.getState().chat;
    const authStore = store.getState().auth;

    if (chatStore.currentId === data.from_user || chatStore.currentId === data.to_user) {
        store.dispatch(setNewMessage(data));
    }

    else if (data.to_user === authStore.userInfo.id && window.location.pathname !== '/member/chat') {
        // store.dispatch(setNotification(true));
    }
    console.error(authStore.userInfo.id, data.to_user);
    if (authStore.userInfo.id === data.to_user) {
        toast.info('New message arrived ', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: authStore.theme, 
        });
    }
})

socket.on('connectionState', list => {
    store.dispatch(setOnlineUsers(list));
})

socket.on('notification', data => {
    store.dispatch(setNotificationList());
    toast.success(data.content, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
    });
})

socket.on('newUser', data => {
    store.dispatch(setUserList());
    store.dispatch(setContactList());
})

export default socket;