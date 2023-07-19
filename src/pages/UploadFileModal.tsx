import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr} from '../config';
import moment from 'moment';
import axios from 'axios';
import { getCurrentFormatedDate } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import { sharedFileUpload } from '../store/slice/shared';

const UploadFileModal = ({openupload, setOpenUpload, refreshList }) => {
    const dispatch = useDispatch();
    const userinfo = useSelector((state: any) => state.auth.userInfo);
    const fileUpload = useRef();
    const navigate = useNavigate();
    const [preview, setPreview] = useState();
    const [file, setFile] = useState(null);
    const imageExist = (data) => {
        if(data.includes("jpg") || data.includes("jpeg") || data.includes("png")){
            return true;
        }
        else{
            return false;
        }
    }

    // useEffect(() => {
    //     if(file != null){
    //         setFile(null);
    //     }
    // })

    useEffect(() => {
        if(file != null){
            if(file.name.includes(".png") == false && file.name.includes(".jpg") == false){
                // file = null;
                // setFile(file);
                setPreview(null);
            }
        }
    }, [file]);


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("------------handlesubmit------------");
        if(file !== null){
            const formData = new FormData();
            if (file !== null)
                formData.append('file', file);
                formData.append('user_id', userinfo.id);
                formData.append('created_at', getCurrentFormatedDate());
                console.log("formdata", formData)
                axios.post(serverURL + '/api/shared/fileupload', formData)
                    .then(res => {
                        const data = res.data;
                        if(!data.status) {
                            refreshList();
                            toastr.success('Successfully added!');
                            setOpenUpload(false);
                            navigate('/member/share');
                        }
                    })
                    .catch((error) => {
                        console.log("newfoldererror", error)
                        setOpenUpload(false);
                        navigate('/member/auth/signin');
                    })

        }
        else{
            $("#choosefile").css("display","flex")
            setTimeout(() => {
                $("#choosefile").css("display","none")
            }, 2000);
        }
    }

    const handleFile = (event) => {
        event.preventDefault();
        fileUpload.current.click();
    }

    const handleFileChanged = (event) => {
        if (isEmpty(event.target) || isEmpty(event.target.files)) return;
        setFile(event.target.files[0]);
        if(imageExist(event.target.files[0].name)){
            setPreview(URL.createObjectURL(event.target.files[0]));
        }else{
            setPreview(null);
        }
    }

    const handleUserClick = (id) => {
        getMessageList(id);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
            setFile(null);
            setPreview(null);
            messageRef.current.value = '';
        }
    }

    const handleCancelImage = (event) => {
        event.preventDefault();
        setFile(null);
        setPreview(null);
    }

    return (
        <>
            <div
                x-show="modalOpen"
                x-transition="1s"
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 dialoganim"
                style={openupload ? {} : { display: 'none' }}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        Upload Files
                    </h3>
                    <span className="mx-auto mb-6 inline-block h-1 w-35 rounded bg-primary"></span>
                    
                    <div className="sticky bottom-0 border-t border-stroke bg-white py-5 px-6 dark:border-strokedark dark:bg-boxdark" style={{ flexGrow: 0 }}>
                        {
                            file === null ? 
                            <div style={{ position: 'relative',height:'400px',  border: '2px dotted #1A222C', borderRadius: '5px', padding: '10px', marginBottom: '10px',alignSelf:'center' }}></div> 
                            : 
                            (
                                <div style={{ position: 'relative',  border: '2px dotted #1A222C', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
                                    {
                                        <>
                                            <div>
                                                {
                                                    imageExist(file.name) ? <img
                                                        className='mx-auto'
                                                        src={preview != null ? preview : ""}
                                                        style={{height: '200px', display: 'block'}}
                                                        alt=''
                                                        onError={(event) => {event.preventDefault(); setPreview(null);}}
                                                    /> : ''
                                                }
                                                
                                            </div>
                                           
                                            <div className='text-center' style={{ width: '100%', fontSize:'25px', padding:'10px' }}>
                                                {file.name}
                                            </div>
                                            
                                            <div style={{position: 'absolute', right: 2, top: 2, cursor: 'pointer'}} onClick={handleCancelImage}>
                                                <svg width="18" height="18" viewBox="0 0 512 512" className="fill-current">
                                                    <polygon xmlns="http://www.w3.org/2000/svg" points="335.188,154.188 256,233.375 176.812,154.188 154.188,176.812 233.375,256 154.188,335.188 176.812,357.812   256,278.625 335.188,357.812 357.812,335.188 278.625,256 357.812,176.812 " />
                                                    <path xmlns="http://www.w3.org/2000/svg" d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472  c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z" />
                                                </svg>
                                            </div>
                                        </>
                                    }
                                </div>
                            )
                        }
                         <input type='file' ref={fileUpload} style={{ display: 'none' }} onChange={handleFileChanged} />
                        <form className="items-center justify-between space-x-4.5" onSubmit={handleSubmit}>
                            <div className="relative w-full">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Choose file..."
                                        className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                                        readOnly
                                    />
                                </div>
                                <div className="absolute right-5 top-1/2 inline-flex -translate-y-1/2 items-center justify-end space-x-4">
                                    <button className="hover:text-primary" onClick={handleFile}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" className="fill-current">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.835 1.79102C11.2378 1.79102 10.6651 2.02824 10.2428 2.45051L3.3503 9.34302C2.64657 10.0467 2.25122 11.0012 2.25122 11.9964C2.25122 12.9917 2.64657 13.9461 3.3503 14.6499C4.05403 15.3536 5.0085 15.7489 6.00372 15.7489C6.99895 15.7489 7.95341 15.3536 8.65714 14.6499L15.5496 7.75736C15.8425 7.46446 16.3174 7.46446 16.6103 7.75736C16.9032 8.05025 16.9032 8.52512 16.6103 8.81802L9.7178 15.7105C8.73277 16.6956 7.39677 17.2489 6.00372 17.2489C4.61067 17.2489 3.27468 16.6956 2.28964 15.7105C1.30461 14.7255 0.751221 13.3895 0.751221 11.9964C0.751221 10.6034 1.30461 9.26739 2.28964 8.28236L9.18214 1.38985C9.88572 0.686279 10.84 0.291016 11.835 0.291016C12.83 0.291016 13.7842 0.686279 14.4878 1.38985C15.1914 2.09343 15.5866 3.04768 15.5866 4.04268C15.5866 5.03769 15.1914 5.99194 14.4878 6.69552L7.5878 13.588C7.16569 14.0101 6.59318 14.2473 5.99622 14.2473C5.39926 14.2473 4.82676 14.0101 4.40464 13.588C3.98253 13.1659 3.74539 12.5934 3.74539 11.9964C3.74539 11.3995 3.98253 10.827 4.40464 10.4049L10.7725 4.04454C11.0655 3.75182 11.5404 3.7521 11.8331 4.04517C12.1258 4.33823 12.1256 4.81311 11.8325 5.10583L5.4653 11.4655C5.32469 11.6063 5.24539 11.7974 5.24539 11.9964C5.24539 12.1956 5.32449 12.3865 5.4653 12.5274C5.60611 12.6682 5.79709 12.7473 5.99622 12.7473C6.19535 12.7473 6.38633 12.6682 6.52714 12.5274L13.4271 5.63486C13.8492 5.21261 14.0866 4.63973 14.0866 4.04268C14.0866 3.4455 13.8494 2.87278 13.4271 2.45051C13.0049 2.02824 12.4321 1.79102 11.835 1.79102Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div style={{textAlign:'left',display:'none'}} id="choosefile">
                                <label className="mb-0 block font-medium mt-2 text-danger">Please choose the file...</label>
                            </div>
                            <div className="flex justify-end gap-4.5 mt-5">
                                <button
                                    className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    onClick={e => {
                                        e.preventDefault(); setOpenUpload(false);
                                    }}
                                >
                                    Discard
                                </button>
                                <button
                                    className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                    onClick={handleSubmit}
                                >
                                    Upload
                                </button>
                            </div>
                        
                        </form>
                    </div>

                </div>
            </div >
        </>
    );
};

export default UploadFileModal;