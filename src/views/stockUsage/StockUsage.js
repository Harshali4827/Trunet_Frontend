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
//   CNav,
//   CNavItem,
//   CNavLink,
//   CTabContent,
//   CTabPane
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut } from '@coreui/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import { confirmDelete, showError, showSuccess } from 'src/utils/sweetAlerts';
// import SearchStockUsage from './SearchStockUsage';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import Pagination from 'src/utils/Pagination';
// import usePermission from 'src/utils/usePermission';

// const StockUsage = () => {
//   const [customers, setCustomers] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [activeTab, setActiveTab] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const dropdownRefs = useRef({});
//   const navigate = useNavigate();
//   const { hasPermission, hasAnyPermission } = usePermission();

//   const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if(searchParams.usageType){
//         params.append('usageType', searchParams.usageType);
//       }
//       if (tab === 'pending') {
//         params.append('usageType', 'Damage');
//       } else if (tab === 'all') {
//         if (!searchParams.usageType) {
//           const otherUsageTypes = [
//             'Customer', 
//             'Building', 
//             'Building to Building', 
//             'Control Room', 
//             'Stolen from Center', 
//             'Stolen from Field', 
//             'Other'
//           ];
//           otherUsageTypes.forEach(type => {
//             params.append('usageType', type);
//           });
//         } else {
//           params.append('usageType', searchParams.usageType);
//         }
//       }      

//       params.append('page', page);
//       const url = params.toString() ? `/stockusage?${params.toString()}` : '/stockusage';
//       console.log('Fetching URL:', url);
      
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setCustomers(response.data.data);
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


//   const fetchAllDataForExport = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/stockusage');
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

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');
//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch,activeTab, page);
//   };

//   useEffect(() => {
//     fetchData(activeSearch, activeTab);
//   }, [activeTab]);

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedCustomers = [...customers].sort((a, b) => {
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

//     setCustomers(sortedCustomers);
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
//     fetchData(searchData, activeTab, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ keyword: '', center: '', usageType:'' });
//     setSearchTerm('');
//     fetchData({}, activeTab, 1);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setActiveSearch({ keyword: '', center: '', usageType:'' });
//     setSearchTerm('');
//   };
  
//   const handleClick = (itemId) => {
//     navigate(`/edit-stockUsage/${itemId}`);
//   };

//   const filteredCustomers = customers.filter(customer => {
//     if (activeSearch.keyword || activeSearch.center || activeSearch.usageType) {
//       return true;
//     }
//     return Object.values(customer).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   const handleDeleteCustomer = async (itemId) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/customers/${itemId}`);
//         setCustomers((prev) => prev.filter((c) => c._id !== itemId));
//         showSuccess('Customer deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting customer:', error);
//       }
//     }
//   };
  
//   const handleEditCustomer = (itemId) => {
//     navigate(`/edit-customer/${itemId}`)
//   };

//   const toggleDropdown = (id) => {
//     setDropdownOpen(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;
      
//       Object.keys(dropdownRefs.current).forEach(key => {
//         if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
//           newDropdownState[key] = false;
//           shouldUpdate = true;
//         }
//       });
      
//       if (shouldUpdate) {
//         setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

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
//         'Remark',
//         'Detail',
//         'Status',
//         'Created At'
//       ];
  
//       const csvData = allData.flatMap(request => {
//         let detail = '';
        
//         switch(request.usageType) {
//           case 'Customer':
//             detail = `User: ${request.customer?.username || 'N/A'}, Mobile: ${request.customer?.mobile || ''}, Package: ${request.packageAmount || 'N/A'}/-, Type: ${request.connectionType || 'N/A'}, Reason: ${request.reason || 'N/A'}`;
//             break;
//           case 'Building':
//             detail = `Building: ${request.fromBuilding?.buildingName || 'N/A'}`;
//             break;
//           case 'Building to Building':
//             detail = `From: ${request.fromBuilding?.buildingName || 'N/A'} → To: ${request.toBuilding?.buildingName || 'N/A'}`;
//             break;
//           case 'Control Room':
//             detail = `Control Room: ${request.controlRoom?.name || 'N/A'}`;
//             break;
//           case 'Damage':
//             detail = 'Pending Damage Return';
//             break;
//           case 'Stolen from Field':
//             detail = `Stolen From: ${request.stolenFrom || 'N/A'}`;
//             break;
//           case 'Stolen from Center':
//             detail = `Stolen From Center: ${request.center?.centerName || 'N/A'}`;
//             break;
//           case 'Other':
//             detail = `Address: ${request.address || 'N/A'}`;
//             break;
//           default:
//             detail = 'N/A';
//         }
//         if (request.items && request.items.length > 0) {
//           return request.items.map(item => [
//             formatDate(request.date),
//             request.usageType,
//             request.center?.centerName || 'N/A',
//             request.remark || '',
//             detail,
//             request.status,
//             formatDateTime(request.createdAt)
//           ]);
//         } else {
//           return [[
//             formatDate(request.date),
//             request.usageType,
//             request.center?.centerName || 'N/A',
//             request.remark || '',
//             detail,
//             request.status,
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
//       const url = URL.createObjectURL(blob);
      
//       link.setAttribute('href', url);
//       link.setAttribute('download', `Usage_report_${new Date().toISOString().split('T')[0]}.csv`);
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

//   const renderTable = () => (
//     <div className="responsive-table-wrapper">
//       <CTable striped bordered hover className='responsive-table'>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//               Date {getSortIcon('date')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('usageType')} className="sortable-header">
//              Type {getSortIcon('usageType')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//               Center {getSortIcon('center.centerName')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
//               Remark {getSortIcon('remark')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('customer.username')} className="sortable-header">
//               Detail {getSortIcon('customer.username')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')} className="sortable-header">
//               Created At{getSortIcon('createdAt')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col">
//               Action
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredCustomers.length > 0 ? (
//             filteredCustomers.map((customer) => (
//               <CTableRow key={customer._id} className={customer.usageType === 'Damage' ? 'damage-row' : ''}>
//                 <CTableDataCell>
//                   <button 
//                     className="btn btn-link p-0 text-decoration-none"
//                     onClick={() => handleClick(customer._id)}
//                     style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                   >
//                     {formatDate(customer.date)}
//                   </button>
//                 </CTableDataCell>
//                 <CTableDataCell>{customer.usageType}</CTableDataCell>
//                 <CTableDataCell>{customer.center?.centerName || ''}</CTableDataCell>
//                 <CTableDataCell>{customer.remark || ''}</CTableDataCell>
//                 <CTableDataCell>
//                   {customer.usageType === 'Customer' ? (
//                     <>
//                       User: {customer.customer?.username || 'N/A'}<br />
//                       ({customer.customer?.mobile || ''})<br />
//                       Package: {customer.packageAmount || 'N/A'}/-<br />
//                       Type: {customer.connectionType || 'N/A'}<br />
//                       Reason: {customer.reason || 'N/A'}
//                     </>
//                   ) : customer.usageType === 'Building' ? (
//                     `Building: ${customer.fromBuilding?.buildingName || 'N/A'}`
//                   ) : customer.usageType === 'Building to Building' ? (
//                     `From: ${customer.fromBuilding?.buildingName || 'N/A'} → To: ${customer.toBuilding?.buildingName || 'N/A'}`
//                   ) : customer.usageType === 'Control Room' ? (
//                     `Control Room: ${customer.controlRoom?.name || 'N/A'}`
//                   ) : customer.usageType === 'Damage' ? (
//                     'Pending Damage Return'
//                   ) : customer.usageType === 'Stolen from Field' ? (
//                     `Stolen From: ${customer.stolenFrom || 'N/A'}`
//                   ) : customer.usageType === 'Other' ? (
//                     `Address: ${customer.address || 'N/A'}`
//                   ) : (
//                     'N/A'
//                   )}
//                 </CTableDataCell>
//                 <CTableDataCell>{formatDateTime(customer.createdAt)}</CTableDataCell>
//                 <CTableDataCell>
//                 {activeTab === 'pending' &&(
//                   <div className="dropdown-container" ref={el => dropdownRefs.current[customer._id] = el}>
//                     <CButton 
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={() => toggleDropdown(customer._id)}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>

//                     {dropdownOpen[customer._id] && hasPermission('Usage', 'accept_damage_return') &&(
//                       <div className="dropdown-menu show">
//                         <button 
//                           className="dropdown-item"
//                           onClick={() => handleEditCustomer(customer._id)}
//                         >
//                         Accept Damage Return
//                         </button>
//                         <button 
//                           className="dropdown-item"
//                           onClick={() => handleDeleteCustomer(customer._id)}
//                         >
//                         Reject Damage Return 
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                     )}
//                 </CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="7" className="text-center">
//                 No {activeTab === 'pending' ? 'pending' : ''} stock usage records found
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );

//   return (
//     <div>
//       <div className='title'>Stock Usage</div>
    
//       <SearchStockUsage
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//       />
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//           {hasAnyPermission('Usage', ['manage_usage_own_center','manage_usage_all_center']) && (
//             <Link to='/add-stockUsage'>
//               <CButton size="sm" className="action-btn me-1">
//                 <CIcon icon={cilPlus} className='icon'/> Add
//               </CButton>
//             </Link>
//           )}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setSearchModalVisible(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {(activeSearch.keyword || activeSearch.center || activeSearch.usageType) && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                <CIcon icon={cilZoomOut} className='icon' />Reset Search
//               </CButton>
//             )}
//              <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={generateDetailExport}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//                Detail Export
//             </CButton>
//           </div>
          
//           <div>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'all'}
//                 onClick={() => handleTabChange('all')}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'all' ? '4px solid #2759a2' : '3px solid transparent',
//                   color:'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                All
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'pending'}
//                 onClick={() => handleTabChange('pending')}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'pending' ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color:'black'
//                 }}
//               >
//                 Pending
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div>
//               {activeSearch.keyword && (
//                 <span className="badge bg-primary me-2">
//                   Keyword: {activeSearch.keyword}
//                 </span>
//               )}
//               {activeSearch.center && (
//                 <span className="badge bg-info">
//                   Center: {centers.find(c => c._id === activeSearch.center)?.centerName || activeSearch.center}
//                 </span>
//               )}
//             </div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 disabled={!!(activeSearch.keyword || activeSearch.center)} 
//                 placeholder={activeSearch.keyword || activeSearch.center ? "Disabled during advanced search" : " "}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 'all'}>
//               {renderTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 'pending'}>
//               {renderTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default StockUsage;



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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { showError, showSuccess, confirmAction } from 'src/utils/sweetAlerts';
import SearchStockUsage from './SearchStockUsage';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import Pagination from 'src/utils/Pagination';
import usePermission from 'src/utils/usePermission';
import Swal from 'sweetalert2';

