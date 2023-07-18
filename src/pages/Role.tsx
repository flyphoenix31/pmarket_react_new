import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate } from 'react-router-dom';
import { isEmpty, serverURL, toastr } from '../config/index.js';
import axios from 'axios';
import { EyeSVG, SaveSVG } from '../components/SVG.js';
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
      if(!pRes.data.status && !rRes.data.status) {
        setList(pRes.data.list);
        setPlist(rRes.data.list);
      }
    }).catch(error => {
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
      <Breadcrumb pageName="Setting / Permission" />
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
              <button
                className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark"
                onClick={e => { e.preventDefault(); setOpen(true); setCurrentItem(null); }}
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
                            className="hover:text-primary"
                            onClick={e => {
                              e.preventDefault();
                              // if (isEmpty(item)) return toastr.warning('Please enter name');
                              // updatePermission(item.id, item.name)
                              setOpen(true);
                              setCurrentItem(item);
                            }}
                          >
                            <EyeSVG />
                          </button>
                          <button className="hover:text-primary">
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                fill=""
                              />
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                fill=""
                              />
                              <path
                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                fill=""
                              />
                              <path
                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                fill=""
                              />
                            </svg>
                          </button>
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