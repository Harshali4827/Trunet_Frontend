// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/form.css';
// import '../../css/table.css';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSearch } from '@coreui/icons';
// import { CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton } from '@coreui/react';
// import VendorModal from '../stockPurchase/VendorModel';

// const AddRaisePO = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     voucherNo: '',
//     vendor: '',
//     vendor_id: ''
//   });
//   const [vendors, setVendors] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedRows, setSelectedRows] = useState({});
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [productSearchTerm, setProductSearchTerm] = useState('');
//   const [showVendorDropdown, setShowVendorDropdown] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showVendorModal, setShowVendorModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [alert, setAlert] = useState({
//     visible: false,
//     type: 'success',
//     message: ''
//   });
  
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const res = await axiosInstance.get('/vendor');
//         setVendors(res.data.data || []);
//         setFilteredVendors(res.data.data || []);
//       } catch (error) {
//         console.log("error fetching vendors", error);
//         showAlert('danger', 'Failed to fetch vendors');
//       }
//     };
//     fetchVendors();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = vendors.filter(vendor =>
//         vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredVendors(filtered);
//     } else {
//       setFilteredVendors(vendors);
//     }
//   }, [searchTerm, vendors]);

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/stockpurchase/products/with-stock');
//       if (res.data.success) {
//         setProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       showAlert('danger', 'Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchStockPurchase = async () => {
//       if (!id) return;
  
//       try {
//         const res = await axiosInstance.get(`/stockpurchase/${id}`);
//         if (res.data.success) {
//           const data = res.data.data;
//           setFormData({
//             type: data.type,
//             date: data.date.split('T')[0],
//             voucherNo: data.voucherNo,
//             vendor: data.vendor.businessName,
//             vendor_id: data.vendor._id || data.vendor.id
//           });
  
//           setSearchTerm(data.vendor.businessName);
//           const selected = {};
//           data.products.forEach((prod) => {
//             selected[prod.product._id] = {
//               quantity: prod.purchasedQuantity,
//               price: prod.price,
//               productRemark: prod.productRemark || '',
//               productInStock: prod.product.stock?.currentStock || 0
//             };
//           });
//           setSelectedRows(selected);
  
//         }
//       } catch (error) {
//         console.error('Error fetching stock purchase for edit:', error);
//         showAlert('danger', 'Failed to fetch stock purchase data');
//       }
//     };
  
//     fetchStockPurchase();
//   }, [id, products, vendors]);
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleRowSelect = (productId, productPrice, productStock, trackSerialNumber) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: prev[productId]
//         ? undefined
//         : { 
//             quantity: '', 
//             productRemark: '',
//             price: productPrice || 0,
//             productInStock: productStock || 0

//           },
//     }));
//   };

//   const handleRowInputChange = (productId, field, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [field]: value,
//       },
//     }));
//   };

//   const handleVendorSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     setFormData(prev => ({
//       ...prev,
//       vendor: value,
//       vendor_id: ''
//     }));
//   };

//   const handleVendorSelect = (vendor) => {
//     setFormData(prev => ({
//       ...prev,
//       vendor: vendor.businessName,
//       vendor_id: vendor._id || vendor.id
//     }));
//     setSearchTerm(vendor.businessName);
//     setShowVendorDropdown(false);
//   };

//   const handleVendorInputFocus = () => {
//     setShowVendorDropdown(true);
//     setSearchTerm(formData.vendor);
//   };

//   const handleVendorInputBlur = () => {
//     setTimeout(() => {
//       setShowVendorDropdown(false);
//     }, 200);
//   };

//   const handleAddVendor = () => {
//     setShowVendorModal(true);
//   };

//   const handleVendorAdded = (newVendor) => {
//     setVendors((prev) => [...prev, newVendor]);
//     setFilteredVendors((prev) => [...prev, newVendor]);

//     setFormData((prev) => ({
//       ...prev,
//       vendor: newVendor.businessName,
//       vendor_id: newVendor._id || newVendor.id
//     }));
//     setSearchTerm(newVendor.businessName);
//     showAlert('success', 'Vendor added successfully!');
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     if (!formData.date) newErrors.date = 'Date is required';
//     if (!formData.voucherNo) newErrors.voucherNo = 'Invoice No is required';
//     if (!formData.vendor_id) newErrors.vendor = 'Vendor is required';
  
//     const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
//     if (selectedProducts.length === 0) {
//       newErrors.products = 'At least one product must be selected';
//     } else {
//       selectedProducts.forEach(productId => {
//         const row = selectedRows[productId];
//         if (!row.quantity || row.quantity <= 0) {
//           newErrors[`quantity_${productId}`] = 'Quantity is required and must be greater than 0';
//         }
//       });
//     }
    
//     return newErrors;
//   };

