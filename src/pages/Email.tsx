import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate, useParams } from 'react-router-dom';
import { setEmailList } from '../store/slice/emailSlice.js';
import { isEmpty } from '../config/index.js';

const Email = () => {
  const dispatch = useDispatch();
  const emailList = useSelector((state) => state.email.emailList);
  console.log("-------------------emaliList", emailList);
  let { roles } = useParams();
  let user_id = localStorage.getItem('user_id');
  console.log("=========id:", roles);
  console.log("=========id:", user_id);
  
  let displayList = [];
  if(roles == "all"){
    displayList = emailList;
  }
  if(roles == 'send'){
    emailList.forEach(element => {
      if(element.from_user == user_id){
        displayList.push(element);
      }
    });
  }
  if(roles == 'receive'){
    emailList.forEach(element => {
      if(element.to_user == user_id){
        displayList.push(element);
      }
    });
  }
  useEffect(() => {
    dispatch(setEmailList());
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
      {roles == "all" ? <Breadcrumb pageName="All Emails" /> : '' }
      {roles == "Send" ? <Breadcrumb pageName="Sende Emails" /> : '' }
      {roles == "Receive" ? <Breadcrumb pageName="Receive Emails" /> : '' }
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap" style={{ padding: '10px 0px 30px 0px' }}>
          <div className="flex flex-wrap gap-3 sm:gap-5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              History list
            </h4>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {
                  tableHeaderList.map((header, headerIndex) => (
                    <th className="py-4 px-4 font-medium text-black dark:text-white" key={headerIndex}>
                      {header}
                    </th>
                  ))
                }
               
              </tr>
            </thead>
            <tbody>
              {
                displayList.map((memail, emailIndex) => (
                  <tr key={emailIndex}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{memail.id}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{memail.from_user_email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{memail.to_user_email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{memail.message}</p>
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
          </table>
        </div>
      </div>
    </>
  );
};

export default Email;