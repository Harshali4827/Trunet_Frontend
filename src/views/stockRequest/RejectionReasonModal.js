import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormTextarea } from '@coreui/react';
import PropTypes from 'prop-types';
import '../../css/form.css';
const RejectionReasonModal = ({ visible, onClose, onSubmit }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    
    onSubmit(rejectionReason);
    setRejectionReason('');
    setError('');
  };

  const handleClose = () => {
    setRejectionReason('');
    setError('');
    onClose();
  };

  return (
    <CModal visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Reject Stock Request</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <label htmlFor="rejectionReason" className="form-label">
            Reason for Rejection <span className='required'>*</span>
          </label>
          <CFormTextarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="Please provide a reason for rejecting this stock request..."
            rows={4}
            className={error ? 'is-invalid' : ''}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </CModalBody>
      <CModalFooter className='form-footer'>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton className='submit-button' onClick={handleSubmit}>
          Reject Request
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

RejectionReasonModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RejectionReasonModal;