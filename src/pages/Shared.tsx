import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getCurrentFormatedDate1 } from '../utils';
import { isEmpty, serverURL, toastr } from '../config/index.js';
import moment from 'moment';
import FolderImg from '../images/shared/Folder_Small.png';
import { FileSVG } from '../components/SVG.js';
import Breadcrumb from '../components/Breadcrumb'; 1
import { useNavigate } from 'react-router-dom';
import SwitcherThree  from '../components/SwitcherThree.js';
import CreateFolderModal from './CreateFolderModal.js';
import UploadFileModal from './UploadFileModal.js';
import ShareModal from './ShareModal.js';
import ShareLink from './ShareLink.js';
import EditNameModal from './EditNameModal.js';
import DeleteModal from './DeleteModal.js';

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
    const [shareMode, setShareMode] = useState(0);   //0(false) => Private Mode,  1(true) => Full Mode
    const tempUrl = window.location.host;

    const getFolederList = async () => {
        try {
            const res = await axios.post(serverURL + '/api/shared/list', { isdeleted: 0, user_id: user_id });
            const data = res.data;
            if (data.status == 0) {
                setList(data.result);
            }
        }
        catch (error) {
            // navigate('/member/auth/signin');
        }
    }
    // console.log("-----enabled:", enabled);
    useEffect(() => {
        getFolederList();
    }, [])

    return (
        <>
            <Breadcrumb pageName="File Sharing" />
            {/* <CreateFolderModal opencreate={opencreate} setOpenCreate={setOpenCreate} refreshList={getFolederList} /> */}
            <UploadFileModal openupload={openupload} setOpenUpload={setOpenUpload} refreshList={getFolederList} />
            <EditNameModal preid={preid} prename={prename} editname={editname} setEditName={setEditName} refreshList={getFolederList} />
            <DeleteModal preid={preid} is_deleted={is_deleted} setDelete={setDelete} refreshList={getFolederList} />
            <ShareModal mshareMode={shareMode} preid={preid} preemail={email} prepassword={password} token={token} is_shared={is_shared} setShare={setShare} refreshList={getFolederList} />
            <ShareLink preid={preid} preemail={email} token={token} is_sharelink={is_sharelink} setShareLink={setShareLink} refreshList={getFolederList} />
            <div className="flex flex-col gap-10">
                <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
                    <div className="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
                        <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark" style={{ flexGrow: 0, width:'100%' }}>
                            <div className="sticky items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark" style={{ float: 'right' }}>
                                <div className="flex items-center">
                                    <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">List of shared files</h3>
                                    <div className="flex justify-end gap-4.5" style={{ marginLeft: 'auto', marginRight: '5px' }}>
                                        {/* <button className="flex justify-center rounded bg-meta-3 py-2 px-6 font-medium text-gray hover:shadow-1" onClick={e => { e.preventDefault(); setOpenCreate(true); }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-folder-plus">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                                            <span className='pl-2'>Create Folder</span>                                        
                                        </button> */}
                                        <button className="btn-peffect flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" onClick={e => { e.preventDefault(); setOpenUpload(true); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-upload-cloud"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                                            <span className='pl-2'>Upload</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5" style={{ flexGrow: 1, backgroundColor: '#f1f2f3' }}>
                                {
                                    list.map((item: any, index: any) => {
                                        return (
                                            <div className="col-xl-3 col-lg-6 col-md-4 col-sm-12 col-12 layout-spacing9" key={index} id={index}>
                                                <div className="widget widget-five">
                                                    <div className="widget-heading">
                                                        <div className='flex'>
                                                            <a href={serverURL + item.filepath} className="task-info flex">
                                                                <div className="w-img">
                                                                    {/* <img src={FolderImg} alt="" /> */}
                                                                    <FileSVG/>
                                                                </div>
                                                            </a>
                                                            <div className="w-title ml-2">
                                                                <h5 id="folname_8">{item.name}</h5>
                                                                <div><span style={{ fontSize: '12px' }}>{getCurrentFormatedDate1(item.created_at)}</span>{isEmpty(item.file_size) ? <i className="fas fa-link text-warning" style={{ fontSize: '12px', margin: '0 3px' }}></i> : <i className="fas fa-link text-success" style={{ fontSize: '12px', margin: '0 3px' }}></i>}<span style={{ fontSize: '12px' }}>{isEmpty(item.file_size) ? "...Empty" : item.file_size}</span></div>
                                                            </div>

                                                        </div>
                                                        <div>
                                                            <div className="task-action pr-2" style={{textAlign:'right'}}>
                                                                <div className="dropdown">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                                                    <div className="dropdown-content">
                                                                        <a href="#" onClick={e => { e.preventDefault(); setShare(true); setPreId(item.id); setEmail(item.email); setToken(item.token); setPassword(item.password); setShareMode(item.shareMode);console.log("itemshareMode:",item.shareMode)}}>Edit Share</a>
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
                </div>
            </div>
        </>
    );
};

export default Shared;