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
  CFormInput
} from '@coreui/react';
import PropTypes from 'prop-types';
import axiosInstance from 'src/axiosInstance';

const ReturnSerialNumber = ({ 
  visible, 
  onClose, 
  product,
  quantity,
  onSerialNumbersUpdate
}) => {
  const [availableSerials, setAvailableSerials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [showDropdowns, setShowDropdowns] = useState({});
  const [initialized, setInitialized] = useState(false);

  const srNumbers = Array.from({ length: quantity }, (_, i) => i + 1);

  useEffect(() => {
    if (visible && product?._id && quantity > 0 && initialized === false) {
      fetchAvailableSerials();
      initializeSelectedSerials();
      setInitialized(true);
    }
  }, [visible, product, quantity, initialized]);

  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setError(null);
      setInitialized(false);
    }
  }, [visible]);

  const fetchAvailableSerials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!product?._id) {
        throw new Error('Product ID is required');
      }

      const response = await axiosInstance.get(`/stockrequest/serial-numbers/product/${product._id}`);
      
      if (response.data.success) {
        // Extract serial numbers from response
        const serials = response.data.data?.availableSerials || [];
        setAvailableSerials(serials.map(item => item.serialNumber || item));
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

 const initializeSelectedSerials = () => {
 const existingSerials = onSerialNumbersUpdate && product?._id 
    ? onSerialNumbersUpdate(product._id) 
    : null;

  const initialSelected = {};
  
  if (existingSerials && Array.isArray(existingSerials) && existingSerials.length === quantity) {
    // Pre-fill with existing serials
    srNumbers.forEach((srNum, index) => {
      initialSelected[srNum] = existingSerials[index] || '';
    });
  } else {

    srNumbers.forEach(srNum => {
      initialSelected[srNum] = '';
    });
  }
  
  setSelectedSerials(initialSelected);
  const initialSearchTerms = {};
  srNumbers.forEach(srNum => {
    initialSearchTerms[srNum] = '';
  });
  setSearchTerms(initialSearchTerms);
};

  const handleSerialSelect = (srNumber, serialNumber) => {
    setSelectedSerials(prev => ({
      ...prev,
      [srNumber]: serialNumber
    }));
    
    // Clear search term for this SR number
    setSearchTerms(prev => ({
      ...prev,
      [srNumber]: ''
    }));

    // Close dropdown
    setShowDropdowns(prev => ({
      ...prev,
      [srNumber]: false
    }));
    
    setError(null);
  };

  const handleDeleteSerial = (srNumber) => {
    setSelectedSerials(prev => ({
      ...prev,
      [srNumber]: ''
    }));
    
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
    const currentlySelected = Object.values(selectedSerials).filter(s => s !== '');
    
    return availableSerials.filter(serial => {
      const matchesSearch = serial.toLowerCase().includes(searchTerm.toLowerCase());
      const isAvailable = !currentlySelected.includes(serial) || selectedSerials[srNumber] === serial;
      return matchesSearch && isAvailable;
    });
  };

  const handleSave = () => {
    const missingSerials = srNumbers.filter(srNum => !selectedSerials[srNum]);
    
    if (missingSerials.length > 0) {
      setError(`Please select serial numbers for all items (SR ${missingSerials.join(', ')})`);
      return;
    }
    
    // Convert selected serials to array
    const serialsArray = srNumbers.map(srNum => selectedSerials[srNum]);
    
    if (onSerialNumbersUpdate && product?._id) {
      onSerialNumbersUpdate(product._id, serialsArray);
    }
    onClose();
  };

  // Check if all serials are selected
  const allSerialsSelected = srNumbers.every(srNum => selectedSerials[srNum]);

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          Serial Numbers for {product?.productTitle}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        <div className="mb-3">
          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
              <div className="mt-2">Loading available serial numbers...</div>
            </div>
          ) : (
            <CTable bordered striped>
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
                                  placeholder="Search or select serial number"
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
                                    <span>Available Serial Numbers ({filteredOptions.length})</span>
                                  </div>
                                  <div className="select-list">
                                    {filteredOptions.length > 0 ? (
                                      filteredOptions.map((serial, index) => (
                                        <div
                                          key={index}
                                          className="select-item1"
                                          onClick={() => handleSerialSelect(srNumber, serial)}
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
                                            {serial}
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
                                        {searchTerms[srNumber] ? 'No matching serial numbers found' : 'No serial numbers available'}
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
          )}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton 
          className='reset-button'
          onClick={handleSave}
        >
          Save Changes
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

ReturnSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    productTitle: PropTypes.string
  }),
  quantity: PropTypes.number.isRequired,
  onSerialNumbersUpdate: PropTypes.func.isRequired
};

ReturnSerialNumber.defaultProps = {
  product: null
};

export default ReturnSerialNumber;