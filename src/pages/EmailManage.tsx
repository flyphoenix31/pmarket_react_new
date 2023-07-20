import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { isEmpty, serverURL, toastr } from '../config/index.js';
import axios from 'axios';
import { SaveSVG } from '../components/SVG.js';
import PermissionModal from './PermissionModal.js';
import TabJs from '../store/slice/tab.js'
const EmailManage = () => {

  const tableHeaderList = [
    'No',
    'Name',
    'Action'
  ];

  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  const getPermissionList = async () => {
    // return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(serverURL + '/api/permission/list');
      const data = res.data;
      if (!data.status) setList(data.list);
      else toastr.warning(data.message);
      // resolve(data);
    } catch (error) {
      // reject(error);
      navigate('/member/auth/signin');
    }
    // })
  }

  const updatePermission = async (id, name) => {
    try {
      const res = await axios.post(serverURL + '/api/permission/update', { id, name });
      const data = res.data;
      if (!data.status) {
        toastr.success('Successfully updated');
        getPermissionList();
      }
      else toastr.warning(data.message);
      // resolve(data);
    } catch (error) {
      // reject(error);
      navigate('/member/auth/signin');
    }
  }

  useEffect(() => {
    getPermissionList();
  }, [])

  return (
    <>
      <Breadcrumb pageName="Sending / Receiving Manage" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className='keller'>
            <nav>
              <div className="link-background"></div>
              <ul>
                <li>
                  <a className="active">
                    <svg href="#home">
                    </svg>
                    <span className="link-text">Home</span>
                  </a>
                </li>
                <li>
                  <a href="#inbox">
                    <svg>
                    </svg>
                    <span className="link-text">Inbox</span>
                  </a>
                </li>
                <li>
                  <a href="#profile">
                    <svg>
                    </svg>
                    <span className="link-text">Profile</span>
                  </a>
                </li>
              </ul>
            </nav>
            <svg>
              <symbol version="1.1" id="home" viewBox="0 0 50 50">
                <path fill="none" stroke="" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" d="M31,44.738v-8.52
                c0-1.505-0.69-2.929-1.877-3.87l0,0c-1.826-1.448-4.421-1.448-6.247,0l0,0C21.69,33.288,21,34.712,21,36.218v3.565"/>
                <line fill="none" stroke="" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" x1="15" y1="20.223" x2="29" y2="20.223" />
                <path fill="none" stroke="" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" d="M8,19.232
                L24.681,5.466c0.758-0.632,1.869-0.62,2.612,0.03l15.03,13.144C42.754,19.016,43,19.557,43,20.126v22.892
                C43,44.113,42.105,45,41,45h-8.6H31H10c-1.105,0-2-0.887-2-1.982V28.151c0-1.095,0.895-1.982,2-1.982h7"/>
              </symbol>
              <symbol version="1.1" id="inbox" viewBox="0 0 50 50">
                <path fill="none" strokeWidth="2" stroke-miterlimit="10" d="M45.5,39.5h-40c-1.657,0-3-1.343-3-3V23.55
                c0-0.028,0.022-0.05,0.05-0.05h13.555l0.665,1.989c0.952,3.563,4.29,6.106,8.139,6.115c0.061,0,0.122,0,0.183,0
                c3.849-0.009,7.187-2.552,8.139-6.115l0.665-1.989H47.45c0.028,0,0.05,0.022,0.05,0.05V37.5C47.5,38.605,46.605,39.5,45.5,39.5z"/>
                <path fill="none" strokeWidth="2" stroke-miterlimit="10" d="M47.5,23.5l-7.109-11.664
                c-0.556-0.835-1.493-1.336-2.496-1.336H12.106c-1.003,0-1.94,0.501-2.496,1.336L2.5,23.5"/>
              </symbol>
              <symbol version="1.1" id="profile" viewBox="0 0 50 50">
                <line fill="none" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" x1="18.5" y1="37" x2="28.5" y2="37" />
                <line fill="none" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" x1="14.5" y1="42" x2="21.5" y2="42" />
                <path fill="none" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" d="M35.857,27.299
                C32.753,25.216,29.019,24,25,24C14.735,24,6.323,31.931,5.557,42"/>
                <path fill="none" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" d="M35.857,29.299" />
                <path fill="none" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" d="M39.665,30.648" />
                <path fill="none" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" d="M44.443,42
                c-0.269-3.539-1.483-6.815-3.391-9.574"/>
                <circle fill="none" stroke="" strokeWidth="2" strokeLinecap="round" stroke-miterlimit="10" cx="25.5" cy="17" r="9" />
              </symbol>
            </svg>
        </div>
      </div>
    </div >
    </>
  );
};

export default EmailManage;