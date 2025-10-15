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
  CAlert
} from '@coreui/react';
import PropTypes from 'prop-types';
import axiosInstance from 'src/axiosInstance';

const StockSerialNumber = ({ 
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

  const srNumbers = Array.from({ length: approvedQty }, (_, i) => i + 1);

  useEffect(() => {
    if (visible && product?.product?._id && warehouseId) {
      const prevSerials = {};
      if (product.approvedSerials?.length > 0) {
        product.approvedSerials.forEach((sn, index) => {
          prevSerials[index + 1] = sn;
        });
      }
      setSelectedSerials(prevSerials);
  
      fetchAvailableSerials();
    }
  }, [visible, product, warehouseId]);
  
  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
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

      const response = await axiosInstance.get(`/stockrequest/serial-numbers/product/${productId}`);
      
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

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          Serial Number for {product?.product?.productTitle}
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

            <CTable bordered striped responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell width="15%">SR.</CTableHeaderCell>
                  <CTableHeaderCell width="85%">New Serial No.</CTableHeaderCell>
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
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <button 
          className='reset-button'
          onClick={handleSave}
          disabled={Object.keys(selectedSerials).length !== approvedQty}
        >
          Save Changes
        </button>
      </CModalFooter>
    </CModal>
  );
};

StockSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    product: PropTypes.shape({
      _id: PropTypes.string,
      productTitle: PropTypes.string
    }),
    approvedSerials: PropTypes.arrayOf(PropTypes.string)
  }),
  approvedQty: PropTypes.number.isRequired,
  onSerialNumbersUpdate: PropTypes.func.isRequired,
  warehouseId: PropTypes.string.isRequired
};

StockSerialNumber.defaultProps = {
  product: {
    product: {
      _id: '',
      productTitle: ''
    }
  },
  warehouseId: ''
};

export default StockSerialNumber;