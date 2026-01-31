// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
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
//   CSpinner
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch,cilZoomOut } from '@coreui/icons';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError } from 'src/utils/sweetAlerts';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import TransactionSearch from './TransactionSearch';
// import { useLocation } from 'react-router-dom';

// const TransactionReport = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [activeSearch, setActiveSearch] = useState({ 
//     product: '', 
//     center: '', 
//     usageType: '', 
//     status: '', 
//     createdBy: '', 
//     startDate: '', 
//     endDate: '' 
//   });
//   const location = useLocation();

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(location.search);
//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
//       usageType: searchParams.get('usageType'),
//       productName: searchParams.get('productName'),
//       centerName: searchParams.get('centerName'),
//       month: searchParams.get('month')
//     };
//   };
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);
//         const urlParams = getUrlParams();
        
//         console.log('Transaction Report URL Parameters:', urlParams);

//         await Promise.all([fetchCenters(), fetchProducts(), fetchCustomers()]);
        
//         let searchParams = {};

//         if (urlParams.product || urlParams.center || urlParams.usageType) {
//           searchParams = {
//             product: urlParams.product || '',
//             center: urlParams.center || '',
//             usageType: urlParams.usageType || '',
//             startDate: '',
//             endDate: '',
//             status: '',
//             createdBy: ''
//           };
          
//           console.log('Using filtered search from URL:', searchParams);
//           setActiveSearch(searchParams);

//           if (urlParams.productName && urlParams.centerName && urlParams.usageType) {
//             document.title = `Transaction Report - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)} (${urlParams.usageType})`;
//           }
//         } else {
//           console.log('No URL parameters, fetching all data');
//           searchParams = {};
//         }
        
//         await fetchData(searchParams, 1);
        
//       } catch (error) {
//         console.error('Error initializing data:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     initializeData();
//   }, [location.search]);


//  const fetchData = async (searchParams = {}, page = 1) => {
//   try {
//     setLoading(true);
//     const params = new URLSearchParams();
    
//     // Get URL parameters
//     const urlParams = getUrlParams();
    
//     // Use URL params if available, otherwise use searchParams
//     const productId = urlParams.product || searchParams.product;
//     const centerId = urlParams.center || searchParams.center;
//     const usageType = urlParams.usageType || searchParams.usageType;
    
//     if (productId) {
//       params.append('product', productId);
//     }
//     if (centerId) {
//       params.append('center', centerId);
//     }
//     if (usageType) {
//       params.append('usageType', usageType);
//     }
    
//     // Handle other search parameters
//     if (searchParams.status) {
//       params.append('status', searchParams.status);
//     }
//     if (searchParams.createdBy) {
//       params.append('createdBy', searchParams.createdBy);
//     }
//     if (searchParams.startDate) {
//       params.append('startDate', searchParams.startDate);
//     }
//     if (searchParams.endDate) {
//       params.append('endDate', searchParams.endDate);
//     }
    
//     // If month is provided in URL, calculate date range
//     if (urlParams.month) {
//       const [year, month] = urlParams.month.split('-');
//       const monthStart = `${year}-${month.padStart(2, '0')}-01`;
//       const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
//       const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
      
//       params.append('startDate', monthStart);
//       params.append('endDate', monthEnd);
//     }
    
//     params.append('page', page);
//     const url = params.toString() ? `/availableStock/transactions?${params.toString()}` : '/availableStock/transactions';
//     console.log('Fetching Transaction Report URL:', url);
//     const response = await axiosInstance.get(url);
    
//     if (response.data.success) {
//       setData(response.data.data);
//       setCurrentPage(response.data.pagination.currentPage);
//       setTotalPages(response.data.pagination.totalPages);
//     } else {
//       throw new Error('API returned unsuccessful response');
//     }
//   } catch (err) {
//     setError(err.message);
//     console.error('Error fetching data:', err);
//   } finally {
//     setLoading(false);
//   }
// };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');
//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const response = await axiosInstance.get('/customers');
//       if (response.data.success) {
//         setCustomers(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//     fetchCustomers();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
//   };
  
//   const calculateTotals = () => {
//     const totals = {
//       total: 0
//     };

//     filteredData.forEach(item => {
//       totals.total += parseFloat(item.Qty || 0);
//     });

//     return totals;
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
//     const resetSearch = { 
//       product: '', 
//       center: '', 
//       usageType: '', 
//       status: '', 
//       createdBy: '', 
//       startDate: '', 
//       endDate: '' 
//     };
//     setActiveSearch(resetSearch);
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return Object.values(activeSearch).some(value => value !== '');
//   };
  
//   const filteredData = data.filter(item => {
//     if (isSearchActive()) {
//       return true;
//     }
//     return Object.values(item).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//        {error}
//       </div>
//     );
//   }

//   const totals = calculateTotals();

//   const fetchAllDataForExport = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/stockpurchase');
//       if (response.data.success) {
//         return response.data.data;
//       } else {
//         throw new Error('API returned unsuccessful response');
//       }
//     } catch (err) {
//       console.error('Error fetching data for export:', err);
//       showError('Error fetching data for export');
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
    
