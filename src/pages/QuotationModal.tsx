import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EmailSVG, HumanSVG, InvoiceSVG, SearchSVG, WebSVG } from '../components/SVG';
import { isEmpty } from '../config';

const QuotationModal = ({ open, setOpen, handleSend }) => {

    const dispatch = useDispatch();
    const currentQuotation = useSelector((state) => state.quotation.currentQuotation);

    const [to_name, setName] = useState('');
    const [to_email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [invoice, setInvoice] = useState('');
    const [mail_content, setContent] = useState('');
    const [quotation_id, setID] = useState('');

    useEffect(() => {
        if (open) {
            setSubject('Subject here');
            setContent('');
        }
    }, [open])

    useEffect(() => {
        console.log(currentQuotation);
        if (!isEmpty(currentQuotation)) {
            setName(currentQuotation.client_name);
            setEmail(currentQuotation.client_email);
            setInvoice(currentQuotation.invoice_number);
            setID(currentQuotation.id);
            setContent(`
Dear ${currentQuotation.client_name},
Please check our quotation offer on {QUOTE_LINK} 
Hope to hear back soon from you.
Best Regards, Pmarket.
            `);
        }
    }, [currentQuotation])

    const handleClose = (event: any) => {
        event.preventDefault();
        setOpen(false);
    }

    return (
        <>
            <div
                x-show="modalOpen"
                x-transition=""
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
                style={open ? {} : { display: 'none' }}
            // onClick={handleClose}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        Send Quotation
                    </h3>
                    <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>

                    <div className='mb-5.5'>
                        <div className="relative">
                            <span className="absolute left-4.5 top-4">
                                <HumanSVG />
                            </span>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="delivery"
                                id="delivery"
                                value={to_name}
                                placeholder="Write client name here"
                                readOnly
                            />
                        </div>
                        <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="to_name"
                        >
                            {/* {isEmpty(errors) ? '' : errors.to_name} */}
                        </label>
                    </div>

                    <div className='mb-5.5'>
                        <div className="relative">
                            <span className="absolute left-4.5 top-4">
                                <EmailSVG />
                            </span>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="delivery"
                                id="delivery"
                                value={to_email}
                                placeholder="Write client email here"
                                readOnly
                            />
                        </div>
                        <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="to_email"
                        >
                            {/* {isEmpty(errors) ? '' : errors.to_email} */}
                        </label>
                    </div>

                    <div className='mb-5.5'>
                        <div className="relative">
                            <span className="absolute left-4.5 top-4">
                                <WebSVG />
                            </span>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="delivery"
                                id="delivery"
                                value={subject}
                                onChange={e => { e.preventDefault(); setSubject(e.target.value) }}
                                placeholder="Write subject here"
                            />
                        </div>
                        <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="website"
                        >
                            {/* {isEmpty(errors) ? '' : errors.subject} */}
                        </label>
                    </div>

                    <div className="mb-5.5">
                        <div className="relative">
                            <span className="absolute left-4.5 top-4">
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                                            fill=""
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                                            fill=""
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_88_10224">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>

                            <textarea
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                name="bio"
                                id="bio"
                                value={mail_content}
                                onChange={e => { e.preventDefault(); setContent(e.target.value) }}
                                rows={6}
                                placeholder="Write mail content here"
                            ></textarea>
                        </div>
                        <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="remark"
                        >
                            {/* {isEmpty(errors) ? '' : errors.mail_content} */}
                        </label>
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button
                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                            onClick={e => {
                                e.preventDefault(); setOpen(false); handleSend({
                                    to_name, to_email, subject, invoice, mail_content, quotation_id
                                })
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
};

export default QuotationModal;