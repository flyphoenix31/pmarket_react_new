import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumb from '../components/Breadcrumb.js';
import { isEmpty } from '../config/index.js';
import moment from 'moment';
import { newQuotation, setRedirect } from '../store/slice/quotationSlice.js';
import {
  CheckSVG,
  ContentSVG,
  MoneySVG,
  NumberSVG,
  TitleSVG,
  HumanSVG,
  EmailSVG,
  AddressSVG,
  PhoneSVG
} from '../components/SVG.js';
import ClientModal from './ClientModal.js';
import QuotationPreview from './QuotationPreview.js';

const QuotationContent = ({ data, setData, errors }) => {
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
                  <ContentSVG />
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
                htmlFor="quotation_number"
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
                  <MoneySVG />
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
                htmlFor="quotation_number"
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
                  <CheckSVG />
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
            </div>
            <div className="w-full sm:w-1/12">
              {
                itemIndex > 0 ? '' : (
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Action"
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

const QuotationAdd = () => {

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  // const [company_name, setCompanyName] = useState('');
  // const [company_email, setCompanyEmail] = useState('');
  // const [company_phone, setCompanyPhone] = useState('');
  // const [company_address, setCompanyAddress] = useState('');
  const [client_name, setClientName] = useState('');
  const [client_email, setClientEmail] = useState('');
  const [client_phone, setClientPhone] = useState('');
  const [client_address, setClientAddress] = useState('');

  const [previewMode, setPreviewMode] = useState(false);
  const [open, setOpen] = useState(false);

  const errors = useSelector((state) => state.quotation.errors);
  const redirect = useSelector((state) => state.quotation.redirect);
  const settingData = useSelector((state) => state.setting.data);

  const company_name = settingData.business_name;
  const company_email = settingData.company_mail;
  const company_phone = settingData.company_phone;
  const company_address = settingData.company_address;

  const init_quotation = {
    description: '',
    unit_price: '',
    quantity: '',
    item_notes: ''
  }

  const [items, setQuotationList] = useState([init_quotation]);
  const titleList = ['Mr', 'Mrs', 'Ms', 'Dr'];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirect) {
      dispatch(setRedirect(false));
      navigate('/member/quotation');
    }
  }, [redirect])

  const handleSubmit = (event: any) => {

    event.preventDefault();

    const data = {
      name,
      notes,
      company_name,
      company_email,
      company_phone,
      company_address,
      client_name,
      client_email,
      client_phone,
      client_address,
      items,
      currency_id: 1
    }

    dispatch(newQuotation(data));
  }

  const handleClose = (event: any) => {
    event.preventDefault();
    navigate('/member/quotation');
  }

  const handleAddRow = (event: any) => {
    event.preventDefault();
    setQuotationList([...items, init_quotation])
  }

  const handleSelect = (user) => {
    setClientName((isEmpty(user.title) ? '' : (titleList[user.title] + '. ')) + user.name)
    setClientEmail(user.email)
    setClientPhone(user.phone)
    setClientAddress(user.address)
  }

  const totalPrice = items.reduce((value, item) => value + (item.unit_price * item.quantity), 0);

  const quotationPreview = (
    <QuotationPreview
      company_name={company_name}
      company_email={company_email}
      company_phone={company_phone}
      company_address={company_address}
      client_name={client_name}
      client_email={client_email}
      client_phone={client_phone}
      client_address={client_address}
      items={items}
      totalPrice={totalPrice}
      name={name}
      notes={notes}
      settingData={settingData}
    />
  );

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Quotation" />
        <ClientModal open={open} setOpen={setOpen} handleSelect={handleSelect} />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  New Quotation
                </h3>
              </div>
              {
                previewMode ? quotationPreview : (
                  <div className="p-7">
                    <form onSubmit={e => { e.preventDefault() }}>
                      <div className="mb-5.5">
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
                              // onChange={e => { e.preventDefault(); setCompanyName(e.target.value) }}
                              readOnly
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
                              readOnly
                              // onChange={e => { e.preventDefault(); setCompanyEmail(e.target.value) }}
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
                              readOnly
                              // onChange={e => { e.preventDefault(); setCompanyAddress(e.target.value) }}
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
                              readOnly
                              // onChange={e => { e.preventDefault(); setCompanyPhone(e.target.value) }}
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

                      <QuotationContent data={items} setData={setQuotationList} errors={errors.itemErrors} />

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

export default QuotationAdd;