
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { 
  CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, 
  CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton, 
  CFormSelect, CFormCheck, CAccordion, CAccordionItem, 
  CAccordionHeader, CAccordionBody 
} from '@coreui/react';

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

  // Extract only damaged serials - WORKS FOR BOTH TYPES NOW
  const extractDamagedSerials = (product) => {
    // For serialized products, get from damagedSerialNumbers
    if (product.product?.trackSerialNumber === "Yes") {
      return product.damagedSerialNumbers || [];
    }
    // For non-serialized products, return empty array
    return [];
  };

  // Count damaged items - FIXED FOR BOTH TYPES
  const countDamagedItems = (product) => {
    // Use the statusBreakdown for both serialized and non-serialized
    return product.statusBreakdown?.damaged || 0;
  };

  const handleRowSelect = (product) => {
    const faultyStockId = product._id;
    const productId = product.product._id;
    const damagedCount = countDamagedItems(product);
    const damagedSerials = extractDamagedSerials(product);
    
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: prev[faultyStockId]
        ? undefined
        : { 
            quantity: Math.min(damagedCount, product.quantity || 1),
            damageRemark: '',
            availableQuantity: damagedCount, // Show only damaged items count
            damagedCount: damagedCount,
            serialNumbers: damagedSerials,
            selectedSerials: [], // For multi-select
            productId: productId,
            faultyStockId: faultyStockId,
            productName: product.product?.productTitle || 'Unknown Product',
            isSerialized: product.product?.trackSerialNumber === "Yes"
          },
    }));
  };

  // ADD THIS MISSING FUNCTION
  const handleRowDataChange = (faultyStockId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        [field]: value
      }
    }));
  };

  const handleQuantityChange = (faultyStockId, newQuantity) => {
    const row = selectedRows[faultyStockId];
    if (!row) return;
    
    const maxQuantity = Math.min(row.damagedCount, row.availableQuantity);
    const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
    
    // Auto-select serials based on quantity (only for serialized products)
    if (row.isSerialized) {
      const autoSelectedSerials = row.serialNumbers.slice(0, validQuantity);
      setSelectedRows((prev) => ({
        ...prev,
        [faultyStockId]: {
          ...prev[faultyStockId],
          quantity: validQuantity,
          selectedSerials: autoSelectedSerials
        }
      }));
    } else {
      // For non-serialized, just update quantity
      setSelectedRows((prev) => ({
        ...prev,
        [faultyStockId]: {
          ...prev[faultyStockId],
          quantity: validQuantity
        }
      }));
    }
  };

  const handleSerialSelect = (faultyStockId, serialNumber, isChecked) => {
    const row = selectedRows[faultyStockId];
    if (!row || !row.isSerialized) return;
    
    let updatedSelectedSerials = [...(row.selectedSerials || [])];
    
    if (isChecked) {
      if (!updatedSelectedSerials.includes(serialNumber)) {
        updatedSelectedSerials.push(serialNumber);
      }
    } else {
      updatedSelectedSerials = updatedSelectedSerials.filter(sn => sn !== serialNumber);
    }
    
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        selectedSerials: updatedSelectedSerials,
        quantity: updatedSelectedSerials.length
      }
    }));
  };

  const selectAllSerials = (faultyStockId) => {
    const row = selectedRows[faultyStockId];
    if (!row || !row.isSerialized) return;
    
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        selectedSerials: [...row.serialNumbers],
        quantity: row.serialNumbers.length
      }
    }));
  };

  const deselectAllSerials = (faultyStockId) => {
    const row = selectedRows[faultyStockId];
    if (!row) return;
    
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        selectedSerials: [],
        quantity: 0
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
    } else {
      // Validate each selected product
      selectedProducts.forEach(faultyStockId => {
        const row = selectedRows[faultyStockId];
        if (row.quantity <= 0) {
          newErrors[`quantity_${faultyStockId}`] = 'Quantity must be greater than 0';
        }
        if (row.quantity > row.damagedCount) {
          newErrors[`quantity_${faultyStockId}`] = `Cannot exceed available damaged items (${row.damagedCount})`;
        }
      });
    }
    
    return newErrors;
  };

  const prepareSubmitData = () => {
    const items = Object.keys(selectedRows)
      .filter(faultyStockId => selectedRows[faultyStockId])
      .map(faultyStockId => {
        const row = selectedRows[faultyStockId];
        
        const itemData = {
          productId: row.productId,
          quantity: parseInt(row.quantity) || 0,
          damageRemark: row.damageRemark || ''
        };

        // Only include serial numbers if product is serialized AND we have selected serials
        if (row.isSerialized && row.selectedSerials && row.selectedSerials.length > 0) {
          itemData.serialNumbers = row.selectedSerials;
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
      console.log('Submitting data:', JSON.stringify(submitData, null, 2));
      
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
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
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

  // Get status count for display - FIXED FOR BOTH TYPES
  const getStatusCounts = (product) => {
    // Use statusBreakdown from API response for both types
    if (product.statusBreakdown) {
      return {
        damaged: product.statusBreakdown.damaged || 0,
        underRepair: product.statusBreakdown.underRepair || 0,
        repaired: product.statusBreakdown.repaired || 0,
        irreparable: product.statusBreakdown.irreparable || 0,
      };
    }
    
    // Fallback for old data (shouldn't happen with new API)
    if (product.product?.trackSerialNumber === "Yes" && product.serialNumbers) {
      return {
        damaged: product.serialNumbers.filter(sn => sn.status === "damaged").length,
        underRepair: product.serialNumbers.filter(sn => sn.status === "under_repair").length,
        repaired: product.serialNumbers.filter(sn => sn.status === "repaired").length,
        irreparable: product.serialNumbers.filter(sn => sn.status === "irreparable").length,
      };
    }
    
    // For non-serialized fallback
    return {
      damaged: product.damagedQty || 0,
      underRepair: product.underRepairQty || 0,
      repaired: product.repairedQty || 0,
      irreparable: product.irrepairedQty || 0,
    };
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
                    ${errors.repairCenterId ? 'error-input' : formData.repairCenterId ? 'valid-label' : ''}`}
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
                <>
                  <div className="responsive-table-wrapper mb-3">
                    <CTable bordered striped className='responsive-table'>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Select</CTableHeaderCell>
                          <CTableHeaderCell>Product Name</CTableHeaderCell>
                          <CTableHeaderCell>Total Items</CTableHeaderCell>
                          <CTableHeaderCell>Damaged</CTableHeaderCell>
                          <CTableHeaderCell>Under Repair</CTableHeaderCell>
                          <CTableHeaderCell>Repaired</CTableHeaderCell>
                          <CTableHeaderCell>Irreparable</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((p) => {
                            const statusCounts = getStatusCounts(p);
                            const isSerialized = p.product?.trackSerialNumber === "Yes";
                            
                            return (
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
                                <CTableDataCell className={statusCounts.damaged > 0 ? 'text-success fw-bold' : 'text-muted'}>
                                  {statusCounts.damaged}
                                </CTableDataCell>
                                <CTableDataCell className={statusCounts.underRepair > 0 ? 'text-warning' : 'text-muted'}>
                                  {statusCounts.underRepair}
                                </CTableDataCell>
                                <CTableDataCell className={statusCounts.repaired > 0 ? 'text-info' : 'text-muted'}>
                                  {statusCounts.repaired}
                                </CTableDataCell>
                                <CTableDataCell className={statusCounts.irreparable > 0 ? 'text-danger' : 'text-muted'}>
                                  {statusCounts.irreparable}
                                </CTableDataCell>
                              </CTableRow>
                            );
                          })
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={8} className="text-center">
                              No faulty products found
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>

                  {/* Selected Products Details */}
                  {Object.keys(selectedRows).filter(id => selectedRows[id]).length > 0 && (
                    <CAccordion className="mb-4">
                      <CAccordionItem>
                        <CAccordionHeader>
                          <strong>Selected Products Details</strong>
                          <span className="ms-2 badge bg-primary">
                            {Object.keys(selectedRows).filter(id => selectedRows[id]).length} selected
                          </span>
                        </CAccordionHeader>
                        <CAccordionBody>
                          {Object.keys(selectedRows)
                            .filter(faultyStockId => selectedRows[faultyStockId])
                            .map(faultyStockId => {
                              const row = selectedRows[faultyStockId];
                              const product = products.find(p => p._id === faultyStockId);
                              const statusCounts = getStatusCounts(product || {});
                              const isSerialized = row.isSerialized;
                              
                              return (
                                <div key={faultyStockId} className="selected-product-details mb-3 p-3 border rounded">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                      <h6 className="mb-0">{row.productName}</h6>
                                      <small className={`badge ${isSerialized ? 'bg-primary' : 'bg-secondary'}`}>
                                        {isSerialized ? 'Serialized Product' : 'Non-Serialized Product'}
                                      </small>
                                    </div>
                                    {isSerialized && (
                                      <div>
                                        <CButton 
                                          size="sm" 
                                          color="primary" 
                                          variant="outline" 
                                          className="me-2"
                                          onClick={() => selectAllSerials(faultyStockId)}
                                        >
                                          Select All ({row.serialNumbers.length})
                                        </CButton>
                                        <CButton 
                                          size="sm" 
                                          color="secondary" 
                                          variant="outline"
                                          onClick={() => deselectAllSerials(faultyStockId)}
                                        >
                                          Deselect All
                                        </CButton>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="row mb-2">
                                    <div className="col-md-4">
                                      <label className="form-label">Quantity to Transfer:</label>
                                      <CFormInput
                                        type="number"
                                        min="1"
                                        max={row.damagedCount}
                                        value={row.quantity}
                                        onChange={(e) => handleQuantityChange(faultyStockId, parseInt(e.target.value) || 1)}
                                      />
                                      <small className="text-muted">
                                        Available damaged items: {row.damagedCount}
                                      </small>
                                      {errors[`quantity_${faultyStockId}`] && (
                                        <div className="error-text small">{errors[`quantity_${faultyStockId}`]}</div>
                                      )}
                                    </div>
                                    <div className="col-md-8">
                                      <label className="form-label">Damage Remark:</label>
                                      <CFormInput
                                        type="text"
                                        placeholder="Enter damage remark..."
                                        value={row.damageRemark}
                                        onChange={(e) => handleRowDataChange(faultyStockId, 'damageRemark', e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  
                                  {isSerialized && (
                                    <div className="mb-2">
                                      <label className="form-label">Select Serial Numbers ({row.selectedSerials?.length || 0} selected):</label>
                                      <div className="serial-numbers-grid">
                                        {row.serialNumbers && row.serialNumbers.length > 0 ? (
                                          row.serialNumbers.map((serialNumber, index) => (
                                            <div key={index} className="serial-checkbox mb-1">
                                              <CFormCheck
                                                id={`serial-${faultyStockId}-${index}`}
                                                label={serialNumber}
                                                checked={row.selectedSerials?.includes(serialNumber) || false}
                                                onChange={(e) => handleSerialSelect(faultyStockId, serialNumber, e.target.checked)}
                                              />
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-muted">No damaged serial numbers available</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {!isSerialized && (
                                    <div className="mb-2 alert alert-info">
                                      <small>
                                        <strong>Note:</strong> This is a non-serialized product. You can transfer any quantity up to {row.damagedCount} damaged items.
                                      </small>
                                    </div>
                                  )}
                                  
                                  <div className="status-summary">
                                    <small className="text-muted">
                                      Status: {statusCounts.damaged} damaged • {statusCounts.underRepair} under repair • {statusCounts.repaired} repaired • {statusCounts.irreparable} irreparable
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                        </CAccordionBody>
                      </CAccordionItem>
                    </CAccordion>
                  )}
                </>
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