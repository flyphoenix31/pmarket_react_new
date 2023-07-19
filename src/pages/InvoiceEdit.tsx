import { useEffect, useRef, useState } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Breadcrumb from '../components/Breadcrumb.js';
import { isEmpty } from '../config/index.js';
import { updateInvoice, setRedirect, findOneInvoice } from '../store/slice/invoiceSlice.js';
import { HumanSVG, EmailSVG, AddressSVG, PhoneSVG, CalendarSVG, MoneySVG, PercentSVG, TitleSVG } from '../components/SVG.js';
import ClientModal from './ClientModal.js';
import InvoicePreview from './InvoicePreview.js';
import { getSetting } from '../store/slice/settingSlice';

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
  const [invoice_img, setInvoiceImg] = useState(null);
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
  const settingData = useSelector((state) => state.setting.data);
  let { id } = useParams();

  useEffect(() => {
    if (isEmpty(invoiceList))
      navigate('/member/invoice');
    dispatch(findOneInvoice(id));
    dispatch(getSetting());
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
      setInvoiceImg(currentInvoice.invoice_img)
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
      items,
      invoice_img,
    }

    dispatch(updateInvoice(data));
    navigate('/member/invoice');
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
      settingData = {settingData}
      invoice_img = {invoice_img}
    />
  );

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Invoice Edit" />
        <ClientModal open={open} setOpen={setOpen} handleSelect={handleSelect} />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Edit Invoice
                </h3>
              </div> */}
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
                    className="w-full btn-peffect justify-center rounded bg-success py-2 px-6 font-medium text-gray hover:shadow-1"
                    onClick={(e) => { e.preventDefault(); setPreviewMode(!previewMode) }}
                  >
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                </div>
                <div className="mb-5.5">
                  <button
                    className="w-full btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
                <div className="mb-5.5">
                  <button
                    className="w-full btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
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