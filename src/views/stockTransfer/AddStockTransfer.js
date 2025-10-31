import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import { generateOrderNumber } from 'src/utils/orderNumberGenerator';
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

const AddStockTransfer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fromCenter: '',
    remark: '',
    date: new Date().toISOString().split('T')[0],
    transferNumber: '',
  });
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [centerLoading, setCenterLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [errors, setErrors] = useState({});
  const [generatingOrderNo, setGeneratingOrderNo] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchCenters();
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
      const transferNumber = await generateOrderNumber(axiosInstance);
      setFormData(prev => ({
        ...prev,
        transferNumber: transferNumber
      }));
    } catch (error) {
      console.error('Error generating order number:', error);
    } finally {
      setGeneratingOrderNo(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers');
      if (res.data.success) {
        setCenters(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setCenterLoading(false);
    }
  };

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

  const fetchStockRequest = async (requestId) => {
    try {
      const res = await axiosInstance.get(`/stocktransfer/${requestId}`);
      const data = res.data.data;

      setFormData({
        fromCenter: data.fromCenter?._id || '',
        remark: data.remark || '',
        date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
        transferNumber: data.transferNumber || '',
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
      console.error('Error fetching stock transfer request:', error);
    }
  };

  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        delete updated[productId];
      } else {
        updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fromCenter) newErrors.fromCenter = 'This is a required field';
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
    if (!validateForm()) return;

    const productsData = Object.keys(selectedRows)
    .filter((productId) => selectedRows[productId]) 
    .map((productId) => ({
      product: productId,
      quantity: parseInt(selectedRows[productId].quantity),
      productRemark: selectedRows[productId].productRemark,
    }));

    const payload = {
      fromCenter: formData.fromCenter,
      remark: formData.remark,
      date: formData.date,
      transferNumber: formData.transferNumber,
      products: productsData,
      status: 'Submitted' 
    };

    try {
      if (id) {
        await axiosInstance.put(`/stocktransfer/${id}`, payload);
        setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
      } else {
        await axiosInstance.post('/stocktransfer', payload);
        setAlert({ show: true, message: 'Data added successfully!', type: 'success' });
      }
      setTimeout(() => {
        navigate('/stock-transfer');
      }, 1500);
    } catch (error) {
      console.error('Error saving stock transfer request:', error);
    const errorMessage = error.response?.data?.message || 'Error saving stock transfer request. Please try again.';
    setAlert({ show: true, message: errorMessage, type: 'danger' });
    }
  };

  const handleSaveDraft = async () => {
    const productsData = Object.keys(selectedRows)
    .filter((productId) => selectedRows[productId]) 
    .map((productId) => ({
      product: productId,
      quantity: parseInt(selectedRows[productId].quantity) || 0,
      productRemark: selectedRows[productId].productRemark,
    }));

    const payload = {
      fromCenter: formData.fromCenter,
      remark: formData.remark,
      date: formData.date,
      transferNumber: formData.transferNumber,
      products: productsData,
      status: 'Draft' 
    };

    try {
      if (id) {
        await axiosInstance.put(`/stocktransfer/${id}`, payload);
        setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
      } else {
        await axiosInstance.post('/stocktransfer', payload);
        setAlert({ show: true, message: 'Data saved successfully!', type: 'success' });
      }
      
      setTimeout(() => {
        navigate('/stock-transfer');
      }, 1500);
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMessage = error.response?.data?.message || 'Error saving draft. Please try again.';
      setAlert({ show: true, message: errorMessage, type: 'danger' });
    }
  };

  const handleBack = () => {
    navigate(-1);
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
        {id ? 'Edit' : 'Add'} Transfer Request 
      </div>
      <div className="form-card">
        <div className="form-header header-button">
          <button type="button" className="reset-button" onClick={handleSaveDraft}>
            Save As Draft
          </button>
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Submit Transfer
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
                    ${errors.fromCenter ? 'error-label' : formData.fromCenter ? 'valid-label' : ''}`} 
                  htmlFor="fromCenter"
                >
                  Center <span className="required">*</span>
                </label>
                <CFormSelect
                  id="fromCenter"
                  name="fromCenter"
                  value={formData.fromCenter}
                  onChange={handleChange}
                  className={`form-input 
                    ${errors.fromCenter ? 'error-input' : formData.fromCenter ? 'valid-input' : ''}`}
                  disabled={centerLoading}
                >
                  <option value="">Select Center</option>
                  {centers.map(center => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </CFormSelect>
                {errors.fromCenter && <span className="error-text">{errors.fromCenter}</span>}
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
                  disabled={centerLoading}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="transferNumber">
                  Transfer Number
                </label>
                  <input
                    type="text"
                    id="transferNumber"
                    name="transferNumber" 
                    className="form-input"
                    value={formData.transferNumber}
                    onChange={handleChange}
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
                        <CTableRow key={p._id}>
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
                                    handleRowInputChange(
                                      p._id,
                                      'quantity',
                                      e.target.value
                                    )
                                  }
                                  className={`form-input ${errors[`quantity_${p._id}`] ? 'error' : ''}`}
                                  style={{ width: '100px',height:'32px' }}
                                  min="1"
                                  placeholder='Quantity'
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
                </div>
              )}
            </div>

            <div className="form-footer mt-3">
              <button type="button" className="reset-button" onClick={handleSaveDraft}>
                Save As Draft
              </button>
              <button type="button" className="submit-button" onClick={handleSubmit}>
                Submit Transfer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockTransfer;






// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import { generateOrderNumber } from 'src/utils/orderNumberGenerator';
// import '../../css/form.css';
// import {
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormInput,
//   CSpinner,
//   CFormSelect,
//   CAlert,
// } from '@coreui/react';

// const AddStockTransfer = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     fromCenter: '',
//     remark: '',
//     date: new Date().toISOString().split('T')[0],
//     transferNumber: '',
//   });
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [centerLoading, setCenterLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [errors, setErrors] = useState({});
//   const [generatingOrderNo, setGeneratingOrderNo] = useState(false);
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });
//   const [showPrintModal, setShowPrintModal] = useState(false);

//   useEffect(() => {
//     fetchCenters();
//     fetchProducts();
//     if (!id) {
//       generateAutoOrderNumber();
//     }
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchStockRequest(id);
//     }
//   }, [id]);

//   const generateAutoOrderNumber = async () => {
//     setGeneratingOrderNo(true);
//     try {
//       const transferNumber = await generateOrderNumber(axiosInstance);
//       setFormData(prev => ({
//         ...prev,
//         transferNumber: transferNumber
//       }));
//     } catch (error) {
//       console.error('Error generating order number:', error);
//     } finally {
//       setGeneratingOrderNo(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get('/centers');
//       if (res.data.success) {
//         setCenters(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     } finally {
//       setCenterLoading(false);
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
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStockRequest = async (requestId) => {
//     try {
//       const res = await axiosInstance.get(`/stocktransfer/${requestId}`);
//       const data = res.data.data;

//       setFormData({
//         fromCenter: data.fromCenter?._id || '',
//         remark: data.remark || '',
//         date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
//         transferNumber: data.transferNumber || '',
//       });

//       const selectedProducts = {};
//       data.products.forEach((p) => {
//         selectedProducts[p.product._id] = { 
//           quantity: p.quantity,
//           productRemark: p.productRemark || '',
//           productInStock: p.productInStock || 0,
//         };
//       });
//       setSelectedRows(selectedProducts);
//     } catch (error) {
//       console.error('Error fetching stock transfer request:', error);
//     }
//   };

//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };
//       if (updated[productId]) {
//         delete updated[productId];
//       } else {
//         updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
//       }
//       return updated;
//     });
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.fromCenter) newErrors.fromCenter = 'This is a required field';
//     if (!formData.date) newErrors.date = 'This is a required field';

//     const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
//     if (selectedProducts.length === 0) {
//       newErrors.products = 'At least one product must be selected';
//     }

//     selectedProducts.forEach(productId => {
//       const product = selectedRows[productId];
//       if (!product.quantity || product.quantity <= 0) {
//         newErrors[`quantity_${productId}`] = 'Quantity must be greater than 0';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const productsData = Object.keys(selectedRows)
//     .filter((productId) => selectedRows[productId]) 
//     .map((productId) => ({
//       product: productId,
//       quantity: parseInt(selectedRows[productId].quantity),
//       productRemark: selectedRows[productId].productRemark,
//     }));

//     const payload = {
//       fromCenter: formData.fromCenter,
//       remark: formData.remark,
//       date: formData.date,
//       transferNumber: formData.transferNumber,
//       products: productsData,
//       status: 'Submitted' 
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(`/stocktransfer/${id}`, payload);
//         setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
//       } else {
//         await axiosInstance.post('/stocktransfer', payload);
//         setAlert({ show: true, message: 'Data added successfully!', type: 'success' });
//       }
      
//       // Show print modal after successful submission
//       setTimeout(() => {
//         setShowPrintModal(true);
//       }, 1000);
      
//     } catch (error) {
//       console.error('Error saving stock transfer request:', error);
//       const errorMessage = error.response?.data?.message || 'Error saving stock transfer request. Please try again.';
//       setAlert({ show: true, message: errorMessage, type: 'danger' });
//     }
//   };

//   const handleSaveDraft = async () => {
//     const productsData = Object.keys(selectedRows)
//     .filter((productId) => selectedRows[productId]) 
//     .map((productId) => ({
//       product: productId,
//       quantity: parseInt(selectedRows[productId].quantity) || 0,
//       productRemark: selectedRows[productId].productRemark,
//     }));

//     const payload = {
//       fromCenter: formData.fromCenter,
//       remark: formData.remark,
//       date: formData.date,
//       transferNumber: formData.transferNumber,
//       products: productsData,
//       status: 'Draft' 
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(`/stocktransfer/${id}`, payload);
//         setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
//       } else {
//         await axiosInstance.post('/stocktransfer', payload);
//         setAlert({ show: true, message: 'Data saved successfully!', type: 'success' });
//       }
      
//       setTimeout(() => {
//         navigate('/stock-transfer');
//       }, 1500);
//     } catch (error) {
//       console.error('Error saving draft:', error);
//       const errorMessage = error.response?.data?.message || 'Error saving draft. Please try again.';
//       setAlert({ show: true, message: errorMessage, type: 'danger' });
//     }
//   };

//   const handlePrintChallan = () => {
//     const printWindow = window.open('', '_blank');
//     const selectedCenter = centers.find(c => c._id === formData.fromCenter);
//     const currentDate = new Date().toLocaleDateString('en-IN');
//     const currentTime = new Date().toLocaleTimeString('en-IN');
    
//     const printContent = `
//       <html>
//         <head>
//           <title>Transfer Challan - ${formData.transferNumber}</title>
//           <style>
//             body { 
//               font-family: Courier New; 
//               margin: 0;
//               padding: 20px;
//               color: #333;
//               font-size: 13px;
//             }
//             .challan-container {
//               max-width: 800px;
//               margin: 0 auto;
//               border: 2px solid #000;
//               padding: 20px;
//               background: white;
//             }
//             .company-header {
//               text-align: center;
//               border-bottom: 3px double #000;
//               padding-bottom: 15px;
//               margin-bottom: 20px;
//             }
//             .company-name {
//               font-size: 20px;
//               font-weight: bold;
//               margin-bottom: 5px;
//               text-transform: uppercase;
//             }
//             .company-address {
//               font-size: 14px;
//               margin-bottom: 5px;
//             }
//             .company-contact {
//               font-size: 13px;
//               color: #666;
//             }
//             .challan-number {
//               text-align: center;
//               font-size: 14px;
//               font-weight: bold;
//               margin: 10px 0;
//             }
//             .details-section {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 20px;
//               margin: 20px 0;
//             }
//             .detail-box {
//               border: 1px solid #000;
//               padding: 10px;
//             }
//             .detail-header {
//               font-weight: bold;
//               border-bottom: 1px solid #000;
//               margin-bottom: 8px;
//               padding-bottom: 5px;
//             }
//             .detail-row {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 5px;
//             }
//             .detail-label {
//               font-weight: bold;
//             }
//             .table-container {
//               margin: 20px 0;
//             }
//             .challan-table {
//               width: 100%;
//               border-collapse: collapse;
//               border: 1px solid #000;
//             }
//             .challan-table th {
//               background-color: #f0f0f0;
//               border: 1px solid #000;
//               padding: 8px;
//               text-align: center;
//               font-weight: bold;
//             }
//             .challan-table td {
//               border: 1px solid #000;
//               padding: 8px;
//               text-align: center;
//             }
//             .footer-section {
//               margin-top: 30px;
//               display: grid;
//               grid-template-columns: 1fr 1fr 1fr;
//               gap: 15px;
//             }
//             .signature-box {
//               text-align: center;
//               padding: 10px;
//             }
//             .signature-line {
//               border-top: 1px solid #000;
//               width: 200px;
//               margin: 40px auto 5px;
//             }
//             .terms-section {
//               margin-top: 20px;
//               padding: 10px;
//               border: 1px solid #000;
//               font-size: 12px;
//             }

//             .total-row {
//               font-weight: bold;
//               background-color: #f9f9f9;
//             }
//             .no-print {
//               text-align: center;
//               margin-top: 20px;
//               padding: 10px;
//               background: #f5f5f5;
//             }
//             @media print {
//               body { margin: 0; padding: 10px; }
//               .no-print { display: none; }
//               .challan-container { border: none; box-shadow: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="challan-container">
//             <!-- Company Header -->
//             <div class="company-header">
//               <div class="company-name">WASHI WAREHOUSE</div>
//               <div class="company-address">Corporate Office: G-9, Ali Yavar Jung Marg, Bandra (East), Mumbai - 400051</div>
//               <div class="company-contact">
//                 Tel: 022-26437734 | Email: info@iocl.com | Website: www.iocl.com
//               </div>
//             </div>
  
//             <!-- Challan Title -->
//             <div class="challan-number">
//               Challan No: <strong>${formData.transferNumber}</strong> | 
//               Date: <strong>${formData.date}</strong> |
//               Time: <strong>${currentTime}</strong>
//             </div>
  
//             <!-- Transfer Details -->
//             <div class="details-section">
//               <div class="detail-box">
//                 <div class="detail-header">FROM (Issuing Center)</div>
//                 <div class="detail-row">
//                   <span class="detail-label">Center Name:</span>
//                   <span>${selectedCenter?.centerName || 'N/A'}</span>
//                 </div>
//                 <div class="detail-row">
//                   <span class="detail-label">Center Code:</span>
//                   <span>${selectedCenter?.centerCode || 'N/A'}</span>
//                 </div>
//                 <div class="detail-row">
//                   <span class="detail-label">Address:</span>
//                   <span>${selectedCenter?.address || 'N/A'}</span>
//                 </div>
//                 <div class="detail-row">
//                   <span class="detail-label">Contact:</span>
//                   <span>${selectedCenter?.contactNumber || 'N/A'}</span>
//                 </div>
//               </div>
  
//               <div class="detail-box">
//                 <div class="detail-header">TRANSFER DETAILS</div>
//                 <div class="detail-row">
//                   <span class="detail-label">Challan Date:</span>
//                   <span>${formData.date}</span>
//                 </div>
//                 <div class="detail-row">
//                   <span class="detail-label">Transfer Type:</span>
//                   <span>Stock Transfer</span>
//                 </div>
//                 <div class="detail-row">
//                   <span class="detail-label">Prepared By:</span>
//                   <span>System User</span>
//                 </div>
//                 <div class="detail-row">
//                   <span class="detail-label">Remarks:</span>
//                   <span>${formData.remark || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>
  
//             <!-- Products Table -->
//             <div class="table-container">
//               <table class="challan-table">
//                 <thead>
//                   <tr>
//                     <th width="5%">Sr. No.</th>
//                     <th width="10%">Product Code</th>
//                     <th width="35%">Product Description</th>
//                     <th width="10%">Unit</th>
//                     <th width="15%">Quantity</th>
//                     <th width="10%">Rate</th>
//                     <th width="15%">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${Object.keys(selectedRows).map((productId, index) => {
//                     const product = products.find(p => p._id === productId);
//                     const row = selectedRows[productId];
//                     const rate = product?.rate || 0;
//                     const amount = row.quantity * rate;
                    
//                     return `
//                       <tr>
//                         <td>${index + 1}</td>
//                         <td>${product?.productCode || 'N/A'}</td>
//                         <td style="text-align: left;">${product?.productTitle || 'N/A'}</td>
//                         <td>PCS</td>
//                         <td>${row.quantity}</td>
//                         <td>₹${rate.toFixed(2)}</td>
//                         <td>₹${amount.toFixed(2)}</td>
//                       </tr>
//                     `;
//                   }).join('')}
                  
//                   <!-- Total Row -->
//                   <tr class="total-row">
//                     <td colspan="4" style="text-align: right;">TOTAL:</td>
//                     <td>${Object.keys(selectedRows).reduce((sum, productId) => sum + parseInt(selectedRows[productId].quantity), 0)}</td>
//                     <td></td>
//                     <td>₹${Object.keys(selectedRows).reduce((sum, productId) => {
//                       const product = products.find(p => p._id === productId);
//                       const row = selectedRows[productId];
//                       return sum + (row.quantity * (product?.rate || 0));
//                     }, 0).toFixed(2)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
  
//             <!-- Additional Information -->
//             <div style="margin: 15px 0; font-style: italic;">
//               <strong>Note:</strong> ${formData.remark || 'Goods transferred in good condition.'}
//             </div>
  
//             <!-- Terms and Conditions -->
//             <div class="terms-section">
//               <strong>TERMS & CONDITIONS:</strong>
//               <ol style="margin: 5px 0; padding-left: 20px;">
//                 <li>Goods must be verified at the time of receipt</li>
//                 <li>Any discrepancy must be reported within 24 hours</li>
//                 <li>Challan must be signed and stamped by receiving authority</li>
//                 <li>This is a computer generated document</li>
//               </ol>
//             </div>
  
//             <!-- Signatures -->
//             <div class="footer-section">
//               <div class="signature-box">
//                 <div class="signature-line"></div>
//                 <div>Prepared By</div>
//               </div>
              
//               <div class="signature-box">
//                 <div class="signature-line"></div>
//                 <div>Issued By</div>
//               </div>
              
//               <div class="signature-box">
//                 <div class="signature-line"></div>
//                 <div>Received By</div>
//               </div>
//             </div>

//             <!-- Print Controls -->
//             <div class="no-print">
//               <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
//                 Print Challan
//               </button>
//               <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
//                 Close Window
//               </button>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;
    
//     printWindow.document.write(printContent);
//     printWindow.document.close();
    
//     // Auto-print after a short delay
//     setTimeout(() => {
//       printWindow.print();
//     }, 1000);
    
//     setShowPrintModal(false);
    
//     setTimeout(() => {
//       navigate('/stock-transfer');
//     }, 2000);
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleSkipPrint = () => {
//     setShowPrintModal(false);
//     navigate('/stock-transfer');
//   };

//   const filteredProducts = products.filter((p) =>
//     p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
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
//         {id ? 'Edit' : 'Add'} Transfer Request 
//       </div>
//       <div className="form-card">
//         <div className="form-header header-button">
//           <button type="button" className="reset-button" onClick={handleSaveDraft}>
//             Save As Draft
//           </button>
//           <button type="button" className="submit-button" onClick={handleSubmit}>
//             Submit Transfer
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
//                 <label 
//                   className={`form-label 
//                     ${errors.fromCenter ? 'error-label' : formData.fromCenter ? 'valid-label' : ''}`} 
//                   htmlFor="fromCenter"
//                 >
//                   Center <span className="required">*</span>
//                 </label>
//                 <CFormSelect
//                   id="fromCenter"
//                   name="fromCenter"
//                   value={formData.fromCenter}
//                   onChange={handleChange}
//                   className={`form-input 
//                     ${errors.fromCenter ? 'error-input' : formData.fromCenter ? 'valid-input' : ''}`}
//                   disabled={centerLoading}
//                 >
//                   <option value="">Select Center</option>
//                   {centers.map(center => (
//                     <option key={center._id} value={center._id}>
//                       {center.centerName}
//                     </option>
//                   ))}
//                 </CFormSelect>
//                 {errors.fromCenter && <span className="error-text">{errors.fromCenter}</span>}
//               </div>

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
//                   disabled={centerLoading}
//                   value={formData.date}
//                   onChange={handleChange}
//                 />
//                 {errors.date && <span className="error-text">{errors.date}</span>}
//               </div>

//               <div className="form-group">
//                 <label className="form-label" htmlFor="transferNumber">
//                   Transfer Number
//                 </label>
//                 <input
//                   type="text"
//                   id="transferNumber"
//                   name="transferNumber" 
//                   className="form-input"
//                   value={formData.transferNumber}
//                   onChange={handleChange}
//                   disabled
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label" htmlFor="remark">
//                   Remark
//                 </label>
//                 <textarea
//                   id="remark"
//                   name="remark"
//                   className="form-textarea"
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Additional Comment"
//                   rows="3"
//                 />
//               </div>
//               <div className="form-group"></div>
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
//                 <CTable bordered striped responsive>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell>Select</CTableHeaderCell>
//                       <CTableHeaderCell>Product Name</CTableHeaderCell>
//                       <CTableHeaderCell>Stock</CTableHeaderCell>
//                       <CTableHeaderCell>Quantity</CTableHeaderCell>
//                       <CTableHeaderCell>Remark</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredProducts.length > 0 ? (
//                       filteredProducts.map((p) => (
//                         <CTableRow key={p._id}>
//                           <CTableDataCell>
//                             <input
//                               type="checkbox"
//                               checked={!!selectedRows[p._id]}
//                               onChange={() => handleRowSelect(p._id, p.stock)}
//                               style={{height:"20px", width:"20px"}}
//                             />
//                           </CTableDataCell>
//                           <CTableDataCell>{p.productTitle}</CTableDataCell>
//                           <CTableDataCell>{p.stock?.availableQuantity || 0}</CTableDataCell>
//                           <CTableDataCell>
//                             {selectedRows[p._id] && (
//                               <>
//                                 <input
//                                   type="number"
//                                   value={selectedRows[p._id].quantity}
//                                   onChange={(e) =>
//                                     handleRowInputChange(
//                                       p._id,
//                                       'quantity',
//                                       e.target.value
//                                     )
//                                   }
//                                   className={`form-input ${errors[`quantity_${p._id}`] ? 'error' : ''}`}
//                                   style={{ width: '100px',height:'32px' }}
//                                   min="1"
//                                   placeholder='Quantity'
//                                 />
//                                 {errors[`quantity_${p._id}`] && (
//                                   <div className="error-text small">Quantity required</div>
//                                 )}
//                               </>
//                             )}
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             {selectedRows[p._id] && (
//                               <input
//                                 type="text"
//                                 value={selectedRows[p._id].productRemark}
//                                 onChange={(e) =>
//                                   handleRowInputChange(
//                                     p._id,
//                                     'productRemark',
//                                     e.target.value
//                                   )
//                                 }
//                                 className="form-input"
//                                 placeholder="Product Remark"
//                               />
//                             )}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))
//                     ) : (
//                       <CTableRow>
//                         <CTableDataCell colSpan={5} className="text-center">
//                           No products found
//                         </CTableDataCell>
//                       </CTableRow>
//                     )}
//                   </CTableBody>
//                 </CTable>
//               )}
//             </div>

//             <div className="form-footer mt-3">
//               <button type="button" className="reset-button" onClick={handleSaveDraft}>
//                 Save As Draft
//               </button>
//               <button type="button" className="submit-button" onClick={handleSubmit}>
//                 Submit Transfer
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>


//       {showPrintModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5>Transfer Submitted Successfully!</h5>
//             </div>
//             <div className="modal-body">
//               <p>Your stock transfer has been submitted successfully.</p>
//               <p>Transfer Number: <strong>{formData.transferNumber}</strong></p>
//               <p>Would you like to print the transfer challan?</p>
//             </div>
//             <div className="modal-footer">
//               <CButton 
//                 color="secondary" 
//                 onClick={handleSkipPrint}
//               >
//                 Skip
//               </CButton>
//               <CButton 
//                 color="primary" 
//                 onClick={handlePrintChallan}
//               >
//                 Print Challan
//               </CButton>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddStockTransfer;