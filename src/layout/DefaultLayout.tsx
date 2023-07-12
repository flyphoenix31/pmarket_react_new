import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { isEmpty } from '../config';
import { getCurrentUser } from '../store/slice/authSlice';
import { setRoleList } from '../store/slice/usersSlice';
import { getSetting } from '../store/slice/settingSlice';
import socket from '../config/socket';

const DefaultLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerInfo, setHeaderInfo] = useState({ role: '', userInfo: {} });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const roleList = useSelector((state) => state.users.roleList);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    dispatch(getCurrentUser());
    dispatch(setRoleList());
    dispatch(getSetting());
  }, [])

  useEffect(() => {
    if (!isEmpty(userInfo) && !isEmpty(userInfo.id)) {
      socket.emit('id', { id: userInfo.id });
    }
  }, [userInfo])

  useEffect(() => {
    if (!isEmpty(roleList) && !isEmpty(userInfo)) {
      setHeaderInfo({
        role: roleList[userInfo.role_id],
        userInfo: userInfo
      })
    }
  }, [roleList])

  useEffect(() => {
    if (!auth && isEmpty(localStorage.getItem('token'))) {
      console.log('Auth', auth);
      navigate('/member/auth/signin');
    }
  }, [auth])

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} headerInfo={headerInfo} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;