//   const prepareSubmitData = () => {
//     const productsData = Object.keys(selectedRows)
//       .filter(id => selectedRows[id] && selectedRows[id].quantity > 0)
//       .map(productId => {
//         const row = selectedRows[productId];
//         const productData = {
//           product: productId,
//           price: parseFloat(row.price) || 0,
//           purchasedQuantity: parseInt(row.quantity) || 0
//         };
        
//         return productData;
//       });
    
//     return {
//       type: formData.type,
//       date: new Date(formData.date).toISOString(),
//       voucherNo: formData.voucherNo,
//       vendor: formData.vendor_id,
//       products: productsData
//     };
//   };

//   const showAlert = (type, message) => {
//     setAlert({ visible: true, type, message });
//     setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
//   };

//   const handleReset = () => {
//     setFormData({
//       type: '',
//       date: new Date().toISOString().split('T')[0],
//       voucherNo: '',
//       vendor: '',
//       vendor_id: ''
//     });
//     setSelectedRows({});
//     setSearchTerm('');
//     setProductSearchTerm('');
//     setErrors({});
//     showAlert('info', 'Form has been reset');
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
  
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setSubmitting(false);
//       showAlert('warning', 'Please fix the form errors before submitting');
//       return;
//     }
  
//     try {
//       const submitData = prepareSubmitData();
//       let response;
  
//       if (id) {
//         response = await axiosInstance.put(`/raisePO/${id}`, submitData);
//       } else {
//         response = await axiosInstance.post('/raisePO', submitData);
//       }
  
//       if (response.data.success) {
//         showAlert('success', `PO ${id ? 'updated' : 'created'} successfully!`);
//         setTimeout(() => {
//           navigate('/raise-po');
//         }, 1500);
//       } else {
//         showAlert('danger', response.data.message || 'Failed to save stock purchase');
//       }
      
//     } catch (error) {
//       console.error('Error saving stock purchase:', error);
      
//       let errorMessage = 'Failed to save stock purchase';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
        
//         if (errorMessage.includes('validation failed')) {
//           if (errorMessage.includes('voucherNo')) {
//             errorMessage = 'Invoice number is required or already exists';
//           } else if (errorMessage.includes('vendor')) {
//             errorMessage = 'Please select a valid vendor';
//           } else if (errorMessage.includes('products')) {
//             errorMessage = 'Please select at least one product with valid quantity';
//           }
//         }
        
//         if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
//           errorMessage = 'Invoice number already exists. Please use a different invoice number.';
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       showAlert('danger', errorMessage);
//     } finally {
//       setSubmitting(false);
//     }
//   };  

//   const filteredProducts = products.filter((p) =>
//     p.productTitle?.toLowerCase().includes(productSearchTerm.toLowerCase())
//   );

//   const handleBack = () => {
//     navigate('/raise-po');
//   };

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
//         {/* {id ? 'Edit' : 'Add'}  */}
//         Raise PO
//       </div>
      
//       <div className="form-card">
//         <div className="form-header header-button">
//           <button type="button" className="reset-button" onClick={handleReset}>
//             Reset
//           </button>
//         </div>

//         <div className="form-body">
//           {alert.visible && (
//             <CAlert 
//               color={alert.type} 
//               className="mb-3 mx-3" 
//               dismissible 
//               onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
//             >
//               {alert.message}
//             </CAlert>
//           )}
 
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <div className="form-group">
//                 <label  
//                   className={`form-label 
//                     ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
//                   htmlFor="date"
//                 >
//                   Date <span className="required">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   className={`form-input 
//                     ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
//                   value={formData.date}
//                   onChange={handleChange}
//                 />
//                 {errors.date && <span className="error">{errors.date}</span>}
//               </div>

//               <div className="form-group">
//                 <label  
//                   className={`form-label 
//                     ${errors.voucherNo ? 'error-label' : formData.voucherNo ? 'valid-label' : ''}`}
//                   htmlFor="voucherNo"
//                 >
//                   Voucher No <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="voucherNo"
//                   name="voucherNo"
//                   placeholder="Voucher No."
//                   className={`form-input 
//                     ${errors.voucherNo ? 'error-input' : formData.voucherNo ? 'valid-input' : ''}`}
//                   value={formData.voucherNo}
//                   onChange={handleChange}
//                 />
//                 {errors.voucherNo && <span className="error">{errors.voucherNo}</span>}
//               </div>

