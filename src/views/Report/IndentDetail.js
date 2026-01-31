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
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError } from 'src/utils/sweetAlerts';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import CommonSearch from './CommonSearch';
// import { useLocation, useNavigate } from 'react-router-dom';
// const IndentDetail = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ center: '', product: '', startDate:'', endDate:'' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(location.search);
//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
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
        
//         console.log('Indent Detail URL Parameters:', urlParams);
        
//         // Fetch dropdown data first
//         await Promise.all([fetchCenters(), fetchProducts()]);
        
//         let searchParams = {};
        
//         // Check if we have URL parameters
//         if (urlParams.product && urlParams.center) {
//           searchParams = {
//             product: urlParams.product,
//             center: urlParams.center,
//             startDate: '',
//             endDate: ''
//           };
          
//           // Add date range if month is provided
//           if (urlParams.month) {
//             const [year, month] = urlParams.month.split('-');
//             const monthStart = `${year}-${month.padStart(2, '0')}-01`;
//             const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
//             const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
            
//             // Format for your search component
//             searchParams.date = `01-${month.padStart(2, '0')}-${year} to ${lastDay}-${month.padStart(2, '0')}-${year}`;
//           }
          
//           console.log('Using filtered search from URL:', searchParams);
//           setActiveSearch(searchParams);
          
//           // Set document title
//           if (urlParams.productName && urlParams.centerName) {
//             document.title = `Indent Details - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)}`;
//           }
//         } else {
//           console.log('No URL parameters, fetching all data');
//           searchParams = {};
//         }
        
//         // Fetch data with determined parameters
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

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
      
//       if (searchParams.date && searchParams.date.includes(' to ')) {
//         const [startDateStr, endDateStr] = searchParams.date.split(' to ');
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(startDateStr));
//         params.append('endDate', convertDateFormat(endDateStr));
//       }
      
//       params.append('page', page);
//       const url = params.toString() ? `/reports/requests?${params.toString()}` : '/reports/requests';
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setData(response.data.data);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         throw new Error('API returned unsuccessful response');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
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
//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
//   };

//   const handleClick = (itemId) => {
//     navigate(`/stockRequest-profile/${itemId}`);
//   };

//   const getFlattenedData = () => {
//     const flattened = [];
//     data.forEach(request => {
//       if (request.products && request.products.length > 0) {
//         request.products.forEach(product => {
//           flattened.push({
//             ...request,
//             productDetail: product,
//             uniqueKey: `${request._id}_${product._id}`
//           });
//         });
//       } else {
//         flattened.push({
//           ...request,
//           productDetail: null,
//           uniqueKey: `${request._id}_no_product`
//         });
//       }
//     });
//     return flattened;
//   };

//   const calculateTotals = () => {
//     const totals = {
//       totalRequestedQty: 0,
//       totalApprovedQty: 0,
//       totalReceivedQty: 0
//     };

//     getFlattenedData().forEach(item => {
//       if (item.productDetail) {
//         totals.totalRequestedQty += parseFloat(item.productDetail.quantity || 0);
//         totals.totalApprovedQty += parseFloat(item.productDetail.approvedQuantity || 0);
//         totals.totalReceivedQty += parseFloat(item.productDetail.receivedQuantity || 0);
//       }
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
//     setActiveSearch({ center: '', product: '', startDate:'', endDate:'' });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const filteredFlattenedData = getFlattenedData().filter(item => {
//     if (activeSearch.center || activeSearch.product || activeSearch.startDate || activeSearch.endDate) {
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
// {error}
//       </div>
//     );
//   }

//   const totals = calculateTotals();

//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
      
//       if (activeSearch.date && activeSearch.date.includes(' to ')) {
//         const [startDateStr, endDateStr] = activeSearch.date.split(' to ');
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(startDateStr));
//         params.append('endDate', convertDateFormat(endDateStr));
//       }
      
//       const apiUrl = params.toString() 
//         ? `/reports/requests?${params.toString()}` 
//         : '/reports/requests';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data;
      
//       if (!exportData || exportData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Invoice No.',
//         'Date',
//         'Center',
//         'Parent Center',
//         'Product',
//         'Quantity',
//         'Center Stock',
//         'Parent Stock',
//         'Product Remark',
//         'Approved Quantity',
//         'Approved Remark',
//         'Received Qty.',
//         'Received Remark'
//       ];
  
//       const csvData = exportData.flatMap(request => {
//         if (request.products && request.products.length > 0) {
//           return request.products.map(product => [
//             request.orderNumber || 'N/A',
//             formatDate(request.date),
//             request.center?.centerName || 'N/A',
//             request.warehouse?.centerName || 'N/A',
//             product.product?.productTitle || 'N/A',
//             product.quantity || 0,
//             product.centerStock?.availableQuantity || 0,
//             product.outletStock?.availableQuantity || 0,
//             product.productRemark || '',
//             product.approvedQuantity || 0,
//             product.approvedRemark || '',
//             product.receivedQuantity || 0,
//             product.receivedRemark || '',
//             request.status || 'N/A',
//             request.remark || '',
//             formatDateTime(request.createdAt)
//           ]);
//         } else {
//           return [[
//             request.orderNumber || 'N/A',
//             formatDate(request.date),
//             request.center?.centerName || 'N/A',
//             request.warehouse?.centerName || 'N/A',
//             'No Product',
//             0,
//             0,
//             0,
//             '',
//             0,
//             '',
//             0,
//             '',
//             request.status || 'N/A',
//             request.remark || '',
//             formatDateTime(request.createdAt)
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
//       const downloadUrl = URL.createObjectURL(blob);
      
