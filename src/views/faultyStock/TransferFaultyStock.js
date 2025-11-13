import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton, CFormSelect } from '@coreui/react';

const TransferFaultyStock = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    repairCenterId: '',
    transferRemark: '',
  });
  
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: ''
  });
  
  const { id } = useParams();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers?centerType=Center');
        setCenters(res.data.data || []);
      } catch (error) {
        console.log("error fetching center", error);
        showAlert('danger', 'Failed to fetch center');
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockusage/faulty-stock');
      if (res.data.success) {
        console.log('Fetched products:', res.data.data);
        setProducts(res.data.data || []);
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

  const handleRowSelect = (product) => {
    const faultyStockId = product._id;
    const productId = product.product._id;
    
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: prev[faultyStockId]
        ? undefined
        : { 
            quantity: product.quantity || 1,
            damageRemark: '',
            availableQuantity: product.quantity,
            serialNumbers: extractSerialNumbers(product.serialNumbers),
            productId: productId,
            faultyStockId: faultyStockId 
          },
    }));
  };
  const extractSerialNumbers = (serialNumbersArray) => {
    if (!serialNumbersArray || serialNumbersArray.length === 0) return [];
    
    return serialNumbersArray.map(sn => {
      if (sn.serialNumber) {
        return sn.serialNumber;
      }
      return '';
    }).filter(sn => sn.length > 0);
  };

  const handleRowDataChange = (faultyStockId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.repairCenterId) newErrors.repairCenterId = 'Center is required';

    const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    }
    
    return newErrors;
  };

  const prepareSubmitData = () => {
    const items = Object.keys(selectedRows)
      .filter(faultyStockId => selectedRows[faultyStockId])
      .map(faultyStockId => {
        const row = selectedRows[faultyStockId];
        const product = products.find(p => p._id === faultyStockId);
        
        const itemData = {
          productId: row.productId,
          quantity: parseInt(row.quantity) || 0,
          damageRemark: row.damageRemark || ''
        };

        if (row.serialNumbers && row.serialNumbers.length > 0) {
          itemData.serialNumbers = row.serialNumbers;
        }
        
        return itemData;
      });
    
    return {
      items: items,
      repairCenterId: formData.repairCenterId,
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
      repairCenterId: '',
      transferRemark: '',
    });
    setSelectedRows({});
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
      
      const response = await axiosInstance.post('/faulty-stock/transfer', submitData);
  
      if (response.data.success) {
        showAlert('success', 'Faulty stock transferred successfully!');
        setTimeout(() => {
          navigate('/faulty-stock');
        }, 1500);
      } else {
        showAlert('danger', response.data.message || 'Failed to transfer faulty stock');
      }
      
    } catch (error) {
      console.error('Error transferring faulty stock:', error);
      
      let errorMessage = 'Failed to transfer faulty stock';
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
    p.product?._id?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const handleBack = () => {
    navigate('/faulty-stock');
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
       Transfer To Repair Team
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
                    ${errors.repairCenterId ? 'error-label' : formData.repairCenterId ? 'valid-label' : ''}`} 
                  htmlFor="repairCenterId"
                >
                  Center <span className="required">*</span>
                </label>
                <CFormSelect
                  id="repairCenterId"
                  name="repairCenterId"
                  value={formData.repairCenterId}
                  onChange={handleChange}
                  className={`form-input 
                    ${errors.repairCenterId ? 'error-input' : formData.repairCenterId ? 'valid-input' : ''}`}
                >
                  <option value="">Select Center</option>
                  {centers.map(center => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </CFormSelect>
                {errors.repairCenterId && <span className="error-text">{errors.repairCenterId}</span>}
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
                  placeholder="Additional Comment for the transfer"
                  rows="3"
                />
              </div>
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
                <div className="responsive-table-wrapper">
                <CTable bordered striped className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Select</CTableHeaderCell>
                      <CTableHeaderCell>Product Name</CTableHeaderCell>
                      <CTableHeaderCell>Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Damage Remark</CTableHeaderCell>
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
                              onChange={() => handleRowSelect(p)}
                              style={{height:"20px", width:"20px"}}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            {p.product?.productTitle || 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell>
                            {p.quantity || 0}
                          </CTableDataCell>
                          <CTableDataCell>
                            {selectedRows[p._id] && (
                              <CFormInput
                                type="text"
                                placeholder="Damage remark..."
                                value={selectedRows[p._id].damageRemark}
                                onChange={(e) => handleRowDataChange(p._id, 'damageRemark', e.target.value)}
                              />
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={4} className="text-center">
                          No faulty products found
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
                {submitting ? 'Submitting...' : 'Transfer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferFaultyStock;