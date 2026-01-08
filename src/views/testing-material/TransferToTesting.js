
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/form.css';
// import '../../css/table.css';
// import { CAlert, CButton, CFormInput, CFormSelect, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

// import UsageSerialNumbers from '../stockUsage/UsageSerialNumbers';

// const TransferToTesting = () => {
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
//     toCenter: '',
//     remark: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   useEffect(() => {
//     fetchProducts();
//     fetchCenters();
//   }, [id]);

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => {
//       setAlert({ show: false, message: '', type: '' });
//     }, 1500);
//   };

//   const handleOpenSerialModal = (product) => {
//     const usageQuantity = parseInt(selectedRows[product._id]?.quantity) || 0;
//     if (usageQuantity > 0) {
//       setSelectedProduct(product);
//       setSerialModalVisible(true);
//     }
//   };
   
//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     setAssignedSerials(prev => ({
//       ...prev,
//       [productId]: serialsArray
//     }));
//   };
  
//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get('/centers/main-warehouse?centerType=Center');
//       setCenters(res.data.data || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/stockpurchase/products/with-stock');
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

//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };
//       if (updated[productId]) {
//         setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
//         delete updated[productId];
//       } else {
//         const newOrder = selectionCounter.current++;
//         setSelectionOrder(prevOrder => [
//           { productId, order: newOrder },
//           ...prevOrder
//         ]);
//         updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
//       }
//       return updated;
//     });
//   };
  
//   const handleUsageQtyChange = (productId, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         quantity: value
//       }
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let newErrors = {};
    
//     if (!formData.date) newErrors.date = 'Date is required';

//     if (Object.keys(selectedRows).length === 0) {
//       newErrors.products = 'Please select at least one product';
//     }
  
//     Object.keys(selectedRows).forEach(productId => {
//       const product = products.find(p => p._id === productId);
//       const selectedRow = selectedRows[productId];
      
//       if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
//         newErrors.products = `Please enter valid usage quantity for ${product?.productTitle}`;
//       }
      
//       if (product?.trackSerialNumber === "Yes") {
//         const usageQty = parseInt(selectedRow.quantity);
//         const assignedSerialsForProduct = assignedSerials[productId] || [];
        
//         if (assignedSerialsForProduct.length !== usageQty) {
//           newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
//         }
//       }
//     });
//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }
  
//     try {
//         const items = Object.keys(selectedRows).map(productId => {
//         const product = products.find(p => p._id === productId);
//         const selectedRow = selectedRows[productId];
//         const serialNumbers = assignedSerials[productId] || [];
        
//         const item = {
//           product: productId,
//           quantity: parseInt(selectedRow.quantity),
//           productRemark: selectedRow.productRemark || '',
//         };
//         if (serialNumbers.length > 0) {
//           item.serialNumbers = serialNumbers;
//         }
        
//         return item;
//       });
  
//       const payload = {
//         date: formData.date,
//         toCenter: formData.toCenter,
//         remark: formData.remark || '',
//         toCenter: formData.toCenter || null,
//         items: items
//       };
  
//       console.log('Submitting payload:', payload);
  
//       if (id) {
//         await axiosInstance.put(`/stockusage/${id}`, payload);
//         showAlert('Stock usage updated successfully!', 'success');
//         setTimeout(() => {
//           navigate('/stock-usage');
//         }, 1500);
//       } else {
//         await axiosInstance.post('/stockusage', payload);
//         showAlert('Stock usage added successfully!', 'success');
//         setTimeout(() => {
//           navigate('/stock-usage');
//         }, 1500);
//       }
//     } catch (error) {
//       console.error('Error saving stock usage:', error);
      
//       let errorMessage = 'Failed to save stock usage';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//         if (errorMessage.includes('CenterStock validation failed') && errorMessage.includes('Must be a valid Center (not Outlet)')) {
//           errorMessage = 'Invalid center type. Please select a valid Center (not an Outlet) for stock usage.';
//         }
//       }
      
//       showAlert(errorMessage, 'danger');
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       date: getTodayDate(),
//       usageType: '',
//       remark: '',
//       customer: '',
//       connectionType: ''
//     });
//     setSelectedRows({});
//     setAssignedSerials({});
//     setSelectionOrder([]);
//     selectionCounter.current = 0;
//     setErrors({});
//     showAlert('Form has been reset', 'info');
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };


//   const filteredProducts = products
//     .filter((p) =>
//       p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aSelected = !!selectedRows[a._id];
//       const bSelected = !!selectedRows[b._id];

