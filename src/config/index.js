import { toast } from "react-toastify";

// export const serverURL = 'http://192.168.1.159:80';
// export const serverURL = 'http://192.168.1.159:82';
// export const serverURL = 'localhost:81';
export const serverURL = '';

export const isEmpty = (value) => {

    if (value === undefined || value === null)
        return true;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;

}

const toast_option = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
}

export const toastr = {
    success: (message) => {
        toast.success(message, { toast_option })
    },
    warning: (message) => {
        toast.warning(message, { toast_option })
    },
    error: (message) => {
        toast.error(message, { toast_option })
    },
    info: (message) => {
        toast.info(message, { toast_option })
    }
}