//               <div className="form-group select-dropdown-container">
//                 <label 
//                   className={`form-label ${errors.vendor ? 'error-label' : formData.vendor ? 'valid-label' : ''}`}
//                 >
//                   Vendor <span className="required">*</span>
//                 </label>
//                 <div className="input-with-button">
//                   <div className="select-input-wrapper">
//                     <input
//                       type="text"
//                       name="vendor"
//                       className={`form-input ${errors.vendor ? 'error-input' : formData.vendor ? 'valid-input' : ''}`}
//                       value={searchTerm}
//                       onChange={handleVendorSearchChange}
//                       onFocus={handleVendorInputFocus}
//                       onBlur={handleVendorInputBlur}
//                       placeholder="Search Vendor"
//                     />
//                     <CIcon icon={cilSearch} className="search-icon" />
//                   </div>
//                   <button type="button" className="add-btn" onClick={handleAddVendor}>
//                     <CIcon icon={cilPlus} className='icon'/> ADD
//                   </button>
//                 </div>
//                 {showVendorDropdown && (
//                   <div className="select-dropdown">
//                     <div className="select-dropdown-header">
//                       <span>Select Vendor</span>
//                     </div>
//                     <div className="select-list">
//                       {filteredVendors.length > 0 ? (
//                         filteredVendors.map((vendor) => (
//                           <div
//                             key={vendor._id || vendor.id}
//                             className="select-item"
//                             onClick={() => handleVendorSelect(vendor)}
//                           >
//                             <div className="select-name">{vendor.businessName}</div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="no-select">No vendors found</div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 {errors.vendor && <span className="error">{errors.vendor}</span>}
//               </div>
//             </div>

//             <div className="mt-4">
//               <div className="d-flex justify-content-between mb-2">
//                 <h5>Products</h5>
//                 {errors.products && <span className="error-text">{errors.products}</span>}
//                 <div className="d-flex">
//                   <label className="me-2 mt-1">Search:</label>
//                   <CFormInput
//                     type="text"
//                     value={productSearchTerm}
//                     onChange={(e) => setProductSearchTerm(e.target.value)}
//                     style={{ maxWidth: '250px' }}
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
//                       <CTableHeaderCell>Price</CTableHeaderCell>
//                       <CTableHeaderCell>Available Qty</CTableHeaderCell>
//                       <CTableHeaderCell>Purchase Qty</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredProducts.length > 0 ? (
//                       filteredProducts.map((p) => (
//                         <CTableRow 
//                           key={p._id}
//                           className={selectedRows[p._id] ? 'selected-row' : 'table-row'}
//                         >
//                           <CTableDataCell>
//                             <input
//                               type="checkbox"
//                               checked={!!selectedRows[p._id]}
//                               onChange={() => handleRowSelect(p._id, p.productPrice, p.stock?.currentStock, p.trackSerialNumber)}
//                               style={{height:"20px", width:"20px"}}
//                             />
//                           </CTableDataCell>
//                           <CTableDataCell>{p.productTitle}</CTableDataCell>
//                           <CTableDataCell>
//                             {selectedRows[p._id] ? (
//                               <input
//                                 type="number"
//                                 value={selectedRows[p._id].price || p.productPrice}
//                                 onChange={(e) =>
//                                   handleRowInputChange(
//                                     p._id,
//                                     'price',
//                                     e.target.value
//                                   )
//                                 }
//                                 className="form-input"
//                                 style={{ width: '100px', height: '32px' }}
//                                 min="0"
//                                 step="0.01"
//                               />
//                             ) : (
//                              ''
//                             )}
//                           </CTableDataCell>
                  
//                           <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>
//                           <CTableDataCell>
//                             {selectedRows[p._id] ? (
//                               <input
//                                 type="number"
//                                 value={selectedRows[p._id].quantity}
//                                 onChange={(e) =>
//                                   handleRowInputChange(
//                                     p._id,
//                                     'quantity',
//                                     e.target.value
//                                   )
//                                 }
//                                 className={`form-input ${errors[`quantity_${p._id}`] ? 'error' : ''}`}
//                                 style={{ width: '100px', height: '32px' }}
//                                 min="1"
                                
//                               />
//                               ) : (
//                               ''
//                             )}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))
//                     ) : (
//                       <CTableRow>
//                         <CTableDataCell colSpan={6} className="text-center">
//                           No products found
//                         </CTableDataCell>
//                       </CTableRow>
//                     )}
//                   </CTableBody>
//                 </CTable>
//                 </div>
//               )}
//             </div>

//             <div className="form-footer">
//               <button type="submit" className="submit-button" disabled={submitting}>
//                 {submitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <VendorModal
//         visible={showVendorModal}
//         onClose={() => setShowVendorModal(false)}
//         onVendorAdded={handleVendorAdded} 
//       />
//     </div>
//   );
// };

// export default AddRaisePO;



import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSearch } from '@coreui/icons';
import { CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton } from '@coreui/react';
import VendorModal from '../stockPurchase/VendorModel';

const AddRaisePO = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    voucherNo: '',
    vendor: '',
    vendor_id: ''
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Track selection order - NEW STATE
  const [selectionOrder, setSelectionOrder] = useState([]);
  const selectionCounter = useRef(0);

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
        showAlert('danger', 'Failed to fetch vendors');
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
      showAlert('danger', 'Failed to fetch products');
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
            voucherNo: data.voucherNo,
            vendor: data.vendor.businessName,
            vendor_id: data.vendor._id || data.vendor.id
          });
  
          setSearchTerm(data.vendor.businessName);
          const selected = {};
          const order = [];
          
          data.products.forEach((prod, index) => {
            selected[prod.product._id] = {
              quantity: prod.purchasedQuantity,
              price: prod.price,
              productRemark: prod.productRemark || '',
              productInStock: prod.product.stock?.currentStock || 0
            };
            order.push({ productId: prod.product._id, order: index });
          });
          
          setSelectedRows(selected);
          setSelectionOrder(order);
          selectionCounter.current = data.products.length;
        }
      } catch (error) {
        console.error('Error fetching stock purchase for edit:', error);
        showAlert('danger', 'Failed to fetch stock purchase data');
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
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        // Remove from selection order when unselecting
        setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
        delete updated[productId];
      } else {
        // Add to selection order when selecting - NEW LOGIC
        const newOrder = selectionCounter.current++;
        setSelectionOrder(prevOrder => [
          { productId, order: newOrder },
          ...prevOrder
        ]);
        updated[productId] = { 
          quantity: '', 
          productRemark: '',
          price: productPrice || 0,
          productInStock: productStock || 0
        };
      }
      return updated;
    });
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
    showAlert('success', 'Vendor added successfully!');
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.voucherNo) newErrors.voucherNo = 'Invoice No is required';
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
        
        return productData;
      });
    
    return {
      type: formData.type,
      date: new Date(formData.date).toISOString(),
      voucherNo: formData.voucherNo,
      vendor: formData.vendor_id,
      products: productsData
    };
  };

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleReset = () => {
    setFormData({
      type: '',
      date: new Date().toISOString().split('T')[0],
      voucherNo: '',
      vendor: '',
      vendor_id: ''
    });
    setSelectedRows({});
    setSearchTerm('');
    setProductSearchTerm('');
    setErrors({});
    setSelectionOrder([]);
    selectionCounter.current = 0;
    showAlert('info', 'Form has been reset');
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
      let response;
  
      if (id) {
        response = await axiosInstance.put(`/raisePO/${id}`, submitData);
      } else {
        response = await axiosInstance.post('/raisePO', submitData);
      }
  
      if (response.data.success) {
        showAlert('success', `PO ${id ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/raise-po');
        }, 1500);
      } else {
        showAlert('danger', response.data.message || 'Failed to save stock purchase');
      }
      
    } catch (error) {
      console.error('Error saving stock purchase:', error);
      
      let errorMessage = 'Failed to save stock purchase';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        if (errorMessage.includes('validation failed')) {
          if (errorMessage.includes('voucherNo')) {
            errorMessage = 'Invoice number is required or already exists';
          } else if (errorMessage.includes('vendor')) {
            errorMessage = 'Please select a valid vendor';
          } else if (errorMessage.includes('products')) {
            errorMessage = 'Please select at least one product with valid quantity';
          }
        }
        
        if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
          errorMessage = 'Invoice number already exists. Please use a different invoice number.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert('danger', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };  

  // Filter and sort products - UPDATED LOGIC
  const filteredProducts = products
    .filter((p) =>
      p.productTitle?.toLowerCase().includes(productSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = !!selectedRows[a._id];
      const bSelected = !!selectedRows[b._id];
      
      // If both are selected, sort by selection order (latest first)
      if (aSelected && bSelected) {
        const aOrder = selectionOrder.find(item => item.productId === a._id)?.order || 0;
        const bOrder = selectionOrder.find(item => item.productId === b._id)?.order || 0;
        return aOrder - bOrder; // Lower order number means selected later (because we prepend to array)
      }
      
      // Selected products come before non-selected
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both are not selected, maintain original order
      return 0;
    });

  const handleBack = () => {
    navigate('/raise-po');
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
        {/* {id ? 'Edit' : 'Add'}  */}
        Raise PO
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
                    ${errors.voucherNo ? 'error-label' : formData.voucherNo ? 'valid-label' : ''}`}
                  htmlFor="voucherNo"
                >
                  Voucher No <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="voucherNo"
                  name="voucherNo"
                  placeholder="Voucher No."
                  className={`form-input 
                    ${errors.voucherNo ? 'error-input' : formData.voucherNo ? 'valid-input' : ''}`}
                  value={formData.voucherNo}
                  onChange={handleChange}
                />
                {errors.voucherNo && <span className="error">{errors.voucherNo}</span>}
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
                                
                              />
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
                </div>
              )}
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button" disabled={submitting}>
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
    </div>
  );
};

export default AddRaisePO;