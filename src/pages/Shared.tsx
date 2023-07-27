import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getCurrentFormatedDate1 } from '../utils';
import { isEmpty, serverURL, toastr } from '../config/index.js';
import moment from 'moment';
import FolderImg from '../images/shared/Folder_Small.png';
import { ArrowDownSVG, FileSVG, SearchSVG, SharedSVG } from '../components/SVG.js';
import Breadcrumb from '../components/Breadcrumb'; 1
import { useNavigate } from 'react-router-dom';
import SwitcherThree from '../components/SwitcherThree.js';
import CreateFolderModal from './CreateFolderModal.js';
import UploadFileModal from './UploadFileModal.js';
import ShareModal from './ShareModal.js';
import ShareLink from './ShareLink.js';
import EditNameModal from './EditNameModal.js';
import DeleteModal from './DeleteModal.js';
import CheckboxOne from '../components/CheckboxOne.js';

const Shared = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user_id = window.localStorage.getItem('user_id');

    const [list, setList] = useState([]);
    const [opencreate, setOpenCreate] = useState(false);
    const [openupload, setOpenUpload] = useState(false);
    const [editname, setEditName] = useState(false);
    const [is_deleted, setDelete] = useState(false);
    const [is_shared, setShare] = useState(false);
    const [is_sharelink, setShareLink] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [preid, setPreId] = useState('');
    const [prename, setPreName] = useState('');
    const [isChecked1, setIsChecked1] = useState<boolean>(false);
    const [isChecked2, setIsChecked2] = useState<boolean>(false);
    const [shareMode, setShareMode] = useState(0);   //0(false) => Private Mode,  1(true) => Full Mode
    const tempUrl = window.location.host;
    const checkValidate = (mtoken, mshareMode) => {
        if (!isEmpty(mtoken)) {
            if (mshareMode == 1) {
                setIsChecked2(true);
            }
            else {
                setIsChecked1(true);
            }
        }
    }

    const getFolederList = async (params) => {
        try {
            if (isEmpty(params)) {
                params = initData;
            }
            const res = await axios.post(serverURL + '/api/shared/list', params);
            const data = res.data;
            if (data.status == 0) {
                setList(data.list);
                setPageInfo(data);
            }
        }
        catch (error) {
            // navigate('/member/auth/signin');
        }
    }


    // function pagination start
    const [pageInfo, setPageInfo] = useState({});
    const [pageNum, setPageNum] = useState(1);
    const [perPage, setPerPage] = useState('5');
    const [totalPage, setTotalPage] = useState(1);
    const [kind, setKind] = useState('Sender');
    const [searchValue, setSearchValue] = useState('');

    let perPageList = [5, 10, 25, 50];
    let kindList = ["Sender", "Receiver"];
    let initData = { page: pageNum, perPage: Number(perPage), kind: kind, searchValue: searchValue, user_id: user_id };
    ////
    let pageSize = 5;
    const [currentPage, setCurrentPage] = useState(1);
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
        let data = { page: mpage, perPage: Number(perPage), kind: kind, searchValue: searchValue, user_id: user_id };
        console.log("=========data", data);
        getFolederList(data)
    }
    const setPerPageRefresh = (mperpage: string) => {
        let data = { page: pageNum, perPage: Number(mperpage), kind: kind, searchValue: searchValue, user_id: user_id };
        console.log("=========data", data);
        getFolederList(data)
    }
    const setSearchRefresh = (msearch: string) => {
        let data = { page: pageNum, perPage: Number(perPage), kind: kind, searchValue: msearch, user_id: user_id };
        console.log("=========data", data);
        getFolederList(data)
    }
    useEffect(() => {
        setTotalPage(pageInfo.totalPage);
    })
    useEffect(() => {
        setPageNumRefresh(1);
    }, [])
    // function pagination end

    return (
        <>
            <Breadcrumb pageName="FILE SHARING LIST" />
            {/* <CreateFolderModal opencreate={opencreate} setOpenCreate={setOpenCreate} refreshList={getFolederList} /> */}
            <UploadFileModal openupload={openupload} setOpenUpload={setOpenUpload} refreshList={getFolederList} />
            <EditNameModal preid={preid} prename={prename} editname={editname} setEditName={setEditName} refreshList={getFolederList} />
            <DeleteModal preid={preid} is_deleted={is_deleted} setDelete={setDelete} refreshList={getFolederList} />
            <ShareModal mshareMode={shareMode} preid={preid} preemail={email} prepassword={password} token={token} is_shared={is_shared} setShare={setShare} refreshList={getFolederList} />
            <ShareLink preid={preid} preemail={email} token={token} is_sharelink={is_sharelink} setShareLink={setShareLink} refreshList={getFolederList} />
            <div className="flex flex-col gap-10">
                <div className="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
                    <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark" style={{ flexGrow: 0, width: '100%' }}>
                        <div className="sticky items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark" style={{ float: 'right' }}>
                            <div className="flex items-center">
                                <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">List of shared files</h3>
                                {/* top pagination start */}
                                {/* <div className="flex flex-wrap gap-3 sm:gap-5 mt-4">
                                        <div className='mb-5.5 flex'>
                                            <div className="relative z-20 bg-white dark:bg-form-input">
                                                <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                                    <SharedSVG />
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
                                    </div>
                                    <div className="flex flex-wrap gap-3 sm:gap-5"></div> */}
                                {/* top pagination end */}
                                <div className="flex justify-end gap-4.5" style={{ marginLeft: 'auto', marginRight: '5px' }}>
                                    {/* <button className="flex justify-center rounded bg-meta-3 py-2 px-6 font-medium text-gray hover:shadow-1" onClick={e => { e.preventDefault(); setOpenCreate(true); }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder-plus">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                                            <span className='pl-2'>Create Folder</span>                                        
                                        </button> */}
                                    <button className="btn-peffect flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" onClick={e => { e.preventDefault(); setOpenUpload(true); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload-cloud"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                                        <span className='pl-2'>Upload</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5" style={{ flexGrow: 1, backgroundColor: '#f1f2f3' }}>
                            {
                                list.map((item: any, index: any) => {
                                    let check1 = false;
                                    let check2 = false;
                                    if (!isEmpty(item.token)) {
                                        if (item.shareMode == 1) {
                                            check2 = true
                                        }
                                        else {
                                            check1 = true;
                                        }
                                    }
                                    return (
                                        <div className="col-xl-3 col-lg-6 col-md-4 col-sm-12 col-12 layout-spacing9" key={index} id={index}>
                                            <div className="widget widget-five">
                                                <div className="widget-heading">
                                                    <div className='flex'>
                                                        <a href={serverURL + item.filepath} className="task-info flex">
                                                            <div className="w-img">
                                                                <img src={FolderImg} alt="" />
                                                                {/* <FileSVG/> */}
                                                            </div>
                                                        </a>
                                                        <div className="w-title ml-2">
                                                            <h5 id="folname_8" className='text-ellipsis5'>{item.name}</h5>
                                                            <div><span style={{ fontSize: '12px' }}>{getCurrentFormatedDate1(item.created_at)}</span>{isEmpty(item.file_size) ? <i className="fas fa-link text-warning" style={{ fontSize: '12px', margin: '0 3px' }}></i> : <i className="fas fa-link text-success" style={{ fontSize: '12px', margin: '0 3px' }}></i>}<span style={{ fontSize: '12px' }}>{isEmpty(item.file_size) ? "...Empty" : item.file_size}</span></div>
                                                        </div>
                                                        <div className="w-title ml-4">
                                                            <div>
                                                                <label
                                                                    htmlFor="checkboxLabelOne"
                                                                    className="flex cursor-pointer select-none items-center"
                                                                >
                                                                    <div className="relative">
                                                                        <input
                                                                            type="checkbox"
                                                                            id="checkboxLabelOne"
                                                                            className="sr-only"
                                                                            // onChange={() => {
                                                                            //     setIsChecked1(!isChecked1);
                                                                            // }}
                                                                            disabled
                                                                        />
                                                                        <div
                                                                            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${check1 && 'border-primary bg-gray dark:bg-transparent'
                                                                                }`}
                                                                        >
                                                                            <span
                                                                                className={`h-2.5 w-2.5 rounded-sm ${check1 && 'bg-primary'}`}
                                                                            ></span>
                                                                        </div>
                                                                    </div>
                                                                    Private Mode
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label
                                                                    htmlFor="checkboxLabelOne"
                                                                    className="flex cursor-pointer select-none items-center"
                                                                >
                                                                    <div className="relative">
                                                                        <input
                                                                            type="checkbox"
                                                                            id="checkboxLabelOne"
                                                                            className="sr-only"
                                                                            // onChange={() => {
                                                                            //     setIsChecked2(!isChecked2);
                                                                            // }}
                                                                            disabled
                                                                        />
                                                                        <div
                                                                            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${check2 && 'border-primary bg-gray dark:bg-transparent'
                                                                                }`}
                                                                        >
                                                                            <span
                                                                                className={`h-2.5 w-2.5 rounded-sm ${check2 && 'bg-primary'}`}
                                                                            ></span>
                                                                        </div>
                                                                    </div>
                                                                    Public Mode
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="task-action pr-2" style={{ textAlign: 'right' }}>
                                                            <div className="dropdown">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                                                <div className="dropdown-content">
                                                                    <a href="#" onClick={e => { e.preventDefault(); setShare(true); setPreId(item.id); setEmail(item.email); setToken(item.token); setPassword(item.password); setShareMode(item.shareMode); console.log("itemshareMode:", item.shareMode) }}>Edit Share</a>
                                                                    <a href="#" onClick={e => { e.preventDefault(); setShareLink(true); setPreId(item.id); setEmail(item.email); setToken(item.token); setPassword(item.password) }}>Share Link</a>
                                                                    <a href="#" onClick={e => { e.preventDefault(); setEditName(true); setPreId(item.id); setPreName(item.name) }}>Rename</a>
                                                                    <div className="dropdown-divider"></div>
                                                                    <a href="#" onClick={e => { e.preventDefault(); setDelete(true); setPreId(item.id); }}>Delete</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <SwitcherThree shareMode={item.shareMode}/> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                {/*bottom pagination start */}
                <div className='perPage mt-5 mb-5'>

                    <div className="col-sm-12 col-md-6" style={{ float: 'right' }}>
                        <div className="dataTables_length bs-select" id="dtBasicExample_length">
                            <label>Show
                                <select name="dtBasicExample_length" aria-controls="dtBasicExample" className="custom-select custom-select-sm form-control form-control-sm"
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
                        <div className="dataTables_info mt-2 text-primary" id="dtBasicExample_info" role="status" aria-live="polite">Showing {isEmpty(paginate(totalPage, currentPage)[0]) ? 0 : paginate(totalPage, currentPage)[0]} to {isEmpty(paginate(totalPage, currentPage).slice(-1)) ? 0 : paginate(totalPage, currentPage).slice(-1)} of {isEmpty(totalPage) ? 0 : totalPage} pages</div>
                        <div className="pagination mx-auto">
                            <a href="#" onClick={e => { e.preventDefault(); setPageNum(1); setPageNumRefresh(1); setCurrentPage(1) }}>&laquo;</a>
                            <a href="#" onClick={e => { e.preventDefault(); setPageNum((currentPage - 1) < 1 ? 1 : ((currentPage - 1) * pageSize) - pageSize + 1); setPageNumRefresh(1); setCurrentPage((currentPage - 1) < 1 ? 1 : (currentPage - 1)) }}>&lsaquo;</a>
                            {
                                paginate(totalPage, currentPage).map((item, index) => (
                                    <a href="#" className={pageNum == item ? "active" : ""} key={item}
                                        onClick={e => { e.preventDefault(); setPageNum(item); setPageNumRefresh(item); }}>
                                        {item}
                                    </a>

                                ))
                            }
                            <a href="#" onClick={e => { e.preventDefault(); setPageNum(setPreNextPage(currentPage + 1)); setPageNumRefresh(setPreNextPage(currentPage + 1)); setCurrentPage(setNextPage(currentPage + 1)) }}>&rsaquo;</a>
                            <a href="#" onClick={e => { e.preventDefault(); setPageNum(setLastNextPage()); setPageNumRefresh(setLastNextPage()); setCurrentPage(setLastPage()) }}>&raquo;</a>
                        </div>
                    </div>
                </div>
                {/*bottom pagination end */}
            </div>
        </>
    );
};

export default Shared;