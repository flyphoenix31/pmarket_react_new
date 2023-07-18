import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr} from '../config';
import axios from 'axios';
import { getCurrentFormatedDate } from '../utils';
const EditNameModal = ({preid, prename, editname, setEditName, refreshList }) => {
    
    const [error, setError] = useState('');
    const [item, setItem] = useState('');
    const [editIndex, setEditIndex] = useState(-1);

    const navigate = useNavigate();
    useEffect(() => {
        if(editIndex == -1){
            setItem(prename)
        }
    })

    const handleClose = (event: any) => {
        event.preventDefault();
        setEditIndex(-1);
        setEditName(false);
    }

    const handleSave = (event: any) => {
        event.preventDefault();
        axios.post(serverURL + '/api/shared/editname', {id: preid, name: item})
            .then(res => {
                const data = res.data;
                if(!data.status) {
                    refreshList();
                    toastr.success('Name is renamed successfully!');
                    setEditName(false);
                    navigate('/member/share');
                }
            })
            .catch((error) => {
                setEditName(false);
                navigate('/member/auth/signin');
            })
    }

    return (
        <>
            <div
                x-show="modalOpen"
                x-transition="1s"
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 dialoganim"
                style={editname ? {} : { display: 'none' }}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        Edit Name
                    </h3>
                    <span className="mx-auto mb-6 inline-block h-1 w-35 rounded bg-primary"></span>

                    <div className='mb-5.5'>
                        <div style={{textAlign:'left', paddingBottom:'5px', fontSize:'20px'}}>Edit Name</div>
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
                                onChange={e => {e.preventDefault();setEditIndex(1); setItem(e.target.value)}}
                                placeholder="Your Folder Name"
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
                            className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white" style={{color:'cornflowerblue'}}
                            onClick={handleClose}
                        >
                            Discard
                        </button>
                        <button
                            className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
};

export default EditNameModal;