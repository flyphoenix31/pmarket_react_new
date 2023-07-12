import { useEffect, useRef, useState } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Breadcrumb from '../components/Breadcrumb.js';
import { isEmpty } from '../config/index.js';
import { updateInvoice, setRedirect, findOneInvoice } from '../store/slice/invoiceSlice.js';
import { MoneySVG, PercentSVG, TitleSVG } from '../components/SVG.js';
import ClientModal from './ClientModal.js';
import InvoicePreview from './InvoicePreview.js';

const HumanSVG = () => {
  return (
    <svg
      className="fill-current"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
          fill=""
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
          fill=""
        />
      </g>
    </svg>
  )
}

const EmailSVG = () => {
  return (
    <svg
      className="fill-current"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
          fill=""
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
          fill=""
        />
      </g>
    </svg>
  );
}

const AddressSVG = () => {
  return (
    <svg
      className="fill-current"
      width="20"
      height="20"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path xmlns="http://www.w3.org/2000/svg" d="M512 1012.8c-253.6 0-511.2-54.4-511.2-158.4 0-92.8 198.4-131.2 283.2-143.2h3.2c12 0 22.4 8.8 24 20.8 0.8 6.4-0.8 12.8-4.8 17.6-4 4.8-9.6 8.8-16 9.6-176.8 25.6-242.4 72-242.4 96 0 44.8 180.8 110.4 463.2 110.4s463.2-65.6 463.2-110.4c0-24-66.4-70.4-244.8-96-6.4-0.8-12-4-16-9.6-4-4.8-5.6-11.2-4.8-17.6 1.6-12 12-20.8 24-20.8h3.2c85.6 12 285.6 50.4 285.6 143.2 0.8 103.2-256 158.4-509.6 158.4z m-16.8-169.6c-12-11.2-288.8-272.8-288.8-529.6 0-168 136.8-304.8 304.8-304.8S816 145.6 816 313.6c0 249.6-276.8 517.6-288.8 528.8l-16 16-16-15.2zM512 56.8c-141.6 0-256.8 115.2-256.8 256.8 0 200.8 196 416 256.8 477.6 61.6-63.2 257.6-282.4 257.6-477.6C768.8 172.8 653.6 56.8 512 56.8z m0 392.8c-80 0-144.8-64.8-144.8-144.8S432 160 512 160c80 0 144.8 64.8 144.8 144.8 0 80-64.8 144.8-144.8 144.8zM512 208c-53.6 0-96.8 43.2-96.8 96.8S458.4 401.6 512 401.6c53.6 0 96.8-43.2 96.8-96.8S564.8 208 512 208z" fill="" />
    </svg>
  )
}

const PhoneSVG = () => {
  return (
    <svg
      className="fill-current"
      width="20"
      height="20"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path xmlns="http://www.w3.org/2000/svg" className="c" d="m19.308,12.467c-.4234-1.4115-.7215-2.8773-.8813-4.3843-.1571-1.4812-1.449-2.5826-2.9385-2.5826h-6.9092c-1.7767,0-3.1454,1.5345-2.989,3.3043,1.5754,17.8285,15.7771,32.0302,33.6056,33.6056,1.7698.1564,3.3043-1.2073,3.3043-2.9839v-6.1595c0-2.2488-1.1015-3.5362-2.5826-3.6932-1.507-.1598-2.9728-.4579-4.3843-.8813-1.7266-.5179-3.5957-.0304-4.8704,1.2442l-2.9566,2.9566c-5.326-2.8825-9.7164-7.2729-12.5989-12.5989l2.9566-2.9567c1.2746-1.2746,1.7621-3.1438,1.2442-4.8703Z" />
    </svg>
  )
}

