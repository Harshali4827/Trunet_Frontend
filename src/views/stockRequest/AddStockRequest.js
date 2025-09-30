import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
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
  CFormSelect,
  CAlert,
} from '@coreui/react';
import { generateOrderNumber } from 'src/utils/orderNumberGenerator';

const AddStockRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    warehouse: '',
    remark: '',
    date: new Date().toISOString().split('T')[0],
    orderNumber: '',
  });

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouseLoading, setWarehouseLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [errors, setErrors] = useState({});
  const [generatingOrderNo, setGeneratingOrderNo] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchWarehouses();
    fetchProducts();
    if (!id) {
      generateAutoOrderNumber();
    }
  }, []);
  
  useEffect(() => {
    if (id) {
      fetchStockRequest(id);
    }
  }, [id]);

  const generateAutoOrderNumber = async () => {
    setGeneratingOrderNo(true);
    try {
      const orderNumber = await generateOrderNumber
      (axiosInstance, 'stockrequest');
      setFormData(prev => ({
        ...prev,
        orderNumber: orderNumber
      }));
    } catch (error) {
      console.error('Error generating order number:', error);
    } finally {
      setGeneratingOrderNo(false);
    }
  };
  const fetchWarehouses = async () => {
    try {
      const res = await axiosInstance.get('/centers?centerType=Outlet');
      if (res.data.success) {
        setWarehouses(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setWarehouseLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockpurchase/products-with-stock');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockRequest = async (requestId) => {
    try {
      const res = await axiosInstance.get(`/stockrequest/${requestId}`);
      const data = res.data.data;
  
      setFormData({
        warehouse: data.warehouse?._id || '',
        remark: data.remark || '',
        date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
        orderNumber: data.orderNumber || '',
      });
  
      const selectedProducts = {};
      data.products.forEach((p) => {
        selectedProducts[p.product._id] = { 
          quantity: p.quantity,
          productRemark: p.productRemark || '',
          productInStock: p.productInStock || 0,
        };
      });
      setSelectedRows(selectedProducts);
    } catch (error) {
      console.error('Error fetching stock request:', error);
    }
  };  

  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: prev[productId]
        ? undefined
        : { 
            quantity: '', 
            productRemark: '',
            productInStock: productStock || 0
          },
    }));
  };

  const handleRowInputChange = (productId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.warehouse) newErrors.warehouse = 'This is a required field';
    if (!formData.date) newErrors.date = 'This is a required field';

    const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    }

    selectedProducts.forEach(productId => {
      const product = selectedRows[productId];
      if (!product.quantity || product.quantity <= 0) {
        newErrors[`quantity_${productId}`] = 'Quantity must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const productsData = Object.keys(selectedRows).map((productId) => ({
      product: productId,
      quantity: parseInt(selectedRows[productId].quantity),
      productRemark: selectedRows[productId].productRemark,
    }));

    const payload = {
      warehouse: formData.warehouse,
      remark: formData.remark,
      date: formData.date,
      orderNumber: formData.orderNumber,
      products: productsData,
      status: 'Submitted' 
    };

    try {
      if (id) {
        await axiosInstance.put(`/stockrequest/${id}`, payload);
        setAlert({ show: true, message: 'Stock request updated successfully!', type: 'success' });
      } else {
        await axiosInstance.post('/stockrequest', payload);
        setAlert({ show: true, message: 'Stock request created successfully!', type: 'success' });
      }
      
      setTimeout(() => {
        navigate('/stock-request');
      }, 1000);
    } catch (error) {
      console.error('Error saving stock request:', error);
      const errorMessage = error.response?.data?.message || 'Error saving stock request. Please try again.';
      setAlert({ show: true, message: errorMessage, type: 'danger' });
    }
  };

  const handleSaveDraft = async () => {
    const productsData = Object.keys(selectedRows).map((productId) => ({
      product: productId,
      quantity: parseInt(selectedRows[productId].quantity) || 0,
      productRemark: selectedRows[productId].productRemark,
    }));

    const payload = {
      warehouse: formData.warehouse,
      remark: formData.remark,
      date: formData.date,
      orderNumber: formData.orderNumber,
      products: productsData,
      status: 'Draft' 
    };

    try {
      if (id) {
        await axiosInstance.put(`/stockrequest/${id}`, payload);
        setAlert({ show: true, message: 'Draft updated successfully!', type: 'success' });
      } else {
        await axiosInstance.post('/stockrequest', payload);
        setAlert({ show: true, message: 'Draft saved successfully!', type: 'success' });
      }
      
      setTimeout(() => {
        navigate('/stock-request');
      }, 1500);
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMessage = error.response?.data?.message || 'Error saving draft. Please try again.';
      setAlert({ show: true, message: errorMessage, type: 'danger' });
    }
  };

  const handleBack = () => {
    navigate('/stock-request');
  };

  const filteredProducts = products.filter((p) =>
    p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {id ? 'Edit' : 'Add'} Indent Request
      </div>

      <div className="form-card">
        <div className="form-header header-button">
          <button type="button" className="reset-button" onClick={handleSaveDraft}>
            Save As Draft
          </button>
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Submit Request
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
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label 
                 className={`form-label 
                  ${errors.warehouse ? 'error-label' : formData.warehouse ? 'valid-label' : ''}`} 
                htmlFor="warehouse">
                  Warehouse <span className="required">*</span>
                </label>
                <CFormSelect
                  id="warehouse"
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleChange}
                  className={`form-input 
                    ${errors.warehouse ? 'error-input' : formData.warehouse ? 'valid-input' : ''}`}
                  disabled={warehouseLoading}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.centerName}
                    </option>
                  ))}
                </CFormSelect>
                {errors.warehouse && <span className="error-text">{errors.warehouse}</span>}
              </div>

              <div className="form-group">
                <label 
                 className={`form-label 
                ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
                 htmlFor="date">
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
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="orderNumber">
                  Order Number
                </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    className="form-input"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    // readOnly
                    disabled
                  />
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group"></div>
              <div className="form-group"></div>
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
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center my-3">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable bordered striped responsive>
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
                          <CTableDataCell>{p.stock?.totalAvailable || 0}</CTableDataCell>
                          <CTableDataCell>
                            {selectedRows[p._id] && (
                              <>
                                <input
                                  type="number"
                                  value={selectedRows[p._id].quantity}
                                  onChange={(e) =>
                                    handleRowInputChange(
                                      p._id,
                                      'quantity',
                                      e.target.value
                                    )
                                  }
                                  className={`form-input ${errors[`quantity_${p._id}`] ? 'error' : ''}`}
                                  style={{ width: '100px',height:'32px' }}
                                  placeholder='Quantity'
                                  min="1"
                                />
                                {errors[`quantity_${p._id}`] && (
                                  <div className="error-text small">Quantity required</div>
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
              )}
            </div>

            <div className="form-footer mt-3">
              <button type="button" className="reset-button" onClick={handleSaveDraft}>
                Save As Draft
              </button>
              <button type="button" className="submit-button" onClick={handleSubmit}>
                Submit Stock Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockRequest;