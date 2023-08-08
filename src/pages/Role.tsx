import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { isEmpty, serverURL, toastr } from '../config/index.js';
import axios from 'axios';
import { EyeSVG, SaveSVG, TrushSVG } from '../components/SVG.js';
import PermissionModal from './PermissionModal.js';
import RoleModal from './RoleModal.js';

const Role = () => {

  const tableHeaderList = [
    'No',
    'Role',
    'Permissions',
    'Action'
  ];

  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [pList, setPlist] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const getRoleList = async () => {
    // return new Promise(async (resolve, reject) => {
    Promise.all([
      axios.get(serverURL + '/api/role/list-with-permission'),
      axios.get(serverURL + '/api/permission/list')
    ]).then(([pRes, rRes]) => {
      if (!pRes.data.status && !rRes.data.status) {
        setList(pRes.data.list);
        setPlist(rRes.data.list);
      }
    }).catch(error => {
      console.log("----------error_getrolelist", error);
      navigate('/member/auth/signin');
    })
  }

  const getPermissionList = async () => {
    // return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(serverURL + '/api/permission/list');
      const data = res.data;
      if (!data.status) setPlist(data.list);
      else toastr.warning(data.message);
      // resolve(data);
    } catch (error) {
      // reject(error);
      console.log("----------error_getpermissionlist", error);
      navigate('/member/auth/signin');
    }
    // })
  }

  const getPermissionName = (id) => {
    const index = pList.findIndex(item => item.id.toString() === id.toString());
    return index >= 0 ? pList[index].name : '';
  }

  const updatePermission = async (id, name) => {
    try {
      const res = await axios.post(serverURL + '/api/permission/update', { id, name });
      const data = res.data;
      if (!data.status) {
        toastr.success('Successfully updated');
        getRoleList();
      }
      else toastr.warning(data.message);
      // resolve(data);
    } catch (error) {
      // reject(error);
      navigate('/member/auth/signin');
    }
  }

  useEffect(() => {
    getRoleList();
  }, [])


  return (
    <>
      <Breadcrumb pageName="SETTING / ROLES" />
      <RoleModal open={open} setOpen={setOpen} pList={pList} refreshTable={getRoleList} currentItem={currentItem} />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap" style={{ padding: '10px 0px 30px 0px' }}>
          <div className="flex flex-wrap gap-3 sm:gap-5">
            <h4 className="text-xl font-semibold text-black dark:text-white" onClick={e => { axios.defaults.headers.common['Authorization'] = ''; }}>
              Contacted clients list
            </h4>
          </div>
          <div className="flex justify-end">
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
              <button className="btn-peffect flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" onClick={e => { e.preventDefault(); setOpen(true); setCurrentItem(null); }}>
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
              </tr>
            </thead>
            <tbody>
              {
                list.map((item: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{index + 1}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {/* <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="delivery"
                          id="delivery"
                          value={item.name}
                          onChange={e => { e.preventDefault(); setList([...list.slice(0, index), { ...item, name: e.target.value }, ...list.slice(index + 1, list.length)]) }}
                          placeholder="Write name here"
                        /> */}
                        <p className="text-black dark:text-white">{item.name}</p>
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {
                          item.permissions.map((permi, perIndex) => (
                            <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success mr-2 mt-2" key={perIndex}>
                              {getPermissionName(permi.permission_id)}
                            </p>
                          ))
                        }
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary ml-4"
                            onClick={e => {
                              e.preventDefault();
                              setOpen(true);
                              setCurrentItem(item);
                            }}
                          >
                            <EyeSVG />
                          </button>
                          {/* <button className="hover:text-primary">
                            <TrushSVG />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
              {
                !isEmpty(list) ? '' : (
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

export default Role;