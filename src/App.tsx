import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import axios from 'axios'
import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import Chat from './pages/Chat';
import History from './pages/ChatHistory';
import Shared from './pages/Shared';
import SharedHistory from './pages/SharedHistory';
import SharePage from './pages/SharePage';
import socket from './config/socket';
import { setUserInformation } from './store/slice/authSlice';
import Jobs from './pages/Jobs';
import JobAdd from './pages/JobAdd';
import JobEdit from './pages/JobEdit';
import Invoice from './pages/Invoice';
import InvoiceAdd from './pages/InvoiceAdd';
import InvoiceEdit from './pages/InvoiceEdit';
import Email from './pages/Email';
import EmailAll from './pages/EmailAll';
import EmailSend from './pages/EmailSend';
import EmailRecive from './pages/EmailReceive';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Clients from './pages/Clients';
import ClientAdd from './pages/ClientAdd';
import ClientEdit from './pages/ClientEdit';
import Quotation from './pages/Quotation';
import QuotationAdd from './pages/QuotationAdd';
import QuotationPreviewCli from './pages/QuotationPreviewCli';
import Setting from './pages/Setting';
import Permission from './pages/Permission';
import Role from './pages/Role';
import InvoiceSetting from './pages/InvoiceSetting';
import EmailManage from './pages/EmailManage';
import QuotationEdit from './pages/QuotationEdit';

