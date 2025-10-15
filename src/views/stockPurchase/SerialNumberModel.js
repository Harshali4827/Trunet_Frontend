import React, { useState, useEffect } from 'react';
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter} from '@coreui/react';
import PropTypes from 'prop-types';

const SerialNumberModal = ({ visible, onClose, product, selectedRow, onSave }) => {
  const [serialText, setSerialText] = useState('');

  useEffect(() => {
    if (selectedRow && selectedRow.serialNumbers) {
      setSerialText(selectedRow.serialNumbers.join('\n'));
    } else {
      setSerialText('');
    }
  }, [selectedRow, visible]);

  const handleSave = () => {
    if (product) {
      onSave(product._id, serialText);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Serial Number for {product?.productTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className='form-label' htmlFor="serialNumbers">
              Serial Numbers
            </label>
            <textarea
              id="serialNumbers"
              name="serialNumbers"
              className='form-textarea'
              value={serialText}
              onChange={(e) => setSerialText(e.target.value)}
              rows="6"
              placeholder="Enter one serial number per line"
            />
          </div>
        </div>
        <div className="serial-info">
          <p className="text-muted">Please provide one serial number per line.</p>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
        <CButton className="btn-primary" onClick={handleSave}>
          Save Serial Numbers
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

SerialNumberModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    productTitle: PropTypes.string
  }),
  selectedRow: PropTypes.shape({
    quantity: PropTypes.number,
    serialNumbers: PropTypes.arrayOf(PropTypes.string)
  }),
  onSave: PropTypes.func.isRequired
};

export default SerialNumberModal;