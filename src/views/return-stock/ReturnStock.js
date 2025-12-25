import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css'
import {
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CSpinner,
  CAlert,
} from '@coreui/react';
import ReturnSerialNumber from './ReturnSerialNumber';

const ReturnStock = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    remark: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectionOrder, setSelectionOrder] = useState([]);
  const [assignedSerials, setAssignedSerials] = useState({});
  const selectionCounter = useRef(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockpurchase/products/with-stock');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
  };

  const handleOpenSerialModal = (product) => {
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };
  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
        delete updated[productId];
      } else {
        const newOrder = selectionCounter.current++;
        setSelectionOrder(prevOrder => [
          { productId, order: newOrder },
          ...prevOrder
        ]);
        updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
      }
      return updated;
    });
  };
  
  const handleRowInputChange = (productId, field, value) => {
    setSelectedRows((prev) => {
      const newRows = {
        ...prev,
        [productId]: {
          ...prev[productId],
          [field]: value,
        },
      };
  
      // If quantity changes and product requires serial numbers, clear existing serials
      if (field === 'quantity') {
        const product = products.find(p => p._id === productId);
        if (product?.trackSerialNumber === "Yes") {
          setAssignedSerials(prevSerials => {
            const newSerials = { ...prevSerials };
            delete newSerials[productId];
            return newSerials;
          });
        }
      }
  
      return newRows;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'This is a required field';
  
    const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    }
  
    selectedProducts.forEach(productId => {
      const product = selectedRows[productId];
      const productInfo = products.find(p => p._id === productId);
      
      if (!product.quantity || product.quantity <= 0) {
        newErrors[`quantity_${productId}`] = 'Quantity must be greater than 0';
      }
      if (productInfo?.trackSerialNumber === "Yes") {
        const assignedSerialsForProduct = assignedSerials[productId];
        
        if (!assignedSerialsForProduct || assignedSerialsForProduct.length === 0) {
          newErrors[`serials_${productId}`] = 'Serial numbers are required for this product';
        } else if (assignedSerialsForProduct.length !== parseInt(product.quantity)) {
          newErrors[`serials_${productId}`] = `Please assign exactly ${product.quantity} serial number(s)`;
        }
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      console.log('Form validation failed');
      return;
    }
    const productsData = Object.keys(selectedRows)
      .filter((productId) => selectedRows[productId])
      .map((productId) => {
        const productInfo = products.find(p => p._id === productId);
        const productData = {
          product: productId,
          quantity: parseInt(selectedRows[productId].quantity),
        };
        if (productInfo?.trackSerialNumber === "Yes" && assignedSerials[productId]) {
          productData.serialNumbers = assignedSerials[productId];
        }
  
        return productData;
      });
  
    console.log('Products data to submit:', productsData);
  
    const payload = {
      date: formData.date,
      remark: formData.remark || '',
      products: productsData
    };
  
    console.log('Payload to send:', payload);
  
    try {
      const response = await axiosInstance.post('/center-return', payload);
      setAlert({ show: true, message: 'Stock returned to reseller successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/reseller-stock');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error processing return request. Please try again.';
      setAlert({ show: true, message: errorMessage, type: 'danger' });
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const filteredProducts = products
    .filter((p) =>
      p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = !!selectedRows[a._id];
      const bSelected = !!selectedRows[b._id];
      if (aSelected && bSelected) {
        const aOrder = selectionOrder.find(item => item.productId === a._id)?.order || 0;
        const bOrder = selectionOrder.find(item => item.productId === b._id)?.order || 0;
        return aOrder - bOrder;
      }

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

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
       Return Products
      </div>
      <div className="form-card">
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
                  // disabled={centerLoading}
                  disabled
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="remark">
                  Remark
                </label>
                <textarea
                  id="remark"
                  name="remark"
                  className="form-textarea"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Additional Comment"
                  rows="3"
                />
              </div>
              <div className="form-group">
              </div>

            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <h5>Select Products</h5>
                {errors.products && <span className="error-text">{errors.products}</span>}
                <div className="d-flex">
                  <label className="me-2 mt-1">Search:</label>
                  <CFormInput
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                      <CTableHeaderCell>Stock</CTableHeaderCell>
                      <CTableHeaderCell>Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Remark</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <CTableRow key={p._id} className={selectedRows[p._id] ? 'selected-row' : ''}>
                          <CTableDataCell>
                            <input
                              type="checkbox"
                              checked={!!selectedRows[p._id]}
                              onChange={() => handleRowSelect(p._id, p.stock)}
                              style={{height:"20px", width:"20px"}}
                            />
                          </CTableDataCell>
                          <CTableDataCell>{p.productTitle}</CTableDataCell>
                          <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>
                          <CTableDataCell>
  {selectedRows[p._id] && (
    <>
      <input
        type="number"
        value={selectedRows[p._id].quantity}
        onChange={(e) =>
          handleRowInputChange(p._id, 'quantity', e.target.value)
        }
        className={`form-input ${errors[`quantity_${p._id}`] ? 'error' : ''}`}
        style={{ width: '100px', height: '32px' }}
        min="1"
        placeholder='Quantity'
      />
      {errors[`quantity_${p._id}`] && (
        <div className="error-text small">Quantity required</div>
      )}
      {errors[`serials_${p._id}`] && (
        <div className="error-text small" style={{ color: '#dc3545' }}>
          {errors[`serials_${p._id}`]}
        </div>
      )}
      {p.trackSerialNumber === "Yes" && (
        <span
          style={{ fontSize: '18px', cursor: 'pointer', color: '#337ab7' }}
          onClick={() => handleOpenSerialModal(p)}
          title="Add Serial Numbers"
        >
          ☰
        </span>
      )}
    </>
  )}
</CTableDataCell>
                          <CTableDataCell>
                            {selectedRows[p._id] && (
                              <input
                                type="text"
                                value={selectedRows[p._id].productRemark}
                                onChange={(e) =>
                                  handleRowInputChange(
                                    p._id,
                                    'productRemark',
                                    e.target.value
                                  )
                                }
                                className="form-input"
                                placeholder="Product Remark"
                              />
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={5} className="text-center">
                          No products found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                </div>
              )}
            </div>

            <div className="form-footer mt-3">
              <button type="button" className="submit-button" onClick={handleSubmit}>
                Submit Transfer
              </button>
            </div>
          </form>
        </div>
      </div>

      <ReturnSerialNumber
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        quantity={selectedRows[selectedProduct?._id]?.quantity || 0}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
      />
    </div>
  );
};

export default ReturnStock;
