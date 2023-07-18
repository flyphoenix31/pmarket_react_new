import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr} from '../config';
import axios from 'axios';
import { getCurrentFormatedDate, randomString } from '../utils';
import $ from 'jquery';
import { CopySVG, SaveSVG } from '../components/SVG';
import { useSelector } from 'react-redux';

const ShareModal = ({preid, preemail,prepassword, token, is_shared, setShare, refreshList }) => {
    
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [filelink, setFileLink] = useState('');
    const [emails, setEmails] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [ctoken, setToken] = useState('');
    const [emailflag, setEmailFlag] = useState(true);
    const navigate = useNavigate();
    let str = "Please enter your email address.";
    const [warningstr, setWarningStr] = useState(str);
    const tempUrl = window.location.host;
    useEffect(() => {
        if(editIndex == -1){
            setEmails('');
            setPassword('');
            setToken('');
            setFileLink('');
        }
        else{
            setEmails(emails);
            setPassword(password);
            setToken(ctoken);
            setFileLink(tempUrl + "/member/shared/" + ctoken);
        }
    },[])
    const validateEmail = (str) => {
        var validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(editIndex == 1){
            return true;
        }
        if(isEmpty(str)) return false;
        if (str.match(validRegex)) {
            return true;
        } else {
            return false;
        }
    }

    const copyContentToClipboard = async () => {
        let mfilelink = document.getElementById("filelink");
        mfilelink.select();
        document.execCommand('copy');    
    }
    const handleClose = (event: any) => {
        event.preventDefault();
        initHandle();
        setShare(false);
        refreshList();
    }
    const initHandle = () => {
        setEditIndex(-1);
        setEmails('');
        setPassword('');
        setToken('');
        setFileLink('');
    }
    const handleSavetk = (event: any) => {
        event.preventDefault();
        setEditIndex(1)
        let mtoken = '';
        if(isEmpty(token)){
            mtoken = randomString(5);
        }
        else{
            mtoken = token
        }
        setFileLink(tempUrl + "/member/shared/" + mtoken);
        setToken(mtoken);
        token = mtoken;
        axios.post(serverURL + '/api/shared/savetp', {id: preid, token:mtoken, password: password})
            .then(res => {
                const data = res.data;
                if(!data.status) {
                    setPassword('');
                }
            })
            .catch((error) => {
                console.log("newfoldererror", error)
            })
    }

    const handleSavem = (event: any) => {
        if(validateEmail(emails) == false) return;

        axios.post(serverURL + '/api/user/checkemail', {email: emails})
            .then(res => {
                let data = res.data;
                if(data.status == 1){
                    let str = "Email is not exist...";
                    setWarningStr(str);
                    setEmailFlag(false);
                    return;
                }
                else{
                    axios.post(serverURL + '/api/shared/savem', {id: preid, email: emails})
                        .then(res => {
                            const data = res.data;
                            if(!data.status) {
                                refreshList();
                                handleClose(event);
                                toastr.success('Email successfully sended!');
                                navigate('/member/share');
                            }
                        })
                        .catch((error) => {
                            setShare(false);
                            navigate('/member/auth/signin');
                        })
                }
            })
    }

    const firstFlag = (mtoken, memail) => {
        if(!isEmpty(mtoken) && !isEmpty(memail) && editIndex == -1){
            return true;
        }
        if(isEmpty(mtoken)){
            return true;
        }
        else{
            return false;
        }
    }

    const handleSave = (event: any) => {
        event.preventDefault();
        axios.post(serverURL + '/api/shared/save', {id: preid, password: password})
            .then(res => {
                const data = res.data;
                if(!data.status) {
                    refreshList();
                    toastr.success('Name is renamed successfully!');
                    // setShare(false);
                    // navigate('/member/share');
                }
            })
            .catch((error) => {
                console.log("newfoldererror", error)
                // setShare(false);
                // navigate('/member/auth/signin');
            })
    }


    return (
        <>
            <div
                x-show="modalOpen"
                x-transition="1s"
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 dialoganim"
                style={is_shared ? {} : { display: 'none' }}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <div>
                        <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                            Share Your File
                        </h3>
                        <span className="mx-auto mb-6 inline-block h-1 w-40 rounded bg-primary"></span>
                    </div>
                    {firstFlag(ctoken, emails) ?
                    <div>
                        <div style={{textAlign:'left', fontSize:'18px'}} className='mb-5 sharegenauto'>Link will Auto Generate </div>
                        <div className='mb-5.5'>
                            <div style={{textAlign:'left', paddingBottom:'5px', fontSize:'20px'}}>{isEmpty(prepassword) ? 'Password' : "Change Password"}</div>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <TitleSVG />
                                </span>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={e => {e.preventDefault(); setPassword(e.target.value); setEditIndex(1);}}
                                    placeholder="Type Your Password or Leave empty for no password"
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
                                className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"  style={{color:'cornflowerblue'}}
                                onClick={handleClose}
                            >
                                Discard
                            </button>
                            <button
                                className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                onClick={handleSavetk}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    :
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
                                        value={filelink}
                                        onChange={e => {e.preventDefault(); setFileLink(e.target.value)}}
                                        placeholder="File Link"
                                        readOnly
                                    />
                                    
                                    <button className="btn-peffect absolute right-1 top-4 flex bg-primary py-2 px-6 text-gray rounded" style={{top:'0.27rem'}} onClick={() => {copyContentToClipboard();}}>
                                        <CopySVG />
                                        <div style={{marginTop:'2px',paddingLeft:'5px'}}>Copy</div>
                                    </button>
                                </div>
                            </div>
                        
                        </div>
                        <div>
                            <div style={{fontSize:'17px', color:'grey', textAlign:'left'}} className='mb-1'>{isEmpty(preemail) ? "Recipients" : 'Change Recipients'}</div> 
                            <div>
                                <div className="relative">
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={emails}
                                        onChange={e => {setEmails(e.target.value); setEditIndex(2); setEmailFlag(true);setWarningStr("Please enter your email address.")}}
                                        placeholder="Type your emails"
                                        required
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
                                    {
                                        (validateEmail(emails) && emailflag == true) ?
                                        ""
                                        :
                                        <div className='block text-danger' style={{fontSize:'17px',textAlign:'left',padding:'5px 0px 0px 5px'}}>{ warningstr }</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4.5 mt-4.5">
                            <button
                                className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white" style={{color:'cornflowerblue'}}
                                onClick={handleClose}
                            >
                                I'm Done
                            </button>
                            <button
                                className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                onClick={handleSavem}
                            >
                                Send Mail
                            </button>
                        </div>
                    </div>
                    }
                    
                </div>
            </div >
        </>
    );
};

export default ShareModal;