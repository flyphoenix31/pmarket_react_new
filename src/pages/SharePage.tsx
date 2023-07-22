import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getCurrentFormatedDate1 } from '../utils';
import { isEmpty, serverURL, toastr } from '../config/index.js';
import moment from 'moment';
import FolderImg  from '../images/shared/Folder_Small.png';
import Breadcrumb from '../components/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import ShareLoginModal from './ShareLoginMoal.js';
const SharedPage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setTimeout(() => setLoading(false), 2000);
    }, []);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user_id = window.localStorage.getItem('user_id');
    
    const [list, setList] = useState([]);
    const [is_open, setLoginOpen] = useState(true);
    const [is_token, setToken] = useState(false);
    let { token } = useParams();
    // const token = window.location.pathname.substr(15);
    const tempUrl = window.location.host;
    const getToken = async () => {
        try {
            const res = await axios.post(serverURL + '/api/shared/gettoken', { is_deleted: 0, token: token });
            const data = res.data;
            console.log("===========sharedpage", data.result[0].shareMode);
            if(data.result[0].shareMode == 1){
                setLoginOpen(false);
                getFolederList();
                setToken(true)
                return;
            }
            if (data.status) {
                setLoading(true);
                setToken(false);
                return;
            }
            setToken(true); 
        }
        catch (error) {
            console.log("getFolderList:", error);
            // navigate('/member/auth/signin');
        }
    }
    const getFolederList = async () => {
        try {
            const res = await axios.post(serverURL + '/api/shared/sharelist', { is_deleted: 0,user_id: user_id, token: token });
            const data = res.data;
            if (data.status == 0) {
                setList(data.result);
            }
        }
        catch (error) {
            console.log("getFolderList:", error);
            // navigate('/member/auth/signin');
        }
    }

    useEffect(() => {
        getToken();
    }, [])

    return (
        <>
            { is_token ?
                <div>
                    <ShareLoginModal is_open={is_open} setLoginOpen={setLoginOpen} refreshList={getFolederList}/>
                    <div className="flex flex-col gap-10">
                        <div className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5" style={{ flexGrow: 1, backgroundColor: '#f1f2f3' }}>
                            {
                                list.map((item: any, index: any) => {
                                    console.log("ddddddddddddddd",item);
                                    return (
                                        <div className="col-xl-3 col-lg-6 col-md-4 col-sm-12 col-12 layout-spacing9" key={index} id={index}>
                                            <div className="widget widget-five">
                                                <div className="widget-heading">
                                                    <div className='flex'>
                                                        <a href={serverURL + item.filepath} className="task-info flex" download={item.name}>
                                                            <div className="w-img">
                                                                <img src={FolderImg} alt="" />
                                                            </div>
                                                        </a>
                                                        <div className="w-title ml-2">
                                                            <h5 id="folname_8">{item.name}</h5>
                                                            <div><span style={{ fontSize: '12px' }}>{getCurrentFormatedDate1(item.created_at)}</span>{isEmpty(item.file_size) ? <i className="fas fa-link text-warning" style={{ fontSize: '12px', margin: '0 3px' }}></i> : <i className="fas fa-link text-success" style={{ fontSize: '12px', margin: '0 3px' }}></i>}<span style={{ fontSize: '12px' }}>{isEmpty(item.file_size) ? "...Empty" : item.file_size}</span></div>
                                                        </div>
                                                    </div>
                                                    <a href={item.filepath} className="btn-peffect justify-center rounded bg-primary py-4 px-6 font-medium text-gray hover:shadow-1" style={{alignSelf:'center'}} download>
                                                        <div className="justify-end gap-4.5">DOWNLOAD</div>
                                                    </a>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            :
            ""   
            }
        </>
    );
};

export default SharedPage;