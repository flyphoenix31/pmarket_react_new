import { io } from 'socket.io-client';
import { isEmpty, serverURL } from '.';
import { toast } from 'react-toastify';
import store from '../store';
import { setUserList } from '../store/slice/usersSlice';
import { setJobsList } from '../store/slice/jobsSlice';
import { setOnlineUsers, setNewMessage, setNotification } from '../store/slice/chatSlice';
import { setNotificationList } from '../store/slice/notificationSlice';
import { setContactList, setLogout } from '../utils';

const socket = io(isEmpty(serverURL) ? '/' : serverURL, { transports: ["websocket"] });
const socketStyle1 = {
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
}

const socketStyle2 = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
}
socket.disconnect();

socket.on("connect", () => {
    console.log('connected: ', socket.id);
});

socket.on("disconnect", () => {
    console.log('disconnected');
    setLogout();
});

socket.on('newMessage', (data) => {
    // store.dispatch(addNewMessage(data));

    const chatStore = store.getState().chat;
    const authStore = store.getState().auth;

    if (chatStore.currentId === data.from_user || chatStore.currentId === data.to_user) {
        store.dispatch(setNewMessage(data));
    }

    else if (data.to_user === authStore.userInfo.id && window.location.pathname !== '/member/chat') {
        store.dispatch(setNotification(true));
    }
    // console.error(authStore.userInfo.id, data.to_user);
    
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

socket.on("sendemail", (data) => {
    console.log("===========44444444444444444:", data);
    let {send_email, receive_email, content} = data;
    let user_email = window.localStorage.getItem('user_email');
    if(user_email == receive_email){
        // toast.success(`${data.content} came from ${data.send_email}` , socketStyle1);
        toast.success('You got a new Share Alert');
    }
})

socket.on('connectionState', list => {
    store.dispatch(setOnlineUsers(list));
})

socket.on('notification', data => {
    store.dispatch(setNotificationList());
    toast.success(data.content, socketStyle2);
})

socket.on('newUser', data => {
    store.dispatch(setUserList());
    store.dispatch(setContactList());
})

export default socket;