// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CFormInput,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
// } from '@coreui/react';
// import Swal from 'sweetalert2';
// import axiosInstance from 'src/axiosInstance';

// const RepairStatusModal = ({
//   visible,
//   onClose,
//   product,
//   approvedQty,
//   onSerialNumbersUpdate,
//   warehouseId,
// }) => {
//   const [serialList, setSerialList] = useState([]);
//   const [selectedSerials, setSelectedSerials] = useState([]);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     if (visible && product?.product?._id) {
//       fetchSerialNumbers(product.product._id);
//     }
//   }, [visible]);

//   const fetchSerialNumbers = async (productId) => {
//     try {
//       const response = await axiosInstance.get(`/faulty-stock/serials/${productId}`);
//       if (response.data.success) {
//         setSerialList(response.data.data.serialNumbers || []);
//       } else {
//         Swal.fire('Error', response.data.message || 'Failed to load serial numbers', 'error');
//       }
//     } catch (error) {
//       console.error('Error fetching serial numbers:', error);
//       Swal.fire('Error', 'Failed to fetch serial numbers', 'error');
//     }
//   };

//   const handleSelect = (serial) => {
//     setSelectedSerials((prev) =>
//       prev.some((s) => s.serialNumber === serial.serialNumber)
//         ? prev.filter((s) => s.serialNumber !== serial.serialNumber)
//         : [...prev, serial]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedSerials.length === serialList.length) {
//       setSelectedSerials([]);
//     } else {
//       setSelectedSerials(serialList);
//     }
//   };

//   const handleSubmit = async () => {
//     if (selectedSerials.length === 0) {
//       Swal.fire('Warning', 'Please select at least one serial number', 'warning');
//       return;
//     }

//     await onSerialNumbersUpdate(product.product._id, selectedSerials);
//     setSelectedSerials([]);
//     onClose();
//   };

//   const filteredSerials = serialList.filter((s) =>
//     s.serialNumber.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <CModal size="lg" visible={visible} onClose={onClose}>
//       <CModalHeader>
//         <CModalTitle>Serial Numbers for {product?.product?.productName}</CModalTitle>
//       </CModalHeader>
//       <CModalBody>
//         <div className="mb-3">
//           <CFormInput
//             placeholder="Search serial number..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <CTable bordered hover responsive>
//           <CTableHead color="dark">
//             <CTableRow>
//               <CTableHeaderCell>
//                 <input
//                   type="checkbox"
//                   checked={selectedSerials.length === serialList.length && serialList.length > 0}
//                   onChange={handleSelectAll}
//                 />
//               </CTableHeaderCell>
//               <CTableHeaderCell>Serial Number</CTableHeaderCell>
//               <CTableHeaderCell>Product</CTableHeaderCell>
//               <CTableHeaderCell>Status</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredSerials.length > 0 ? (
//               filteredSerials.map((s, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>
//                     <input
//                       type="checkbox"
//                       checked={selectedSerials.some(
//                         (item) => item.serialNumber === s.serialNumber
//                       )}
//                       onChange={() => handleSelect(s)}
//                     />
//                   </CTableDataCell>
//                   <CTableDataCell>{s.serialNumber}</CTableDataCell>
//                   <CTableDataCell>{product?.product?.productName}</CTableDataCell>
//                   <CTableDataCell>{s.status || 'Available'}</CTableDataCell>
//                 </CTableRow>
//               ))
//             ) : (
//               <CTableRow>
//                 <CTableDataCell colSpan="4" className="text-center">
//                   No serial numbers found.
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </CModalBody>
//       <CModalFooter>
//         <CButton color="secondary" onClick={onClose}>
//           Cancel
//         </CButton>
//         <CButton color="primary" onClick={handleSubmit}>
//           Submit ({selectedSerials.length})
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   );
// };

// RepairStatusModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   product: PropTypes.shape({
//     product: PropTypes.shape({
//       _id: PropTypes.string,
//       productName: PropTypes.string,
//     }),
//   }).isRequired,
//   approvedQty: PropTypes.number,
//   onSerialNumbersUpdate: PropTypes.func.isRequired,
//   warehouseId: PropTypes.string,
// };

// export default RepairStatusModal;



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
  CSpinner,
  CAlert,
  CFormInput,
  CFormLabel
} from '@coreui/react';
import PropTypes from 'prop-types';
import axiosInstance from 'src/axiosInstance';

