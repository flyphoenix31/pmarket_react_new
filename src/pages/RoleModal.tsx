import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSVG } from '../components/SVG';
import { isEmpty, serverURL, toastr } from '../config';
import axios from 'axios';

const CheckBox = ({ id, title, check, setCheck }) => {
    return (
        // <div className="w-full sm:w-1/12">
        <label htmlFor={"checkboxLabel" + id} className="flex cursor-pointer select-none items-center w-full rounded border-stroke pl-1 py-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary">
            <div className="relative flex items-center">
                <input type="checkbox" id={"checkboxLabel" + id} className="sr-only" onClick={e => {
                    e.preventDefault(); setCheck(id, !check);
                }} />
                <div className={"mr-3 flex h-5 w-5 items-center justify-center rounded border " + (check ? 'border-primary bg-gray dark:bg-transparent' : '')}>
                    <span className={"opacity-0 " + (check ? '!opacity-100' : '')}>
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z" fill="#3056D3" stroke="#3056D3" strokeWidth="0.4"></path>
                        </svg>
                    </span>
                </div>
                {title}
            </div>
        </label>
        // </div>
    )
}

const RoleModal = ({ open, setOpen, pList, refreshTable, currentItem }) => {

    const [error, setError] = useState({});
    const [item, setItem] = useState('');
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(currentItem === null)
            setList(pList);
        else {
            const checkedList = pList.reduce((res, p) => {
                if(currentItem.permissions.findIndex(per => per.permission_id.toString() === p.id.toString()) >= 0)
                    return [...res, {...p, check: true}];
                else
                    return [...res, p];
            }, []);
            setItem(currentItem.name);
            setList(checkedList);
        }
    }, [pList, currentItem])

    useEffect(() => {
        if(open) setError({})
    }, [open])

    const setCheck = (id, value) => {
        const index = list.findIndex(item => item.id.toString() === id.toString());
        console.log(id, value, index);
        if (index >= 0)
            setList([...list.slice(0, index), { ...list[index], check: value }, ...list.slice(index + 1, list.length)]);
    }

    const handleClose = (event: any) => {
        event.preventDefault();
        setOpen(false);
    }


    const handleSave = (event: any) => {
        event.preventDefault();
        const checkedList = list.reduce((res, p) => {
            if (p.check) return [...res, p.id];
            else return res;
        }, []);
        
        const url = currentItem === null ? '/api/role/new' : '/api/role/update';
        const param = currentItem === null ? { name: item, permissions: checkedList } : {
            name: item,
            permissions: checkedList,
            id: currentItem.id
        }

        axios.post(serverURL + url, param)
            .then(res => {
                const data = res.data;
                if (!data.status) {
                    refreshTable();
                    toastr.success(`Successfully ${currentItem === null ? 'added' : 'updated'}`);
                    setOpen(false);
                    navigate('/member/setting/roles');
                } else {
                    setError(data.errors);
                }
            })
            .catch(() => {
                setOpen(false);
                navigate('/member/auth/signin');
            })
    }


    return (
        <>
            <div
                x-show="modalOpen"
                x-transition=""
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
                style={open ? {} : { display: 'none' }}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        { currentItem !== null ? 'Update Role' : 'New Role'}
                    </h3>
                    <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>

                    <div className='mb-5.5'>
                        <label
                            className="text-left mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="invoice_number"
                        >
                            Role Name
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="item"
                                id="item"
                                value={item}
                                onChange={e => { e.preventDefault(); setItem(e.target.value) }}
                                placeholder="Write role name here"
                            />
                        </div>
                        <label
                            className="text-left mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="item"
                        >
                            {isEmpty(error) || isEmpty(error.name) ? '' : error.name}
                        </label>
                    </div>

                    <div className='mb-5.5'>
                        <label
                            className="text-left mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="invoice_number"
                        >
                            Permission
                        </label>
                        <label
                            className="text-left mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="item"
                        >
                            {isEmpty(error) || isEmpty(error.permissions) ? '' : error.permissions}
                        </label>
                        <div className="relative" style={{ height: '400px', overflow: 'auto' }}>
                            {
                                list.map((pItem, pIndex) => {
                                    // return <div></div>
                                    return <CheckBox
                                        key={pIndex}
                                        id={pItem.id}
                                        title={pItem.name}
                                        check={isEmpty(pItem.check) ? false : pItem.check}
                                        setCheck={setCheck}
                                    />
                                })
                            }
                            {/* <span className="absolute left-4.5 top-4">
                                <TitleSVG />
                            </span>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="item"
                                id="item"
                                value={item}
                                onChange={e => { e.preventDefault(); setItem(e.target.value) }}
                                placeholder="Write role name here"
                            /> */}
                        </div>
                        {/* <label
                            className="text-left mb-0 block text-sm font-medium mt-2 text-danger"
                            htmlFor="item"
                        >
                            {isEmpty(error) ? '' : error}
                        </label> */}
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            className="btn-neffect justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button
                            className="btn-peffect justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
};

export default RoleModal;