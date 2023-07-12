import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumb from '../components/Breadcrumb.js';
import userInit from '../images/user/user-07.png';
import { isEmpty, serverURL } from '../config/index.js';
import { newUser } from '../store/slice/usersSlice.js';
import { AddressSVG, CheckSVG, ContentSVG, EmailSVG, NumberSVG, PhoneSVG, TitleSVG, WebSVG } from '../components/SVG.js';
import { ToastContainer, toast } from 'react-toastify';
import { getSetting, setSetting } from '../store/slice/settingSlice';
import 'react-toastify/dist/ReactToastify.css'

const Setting = () => {

  const fileUpload = useRef(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const [business_name, setBusinessName] = useState('');
  const [company_mail, setCompanyMail] = useState('');
  const [company_phone, setCompanyPhone] = useState('');
  const [company_address, setCompanyAddress] = useState('');
  const [bank_name, setBankName] = useState('');
  const [account_number, setAccountNumber] = useState('');
  const [bank_code, setBankCode] = useState('');
  const [bank_country, setBankCountry] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const settingData = useSelector((state) => state.setting.data);

  useEffect(() => {
    if(!isEmpty(settingData)) {
      console.log(settingData);
      setBusinessName(settingData.business_name);
      setCompanyMail(settingData.company_mail);
      setCompanyPhone(settingData.company_phone);
      setCompanyAddress(settingData.company_address);
      setBankName(settingData.bank_name);
      setAccountNumber(settingData.account_number);
      setBankCode(settingData.bank_code);
      setBankCountry(settingData.bank_country);
      setImgPreview(serverURL + settingData.site_logo);
    }
  }, [settingData])

  const handleUpload = (event: any) => {
    event.preventDefault();
    fileUpload.current.click();
  }

  const handleImage = (event: any) => {
    event.preventDefault();
    if (isEmpty(event.target) || isEmpty(event.target.files))
      return;
    const file = event.target.files[0];
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData();
    if (imgFile !== null) formData.append('logo', imgFile);
    formData.append('business_name', business_name);
    formData.append('company_mail', company_mail);
    formData.append('company_address', company_address);
    formData.append('company_phone', company_phone);
    formData.append('bank_name', bank_name);
    formData.append('account_number', account_number);
    formData.append('bank_code', bank_code);
    formData.append('bank_country', bank_country);

    // useDispatch()(newUser(formData));
    dispatch(setSetting(formData));
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Setting / Company" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Setting
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="title"
                    >
                      Company setting
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TitleSVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="business_name"
                        id="business_name"
                        value={business_name}
                        onChange={e => { e.preventDefault(); setBusinessName(e.target.value) }}
                        placeholder="Write company name here"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <EmailSVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="company_mail"
                        id="company_mail"
                        value={company_mail}
                        onChange={e => { e.preventDefault(); setCompanyMail(e.target.value) }}
                        placeholder="Write company email here"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
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
                  </div>

                  <div className="mb-5.5">
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
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="title"
                    >
                      Bank setting
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TitleSVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="bank_name"
                        id="bank_name"
                        value={bank_name}
                        onChange={e => { e.preventDefault(); setBankName(e.target.value) }}
                        placeholder="Write bank name here"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <NumberSVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="account_number"
                        id="account_number"
                        value={account_number}
                        onChange={e => { e.preventDefault(); setAccountNumber(e.target.value) }}
                        placeholder="Write account number here"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <CheckSVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="bank_code"
                        id="bank_code"
                        value={bank_code}
                        onChange={e => { e.preventDefault(); setBankCode(e.target.value) }}
                        placeholder="Write swift code here"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <WebSVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="bank_country"
                        id="bank_country"
                        value={bank_country}
                        onChange={e => { e.preventDefault(); setBankCountry(e.target.value) }}
                        placeholder="Write country here"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Photo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    {/* <div className="rounded-full"> */}
                      <img src={imgPreview} alt="Logo Image" style={{maxWidth: '100%'}} />
                    {/* </div> */}
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileUpload}
                      onChange={handleImage}
                      // className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      style={{ display: 'none' }}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3" onClick={handleUpload}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  {/* <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                      type="submit"
                    >
                      Save
                    </button>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div >
      </div >
    </>
  );
};

// export default UserEdit

export default Setting;