

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { 
  CFormInput, 
  CSpinner, 
  CTable, 
  CTableBody, 
  CTableDataCell, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow, 
  CAlert, 
  CButton, 
  CFormSelect 
} from '@coreui/react';
import TransferSerialNumber from './TransferRepairedSerialNumber';


const TransferRepairedStock = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    outletId: '',
    transferRemark: '',
  });
  
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: ''
  });
  
  const { id } = useParams();

  // useEffect(() => {
  //   const fetchCenters = async () => {
  //     try {
  //       const res = await axiosInstance.get('/centers?centerType=Outlet');
  //       setCenters(res.data.data || []);
  //     } catch (error) {
  //       console.log("error fetching center", error);
  //       showAlert('danger', 'Failed to fetch center');
  //     }
  //   };
  //   fetchCenters();
  // }, []);

  useEffect(() => {
    fetchCenters();
  },[])
  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers/main-warehouse?centerType=Outlet');
      if (res.data.success) {
        const telecomWarehouses = res.data.data.filter(warehouse => 
          warehouse.centerName?.toLowerCase().includes('telecom') || 
          warehouse.centerType?.toLowerCase().includes('telecom') ||
          warehouse.category?.toLowerCase().includes('telecom')
        );
        setCenters(telecomWarehouses);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const fetchProducts = async () => {
  //   try {
  //     const res = await axiosInstance.get('/faulty-stock/repaired-products');
  //     if (res.data.success) {
  //       console.log('Fetched repaired products:', res.data.data);
  //       setProducts(res.data.data.repairedProducts || []);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     showAlert('danger', 'Failed to fetch products');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/faulty-stock/repaired-products');
      if (res.data.success) {
        console.log('Fetched repaired products:', res.data.data);
        
        let repairedProducts = [];
        
        if (res.data.data.repairedProducts) {
          repairedProducts = res.data.data.repairedProducts;
        } else if (Array.isArray(res.data.data)) {
          repairedProducts = res.data.data;
        }
        
        setProducts(repairedProducts || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('danger', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleOpenSerialModal = (product) => {
    const transferQuantity = parseInt(selectedRows[product.product._id]?.quantity) || 0;
    if (transferQuantity > 0) {
      const productForSerial = {
        _id: product.product._id,
        productTitle: product.product.productTitle,
        trackSerialNumber: product.product.trackSerialNumber,
        productId: product.product._id
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

  const handleRowSelect = (product) => {
    const productId = product.product._id;
    
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: prev[productId]
        ? undefined
        : { 
            quantity: Math.min(1, product.totalRepairedQuantity || 1), 
            damageRemark: '',
            availableQuantity: product.totalRepairedQuantity || 0,
            serialNumbers: extractSerialNumbers(product.repairedSerials),
            productId: productId,
            productData: product
          },
    }));
  };

  const extractSerialNumbers = (serialNumbersArray) => {
    if (!serialNumbersArray || serialNumbersArray.length === 0) return [];
    
    return serialNumbersArray.map(sn => {
      if (typeof sn === 'string') {
        return sn;
      } else if (sn.serialNumber) {
        return sn.serialNumber;
      }
      return '';
    }).filter(sn => sn.length > 0);
  };

  const handleRowDataChange = (productId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.outletId) newErrors.outletId = 'Center is required';

    const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    }

    // Validate quantities and serial numbers
    Object.keys(selectedRows).forEach(productId => {
      const selectedRow = selectedRows[productId];
      const product = products.find(p => p.product._id === productId);
      
      if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
        newErrors.products = `Please enter valid quantity for ${product?.product?.productTitle}`;
      }
      
      if (selectedRow.quantity > selectedRow.availableQuantity) {
        newErrors.products = `Quantity exceeds available repaired quantity for ${product?.product?.productTitle}`;
      }
      
      if (product?.product?.trackSerialNumber === "Yes") {
        const transferQty = parseInt(selectedRow.quantity);
        const assignedSerialsForProduct = assignedSerials[productId] || [];
        
        if (assignedSerialsForProduct.length !== transferQty) {
          newErrors.products = `Please assign serial numbers for all ${transferQty} items of ${product?.product?.productTitle}`;
        }
      }
    });
    
    return newErrors;
  };

  const prepareSubmitData = () => {
    const items = Object.keys(selectedRows)
      .filter(productId => selectedRows[productId])
      .map(productId => {
        const row = selectedRows[productId];
        const product = products.find(p => p.product._id === productId);
        
        const itemData = {
          productId: row.productId,
          quantity: parseInt(row.quantity) || 0,
          damageRemark: row.damageRemark || ''
        };

        // Add serial numbers if product tracks them
        if (product?.product?.trackSerialNumber === "Yes") {
          const serialNumbers = assignedSerials[productId] || [];
          if (serialNumbers.length > 0) {
            itemData.serialNumbers = serialNumbers;
          }
        }
        
        return itemData;
      });
    
    return {
      items: items,
      outletId: formData.outletId,
      transferRemark: formData.transferRemark || ''
    };
  };

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
       outletId: '',
      transferRemark: '',
    });
    setSelectedRows({});
    setAssignedSerials({});
    setProductSearchTerm('');
    setErrors({});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      showAlert('warning', 'Please fix the form errors before submitting');
      return;
    }
  
    try {
      const submitData = prepareSubmitData();
      console.log('Submitting data:', submitData);
      
      // const response = await axiosInstance.post('/faulty-stock/transfer-to-repair', submitData);

      const response = await axiosInstance.post('/faulty-stock/transfer-repaired-to-warehouse',submitData);
  
      if (response.data.success) {
        showAlert('success', 'Repaired stock transferred successfully!');
        setTimeout(() => {
          navigate('/repair-faulty-stock');
        }, 1500);
      } else {
        showAlert('danger', response.data.message || 'Failed to transfer repaired stock');
      }
      
    } catch (error) {
      console.error('Error transferring repaired stock:', error);
      
      let errorMessage = 'Failed to transfer repaired stock';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showAlert('danger', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };  

  const filteredProducts = products.filter((p) =>
    p.product?.productTitle?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.product?.productCode?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const handleBack = () => {
    navigate('/repair-faulty-stock');
  };

  return (
    <div className="form-container">
      <div className="title">
        <CButton
          size="sm"
          className="back-button me-3"
          onClick={handleBack}
        >
          <i className="fa fa-fw fa-arrow-left"></i>Back
        </CButton>
       Transfer Repaired Stock
      </div>
      
      <div className="form-card">
        <div className="form-header header-button">
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="form-body">
          {alert.visible && (
            <CAlert 
              color={alert.type} 
              className="mb-3 mx-3" 
              dismissible 
              onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
            >
              {alert.message}
            </CAlert>
          )}
 
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label  
                  className={`form-label 
                    ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
                  htmlFor="date"
                >
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`form-input 
                    ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.outletId ? 'error-label' : formData.outletId ? 'valid-label' : ''}`} 
                  htmlFor="outletId"
                >
                  Warehouse<span className="required">*</span>
                </label>
                <CFormSelect
                  id="outletId"
                  name="outletId"
                  value={formData.outletId}
                  onChange={handleChange}
                  className={`form-input 
                    ${errors.outletId ? 'error-input' : formData.outletId ? 'valid-input' : ''}`}
                >
                  <option value="">Select</option>
                  {centers.map(center => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </CFormSelect>
                {errors.outletId && <span className="error-text">{errors.outletId}</span>}
              </div> 
              <div className="form-group">
                <label className="form-label" htmlFor="transferRemark">
                  Transfer Remark
                </label>
                <textarea
                  id="transferRemark"
                  name="transferRemark"
                  className="form-textarea"
                  value={formData.transferRemark}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              {/* <div className="form-group"></div> */}
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <h5>Repaired Products</h5>
                {errors.products && <span className="error-text">{errors.products}</span>}
                <div className="d-flex">
                  <label className="me-2 mt-1">Search:</label>
                  <CFormInput
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    style={{ maxWidth: '250px' }}
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
                      <CTableHeaderCell>Repaired Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Transfer Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Remark</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => {
                        const isSelected = !!selectedRows[product.product._id];
                        const selectedRow = selectedRows[product.product._id];
                        const trackSerial = product.product?.trackSerialNumber === "Yes";

                        return (
                          <CTableRow 
                            key={product.product._id}
                            className={isSelected ? 'selected-row' : 'table-row'}
                          >
                            <CTableDataCell>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleRowSelect(product)}
                                style={{height:"20px", width:"20px"}}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              {product.product?.productTitle || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                              {product.totalRepairedQuantity || 0}
                              {product.repairDates && product.repairDates.length > 0 && (
                                <br />
                               
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {isSelected && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <CFormInput
                                    type="number"
                                    value={selectedRow?.quantity || ''}
                                    onChange={(e) => handleRowDataChange(product.product._id, 'quantity', e.target.value)}
                                    placeholder="Qty"
                                    style={{width:'100px'}}
                                    min="1"
                                    max={product.totalRepairedQuantity || 1}
                                  />
                                  {trackSerial && (
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
                            <CTableDataCell>
                              {isSelected && (
                                <CFormInput
                                  type="text"
                                  placeholder="remark..."
                                  value={selectedRow?.damageRemark || ''}
                                  onChange={(e) => handleRowDataChange(product.product._id, 'damageRemark', e.target.value)}
                                />
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        );
                      })
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center">
                          No repaired products found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                </div>
              )}
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? 'Transferring...' : 'Transfer Repaired Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <TransferSerialNumber
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
        availableSerials={selectedProduct ? 
          (products.find(p => p.product._id === selectedProduct._id)?.repairedSerials || []) 
          : []}
      />
    </div>
  );
};

export default TransferRepairedStock;