//       if (aSelected && bSelected) {
//         const aOrder = selectionOrder.find(item => item.productId === a._id)?.order || 0;
//         const bOrder = selectionOrder.find(item => item.productId === b._id)?.order || 0;
//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected) return -1;
//       if (!aSelected && bSelected) return 1;
//       return 0;
//     });

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
//         {id ? 'Edit' : 'Add'} Stock Usage 
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
//           <form onSubmit={handleSubmit}>
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
//                 <label className={`form-label 
//                   ${errors.toCenter ? 'error-label' : formData.toCenter ? 'valid-label' : ''}`}
//                   htmlFor="toCenter">
//                   To Branch <span className="required">*</span>
//                 </label>
//     <CFormSelect
//                   id="toCenter"
//                   name="toCenter"
//                   value={formData.toCenter}
//                   onChange={handleChange}
//                   className={`form-input 
//                     ${errors.toCenter ? 'error-input' : formData.toCenter ? 'valid-label' : ''}`}
//                 >
//                   <option value="">Select Center</option>
//                   {centers.map(center => (
//                     <option key={center._id} value={center._id}>
//                       {center.centerName}
//                     </option>
//                   ))}
//                 </CFormSelect>
//                 {errors.toCenter && <span className="error-text">{errors.toCenter}</span>}
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
//                 <CTable bordered striped className='responsive-table'>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell>Select</CTableHeaderCell>
//                       <CTableHeaderCell>Product Name</CTableHeaderCell>
//                       <CTableHeaderCell>Available Quantity</CTableHeaderCell>
//                       <CTableHeaderCell>Transfer Qty</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
                  
//                   <CTableBody>
//                 {filteredProducts.length > 0 ? (
//                   filteredProducts.map((p) => {
//                   const isSelected = !!selectedRows[p._id];

//       return (
//         <CTableRow key={p._id} className={isSelected ? 'selected-row' : ''}>
//           <CTableDataCell>
//             <input
//               type="checkbox"
//               checked={isSelected}
//               onChange={() => handleRowSelect(p._id, p.stock)}
//               style={{ height: "20px", width: "20px" }}
//             />
//           </CTableDataCell>

//           <CTableDataCell>{p.productTitle}</CTableDataCell>
//           <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>
//           <CTableDataCell>
//   {isSelected && (
//     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//       <CFormInput
//         type="number"
//         value={selectedRows[p._id]?.quantity || ''}
//         onChange={(e) => handleUsageQtyChange(p._id, e.target.value)}
//         placeholder="Usage Qty"
//         style={{width:'100px'}}
//         min="1"
//         max={p.stock?.currentStock || 0}
//       />

//       {selectedRows[p._id] && p.trackSerialNumber === "Yes" && (
//         <span
//           style={{
//             fontSize: '18px',
//             cursor: 'pointer',
//             color: '#337ab7',
//           }}
//           onClick={() => handleOpenSerialModal(p)}
//           title="Add Serial Numbers"
//         >
//           ☰
//         </span>
//       )}
//     </div>
//   )}
// </CTableDataCell>

//         </CTableRow>
//       );
//     })
//   ) : (
//     <CTableRow>
//       <CTableDataCell colSpan={7} className="text-center">
//         No products found
//       </CTableDataCell>
//     </CTableRow>
//   )}
// </CTableBody>

//                 </CTable>
//                 </div>
//               )}
//             </div>

//             <div className="form-footer">
//               <button type="submit" className="submit-button">
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <UsageSerialNumbers
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//       />
//     </div>
//   );
// };

// export default TransferToTesting;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { CAlert, CButton, CFormInput, CFormSelect, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import TestingSerialNumber from './TestingSerialNumber';


