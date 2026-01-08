
// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError, showSuccess } from 'src/utils/sweetAlerts';
// import ResellerStockSearch from './ResellerStockSearch';

// const ResellerStock = () => {
//   const [data, setData] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ 
//     product: '', 
//     reseller: '', 
//     center: ''
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [centers, setCenters] = useState([]);

//   const dropdownRefs = useRef({});

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
//       if (searchParams.reseller) {
//         params.append('reseller', searchParams.reseller);
//       }
//       if (searchParams.center) {
//         params.append('sourceCenter', searchParams.center);
//       }
//       if (searchParams.fromCenter) {
//         params.append('fromCenter', searchParams.fromCenter);
//       }
//       params.append('page', page);
//       const url = params.toString() 
//         ? `/availablestock/reseller?${params.toString()}` 
//         : '/availableStock/reseller';
      
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setData(response.data.data.stock || []);
//         setCurrentPage(response.data.data.pagination?.currentPage || 1);
//         setTotalPages(response.data.data.pagination?.totalPages || 1);
//         if (response.data.data.center) {
//           setCenters([response.data.data.center]);
//         } else if (response.data.data.sourceCenter) {
//           setCenters([response.data.data.sourceCenter]);
//         } else {
//           setCenters([]);
//         }
//       } else {
//         throw new Error('API returned unsuccessful response');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');
//       if (response.data.success) {
//         setResellers(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');
//       if (response.data.success) {
//         setProducts(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchResellers();
//     fetchProducts();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedData = [...data].sort((a, b) => {
//       let aValue = a;
//       let bValue = b;
      
//       if (key.includes('.')) {
//         const keys = key.split('.');
//         aValue = keys.reduce((obj, k) => obj && obj[k], a);
//         bValue = keys.reduce((obj, k) => obj && obj[k], b);
//       } else {
//         aValue = a[key];
//         bValue = b[key];
//       }
      
//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }
//     return sortConfig.direction === 'ascending'
//       ? <CIcon icon={cilArrowTop} className="ms-1" />
//       : <CIcon icon={cilArrowBottom} className="ms-1" />;
//   };

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ product: '', reseller: '', center: '' });
//     setSearchTerm('');
//     setCenters([]);
//     fetchData({}, 1);
//   };

//   const filteredData = data.filter(data => {
//     if (activeSearch.product || activeSearch.reseller || activeSearch.center) {
//       return true;
//     }
//     return Object.values(data).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   const getActiveFilterLabels = () => {
//     const labels = [];
    
//     if (activeSearch.reseller) {
//       const reseller = resellers.find(r => r._id === activeSearch.reseller);
//       if (reseller) {
//         labels.push(`Reseller: ${reseller.businessName}`);
//       }
//     }
    
//     if (activeSearch.center) {
//       const center = centers.find(c => c._id === activeSearch.center);
//       if (center) {
//         labels.push(`Center: ${center.centerName}`);
//       } else {
//         labels.push('Center: Selected');
//       }
//     }
    
//     if (activeSearch.product) {
//       const product = products.find(p => p._id === activeSearch.product);
//       if (product) {
//         labels.push(`Product: ${product.productTitle}`);
//       }
//     }
    
//     return labels;
//   };

//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
    
//       const params = new URLSearchParams();
      
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
//       if (activeSearch.reseller) {
//         params.append('reseller', activeSearch.reseller);
//       }
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
      
//       const apiUrl = params.toString() 
//         ? `/availableStock/reseller?${params.toString()}` 
//         : '/availableStock/reseller';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data.stock || [];
      
//       if (exportData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
//       const headers = [
//         'Reseller',
//         'Product',
//         'Category',
//         'Total Quantity',
//         'Available Quantity',
//         'Consumed Quantity',
//       ];
  
//       const csvData = exportData.map(item => [
//         item.resellerName || '',
//         item.productName || '',
//         item.productCategory?.name || "",
//         item.totalQuantity || 0,
//         item.availableQuantity || 0,
//         item.consumedQuantity || 0,
//       ]);
      
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row => 
//           row.map(field => {
//             const stringField = String(field || '');
//             return `"${stringField.replace(/"/g, '""')}"`;
//           }).join(',')
//         )
//       ].join('\n');
  
//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);
      
//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', `reseller_stock_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);
      
//       showSuccess('Export completed successfully');
    
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && data.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Reseller Stock</div>
    
