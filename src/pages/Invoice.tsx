import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { setInvoiceList, setErrors, findOneInvoice, sendQuotation } from '../store/slice/invoiceSlice.js';
import { setCurrentQuotation } from '../store/slice/quotationSlice.js';
import { isEmpty } from '../config/index.js';
import { EyeSVG, PlaneSVG, TrushSVG } from '../components/SVG.js';
import InvoiceModal from './InvoiceModal.js';

const Invoice = () => {

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState({});

  const dispatch = useDispatch();
  const invoiceList = useSelector((state) => state.invoice.invoiceList);

  useEffect(() => {
    console.log('setInvoiceList');
    dispatch(setInvoiceList());
  }, [])

  const tableHeaderList = [
    'Id',
    'Name',
    'Email',
    'Amount',
    'Start Date',
    'Due Date',
    'Status',
    'Action'
  ];

  const navigate = useNavigate();

  const handleAddNew = (event: any) => {
    event.preventDefault();
    dispatch(setErrors({}));
    dispatch(setCurrentQuotation({}));
    navigate('/member/invoice/add');
  }

  const handleView = (id) => {
    navigate(`/member/invoice/edit/${id}`);
  }

  const handleSend = (data) => {
    dispatch(sendQuotation(data));
  }

  const getInvoiceStatus = (status) => {
    switch (status) {
      case 1:
        return { className: 'text-warning bg-warning', data: 'Quotation' };
      case 2:
        return { className: 'text-primary bg-primary', data: 'Mailed' };
      case 3:
        return { className: 'text-success bg-primary', data: 'Viewed' };
      case 4:
        return { className: 'text-danger bg-danger', data: 'UnPaid' };
      case 5:
        return { className: 'text-success bg-success', data: 'Paid' };
      default:
        return { className: '', data: '' }
    }
  }

  return (
    <>
      <Breadcrumb pageName="Invoice" />
      <InvoiceModal open={open} setOpen={setOpen} handleSend={handleSend} />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap" style={{ padding: '10px 0px 30px 0px' }}>
          <div className="flex flex-wrap gap-3 sm:gap-5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Invoice list
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
                {/* <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Package
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Invoice date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody>
              {
                invoiceList.map((invoice, invoiceIndex) => (
                  <tr key={invoiceIndex}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{invoice.id}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{invoice.client_name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{invoice.client_email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">${invoice.grand_total}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{moment(invoice.invoice_date).format('DD-MM-YYYY')}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{moment(invoice.due_date).format('DD-MM-YYYY')}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className={"inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium " + getInvoiceStatus(invoice.status_id).className}>
                        { getInvoiceStatus(invoice.status_id).data }
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={e => { e.preventDefault(); handleView(invoice.id); }}>
                          <EyeSVG />
                        </button>
                        <button className="hover:text-primary" onClick={e => {e.preventDefault(); dispatch(findOneInvoice(invoice.id)); setOpen(true)}}>
                          <PlaneSVG />
                        </button>
                        <button className="hover:text-primary">
                          <TrushSVG />
                        </button>
                        {/* <button className="hover:text-primary">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                              fill=""
                            />
                            <path
                              d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                              fill=""
                            />
                          </svg>
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              }
              {
                !isEmpty(invoiceList) ? '' : (
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

export default Invoice;