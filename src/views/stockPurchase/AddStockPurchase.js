import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSearch } from '@coreui/icons';
import VendorModal from './VendorModel';
import { CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton } from '@coreui/react';
import SerialNumberModal from './SerialNumberModel';

const AddStockPurchase = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    vendor: '',
    vendor_id: '',
    transportAmount: '',
    remark: '',
    cgst: '',
    sgst: '',
    igst: ''
  });
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [selectedProductForSerial, setSelectedProductForSerial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: ''
  });
  
  const { id } = useParams();
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axiosInstance.get('/vendor');
        setVendors(res.data.data || []);
        setFilteredVendors(res.data.data || []);
      } catch (error) {
        console.log("error fetching vendors", error);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = vendors.filter(vendor =>
        vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVendors(filtered);
    } else {
      setFilteredVendors(vendors);
    }
  }, [searchTerm, vendors]);

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

  useEffect(() => {
    const fetchStockPurchase = async () => {
      if (!id) return;
  
      try {
        const res = await axiosInstance.get(`/stockpurchase/${id}`);
        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            type: data.type,
            date: data.date.split('T')[0],
            invoiceNo: data.invoiceNo,
            vendor: data.vendor.businessName,
            vendor_id: data.vendor._id || data.vendor.id,
            transportAmount: data.transportAmount,
            remark: data.remark,
            cgst: data.cgst,
            sgst: data.sgst,
            igst: data.igst,
          });
  
          setSearchTerm(data.vendor.businessName);
          const selected = {};
          data.products.forEach((prod) => {
            selected[prod.product._id] = {
              quantity: prod.purchasedQuantity,
              price: prod.price,
              productRemark: prod.productRemark || '',
              productInStock: prod.product.stock?.currentStock || 0,
              trackSerialNumber: prod.product.trackSerialNumber,
              // serialNumbers: prod.serialNumbers || [],
              serialNumbers: (prod.serialNumbers || []).map(sn => 
                typeof sn === 'string' ? sn : sn.serialNumber
              ),
            };
          });
          setSelectedRows(selected);
  
        }
      } catch (error) {
        console.error('Error fetching stock purchase for edit:', error);
      }
    };
  
    fetchStockPurchase();
  }, [id, products, vendors]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRowSelect = (productId, productPrice, productStock, trackSerialNumber) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: prev[productId]
        ? undefined
        : { 
            quantity: '', 
            productRemark: '',
            price: productPrice || 0,
            productInStock: productStock || 0,
            trackSerialNumber: trackSerialNumber,
            serialNumbers: []
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

  const handleVendorSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      vendor: value,
      vendor_id: ''
    }));
  };

  const handleVendorSelect = (vendor) => {
    setFormData(prev => ({
      ...prev,
      vendor: vendor.businessName,
      vendor_id: vendor._id || vendor.id
    }));
    setSearchTerm(vendor.businessName);
    setShowVendorDropdown(false);
  };

  const handleVendorInputFocus = () => {
    setShowVendorDropdown(true);
    setSearchTerm(formData.vendor);
  };

  const handleVendorInputBlur = () => {
    setTimeout(() => {
      setShowVendorDropdown(false);
    }, 200);
  };

  const handleAddVendor = () => {
    setShowVendorModal(true);
  };

  const handleVendorAdded = (newVendor) => {
    setVendors((prev) => [...prev, newVendor]);
    setFilteredVendors((prev) => [...prev, newVendor]);

    setFormData((prev) => ({
      ...prev,
      vendor: newVendor.businessName,
      vendor_id: newVendor._id || newVendor.id
    }));
    setSearchTerm(newVendor.businessName);
  };

  const handleOpenSerialModal = (product) => {
    setSelectedProductForSerial(product);
    setShowSerialModal(true);
  };

  const handleSerialNumbersSave = (productId, serialNumbers) => {
    const serialsArray = serialNumbers.split('\n')
      .map(sn => sn.trim())
      .filter(sn => sn.length > 0);
    
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        serialNumbers: serialsArray
      },
    }));
    setShowSerialModal(false);
    setSelectedProductForSerial(null);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.invoiceNo) newErrors.invoiceNo = 'Invoice No is required';
    if (!formData.vendor_id) newErrors.vendor = 'Vendor is required';
  
    const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    } else {
      selectedProducts.forEach(productId => {
        const row = selectedRows[productId];
        if (!row.quantity || row.quantity <= 0) {
          newErrors[`quantity_${productId}`] = 'Quantity is required and must be greater than 0';
        }
        if (row.trackSerialNumber === "Yes" && row.serialNumbers) {
          if (row.serialNumbers.length !== parseInt(row.quantity)) {
            newErrors[`serial_${productId}`] = `Number of serial numbers (${row.serialNumbers.length}) must match quantity (${row.quantity})`;
          }
        }
      });
    }
    
    return newErrors;
  };

  const prepareSubmitData = () => {
    const productsData = Object.keys(selectedRows)
      .filter(id => selectedRows[id] && selectedRows[id].quantity > 0)
      .map(productId => {
        const row = selectedRows[productId];
        const productData = {
          product: productId,
          price: parseFloat(row.price) || 0,
          purchasedQuantity: parseInt(row.quantity) || 0
        };
        
        if (row.trackSerialNumber === "Yes" && row.serialNumbers && row.serialNumbers.length > 0) {
          productData.serialNumbers = row.serialNumbers;
        }
        
        return productData;
      });
    
    return {
      type: formData.type,
      date: new Date(formData.date).toISOString(),
      invoiceNo: formData.invoiceNo,
      vendor: formData.vendor_id,
      transportAmount: parseFloat(formData.transportAmount) || 0,
      remark: formData.remark,
      cgst: parseFloat(formData.cgst) || 0,
      sgst: parseFloat(formData.sgst) || 0,
      igst: parseFloat(formData.igst) || 0,
      products: productsData
    };
  };


  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 2000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }
  
    try {
      const submitData = prepareSubmitData();
      let response;
  
      if (id) {
        response = await axiosInstance.put(`/stockpurchase/${id}`, submitData);
      } else {
        response = await axiosInstance.post('/stockpurchase', submitData);
      }
  
      if (response.data.success) {
        showAlert('success', `Stock purchase ${id ? 'updated' : 'created'} successfully!`);
        navigate('/stock-purchase');
      } else {
        showAlert('danger', response.data.message || 'Failed to save stock purchase');
      }
      
    } catch (error) {
      console.error('Error saving stock purchase:', error);
      showAlert('danger', error.response?.data?.message || error.message);
    }
     finally {
      setSubmitting(false);
    }
  };  

  const filteredProducts = products.filter((p) =>
    p.productTitle?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const handleBack = () =>{
       navigate('/stock-purchase')
  }
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
        Stock Purchase
        </div>
      <div className="form-card">
         <div className="form-header header-button">
          <button type="submit" className="reset-button">
           Submit
          </button>
        </div>

        <div className="form-body">
        {alert.visible && (
  <CAlert color={alert.type} className="mb-3">
    {alert.message}
  </CAlert>
)}
 
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.type ? 'error-label' : formData.type ? 'valid-label' : ''}`}
                  htmlFor="type"
                >
                  Type <span className="required">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className={`form-input 
                    ${errors.type ? 'error-input' : formData.type ? 'valid-input' : ''}`}
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="new">New</option>
                  <option value="refurbish">Refurbish</option>
                </select>
                {errors.type && <span className="error">{errors.type}</span>}
              </div>

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
                    ${errors.invoiceNo ? 'error-label' : formData.invoiceNo ? 'valid-label' : ''}`}
                  htmlFor="invoiceNo"
                >
                  Invoice No <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="invoiceNo"
                  name="invoiceNo"
                  placeholder="Invoice No."
                  className={`form-input 
                    ${errors.invoiceNo ? 'error-input' : formData.invoiceNo ? 'valid-input' : ''}`}
                  value={formData.invoiceNo}
                  onChange={handleChange}
                />
                {errors.invoiceNo && <span className="error">{errors.invoiceNo}</span>}
              </div>

              <div className="form-group select-dropdown-container">
                <label 
                  className={`form-label ${errors.vendor ? 'error-label' : formData.vendor ? 'valid-label' : ''}`}
                >
                  Vendor <span className="required">*</span>
                </label>
                <div className="input-with-button">
                  <div className="select-input-wrapper">
                    <input
                      type="text"
                      name="vendor"
                      className={`form-input ${errors.vendor ? 'error-input' : formData.vendor ? 'valid-input' : ''}`}
                      value={searchTerm}
                      onChange={handleVendorSearchChange}
                      onFocus={handleVendorInputFocus}
                      onBlur={handleVendorInputBlur}
                      placeholder="Search Vendor"
                    />
                    <CIcon icon={cilSearch} className="search-icon" />
                  </div>
                  <button type="button" className="add-btn" onClick={handleAddVendor}>
                    <CIcon icon={cilPlus} className='icon'/> ADD
                  </button>
                </div>
                {showVendorDropdown && (
                  <div className="select-dropdown">
                    <div className="select-dropdown-header">
                      <span>Select Vendor</span>
                    </div>
                    <div className="select-list">
                      {filteredVendors.length > 0 ? (
                        filteredVendors.map((vendor) => (
                          <div
                            key={vendor._id || vendor.id}
                            className="select-item"
                            onClick={() => handleVendorSelect(vendor)}
                          >
                            <div className="select-name">{vendor.businessName}</div>
                          </div>
                        ))
                      ) : (
                        <div className="no-select">No vendors found</div>
                      )}
                    </div>
                  </div>
                )}
                {errors.vendor && <span className="error">{errors.vendor}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="transportAmount">
                  Transport Amount
                </label>
                <input
                  type="number"
                  id="transportAmount"
                  name="transportAmount"
                  className="form-input"
                  value={formData.transportAmount}
                  onChange={handleChange}
                  placeholder='Transport Amount'
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Remark
                </label>
                <textarea
                  name="remark"
                  className="form-textarea"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Remark"
                  rows="3"
                />
              </div>

              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>
            
            <h5>Invoice Taxes</h5>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cgst">
                  CGST
                </label>
                <input
                  type="number"
                  id="cgst"
                  name="cgst"
                  className="form-input"
                  value={formData.cgst}
                  onChange={handleChange}
                  placeholder="CGST"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sgst">
                  SGST
                </label>
                <input
                  type="number"
                  id="sgst"
                  name="sgst"
                  className="form-input"
                  value={formData.sgst}
                  onChange={handleChange}
                  placeholder="SGST"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="igst">
                  IGST
                </label>
                <input
                  type="number"
                  id="igst"
                  name="igst"
                  className="form-input"
                  value={formData.igst}
                  onChange={handleChange}
                  placeholder="IGST"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group"></div>
              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <h5>Products</h5>
                {errors.products && <span className="error-text">{errors.products}</span>}
                <div className="d-flex">
                  <label className="me-2 mt-1">Search:</label>
                  <CFormInput
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
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
                      <CTableHeaderCell>Price</CTableHeaderCell>
                      <CTableHeaderCell>Available Qty</CTableHeaderCell>
                      <CTableHeaderCell>Purchase Qty</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <CTableRow 
                          key={p._id}
                          className={selectedRows[p._id] ? 'selected-row' : 'table-row'}
                        >
                          <CTableDataCell>
                            <input
                              type="checkbox"
                              checked={!!selectedRows[p._id]}
                              onChange={() => handleRowSelect(p._id, p.productPrice, p.stock?.currentStock, p.trackSerialNumber)}
                              style={{height:"20px", width:"20px"}}
                            />
                          </CTableDataCell>
                          <CTableDataCell>{p.productTitle}</CTableDataCell>
                          <CTableDataCell>
                            {selectedRows[p._id] ? (
                              <input
                                type="number"
                                value={selectedRows[p._id].price || p.productPrice}
                                onChange={(e) =>
                                  handleRowInputChange(
                                    p._id,
                                    'price',
                                    e.target.value
                                  )
                                }
                                className="form-input"
                                style={{ width: '100px', height: '32px' }}
                                min="0"
                                step="0.01"
                              />
                            ) : (
                             ''
                            )}
                          </CTableDataCell>
                  
                          <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>
                          <CTableDataCell>
                            {selectedRows[p._id] ? (
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
                                style={{ width: '100px', height: '32px' }}
                                min="1"
                                // max={p.stock?.totalAvailable || 0}
                              />
                              ) : (
                              ''
                            )}
                            {errors[`quantity_${p._id}`] && (
                              <div className="error-text small">Quantity required</div>
                            )}
                             {selectedRows[p._id] && p.trackSerialNumber === "Yes" ? (
        <span 
          style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '8px', color:'#337ab7' }}
          onClick={() => handleOpenSerialModal(p)}
          title="Add Serial Numbers"
        >☰</span>
      ) : (
        ''
      )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center">
                          No products found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </div>

            <div className="form-footer">
              <button type="submit" className="reset-button" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <VendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onVendorAdded={handleVendorAdded} 
      />
      <SerialNumberModal
        visible={showSerialModal}
        onClose={() => {
          setShowSerialModal(false);
          setSelectedProductForSerial(null);
        }}
        product={selectedProductForSerial}
        selectedRow={selectedProductForSerial ? selectedRows[selectedProductForSerial._id] : null}
        onSave={handleSerialNumbersSave}
      />
    </div>
  );
};

export default AddStockPurchase;