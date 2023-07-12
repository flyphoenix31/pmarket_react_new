import { useState, useEffect } from 'react';
import { isEmpty } from '../config';
import moment from 'moment';

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
    settingData
}) => {

    return (
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9" style={{ overflow: 'auto' }}>
            <div className="w-full bg-white mx-auto" style={{ width: '595px', minHeight: '842px', position: 'relative' }}>
                <div className='w-full bg-success px-10 py-7 flex' style={{ color: 'white', fontFamily: 'Arial' }}>
                    <div style={{ width: '75%' }} className='flex'>
                        <h4 className='text-lg font-medium text-white my-auto' style={{ fontSize: '30px' }}>{isEmpty(name) ? 'Invoice title' : name}</h4>
                    </div>
                    <div style={{ width: '25%' }}>
                        <div className='flex'>
                            <p style={{ fontSize: '15px' }} className='ml-auto'># {isEmpty(invoice_number) ? 'Number' : invoice_number}</p>
                        </div>
                        <div className='flex'>
                            <p style={{ fontSize: '15px' }} className='ml-auto'>From: {isEmpty(invoice_date) ? 'No data' : moment(invoice_date).format('DD/MM/YYYY')}</p>
                        </div>
                        <div className='flex'>
                            <p style={{ fontSize: '15px' }} className='ml-auto'>To: {isEmpty(due_date) ? 'No data' : moment(due_date).format('DD/MM/YYYY')}</p>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', textAlign: 'center' }}>
                    <h1 style={{ color: 'rgba(0,0,0,0.05)', fontSize: '200px', transform: 'rotate(-45deg)', fontFamily: 'Arial' }}>Invoice</h1>
                </div>
                <div className='w-full px-10 py-8'>
                    <div className='text-success sm:flex-row flex mb-8'>
                        <div className='w-full sm:w-1/2'>
                            <p className='text-lg mb-3' style={{ fontSize: '20px' }}>From</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(company_name) ? 'Company name' : company_name}</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(company_email) ? 'Company email' : company_email}</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(company_address) ? 'Company address' : company_address}</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(company_phone) ? 'Company phone' : company_phone}</p>
                        </div>
                        <div className='w-full sm:w-1/2'>
                            <p className='text-lg mb-3' style={{ fontSize: '20px' }}>To</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(client_name) ? 'Client name' : client_name}</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(client_email) ? 'Client email' : client_email}</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(client_address) ? 'Client address' : client_address}</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>{isEmpty(client_phone) ? 'Client phone' : client_phone}</p>
                        </div>
                    </div>
                    <div className='text-success sm:flex-row flex mb-8'>
                        <div className='w-full'>
                            <p className='text-lg mb-3' style={{ fontSize: '20px' }}>Job Information</p>
                            <table className='w-full text-black text-center'>
                                <tbody>
                                    <tr className='text-success'>
                                        <th className='text-left'>Item</th>
                                        <th>Rate</th>
                                        <th>QTY</th>
                                        <th className='text-right'>Price</th>
                                    </tr>
                                    {
                                        items.map((item, index) => (
                                            <tr className='mb-2' key={index}>
                                                <td className='text-left'>{isEmpty(item.description) ? 'No data' : item.description}</td>
                                                <td>${Number(item.unit_price).toFixed(2)}</td>
                                                <td>{Number(item.quantity)}</td>
                                                <td className='text-right'>${Number(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <table className='text-right ml-auto mt-3'>
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
                            </table>
                            {/* <p className='text-lg text-black' style={{ fontSize: '16px' }}>Pmarket company</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>company@company.com</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>company address</p>
                            <p className='text-lg text-black' style={{ fontSize: '16px' }}>(537) 604-9291</p> */}
                        </div>
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