import axios from 'axios';
import { isEmpty, serverURL } from '../config';
import { setUser } from '../store/slice/authSlice'
import { setContactList as _setContactList } from "../store/slice/chatSlice"
import { getMessageList as _getMessageList } from "../store/slice/chatSlice"
import store from "../store";
import moment from 'moment/moment';

export const getRoleInfo = async (data) => {
    try{
        const res = await axios.post(serverURL + '/api/user/getroleinfo', {data});
        const resdata = res.data;
        if(resdata.status == 0){
            return true
        }
        else{
            return false
        }
    }
    catch(error){
        console.error(error);
        return false
    }
}


export const getCurrentFormatedDate = () => {
    return moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
}
export const getCurrentFormatedDate1 = (date) => {
    return moment(date).format("yyyy-MM-DD HH:mm:ss");
}
export const onSum = (items) => {
    var temp = 0;
    items.map((item, index) => (
        temp += Number(Number(item.unit_price) * Number(item.quantity))
    ))
    return temp;
}
export const randomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

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


export const getRoleFlag = async (userinfo, str) => {
    try{
        if(!isEmpty(userinfo)){
            let index =await userinfo.permissions.findIndex((item) => { 
              if(item.name == str){
                return item;
              } 
            }) ;
            if(index > 0) return true;
            else return false;
        }
    }
    catch(err){
        console.log("getRoleFlag Error:", err);
        return false;
    }
}