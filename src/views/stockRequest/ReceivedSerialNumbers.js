import React, { useState, useEffect } from 'react';
import { 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter, 
  CButton, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell,
  CBadge,
  CSpinner,
  CAlert
} from '@coreui/react';
import PropTypes from 'prop-types';

const ReceivedSerialNumbers = ({ 
  visible, 
  onClose, 
  product
}) => {
  const [loading, setLoading] = useState(false);
  const [serialDetails, setSerialDetails] = useState([]);

  useEffect(() => {
    if (visible && product) {
      // Process serial details from the product data
      processSerialDetails();
    }
  }, [visible, product]);

  const processSerialDetails = () => {
    if (!product) return;

    const details = [];
    
    // Get transferred serials from the product
    const transferredSerials = product.transferredSerials || [];
    const centerStockSerials = product.centerStockSerials?.allSerials || [];
    
    // For each transferred serial, find its details
    transferredSerials.forEach(serialNumber => {
      const serialDetail = centerStockSerials.find(s => s.serialNumber === serialNumber);
      
      if (serialDetail) {
        details.push({
          serialNumber: serialDetail.serialNumber,
          status: serialDetail.status || 'transferred',
          currentLocation: serialDetail.currentLocation,
          transferredDate: serialDetail.transferredDate,
          source: getSourceFromTransferHistory(serialDetail.transferHistory),
          transferHistory: serialDetail.transferHistory || []
        });
      } else {
        // If not found in center stock, it might be with reseller
        details.push({
          serialNumber,
          status: 'transferred',
          currentLocation: 'Reseller',
          transferredDate: null,
          source: 'Unknown',
          transferHistory: []
        });
      }
    });

    setSerialDetails(details);
  };

  const getSourceFromTransferHistory = (transferHistory) => {
    if (!transferHistory || transferHistory.length === 0) return 'Unknown';
    
    const lastTransfer = transferHistory[transferHistory.length - 1];
    
    if (lastTransfer.transferType === 'inbound_transfer') {
      return 'Outlet';
    } else if (lastTransfer.transferType === 'center_to_reseller_return') {
      return 'Reseller';
    }
    
    return 'Unknown';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <CBadge color="success">Available</CBadge>;
      case 'transferred':
        return <CBadge color="info">Transferred</CBadge>;
      case 'consumed':
        return <CBadge color="warning">Consumed</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case 'Outlet':
        return <CBadge color="primary">Outlet</CBadge>;
      case 'Reseller':
        return <CBadge color="info">Reseller</CBadge>;
      default:
        return <CBadge color="secondary">{source}</CBadge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (!product) return null;

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
         Serial Numbers for {product?.product?.productTitle}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {loading ? (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <div className="mt-2">Loading serial numbers...</div>
          </div>
        ) : (
          <>
            {serialDetails.length === 0 ? (
              <CAlert color="info">
                No transferred serial numbers found for this product.
              </CAlert>
            ) : (
              <CTable bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell width="15%">SR No.</CTableHeaderCell>
                    <CTableHeaderCell width="25%">Serial Number</CTableHeaderCell>
                    <CTableHeaderCell width="20%">Source</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {serialDetails.map((serial, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <strong>{index + 1}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{serial.serialNumber}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getSourceBadge(serial.source)}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

ReceivedSerialNumbers.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    product: PropTypes.shape({
      _id: PropTypes.string,
      productTitle: PropTypes.string,
      productCode: PropTypes.string,
      trackSerialNumber: PropTypes.string
    }),
    approvedQuantity: PropTypes.number,
    receivedQuantity: PropTypes.number,
    transferredSerials: PropTypes.arrayOf(PropTypes.string),
    sourceBreakdown: PropTypes.shape({
      fromReseller: PropTypes.shape({
        quantity: PropTypes.number,
        serials: PropTypes.array
      }),
      fromOutlet: PropTypes.shape({
        quantity: PropTypes.number,
        serials: PropTypes.array
      })
    }),
    centerStockSerials: PropTypes.shape({
      allSerials: PropTypes.array
    })
  })
};

ReceivedSerialNumbers.defaultProps = {
  product: null
};

export default ReceivedSerialNumbers;