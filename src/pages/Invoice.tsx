import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { setInvoiceList, setErrors, sendQuotation } from '../store/slice/invoiceSlice.js';
import { isEmpty } from '../config/index.js';
import { ArrowDownSVG, EyeSVG, InvoiceSVG, PlaneSVG, SearchSVG, TrushSVG } from '../components/SVG.js';
import InvoiceModal from './InvoiceModal.js';
import InvoiceDeleteModal from './InvoiceDeleteModal.js';

const Invoice = () => {

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const invoiceList = useSelector((state) => state.invoice.invoiceList);
  // function pagination start
  const pageInfo = useSelector((state) => state.invoice.pageInfo);
  const [pageNum, setPageNum] = useState(1);
  const [perPage, setPerPage] = useState('10');
  const [totalPage, setTotalPage] = useState(1);
  const [kind, setKind] = useState('Name');
  const [searchValue, setSearchValue] = useState('');

  const [preid, setPreId] = useState('');
  const [is_deleted, setDelete] = useState(false);

  let perPageList = [10, 25, 50, 100];
  let kindList = ["Name", "Email", "Phone"];
  ////
  let pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const initPage = () => {
    setPageNumRefresh(1);
    setPageNum(1);
  }

  const paginate = (totalPage: number, currentPage: any) => {
    let data: string | any[] = [];
    for (let i = 0; i < totalPage; i++) {
      data.push(i + 1);
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    return paginatedData;
  }

  const setNextPage = (currentPage: number) => {
    let num = Math.ceil(totalPage / pageSize);
    if (currentPage > num) {
      return num;
    }
    else {
      return currentPage
    }
  }
  const setPreNextPage = (currentPage: number) => {
    let num = Math.ceil(totalPage / pageSize);
    console.log("currnetPage:", currentPage, totalPage, num);

    if (currentPage < num) {
      return currentPage * pageSize - pageSize + 1
    }
    else {
      let remain = totalPage % pageSize;
      return totalPage - remain + 1
    }
  }

  const setLastNextPage = () => {
    // return totalPage - (totalPage % pageSize) + 1
    return totalPage;
  }
  const setLastPage = () => {
    let num = Math.ceil(totalPage / pageSize);
    return num;
  }
  /////
  const setPageNumRefresh = (mpage: number) => {
    let data = { page: mpage, perPage: Number(perPage), kind: kind, searchValue: searchValue };
    console.log("=========data", data);
    dispatch(setInvoiceList(data));
  }
  const setPerPageRefresh = (mperpage: string) => {
    let data = { page: pageNum, perPage: Number(mperpage), kind: kind, searchValue: searchValue };
    console.log("=========data", data);
    dispatch(setInvoiceList(data));
  }
  const setSearchRefresh = (msearch: string) => {
    let data = { page: pageNum, perPage: Number(perPage), kind: kind, searchValue: msearch };
    console.log("=========data", data);
    dispatch(setInvoiceList(data));
  }
  useEffect(() => {
    setTotalPage(pageInfo.totalPage);
  })
  useEffect(() => {
    initPage();
  }, [])
  // function pagination end


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
    // dispatch(setCurrentQuotation({}));
    navigate('/member/invoice/add');
  }

  const handleView = (id) => {
    dispatch(setErrors({}));
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
      <Breadcrumb pageName="INVOICE LIST" />
      <InvoiceModal open={open} setOpen={setOpen} handleSend={handleSend} />
      <InvoiceDeleteModal preid={preid} is_deleted={is_deleted} setDelete={setDelete} initPage={initPage} />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap" style={{ padding: '10px 0px 30px 0px' }}>
          <div className="flex flex-wrap gap-3 sm:gap-5">
            {/* top pagination start */}
            {/* <div className="flex flex-wrap gap-3 sm:gap-5">
              <div className='mb-5.5 flex'>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                    <InvoiceSVG/>
                  </span>
                  <select
                    className="w-full rounded border mr-3 border-stroke  py-1.5 pl-11.5 pr-19 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                    value={kind}
                    onChange={e => { e.preventDefault(); setKind(e.target.value) }}
                  >
                    {kindList.map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))
                    }
                  </select>
                  <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                    <ArrowDownSVG />
                  </span>
                </div>
              </div>
              <div className="sm:block mt-2">
                <div className="relative flex">
                  <button className="absolute top-1/2 left-0 -translate-y-1/2"
                    onClick={e => { setSearchRefresh(searchValue); }}
                  >
                    <SearchSVG />
                  </button>

                  <input
                    type="text"
                    placeholder="Type to search..."
                    className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
                    value={searchValue}
                    onChange={e => { e.preventDefault(); setSearchValue(e.target.value) }}
                    onKeyPress={e => { if (e.key === 'Enter') { setSearchRefresh(searchValue); } }}
                  />
                  {!isEmpty(searchValue) ?
                    <span className="mt-1 closehover" onClick={e => { e.preventDefault(); setSearchRefresh(''); setSearchValue(''); }}>
                      <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </span>
                    : ""
                  }
                </div>
              </div>
            </div> */}
            {/* top pagination end */}
          </div>
          <div className="flex justify-end">
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
              <button className="btn-peffect flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" onClick={handleAddNew}>
                <span className='pl-2'>+ Add New</span>
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
                        {getInvoiceStatus(invoice.status_id).data}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={e => { e.preventDefault(); handleView(invoice.id); }}>
                          <EyeSVG />
                        </button>
                        <button className="hover:text-primary" onClick={e => { e.preventDefault(); setOpen(true) }}>
                          <PlaneSVG />
                        </button>
                        <button className="hover:text-primary" onClick={e => { e.preventDefault(); setDelete(true); setPreId(invoice.id); }}>
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
        {/*bottom pagination start */}
        <div className='perPage mt-5 mb-5'>
          <div className="col-sm-12 col-md-6" style={{ float: 'right' }}>
            <div className="dataTables_length bs-select" id="dtBasicExample_length">
              <label className='dark:text-white'>Show
                <select name="dtBasicExample_length" aria-controls="dtBasicExample" className="custom-select custom-select-sm form-control form-control-sm dark:bg-meta-4 dark:text-white"
                  value={perPage}
                  onChange={e => { e.preventDefault(); setPerPage(e.target.value); setPerPageRefresh(e.target.value); setPageNum(1); setCurrentPage(1); }}
                >
                  {
                    perPageList.map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))
                  }
                </select>entries</label>
            </div>
          </div>
          <div className="center flex">
            <div className="dataTables_info mt-2 text-primary dark:text-white" id="dtBasicExample_info" role="status" aria-live="polite">Showing {isEmpty(paginate(totalPage, currentPage)[0]) ? 0 : paginate(totalPage, currentPage)[0]} to {isEmpty(paginate(totalPage, currentPage).slice(-1)) ? 0 : paginate(totalPage, currentPage).slice(-1)} of {isEmpty(totalPage) ? 0 : totalPage} pages</div>
            <div className="pagination mx-auto">
              <a href="#" className='text-black dark:text-white' onClick={e => { e.preventDefault(); setPageNum(1); setPageNumRefresh(1); setCurrentPage(1) }}>&laquo;</a>
              <a href="#" className='text-black dark:text-white' onClick={e => { e.preventDefault(); setPageNum((currentPage - 1) < 1 ? 1 : ((currentPage - 1) * pageSize) - pageSize + 1); setPageNumRefresh(1); setCurrentPage((currentPage - 1) < 1 ? 1 : (currentPage - 1)) }}>&lsaquo;</a>
              {
                paginate(totalPage, currentPage).map((item, index) => (
                  <a href="#" className={pageNum == item ? "active text-black dark:text-white" : "text-black dark:text-white"} key={item}
                    onClick={e => { e.preventDefault(); setPageNum(item); setPageNumRefresh(item); }}>
                    {item}
                  </a>

                ))
              }
              <a href="#" className='text-black dark:text-white' onClick={e => { e.preventDefault(); setPageNum(setPreNextPage(currentPage + 1)); setPageNumRefresh(setPreNextPage(currentPage + 1)); setCurrentPage(setNextPage(currentPage + 1)) }}>&rsaquo;</a>
              <a href="#" className='text-black dark:text-white' onClick={e => { e.preventDefault(); setPageNum(setLastNextPage()); setPageNumRefresh(setLastNextPage()); setCurrentPage(setLastPage()) }}>&raquo;</a>
            </div>
          </div>
        </div>
        {/*bottom pagination end */}
      </div>
    </>
  );
};

export default Invoice;