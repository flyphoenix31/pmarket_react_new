import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumb from '../components/Breadcrumb';
import { isEmpty, serverURL } from '../config';
import { updateEmailUser } from '../store/slice/usersSlice.js';
import { ContentSVG, EmailSVG, KeySVG, MoneySVG, PlaneSVG } from '../components/SVG.js';

const UserEmailEdit = () => {
  let { id } = useParams();
  ///the pmarket.com edit
  const [the_email, setTheEmail] = useState('');
  const [the_password, setThePassword] = useState('');
  const [the_client_token, setClientToken] = useState('');
  const [the_session, setTheSession] = useState('');
  const [the_cookie, setTheCookie] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.users.disUserList);

  useEffect(() => {
    if (!isEmpty(userList)) {
      const editIndex = userList.findIndex((item: { id: { toString: () => string; }; }) => item.id.toString() === id);
      if (editIndex >= 0) {
        let currentUser = userList[editIndex];
        setTheEmail(currentUser.the_email);
        setThePassword(currentUser.the_password);
        setClientToken(currentUser.the_client_token);
        setTheSession(currentUser.the_session);
        let temp = currentUser.the_cookie;
        if(!isEmpty(temp)){
          while(temp.includes("&quot;")){
            temp = temp.replace(/&quot;/g, "\"")
          }
          setTheCookie(temp);
        }
      }
    }
  }, [userList])



  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('the_email', the_email);
    formData.append('the_password', the_password);
    formData.append('the_client_token', the_client_token);
    formData.append('the_session', the_session);
    formData.append('the_cookie', the_cookie);
    dispatch(updateEmailUser(formData));
    navigate('/member/users');
  }

  const handleClose = (event: any) => {
    event.preventDefault();
    navigate('/member/users');
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="User Email Edit" />
        <div className="col-span-5 xl:col-span-3 mt-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Pmarket Email Information
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
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <EmailSVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="email"
                        id="email"
                        value={the_email}
                        onChange={e => { e.preventDefault(); setTheEmail(e.target.value) }}
                        placeholder="Write email address here"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <KeySVG />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="password"
                        id="password"
                        value={the_password}
                        onChange={e => { e.preventDefault(); setThePassword(e.target.value) }}
                        placeholder="Write password here"
                      />
                    </div>

                  </div>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="clienttoken"
                  >
                    Client Token
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <ContentSVG />
                    </span>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="clienttoken"
                      name="clienttoken"
                      id="clienttoken"
                      value={the_client_token}
                      onChange={e => { e.preventDefault(); setClientToken(e.target.value) }}
                      placeholder="Write client token here"
                      autoComplete='false'
                    />
                  </div>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="composeurl"
                  >
                    Session
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <ContentSVG />
                    </span>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="composeurl"
                      name="composeurl"
                      id="composeurl"
                      value={the_session}
                      onChange={e => { e.preventDefault(); setTheSession(e.target.value) }}
                      placeholder="Write session here"
                      autoComplete='false'
                    />
                  </div>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="cookie"
                  >
                    Cookie
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <MoneySVG />
                    </span>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="cookie"
                      name="cookie"
                      id="cookie"
                      value={the_cookie}
                      onChange={e => { e.preventDefault(); setTheCookie(e.target.value) }}
                      placeholder="Write cookie here"
                      autoComplete='false'
                    />
                  </div>
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
      </div >
    </>
  );
};

// export default UserEdit

export default UserEmailEdit;