const TransferToTesting = () => {
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
    toCenter: '',
    remark: '',
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [selectionOrder, setSelectionOrder] = useState([]);
  const [userCenterId, setUserCenterId] = useState(null);
  const selectionCounter = useRef(0);

  useEffect(() => {
    fetchProducts();
    fetchCenters();
  }, [id]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 1500);
  };

  const handleOpenSerialModal = (product) => {
    const usageQuantity = parseInt(selectedRows[product._id]?.quantity) || 0;
    if (usageQuantity > 0) {
      setSelectedProduct(product);
      setSerialModalVisible(true);
    }
  };
   
  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
  };
  
  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers/main-warehouse?centerType=Center');
      setCenters(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUserCenter = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        if (response.data.success && response.data.data?.user?.center?._id) {
          setUserCenterId(response.data.data.user.center._id);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    
    getUserCenter();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockpurchase/products/with-stock');
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
  
  const handleUsageQtyChange = (productId, value) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    
    if (!formData.toCenter) {
      newErrors.toCenter = 'Testing center is required';
    }

    if (Object.keys(selectedRows).length === 0) {
      newErrors.products = 'Please select at least one product';
    }
  
    Object.keys(selectedRows).forEach(productId => {
      const product = products.find(p => p._id === productId);
      const selectedRow = selectedRows[productId];
      
      if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
        newErrors.products = `Please enter valid transfer quantity for ${product?.productTitle}`;
      }
      
      if (product?.trackSerialNumber === "Yes") {
        const usageQty = parseInt(selectedRow.quantity);
        const assignedSerialsForProduct = assignedSerials[productId] || [];
        
        if (assignedSerialsForProduct.length !== usageQty) {
          newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
        }
      }
    });
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setSubmitLoading(true);
      const testingProducts = Object.keys(selectedRows).map(productId => {
        const product = products.find(p => p._id === productId);
        const selectedRow = selectedRows[productId];
        const serialNumbers = assignedSerials[productId] || [];
        
        const item = {
          product: productId,
          quantity: parseInt(selectedRow.quantity),
          remark: selectedRow.productRemark || '',
        };
        
        if (serialNumbers.length > 0) {
          item.serialNumbers = serialNumbers;
        }
        
        return item;
      });
  
      const payload = {
        toCenter: formData.toCenter,
        remark: formData.remark || '',
        products: testingProducts
      };
  
      console.log('Submitting testing material request:', payload);

      await axiosInstance.post('/testing-material', payload);
      showAlert('Testing material request created successfully!', 'success');
      
      setTimeout(() => {
        navigate('/testing-stock');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving testing material request:', error);
      
      let errorMessage = 'Failed to create testing material request';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (errorMessage.includes('Serial numbers are required')) {
          errorMessage = 'Serial numbers are required for serialized products';
        } else if (errorMessage.includes('No stock available')) {
          errorMessage = 'Some products are not available in your outlet stock';
        } else if (errorMessage.includes('Insufficient stock')) {
          errorMessage = 'Insufficient stock available for one or more products';
        } else if (errorMessage.includes('not available in your outlet stock')) {
          errorMessage = 'Some serial numbers are not available in your outlet stock';
        }
      }
      
      showAlert(errorMessage, 'danger');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      toCenter: '',
      remark: '',
    });
    setSelectedRows({});
    setAssignedSerials({});
    setSelectionOrder([]);
    selectionCounter.current = 0;
    setErrors({});
    showAlert('Form has been reset', 'info');
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
        Transfer to Testing
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
          <form onSubmit={handleSubmit}>
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
                <label className={`form-label 
                  ${errors.toCenter ? 'error-label' : formData.toCenter ? 'valid-label' : ''}`}
                  htmlFor="toCenter">
                  Testing Center <span className="required">*</span>
                </label>
                <CFormSelect
                  id="toCenter"
                  name="toCenter"
                  value={formData.toCenter}
                  onChange={handleChange}
                  className={`form-input 
                    ${errors.toCenter ? 'error-input' : formData.toCenter ? 'valid-label' : ''}`}
                >
                  <option value="">Select Testing Center</option>
                  {centers.map(center => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </CFormSelect>
                {errors.toCenter && <span className="error-text">{errors.toCenter}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="remark">
                  Remark
                </label>
                <textarea
                  name="remark"
                  className="form-textarea"
                  value={formData.remark}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <h5>Select Products for Testing</h5>
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
                      <CTableHeaderCell>Available Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Transfer Qty</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  
                  <CTableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                  const isSelected = !!selectedRows[p._id];

      return (
        <CTableRow key={p._id} className={isSelected ? 'selected-row' : ''}>
          <CTableDataCell>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleRowSelect(p._id, p.stock?.currentStock || 0)}
              style={{ height: "20px", width: "20px" }}
            />
          </CTableDataCell>

          <CTableDataCell>{p.productTitle}</CTableDataCell>
          <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>
          <CTableDataCell>
  {isSelected && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <CFormInput
        type="number"
        value={selectedRows[p._id]?.quantity || ''}
        onChange={(e) => handleUsageQtyChange(p._id, e.target.value)}
        placeholder="Transfer Qty"
        style={{width:'100px'}}
        min="1"
        max={p.stock?.currentStock || 0}
      />

      {selectedRows[p._id] && p.trackSerialNumber === "Yes" && (
        <span
          style={{
            fontSize: '18px',
            cursor: 'pointer',
            color: '#337ab7',
          }}
          onClick={() => handleOpenSerialModal(p)}
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
      <CTableDataCell colSpan={7} className="text-center">
        No products found
      </CTableDataCell>
    </CTableRow>
  )}
</CTableBody>

                </CTable>
                </div>
              )}
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                className="submit-button"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Transfer Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <TestingSerialNumber
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
      />
    </div>
  );
};

export default TransferToTesting;