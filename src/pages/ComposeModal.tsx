import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressSVG, ArrowDownSVG, ContentSVG, TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr } from '../config';
import axios from 'axios';
import { getCurrentFormatedDate, randomString, validateEmail } from '../utils';
import $ from 'jquery';
import { CopySVG, SaveSVG } from '../components/SVG';

const ComposeModal = ({ onlyEmailList, is_compose, setCompose, setOnlyEmailList }) => {

    const [emailaddress, setEmailAddress] = useState('No Select');
    const [msgcontent, setMsgContent] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    console.log("---------------------------------",onlyEmailList)
    useEffect(() => {

    }, [])

    const handleClose = (event: any) => {
        event.preventDefault();
        setCompose(false);
        setOnlyEmailList();
    }

    const handleSavem = (event: any) => {
        event.preventDefault();
        console.log("------Send EmailAddress------",emailaddress);
        console.log("------Send MsgContent------",msgcontent);
        let send_email = window.localStorage.getItem('user_email');
        if(emailaddress == "No Select") {
            setErrors({"to":"Select the Email"})
        }
        if(isEmpty(msgcontent)){
            setErrors({"msgcontent":"Please enter"});
        }
        if(errors.length >= 1) return;
        axios.post(serverURL + '/api/email/compose', {send_email: send_email,receive_email: emailaddress, content: msgcontent})
            .then(res => {
                const data = res.data;
                console.log("data: ", data)
                if(!data.status) {
                    setOnlyEmailList();
                    handleClose(event);
                    setCompose(false);
                    toastr.success('Email successfully sended!');
                }
                else if(data.status == 1){
                    setOnlyEmailList();
                    handleClose(event);
                    setCompose(false);
                    toastr.success(data.message);
                }
            })
            .catch((error) => {
                console.log("newfoldererror", error)
                setCompose(false);
            })
    }

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
                            <div className='mb-5.5'>
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
                                        onChange={e => { e.preventDefault(); setEmailAddress(e.target.value) ;setErrors({})}}
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
                            </div>
                            <div className="mb-5.5">
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="Username"
                                >
                                    Message
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4.5 top-4">
                                        <ContentSVG />
                                    </span>

                                    <textarea
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        name="bio"
                                        id="bio"
                                        value={msgcontent}
                                        onChange={e => { e.preventDefault(); setMsgContent(e.target.value) ;setErrors({})}}
                                        rows={6}
                                        placeholder="Write  here"
                                    ></textarea>
                                </div>
                                <label
                                    className="mb-0 block text-sm font-medium mt-2 text-danger"
                                    htmlFor="bio"
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