const CalendarSVG = () => {
  return (
    <svg
      className="fill-current"
      width="20"
      height="20"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path xmlns="http://www.w3.org/2000/svg" d="M242.978,408.303c-2.372-2.398-5.572-3.652-9.225-3.652h-86.272c1.476-8.175,4.275-15.053,8.354-20.574    c6.025-8.354,17.673-17.954,34.901-28.672l4.779-3.379c16.973-10.701,27.947-19.072,33.476-25.523    c9.071-10.351,13.653-23.876,13.653-40.226c0-15.121-5.077-28.049-15.078-38.426c-11.213-11.58-26.214-17.451-44.57-17.451    c-18.526,0-33.527,5.871-44.604,17.502c-9.796,10.377-14.771,23.279-14.771,38.374v6.502c0,4.25,1.229,7.774,3.9,10.726    c5.103,5.103,14.071,4.873,18.722,0.222c2.876-2.577,4.378-6.101,4.378-10.197v-7.253c0-8.576,2.603-15.471,8.004-21.154    c5.922-6.374,13.901-9.472,24.371-9.472c10.496,0,18.577,3.123,24.678,9.498c5.35,5.623,7.953,12.527,7.953,21.129    c0,10.846-3.226,19.772-9.779,27.179c-5.47,5.973-16.452,14.046-32.495,23.996c-18.125,10.871-31.676,22.972-40.277,35.951    c-9.6,14.379-14.379,31.497-14.199,50.927l0.051,5.572h114.825c3.797,0,7.074-1.425,9.199-3.849    c2.398-2.372,3.678-5.402,3.678-8.772C246.63,413.756,245.359,410.633,242.978,408.303z" />
      <path xmlns="http://www.w3.org/2000/svg" d="M377.66,318.771c-11.401-14.353-27.076-21.623-46.652-21.623c-8.098,0-15.727,1.271-22.673,3.823    c-2.15,0.777-4.224,1.698-6.204,2.748l6.699-43.827h61.926c3.9,0,7.373-1.271,10.197-3.849c2.398-2.372,3.678-5.402,3.678-8.772    c0-3.627-1.425-6.827-4.147-9.225c-2.551-2.253-5.828-3.396-9.728-3.396h-84.634l-13.653,92.8    c-1.502,7.697,1.297,13.798,7.851,16.776c6.374,2.628,12.902,0.35,17.903-6.903c2.876-4.429,6.477-7.825,10.948-10.351    c5.623-3.021,11.972-4.574,18.825-4.574c11.998,0,21.299,4.224,28.348,12.902c6.579,8.201,9.779,18.176,9.779,30.473    c0,11.921-3.422,21.803-10.428,30.097c-7.424,8.747-16.998,13.022-29.201,13.022c-9.95,0-18.022-2.099-24.004-6.221    c-5.521-3.874-8.875-8.823-10.274-15.223c-1.297-5.402-4.497-8.004-6.775-9.122c-3.046-1.647-6.579-2.099-9.728-1.271    c-3.576,0.828-6.502,2.876-8.499,5.973c-1.374,2.202-2.748,5.854-1.476,10.701c2.662,12.245,9.694,22.272,20.941,29.773    c10.897,7.074,23.953,10.65,38.827,10.65c22.827,0,40.422-7.228,52.326-21.504c10.146-12.151,15.3-27.921,15.3-46.874    C393.131,347.196,387.908,331.375,377.66,318.771z" />
      <path xmlns="http://www.w3.org/2000/svg" d="M460.8,51.2h-25.6V38.4c0-21.171-17.229-38.4-38.4-38.4c-21.171,0-38.4,17.229-38.4,38.4v12.8H153.6V38.4    c0-21.171-17.229-38.4-38.4-38.4S76.8,17.229,76.8,38.4v12.8H51.2C22.972,51.2,0,74.172,0,102.4v358.4    C0,489.028,22.972,512,51.2,512h409.6c28.228,0,51.2-22.972,51.2-51.2V102.4C512,74.172,489.028,51.2,460.8,51.2z M384,38.4    c0-7.074,5.726-12.8,12.8-12.8c7.074,0,12.8,5.726,12.8,12.8v51.2c0,7.074-5.726,12.8-12.8,12.8c-7.074,0-12.8-5.726-12.8-12.8    V38.4z M102.4,38.4c0-7.074,5.726-12.8,12.8-12.8S128,31.326,128,38.4v51.2c0,7.074-5.726,12.8-12.8,12.8s-12.8-5.726-12.8-12.8    V38.4z M486.4,460.8c0,14.14-11.46,25.6-25.6,25.6H51.2c-14.14,0-25.6-11.46-25.6-25.6V179.2h460.8V460.8z M486.4,153.6H25.6    v-51.2c0-14.14,11.46-25.6,25.6-25.6h25.6v12.8c0,21.171,17.229,38.4,38.4,38.4s38.4-17.229,38.4-38.4V76.8h204.8v12.8    c0,21.171,17.229,38.4,38.4,38.4c21.171,0,38.4-17.229,38.4-38.4V76.8h25.6c14.14,0,25.6,11.46,25.6,25.6V153.6z" />
    </svg>
  )
}

