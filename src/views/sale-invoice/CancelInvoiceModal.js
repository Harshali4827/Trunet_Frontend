import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Add this import
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheck } from '@coreui/icons';

const CancelInvoiceModal = ({ visible, onClose, onConfirm, invoice }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [cancelWithCreditNote, setCancelWithCreditNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!cancelReason.trim()) {
      setError('Please enter a reason for cancellation');
      return;
    }

    if (cancelWithCreditNote === '') {
      setError('Please select whether to cancel with credit note');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirm({
        cancelReason: cancelReason.trim(),
        cancelWithCreditNote: cancelWithCreditNote === 'yes'
      });
      setCancelReason('');
      setCancelWithCreditNote('');
      setError('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to cancel invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCancelReason('');
    setCancelWithCreditNote('');
    setError('');
    onClose();
  };

  return (
    <CModal 
      visible={visible} 
      onClose={handleClose}
      size="lg"
      alignment="center"
    >
      <CModalHeader>
        <CModalTitle>Cancel Invoice</CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        {invoice && (
          <div className="mb-3 p-2 bg-light rounded">
            <div className="d-flex justify-content-between">
              <span><strong>Invoice No:</strong> {invoice.invoiceNumber}</span>
              <span><strong>Reseller:</strong> {invoice.reseller?.businessName || 'N/A'}</span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</span>
              <span><strong>Amount:</strong> ₹{invoice.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        )}

        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="cancelReason">
              Cancel Reason <span className="text-danger">*</span>
            </CFormLabel>
            <CFormTextarea
              id="cancelReason"
              rows="3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="cancelWithCreditNote">
              Cancel with Credit Note <span className="text-danger">*</span>
            </CFormLabel>
            <CFormSelect
              id="cancelWithCreditNote"
              value={cancelWithCreditNote}
              onChange={(e) => setCancelWithCreditNote(e.target.value)}
              disabled={loading}
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </CFormSelect>
          </div>

          {error && (
            <CAlert color="danger" className="d-flex align-items-center">
              <CIcon icon={cilWarning} className="me-2" />
              {error}
            </CAlert>
          )}
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </CButton>
        <CButton 
          className='reset-button' 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Cancelling...' : 'Cancel Invoice'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

CancelInvoiceModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  invoice: PropTypes.shape({
    invoiceNumber: PropTypes.string,
    reseller: PropTypes.shape({
      businessName: PropTypes.string
    }),
    invoiceDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    totalAmount: PropTypes.number
  })
};

export default CancelInvoiceModal;