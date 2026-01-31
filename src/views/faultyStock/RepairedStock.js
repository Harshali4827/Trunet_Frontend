// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/form.css';
// import '../../css/table.css';
// import { CAlert, CButton, CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
// import RepairedSerialNumber from './RepairedSerialNumber';

// const RepairedStock = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const [formData, setFormData] = useState({
//     date: getTodayDate(),
//     remark: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });

//   useEffect(() => {
//     fetchProducts();
//   }, [id]);

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => {
//       setAlert({ show: false, message: '', type: '' });
//     }, 5000);
//   };

//   const handleOpenSerialModal = (repairTransfer) => {
//     const usageQuantity = parseInt(selectedRows[repairTransfer._id]?.quantity) || 0;
//     if (usageQuantity > 0) {
//       const productForSerial = {
//         _id: repairTransfer.product._id,
//         productTitle: repairTransfer.product.productTitle,
//         trackSerialNumber: repairTransfer.product.trackSerialNumber,
//         repairTransferId: repairTransfer._id
//       };
      
//       setSelectedProduct(productForSerial);
//       setSerialModalVisible(true);
//     }
//   };

//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     setAssignedSerials(prev => ({
//       ...prev,
//       [productId]: serialsArray
//     }));
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/faulty-stock/under-repaired');
//       if (res.data.success) {
//         setProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       showAlert('Failed to fetch products', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowSelect = (repairTransferId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };
//       if (updated[repairTransferId]) {
//         delete updated[repairTransferId];
//       } else {
//         updated[repairTransferId] = { 
//           quantity: '', 
//           productRemark: '', 
//           productInStock: productStock || 0 
//         };
//       }
//       return updated;
//     });
//   };

//   const handleUsageQtyChange = (repairTransferId, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [repairTransferId]: {
//         ...prev[repairTransferId],
//         quantity: value
//       }
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     let newErrors = {};
    
//     if (!formData.date) newErrors.date = 'Date is required';
//     if (Object.keys(selectedRows).length === 0) {
//       newErrors.products = 'Please select at least one product';
//     }
  
//     Object.keys(selectedRows).forEach(repairTransferId => {
//       const repairTransfer = products.find(p => p._id === repairTransferId);
//       const selectedRow = selectedRows[repairTransferId];
      
//       if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
//         newErrors.products = `Please enter valid quantity for ${repairTransfer?.product?.productTitle}`;
//       }
      
//       if (repairTransfer?.product?.trackSerialNumber === "Yes") {
//         const usageQty = parseInt(selectedRow.quantity);
//         const assignedSerialsForProduct = assignedSerials[repairTransfer.product._id] || [];
        
//         if (assignedSerialsForProduct.length !== usageQty) {
//           newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${repairTransfer?.product?.productTitle}`;
//         }
//       }
//     });
  
//     return newErrors;
//   };

//   const handleSubmit = async (finalStatus) => {
//     const newErrors = validateForm();
    
//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }
  
//     try {
//       const items = Object.keys(selectedRows).map(repairTransferId => {
//         const repairTransfer = products.find(p => p._id === repairTransferId);
//         const selectedRow = selectedRows[repairTransferId];
//         const productId = repairTransfer.product._id;
//         const serialNumbers = assignedSerials[productId] || [];
        
//         const item = {
//           product: productId,
//           quantity: parseInt(selectedRow.quantity),
//           productRemark: selectedRow.productRemark || '',
//           serialNumbers: serialNumbers,
//           finalStatus: finalStatus
//         };
        
//         return item;
//       });
  
//       const payload = {
//         date: formData.date,
//         remark: formData.remark || '',
//         items: items
//       };
  
//       console.log('Submitting repair status payload:', payload);
//       const response = await axiosInstance.post('/faulty-stock/mark-repair-status', payload);
      
//       if (response.data.success) {
//         const statusMessage = finalStatus === 'repaired' ? 'repaired successfully!' : 'marked as irreparable!';
//         showAlert(`Products ${statusMessage}`, 'success');
//         setTimeout(() => {
//           navigate('/repair-faulty-stock');
//         }, 1500);
//       } else {
//         showAlert(response.data.message || 'Failed to update repair status', 'danger');
//       }
        
//     } catch (error) {
//       console.error('Error updating repair status:', error);
//       let errorMessage = 'Failed to update repair status';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
      
//       showAlert(errorMessage, 'danger');
//     }
//   };

//   // Separate handlers for each button
//   const handleSaveAsRepaired = () => {
//     handleSubmit('repaired');
//   };

//   const handleSubmitIrrepaired = () => {
//     handleSubmit('irreparable');
//   };

//   const handleReset = () => {
//     setFormData({
//       date: getTodayDate(),
//       remark: '',
//     });
//     setSelectedRows({});
//     setAssignedSerials({});
//     setErrors({});
//     showAlert('Form has been reset', 'info');
//   };

//   const handleBack = () => {
//     navigate('/repair-faulty-stock');
//   };

//   const filteredProducts = products.filter((p) =>
//     p.product?.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="form-container">
//       <div className="title">
//         <CButton
//           size="sm" 
//           className="back-button me-3"
//           onClick={handleBack}
//         >
//           <i className="fa fa-fw fa-arrow-left"></i>Back
//         </CButton>
//          Repaired/Irrepaired Product 
//       </div>
//       <div className="form-card">
//         <div className="form-header header-button">
//           <button type="button" className="reset-button" onClick={handleReset}>
//             Reset
//           </button>
//         </div>
//         <div className="form-body">
//           {alert.show && (
//             <CAlert
//               color={alert.type}
//               className="mb-3 mx-3"
//               dismissible
//               onClose={() => setAlert({ show: false, message: '', type: '' })}
//             >
//               {alert.message}
//             </CAlert>
//           )}
//           <form onSubmit={(e) => e.preventDefault()}>
//             <div className="form-row">
//               <div className="form-group">
//                 <label className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}>
//                   Date <span className="required">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   className={`form-input ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
//                   value={formData.date}
//                   onChange={handleChange}
//                   disabled
//                 />
//                 {errors.date && <span className="error">{errors.date}</span>}
//               </div>
//               <div className="form-group">
//                 <label className="form-label" htmlFor="remark">
//                   Remark
//                 </label>
//                 <textarea
//                   name="remark"
//                   className="form-textarea"
//                   placeholder="Remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="form-group"></div>
//             </div>
//             <div className="mt-4">
//               <div className="d-flex justify-content-between mb-2">
//                 <h5>Select Products</h5>
//                 {errors.products && <span className="error-text">{errors.products}</span>}
//                 <div className="d-flex">
//                   <label className="me-2 mt-1">Search:</label>
//                   <CFormInput
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{ maxWidth: '250px' }}
//                     placeholder="Search products..."
//                   />
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="text-center my-3">
//                   <CSpinner color="primary" />
//                 </div>
//               ) : (
//                 <div className="responsive-table-wrapper">
//                   <CTable bordered striped className='responsive-table'>
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell>Select</CTableHeaderCell>
//                         <CTableHeaderCell>Product Name</CTableHeaderCell>
//                         <CTableHeaderCell>Available Quantity</CTableHeaderCell>
//                         <CTableHeaderCell>Repaired/Irrepaired Qty</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
                    
