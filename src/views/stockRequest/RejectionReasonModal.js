// import React, { useState } from 'react';
// import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormTextarea } from '@coreui/react';
// import PropTypes from 'prop-types';
// import '../../css/form.css';
// const RejectionReasonModal = ({ visible, onClose, onSubmit }) => {
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = () => {
//     if (!rejectionReason.trim()) {
//       setError('Rejection reason is required');
//       return;
//     }
    
//     onSubmit(rejectionReason);
//     setRejectionReason('');
//     setError('');
//   };

//   const handleClose = () => {
//     setRejectionReason('');
//     setError('');
//     onClose();
//   };

//   return (
//     <CModal visible={visible} onClose={handleClose}>
//       <CModalHeader>
//         <CModalTitle>Reject Stock Request</CModalTitle>
//       </CModalHeader>
//       <CModalBody>
//         <div className="mb-3">
//           <label htmlFor="rejectionReason" className="form-label">
//             Reason for Rejection <span className='required'>*</span>
//           </label>
//           <CFormTextarea
//             id="rejectionReason"
//             value={rejectionReason}
//             onChange={(e) => {
//               setRejectionReason(e.target.value);
//               if (error) setError('');
//             }}
//             placeholder="Please provide a reason for rejecting this stock request..."
//             rows={4}
//             className={error ? 'is-invalid' : ''}
//           />
//           {error && <div className="invalid-feedback">{error}</div>}
//         </div>
//       </CModalBody>
//       <CModalFooter className='form-footer'>
//         <CButton color="secondary" onClick={handleClose}>
//           Cancel
//         </CButton>
//         <CButton className='submit-button' onClick={handleSubmit}>
//           Reject Request
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   );
// };

// RejectionReasonModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
// };

// export default RejectionReasonModal;




import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormSelect, CFormTextarea } from '@coreui/react';
import PropTypes from 'prop-types';
import '../../css/form.css';

const RejectionReasonModal = ({ visible, onClose, onSubmit }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const rejectionOptions = [
    { value: '', label: 'Select a reason...' },
    { value: 'No consumption/Usage added', label: 'No consumption/Usage added' },
    { value: 'Wrong request', label: 'Wrong request' },
    { value: 'Select appropriate warehouse and raise request again', label: 'Select appropriate warehouse and raise request again' },
    { value: 'Share one request at a time with all required items', label: 'Share one request at a time with all required items' },
    { value: 'other', label: 'other' }
  ];

  const handleSubmit = () => {
    let finalReason = rejectionReason;
    if (rejectionReason === 'other') {
      if (!customReason.trim()) {
        setError('Please provide the rejection reason');
        return;
      }
      finalReason = customReason;
    } else if (!rejectionReason) {
      setError('Please select a rejection reason');
      return;
    }

    onSubmit(finalReason);
    setRejectionReason('');
    setCustomReason('');
    setError('');
  };

  const handleClose = () => {
    setRejectionReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  const handleReasonChange = (value) => {
    setRejectionReason(value);
    if (error) setError('');
  };

  return (
    <CModal visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Reject Stock Request</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <label htmlFor="rejectionReason" className="form-label">
          Reason for Reject <span className='required'>*</span>
          </label>
          <CFormSelect
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => handleReasonChange(e.target.value)}
            className={error && !customReason ? 'is-invalid' : ''}
          >
            {rejectionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>
          {error && !customReason && <div className="invalid-feedback">{error}</div>}
        </div>
        {rejectionReason === 'other' && (
          <div className="mb-3">
            <label htmlFor="customReason" className="form-label">
              Please specify reason <span className='required'>*</span>
            </label>
            <CFormTextarea
              id="customReason"
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Please provide the specific reason for rejection..."
              rows={3}
              className={error ? 'is-invalid' : ''}
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>
        )}
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