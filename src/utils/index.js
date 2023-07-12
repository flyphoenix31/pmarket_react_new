import axios from 'axios';
import { serverURL } from '../config';
import { setUser } from '../store/slice/authSlice'
import { setContactList as _setContactList } from "../store/slice/chatSlice"
import { getMessageList as _getMessageList } from "../store/slice/chatSlice"
import store from "../store";

export const setContactList = async () => {
    try {
        const res = await axios.post(serverURL + '/api/chat/contacts');
        const data = res.data;
        console.warn(data);
        if (data.status) {
            if (!isEmpty(data.message))
                toastr.warning(data.message);
            // return [];
            store.dispatch(_setContactList([]));
            return;
        }
        store.dispatch(_setContactList(data.contacts));
        return;

    } catch (error) {
        console.error(error);
        store.dispatch(setUser({}));
        store.dispatch(_setContactList([]));
        // return resolve();
        return;
    }
}

export const getMessageList = async (id) => {
    try {
        const res = await axios.post(serverURL + '/api/chat/list', {id});
        const data = res.data;
        console.warn(data);
        if (data.status) {
            if (!isEmpty(data.message))
                toastr.warning(data.message);
            // return [];
            store.dispatch(_getMessageList({ id: -1, list: [] }));
            return;
        }
        store.dispatch(_getMessageList({ id, list: data.messages  }));
        return;

    } catch (error) {
        console.error(error);
        store.dispatch(setUser({}));
        store.dispatch(_getMessageList({ id: -1, list: [] }));
        // return resolve();
        return;
    }
}