//                     <CTableBody>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map((repairTransfer) => {
//                           const isSelected = !!selectedRows[repairTransfer._id];
//                           const product = repairTransfer.product;
//                           const trackSerial = product?.trackSerialNumber === "Yes";

//                           return (
//                             <CTableRow key={repairTransfer._id} className={isSelected ? 'selected-row' : ''}>
//                               <CTableDataCell>
//                                 <input
//                                   type="checkbox"
//                                   checked={isSelected}
//                                   onChange={() => handleRowSelect(repairTransfer._id, repairTransfer.quantity)}
//                                   style={{ height: "20px", width: "20px" }}
//                                 />
//                               </CTableDataCell>
//                               <CTableDataCell>{product?.productTitle}</CTableDataCell>
//                               <CTableDataCell>{repairTransfer.quantity || 0}</CTableDataCell>
                              
//                               <CTableDataCell>
//                                 {isSelected && (
//                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                     <CFormInput
//                                       type="number"
//                                       value={selectedRows[repairTransfer._id]?.quantity || ''}
//                                       onChange={(e) => handleUsageQtyChange(repairTransfer._id, e.target.value)}
//                                       placeholder="Qty"
//                                       style={{width:'100px'}}
//                                       min="1"
//                                       max={repairTransfer.quantity || 0}
//                                     />
//                                     {trackSerial && (
//                                       <span
//                                         style={{
//                                           fontSize: '18px',
//                                           cursor: 'pointer',
//                                           color: '#337ab7',
//                                         }}
//                                         onClick={() => handleOpenSerialModal(repairTransfer)}
//                                         title="Add Serial Numbers"
//                                       >
//                                         ☰
//                                       </span>
//                                     )}
//                                   </div>
//                                 )}
//                               </CTableDataCell>
//                             </CTableRow>
//                           );
//                         })
//                       ) : (
//                         <CTableRow>
//                           <CTableDataCell colSpan={4} className="text-center">
//                             No products found
//                           </CTableDataCell>
//                         </CTableRow>
//                       )}
//                     </CTableBody>
//                   </CTable>
//                 </div>
//               )}
//             </div>