const Calendar = lazy(() => import('./pages/Calendar'));
const Chart = lazy(() => import('./pages/Chart'));
const FormElements = lazy(() => import('./pages/Form/FormElements'));
const FormLayout = lazy(() => import('./pages/Form/FormLayout'));
const Profile = lazy(() => import('./pages/Profile'));
const UserAdd = lazy(() => import('./pages/UserAdd'));
const UserEdit = lazy(() => import('./pages/UserEdit'));
const Tables = lazy(() => import('./pages/Tables'));
const Alerts = lazy(() => import('./pages/UiElements/Alerts'));
const Buttons = lazy(() => import('./pages/UiElements/Buttons'));
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');
socket.connect();

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    // window.localStorage.setItem('color-theme', 'light');
  }, []);

  const theme = useSelector((state: any) => state.auth.theme);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route path="/member" element={<SignIn />} />
        <Route path="/member/auth/signin" element={<SignIn />} />
        <Route path="/member/auth/signup" element={<SignUp />} />
        <Route
          path="/member/shared/:token"
          element={
            <Suspense fallback={<Loader />}>
              <SharePage />
            </Suspense>
          }
        />
        <Route
          path="/member/quote/view/:id"
          element={
            <Suspense fallback={<Loader />}>
              <QuotationPreviewCli />
            </Suspense>
          }
        />
        <Route element={<DefaultLayout />}>
          {/* <Route index element={<ECommerce />} /> */}
          <Route
            path="/member/dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <ECommerce />
              </Suspense>
            }
          />
          <Route
            path="/member/chats"
            element={
              <Suspense fallback={<Loader />}>
                <Chat />
              </Suspense>
            }
          />
          <Route
            path="/member/chathistory"
            element={
              <Suspense fallback={<Loader />}>
                <History />
              </Suspense>
            }
          />
          <Route
            path="/member/shares"
            element={
              <Suspense fallback={<Loader />}>
                <Shared />
              </Suspense>
            }
          />
          <Route
            path="/member/sharehistory"
            element={
              <Suspense fallback={<Loader />}>
                <SharedHistory />
              </Suspense>
            }
          />
          <Route
            path="/member/users"
            element={
              <Suspense fallback={<Loader />}>
                <Users />
              </Suspense>
            }
          />
          <Route
            path="/member/users/add"
            element={
              <Suspense fallback={<Loader />}>
                <UserAdd />
              </Suspense>
            }
          />
          <Route
            path="/member/users/edit/:id"
            element={
              <Suspense fallback={<Loader />}>
                <UserEdit />
              </Suspense>
            }
          />
          <Route
            path="/member/profile"
            element={
              <Suspense fallback={<Loader />}>
                <UserProfile />
              </Suspense>
            }
          />
          <Route
            path="/member/clients"
            element={
              <Suspense fallback={<Loader />}>
                <Clients />
              </Suspense>
            }
          />
          <Route
            path="/member/clients/add"
            element={
              <Suspense fallback={<Loader />}>
                <ClientAdd />
              </Suspense>
            }
          />
          <Route
            path="/member/clients/edit/:id"
            element={
              <Suspense fallback={<Loader />}>
                <ClientEdit />
              </Suspense>
            }
          />
          <Route
            path="/member/jobs"
            element={
              <Suspense fallback={<Loader />}>
                <Jobs />
              </Suspense>
            }
          />
          <Route
            path="/member/jobs/add"
            element={
              <Suspense fallback={<Loader />}>
                <JobAdd />
              </Suspense>
            }
          />
          <Route
            path="/member/jobs/edit/:id"
            element={
              <Suspense fallback={<Loader />}>
                <JobEdit />
              </Suspense>
            }
          />
          <Route
            path="/member/invoice"
            element={
              <Suspense fallback={<Loader />}>
                <Invoice />
              </Suspense>
            }
          />
          <Route
            path="/member/invoice/add"
            element={
              <Suspense fallback={<Loader />}>
                <InvoiceAdd />
              </Suspense>
            }
          />
          <Route
            path="/member/invoice/edit/:id"
            element={
              <Suspense fallback={<Loader />}>
                <InvoiceEdit />
              </Suspense>
            }
          />
          <Route
            path="/member/quotation"
            element={
              <Suspense fallback={<Loader />}>
                <Quotation />
              </Suspense>
            }
          />
          <Route
            path="/member/quotation/add"
            element={
              <Suspense fallback={<Loader />}>
                <QuotationAdd />
              </Suspense>
            }
          />
          <Route
            path="/member/quotation/edit/:id"
            element={
              <Suspense fallback={<Loader />}>
                <QuotationEdit />
              </Suspense>
            }
          />
          <Route
            path="/member/setting/company"
            element={
              <Suspense fallback={<Loader />}>
                <Setting />
              </Suspense>
            }
          />
          <Route
            path="/member/setting/roles"
            element={
              <Suspense fallback={<Loader />}>
                <Role />
              </Suspense>
            }
          />
          <Route
            path="/member/setting/permission"
            element={
              <Suspense fallback={<Loader />}>
                <Permission />
              </Suspense>
            }
          />
          {/* <Route
              path="/member/email/:roles"
              element={
                <Suspense fallback={<Loader />}>
                  <Email />
                </Suspense>
              }
            /> */}
          <Route
            path="/member/email/all"
            element={
              <Suspense fallback={<Loader />}>
                <EmailAll />
              </Suspense>
            }
          />
          <Route
            path="/member/email/send"
            element={
              <Suspense fallback={<Loader />}>
                <EmailSend />
              </Suspense>
            }
          />
          <Route
            path="/member/email/receive"
            element={
              <Suspense fallback={<Loader />}>
                <EmailRecive />
              </Suspense>
            }
          />
          <Route
            path="/member/calendar"
            element={
              <Suspense fallback={<Loader />}>
                <Calendar />
              </Suspense>
            }
          />
          <Route
            path="/member/forms/form-elements"
            element={
              <Suspense fallback={<Loader />}>
                <FormElements />
              </Suspense>
            }
          />
          <Route
            path="/member/forms/form-layout"
            element={
              <Suspense fallback={<Loader />}>
                <FormLayout />
              </Suspense>
            }
          />
          <Route
            path="/member/tables"
            element={
              <Suspense fallback={<Loader />}>
                <Tables />
              </Suspense>
            }
          />
          <Route
            path="/member/chart"
            element={
              <Suspense fallback={<Loader />}>
                <Chart />
              </Suspense>
            }
          />
          <Route
            path="/member/ui/alerts"
            element={
              <Suspense fallback={<Loader />}>
                <Alerts />
              </Suspense>
            }
          />
          <Route
            path="/member/ui/buttons"
            element={
              <Suspense fallback={<Loader />}>
                <Buttons />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme={theme}
      />
    </>
  );
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated
})

const mapDispatchToProps = (dispatch: any) => ({
  setUserInformation: (payload) => dispatch(setUserInformation(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
