import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeySVG, TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr} from '../config';
import axios from 'axios';
import { getCurrentFormatedDate, randomString } from '../utils';
import $ from 'jquery';
import { CopySVG, SaveSVG } from '../components/SVG';
import { useSelector } from 'react-redux';
import SwitcherThree from '../components/SwitcherThree';

const ShareModal = ({mshareMode, preid, preemail,prepassword, token, is_shared, setShare, refreshList }) => {
    console.log("msharemode", mshareMode);
    let send_email = window.localStorage.getItem('user_email');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [filelink, setFileLink] = useState('');
    const [emails, setEmails] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [ctoken, setToken] = useState('');
    const [emailflag, setEmailFlag] = useState(true);
    const [shareMode ,setShareMode] = useState(false);
    const navigate = useNavigate();
    let str = "Please enter your email address.";
    const [warningstr, setWarningStr] = useState(str);
    const tempUrl = window.location.host;
    useEffect(() => {
        if(editIndex == -1){
            if(mshareMode == 0){
                setShareMode(false);
            }else{
                setShareMode(true);
            }
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
        console.log("---------sharemode", shareMode);
        event.preventDefault();
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
        if(shareMode == false){
            setEditIndex(1);
            axios.post(serverURL + '/api/shared/savetp', {id: preid, token:mtoken, password: password, email:'', shareMode: 0})
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
        else{
            setEditIndex(-1);
            axios.post(serverURL + '/api/shared/savetp', {id: preid, token:mtoken, password: '', email:'', shareMode: 1})
                .then(res => {
                    const data = res.data;
                    if(!data.status) {
                        setPassword('');
                        handleClose(event);
                        navigate('/member/share');
                        toastr.success('Full Mode was successful.');
                    }
                })
                .catch((error) => {
                    console.log("newfoldererror", error)
                })
        }
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
                    console.log("-----------filelink:", filelink);
                    axios.post(serverURL + '/api/shared/savem', {id: preid, email: emails,send_email: send_email, content: filelink })
                        .then(res => {
                            const data = res.data;
                            if(!data.status) {
                                refreshList();
                                handleClose(event);
                                toastr.success('Email successfully sended.');
                                navigate('/member/share');
                            }else{
                                toastr.success(data.message);
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
                        <div style={{textAlign:'left', fontSize:'20px',width:'100%'}} className='mb-5 sharegenauto flex justify-between'>
                            <div style={{display:'inline-grid'}}>
                                <span>1.Link will Auto Generate.</span>
                                <span>2.Set the sharing method.</span>
                                
                            </div>
                            <div style={{display:'inline-grid'}}>
                                <div className='sharemode' style={{placeSelf:'center'}}>
                                    <label
                                        htmlFor="toggle3"
                                        className="flex cursor-pointer select-none items-center" style={{height:'100%'}}
                                    >
                                        <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="toggle3"
                                            className="sr-only"
                                            onChange={() => {
                                                setShareMode(!shareMode);
                                            }}
                                        />
                                        <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                                            <div
                                                className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                                                shareMode && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                                                }`}
                                            >
                                                <span className={`hidden ${shareMode && '!block'}`}>
                                                <svg
                                                    className="fill-white dark:fill-black"
                                                    width="11"
                                                    height="8"
                                                    viewBox="0 0 11 8"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                    fill=""
                                                    stroke=""
                                                    strokeWidth="0.4"
                                                    ></path>
                                                </svg>
                                                </span>
                                                <span className={`${shareMode && 'hidden'}`}>
                                                <svg
                                                    className="h-4 w-4 stroke-current"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                    ></path>
                                                </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <span style={{fontSize:'17px'}}>(Private / Public)</span>
                            </div>
                         </div>
                        <div className='mb-5.5'>
                            <div style={{textAlign:'left', paddingBottom:'5px', fontSize:'20px'}}>{isEmpty(prepassword) ? 'Password' : "Change Password"}</div>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <KeySVG />
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
                                onClick={ e => {handleClose(e);setEditIndex(-1)}}
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
                                onClick={ e => {handleClose(e); setEditIndex(-1);}}
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