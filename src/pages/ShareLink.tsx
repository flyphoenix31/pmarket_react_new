import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr} from '../config';
import axios from 'axios';
import { getCurrentFormatedDate, randomString } from '../utils';
import $ from 'jquery';
import { CopySVG, SaveSVG } from '../components/SVG';

const ShareLink = ({preid, preemail, token, is_sharelink, setShareLink, refreshList }) => {
    console.log("---------------sharelink sharemode:", preemail);
    const [error, setError] = useState('');
    const [filelink, setFileLink] = useState('');
    const [emails, setEmails] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [ctoken, setToken] = useState('');
    
    const tempUrl = window.location.host;
    const navigate = useNavigate();
    let temp_filelink = '';
    let temp_emials = '';
    if(isEmpty(token)){
        temp_filelink = ''
    }
    else{
        temp_filelink = tempUrl + "/member/shared/" + token;
    }

    if(isEmpty(preemail)){
        temp_emials = '';
    }
    else{
        temp_emials = preemail;
    }
    useEffect(() => {
        // setEmails(preemail);
        // setFileLink(tempUrl + "/member/shared/" + token);
    },[])
    const validateEmail = (str) => {
        var validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(editIndex == 1){
            return true;
        }
        if (str.match(validRegex)) {
            return true;
        } else {
            return false;
        }
    }

    const copyContentToClipboard = async () => {
        // await navigator.clipboard.writeText(temp_filelink);
        let mfilelink = document.getElementById("filelink");
        mfilelink.select();
        document.execCommand('copy');  

    }
    const handleClose = (event: any) => {
        event.preventDefault();
        setShareLink(false);
        refreshList();
    }
   
    const handleSavem = (event: any) => {
        event.preventDefault();
        if(validateEmail(emails) == false) return;
        console.log("------Send Email------");
        // axios.post(serverURL + '/api/shared/sharelink', {id: preid, email: emails})
        //     .then(res => {
        //         const data = res.data;
        //         console.log("data: ", data)
        //         if(!data.status) {
        //             refreshList();
        //             handleClose(event);
        //             toastr.success('Email successfully sended!');
        //             navigate('/member/share');
        //         }
        //     })
        //     .catch((error) => {
        //         console.log("newfoldererror", error)
        //         setShareLink(false);
        //         navigate('/member/auth/signin');
        //     })
    }

    return (
        <>
            <div
                x-show="modalOpen"
                x-transition="1s"
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 dialoganim"
                style={is_sharelink ? {} : { display: 'none' }}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <div>
                        <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                            Share Link
                        </h3>
                        <span className="mx-auto mb-6 inline-block h-1 w-40 rounded bg-primary"></span>
                    </div>
                    <div>
                        <div style={{textAlign:'left'}} className='mb-5 sharelink'>
                            <div style={{color:'#009688', fontSize:'22px'}} className='mb-4'>Public Link</div> 
                            <div style={{fontSize:'17px', color:'grey'}} className='mb-5'>Anyone who having this link may dwonload your files</div> 
                            <div>
                                <div className="relative">
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        name="filelink"
                                        id="filelink"
                                        value={temp_filelink}
                                        // onChange={e => {e.preventDefault(); setFileLink(e.target.value)}}
                                        placeholder="File Link is not created"
                                        readOnly
                                    />
                                    
                                    <button className="btn-peffect absolute right-1 top-4 flex bg-primary py-2 px-6 text-gray rounded" style={{top:'0.27rem'}} onClick={e => {e.preventDefault();copyContentToClipboard();}}>
                                        <CopySVG />
                                        <div style={{marginTop:'2px',paddingLeft:'5px'}}>Copy</div>
                                    </button>
                                </div>
                            </div>
                        
                        </div>
                        {!isEmpty(preemail) ?
                        <div>
                            <div style={{fontSize:'17px', color:'grey', textAlign:'left'}} className='mb-1'>Recipients</div> 
                            <div>
                                <div className="relative">
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={temp_emials}
                                        // onChange={e => {e.preventDefault();setEmails(e.target.value);}}
                                        placeholder="Emails is not created"
                                        readOnly
                                    />
                                    <span className="absolute right-4 top-4">
                                        <svg
                                            className="fill-current"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 22 22"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.5">
                                            <path
                                                d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                                fill=""
                                            />
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        : ""
                        }
                        <div className="flex justify-end gap-4.5 mt-4.5">
                            <button
                                className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white" style={{color:'cornflowerblue'}}
                                onClick={handleClose}
                            >
                                Discard
                            </button>
                            <button
                                className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                onClick={handleSavem}
                            >
                                Send Mail
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div >
        </>
    );
};

export default ShareLink;