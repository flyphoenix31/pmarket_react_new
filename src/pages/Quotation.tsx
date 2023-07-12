import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { setQuotationList, setErrors, findOneQuotation, sendQuotation } from '../store/slice/quotationSlice.js';
import { isEmpty } from '../config/index.js';
import { EyeSVG, PlaneSVG, TrushSVG } from '../components/SVG.js';
import QuotationModal from './QuotationModal.js';

const Quotation = () => {

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const quotationList = useSelector((state) => state.quotation.quotationList);

  useEffect(() => {
    dispatch(setQuotationList());
  }, [])

  const tableHeaderList = [
    'Id',
    'Name',
    'Email',
    'Amount',
    'Date',
    'Status',
    'Action'
  ];

  const navigate = useNavigate();

  const handleAddNew = (event: any) => {
    event.preventDefault();
    dispatch(setErrors({}));
    navigate('/member/quotation/add');
  }

  const handleView = (id) => {
    navigate(`/member/quotation/edit/${id}`);
  }

  const handleSend = (data) => {
    dispatch(sendQuotation(data));
  }

  const getQuotationStatus = (status) => {
    switch (status) {
      case 1:
        return { className: 'text-warning bg-warning', data: 'Draft' };
      case 2:
        return { className: 'text-primary bg-primary', data: 'Mailed' };
      case 3:
        return { className: 'text-success bg-success', data: 'Viewed' };
      default:
        return { className: '', data: '' }
    }
  }

  return (
    <>
      <Breadcrumb pageName="Quotation" />
      <QuotationModal open={open} setOpen={setOpen} handleSend={handleSend} />

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
                quotationList.map((quote, quoteIndex) => (
                  <tr key={quoteIndex}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{quote.id}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{quote.client_name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{quote.client_email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">${quote.grand_total}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{moment(quote.created_at).format('DD-MM-YYYY')}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className={"inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium " + getQuotationStatus(quote.status_id).className}>
                        {getQuotationStatus(quote.status_id).data}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={e => { e.preventDefault(); handleView(quote.id); }}>
                          <EyeSVG />
                        </button>
                        <button className="hover:text-primary" onClick={e => { e.preventDefault(); dispatch(findOneQuotation(quote.id)); setOpen(true) }}>
                          <PlaneSVG />
                        </button>
                        <button className="hover:text-primary">
                          <TrushSVG />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
              {
                !isEmpty(quotationList) ? '' : (
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

export default Quotation;