//       <ResellerStockSearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         resellers={resellers}
//         products={products}
//       />
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setSearchModalVisible(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {(activeSearch.product || activeSearch.reseller || activeSearch.center) && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                <CIcon icon={cilZoomOut} className='icon' />
//                 Reset Search
//               </CButton>
//             )}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={generateDetailExport}
//               disabled={data.length === 0}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//                Export
//             </CButton>
//           </div>
          
//           <div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('resellerName')} className="sortable-header">
//                     Reseller {getSortIcon('resellerName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productName')} className="sortable-header">
//                     Product {getSortIcon('productName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productCategory.name')} className="sortable-header">
//                     Category {getSortIcon('productCategory.name')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('availableQuantity')} className="sortable-header">
//                     Available {getSortIcon('availableQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('pendingIncomingQuantity')} className="sortable-header">
//                     Pending {getSortIcon('pendingIncomingQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('consumedQuantity')} className="sortable-header">
//                     Consumed {getSortIcon('consumedQuantity')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map((item) => (
//                       <CTableRow key={item._id}>
//                         <CTableDataCell>
//                           {item.resellerName || ''}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productName || ''}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.productCategory?.name || ''}</CTableDataCell>
//                         <CTableDataCell>
//                           {item.availableQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.pendingIncomingQuantity || 0}</CTableDataCell>
//                         <CTableDataCell>{item.consumedQuantity || 0}</CTableDataCell>
//                       </CTableRow>
//                     ))}
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="12" className="text-center">
//                       {loading ? (
//                         <CSpinner size="sm" />
//                       ) : (
//                         'No data found. Try adjusting your search filters.'
//                       )}
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
          
//           {data.length > 0 && (
//             <div className="mt-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <small className="text-muted">
//                   Showing {filteredData.length} of {data.length} items
//                   {totalPages > 1 && ` | Page ${currentPage} of ${totalPages}`}
//                 </small>
//               </div>
//               {totalPages > 1 && (
//                 <div>
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default ResellerStock; 




import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useRef, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CFormTextarea,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilCheckCircle, cilXCircle } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError, showSuccess, confirmAction } from 'src/utils/sweetAlerts';
import ResellerStockSearch from './ResellerStockSearch';