const SerialNumbers = ({ 
  visible, 
  onClose, 
  product, 
  approvedQty,
  onSerialNumbersUpdate,
  warehouseId
}) => {
  const [availableSerials, setAvailableSerials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [showDropdowns, setShowDropdowns] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [showSerialSelection, setShowSerialSelection] = useState(false);

  // Check if product tracks serial numbers
  const trackSerialNumber = product?.product?.trackSerialNumber === 'Yes';

  useEffect(() => {
    if (visible && product?.product?._id && warehouseId) {
      // Reset states when modal opens
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setQuantity(0);
      setShowSerialSelection(false);
      setError(null);

      // If product doesn't track serial numbers, show quantity input directly
      if (!trackSerialNumber) {
        setShowSerialSelection(true);
      }

      fetchAvailableSerials();
    }
  }, [visible, product, warehouseId, trackSerialNumber]);
  
  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setQuantity(0);
      setShowSerialSelection(false);
      setError(null);
    }
  }, [visible]);

  const fetchAvailableSerials = async () => {
    try {
      setLoading(true);
      const productId = product.product._id;
      
      if (!warehouseId) {
        throw new Error('Warehouse/Outlet ID is required');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await axiosInstance.get(`/stockpurchase/serial-numbers/product/${warehouseId}/${productId}`);
      
      if (response.data.success) {
        setAvailableSerials(response.data.data.availableSerials || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch serial numbers');
      }
    } catch (err) {
      console.error('Error fetching serial numbers:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch serial numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantitySubmit = () => {
    if (quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (quantity > approvedQty) {
      setError(`Quantity cannot exceed available quantity (${approvedQty})`);
      return;
    }

    setShowSerialSelection(true);
    setError(null);
  };

  const handleSerialSelect = (srNumber, serialNumber) => {
    setSelectedSerials(prev => ({
      ...prev,
      [srNumber]: serialNumber
    }));
    setSearchTerms(prev => ({
      ...prev,
      [srNumber]: ''
    }));

    setShowDropdowns(prev => ({
      ...prev,
      [srNumber]: false
    }));
  };

  const handleDeleteSerial = (srNumber) => {
    setSelectedSerials(prev => {
      const newSelected = { ...prev };
      delete newSelected[srNumber];
      return newSelected;
    });
    setSearchTerms(prev => ({
      ...prev,
      [srNumber]: ''
    }));
  };

  const handleSearchChange = (srNumber, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [srNumber]: value
    }));
  };

  const handleSearchFocus = (srNumber) => {
    setShowDropdowns(prev => ({
      ...prev,
      [srNumber]: true
    }));
  };

  const handleSearchBlur = (srNumber) => {
    setTimeout(() => {
      setShowDropdowns(prev => ({
        ...prev,
        [srNumber]: false
      }));
    }, 200);
  };

  const getFilteredOptions = (srNumber) => {
    const searchTerm = searchTerms[srNumber] || '';
    const currentlySelected = Object.values(selectedSerials);
    
    return availableSerials.filter(serial => {
      const matchesSearch = serial.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const isAvailable = !currentlySelected.includes(serial.serialNumber) || selectedSerials[srNumber] === serial.serialNumber;
      return matchesSearch && isAvailable;
    });
  };

  const handleSave = () => {
    if (!trackSerialNumber) {
      // For non-serial tracked products, just send the quantity
      if (onSerialNumbersUpdate) {
        onSerialNumbersUpdate(product.product._id, quantity);
      }
      onClose();
      return;
    }

    // For serial tracked products
    const srNumbers = Array.from({ length: quantity }, (_, i) => i + 1);
    const missingSerials = srNumbers.filter(srNum => !selectedSerials[srNum]);
    
    if (missingSerials.length > 0) {
      setError(`Please select serial numbers for all items (SR ${missingSerials.join(', ')})`);
      return;
    }
  
    const serialsArray = Object.entries(selectedSerials).map(([srNumber, serialNumber]) => ({
      srNumber: parseInt(srNumber),
      serialNumber
    }));
  
    if (onSerialNumbersUpdate) {
      onSerialNumbersUpdate(product.product._id, serialsArray);
    }
    onClose();
  };

  const srNumbers = Array.from({ length: quantity }, (_, i) => i + 1);

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          {trackSerialNumber ? 'Serial Numbers' : 'Quantity'} for {product?.product?.productTitle || product?.product?.title}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        {loading ? (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <div className="mt-2">Loading available serial numbers...</div>
          </div>
        ) : (
          <>
            {/* Quantity Input Section - Show first for all products */}
            {!showSerialSelection && (
              <div className="mb-4">
                <CFormLabel htmlFor="quantity">
                  <strong>Enter Quantity</strong>
                </CFormLabel>
                <div className="d-flex align-items-center gap-3">
                  <CFormInput
                    id="quantity"
                    type="number"
                    min="1"
                    max={approvedQty}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    placeholder={`Enter quantity (max: ${approvedQty})`}
                    style={{ maxWidth: '200px' }}
                  />
                  <CButton 
                    color="primary" 
                    onClick={handleQuantitySubmit}
                    disabled={quantity <= 0 || quantity > approvedQty}
                  >
                    Continue
                  </CButton>
                </div>
                <div className="form-text">
                  Available quantity: {approvedQty}
                </div>
              </div>
            )}

            {/* Serial Number Selection - Only show for serial tracked products after quantity is entered */}
            {showSerialSelection && trackSerialNumber && (
              <>
                <div className="mb-3 p-3 bg-light rounded">
                  <strong>Selected Quantity: {quantity}</strong>
                  <CButton 
                    color="link" 
                    size="sm" 
                    className="float-end"
                    onClick={() => setShowSerialSelection(false)}
                  >
                    Change Quantity
                  </CButton>
                </div>

                <CTable bordered striped responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell width="15%">SR.</CTableHeaderCell>
                      <CTableHeaderCell width="85%">Serial Number</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {srNumbers.map(srNumber => {
                      const selectedSerial = selectedSerials[srNumber];
                      const filteredOptions = getFilteredOptions(srNumber);
                      const showDropdown = showDropdowns[srNumber];
                      
                      return (
                        <CTableRow key={srNumber}>
                          <CTableDataCell>
                            <strong>{srNumber}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="select-dropdown-container" style={{ position: 'relative' }}>
                              {selectedSerial ? (
                                <div className="d-flex align-items-center gap-2">
                                  <div className="flex-grow-1 p-2 border rounded bg-light">
                                    <strong>{selectedSerial}</strong>
                                  </div>
                                  <CButton
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteSerial(srNumber)}
                                    style={{ minWidth: '40px' }}
                                  >
                                    ×
                                  </CButton>
                                </div>
                              ) : (
                                <div>
                                  <div className="select-input-wrapper">
                                    <input
                                      type="text"
                                      className="form-input"
                                      value={searchTerms[srNumber] || ''}
                                      onChange={(e) => handleSearchChange(srNumber, e.target.value)}
                                      onFocus={() => handleSearchFocus(srNumber)}
                                      onBlur={() => handleSearchBlur(srNumber)}
                                      placeholder="Search serial number"
                                      style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d7dc',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                      }}
                                    />
                                  </div>
                                  
                                  {showDropdown && (
                                    <div 
                                      className="select-dropdown"
                                      style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'white',
                                        border: '1px solid #d1d7dc',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        zIndex: 1000,
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                      }}
                                    >
                                      <div 
                                        className="select-dropdown-header"
                                        style={{
                                          padding: '8px 12px',
                                          backgroundColor: '#f8f9fa',
                                          borderBottom: '1px solid #d1d7dc',
                                          fontWeight: 'bold',
                                          fontSize: '14px'
                                        }}
                                      >
                                        <span>Select Serial Number</span>
                                      </div>
                                      <div className="select-list">
                                        {filteredOptions.length > 0 ? (
                                          filteredOptions.map((serial) => (
                                            <div
                                              key={serial.serialNumber}
                                              className="select-item1"
                                              onClick={() => handleSerialSelect(srNumber, serial.serialNumber)}
                                              style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #f0f0f0',
                                                fontSize: '14px'
                                              }}
                                              onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#f8f9fa';
                                              }}
                                              onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'white';
                                              }}
                                            >
                                              <div className="select-name">
                                                {serial.serialNumber}
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div 
                                            className="no-select"
                                            style={{
                                              padding: '8px 12px',
                                              color: '#6c757d',
                                              fontSize: '14px',
                                              textAlign: 'center'
                                            }}
                                          >
                                            No serial numbers found
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                  </CTableBody>
                </CTable>
              </>
            )}

            {/* For non-serial tracked products, show only quantity confirmation */}
            {showSerialSelection && !trackSerialNumber && (
              <div className="text-center p-4">
                <div className="mb-3">
                  <i className="fa fa-check-circle text-success fa-3x"></i>
                </div>
                <h5>Quantity Confirmed</h5>
                <p className="text-muted">
                  You have selected <strong>{quantity}</strong> items for.
                </p>
              </div>
            )}
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        {showSerialSelection && (
          <CButton 
            color="primary"
            onClick={handleSave}
            disabled={
              trackSerialNumber 
                ? Object.keys(selectedSerials).length !== quantity
                : false
            }
          >
            Save Changes
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

SerialNumbers.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    product: PropTypes.shape({
      _id: PropTypes.string,
      productTitle: PropTypes.string,
      title: PropTypes.string,
      trackSerialNumber: PropTypes.string
    }),
    approvedSerials: PropTypes.arrayOf(PropTypes.string)
  }),
  approvedQty: PropTypes.number.isRequired,
  onSerialNumbersUpdate: PropTypes.func.isRequired,
  warehouseId: PropTypes.string.isRequired
};

SerialNumbers.defaultProps = {
  product: {
    product: {
      _id: '',
      productTitle: '',
      title: '',
      trackSerialNumber: 'No'
    }
  },
  warehouseId: ''
};

export default SerialNumbers;