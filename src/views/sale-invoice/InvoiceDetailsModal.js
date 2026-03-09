import React from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CBadge,
  CListGroup,
  CListGroupItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilBuilding, 
  cilCalendar, 
  cilInfo,
  cilFile,
  cilHome,
  cilUser,
  cilCreditCard
} from '@coreui/icons';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';

const InvoiceDetailsModal = ({ visible, onClose, invoice, onDownload }) => {
  if (!invoice) return null;

  const isCancelled = invoice.status === 'cancelled';

  const getStatusBadge = (status) => {
    switch(status) {
      case 'cancelled':
        return <CBadge color="danger">Cancelled</CBadge>;
      default:
        return <CBadge color="warning">Generated</CBadge>;
    }
  };

  return (
    <CModal 
      visible={visible} 
      onClose={onClose}
      size="xl"
      scrollable
      alignment="center"
    >
     <CModalHeader 
  className={isCancelled ? 'bg-danger text-white' : 'text-white'} 
  style={!isCancelled ? { backgroundColor: '#2759a2' } : {}}
>
  <CModalTitle className="d-flex align-items-center">
    <CIcon icon={cilFile} className="me-2" />
    Invoice Details - {invoice?.invoiceNumber}
  </CModalTitle>
</CModalHeader>
      
      <CModalBody>
        {isCancelled && invoice?.cancellationDetails && (
          <CCard className="mb-4 border-danger">
            <CCardBody className="bg-light-danger">
              <CRow>
                <CCol md={12}>
                  <h6 className="text-danger mb-3">
                    <CIcon icon={cilInfo} className="me-2" />
                    Invoice Cancellation Details
                  </h6>
                  
                  <CRow>
                    <CCol md={6}>
                      <p className="mb-2">
                        <strong>Cancel Reason:</strong><br />
                        {invoice.cancellationDetails.cancelReason}
                      </p>
                    </CCol>
                    
                    <CCol md={6}>
                      <p className="mb-2">
                        <strong>Credit Note Option:</strong><br />
                        <CBadge color={invoice.cancellationDetails.cancelWithCreditNote ? 'success' : 'secondary'}>
                          {invoice.cancellationDetails.cancelWithCreditNote ? 'Yes - Cancel with credit note' : 'No - Without Credit Note'}
                        </CBadge>
                      </p>
                    </CCol>
                  </CRow>
                  
                  <CRow>
                    <CCol md={6}>
                      <p className="mb-2">
                        <strong>Cancelled By:</strong><br />
                        <CIcon icon={cilUser} className="me-1" />
                        {invoice.cancellationDetails.cancelledBy?.fullName || 
                         invoice.cancellationDetails.cancelledBy?.email || 
                         'Unknown User'}
                      </p>
                    </CCol>
                    
                    <CCol md={6}>
                      <p className="mb-2">
                        <strong>Cancelled On:</strong><br />
                        <CIcon icon={cilCalendar} className="me-1" />
                        {formatDateTime(invoice.cancellationDetails.cancelledAt)}
                      </p>
                    </CCol>
                  </CRow>

                  {invoice.cancellationDetails.cancelWithCreditNote && (
                    <CRow>
                      <CCol md={12}>
                        <p className="mb-0 text-success">
                          <CIcon icon={cilCreditCard} className="me-1" />
                          <strong>This invoice was cancelled with credit note</strong>
                        </p>
                      </CCol>
                    </CRow>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )}

        <CRow className="mb-4">
          <CCol md={4}>
            <CCard className="h-100 border-top-primary">
              <CCardBody>
                <div className="d-flex align-items-center mb-2">
                  <CIcon icon={cilBuilding} className="me-2 text-primary" size="lg" />
                  <h6 className="mb-0">Reseller Information</h6>
                </div>
                <hr className="mt-1 mb-2" />
                <p className="mb-1"><strong>Business Name:</strong> {invoice?.reseller?.businessName || 'N/A'}</p>
                <p className="mb-1"><strong>GST Number:</strong> {invoice?.reseller?.gstNumber || 'N/A'}</p>
                <p className="mb-0"><strong>Address:</strong> {invoice?.reseller?.address1 || 'N/A'}</p>
              </CCardBody>
            </CCard>
          </CCol>
          
          <CCol md={4}>
            <CCard className="h-100 border-top-success">
              <CCardBody>
                <div className="d-flex align-items-center mb-2">
                  <CIcon icon={cilHome} className="me-2 text-success" size="lg" />
                  <h6 className="mb-0">Centers</h6>
                </div>
                <hr className="mt-1 mb-2" />
                {invoice?.centers && invoice.centers.length > 0 ? (
                  <CListGroup flush>
                    {invoice.centers.map((center, index) => (
                      <CListGroupItem key={index} className="px-0 py-1 border-0">
                        <CIcon icon={cilBuilding} className="me-2 text-secondary" size="sm" />
                        {center?.centerName || 'N/A'}
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                ) : (
                  <p className="text-muted mb-0">No centers available</p>
                )}
              </CCardBody>
            </CCard>
          </CCol>
          
          <CCol md={4}>
            <CCard className="h-100 border-top-info">
              <CCardBody>
                <div className="d-flex align-items-center mb-2">
                  <CIcon icon={cilCalendar} className="me-2 text-info" size="lg" />
                  <h6 className="mb-0">Invoice Details</h6>
                </div>
                <hr className="mt-1 mb-2" />
                <p className="mb-1"><strong>Invoice Date:</strong> {formatDate(invoice?.invoiceDate)}</p>
                <p className="mb-1"><strong>Status:</strong> {getStatusBadge(invoice?.status)}</p>
                <p className="mb-0"><strong>Created:</strong> {formatDateTime(invoice?.createdAt)}</p>
                {invoice?.createdBy && (
                  <p className="mb-0 mt-1">
                    <small className="text-muted">
                      <CIcon icon={cilUser} size="sm" className="me-1" />
                      Created by: {invoice.createdBy.fullName || invoice.createdBy.email || 'Unknown'}
                    </small>
                  </p>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

InvoiceDetailsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func,
  invoice: PropTypes.shape({
    invoiceNumber: PropTypes.string,
    status: PropTypes.string,
    invoiceDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    createdBy: PropTypes.shape({
      fullName: PropTypes.string,
      email: PropTypes.string
    }),
    cancellationDetails: PropTypes.shape({
      cancelReason: PropTypes.string,
      cancelWithCreditNote: PropTypes.bool,
      cancelledAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      cancelledBy: PropTypes.shape({
        fullName: PropTypes.string,
        email: PropTypes.string
      })
    }),
    reseller: PropTypes.shape({
      businessName: PropTypes.string,
      gstNumber: PropTypes.string,
      address1: PropTypes.string
    }),
    centers: PropTypes.arrayOf(
      PropTypes.shape({
        centerName: PropTypes.string
      })
    )
  })
};

export default InvoiceDetailsModal;