const ResellerStock = () => {
  const [data, setData] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    product: '', 
    reseller: '', 
    center: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [centers, setCenters] = useState([]);
  
  // Selection states
  const [selectedItems, setSelectedItems] = useState({});
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller);
      }
      if (searchParams.center) {
        params.append('sourceCenter', searchParams.center);
      }
      if (searchParams.fromCenter) {
        params.append('fromCenter', searchParams.fromCenter);
      }
      params.append('page', page);
      params.append('includePending', 'true');
      
      const url = params.toString() 
        ? `/availablestock/reseller?${params.toString()}` 
        : '/availableStock/reseller';
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        const stockData = response.data.data.stock || [];
        setData(stockData);
        setCurrentPage(response.data.data.pagination?.currentPage || 1);
        setTotalPages(response.data.data.pagination?.totalPages || 1);
        
        // Initialize selection state
        const initialSelection = {};
        stockData.forEach(item => {
          if (item.pendingIncomingQuantity > 0) {
            initialSelection[item._id] = false; // Initially not selected
          }
        });
        setSelectedItems(initialSelection);
        
        if (response.data.data.center) {
          setCenters([response.data.data.center]);
        } else if (response.data.data.sourceCenter) {
          setCenters([response.data.data.sourceCenter]);
        } else {
          setCenters([]);
        }
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching resellers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchResellers();
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue = a;
      let bValue = b;
      
      if (key.includes('.')) {
        const keys = key.split('.');
        aValue = keys.reduce((obj, k) => obj && obj[k], a);
        bValue = keys.reduce((obj, k) => obj && obj[k], b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ product: '', reseller: '', center: '' });
    setSearchTerm('');
    setCenters([]);
    fetchData({}, 1);
  };

  // Handle checkbox selection for a single item
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle select all items with pending transfers
  const handleSelectAll = () => {
    const itemsWithPending = data.filter(item => item.pendingIncomingQuantity > 0);
    
    // Check if all pending items are already selected
    const allSelected = itemsWithPending.every(item => selectedItems[item._id]);
    
    const newSelection = { ...selectedItems };
    itemsWithPending.forEach(item => {
      newSelection[item._id] = !allSelected;
    });
    
    setSelectedItems(newSelection);
  };

  // Get selected items count
  const getSelectedCount = () => {
    return Object.values(selectedItems).filter(val => val).length;
  };

  // Get selected items
  const getSelectedItems = () => {
    return data.filter(item => selectedItems[item._id] && item.pendingIncomingQuantity > 0);
  };

  // Check if any pending items are selected
  const hasSelectedPendingItems = () => {
    return getSelectedCount() > 0;
  };

  // Accept selected transfers
  const handleAcceptTransfers = async () => {
    try {
      const selectedItems = getSelectedItems();
      if (selectedItems.length === 0) {
        showError('Please select items with pending transfers to accept');
        return;
      }

      const totalQuantity = selectedItems.reduce((sum, item) => sum + (item.pendingIncomingQuantity || 0), 0);
      
      const result = await confirmAction(
        'Accept Pending Transfers',
        `Are you sure you want to accept ${totalQuantity} pending item(s) from ${selectedItems.length} product(s)?`,
        'question',
        'Yes, Accept'
      );

      if (!result.isConfirmed) return;

      setActionLoading(true);
      
      // Prepare data for API call
      const transfers = selectedItems.map(item => ({
        resellerId: item.reseller,
        productId: item.product,
        quantity: item.pendingIncomingQuantity
      }));

      const response = await axiosInstance.post('/reseller-transfer', {
        action: 'accept',
        transfers
      });

      if (response.data.success) {
        showSuccess(response.data.message || `Accepted ${totalQuantity} pending item(s) successfully!`);
        
        fetchData(activeSearch, currentPage);
        setSelectedItems({});
      } else {
        throw new Error(response.data.message || 'Failed to accept transfers');
      }
    } catch (error) {
      console.error('Error accepting transfers:', error);
      showError(error, 'Failed to accept transfers');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject selected transfers
  const handleRejectTransfers = async () => {
    try {
      const selectedItems = getSelectedItems();
      if (selectedItems.length === 0) {
        showError('Please select items with pending transfers to reject');
        return;
      }

      if (!rejectReason.trim()) {
        showError('Please provide a reason for rejection');
        return;
      }

      const totalQuantity = selectedItems.reduce((sum, item) => sum + (item.pendingIncomingQuantity || 0), 0);
      
      const result = await confirmAction(
        'Reject Pending Transfers',
        `Are you sure you want to reject ${totalQuantity} pending item(s) from ${selectedItems.length} product(s)?`,
        'warning',
        'Yes, Reject'
      );

      if (!result.isConfirmed) return;

      setActionLoading(true);
      
      // Prepare data for API call
      const transfers = selectedItems.map(item => ({
        resellerId: item.reseller,
        productId: item.product,
        quantity: item.pendingIncomingQuantity
      }));

      const response = await axiosInstance.post('/reseller-transfer', {
        action: 'reject',
        reason: rejectReason,
        transfers
      });

      if (response.data.success) {
        showSuccess(response.data.message || `Rejected ${totalQuantity} pending item(s) successfully!`);
        
        // Refresh data and reset selections
        fetchData(activeSearch, currentPage);
        setSelectedItems({});
        setRejectReason('');
        setRejectModalVisible(false);
      } else {
        throw new Error(response.data.message || 'Failed to reject transfers');
      }
    } catch (error) {
      console.error('Error rejecting transfers:', error);
      showError(error, 'Failed to reject transfers');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (activeSearch.product || activeSearch.reseller || activeSearch.center) {
      return true;
    }
    return Object.values(item).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });


  const generateDetailExport = async () => {
    try {
      setLoading(true);
    
      const params = new URLSearchParams();
      
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.reseller) {
        params.append('reseller', activeSearch.reseller);
      }
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      
      const apiUrl = params.toString() 
        ? `/availableStock/reseller?${params.toString()}` 
        : '/availableStock/reseller';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      const exportData = response.data.data.stock || [];
      
      if (exportData.length === 0) {
        showError('No data available for export');
        return;
      }
      const headers = [
        'Reseller',
        'Product',
        'Category',
        'Total Quantity',
        'Available Quantity',
        'Consumed Quantity',
        'Pending Transfers'
      ];
  
      const csvData = exportData.map(item => [
        item.resellerName || '',
        item.productName || '',
        item.productCategory?.name || "",
        item.totalQuantity || 0,
        item.availableQuantity || 0,
        item.consumedQuantity || 0,
        item.pendingIncomingQuantity || 0
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            const stringField = String(field || '');
            return `"${stringField.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', `reseller_stock_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      showSuccess('Export completed successfully');
    
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Reseller Stock</div>
    
      <ResellerStockSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        resellers={resellers}
        products={products}
      />
      
      {alert.show && (
        <CAlert 
          color={alert.type} 
          dismissible 
          onClose={() => setAlert({ show: false, type: '', message: '' })}
          className="mb-3"
        >
          {alert.message}
        </CAlert>
      )}
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.product || activeSearch.reseller || activeSearch.center) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
               <CIcon icon={cilZoomOut} className='icon' />
                Reset Search
              </CButton>
            )}
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={generateDetailExport}
              disabled={data.length === 0}
            >
              <i className="fa fa-fw fa-file-excel"></i>
               Export
            </CButton>
            
            {hasSelectedPendingItems() && (
              <>
                <CButton
                  size="sm"
                  color="success"
                  className="action-btn me-1"
                  onClick={handleAcceptTransfers}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <CSpinner size="sm" />
                  ) : (
                    <>
                      <CIcon icon={cilCheckCircle} /> Accept ({getSelectedCount()})
                    </>
                  )}
                </CButton>

                <CButton
                  size="sm"
                  color="danger"
                  className="action-btn me-1"
                  onClick={() => setRejectModalVisible(true)}
                  disabled={actionLoading}
                >
                  <CIcon icon={cilXCircle} /> Reject ({getSelectedCount()})
                </CButton>
              </>
            )}
          </div>
          
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div>
              {hasSelectedPendingItems() && (
                <CBadge color="info" className="me-2">
                  Selected: {getSelectedCount()} items
                </CBadge>
              )}
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" width="50px" className="text-center">
                    <CFormCheck
                      checked={
                        data.filter(item => item.pendingIncomingQuantity > 0).length > 0 &&
                        data.filter(item => item.pendingIncomingQuantity > 0).every(item => selectedItems[item._id])
                      }
                      onChange={handleSelectAll}
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('resellerName')} className="sortable-header">
                    Reseller {getSortIcon('resellerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productName')} className="sortable-header">
                    Product {getSortIcon('productName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productCategory.name')} className="sortable-header">
                    Category {getSortIcon('productCategory.name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('availableQuantity')} className="sortable-header">
                    Available {getSortIcon('availableQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('pendingIncomingQuantity')} className="sortable-header">
                    Pending {getSortIcon('pendingIncomingQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('consumedQuantity')} className="sortable-header">
                    Consumed {getSortIcon('consumedQuantity')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell className="text-center">
                          {item.pendingIncomingQuantity > 0 && (
                            <CFormCheck
                              checked={!!selectedItems[item._id]}
                              onChange={() => handleSelectItem(item._id)}
                            />
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.resellerName || ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productName || ''}
                        </CTableDataCell>
                        <CTableDataCell>{item.productCategory?.name || ''}</CTableDataCell>
                        <CTableDataCell>
                          {item.availableQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.pendingIncomingQuantity > 0 ? (
                            <CBadge color="warning">
                              {item.pendingIncomingQuantity}
                            </CBadge>
                          ) : (
                            <span className="text-muted">0</span>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{item.consumedQuantity || 0}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      {loading ? (
                        <CSpinner size="sm" />
                      ) : (
                        'No data found. Try adjusting your search filters.'
                      )}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
          
          {data.length > 0 && (
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing {filteredData.length} of {data.length} items
                  {totalPages > 1 && ` | Page ${currentPage} of ${totalPages}`}
                </small>
              </div>
              {totalPages > 1 && (
                <div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Reject Confirmation Modal */}
      <CModal visible={rejectModalVisible} onClose={() => setRejectModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Rejection</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to reject pending transfers for {getSelectedCount()} selected item(s)?</p>
          <div className="mb-3">
            <CFormLabel htmlFor="rejectReason">Rejection Reason (Required)</CFormLabel>
            <CFormTextarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={3}
              required
            />
          </div>
          <ul>
            <li>Selected Items: {getSelectedCount()}</li>
            <li>This action will return items to the outlet stock.</li>
          </ul>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRejectModalVisible(false)}>
            Cancel
          </CButton>
          <CButton 
            color="danger" 
            onClick={handleRejectTransfers}
            disabled={actionLoading || !rejectReason.trim()}
          >
            {actionLoading ? (
              <>
                <CSpinner size="sm" /> Processing...
              </>
            ) : (
              'Confirm Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ResellerStock;
