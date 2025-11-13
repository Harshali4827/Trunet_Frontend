import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CFormTextarea
} from '@coreui/react';

const InvoiceModal = ({ visible, onClose, onGenerate, selectedChallansCount }) => {
  const [invoiceFields, setInvoiceFields] = useState({
    deliveryNote: '',
    modeOfPayment: '',
    referenceNo: '',
    referenceDate: '',
    otherReferences: '',
    buyerOrderNo: '',
    buyerOrderDate: '',
    dispatchDocNo: '',
    deliveryNoteDate: '',
    dispatchedThrough: '',
    destination: '',
    termsOfDelivery: ''
  });

  const handleInputChange = (field, value) => {
    setInvoiceFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    onGenerate(invoiceFields);
    setInvoiceFields({
      deliveryNote: '',
      modeOfPayment: '',
      referenceNo: '',
      referenceDate: '',
      otherReferences: '',
      buyerOrderNo: '',
      buyerOrderDate: '',
      dispatchDocNo: '',
      deliveryNoteDate: '',
      dispatchedThrough: '',
      destination: '',
      termsOfDelivery: ''
    });
  };

  const handleClose = () => {
    setInvoiceFields({
      deliveryNote: '',
      modeOfPayment: '',
      referenceNo: '',
      referenceDate: '',
      otherReferences: '',
      buyerOrderNo: '',
      buyerOrderDate: '',
      dispatchDocNo: '',
      deliveryNoteDate: '',
      dispatchedThrough: '',
      destination: '',
      termsOfDelivery: ''
    });
    onClose();
  };

  return (
    <CModal visible={visible} onClose={handleClose} size="lg">
      <CModalHeader>
        <CModalTitle>Generate Invoice - {selectedChallansCount} Challan(s) Selected</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Delivery Note</CFormLabel>
            <CFormInput
              type="text"
              value={invoiceFields.deliveryNote}
              onChange={(e) => handleInputChange('deliveryNote', e.target.value)}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Mode/Terms of Payment</CFormLabel>
            <CFormInput
              type="text"
              value={invoiceFields.modeOfPayment}
              onChange={(e) => handleInputChange('modeOfPayment', e.target.value)}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Reference No.</CFormLabel>
            <CFormInput
              type="text"
              value={invoiceFields.referenceNo}
              onChange={(e) => handleInputChange('referenceNo', e.target.value)}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Reference Date</CFormLabel>
            <CFormInput
              type="date"
              value={invoiceFields.referenceDate}
              onChange={(e) => handleInputChange('referenceDate', e.target.value)}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={12}>
            <CFormLabel>Other References</CFormLabel>
            <CFormTextarea
              value={invoiceFields.otherReferences}
              onChange={(e) => handleInputChange('otherReferences', e.target.value)}
              rows={2}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Buyer&apos;s Order No.</CFormLabel>
            <CFormInput
              type="text"
              value={invoiceFields.buyerOrderNo}
              onChange={(e) => handleInputChange('buyerOrderNo', e.target.value)}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Order Date</CFormLabel>
            <CFormInput
              type="date"
              value={invoiceFields.buyerOrderDate}
              onChange={(e) => handleInputChange('buyerOrderDate', e.target.value)}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Dispatch Document No.</CFormLabel>
            <CFormInput
              type="text"
              value={invoiceFields.dispatchDocNo}
              onChange={(e) => handleInputChange('dispatchDocNo', e.target.value)}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Delivery Note Date</CFormLabel>
            <CFormInput
              type="date"
              value={invoiceFields.deliveryNoteDate}
              onChange={(e) => handleInputChange('deliveryNoteDate', e.target.value)}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Dispatched Through</CFormLabel>
            <CFormInput
              type="text"
              value={invoiceFields.dispatchedThrough}
              onChange={(e) => handleInputChange('dispatchedThrough', e.target.value)}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Destination</CFormLabel>
            <CFormInput
              type="text"
              value={invoiceFields.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={12}>
            <CFormLabel>Terms of Delivery</CFormLabel>
            <CFormTextarea
              value={invoiceFields.termsOfDelivery}
              onChange={(e) => handleInputChange('termsOfDelivery', e.target.value)}
              rows={2}
            />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleGenerate}
          disabled={selectedChallansCount === 0}
        >
          Generate Invoice
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

InvoiceModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
    selectedChallansCount: PropTypes.number.isRequired,
  };

export default InvoiceModal;