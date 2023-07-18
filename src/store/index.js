import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice';
import usersSlice from './slice/usersSlice';
import clientsSlice from './slice/clientsSlice';
import jobsSlice from './slice/jobsSlice';
import chatSlice from './slice/chatSlice';
import historySlice from './slice/historySlice';
import invoiceSlice from './slice/invoiceSlice';
import quotationSlice from './slice/quotationSlice';
import notificationSlice from './slice/notificationSlice';
import settingSlice from './slice/settingSlice';

export default configureStore({
    reducer: {
        auth: authSlice,
        users: usersSlice,
        clients: clientsSlice,
        jobs: jobsSlice,
        chat: chatSlice,
        invoice: invoiceSlice,
        quotation: quotationSlice,
        notification: notificationSlice,
        setting: settingSlice,
        history: historySlice,
    }
})