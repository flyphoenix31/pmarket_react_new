import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb.js';
import { useNavigate, useParams } from 'react-router-dom';
import { getInvoicePreview } from '../store/slice/invoiceSlice.js';
import { getSetting } from '../store/slice/settingSlice.js';
import { isEmpty } from '../config/index.js';
import InvoicePreview from './InvoicePreview.js';
import QuotationPreview from './QuotationPreview.js';

const QuotationPreviewCli = () => {

  const dispatch = useDispatch();

  const { id } = useParams();
  const previewInvoice = useSelector((state) => state.invoice.previewInvoice);
  const previewType = useSelector((state) => state.invoice.previewType);
  const settingData = useSelector((state) => state.invoice.previewInvoice);

  useEffect(() => {
    dispatch(getInvoicePreview(id));
    dispatch(getSetting());
  }, [])

  let totalPrice = isEmpty(previewInvoice) || isEmpty(previewInvoice.items) ? 0 : previewInvoice.items.reduce((value, item) => value + (item.unit_price * item.quantity), 0);

  return (
    <>
      {
        isEmpty(previewInvoice) ? '' : (
          previewType === 'invoice' ? (
            <InvoicePreview
              company_name={previewInvoice.company_name}
              company_email={previewInvoice.company_email}
              company_phone={previewInvoice.company_phone}
              company_address={previewInvoice.company_address}
              client_name={previewInvoice.client_name}
              client_email={previewInvoice.client_email}
              client_phone={previewInvoice.client_phone}
              client_address={previewInvoice.client_address}
              invoice_number={previewInvoice.invoice_number}
              items={previewInvoice.items}
              totalPrice={previewInvoice.totalPrice}
              invoice_date={previewInvoice.invoice_date}
              due_date={previewInvoice.due_date}
              name={previewInvoice.name}
              notes={previewInvoice.notes}
              totalPrice={totalPrice}
              settingData={settingData}
            />) : (
            <QuotationPreview
              company_name={previewInvoice.company_name}
              company_email={previewInvoice.company_email}
              company_phone={previewInvoice.company_phone}
              company_address={previewInvoice.company_address}
              client_name={previewInvoice.client_name}
              client_email={previewInvoice.client_email}
              client_phone={previewInvoice.client_phone}
              client_address={previewInvoice.client_address}
              items={previewInvoice.items}
              totalPrice={previewInvoice.totalPrice}
              name={previewInvoice.name}
              notes={previewInvoice.notes}
              totalPrice={totalPrice}
            />
          )
        )
      }
    </>
  );
};

export default QuotationPreviewCli;