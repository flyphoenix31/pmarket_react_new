import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { setHistoryList, setRoleList, setCategoryList } from '../store/slice/historySlice.js';
import { isEmpty } from '../config/index.js';

const History = () => {

  const dispatch = useDispatch();
  const historyList = useSelector((state) => state.history.historyList);
  const roleList = useSelector((state) => state.history.roleList);

  useEffect(() => {
    dispatch(setHistoryList());
    dispatch(setRoleList());
    dispatch(setCategoryList());
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
    navigate('/member/history/add');
  }

  const handleView = (id) => {
    navigate(`/member/history/edit/${id}`);
  }

  const getHistoryStatus = (status) => {
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
      <Breadcrumb pageName="Chat History" />

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
                historyList.map((history, historyIndex) => (
                  <tr key={historyIndex}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{history.id}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{history.from_user_email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{history.to_user_email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{history.message}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{moment(history.created_at).format('YYYY:MM:DD:hh:mm:ss')}</p>
                    </td>
                  </tr>
                ))
              }
              {
                !isEmpty(historyList) ? '' : (
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

export default History;