//       const allData = await fetchAllDataForExport();
      
//       if (!allData || allData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Invoice No',
//         'Vendor',
//         'Transport Amount',
//         'Created At',
//         'Center Title',
//         'Product Title',
//         'Purchase Date',
//         'Note',
//         'Quantity',
//         'Price',
//         'Total Amount',
//         'Type',
//         'Status'
//       ];
  
//       const csvData = allData.flatMap(purchase => {
//         if (purchase.products && purchase.products.length > 0) {
//           return purchase.products.map(product => [
//             purchase.invoiceNo,
//             purchase.vendor?.businessName || 'N/A',
//             purchase.transportAmount || 0,
//             formatDateTime(purchase.createdAt),
//             purchase.outlet?.centerName || 'N/A',
//             product.product?.productTitle || 'N/A',
//             formatDate(purchase.date),
//             purchase.remark || '',
//             product.purchasedQuantity || 0,
//             product.price || 0,
//             purchase.totalAmount || 0,
//             purchase.type || 'N/A',
//             purchase.status || 'N/A'
//           ]);
//         } else {
//           return [[
//             purchase.invoiceNo,
//             purchase.vendor?.businessName || 'N/A',
//             purchase.transportAmount || 0,
//             formatDateTime(purchase.createdAt),
//             purchase.outlet?.centerName || 'N/A',
//             'No Product',
//             formatDate(purchase.date),
//             purchase.remark || '',
//             0,
//             0,
//             purchase.totalAmount || 0,
//             purchase.type || 'N/A',
//             purchase.status || 'N/A'
//           ]];
//         }
//       });
  
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
//       const url = URL.createObjectURL(blob);
      
//       link.setAttribute('href', url);
//       link.setAttribute('download', `stock_purchase_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
    
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div>
//       <div className='title'>Transaction Report </div>
    
//       <TransactionSearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         customers={customers}
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
//             {isSearchActive() && (
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
//               <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={generateDetailExport}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//                Export
//             </CButton>
          
//           </div>
          
//           <div>
//           <Pagination
//       currentPage={currentPage}
//       totalPages={totalPages}
//       onPageChange={handlePageChange}
//     />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div>
//             </div>
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
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>

//               <CTableHeaderCell scope="col" onClick={() => handleSort('date')}         className="sortable-header">
//                  Date {getSortIcon('date')}
//                 </CTableHeaderCell>

//                 <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
//                   Type {getSortIcon('invoiceNo')}
//                 </CTableHeaderCell>

//                 <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
//                  Branch {getSortIcon('outlet')}
//                 </CTableHeaderCell>

//                 <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
//                  Parent Branch {getSortIcon('outlet')}
//                 </CTableHeaderCell>

//                 <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                   Product {getSortIcon('vendor.businessName')}
//                 </CTableHeaderCell>

//                 <CTableHeaderCell scope="col" onClick={() => handleSort('center.area.areaName')} className="sortable-header">
//                  Qty {getSortIcon('center.area.areaName')}
//                 </CTableHeaderCell>

//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.length > 0 ? (
//                 <>
//                   {filteredData.map((item) => (
//                     <CTableRow key={item._id}>
//                       <CTableDataCell>
//                           {item.Date || ''}
//                       </CTableDataCell>
//                       <CTableDataCell>{(item.Type)}</CTableDataCell>
//                       <CTableDataCell>
                    
//                     {item.Center}
//                       </CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell>{item.Product || 0}</CTableDataCell>
//                       <CTableDataCell>{item.Qty}</CTableDataCell>
//                     </CTableRow>
//                   ))}
//                   <CTableRow className='total-row '>
//                     <CTableDataCell colSpan="1">Total Counts</CTableDataCell>
//                     <CTableDataCell></CTableDataCell>
//                     <CTableDataCell></CTableDataCell>
//                     <CTableDataCell></CTableDataCell>
//                     <CTableDataCell></CTableDataCell>
//                     <CTableDataCell>{totals.total.toFixed(2)}</CTableDataCell>
//                   </CTableRow>
//                 </>
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan="11" className="text-center">
//                     No data found
//                   </CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default TransactionReport;




import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import TransactionSearch from './TransactionSearch';
import { useLocation } from 'react-router-dom';

