import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr} from '../config';
import axios from 'axios';

const PermissionModal = ({ open, setOpen, refreshTable }) => {
    
    const [error, setError] = useState('');
    const [item, setItem] = useState('');
    const navigate = useNavigate();

    const handleClose = (event: any) => {
        event.preventDefault();
        setOpen(false);
    }

    const handleSave = (event: any) => {
        event.preventDefault();
        axios.post(serverURL + '/api/permission/new', {name: item})
            .then(res => {
                const data = res.data;
                if(!data.status) {
                    refreshTable();
                    toastr.success('Successfully added');
                    setOpen(false);
                } else {
                    setError(data.errors.name);
                }
            })
            .catch(() => {
                setOpen(false);
                navigate('/member/auth/signin');
            })
    }

    return (
        <>
            <div
                x-show="modalOpen"
                x-transition=""
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
                style={open ? {} : { display: 'none' }}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        New Permission
                    </h3>
                    <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>

                    <div className='mb-5.5'>
                        <div className="relative">
                            <span className="absolute left-4.5 top-4">
                                <TitleSVG />
                            </span>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="item"
                                id="item"
                                value={item}
                                onChange={e => {e.preventDefault(); setItem(e.target.value)}}
                                placeholder="Write permission name here"
                            />
                        </div>
                        <label
                            className="text-left mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="item"
                        >
                            {isEmpty(error) ? '' : error}
                        </label>
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button
                            className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
};

export default PermissionModal;