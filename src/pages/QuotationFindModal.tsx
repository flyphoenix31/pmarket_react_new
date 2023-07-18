import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setQuotationList } from '../store/slice/quotationSlice';
import { SearchSVG } from '../components/SVG';
import { isEmpty } from '../config';

const QuotationFindModal = ({ open, setOpen, handleSelect }) => {

    const [user, setUser] = useState({});
    const [search, setSearch] = useState('');

    const dispatch = useDispatch();  
    const quotationList = useSelector((state:any) => state.quotation.quotationList);

    useEffect(() => {
        if (open) {
            dispatch(setQuotationList());
        }
    }, [open])

    const handleClose = (event: any) => {
        event.preventDefault();
        setUser({})
        setSearch('')
        setOpen(false);
    }

    const viewList = quotationList.reduce((list, item) => {
        const picked =
            item.id.toString().toUpperCase().indexOf(search.toUpperCase()) >= 0
            // item.email.toUpperCase().indexOf(search.toUpperCase()) >= 0;
        if (picked) return [...list, item];
        return list;
    }, []);

    return (
        <>
            <div
                x-show="modalOpen"
                x-transition=""
                className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
                style={open ? {} : { display: 'none' }}
            // onClick={handleClose}
            >
                <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                    <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        Select client
                    </h3>
                    <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                    <div className="mb-5.5">
                        <div className="relative">
                            <span className="absolute left-4.5 top-4">
                                <SearchSVG />
                            </span>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="email"
                                name="search"
                                id="search"
                                value={search}
                                onChange={e => { e.preventDefault(); setSearch(e.target.value) }}
                                placeholder="Search with quotation id"
                            />
                        </div>
                    </div>
                    {
                        isEmpty(user) ? '' : (
                            <div className="mb-5.5">
                                <div className="rounded-sm border border-stroke bg-white py-3 shadow-default dark:border-strokedark dark:bg-boxdark px-6">
                                    <p className="font-medium text-black dark:text-white text-left">
                                        Id: {user.id}
                                    </p>
                                    {/* <p className="font-medium text-black dark:text-white text-left">
                                        Email: {user.email}
                                    </p> */}
                                </div>
                            </div>
                        )
                    }
                    <div className="mb-5.5">
                        <div
                            className="rounded-sm border border-stroke bg-white py-3 shadow-default dark:border-strokedark dark:bg-boxdark"
                            style={{ maxHeight: '300px', overflow: 'auto', minHeight: '300px' }}
                        >
                            {
                                viewList.map((item, index) => (
                                    <div key={index} className="flex justify-between gap-2.5 py-3 px-6 hover:bg-gray-2 dark:hover:bg-meta-4 sm:items-center sm:justify-start">
                                        <div className="sm:w-9/12 xl:w-9/12">
                                            <p className="font-medium text-black dark:text-white text-left">
                                                Id: {item.id}
                                            </p>
                                            {/* <p className="font-medium text-black dark:text-white text-left">
                                                Email: {item.email}
                                            </p> */}
                                        </div>

                                        <div className="text-right sm:w-3/12 xl:w-3/12">
                                            <button
                                                className="inline-flex rounded bg-primary py-1 px-3 font-medium text-white hover:bg-opacity-90 sm:py-2.5 sm:px-6"
                                                onClick={e => { e.preventDefault(); setUser(item) }}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="-mx-3 flex flex-wrap gap-y-4">
                        <div className="w-full px-3 2xsm:w-1/2">
                            <button
                                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="w-full px-3 2xsm:w-1/2">
                            <button
                                className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                                onClick={e=> {e.preventDefault(); setOpen(false); handleSelect(user)}}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

export default QuotationFindModal;