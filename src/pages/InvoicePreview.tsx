import { useState, useEffect, useRef } from 'react';
import {serverURL ,isEmpty } from '../config';
import { onSum } from '../utils';
import moment from 'moment';
import invoice_imgInit from '../images/invoice/threestudio.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateInvoicePreview } from '../store/slice/invoiceSlice.js'
import TotalpriceImg from '../images/task/totalprice.png'
import { getRoleInfo } from '../utils';
const InvoicePreview = ({
    name,
    company_name,
    company_email,
    company_phone,
    company_address,
    client_name,
    client_email,
    client_phone,
    client_address,
    invoice_number,
    items,
    totalPrice,
    invoice_date,
    due_date,
    bank_name,
    account_number,
    swift_code,
    country,
    notes,
    settingData,
    invoice_img,
}) => {
    // const [invoice_flag , setInvoiceFlag ] = useState(false);
    const userinfo = useSelector((state: any) => state.auth.userInfo);
    let data = { role: "invoice_preview", roleid: userinfo.role_id };

    console.log("----setttingData", settingData);



    const fileUpload = useRef(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [mcompany_address , setAddress] = useState('');
    const [mcompany_phone, setPhone] = useState('');
    const [mcompany_email, setEmail] = useState('');
    const [editIndex, setEditIndex] = useState(-1);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { id } = useParams();
    useEffect(() => {
        if (!isEmpty(settingData)) {
            setImgPreview(serverURL + settingData.site_logo);
        }
      }, [])
    
    useEffect(() => {
        setAddress(settingData.company_address);
        setPhone(settingData.company_phone);
        setEmail(settingData.company_email);
    }, [])
    
      const handleUpload = (event: any) => {
        event.preventDefault();
        fileUpload.current.click();
      }
    
      const handleImage = (event: any) => {
        event.preventDefault();
        if (isEmpty(event.target) || isEmpty(event.target.files))
          return;
        const file = event.target.files[0];
        setImgFile(file);
        setImgPreview(URL.createObjectURL(file));
      }
    
      const handleSubmit = (event: any) => {
        event.preventDefault();
    
        const formData = new FormData();
        if (imgFile !== null) formData.append('invoice_img', imgFile);
        formData.append("id", id);
        formData.append('company_address', mcompany_address);
        formData.append('company_phone', mcompany_phone);
        formData.append('company_email', mcompany_email);
        console.log("formdata", formData);
        dispatch(updateInvoicePreview(formData));
        navigate('/member/invoice');
      }
    
      const handleClose = (event: any) => {
        event.preventDefault();
        navigate('/member/users');
      }
    return (
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-9 xl:p-9" style={{ overflow: 'auto',paddingTop:'5.5rem' }}>
            <div className="w-full bg-white mx-auto" style={{minHeight: '842px', position: 'relative' }}>
                <div className='w-full pl-9 py-7 flex justify-between topnonedeflex' style={{ color: 'white', fontFamily: 'Arial', backgroundColor:'rgb(88,104,122)' ,paddingTop:'2.5rem'}}>
                    <div>
                        <div className='flex'>
                            {/* <h4 className='text-lg font-medium text-white my-auto' style={{ fontSize: '30px',fontWeight:'bold' }}>PMARKET STUDIO</h4> */}
                            <div className="p-7.5">
                                <form action="#" className='flex' onSubmit={handleSubmit}>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="h-14 rounded-full">
                                            <img src={isEmpty('imgPreview') ? invoice_imgInit : imgPreview} alt="User" style={{height: '100px' }} />
                                        </div>
                                    </div>
                               
                                    {/* <div className='flex'>
                                        <div
                                            id="FileUpload"
                                            // className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                                        >
                                            <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileUpload}
                                            onChange={handleImage}
                                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                            style={{ display: 'none' }}
                                            />
                                            <div className="flex flex-col items-center justify-center space-y-3" onClick={handleUpload}>
                                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                    <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                                                type="submit"
                                                >
                                                Save
                                            </button>
                                        </div> 
                                    </div> */}
                                        
                                    
                                </form>
                            </div>
                        </div>
                        <div>
                            {/* <div className='flex'>
                                <p style={{ fontSize: '20px' }} className='mt-3'># {isEmpty(invoice_number) ? 'Number' : invoice_number}</p>
                            </div>
                            <div className='flex'>
                                <p style={{ fontSize: '20px' }}>From: {isEmpty(invoice_date) ? 'No data' : moment(invoice_date).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className='flex'>
                                <p style={{ fontSize: '20px' }}>To: {isEmpty(due_date) ? 'No data' : moment(due_date).format('DD/MM/YYYY')}</p>
                            </div> */}
                          
                            {/* <div style={{display:'inline-grid'}}>
                                <input
                                className="rounded border py-2 px-5 my-0" style={{background:'rgb(88, 100, 122)', outline:'none',fontSize:'18px'}}
                                type="text"
                                name="invoice_address"
                                id="invoice_address"
                                value={mcompany_address}
                                onChange={e => { e.preventDefault(); setAddress(e.target.value); setEditIndex(1);}}
                                placeholder="Please enter address"
                                />
                                <input
                                className="rounded border py-2 px-5 my-2" style={{background:'rgb(88, 100, 122)', outline:'none',fontSize:'18px'}}
                                type="text"
                                name="company_phone"
                                id="company_phone"
                                value={mcompany_phone}
                                onChange={e => { e.preventDefault(); setPhone(e.target.value);setEditIndex(1);}}
                                placeholder="Please enter phone number"
                                />
                                <input
                                className="rounded border py-2 px-5 my-0" style={{background:'rgb(88, 100, 122)', outline:'none',fontSize:'18px'}}
                                type="text"
                                name="company_email"
                                id="company_email"
                                value={mcompany_email}
                                onChange={e => { e.preventDefault(); setEmail(e.target.value); setEditIndex(1);}}
                                placeholder="Please enter email address"
                                />
                            </div> */}
                            <div>
                                <p style={{ fontSize: '20px', padding:'5px' }} className='mt-3'>{isEmpty(mcompany_address) ? 'Company address' : mcompany_address}</p>
                                <p style={{ fontSize: '20px', padding:'5px' }}>{isEmpty(mcompany_phone) ? 'Company phone' : mcompany_phone}</p>
                                <p style={{ fontSize: '20px', padding:'5px' }}>{isEmpty(mcompany_email) ? 'Company email' : mcompany_email}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{alignSelf:'center'}} className='mt-6.5'>
                        <div style={{ padding:'10px 70px 10px 30px', background:'rgb(245, 132, 61)', fontSize:'22px'}}>INVOICE
                        </div>
                        <div className='flex'>
                            <p style={{ fontSize: '20px', marginLeft:'45px'}} className='mt-3'>1003 ID</p>
                        </div>
                    </div>
                </div>
                <div className='w-full pl-9 py-8' style={{marginTop:'3.5rem', marginBottom: '3.5rem'}}>
                    <div className='text-success sm:flex-row flex'>
                        <div className='w-full sm:w-9/12'>
                            <p className='text-lg mb-3' style={{ fontSize: '23px',backgroundColor:'rgb(88,104,122)', fontWeight:'bold', color:'white', padding:'10px 25px', textAlign:'center' }}>CLIENT INFORMATION</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)',fontWeight:'500', paddingLeft:'25px' }}>MIRO IS HERE</p>
                            <p className='text-lg mb-2.5' style={{ fontSize: '19px',color:'rgb(88,104,122)',fontWeight:'500', paddingLeft:'25px' }}>UKRIANE</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)',fontWeight:'500', paddingLeft:'25px' }}>{isEmpty(client_phone) ? 'Client phone' : client_phone}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)',fontWeight:'500', paddingLeft:'25px' }}>{isEmpty(client_email) ? 'Client email' : client_email}</p>
                        </div>
                        <div className='w-full' style={{textAlign:'right'}}>
                            <p className='text-lg' style={{ fontSize: '21px', fontWeight:'bold', color:'rgb(88,104,122)'}}>DATE</p>
                            <p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)' }}>{isEmpty(invoice_date) ? 'No data' : moment(invoice_date).format('YYYY/MM/DD')}</p>
                            {/* <p className='text-lg' style={{ fontSize: '19px' }}>{isEmpty(company_email) ? 'Company email' : company_email}</p>
                            <p className='text-lg' style={{ fontSize: '19px' }}>{isEmpty(company_address) ? 'Company address' : company_address}</p>
                            <p className='text-lg' style={{ fontSize: '19px' }}>{isEmpty(company_phone) ? 'Company phone' : company_phone}</p> */}
                        </div>
                    </div>
                    {/* <div className='text-success sm:flex-row flex mb-8 mt-15'>
                        <div className='w-full sm:w-9/12'>
                            <p className='text-lg mb-3' style={{ fontSize: '23px',backgroundColor:'rgb(88,104,122)', fontWeight:'bold', color:'white', padding:'10px 25px', textAlign:'center' }}>SERVICE INFORMATION</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(client_name) ? 'Client name' : client_name}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(client_email) ? 'Client email' : client_email}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(client_address) ? 'Client address' : client_address}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(client_phone) ? 'Client phone' : client_phone}</p>
                        </div>
                        <div className='w-full' style={{textAlign:'right'}}>
                           <p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)'}}>QIY</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_name) ? 'Company name' : company_name}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_email) ? 'Company email' : company_email}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_address) ? 'Company address' : company_address}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_phone) ? 'Company phone' : company_phone}</p>
                        </div>
                        <div className='w-full' style={{textAlign:'right'}}>
                           <p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)'}}>ESTIMATED COST</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_name) ? 'Company name' : company_name}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_email) ? 'Company email' : company_email}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_address) ? 'Company address' : company_address}</p>
                            <p className='text-lg' style={{ fontSize: '19px',color:'rgb(88,104,122)' }}>{isEmpty(company_phone) ? 'Company phone' : company_phone}</p>
                        </div>
                    </div> */}
                    <div className='text-success sm:flex-row mt-15'>
                        <div className='flex'>
                            <div className='w-full' style={{width:'70rem'}}> <p className='text-lg mb-3' style={{ fontSize: '23px',backgroundColor:'rgb(88,104,122)', fontWeight:'bold', color:'white', padding:'10px 25px', textAlign:'center' }}>SERVICE INFORMATION</p> </div>
                            <div className='w-full' style={{textAlign:'center'}}><p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)', fontWeight:'500'}}>QIY</p></div>
                            <div className='w-full' style={{textAlign:'right'}}><p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)', fontWeight:'500'}}>ESTIMATED COST</p></div>
                        </div>
                        <div>
                            <table className='w-full text-black text-center'>
                                <tbody>
                                    {
                                        items.map((item, index) => (
                                            <tr className='mb-2' key={index} style={{borderBottom:'1px solid'}}>
                                                <td className='text-left'  style={{width:'43%',fontSize:'20px',padding:'6px 0px', fontWeight:'500', color:'rgb(88, 104, 122)'}}>{isEmpty(item.description) ? 'No data' : item.description}</td>
                                                {/* <td>${Number(item.unit_price).toFixed(2)}</td> */}
                                                <td style={{fontSize:'20px',padding:'6px 0px', fontWeight:'500', color:'rgb(88, 104, 122)', width:'30%', textAlign:'center'}}>{Number(item.quantity)}</td>
                                                <td className='text-right' style={{fontSize:'20px',padding:'6px 0px', fontWeight:'500', color:'rgb(88, 104, 122)'}}>{Number(Number(item.unit_price) * Number(item.quantity))}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {/* <table className='text-right ml-auto mt-3'>
                                <tbody>
                                    <tr>
                                        <th className='text-right'>Subtotal:</th>
                                        <td className='text-black'>${totalPrice}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-right'>Discount:</th>
                                        <td className='text-black'>$0</td>
                                    </tr>
                                    <tr>
                                        <th className='text-right'>Tax:</th>
                                        <td className='text-black'>$0</td>
                                    </tr>
                                    <tr>
                                        <th className='text-right'>Total:</th>
                                        <td className='text-black'>${totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table> */}

                        </div>
                        <div className='flex mt-15'>
                            <div className='w-full' style={{textAlign:'left',paddingLeft:'25px'}}></div>
                            <div className='w-full' style={{textAlign:'center', position:'relative'}}>
                                <img src={TotalpriceImg} alt="totalprice.png" />
                                <p className='text-lg totalprice'>
                                    {   
                                        onSum(items)
                                    }
                                </p>
                            </div>
                        </div>
                        <div className='flex mt-15'>
                            <div className='w-full'>
                                <div className='w-full' style={{textAlign:'left',paddingLeft:'25px'}}><p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)', fontWeight:'bold'}}>CREATED BY</p></div>
                                <div className='w-full' style={{textAlign:'left',paddingLeft:'25px'}}><p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)', fontWeight:'500'}}> </p></div>

                            </div>
                            <div className='w-full' style={{textAlign:'center'}}><p className='text-lg' style={{ fontSize: '19px', color:'rgb(88,104,122)', fontWeight:'bolder'}}>AUTHORIZED SIGNATURE</p></div>
                        </div>
                            {/* <p className='text-lg text-black' style={{ fontSize: '19px' }}>Pmarket company</p>
                            <p className='text-lg text-black' style={{ fontSize: '19px' }}>company@company.com</p>
                            <p className='text-lg text-black' style={{ fontSize: '19px' }}>company address</p>
                            <p className='text-lg text-black' style={{ fontSize: '19px' }}>(537) 604-9291</p> */}
                       
                    </div>

                    <div className='text-success sm:flex-row flex mb-8'>
                        <div className='w-full sm:w-1/2'>
                            <p className='text-lg mb-3' style={{ fontSize: '20px' }}>Bank information</p>
                            <p className='text-black'><span className='text-success'>Bank:</span> {isEmpty(settingData) || isEmpty(settingData.bank_name) ? 'Bank name' : settingData.bank_name}</p>
                            <p className='text-black'><span className='text-success'>Account Number:</span> {isEmpty(settingData) || isEmpty(settingData.account_number) ? 'Number' : settingData.account_number}</p>
                            <p className='text-black'><span className='text-success'>Code:</span> {isEmpty(settingData) || isEmpty(settingData.bank_code) ? 'Swift code' : settingData.bank_code}</p>
                            <p className='text-black'><span className='text-success'>Country:</span> {isEmpty(settingData) || isEmpty(settingData.bank_country) ? 'Country' : settingData.bank_country}</p>
                        </div>
                        <div className='w-full sm:w-1/2'>
                            <p className='text-lg mb-3' style={{ fontSize: '20px' }}>Note</p>
                            <p className='text-black'>{isEmpty(notes) ? 'Notes here' : notes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoicePreview;