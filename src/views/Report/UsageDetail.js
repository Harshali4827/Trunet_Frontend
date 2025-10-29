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
// import { formatDate, formatDisplayDate } from 'src/utils/FormatDateTime';
// import SearchUsageDetail from './SearchUsageDetail';

// const UsageDetail = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ 
//     center: '', 
//     product: '', 
//     startDate: '', 
//     endDate: '',
//     usageType: '',
//     connectionType: '',
//     customer: '',
//     keyword: '', 
//     outlet: '' 
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       // Add the new filter parameters
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
//       if (searchParams.usageType) {
//         params.append('usageType', searchParams.usageType);
//       }
//       if (searchParams.connectionType) {
//         params.append('connectionType', searchParams.connectionType);
//       }
//       if (searchParams.customer) {
//         params.append('createdBy', searchParams.customer); // Using createdBy for user filter
//       }
//       if (searchParams.startDate && searchParams.endDate) {
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(searchParams.startDate));
//         params.append('endDate', convertDateFormat(searchParams.endDate));
//       }
      
//       // Keep existing filters
//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet);
//       }
      
//       params.append('page', page);
//       const url = params.toString() ? `/reports/usages?${params.toString()}` : '/reports/usages';
      
//       console.log('Fetching Usage Detail URL:', url);
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
//       const response = await axiosInstance.get('/products');
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

//   const getFlattenedData = () => {
//     const flattened = [];
//     data.forEach(purchase => {
//       if (purchase.products && purchase.products.length > 0) {
//         purchase.products.forEach(product => {
//           flattened.push({
//             ...purchase,
//             productDetail: product,
//             uniqueKey: `${purchase._id}_${product._id}`
//           });
//         });
//       } else {
//         flattened.push({
//           ...purchase,
//           productDetail: null,
//           uniqueKey: `${purchase._id}_no_product`
//         });
//       }
//     });
//     return flattened;
//   };

//   const calculateTotals = () => {
//     const totals = {
//       totalQty: 0,
//       onuCharges: 0,
//       packageAmount: 0,
//       installationCharges: 0,
//       shiftingAmount: 0,
//       wireChangeAmount: 0,
//       totalRevenue: 0,
//     };
  
//     getFlattenedData().forEach(item => {
//       totals.totalQty += parseFloat(item.quantity || 0);
//       totals.onuCharges += parseFloat(item.onuCharges || 0);
//       totals.packageAmount += parseFloat(item.packageAmount || 0);
//       totals.installationCharges += parseFloat(item.installationCharges || 0);
//       totals.shiftingAmount += parseFloat(item.shiftingAmount || 0);
//       totals.wireChangeAmount += parseFloat(item.wireChangeAmount || 0);
//       totals.totalRevenue += parseFloat(item.totalRevenue || 0);
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
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData
//     };
//     setActiveSearch(mergedSearchData);
//     fetchData(mergedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       center: '', 
//       product: '', 
//       startDate: '', 
//       endDate: '',
//       usageType: '',
//       connectionType: '',
//       customer: '',
//       keyword: '', 
//       outlet: '' 
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return activeSearch.center || 
//            activeSearch.product || 
//            activeSearch.startDate || 
//            activeSearch.endDate ||
//            activeSearch.usageType ||
//            activeSearch.connectionType ||
//            activeSearch.customer ||
//            activeSearch.keyword || 
//            activeSearch.outlet;
//   };

//   const filteredFlattenedData = getFlattenedData().filter(item => {
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
//         Error loading data: {error}
//       </div>
//     );
//   }

//   const totals = calculateTotals();

//   const fetchAllDataForExport = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/reports/usages');
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
//         'Date',
//         'Type',
//         'Center',
//         'Product',
//         'Product Type',
//         'Qty',
//         'User/Building',
//         'Address',
//         'Mobile',
//         'Package Duration',
//         'Status',
//         'ONU Chrg.',
//         'Pkt. Amt.',
//         'Inst. Chrg.',
//         'Shifting Amount',
//         'Wire Change Amount',
//         'Total Amount',
//         'Reason'
//       ];
  