const InvoiceContent = ({ data, setData, errors }) => {
  return (
    <>
      {
        data.map((item, itemIndex) => (
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row" key={itemIndex}>
            <div className="w-full sm:w-1/3">
              {
                itemIndex > 0 ? '' : (
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="description"
                  >
                    Description
                  </label>
                )
              }
              <div className="relative">
                <span className="absolute left-4.5 top-4">
                  <CalendarSVG />
                </span>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="description"
                  id="description"
                  value={item.description}
                  onChange={e => { e.preventDefault(); setData([...data.slice(0, itemIndex), { ...item, description: e.target.value }, ...data.slice(itemIndex + 1, data.length)]) }}
                  placeholder="Description here"
                />
              </div>
              <label
                className="mb-0 block text-sm font-medium mt-2 text-danger"
                htmlFor="invoice_number"
              >
                {!isEmpty(errors) && !isEmpty(errors[itemIndex]) ? errors[itemIndex].description : ''}
              </label>
            </div>
            <div className="w-full sm:w-1/4">
              {
                itemIndex > 0 ? '' : (
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="unit_price"
                  >
                    Rate
                  </label>
                )
              }
              <div className="relative">
                <span className="absolute left-4.5 top-4">
                  <CalendarSVG />
                </span>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="unit_price"
                  id="unit_price"
                  value={item.unit_price}
                  onChange={e => { e.preventDefault(); setData([...data.slice(0, itemIndex), { ...item, unit_price: e.target.value }, ...data.slice(itemIndex + 1, data.length)]) }}
                  placeholder="Rate here"
                />
              </div>
              <label
                className="mb-0 block text-sm font-medium mt-2 text-danger"
                htmlFor="invoice_number"
              >
                {!isEmpty(errors) && !isEmpty(errors[itemIndex]) ? errors[itemIndex].unit_price : ''}
              </label>
            </div>
            <div className="w-full sm:w-1/4">
              {
                itemIndex > 0 ? '' : (
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="quantity"
                  >
                    QTY
                  </label>
                )
              }
              <div className="relative">
                <span className="absolute left-4.5 top-4">
                  <CalendarSVG />
                </span>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="quantity"
                  id="quantity"
                  value={item.quantity}
                  onChange={e => { e.preventDefault(); setData([...data.slice(0, itemIndex), { ...item, quantity: e.target.value }, ...data.slice(itemIndex + 1, data.length)]) }}
                  placeholder="Quantity here"
                />
              </div>
              <label
                className="mb-0 block text-sm font-medium mt-2 text-danger"
                htmlFor="invoice_number"
              >
                {!isEmpty(errors) && !isEmpty(errors[itemIndex]) ? errors[itemIndex].quantity : ''}
              </label>
            </div><div className="w-full sm:w-1/12">
              {
                itemIndex > 0 ? '' : (
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="quantity"
                  >
                    Tax
                  </label>
                )
              }
              <div className="relative">
                <div x-data="{ checkboxToggle: false }">
                  <label htmlFor={"checkboxLabel" + itemIndex} className="flex cursor-pointer select-none items-center w-full rounded border-stroke pl-1 py-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary">
                    <div className="relative">
                      <input type="checkbox" id={"checkboxLabel" + itemIndex} className="sr-only" onClick={e => {
                        e.preventDefault(); setData([...data.slice(0, itemIndex), { ...item, has_tax: !item.has_tax }, ...data.slice(itemIndex + 1, data.length)])
                      }} />
                      <div className={"mr-4 flex h-5 w-5 items-center justify-center rounded border " + (item.has_tax ? 'border-primary bg-gray dark:bg-transparent' : '')}>
                        <span className={"opacity-0 " + (item.has_tax ? '!opacity-100' : '')}>
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z" fill="#3056D3" stroke="#3056D3" strokeWidth="0.4"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/12">
              {
                itemIndex > 0 ? '' : (
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Action
                  </label>
                )
              }
              <div className="relative">
                <button
                  className="w-full flex justify-center rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  onClick={e => {
                    e.preventDefault();
                    if (itemIndex === 0) return;
                    setData([...data.slice(0, itemIndex), ...data.slice(itemIndex + 1, data.length)])
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

        ))
      }
    </>
  );
}