const TransactionReport = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSearch, setActiveSearch] = useState({ 
    product: '', 
    center: '', 
    usageType: '', 
    status: '', 
    createdBy: '', 
    startDate: '', 
    endDate: '' 
  });
  
  // Serial number modal state
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState([]);
  
  const location = useLocation();

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      product: searchParams.get('product'),
      center: searchParams.get('center'),
      usageType: searchParams.get('usageType'),
      productName: searchParams.get('productName'),
      centerName: searchParams.get('centerName'),
      month: searchParams.get('month')
    };
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const urlParams = getUrlParams();
        
        console.log('Transaction Report URL Parameters:', urlParams);

        await Promise.all([fetchCenters(), fetchProducts(), fetchCustomers()]);
        
        let searchParams = {};

        if (urlParams.product || urlParams.center || urlParams.usageType) {
          searchParams = {
            product: urlParams.product || '',
            center: urlParams.center || '',
            usageType: urlParams.usageType || '',
            startDate: '',
            endDate: '',
            status: '',
            createdBy: ''
          };
          
          console.log('Using filtered search from URL:', searchParams);
          setActiveSearch(searchParams);

          if (urlParams.productName && urlParams.centerName && urlParams.usageType) {
            document.title = `Transaction Report - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)} (${urlParams.usageType})`;
          }
        } else {
          console.log('No URL parameters, fetching all data');
          searchParams = {};
        }
        
        await fetchData(searchParams, 1);
        
      } catch (error) {
        console.error('Error initializing data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    initializeData();
  }, [location.search]);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      const urlParams = getUrlParams();
      
      const productId = urlParams.product || searchParams.product;
      const centerId = urlParams.center || searchParams.center;
      const usageType = urlParams.usageType || searchParams.usageType;
      
      if (productId) {
        params.append('product', productId);
      }
      if (centerId) {
        params.append('center', centerId);
      }
      if (usageType) {
        params.append('usageType', usageType);
      }
      
      if (searchParams.status) {
        params.append('status', searchParams.status);
      }
      if (searchParams.createdBy) {
        params.append('createdBy', searchParams.createdBy);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      
      if (urlParams.month) {
        const [year, month] = urlParams.month.split('-');
        const monthStart = `${year}-${month.padStart(2, '0')}-01`;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
        
        params.append('startDate', monthStart);
        params.append('endDate', monthEnd);
      }
      
      params.append('page', page);
      const url = params.toString() ? `/availableStock/transactions?${params.toString()}` : '/availableStock/transactions';
      console.log('Fetching Transaction Report URL:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers');
      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers');
      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };
  
  const calculateTotals = () => {
    const totals = {
      total: 0
    };

    filteredData.forEach(item => {
      totals.total += parseFloat(item.Qty || 0);
    });

    return totals;
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
    const resetSearch = { 
      product: '', 
      center: '', 
      usageType: '', 
      status: '', 
      createdBy: '', 
      startDate: '', 
      endDate: '' 
    };
    setActiveSearch(resetSearch);
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return Object.values(activeSearch).some(value => value !== '');
  };
  
  const filteredData = data.filter(item => {
    if (isSearchActive()) {
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

  // Function to open serial number modal
  const handleShowSerialNumbers = (item) => {
    if (item.TrackSerialNumber === "Yes" && item.SerialNumbers && item.SerialNumbers.length > 0) {
      setSelectedItem(item);
      setSelectedSerials(item.SerialNumbers);
      setSerialModalVisible(true);
    }
  };

  if (loading) {
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

  const totals = calculateTotals();

  return (
    <div>
      <div className='title'>Transaction Report</div>
    
      <TransactionSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        customers={customers}
      />
      
      <CModal 
        visible={serialModalVisible} 
        onClose={() => setSerialModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            Serial Numbers - {selectedItem?.Product}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && (
            <>
              <CTable bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell width="15%">SR No.</CTableHeaderCell>
                    <CTableHeaderCell width="85%">Serial Number</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedSerials.length > 0 ? (
                    selectedSerials.map((serial, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <strong>{index + 1}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="p-2 border rounded bg-light">
                            <strong>{serial}</strong>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="2" className="text-center text-muted">
                        No serial numbers available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSerialModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      
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
            {isSearchActive() && (
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
            <div></div>
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Date')} className="sortable-header">
                    Date {getSortIcon('Date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Type')} className="sortable-header">
                    Type {getSortIcon('Type')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Center')} className="sortable-header">
                    Branch {getSortIcon('Center')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Center')} className="sortable-header">
                    Parent Branch {getSortIcon('Center')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Product')} className="sortable-header">
                    Product {getSortIcon('Product')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Qty')} className="sortable-header">
                    Qty {getSortIcon('Qty')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>{item.Date || ''}</CTableDataCell>
                        <CTableDataCell>{item.Type}</CTableDataCell>
                        <CTableDataCell>{item.Center}</CTableDataCell>
                        <CTableDataCell></CTableDataCell>
                        <CTableDataCell>{item.Product || 0}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center justify-content-between">
                            <span>{item.Qty}</span>
                            {item.TrackSerialNumber === "Yes" && item.SerialNumberCount > 0 && (
                              <span
                                onClick={() => handleShowSerialNumbers(item)}
                                title={`Click to view ${item.SerialNumberCount} serial number(s)`}
                                style={{
                                  fontSize: '18px',
                                  cursor: 'pointer',
                                  color: '#337ab7'
                                }}
                              >
                                ☰
                               
                              </span>
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5">Total Counts</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center justify-content-between">
                          <span>{totals.total.toFixed(2)}</span>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      No data found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TransactionReport;