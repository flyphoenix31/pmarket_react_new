import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';

import { useNavigate, useParams } from 'react-router-dom';
import { isEmpty, serverURL, toastr } from '../config/index.js';
import { EmailSVG, PlaneSVG } from '../components/SVG.js';
import ComposeModal from './ComposeModal.js';
import axios from 'axios';


const Email = () => {
  const dispatch = useDispatch();
  // const preemailList = useSelector((state) => state.email.emailList);

  let { roles } = useParams();
  let user_email = window.localStorage.getItem('user_email');
  console.log("=========user_email:", user_email);
  const [is_compose, setCompose] = useState(false);
  const [onlyEmailList, setOnlyEmailList] = useState([]);
  const [emailList, setList] = useState([]);

  const getEmailList = async () => {
    try {
      console.log("----------------------")
      const res = await axios.get(serverURL + '/api/email/list');
      const data = res.data;
      console.log("-----------------data", data);
      if (data.status == 0) {
        setList(data.list);
      }
    }
    catch (error) {
      // navigate('/member/auth/signin');
    }
  }
  useEffect(() => {
    getEmailList();
  }, [])

  useEffect(() => {
  }, [])

  const tableHeaderList = [
    'Id',
    'Sender',
    'Receiver',
    'Content',
    'Date',
    // 'Status',
    // 'Action'
  ];
  const stableHeaderList = [
    'Id',
    'Receiver',
    'Content',
    'Date',
    // 'Status',
    // 'Action'
  ];
  const rtableHeaderList = [
    'Id',
    'Sender',
    'Content',
    'Date',
    // 'Status',
    // 'Action'
  ];
  let displayList = [];
  let temp_emailList = [];
  let temp = [];
  let tempHeader: any[] = [];
  useEffect(() => {

  })
  if (roles == "all") {
    displayList = emailList;
    tempHeader = tableHeaderList;
  }

  if (roles == 'send') {
    emailList.forEach(element => {
      if (element.sender_email == user_email) {
        const index = temp_emailList.findIndex(item => item.receiver_email == element.receiver_email)
        if (index < 0) {
          temp_emailList.push(element);
          temp.push(element.receiver_email);
        }
        displayList.push(element);
      }

    });
    tempHeader = stableHeaderList;
  }

  if (roles == 'receive') {
    emailList.forEach(element => {
      if (element.receiver_email == user_email) {
        const index = temp_emailList.findIndex(item => item.sender_email == element.sender_email)
        if (index < 0) {
          temp_emailList.push(element);
          temp.push(element.sender_email);
        }
        displayList.push(element);
      }
    });
    tempHeader = rtableHeaderList;
  }
  // console.log("temp_semailList", temp_semailList);
  // console.log("temp_remailList", temp_remailList);
  // console.log("======displayList", displayList);

  useState(() => {
    setOnlyEmailList(temp_emailList);
  })

  const navigate = useNavigate();

  const handleAddNew = (event: any) => {
    event.preventDefault();
    navigate('/member/email/add');
  }

  const handleView = (id) => {
    navigate(`/member/email/edit/${id}`);
  }

  const getEmailStatus = (status) => {
    switch (status) {
      case 0:
        return { className: 'text-success bg-success', data: 'Not Read' };
      case 1:
        return { className: 'text-warning bg-warning', data: 'Read' };
      default:
        return { className: '', data: '' }
    }
  }

  return (
    <>
      <ComposeModal onlyEmailList={temp} is_compose={is_compose} setCompose={setCompose} curPage={roles} getEmailList={getEmailList}/>
      {roles == "all" ? <Breadcrumb pageName="Emails / All" /> : ''}
      {roles == "send" ? <Breadcrumb pageName="Emails / Send" /> : ''}
      {roles == "receive" ? <Breadcrumb pageName="Emails / Receive" /> : ''}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap" style={{ padding: '10px 0px 30px 0px' }}>
          <div className="flex flex-wrap gap-3 sm:gap-5">
            {roles == "all" ?
              <h4 className="text-xl font-semibold text-black dark:text-white">
                All list
              </h4> : ''}
            {roles == "send" ? <h4 className="text-xl font-semibold text-black dark:text-white">
              Send list
            </h4>
              : ''}
            {roles == "receive" ?
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Receive list
              </h4> : ''}
          </div>
          <div className="flex justify-end">
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
              {roles == "send" ?
                <button className="btn-peffect flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" onClick={e => { e.preventDefault(); setCompose(true); }}>
                  <PlaneSVG />
                  <span className='pl-2'>Compose</span>
                </button>
                : ""
              }
              {/* {roles == "receive" ?
                <button className="btn-peffect flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" onClick={e => { e.preventDefault(); setCompose(true); }}>
                    <PlaneSVG />
                    <span className='pl-2'>Reply</span>
                </button>
              :""
              } */}
            </div>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {
                  tempHeader.map((header, headerIndex) => (
                    <th className="py-4 px-4 font-medium text-black dark:text-white" key={headerIndex}>
                      {header}
                    </th>
                  ))
                }

              </tr>
            </thead>
            {roles == "all" ?
              <tbody>
                {
                  displayList.map((memail, emailIndex) => (
                    <tr key={emailIndex}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.id}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-3 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.sender_email}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-3 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.receiver_email}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.content}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{moment(memail.created_at).format('YYYY:MM:DD:hh:mm:ss')}</p>
                      </td>
                    </tr>
                  ))
                }
                {
                  !isEmpty(emailList) ? '' : (
                    <tr>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center" colSpan={7}>
                        No data yet.
                      </td>
                    </tr>
                  )
                }
              </tbody>
              : ""
            }
            {roles == "send" ?
              <tbody>
                {
                  displayList.map((memail, emailIndex) => (
                    <tr key={emailIndex}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.id}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-3 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.receiver_email}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.content}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{moment(memail.created_at).format('YYYY:MM:DD:hh:mm:ss')}</p>
                      </td>
                    </tr>
                  ))
                }
                {
                  !isEmpty(emailList) ? '' : (
                    <tr>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center" colSpan={7}>
                        No data yet.
                      </td>
                    </tr>
                  )
                }
              </tbody>
              : ""
            }
            {roles == "receive" ?
              <tbody>
                {
                  displayList.map((memail, emailIndex) => (
                    <tr key={emailIndex}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.id}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-3 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.sender_email}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{memail.content}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{moment(memail.created_at).format('YYYY:MM:DD:hh:mm:ss')}</p>
                      </td>
                    </tr>
                  ))
                }
                {
                  !isEmpty(emailList) ? '' : (
                    <tr>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center" colSpan={7}>
                        No data yet.
                      </td>
                    </tr>
                  )
                }
              </tbody>
              : ""
            }
          </table>
        </div>
      </div>
    </>
  );
};

export default Email;