const InvoiceEdit = () => {

  const [name, setName] = useState('');
  const [invoice_date, setInvoiceData] = useState('');
  const [invoice_number, setInvoiceNumber] = useState('');
  const [due_date, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const [company_name, setCompanyName] = useState('');
  const [company_email, setCompanyEmail] = useState('');
  const [company_phone, setCompanyPhone] = useState('');
  const [company_address, setCompanyAddress] = useState('');
  const [client_name, setClientName] = useState('');
  const [client_email, setClientEmail] = useState('');
  const [client_phone, setClientPhone] = useState('');
  const [client_address, setClientAddress] = useState('');

  const [currency_id, setCurrencyId] = useState('1');
  const [tax_type_id, setTaxType] = useState('1');
  const [tax_value, setTaxValue] = useState('10');
  const [discount_type_id, setDiscountType] = useState('1');
  const [discount_value, setDiscountValue] = useState('20');

  const [previewMode, setPreviewMode] = useState(false);
  const [open, setOpen] = useState(false);

  const errors = useSelector((state) => state.invoice.errors);
  const redirect = useSelector((state) => state.invoice.redirect);
  const invoiceList = useSelector((state) => state.invoice.invoiceList);
  const currentInvoice = useSelector((state) => state.invoice.currentInvoice);

  const init_invoice = {
    description: '',
    unit_price: '',
    quantity: '',
    item_notes: '',
    has_tax: false
  }

  const [items, setInvoiceList] = useState([init_invoice]);
  const titleList = ['Mr', 'Mrs', 'Ms', 'Dr'];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { id } = useParams();

  useEffect(() => {
    if (isEmpty(invoiceList))
      navigate('/member/invoice');
    dispatch(findOneInvoice(id));
  }, [invoiceList])

  useEffect(() => {
    if (redirect) {
      dispatch(setRedirect(false));
      navigate('/member/invoice');
    }
  }, [redirect])

  useEffect(() => {
    if (!isEmpty(currentInvoice)) {
      setName(currentInvoice.name);
      setInvoiceData(moment(currentInvoice.invoice_date).format('YYYY-MM-DD'));
      setInvoiceNumber(currentInvoice.invoice_number);
      setDueDate(moment(currentInvoice.due_date).format('YYYY-MM-DD'));
      setNotes(currentInvoice.notes);
      setCompanyName(currentInvoice.company_name);
      setCompanyEmail(currentInvoice.company_email);
      setCompanyPhone(currentInvoice.company_phone);
      setCompanyAddress(currentInvoice.company_address);
      setClientName(currentInvoice.client_name);
      setClientEmail(currentInvoice.client_email);
      setClientPhone(currentInvoice.client_phone);
      setClientAddress(currentInvoice.client_address);
      setCurrencyId(currentInvoice.currency_id);
      setTaxType(currentInvoice.tax_type_id);
      setTaxValue(currentInvoice.tax_value);
      setDiscountType(currentInvoice.discount_type_id);
      setDiscountValue(currentInvoice.discount_value);
      setInvoiceList(currentInvoice.items);
    }
  }, [currentInvoice])

  const handleSubmit = (event: any) => {

    event.preventDefault();

    const data = {
      id,
      name,
      invoice_date: moment(invoice_date).format('YYYY-MM-DD'),
      invoice_number,
      due_date: moment(due_date).format('YYYY-MM-DD'),
      notes,
      company_name,
      company_email,
      company_phone,
      company_address,
      client_name,
      client_email,
      client_phone,
      client_address,
      currency_id,
      tax_type_id,
      tax_value,
      discount_type_id,
      discount_value,
      items
    }

    dispatch(updateInvoice(data));
    // navigate('/member/invoice');
  }

  const handleClose = (event: any) => {
    event.preventDefault();
    navigate('/member/invoice');
  }

  const handleAddRow = (event: any) => {
    event.preventDefault();
    setInvoiceList([...items, init_invoice])
  }

  const handleSelect = (user) => {
    setClientName((isEmpty(user.title) ? '' : (titleList[user.title] + '. ')) + user.name)
    setClientEmail(user.email)
    setClientPhone(user.phone)
    setClientAddress(user.address)
  }

  const totalPrice = items.reduce((value, item) => value + (item.unit_price * item.quantity), 0);

  const invoicePreview = (
    <InvoicePreview
      company_name={company_name}
      company_email={company_email}
      company_phone={company_phone}
      company_address={company_address}
      client_name={client_name}
      client_email={client_email}
      client_phone={client_phone}
      client_address={client_address}
      invoice_number={invoice_number}
      items={items}
      totalPrice={totalPrice}
      invoice_date={invoice_date}
      due_date={due_date}
      name={name}
      notes = {notes}
    />
  );

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Invoice" />
        <ClientModal open={open} setOpen={setOpen} handleSelect={handleSelect} />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Edit Invoice
                </h3>
              </div>
              {
                previewMode ? invoicePreview : (

                  <div className="p-7">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="invoice_number"
                          >
                            Invoice number
                          </label>
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <EmailSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="invoice_number"
                              id="invoice_number"
                              value={invoice_number}
                              onChange={e => { e.preventDefault(); setInvoiceNumber(e.target.value) }}
                              placeholder="Write invoice number here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="invoice_number"
                          >
                            {errors.invoice_number}
                          </label>
                        </div>
                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="title"
                          >
                            Title
                          </label>
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <TitleSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="title"
                              id="title"
                              value={name}
                              onChange={e => { e.preventDefault(); setName(e.target.value) }}
                              placeholder="Write title here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="name"
                          >
                            {errors.name}
                          </label>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="company_name"
                          >
                            From
                          </label>
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <HumanSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="company_name"
                              id="company_name"
                              value={company_name}
                              onChange={e => { e.preventDefault(); setCompanyName(e.target.value) }}
                              placeholder="Write company name here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="company_name"
                          >
                            {errors.company_name}
                          </label>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white flex"
                            htmlFor="client_name"
                          >
                            To
                            <span
                              style={{
                                marginLeft: 'auto',
                                marginRight: '5px',
                                color: 'rgb(60, 80, 224)',
                                cursor: 'pointer'
                              }}
                              className='rounded border px-3'
                              onClick={e => { e.preventDefault(); setOpen(true) }}
                            >
                              From here
                            </span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <HumanSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="client_name"
                              id="client_name"
                              value={client_name}
                              onChange={e => { e.preventDefault(); setClientName(e.target.value) }}
                              placeholder="Write client name here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="client_name"
                          >
                            {errors.client_name}
                          </label>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <EmailSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="company_email"
                              id="company_email"
                              value={company_email}
                              onChange={e => { e.preventDefault(); setCompanyEmail(e.target.value) }}
                              placeholder="Write company email here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="company_email"
                          >
                            {errors.company_email}
                          </label>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <EmailSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="client_email"
                              id="client_email"
                              value={client_email}
                              onChange={e => { e.preventDefault(); setClientEmail(e.target.value) }}
                              placeholder="Write client email here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="client_email"
                          >
                            {errors.client_email}
                          </label>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <AddressSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="company_address"
                              id="company_address"
                              value={company_address}
                              onChange={e => { e.preventDefault(); setCompanyAddress(e.target.value) }}
                              placeholder="Write company address here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="company_address"
                          >
                            {errors.company_address}
                          </label>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <AddressSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="client_address"
                              id="client_address"
                              value={client_address}
                              onChange={e => { e.preventDefault(); setClientAddress(e.target.value) }}
                              placeholder="Write client address here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="client_address"
                          >
                            {errors.client_address}
                          </label>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <PhoneSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="company_phone"
                              id="company_phone"
                              value={company_phone}
                              onChange={e => { e.preventDefault(); setCompanyPhone(e.target.value) }}
                              placeholder="Write company phone here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="company_phone"
                          >
                            {errors.company_phone}
                          </label>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <PhoneSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="client_phone"
                              id="client_phone"
                              value={client_phone}
                              onChange={e => { e.preventDefault(); setClientPhone(e.target.value) }}
                              placeholder="Write client phone here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="client_phone"
                          >
                            {errors.client_phone}
                          </label>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="invoice_date"
                          >
                            Invoice date
                          </label>
                          <div className="relative">
                            {/* <span className="absolute left-4.5 top-4">
                              <CalendarSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="invoice_date"
                              id="invoice_date"
                              value={invoice_date}
                              onChange={e => { e.preventDefault(); setInvoiceData(e.target.value) }}
                              placeholder="2023-07-01"
                            /> */}
                            <input
                              type="date"
                              className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              value={invoice_date}
                              onChange={e => { e.preventDefault(); setInvoiceData(e.target.value) }}
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="invoice_date"
                          >
                            {errors.invoice_date}
                          </label>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="due_date"
                          >
                            Due date
                          </label>
                          <div className="relative">
                            {/* <span className="absolute left-4.5 top-4">
                              <CalendarSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="due_date"
                              id="due_date"
                              value={due_date}
                              onChange={e => { e.preventDefault(); setDueDate(e.target.value) }}
                              placeholder="2023-07-31"
                            /> */}
                            <input
                              type="date"
                              className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              value={due_date}
                              onChange={e => { e.preventDefault(); setDueDate(e.target.value) }}
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="due_date"
                          >
                            {errors.due_date}
                          </label>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="Username"
                          >
                            Tax type
                          </label>
                          <div className="relative z-20 bg-white dark:bg-form-input">
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                                    fill="#637381"
                                  ></path>
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                                    fill="#637381"
                                  ></path>
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                                    fill="#637381"
                                  ></path>
                                </g>
                              </svg>
                            </span>
                            <select
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                              value={tax_type_id}
                              onChange={e => { e.preventDefault(); setTaxType(e.target.value) }}
                            >
                              <option value={0}>None</option>
                              <option value={1}>Per Item</option>
                              <option value={2}>On Total</option>
                            </select>
                            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                    fill="#637381"
                                  ></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                        </div>
                        <div className="w-full sm:w-1/2">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="Username"
                          >
                            Discount type
                          </label>
                          <div className="relative z-20 bg-white dark:bg-form-input">
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                                    fill="#637381"
                                  ></path>
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                                    fill="#637381"
                                  ></path>
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                                    fill="#637381"
                                  ></path>
                                </g>
                              </svg>
                            </span>
                            <select
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                              value={discount_type_id}
                              onChange={e => { e.preventDefault(); setDiscountType(e.target.value) }}
                            >
                              <option value={0}>None</option>
                              <option value={1}>Percent</option>
                              <option value={2}>Flat Amount</option>
                            </select>
                            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                    fill="#637381"
                                  ></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <PercentSVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="tax_value"
                              id="tax_value"
                              value={tax_value}
                              onChange={e => { e.preventDefault(); setTaxValue(e.target.value) }}
                              placeholder="Write tax rate here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="company_phone"
                          >
                            {isEmpty(errors) || isEmpty(errors.tax_value) ? '' : errors.tax_value}
                          </label>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <MoneySVG />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="discount_value"
                              id="discount_value"
                              value={discount_value}
                              onChange={e => { e.preventDefault(); setDiscountValue(e.target.value) }}
                              placeholder="Write discount value here"
                            />
                          </div>
                          <label
                            className="mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="client_phone"
                          >
                            {isEmpty(errors) || isEmpty(errors.discount_value) ? '' : errors.discount_value}
                          </label>
                        </div>
                      </div>

                      <InvoiceContent data={items} setData={setInvoiceList} errors={errors.itemErrors} />

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/3"></div>
                        <div className="w-full sm:w-1/3">
                          <div className="relative">
                            <button
                              className="w-full flex justify-center rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                              onClick={handleAddRow}
                            >
                              + Add Row
                            </button>
                          </div>
                        </div>
                        <div className="w-full sm:w-1/3"></div>
                      </div>

                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="Username"
                        >
                          Notes
                        </label>
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
                            value={notes}
                            onChange={e => { e.preventDefault(); setNotes(e.target.value) }}
                            rows={6}
                            placeholder="Write client email here"
                          ></textarea>
                        </div>
                        <label
                          className="mb-0 block text-sm font-medium mt-2 text-danger"
                          htmlFor="notes"
                        >
                          {errors.notes}
                        </label>
                      </div>
                    </form>
                  </div>
                )
              }
            </div >
          </div >
          <div className="col-span-5 xl:col-span-1">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Action
                </h3>
              </div>
              <div className="p-7">
                <div className="mb-5.5">
                  <button
                    className="w-full flex justify-center rounded bg-success py-2 px-6 font-medium text-gray hover:shadow-1"
                    onClick={(e) => { e.preventDefault(); setPreviewMode(!previewMode) }}
                  >
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                </div>
                <div className="mb-5.5">
                  <button
                    className="w-full flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
                <div className="mb-5.5">
                  <button
                    className="w-full flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    </>
  );
};

export default InvoiceEdit;