//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', `indent_detail_report_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);
    
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className='title'>Indent Detail Report</div>
//       <CommonSearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
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
//             {(activeSearch.center || activeSearch.product || activeSearch.startDate || activeSearch.endDate ) && (
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
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('orderNumber')} className="sortable-header">
//                     Indent No {getSortIcon('orderNumber')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Date {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//                     Branch {getSortIcon('center.centerName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('warehouse.centerName')} className="sortable-header">
//                     Parent Branch {getSortIcon('warehouse.centerName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
//                     Product {getSortIcon('productDetail.product.productTitle')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.quantity')} className="sortable-header">
//                     Requested Qty {getSortIcon('productDetail.quantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.centerStock.availableQuantity')} className="sortable-header">
//                     Center Stock {getSortIcon('productDetail.centerStock.availableQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.outletStock.availableQuantity')} className="sortable-header">
//                     Parent Stock {getSortIcon('productDetail.outletStock.availableQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.approvedQuantity')} className="sortable-header">
//                     Approved Qty {getSortIcon('productDetail.approvedQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.receivedQuantity')} className="sortable-header">
//                     Received Qty {getSortIcon('productDetail.receivedQuantity')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredFlattenedData.length > 0 ? (
//                   <>
//                     {filteredFlattenedData.map((item) => (
//                       <CTableRow key={item.uniqueKey}>
//                         {/* <CTableDataCell>{item.orderNumber || ''}</CTableDataCell> */}
//                         <CTableDataCell>

//                         <button 
//                     className="btn btn-link p-0 text-decoration-none"
//                     onClick={() => handleClick(item._id)}
//                     style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                   >
//                     {item.orderNumber || ''}
//                   </button>
//                         </CTableDataCell>
//                         <CTableDataCell>{formatDate(item.date || '')}</CTableDataCell>
//                         <CTableDataCell>{item.center?.centerName || ''}</CTableDataCell>
//                         <CTableDataCell>{item.warehouse?.centerName || ''}</CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.product?.productTitle || 'No Product'}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.quantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.centerStock?.availableQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.outletStock?.availableQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.approvedQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.receivedQuantity || 0}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="5">Total</CTableDataCell>
//                       <CTableDataCell>{totals.totalRequestedQty}</CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell>{totals.totalApprovedQty}</CTableDataCell>
//                       <CTableDataCell>{totals.totalReceivedQty}</CTableDataCell>
//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="11" className="text-center">
//                       No data found
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default IndentDetail;





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
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { formatDate} from 'src/utils/FormatDateTime';
import CommonSearch from './CommonSearch';
import { useLocation, useNavigate } from 'react-router-dom';

