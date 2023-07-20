import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumb from '../components/Breadcrumb.js';
import userInit from '../images/user/user-07.png';
import { isEmpty } from '../config/index.js';
import { removeStrAfteratSymbol } from '../utils/index';
import { newUser, setRedirect } from '../store/slice/usersSlice.js';
import { ArrowDownSVG, ContentSVG, EmailSVG, PhoneSVG, UserSVG, WebSVG } from '../components/SVG.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import $ from 'jquery';

  
const UserAdd = () => {

  const fileUpload = useRef(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preemail, setEmail] = useState('');
  const [lastemail, setLastEmail] = useState('@blender.com');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(0);
  const [bio, setBio] = useState('');
  const [role_id, setRole] = useState(2);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roleList = useSelector((state) => state.users.roleList);
  const errors = useSelector((state) => state.users.errors);
  const redirect = useSelector((state) => state.users.redirect);
  console.log("roleList", roleList);

  useEffect(() => {
    let tempstr = removeStrAfteratSymbol(preemail);
    setEmail(tempstr);
  })
  useEffect(() => {
    if (redirect) {
      dispatch(setRedirect(false));
      navigate('/member/users');
    }
  })
  useEffect(() => {
    if (isEmpty(roleList))
      navigate('/member/users');
  }, [])

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
    console.log("email",preemail);
    console.log("lastemail",lastemail);
    let temp_email = preemail + lastemail;
    console.log("=====temp_email:", temp_email);
    // return
    const formData = new FormData();
    if (imgFile !== null) formData.append('avatar', imgFile);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', temp_email);
    formData.append('password', password);
    formData.append('gender', gender);
    formData.append('bio', bio);
    formData.append('role_id', role_id);
    formData.append('skills', []);

    dispatch(newUser(formData));
    // navigate('/member/users');
  }
  console.log("------------errors", errors);
  const handleClose = (event: any) => {
    event.preventDefault();
    navigate('/member/users');
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Users" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  New User
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
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
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={name}
                          onChange={e => { e.preventDefault(); setName(e.target.value) }}
                          placeholder="Write full name here"
                        />
                      </div>
                      <label
                        className="mb-0 block text-sm font-medium mt-2 text-danger"
                        htmlFor="name"
                      >
                        {errors.name}
                      </label>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <PhoneSVG />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={phone}
                          onChange={e => { e.preventDefault(); setPhone(e.target.value) }}
                          placeholder="Write your phone number"
                        />
                      </div>
                      <label
                        className="mb-0 block text-sm font-medium mt-2 text-danger"
                        htmlFor="phone"
                      >
                        {errors.phone}
                      </label>
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-3/5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <EmailSVG />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="emailAddress"
                          id="emailAddress"
                          value={preemail}
                          onChange={e => { e.preventDefault(); setEmail(e.target.value) }}
                          placeholder="Write email here"
                        />
                      </div>
                      <label
                        className="mb-0 block text-sm font-medium mt-2 text-danger"
                        htmlFor="email"
                      >
                        {errors.email}
                      </label>
                    </div>
                    <div className="w-full sm:w-2/5">
                      <label
                        className="mb-3 block text-sm font-medium text-white dark:text-white"
                        htmlFor="Username"
                      >
                        Email Address
                      </label>
                      <div className="relative z-20 bg-white dark:bg-form-input">
                        {/* <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                          <WebSVG />
                        </span> */}
                        <select
                          className="w-full rounded border border-stroke bg-gray py-3 pl-6 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                          value={lastemail}
                          onChange={e => { e.preventDefault(); setLastEmail(e.target.value) }}
                          disabled
                        >
                          <option value={"@blender.com"}>@blender.com</option>
                          <option value={"@gmail.com"}>@gmail.com</option>
                          <option value={"@outlook.com"}>@outlook.com</option>
                        </select>
                        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                          <ArrowDownSVG />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d="M20.959 1.209c-5.405 0.007-9.784 4.386-9.791 9.79v0.001c0 0.247 0.023 0.488 0.041 0.73l-9.739 9.739c-0.136 0.136-0.22 0.324-0.22 0.531 0 0 0 0 0 0v0 8c0 0.414 0.336 0.75 0.75 0.75h8c0.414-0 0.75-0.336 0.75-0.75v0-3.25h3.25c0.414-0 0.75-0.336 0.75-0.75v0-3.25h3.25c0 0 0.001 0 0.002 0 0.207 0 0.394-0.084 0.53-0.219l1.774-1.774c0.217 0.014 0.433 0.034 0.654 0.034 5.399-0.011 9.771-4.391 9.771-9.791s-4.372-9.78-9.77-9.791h-0.001zM20.959 19.291c-0.309-0-0.614-0.017-0.915-0.048l0.038 0.003c-0.018-0.001-0.032 0.006-0.050 0.005-0.024-0.001-0.042 0.006-0.066 0.007-0.183 0.007-0.348 0.080-0.473 0.196l0-0-0.017 0.007-1.787 1.789h-3.689c-0.414 0-0.75 0.336-0.75 0.75v0 3.25h-3.25c-0.414 0-0.75 0.336-0.75 0.75v0 3.25h-6.5v-6.939l9.757-9.757 0.010-0.023c0.114-0.123 0.186-0.286 0.194-0.466l0-0.001c0.001-0.024 0.006-0.042 0.006-0.066-0.001-0.020 0.007-0.037 0.005-0.057-0.034-0.282-0.054-0.609-0.054-0.941 0-4.579 3.712-8.291 8.291-8.291s8.291 3.712 8.291 8.291c0 4.579-3.712 8.291-8.291 8.291h-0zM23 7.25c-0.966 0-1.75 0.784-1.75 1.75s0.784 1.75 1.75 1.75c0.966 0 1.75-0.784 1.75-1.75v0c-0.001-0.966-0.784-1.749-1.75-1.75h-0zM22.75 9c0-0.138 0.112-0.25 0.25-0.25s0.25 0.112 0.25 0.25v0c0 0.275-0.5 0.275-0.5 0z"
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="Password"
                        id="Password"
                        value={password}
                        onChange={e => { e.preventDefault(); setPassword(e.target.value) }}
                        placeholder="Write password here"
                        autoComplete='false'
                      />
                    </div>
                    <label
                      className="mb-0 block text-sm font-medium mt-2 text-danger"
                      htmlFor="password"
                    >
                      {errors.password}
                    </label>
                  </div>
                  <div className='mb-5.5'>
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Select Gender
                    </label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                        <WebSVG />
                      </span>
                      <select
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                        value={gender}
                        onChange={e => { e.preventDefault(); setGender(e.target.value) }}
                      >
                        <option value={0}>Male</option>
                        <option value={1}>Female</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                        <ArrowDownSVG />
                      </span>
                    </div>
                  </div>
                  <div className='mb-5.5'>
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Select Position
                    </label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <UserSVG />
                      <select
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                        value={role_id}
                        onChange={e => { e.preventDefault(); setRole(e.target.value) }}
                      >
                        {
                          roleList.map((role, roleIndex) => (
                            <option value={role.id}>{role.name}</option>
                          ))
                        }
                      </select>
                      <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                        <ArrowDownSVG />
                      </span>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      BIO
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <ContentSVG />
                      </span>

                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="bio"
                        id="bio"
                        value={bio}
                        onChange={e => { e.preventDefault(); setBio(e.target.value) }}
                        rows={6}
                        placeholder="Write bio here"
                      ></textarea>
                    </div>
                    <label
                      className="mb-0 block text-sm font-medium mt-2 text-danger"
                      htmlFor="bio"
                    >
                      {errors.bio}
                    </label>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button
                      className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
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
                    <div className="h-14 w-14 rounded-full">
                      <img src={isEmpty(imgPreview) ? userInit : imgPreview} alt="User" style={{ borderRadius: '50%', width: '56px', height: '56px' }} />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit photo
                      </span>
                    </div>
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

export default UserAdd;