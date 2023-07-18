import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { isEmpty, serverURL, toastr } from '../../config';
import { setUser } from "./authSlice";
export const sharedFileUpload = createAsyncThunk(
    'chat/fileUpload',
    async (param) => {
        try {
            console.log("fileupload:", param);
            const res = await axios.post(serverURL + '/api/shared/fileupload',
                param,
                // { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const data = await res.data;
            console.log("filedata:", data)
            if (data.status) {
                if (!isEmpty(data.message))
                    toastr.warning(data.message);
                return;
            }

        } catch (error) {
            toastr.warning('Please try again later');
            return;
        }
    }
)