const IndentDetail = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    center: '', 
    product: '', 
    startDate: '', 
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      product: searchParams.get('product'),
      center: searchParams.get('center'),
      productName: searchParams.get('productName'),
      centerName: searchParams.get('centerName'),
      month: searchParams.get('month'),
    };
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const urlParams = getUrlParams();
        
        console.log('🔍 Indent Detail URL Parameters:', urlParams);
        
        await Promise.all([fetchCenters(), fetchProducts()]);
        
        const hasUrlFilters = urlParams.product || urlParams.center;
        
        let searchParams = {};
        
        if (hasUrlFilters) {
          searchParams = {
            product: urlParams.product || '',
            center: urlParams.center || '',
            startDate: '',
            endDate: ''
          };
          if (urlParams.month) {
            const [year, month] = urlParams.month.split('-');
            const monthStart = `${year}-${month.padStart(2, '0')}-01`;
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
            
            searchParams.startDate = monthStart;
            searchParams.endDate = monthEnd;
            searchParams.date = `01-${month.padStart(2, '0')}-${year} to ${lastDay}-${month.padStart(2, '0')}-${year}`;
          }
          
          console.log('✅ Using filtered search from URL:', searchParams);
        } else {
          console.log('ℹ️ No URL filters, showing all data');
        }
        
        setActiveSearch(prev => ({
          ...prev,
          ...searchParams
        }));
        
        await fetchData(searchParams, 1);
        if (urlParams.productName && urlParams.centerName) {
          const title = `Indent Details - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)}`;
          document.title = title;
          console.log('📝 Document title set:', title);
        }
        
      } catch (error) {
        console.error('❌ Error initializing data:', error);
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
      
      console.log('📤 Fetching data with params:', searchParams);
      
      if (searchParams.center) {
        params.append('centerId', searchParams.center); 
        params.append('center', searchParams.center);
      }
      
      if (searchParams.product) {
        params.append('productId', searchParams.product);
        params.append('product', searchParams.product);
      }
      
      if (searchParams.startDate && searchParams.endDate) {
        params.append('startDate', searchParams.startDate);
        params.append('endDate', searchParams.endDate);
      } else if (searchParams.date && searchParams.date.includes(' to ')) {
        const [startDateStr, endDateStr] = searchParams.date.split(' to ');
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(startDateStr));
        params.append('endDate', convertDateFormat(endDateStr));
      }
      
      params.append('page', page);
      
      const url = params.toString() 
        ? `/reports/requests?${params.toString()}` 
        : '/reports/requests';
      
      console.log('🌐 API URL:', url);
      
      const response = await axiosInstance.get(url);
      
      console.log('📥 API Response:', response.data);
      
      if (response.data.success) {
        setData(response.data.data || []);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setTotalPages(response.data.pagination?.totalPages || 1);
        
        console.log(`✅ Loaded ${response.data.data?.length || 0} records`);
        
        if (searchParams.center || searchParams.product) {
          const filteredCount = response.data.data?.length || 0;
          console.log(`🔍 Filtered results: ${filteredCount} records`);
        }
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
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
      console.error('Error fetching centers:', error);
    }
  };
 
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

  const handleClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`);
  };

  const getFlattenedData = () => {
    const flattened = [];
    data.forEach(request => {
      if (request.products && request.products.length > 0) {
        request.products.forEach(product => {
          flattened.push({
            ...request,
            productDetail: product,
            uniqueKey: `${request._id}_${product._id}`
          });
        });
      } else {
        flattened.push({
          ...request,
          productDetail: null,
          uniqueKey: `${request._id}_no_product`
        });
      }
    });
    return flattened;
  };

  const calculateTotals = () => {
    const totals = {
      totalRequestedQty: 0,
      totalApprovedQty: 0,
      totalReceivedQty: 0
    };

    getFlattenedData().forEach(item => {
      if (item.productDetail) {
        totals.totalRequestedQty += parseFloat(item.productDetail.quantity || 0);
        totals.totalApprovedQty += parseFloat(item.productDetail.approvedQuantity || 0);
        totals.totalReceivedQty += parseFloat(item.productDetail.receivedQuantity || 0);
      }
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
    const mergedSearch = {
      ...activeSearch,
      ...searchData
    };
    setActiveSearch(mergedSearch);
    fetchData(mergedSearch, 1);
  };

  const handleResetSearch = () => {
    const resetSearch = { 
      center: '', 
      product: '', 
      startDate: '', 
      endDate: '',
      date: ''
    };
    setActiveSearch(resetSearch);
    setSearchTerm('');
    fetchData({}, 1);
  };

  const filteredFlattenedData = getFlattenedData().filter(item => {
    if (activeSearch.center || activeSearch.product || activeSearch.startDate || activeSearch.endDate) {
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

  const hasActiveFilters = activeSearch.center || activeSearch.product;

  return (
    <div>
      <div className='title'>Indent Detail Report</div>
      <CommonSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        initialValues={activeSearch}
      />
      
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
            {(activeSearch.center || activeSearch.product || activeSearch.startDate || activeSearch.endDate) && (
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
            <div>
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in table..."
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('orderNumber')} className="sortable-header">
                    Indent No {getSortIcon('orderNumber')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                    Branch {getSortIcon('center.centerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('warehouse.centerName')} className="sortable-header">
                    Parent Branch {getSortIcon('warehouse.centerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
                    Product {getSortIcon('productDetail.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.quantity')} className="sortable-header">
                    Requested Qty {getSortIcon('productDetail.quantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.centerStock.availableQuantity')} className="sortable-header">
                    Center Stock {getSortIcon('productDetail.centerStock.availableQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.outletStock.availableQuantity')} className="sortable-header">
                    Parent Stock {getSortIcon('productDetail.outletStock.availableQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.approvedQuantity')} className="sortable-header">
                    Approved Qty {getSortIcon('productDetail.approvedQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.receivedQuantity')} className="sortable-header">
                    Received Qty {getSortIcon('productDetail.receivedQuantity')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item) => (
                      <CTableRow key={item.uniqueKey}>
                        <CTableDataCell>
                          <button 
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={() => handleClick(item._id)}
                            style={{border: 'none', background: 'none', cursor: 'pointer', color: '#337ab7'}}
                          >
                            {item.orderNumber || ''}
                          </button>
                        </CTableDataCell>
                        <CTableDataCell>{formatDate(item.date || '')}</CTableDataCell>
                        <CTableDataCell>{item.center?.centerName || ''}</CTableDataCell>
                        <CTableDataCell>{item.warehouse?.centerName || ''}</CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.product?.productTitle || 'No Product'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.quantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.centerStock?.availableQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.outletStock?.availableQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.approvedQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.receivedQuantity || 0}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5">Total</CTableDataCell>
                      <CTableDataCell>{totals.totalRequestedQty}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{totals.totalApprovedQty}</CTableDataCell>
                      <CTableDataCell>{totals.totalReceivedQty}</CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="11" className="text-center">
                      No data found
                      {hasActiveFilters && ' with the current filters'}
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

export default IndentDetail;