//       const csvData = allData.map(item => [
//         formatDate(item.date || ''),
//         item.usageType || '',
//         item.center?.centerName || '',
//         item.product?.productTitle || '',
//         item.product?.productCategory || '',
//         item.quantity || 0,
//         item.customer?.username || '',
//         item.address1 || '',
//         item.mobile || '',
//         item.packageDuration || '',
//         item.status || '',
//         item.onuCharges || '',
//         item.packageAmount || '',
//         item.installationCharges || '',
//         item.shiftingAmount || '',
//         item.wireChangeAmount || '',
//         item.totalRevenue || '',
//         item.reason || ''
//       ]);
  
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row =>
//           row
//             .map(field => {
//               const stringField = String(field ?? '');
//               return `"${stringField.replace(/"/g, '""')}"`;
//             })
//             .join(',')
//         )
//       ].join('\n');
  
//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `Usage_stock_report_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     }
//   };

//   return (
//     <div>
//       <div className='title'>Usage Stock Report </div>
      
//       <SearchUsageDetail
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
//           <div>
//           </div>

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
//                 placeholder="Search..."
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Date {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Type {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
//                     Center {getSortIcon('outlet')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
//                     Product {getSortIcon('productDetail.product.productTitle')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
//                     Product type{getSortIcon('productDetail.product.productTitle')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.purchasedQuantity')} className="sortable-header">
//                     Qty {getSortIcon('productDetail.purchasedQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.purchasedQuantity')} className="sortable-header">
//                     User/Building {getSortIcon('productDetail.purchasedQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
//                     Address {getSortIcon('invoiceNo')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Mobile {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Packgae Duration {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.price')} className="sortable-header">
//                     Status {getSortIcon('productDetail.price')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     ONU Chrg. {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Pkt. Amt. {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Inst. Chrg. {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Shifting Amount {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Wire Change Amount {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
//                     Total Amount {getSortIcon('remark')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Reason {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredFlattenedData.length > 0 ? (
//                   <>
//                     {filteredFlattenedData.map((item) => (
//                       <CTableRow key={item.uniqueKey}>
//                         <CTableDataCell>
//                           {formatDate(item.date || '')}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.usageType || ''}</CTableDataCell>
//                         <CTableDataCell>{item.center?.centerName || ''}</CTableDataCell>
//                         <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
//                         <CTableDataCell>
//                          {item.product?.productCategory || ''}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.quantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.customer?.username || ''}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.address1 || ''}</CTableDataCell>
//                         <CTableDataCell>{item.mobile || ''}</CTableDataCell>
//                         <CTableDataCell>{item.packageDuration || ''}</CTableDataCell>
//                         <CTableDataCell>{item.status || ''}</CTableDataCell>
//                         <CTableDataCell>{item.onuCharges || ''}</CTableDataCell>
//                         <CTableDataCell>{item.packageAmount || ''}</CTableDataCell>
//                         <CTableDataCell>{item.installationCharges || ''}</CTableDataCell>
//                         <CTableDataCell>{item.shiftingAmount || ''}</CTableDataCell>
//                         <CTableDataCell>{item.wireChangeAmount || ''}</CTableDataCell>
//                         <CTableDataCell>{item.totalRevenue || ''}</CTableDataCell>
//                         <CTableDataCell>{item.reason || ''}</CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="5">Total</CTableDataCell>
//                       <CTableDataCell>{totals.totalQty.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell>{totals.onuCharges.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell>{totals.packageAmount.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell>{totals.installationCharges.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell>{totals.shiftingAmount.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell>{totals.wireChangeAmount.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell>{totals.totalRevenue.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="18" className="text-center">
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

// export default UsageDetail;



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
import { showError } from 'src/utils/sweetAlerts';
import { formatDate } from 'src/utils/FormatDateTime';
import SearchUsageDetail from './SearchUsageDetail';

const UsageDetail = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
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
    usageType: '',
    connectionType: '',
    customer: '',
    keyword: '', 
    outlet: '' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.usageType) {
        params.append('usageType', searchParams.usageType);
      }
      if (searchParams.connectionType) {
        params.append('connectionType', searchParams.connectionType);
      }
      if (searchParams.customer) {
        params.append('customer', searchParams.customer);
      }
      if (searchParams.startDate && searchParams.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(searchParams.startDate));
        params.append('endDate', convertDateFormat(searchParams.endDate));
      }
      
      params.append('page', page);
      const url = params.toString() ? `/reports/usages?${params.toString()}` : '/reports/usages';
      
      console.log('Fetching Usage Detail URL:', url);
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
      const response = await axiosInstance.get('/products');
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

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
    fetchCustomers();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };
  const getFlattenedData = () => {
    const flattened = [];
    data.forEach(usage => {
      if (usage.items && usage.items.length > 0) {
        usage.items.forEach(item => {
          flattened.push({
            ...usage,
            item: item,
            product: item.product,
            quantity: item.quantity,
            uniqueKey: `${usage._id}_${item._id}`
          });
        });
      } else {
        flattened.push({
          ...usage,
          item: null,
          product: null,
          quantity: 0,
          uniqueKey: `${usage._id}_no_item`
        });
      }
    });
    return flattened;
  };

  const calculateTotals = () => {
    const totals = {
      totalQty: 0,
      onuCharges: 0,
      packageAmount: 0,
      installationCharges: 0,
      shiftingAmount: 0,
      wireChangeAmount: 0,
      totalRevenue: 0,
    };
  
    getFlattenedData().forEach(item => {
      totals.totalQty += parseFloat(item.quantity || 0);
      totals.onuCharges += parseFloat(item.onuCharges || 0);
      totals.packageAmount += parseFloat(item.packageAmount || 0);
      totals.installationCharges += parseFloat(item.installationCharges || 0);
      totals.shiftingAmount += parseFloat(item.shiftingAmount || 0);
      totals.wireChangeAmount += parseFloat(item.wireChangeAmount || 0);
      totals.totalRevenue += parseFloat(item.totalRevenue || 0);
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
    const mergedSearchData = {
      ...activeSearch,
      ...searchData
    };
    setActiveSearch(mergedSearchData);
    fetchData(mergedSearchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      center: '', 
      product: '', 
      startDate: '', 
      endDate: '',
      usageType: '',
      connectionType: '',
      customer: '',
      keyword: '', 
      outlet: '' 
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.center || 
           activeSearch.product || 
           activeSearch.startDate || 
           activeSearch.endDate ||
           activeSearch.usageType ||
           activeSearch.connectionType ||
           activeSearch.customer ||
           activeSearch.keyword || 
           activeSearch.outlet;
  };

  const filteredFlattenedData = getFlattenedData().filter(item => {
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
        Error loading data: {error}
      </div>
    );
  }

  const totals = calculateTotals();

  const fetchAllDataForExport = async () => {
    try {
      setLoading(true);
    
      const params = new URLSearchParams();

      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.usageType) {
        params.append('usageType', activeSearch.usageType);
      }
      if (activeSearch.connectionType) {
        params.append('connectionType', activeSearch.connectionType);
      }
      if (activeSearch.customer) {
        params.append('customer', activeSearch.customer);
      }
      if (activeSearch.startDate && activeSearch.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(activeSearch.startDate));
        params.append('endDate', convertDateFormat(activeSearch.endDate));
      }
      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword);
      }
      if (activeSearch.outlet) {
        params.append('outlet', activeSearch.outlet);
      }
      
      const url = params.toString() ? `/reports/usages?${params.toString()}` : '/reports/usages';
      
      console.log('Export URL with filters:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching data for export:', err);
      showError('Error fetching data for export');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateDetailExport = async () => {
    try {
      setLoading(true);
    
      const allData = await fetchAllDataForExport();
      
      if (!allData || allData.length === 0) {
        showError('No data available for export');
        return;
      }
      let fileName = 'Usage_stock_report';
      
      if (isSearchActive()) {
        const filterParts = [];
        
        if (activeSearch.startDate && activeSearch.endDate) {
          filterParts.push(`${activeSearch.startDate}_to_${activeSearch.endDate}`);
        }
        if (activeSearch.center) {
          const centerName = centers.find(c => c._id === activeSearch.center)?.centerName || 'Center';
          filterParts.push(centerName.replace(/\s+/g, '_'));
        }
        if (activeSearch.product) {
          const productName = products.find(p => p._id === activeSearch.product)?.productTitle || 'Product';
          filterParts.push(productName.replace(/\s+/g, '_'));
        }
        if (activeSearch.usageType) {
          filterParts.push(activeSearch.usageType.replace(/\s+/g, '_'));
        }
        if (activeSearch.connectionType) {
          filterParts.push(activeSearch.connectionType);
        }
        
        if (filterParts.length > 0) {
          fileName += `_${filterParts.join('_')}`;
        }
      }
      
      fileName += `_${new Date().toISOString().split('T')[0]}.csv`;
  
      const headers = [
        'Date',
        'Type',
        'Center',
        'Product',
        'Product Type',
        'Qty',
        'User/Building',
        'Address',
        'Mobile',
        'Package Duration',
        'Status',
        'ONU Chrg.',
        'Pkt. Amt.',
        'Inst. Chrg.',
        'Shifting Amount',
        'Wire Change Amount',
        'Total Amount',
        'Reason'
      ];

      const flattenedExportData = [];
      allData.forEach(usage => {
        if (usage.items && usage.items.length > 0) {
          usage.items.forEach(item => {
            flattenedExportData.push({
              ...usage,
              item: item,
              product: item.product,
              quantity: item.quantity
            });
          });
        } else {
          flattenedExportData.push({
            ...usage,
            item: null,
            product: null,
            quantity: 0
          });
        }
      });
  
      const csvData = flattenedExportData.map(item => [
        formatDate(item.date || ''),
        item.usageType || '',
        item.center?.centerName || '',
        item.product?.productTitle || '',
        item.product?.productCategory?.productCategory || '',
        item.quantity || 0,
        item.usageType === 'Customer' ? item.customer?.username || item.customer?.name || '' :
        item.usageType === 'Building' ? item.fromBuilding?.buildingName || item.fromBuilding?.displayName || '' :
        item.usageType === 'Building to Building' ? `${item.fromBuilding?.buildingName || ''} to ${item.toBuilding?.buildingName || ''}` :
        item.usageType === 'Control Room' ? item.fromControlRoom?.buildingName || item.fromControlRoom?.displayName || '' : '',
        item.usageType === 'Customer' ? `${item.customer?.address1 || ''} ${item.customer?.address2 || ''}`.trim() || '' :
        item.usageType === 'Building' ? `${item.fromBuilding?.address1 || ''} ${item.fromBuilding?.address2 || ''}`.trim() || '' :
        item.usageType === 'Control Room' ? `${item.fromControlRoom?.address1 || ''} ${item.fromControlRoom?.address2 || ''}`.trim() || '' : '',
        item.customer?.mobile || '',
        item.packageDuration || '',
        item.status || '',
        item.onuCharges || 0,
        item.packageAmount || 0,
        item.installationCharges || 0,
        item.shiftingAmount || 0,
        item.wireChangeAmount || 0,
        item.totalRevenue || 0,
        item.reason || ''
      ]);
  
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row
            .map(field => {
              const stringField = String(field ?? '');
              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Export completed with filters:', activeSearch);
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='title'>Usage Stock Report </div>
      
      <SearchUsageDetail
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        customers={customers}
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
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={generateDetailExport}
              disabled={loading}
            >
              <i className="fa fa-fw fa-file-excel"></i>
              {loading ? 'Exporting...' : 'Export'}
            </CButton>
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
        <div>
        </div>

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
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('usageType')} className="sortable-header">
                    Type {getSortIcon('usageType')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                    Center {getSortIcon('center.centerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('product.productTitle')} className="sortable-header">
                    Product {getSortIcon('product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('product.productCategory.productCategory')} className="sortable-header">
                    Product Type {getSortIcon('product.productCategory.productCategory')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('quantity')} className="sortable-header">
                    Qty {getSortIcon('quantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="sortable-header">
                    User/Building
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="sortable-header">
                    Address
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="sortable-header">
                    Mobile
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('packageDuration')} className="sortable-header">
                    Package Duration {getSortIcon('packageDuration')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('status')} className="sortable-header">
                    Status {getSortIcon('status')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('onuCharges')} className="sortable-header">
                    ONU Chrg. {getSortIcon('onuCharges')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('packageAmount')} className="sortable-header">
                    Pkt. Amt. {getSortIcon('packageAmount')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('installationCharges')} className="sortable-header">
                    Inst. Chrg. {getSortIcon('installationCharges')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('shiftingAmount')} className="sortable-header">
                    Shifting Amount {getSortIcon('shiftingAmount')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('wireChangeAmount')} className="sortable-header">
                    Wire Change Amount {getSortIcon('wireChangeAmount')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('totalRevenue')} className="sortable-header">
                    Total Amount {getSortIcon('totalRevenue')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('reason')} className="sortable-header">
                    Reason {getSortIcon('reason')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item) => (
                      <CTableRow key={item.uniqueKey}>
                        <CTableDataCell>
                          {formatDate(item.date || '')}
                        </CTableDataCell>
                        <CTableDataCell>{item.usageType || ''}</CTableDataCell>
                        <CTableDataCell>{item.center?.centerName || ''}</CTableDataCell>
                        <CTableDataCell>{item.product?.productTitle || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {item.product?.productCategory?.productCategory || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.quantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.usageType === 'Customer' ? item.customer?.username || item.customer?.name || '' :
                           item.usageType === 'Building' ? item.fromBuilding?.buildingName || item.fromBuilding?.displayName || '' :
                           item.usageType === 'Building to Building' ? `${item.fromBuilding?.buildingName || ''} to ${item.toBuilding?.buildingName || ''}` :
                           item.usageType === 'Control Room' ? item.fromControlRoom?.buildingName || item.fromControlRoom?.displayName || '' :
                           ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.usageType === 'Customer' ? `${item.customer?.address1 || ''} ${item.customer?.address2 || ''}`.trim() || '' :
                           item.usageType === 'Building' ? `${item.fromBuilding?.address1 || ''} ${item.fromBuilding?.address2 || ''}`.trim() || 'N/A' :
                           item.usageType === 'Control Room' ? `${item.fromControlRoom?.address1 || ''} ${item.fromControlRoom?.address2 || ''}`.trim() || '' :
                           ''}
                        </CTableDataCell>
                        <CTableDataCell>{item.customer?.mobile || ''}</CTableDataCell>
                        <CTableDataCell>{item.packageDuration || ''}</CTableDataCell>
                        <CTableDataCell>{item.status || ''}</CTableDataCell>
                        <CTableDataCell>{item.onuCharges || ''}</CTableDataCell>
                        <CTableDataCell>{item.packageAmount || ''}</CTableDataCell>
                        <CTableDataCell>{item.installationCharges || ''}</CTableDataCell>
                        <CTableDataCell>{item.shiftingAmount || ''}</CTableDataCell>
                        <CTableDataCell>{item.wireChangeAmount || ''}</CTableDataCell>
                        <CTableDataCell>{item.totalRevenue || ''}</CTableDataCell>
                        <CTableDataCell>{item.reason || ''}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5">Total</CTableDataCell>
                      <CTableDataCell>{totals.totalQty.toFixed(2)}</CTableDataCell>
                      <CTableDataCell colSpan="4"></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{totals.onuCharges.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.packageAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.installationCharges.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.shiftingAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.wireChangeAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.totalRevenue.toFixed(2)}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="18" className="text-center">
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

export default UsageDetail;