import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressSVG, ArrowDownSVG, ContentSVG, TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr } from '../config';
import { newCompose } from '../store/slice/emailSlice.js';
import axios from 'axios';
import { getCurrentFormatedDate, randomString, validateEmail } from '../utils';
import $ from 'jquery';
import { CopySVG, SaveSVG } from '../components/SVG';
import { useDispatch } from 'react-redux';

const ComposeModal = ({ onlyEmailList, is_compose, setCompose, curPage, getEmailList }) => {

    const [emailaddress, setEmailAddress] = useState('');
    const [msgcontent, setMsgContent] = useState('');
    const [msgsubject, setMsgSubject] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log("---------------------------------", curPage)
    useEffect(() => {

    }, [])

    const handleClose = (event: any) => {
        event.preventDefault();
        setCompose(false);
        getEmailList();
    }

    const handleSavem = (event: any) => {
        event.preventDefault();
        console.log("------Send EmailAddress------", emailaddress);
        console.log("------Send MsgContent------", msgcontent);
        let send_email = window.localStorage.getItem('user_email');
        let error_flag = 0;
        // if (emailaddress == "No Select") {
        //     setErrors({ "to": "Select the Email" });
        //     error_flag++;
        //     // return;
        // }
        if(isEmpty(emailaddress)){
            setErrors({ "to": "Write email address" });
            error_flag++;
        }
        if(validateEmail(emailaddress) == false){
            setErrors({ "to": "Write email address" });
            error_flag++;
        };
    
        if (isEmpty(msgsubject)) {
            setErrors({ "msgsubject": "Write subject here" });
            error_flag++;
        }
        if (isEmpty(msgcontent)) {
            setErrors({ "msgcontent": "Please enter" });
            error_flag++;
            // return;
        }
        if (error_flag > 0) return;
        let data = {
            send_email: send_email,
            receive_email: emailaddress,
            subject: msgsubject,
            content: msgcontent
        };
        console.log("=====newdata", data);
        dispatch(newCompose(data));
        getEmailList();
        setCompose(false);
        // navigate(`/member/email/${curPage}`);
        navigate(`/member/email/send`)
        setErrors({})
;    }

    return (
        <>
            <div
                x-show="modalOpen"
                x-transition="1s"
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 dialoganim"
                style={is_compose ? {} : { display: 'none' }}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <div>
                        <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                            BLENDER.COM
                        </h3>
                        <span className="mx-auto mb-6 inline-block h-1 w-40 rounded bg-primary"></span>
                    </div>
                    <div>
                        <div style={{ textAlign: 'left' }} className='mb-5'>
                            {/* <div className='mb-5.5'>
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="Username"
                                >
                                    To
                                </label>
                                <div className="relative z-20 bg-white dark:bg-form-input">
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <AddressSVG />
                                    </span>

                                    <select
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                                        value={emailaddress}
                                        onChange={e => { e.preventDefault(); setEmailAddress(e.target.value); setErrors({}) }}
                                    >
                                        {
                                            ["No Select", ...onlyEmailList].map((email, emailIndex) => (
                                                <option value={email}>{email}</option>
                                            ))
                                        }

                                    </select>
                                    <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                                        <ArrowDownSVG />
                                    </span>
                                </div>
                                <label
                                    className="mb-0 block text-sm font-medium mt-2 text-danger"
                                    htmlFor="bio"
                                >
                                    {errors.to}
                                </label>
                            </div> */}
                            <div className="mb-5.5">
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="subject"
                                >
                                    To
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4.5 top-4">
                                        <AddressSVG />
                                    </span>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={emailaddress}
                                        onChange={e => { e.preventDefault(); setEmailAddress(e.target.value) }}
                                        placeholder="Write email here"
                                    />
                                </div>
                                <label
                                    className="mb-0 block text-sm font-medium mt-2 text-danger"
                                    htmlFor="message"
                                >
                                    {errors.to}
                                </label>
                            </div>
                            <div className="mb-5.5">
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="subject"
                                >
                                    Subject
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4.5 top-4">
                                        <TitleSVG />
                                    </span>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="subject"
                                        name="subject"
                                        id="subject"
                                        value={msgsubject}
                                        onChange={e => { e.preventDefault(); setMsgSubject(e.target.value) }}
                                        placeholder="Write subject here"
                                    />
                                </div>
                                <label
                                    className="mb-0 block text-sm font-medium mt-2 text-danger"
                                    htmlFor="message"
                                >
                                    {errors.msgsubject}
                                </label>
                            </div>
                            <div className="mb-5.5">
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="Content"
                                >
                                    Message
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4.5 top-4">
                                        <ContentSVG />
                                    </span>

                                    <textarea
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        name="message"
                                        id="message"
                                        value={msgcontent}
                                        onChange={e => { e.preventDefault(); setMsgContent(e.target.value); setErrors({}) }}
                                        rows={6}
                                        placeholder="Write  here"
                                    ></textarea>
                                </div>
                                <label
                                    className="mb-0 block text-sm font-medium mt-2 text-danger"
                                    htmlFor="message"
                                >
                                    {errors.msgcontent}
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4.5 mt-4.5">
                            <button
                                className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white" style={{ color: 'cornflowerblue' }}
                                onClick={handleClose}
                            >
                                Discard
                            </button>
                            <button
                                className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                onClick={handleSavem}
                            >
                                Send
                            </button>
                        </div>
                    </div>

                </div>
            </div >
        </>
    );
};

export default ComposeModal;