//             <div className="form-footer mt-3">
//               <button 
//                 type="button" 
//                 className="reset-button"
//                 onClick={handleSaveAsRepaired}
//               >
//                 Save As Repaired
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button"
//                 onClick={handleSubmitIrrepaired}
//               >
//                 Submit Irrepaired
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <RepairedSerialNumber
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         usageQty={parseInt(selectedRows[selectedProduct?.repairTransferId]?.quantity) || 0}
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//       />
//     </div>
//   );
// };

// export default RepairedStock;





import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { CAlert, CButton, CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import RepairedSerialNumber from './RepairedSerialNumber';

const RepairedStock = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleOpenSerialModal = (product) => {
    const usageQuantity = parseInt(selectedRows[product.productId]?.quantity) || 0;
    if (usageQuantity > 0) {
      const productForSerial = {
        _id: product.productId,
        productTitle: product.productName,
        trackSerialNumber: product.isSerialized ? "Yes" : "No"
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

  const fetchProducts = async () => {
    try {
      // Add simplified=true parameter to get simplified response
      const res = await axiosInstance.get('/faulty-stock/under-repaired?simplified=true');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('Failed to fetch products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (productId, availableQuantity) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        delete updated[productId];
      } else {
        updated[productId] = { 
          quantity: '', 
          productRemark: '', 
          availableQuantity: availableQuantity || 0 
        };
      }
      return updated;
    });
  };

  const handleUsageQtyChange = (productId, value) => {
    const maxQty = selectedRows[productId]?.availableQuantity || 0;
    const numValue = parseInt(value) || 0;
    
    // Validate that quantity doesn't exceed available
    if (numValue > maxQty) {
      showAlert(`Cannot exceed available quantity of ${maxQty}`, 'warning');
      return;
    }
    
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: value
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
      const product = products.find(p => p.productId === productId);
      const selectedRow = selectedRows[productId];
      
      if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
        newErrors.products = `Please enter valid quantity for ${product?.productName}`;
      }
      
      if (product?.isSerialized) {
        const usageQty = parseInt(selectedRow.quantity);
        const assignedSerialsForProduct = assignedSerials[productId] || [];
        
        if (assignedSerialsForProduct.length !== usageQty) {
          newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productName}`;
        }
      }
    });
  
    return newErrors;
  };

  const handleSubmit = async (finalStatus) => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const items = Object.keys(selectedRows).map(productId => {
        const product = products.find(p => p.productId === productId);
        const selectedRow = selectedRows[productId];
        const serialNumbers = assignedSerials[productId] || [];
        
        const item = {
          product: productId,
          productName: product.productName,
          quantity: parseInt(selectedRow.quantity),
          productRemark: selectedRow.productRemark || '',
          serialNumbers: serialNumbers,
          isSerialized: product.isSerialized,
          finalStatus: finalStatus
        };
        
        return item;
      });
  
      const payload = {
        date: formData.date,
        remark: formData.remark || '',
        items: items
      };
  
      console.log('Submitting repair status payload:', payload);
      const response = await axiosInstance.post('/faulty-stock/mark-repair-status', payload);
      
      if (response.data.success) {
        const statusMessage = finalStatus === 'repaired' ? 'repaired successfully!' : 'marked as irreparable!';
        showAlert(`Products ${statusMessage}`, 'success');
        setTimeout(() => {
          navigate('/repair-faulty-stock');
        }, 1500);
      } else {
        showAlert(response.data.message || 'Failed to update repair status', 'danger');
      }
        
    } catch (error) {
      console.error('Error updating repair status:', error);
      let errorMessage = 'Failed to update repair status';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showAlert(errorMessage, 'danger');
    }
  };

  // Separate handlers for each button
  const handleSaveAsRepaired = () => {
    handleSubmit('repaired');
  };

  const handleSubmitIrrepaired = () => {
    handleSubmit('irreparable');
  };

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      remark: '',
    });
    setSelectedRows({});
    setAssignedSerials({});
    setErrors({});
    showAlert('Form has been reset', 'info');
  };

  const handleBack = () => {
    navigate('/repair-faulty-stock');
  };

  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
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
         Repaired/Irrepaired Product 
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
                <div className="responsive-table-wrapper">
                  <CTable bordered striped className='responsive-table'>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Select</CTableHeaderCell>
                        <CTableHeaderCell>Product Name</CTableHeaderCell>
                        <CTableHeaderCell>Available Quantity</CTableHeaderCell>
                        <CTableHeaderCell>Repaired/Irrepaired Qty</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    
                    <CTableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => {
                          const isSelected = !!selectedRows[product.productId];
                          const availableQuantity = product.underRepairQuantity || 0;

                          return (
                            <CTableRow key={product.productId} className={isSelected ? 'selected-row' : ''}>
                              <CTableDataCell>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleRowSelect(product.productId, availableQuantity)}
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </CTableDataCell>
                              <CTableDataCell>{product.productName}</CTableDataCell>
                              <CTableDataCell>{availableQuantity}</CTableDataCell>
                              
                              <CTableDataCell>
                                {isSelected && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CFormInput
                                      type="number"
                                      value={selectedRows[product.productId]?.quantity || ''}
                                      onChange={(e) => handleUsageQtyChange(product.productId, e.target.value)}
                                      placeholder="Qty"
                                      style={{width:'100px'}}
                                      min="1"
                                      max={availableQuantity}
                                    />
                                    {product.isSerialized && (
                                      <span
                                        style={{
                                          fontSize: '18px',
                                          cursor: 'pointer',
                                          color: '#337ab7',
                                        }}
                                        onClick={() => handleOpenSerialModal(product)}
                                        title="Add Serial Numbers"
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
                          <CTableDataCell colSpan={4} className="text-center">
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
              <button 
                type="button" 
                className="reset-button"
                onClick={handleSaveAsRepaired}
              >
                Save As Repaired
              </button>
              <button 
                type="button" 
                className="submit-button"
                onClick={handleSubmitIrrepaired}
              >
                Submit Irrepaired
              </button>
            </div>
          </form>
        </div>
      </div>

      <RepairedSerialNumber
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
      />
    </div>
  );
};

export default RepairedStock;