const StockUsage = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const { hasPermission, hasAnyPermission } = usePermission();

  const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
    try {
      setLoading(true);
      
      if (tab === 'pending') {
        // Fetch damage return records for pending tab
        const params = new URLSearchParams();
        params.append('page', page);
        if (searchParams.keyword) {
          params.append('search', searchParams.keyword);
        }
        if (searchParams.center) {
          params.append('center', searchParams.center);
        }
        
        const url = params.toString() ? `/stockusage/damage-return?${params.toString()}` : '/stockusage/damage-return';
        console.log('Fetching Damage Return URL:', url);
        
        const response = await axiosInstance.get(url);
        
        if (response.data.success) {
          setCustomers(response.data.data);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } else {
        // Fetch all stock usage records for all tab - NO DEFAULT FILTER
        const params = new URLSearchParams();
        if (searchParams.keyword) {
          params.append('search', searchParams.keyword);
        }
        if (searchParams.center) {
          params.append('center', searchParams.center);
        }
        if (searchParams.usageType) {
          params.append('usageType', searchParams.usageType);
        }

        params.append('page', page);
        const url = params.toString() ? `/stockusage?${params.toString()}` : '/stockusage';
        console.log('Fetching All Data URL:', url);
        
        const response = await axiosInstance.get(url);
        
        if (response.data.success) {
          setCustomers(response.data.data);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDataForExport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/stockusage');
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

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, activeTab, page);
  };

  useEffect(() => {
    fetchData(activeSearch, activeTab);
  }, [activeTab]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...customers].sort((a, b) => {
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

    setCustomers(sortedCustomers);
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
    fetchData(searchData, activeTab, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '', usageType:'' });
    setSearchTerm('');
    fetchData({}, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSearch({ keyword: '', center: '', usageType:'' });
    setSearchTerm('');
  };
  
  const handleClick = (itemId) => {
    navigate(`/edit-stockUsage/${itemId}`);
  };


  // const handleAcceptDamageReturn = async (itemId) => {
  //   const result = await confirmAction(
  //     'Accept Damage Return',
  //     'Are you sure you want to accept this damage return? This action cannot be undone.',
  //     'question',
  //     'Yes, Accept!'
  //   );

  //   if (result.isConfirmed) {
  //     try {
  //       const response = await axiosInstance.patch(`/stockusage/${itemId}/approve`);
  //       if (response.data.success) {
  //         showSuccess('Damage return accepted successfully!')
  //         fetchData(activeSearch, activeTab, currentPage);
  //       } else {
  //         throw new Error(response.data.message || 'Failed to accept damage return');
  //       }
  //     } catch (error) {
  //       console.error('Error accepting damage return:', error);
  //       showError(error.response?.data?.message || error.message || 'Failed to accept damage return');
  //     }
  //   }
  // };

  // const handleRejectDamageReturn = async (itemId) => {
  //   const result = await confirmAction(
  //     'Reject Damage Return',
  //     'Are you sure you want to reject this damage return? This action cannot be undone.',
  //     'warning',
  //     'Yes, Reject!'
  //   );

  //   if (result.isConfirmed) {
  //     try {
  //       const response = await axiosInstance.patch(`/stockusage/${itemId}/reject`);
  //       if (response.data.success) {
  //         showSuccess('Damage return rejected successfully!');
  //         // Refresh the data
  //         fetchData(activeSearch, activeTab, currentPage);
  //       } else {
  //         throw new Error(response.data.message || 'Failed to reject damage return');
  //       }
  //     } catch (error) {
  //       console.error('Error rejecting damage return:', error);
  //       showError(error.response?.data?.message || error.message || 'Failed to reject damage return');
  //     }
  //   }
  // };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.usageType) {
      return true;
    }
    return Object.values(customer).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;
      
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          newDropdownState[key] = false;
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const generateDetailExport = async () => {
    try {
      setLoading(true);
    
      const allData = await fetchAllDataForExport();
      
      if (!allData || allData.length === 0) {
        showError('No data available for export');
        return;
      }
  
      const headers = [
        'Date',
        'Type', 
        'Center',
        'Remark',
        'Detail',
        'Status',
        'Created At'
      ];
  
      const csvData = allData.flatMap(request => {
        let detail = '';
        
        switch(request.usageType) {
          case 'Customer':
            detail = `User: ${request.customer?.username || 'N/A'}, Mobile: ${request.customer?.mobile || ''}, Package: ${request.packageAmount || 'N/A'}/-, Type: ${request.connectionType || 'N/A'}, Reason: ${request.reason || 'N/A'}`;
            break;
          case 'Building':
            detail = `Building: ${request.fromBuilding?.buildingName || 'N/A'}`;
            break;
          case 'Building to Building':
            detail = `From: ${request.fromBuilding?.buildingName || 'N/A'} → To: ${request.toBuilding?.buildingName || 'N/A'}`;
            break;
          case 'Control Room':
            detail = `Control Room: ${request.controlRoom?.name || 'N/A'}`;
            break;
          case 'Damage':
            detail = 'Pending Damage Return';
            break;
          case 'Damage Return':
            detail = `Returned from: ${request.originalUsageType || 'N/A'}`;
            break;
          case 'Stolen from Field':
            detail = `Stolen From: ${request.stolenFrom || 'N/A'}`;
            break;
          case 'Stolen from Center':
            detail = `Stolen From Center: ${request.center?.centerName || 'N/A'}`;
            break;
          case 'Other':
            detail = `Address: ${request.address || 'N/A'}`;
            break;
          default:
            detail = 'N/A';
        }
        if (request.items && request.items.length > 0) {
          return request.items.map(item => [
            formatDate(request.date),
            request.usageType,
            request.center?.centerName || 'N/A',
            request.remark || '',
            detail,
            request.status,
            formatDateTime(request.createdAt)
          ]);
        } else {
          return [[
            formatDate(request.date),
            request.usageType,
            request.center?.centerName || 'N/A',
            request.remark || '',
            detail,
            request.status,
            formatDateTime(request.createdAt)
          ]];
        }
      });
  
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
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Usage_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };


  const handleAcceptDamageReturn = async (itemId) => {
    const result = await confirmAction(
      'Accept Damage Return',
      'Are you sure you want to accept this damage return? This action cannot be undone.',
      'question',
      'Yes, Accept!'
    );
  
    if (result.isConfirmed) {
      try {
        const { value: remark } = await Swal.fire({
          title: 'Approval Remark',
          input: 'text',
          inputLabel: 'Enter approval remark (optional)',
          inputPlaceholder: 'Enter your remark here...',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        });
  
        if (remark !== undefined) {
          const response = await axiosInstance.patch(`/stockusage/${itemId}/approve`, {
            approvalRemark: remark || 'Damage request approved'
          });
          
          if (response.data.success) {
            showSuccess('Damage return accepted successfully!');
            fetchData(activeSearch, activeTab, currentPage);
          } else {
            throw new Error(response.data.message || 'Failed to accept damage return');
          }
        }
      } catch (error) {
        console.error('Error accepting damage return:', error);
        showError(error.response?.data?.message || error.message || 'Failed to accept damage return');
      }
    }
  };
  
  const handleRejectDamageReturn = async (itemId) => {
    const result = await confirmAction(
      'Reject Damage Return',
      'Are you sure you want to reject this damage return? This action cannot be undone.',
      'warning',
      'Yes, Reject!'
    );
  
    if (result.isConfirmed) {
      try {
        const { value: remark } = await Swal.fire({
          title: 'Rejection Remark',
          input: 'text',
          inputLabel: 'Enter rejection remark (optional)',
          inputPlaceholder: 'Enter your remark here...',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        });
  
        if (remark !== undefined) {
          const response = await axiosInstance.patch(`/stockusage/${itemId}/reject`, {
            rejectionRemark: remark || 'Damage request rejected'
          });
          
          if (response.data.success) {
            showSuccess('Damage return rejected successfully!');
            fetchData(activeSearch, activeTab, currentPage);
          } else {
            throw new Error(response.data.message || 'Failed to reject damage return');
          }
        }
      } catch (error) {
        console.error('Error rejecting damage return:', error);
        showError(error.response?.data?.message || error.message || 'Failed to reject damage return');
      }
    }
  };
  const renderTable = () => (
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
            <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
              Remark {getSortIcon('remark')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('customer.username')} className="sortable-header">
              Detail {getSortIcon('customer.username')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')} className="sortable-header">
              Created At{getSortIcon('createdAt')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <CTableRow key={customer._id} className={
                customer.usageType === 'Damage Return' ? 'damage-row' : ''
              }>
                <CTableDataCell>
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleClick(customer._id)}
                    style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                  >
                    {formatDate(customer.date)}
                  </button>
                </CTableDataCell>
                <CTableDataCell>
                  {customer.usageType}
                </CTableDataCell>
                <CTableDataCell>{customer.center?.centerName || ''}</CTableDataCell>
                <CTableDataCell>{customer.remark || ''}</CTableDataCell>
                <CTableDataCell>
                  {customer.usageType === 'Customer' ? (
                    <>
                      User: {customer.customer?.username || 'N/A'}<br />
                      ({customer.customer?.mobile || ''})<br />
                      Package: {customer.packageAmount || 'N/A'}/-<br />
                      Type: {customer.connectionType || 'N/A'}<br />
                      Reason: {customer.reason || 'N/A'}
                    </>
                  ) : customer.usageType === 'Building' ? (
                    `Building: ${customer.fromBuilding?.buildingName || 'N/A'}`
                  ) : customer.usageType === 'Building to Building' ? (
                    `From: ${customer.fromBuilding?.buildingName || 'N/A'} → To: ${customer.toBuilding?.buildingName || 'N/A'}`
                  ) : customer.usageType === 'Control Room' ? (
                    `Control Room: ${customer.controlRoom?.name || 'N/A'}`
                  ) : customer.usageType === 'Damage' ? (
                    'Pending Damage Return'
                  ) : customer.usageType === 'Damage Return' ? (
                    `Pending Damage Return`
                  ) : customer.usageType === 'Stolen from Field' ? (
                    `Stolen From: ${customer.stolenFrom || 'N/A'}`
                  ) : customer.usageType === 'Other' ? (
                    `Address: ${customer.address || 'N/A'}`
                  ) : (
                    'N/A'
                  )}
                </CTableDataCell>
                <CTableDataCell>{formatDateTime(customer.createdAt)}</CTableDataCell>
                <CTableDataCell>
                  {activeTab === 'pending' && hasPermission('Usage', 'accept_damage_return') && (
                    <div className="dropdown-container" ref={el => dropdownRefs.current[customer._id] = el}>
                      <CButton 
                        size="sm"
                        className='option-button btn-sm'
                        onClick={() => toggleDropdown(customer._id)}
                      >
                        <CIcon icon={cilSettings} />
                        Options
                      </CButton>

                      {dropdownOpen[customer._id] && (
                        <div className="dropdown-menu show">
                          <button 
                            className="dropdown-item"
                            onClick={() => handleAcceptDamageReturn(customer._id)}
                          >
                            <i className="fa fa-exchange fa-margin"></i> Accept Damage Return
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleRejectDamageReturn(customer._id)}
                          >
                            <i className="fa fa-exchange fa-margin"></i> Reject Damage Return 
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center">
                No {activeTab === 'pending' ? 'damage return' : ''} stock usage records found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  return (
    <div>
      <div className='title'>Stock Usage</div>
    
      <SearchStockUsage
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
          {hasAnyPermission('Usage', ['manage_usage_own_center','manage_usage_all_center']) && (
            <Link to='/add-stockUsage'>
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Add
              </CButton>
            </Link>
          )}
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.keyword || activeSearch.center || activeSearch.usageType) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
               <CIcon icon={cilZoomOut} className='icon' />Reset Search
              </CButton>
            )}
             <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={generateDetailExport}
            >
              <i className="fa fa-fw fa-file-excel"></i>
               Detail Export
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
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'all'}
                onClick={() => handleTabChange('all')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'all' ? '4px solid #2759a2' : '3px solid transparent',
                  color:'black',
                  borderBottom: 'none'
                }}
              >
               All
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'pending'}
                onClick={() => handleTabChange('pending')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'pending' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color:'black'
                }}
              >
               Pending
              </CNavLink>
            </CNavItem>
          </CNav>

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
                disabled={!!(activeSearch.keyword || activeSearch.center)} 
                placeholder={activeSearch.keyword || activeSearch.center ? "Disabled during advanced search" : " "}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 'all'}>
              {renderTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'pending'}>
              {renderTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default StockUsage;