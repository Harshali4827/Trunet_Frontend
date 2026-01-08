import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { 
  CAlert, 
  CButton, 
  CFormInput, 
  CSpinner, 
  CTable, 
  CTableBody, 
  CTableDataCell, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow 
} from '@coreui/react';
import UnderRepairedSerial from './UnderRepairedSerial';

const TestMaterial = () => {
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    remark: '',
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});

  useEffect(() => {
    fetchUnderTestingProducts();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const fetchUnderTestingProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/testing-material/under-testing-product');
      
      if (res.data.success) {
        setProducts(res.data.data.products || []);
        
        if (res.data.data.products.length === 0) {
          showAlert('No products currently under testing', 'info');
        }
      } else {
        showAlert(res.data.message || 'Failed to fetch products', 'danger');
      }
    } catch (error) {
      console.error('Error fetching under testing products:', error);
      showAlert(
        error.response?.data?.message || 'Failed to fetch under testing products', 
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSerialModal = (repairTransfer) => {
    const usageQuantity = parseInt(selectedRows[repairTransfer._id]?.quantity) || 0;
    if (usageQuantity > 0) {
      const productForSerial = {
        _id: repairTransfer.product._id,
        productTitle: repairTransfer.product.productTitle,
        trackSerialNumber: repairTransfer.product.trackSerialNumber,
        repairTransferId: repairTransfer._id
      };
      
      setSelectedProduct(productForSerial);
      setSerialModalVisible(true);
    }
  };
 
  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
  };

  const handleRowSelect = (productId, underTestingQty) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        delete updated[productId];
      } else {
        updated[productId] = { 
          quantity: '', 
          underTestingQty: underTestingQty || 0 
        };
      }
      return updated;
    });
  };

  const handleUsageQtyChange = (productId, value) => {
    const numValue = parseInt(value) || 0;
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: numValue > 0 ? numValue : ''
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (Object.keys(selectedRows).length === 0) {
      newErrors.products = 'Please select at least one product';
    }
  
    Object.keys(selectedRows).forEach(productId => {
      const product = products.find(p => p._id === productId);
      const selectedRow = selectedRows[productId];
      
      if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
        newErrors.products = `Please enter valid quantity for ${product?.product?.productTitle}`;
      }
      
      const usageQty = parseInt(selectedRow.quantity);
      const maxQty = selectedRow.underTestingQty;
      
      if (usageQty > maxQty) {
        newErrors.products = `Cannot test more than ${maxQty} items for ${product?.product?.productTitle}`;
      }
    });
  
    return newErrors;
  };

  const handleSubmit = async (testResult) => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const items = Object.keys(selectedRows).map(productId => {
        const product = products.find(p => p._id === productId);
        const selectedRow = selectedRows[productId];
        const usageQty = parseInt(selectedRow.quantity);
        
        // For serialized products, get the serial numbers
        let serialNumbers = [];
        if (product?.serialized && product?.serialNumbers?.data?.length > 0) {
          serialNumbers = product.serialNumbers.data
            .filter(serial => serial.status === 'under_testing')
            .slice(0, usageQty)
            .map(serial => serial.serialNumber);
        }
        
        return {
          testingStockId: productId,
          product: product.product._id,
          quantity: usageQty,
          serialNumbers: serialNumbers,
          testResult: testResult
        };
      });
  
      const payload = {
        date: formData.date,
        remark: formData.remark || '',
        items: items
      };
  
      console.log('Submitting test result payload:', payload);
      
      const response = await axiosInstance.post('/testing-material/update-test-results', payload);
      
      if (response.data.success) {
        const statusMessage = testResult === 'passed' ? 'marked as passed!' : 'marked as failed!';
        showAlert(`Products ${statusMessage}`, 'success');
        
        setTimeout(() => {
          fetchUnderTestingProducts();
          setSelectedRows({});
          setFormData({
            date: getTodayDate(),
            remark: ''
          });
        }, 1500);
      } else {
        showAlert(response.data.message || 'Failed to update test results', 'danger');
      }
        
    } catch (error) {
      console.error('Error updating test results:', error);
      let errorMessage = 'Failed to update test results';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showAlert(errorMessage, 'danger');
    }
  };

  const handleTestingOk = () => {
    handleSubmit('passed');
  };

  const handleTestingFailed = () => {
    handleSubmit('failed');
  };

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      remark: '',
    });
    setSelectedRows({});
    setErrors({});
    showAlert('Form has been reset', 'info');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredProducts = products.filter((p) =>
    p.product?.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.product?.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container">
      <div className="title">
        <CButton
          size="sm" 
          className="back-button me-3"
          onClick={handleBack}
        >
          <i className="fa fa-fw fa-arrow-left"></i> Back
        </CButton>
        Test Under Testing Products
      </div>
      
      <div className="form-card">
        <div className="form-header header-button">
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
        
        <div className="form-body">
          {alert.show && (
            <CAlert
              color={alert.type}
              className="mb-3 mx-3"
              dismissible
              onClose={() => setAlert({ show: false, message: '', type: '' })}
            >
              {alert.message}
            </CAlert>
          )}
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}>
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className={`form-input ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                  disabled
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="remark">
                  Remark
                </label>
                <textarea
                  name="remark"
                  className="form-textarea"
                  placeholder="Remark"
                  value={formData.remark}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group"></div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-3">
                <h5>Select Products</h5>
                {errors.products && <span className="error-text">{errors.products}</span>}
                <div className="d-flex">
                  <label className="me-2 mt-1">Search:</label>
                  <CFormInput
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '250px' }}
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center my-3">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <div className="responsive-table-wrapper">
                  <CTable bordered striped className='responsive-table'>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Select</CTableHeaderCell>
                        <CTableHeaderCell>Product Name</CTableHeaderCell>
                        <CTableHeaderCell>Total Qty</CTableHeaderCell>
                        <CTableHeaderCell>Under Testing Qty</CTableHeaderCell>
                        <CTableHeaderCell>Test Qty</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    
                    <CTableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => {
                          const isSelected = !!selectedRows[product._id];
                          const productInfo = product.product;
                          const underTestingQty = product.quantities.underTesting;
                          const trackSerial = product.product?.trackSerialNumber === "Yes";
                          return (
                            <CTableRow key={product._id} className={isSelected ? 'selected-row' : ''}>
                              <CTableDataCell>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleRowSelect(product._id, underTestingQty)}
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </CTableDataCell>
                              <CTableDataCell>{productInfo?.productTitle}</CTableDataCell>
                              <CTableDataCell>{product.quantities.total}</CTableDataCell>
                              <CTableDataCell>
                                <strong>{underTestingQty}</strong>
                              </CTableDataCell>
                              
                              <CTableDataCell>
                                {isSelected && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CFormInput
                                      type="number"
                                      value={selectedRows[product._id]?.quantity || ''}
                                      onChange={(e) => handleUsageQtyChange(product._id, e.target.value)}
                                      placeholder="Qty"
                                      style={{width:'100px'}}
                                      min="1"
                                      max={underTestingQty}
                                    />
                                     {
                                trackSerial && (
                                    <span
                                      style={{
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        color: '#337ab7',
                                      }}
                                      onClick={() => handleOpenSerialModal(product)}
                                      title="Assign Serial Numbers"
                                    >
                                      ☰
                                    </span>
                                  )}
                                  </div>
                                )}
                              </CTableDataCell>
                            </CTableRow>
                          );
                        })
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan={5} className="text-center">
                            {searchTerm ? 'No products match your search' : 'No products currently under testing'}
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              )}
            </div>

            <div className="form-footer mt-3">
              <button 
                type="button" 
                className="reset-button"
                onClick={handleTestingOk}
              >
               Testing Ok
              </button>
              <button 
                type="button" 
                className="submit-button"
                onClick={handleTestingFailed}
              >
               Testing Failed
              </button>
            </div>
          </form>
        </div>
      </div>
      <UnderRepairedSerial
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={parseInt(selectedRows[selectedProduct?.repairTransferId]?.quantity) || 0}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
      />
    </div>
  );
};

export default TestMaterial;




