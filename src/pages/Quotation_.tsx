import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { setQuotationList } from '../store/slice/quotationSlice.js';
import { isEmpty } from '../config/index.js';

const Quotation = () => {

  const dispatch = useDispatch();
  const quotationList = useSelector((state: any) => state.quotation.quotationList);

  useEffect(() => {
    dispatch(setQuotationList());
  }, [])

  const tableHeaderList = [
    'Name',
    'Email',
    'Invoice',
    'Date',
    'Viewed',
    'Created By'
  ];

  const navigate = useNavigate();

  const handleAddNew = (event: any) => {
    event.preventDefault();
    navigate('/member/quotation/add');
  }

  const getQuotationStatus = (status:any) => {
    if (isEmpty(status) || !status)
      return { className: 'text-danger bg-danger', data: 'Unviewed' };
    else
      return { className: 'text-success bg-success', data: 'Viewed: ' + status };
  }

  return (
    <>
      <Breadcrumb pageName="Quotation" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap" style={{ padding: '10px 0px 30px 0px' }}>
          <div className="flex flex-wrap gap-3 sm:gap-5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Quotation list
            </h4>
          </div>
          <div className="flex justify-end">
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
              <button
                className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark"
                onClick={handleAddNew}
              >
                + Add New
              </button>
            </div>
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
                quotationList.map((quotation: any, quotationIndex: any) => {
                  return (
                    <tr key={quotationIndex}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{quotation.to_name}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{quotation.to_email}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{isEmpty(quotation.invoice_id) ? '' : quotation.invoice_id}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{moment(quotation.created_at).format('DD-MM-YYYY')}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className={"inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium " + getQuotationStatus(quotation.view_count).className}>
                          {
                            getQuotationStatus(quotation.view_count).data
                          }
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{quotation.createdBy}</p>
                      </td>
                    </tr>
                  )
                })
              }
              {
                !isEmpty(quotationList) ? '' : (
                  <tr>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center" colSpan={6}>
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

export default Quotation;