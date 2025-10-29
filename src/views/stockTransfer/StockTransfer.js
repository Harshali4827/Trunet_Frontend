
// import '../../css/table.css';
// import '../../css/form.css';
// import '../../css/profile.css';
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
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import './challan.css';
// import Pagination from 'src/utils/Pagination';
// import usePermission from 'src/utils/usePermission';
// import SearchTransferModel from './SearchTransferModel';
// const StockTransfer = () => {
//   const [customers, setCustomers] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [activeTab, setActiveTab] = useState('open');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const dropdownRefs = useRef({});
//   const navigate = useNavigate();
//   const { hasAnyPermission } = usePermission(); 
//   const statusFilters = {
//     open: ['Confirmed', 'Submitted', 'Shipped', 'Incompleted', 'Draft','Admin_Approved'],
//     closed: ['Rejected', 'Completed','Admin_Rejected']
//   };


//   const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (!searchParams.status) {
//         const statuses = statusFilters[tab];
//         statuses.forEach(status => {
//           params.append('status', status);
//         });
//       } else {
//         params.append('status', searchParams.status);
//       }

//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
//       params.append('page', page);
//       const url = params.toString() ? `/stocktransfer?${params.toString()}` : '/stocktransfer';
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

//   const fetchAllDataForExport = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/stocktransfer');
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
//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//   }, []);

  

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, activeTab, page);
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
//     fetchData(searchData,activeTab, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ keyword: '', center: '' });
//     setSearchTerm('');
//     fetchData({},activeTab,1);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setActiveSearch({ keyword: '', center: '' });
//     setSearchTerm('');
//   };

//   const filteredCustomers = customers.filter(customer => {
//     if (activeSearch.keyword || activeSearch.center) {
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

//   const handleDeleteData = async (itemId) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/stocktransfer/${itemId}`);
//         setCustomers((prev) => prev.filter((c) => c._id !== itemId));
//         showSuccess('Data deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting date:', error);
//       }
//     }
//   };
  
//   const handleEditData = (itemId) => {
//     navigate(`/edit-stockTransfer/${itemId}`)
//   };

//   const toggleDropdown = (id) => {
//     setDropdownOpen(prev => {
//       const isCurrentlyOpen = !!prev[id];
//       const newState = {};
//       if (!isCurrentlyOpen) {
//         newState[id] = true;
//       }
//       return newState;
//     });
//   };
  
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

//   const handleClick = (itemId) => {
//     navigate(`/stockTransfer-details/${itemId}`);
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
//         'Order Date',
//         'Order Number', 
//         'Status',
//         'Center Title',
//         'Approved At',
//         'Shipped At',
//         'Shipped Date',
//         'Reject At',
//         'Reject Remark',
//         'Completed At',
//         'Product Title',
//         'Product Qty',
//         'Approved Qty',
//         'Approved Remark',
//         'Received Qty',
//         'Received Remark'
//       ];

//       const csvData = allData.flatMap(request => {
//         if (!request.products || request.products.length === 0) {
//           return [[
//             formatDate(request.date),
//             request.transferNumber,
//             request.status,
//             request.toCenter?.centerName || 'N/A',
//             request.centerApproval?.approvedAt ? formatDateTime(request.centerApproval.approvedAt) : '',
//             request.shippingInfo?.shippedAt ? formatDateTime(request.shippingInfo.shippedAt) : '',
//             request.shippingInfo?.shippedDate ? formatDate(request.shippingInfo.shippedDate) : '',
//             request.completionInfo?.incompleteOn ? formatDateTime(request.completionInfo.incompleteOn) : '',
//             '',
//             request.completionInfo?.completedOn ? formatDateTime(request.completionInfo.completedOn) : '',
//             'No Product',
//             0,
//             0,
//             '',
//             0,
//             ''
//           ]];
//         }
  
//         return request.products.map(product => [
//           formatDate(request.date),
//           request.transferNumber,
//           request.status,
//           request.toCenter?.centerName || 'N/A',
//           request.centerApproval?.approvedAt ? formatDateTime(request.centerApproval.approvedAt) : '',
//           request.shippingInfo?.shippedAt ? formatDateTime(request.shippingInfo.shippedAt) : '',
//           request.shippingInfo?.shippedDate ? formatDate(request.shippingInfo.shippedDate) : '',
//           request.completionInfo?.incompleteOn ? formatDateTime(request.completionInfo.incompleteOn) : '',
//           '',
//           request.completionInfo?.completedOn ? formatDateTime(request.completionInfo.completedOn) : '',
//           product.product?.productTitle || '',
//           product.quantity || 0,
//           product.approvedQuantity || 0,
//           product.approvedRemark || '',
//           product.receivedQuantity || 0,
//           product.receivedRemark || ''
//         ]);
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
//       link.setAttribute('download', `indent_detail_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url)
      
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
//             <CTableHeaderCell scope="col" onClick={() => handleSort('orderNumber')} className="sortable-header">
//              Number {getSortIcon('orderNumber')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('warehouse.warehouseName')} className="sortable-header">
//               From {getSortIcon('warehouse.warehouseName')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//               Center {getSortIcon('center.centerName')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.email')} className="sortable-header">
//               Posted By {getSortIcon('createdBy.email')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('status')} className="sortable-header">
//               Status {getSortIcon('status')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('mobile')} className="sortable-header">
//               Remarks {getSortIcon('products[0].productRemark')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col">
//               Action
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredCustomers.length > 0 ? (
//             filteredCustomers.map((item) => (
//               <CTableRow key={item._id} className={item.status === 'Submitted' ? 'selected-row' : ''}>
//                 <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
//                 <CTableDataCell>
//                   <button 
//                     className="btn btn-link p-0 text-decoration-none"
//                     onClick={() => handleClick(item._id)}
//                     style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                   >
//                     {item.transferNumber}
//                   </button>
//                   </CTableDataCell>
//                 <CTableDataCell>{item.fromCenter?.centerName}</CTableDataCell>
//                 <CTableDataCell>{item.toCenter?.centerName || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>
//   {item.createdBy?.email || 'N/A'} 
//   {item.createdAt && ` At ${new Date(item.createdAt).toLocaleTimeString('en-US', { 
//     hour: 'numeric', 
//     minute: 'numeric',
//     hour12: true 
//   })}`}
// </CTableDataCell>
//                 <CTableDataCell> {item.status && (
//                     <span className={`status-badge ${item.status.toLowerCase()}`}>
//                       {item.status}
//                     </span>
//                   )}</CTableDataCell>
//                 <CTableDataCell>{item.remark}</CTableDataCell>
//                 <CTableDataCell>
//                   <div className="dropdown-container" ref={el => dropdownRefs.current[item._id] = el}>
//                     <CButton 
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={() => toggleDropdown(item._id)}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>
//                     {dropdownOpen[item._id] && (
//                       <div className="dropdown-menu show">

//                          {hasAnyPermission('Transfer', ['manage_stock_transfer_all_center','manage_stock_transfer_own_center']) && (
//                         <button 
//                           className="dropdown-item"
//                           onClick={() => handleEditData(item._id)}
//                         >
//                           <CIcon icon={cilPencil} className="me-2" /> Edit
//                         </button>
//                          )}

//                         {hasAnyPermission('Transfer', ['delete_transfer_own_center','delete_transfer_all_center']) && (
//                         <button 
//                           className="dropdown-item"
//                           onClick={() => handleDeleteData(item._id)}
//                         >
//                           <CIcon icon={cilTrash} className="me-2" /> Delete
//                         </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="9" className="text-center">
//                 No {activeTab} stock requests found
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );

//   return (
//     <div>
//       <div className='title'>Stock Transfer Request List </div>
    
//       <SearchTransferModel
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//       /> 
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//           {hasAnyPermission('Transfer', ['manage_stock_transfer_own_center','manage_stock_transfer_all_center']) && (
//             <Link to='/add-stockTransfer'>
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
//             {(activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate) && (
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
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />

//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'open'}
//                 onClick={() => setActiveTab('open')}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'open' ? '4px solid #2759a2' : '3px solid transparent',
//                   color:'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                 Open
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'closed'}
//                 onClick={() => setActiveTab('closed')}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'closed' ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color:'black'
//                 }}
//               >
//                 Closed
//               </CNavLink>
//             </CNavItem>
//           </CNav>

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
//                 disabled={!!(activeSearch.keyword || activeSearch.center)} 
//                 placeholder={activeSearch.keyword || activeSearch.center ? "Disabled during advanced search" : " "}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 'open'}>
//               {renderTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 'closed'}>
//               {renderTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default StockTransfer;



import '../../css/table.css';
import '../../css/form.css';
import '../../css/profile.css';
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
import { confirmDelete, showError, showSuccess } from 'src/utils/sweetAlerts';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import './challan.css';
import Pagination from 'src/utils/Pagination';
import usePermission from 'src/utils/usePermission';
import SearchTransferModel from './SearchTransferModel';

const StockTransfer = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    center: '', 
    outlet: '',
    status: '',
    startDate: '',
    endDate: '',
    statusStartDate: '',
    statusEndDate: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeTab, setActiveTab] = useState('open');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const { hasAnyPermission } = usePermission(); 
  
  const statusFilters = {
    open: ['Confirmed', 'Submitted', 'Shipped', 'Incompleted', 'Draft','Admin_Approved'],
    closed: ['Rejected', 'Completed','Admin_Rejected']
  };

  const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Apply tab-based status filters only if no specific status is provided
      if (!searchParams.status) {
        const statuses = statusFilters[tab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      } else {
        params.append('status', searchParams.status);
      }

      // Apply all search filters
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      if (searchParams.statusStartDate) {
        params.append('startDate', searchParams.statusStartDate);
      }
      if (searchParams.statusEndDate) {
        params.append('endDate', searchParams.statusEndDate);
      }
      if (searchParams.statusChanged) {
        params.append('status', searchParams.statusChanged);
      }
      
      params.append('page', page);
      
      const url = `/stocktransfer?${params.toString()}`;
      console.log('API URL:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setCustomers(response.data.data);
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
        // Filter outlets (assuming outlets have centerType 'Outlet')
        const outletCenters = response.data.data.filter(center => 
          center.centerType === 'Outlet' || center.centerType === 'outlet'
        );
        setOutlets(outletCenters);
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
    setActiveSearch({ 
      keyword: '', 
      center: '', 
      outlet: '',
      status: '',
      startDate: '',
      endDate: '',
      statusStartDate: '',
      statusEndDate: ''
    });
    setSearchTerm('');
    fetchData({}, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSearch({ 
      keyword: '', 
      center: '', 
      outlet: '',
      status: '',
      startDate: '',
      endDate: '',
      statusStartDate: '',
      statusEndDate: ''
    });
    setSearchTerm('');
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet) {
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

  const handleDeleteData = async (itemId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/stocktransfer/${itemId}`);
        setCustomers((prev) => prev.filter((c) => c._id !== itemId));
        showSuccess('Data deleted successfully!');
      } catch (error) {
        console.error('Error deleting date:', error);
      }
    }
  };
  
  const handleEditData = (itemId) => {
    navigate(`/edit-stockTransfer/${itemId}`)
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => {
      const isCurrentlyOpen = !!prev[id];
      const newState = {};
      if (!isCurrentlyOpen) {
        newState[id] = true;
      }
      return newState;
    });
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
        Error loading data: {error}
      </div>
    );
  }

  const handleClick = (itemId) => {
    navigate(`/stockTransfer-details/${itemId}`);
  };

  // Updated CSV export function that uses applied filters
  const generateDetailExport = async () => {
    try {
      setLoading(true);
      
      // Build export URL with current filters
      const params = new URLSearchParams();

      // Apply current search filters for export
      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword);
      }
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.outlet) {
        params.append('outlet', activeSearch.outlet);
      }
      if (activeSearch.status) {
        params.append('status', activeSearch.status);
      } else {
        // Apply tab-based status filters
        const statuses = statusFilters[activeTab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      }
      if (activeSearch.startDate) {
        params.append('startDate', activeSearch.startDate);
      }
      if (activeSearch.endDate) {
        params.append('endDate', activeSearch.endDate);
      }
      if (activeSearch.statusStartDate) {
        params.append('startDate', activeSearch.statusStartDate);
      }
      if (activeSearch.statusEndDate) {
        params.append('endDate', activeSearch.statusEndDate);
      }
      if (activeSearch.statusChanged) {
        params.append('status', activeSearch.statusChanged);
      }
      const exportUrl = `/stocktransfer?${params.toString()}`;
      console.log('Export URL:', exportUrl);
      
      const response = await axiosInstance.get(exportUrl);
      
      if (!response.data.success || !response.data.data || response.data.data.length === 0) {
        showError('No data available for export with current filters');
        return;
      }

      const allData = response.data.data;
      
      const headers = [
        'Transfer Date',
        'Transfer Number', 
        'Status',
        'From Center',
        'To Center',
        'Admin Approved At',
        'Center Approved At',
        'Shipped At',
        'Shipped Date',
        'Completed At',
        'Product Title',
        'Product Qty',
        'Approved Qty',
        'Approved Remark',
        'Received Qty',
        'Received Remark',
        'Approved Serials',
        'Transferred Serials'
      ];

      const csvData = allData.flatMap(transfer => {
        if (!transfer.products || transfer.products.length === 0) {
          return [[
            formatDate(transfer.date),
            transfer.transferNumber,
            transfer.status,
            transfer.fromCenter?.centerName || 'N/A',
            transfer.toCenter?.centerName || 'N/A',
            transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
            transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
            transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
            transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
            transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
            'No Product',
            0,
            0,
            '',
            0,
            '',
            '',
            ''
          ]];
        }
  
        return transfer.products.map(product => [
          formatDate(transfer.date),
          transfer.transferNumber,
          transfer.status,
          transfer.fromCenter?.centerName || 'N/A',
          transfer.toCenter?.centerName || 'N/A',
          transfer.adminApproval?.approvedAt ? formatDateTime(transfer.adminApproval.approvedAt) : '',
          transfer.centerApproval?.approvedAt ? formatDateTime(transfer.centerApproval.approvedAt) : '',
          transfer.shippingInfo?.shippedAt ? formatDateTime(transfer.shippingInfo.shippedAt) : '',
          transfer.shippingInfo?.shippedDate ? formatDate(transfer.shippingInfo.shippedDate) : '',
          transfer.completionInfo?.completedOn ? formatDateTime(transfer.completionInfo.completedOn) : '',
          product.product?.productTitle || '',
          product.quantity || 0,
          product.approvedQuantity || 0,
          product.approvedRemark || '',
          product.receivedQuantity || 0,
          product.receivedRemark || '',
          product.approvedSerials?.join(', ') || '',
          product.transferredSerials?.join(', ') || ''
        ]);
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
      link.setAttribute('download', `stock_transfers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess('CSV exported successfully with applied filters!');
      
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
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
            <CTableHeaderCell scope="col" onClick={() => handleSort('transferNumber')} className="sortable-header">
             Number {getSortIcon('transferNumber')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('fromCenter.centerName')} className="sortable-header">
              From {getSortIcon('fromCenter.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('toCenter.centerName')} className="sortable-header">
              To {getSortIcon('toCenter.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.email')} className="sortable-header">
              Posted By {getSortIcon('createdBy.email')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('status')} className="sortable-header">
              Status {getSortIcon('status')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
              Remarks {getSortIcon('remark')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((item) => (
              <CTableRow key={item._id} className={item.status === 'Submitted' ? 'selected-row' : ''}>
                <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
                <CTableDataCell>
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleClick(item._id)}
                    style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                  >
                    {item.transferNumber}
                  </button>
                </CTableDataCell>
                <CTableDataCell>{item.fromCenter?.centerName}</CTableDataCell>
                <CTableDataCell>{item.toCenter?.centerName || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  {item.createdBy?.email || 'N/A'} 
                  {item.createdAt && ` At ${new Date(item.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: 'numeric',
                    hour12: true 
                  })}`}
                </CTableDataCell>
                <CTableDataCell> 
                  {item.status && (
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  )}
                </CTableDataCell>
                <CTableDataCell>{item.remark}</CTableDataCell>
                <CTableDataCell>
                  <div className="dropdown-container" ref={el => dropdownRefs.current[item._id] = el}>
                    <CButton 
                      size="sm"
                      className='option-button btn-sm'
                      onClick={() => toggleDropdown(item._id)}
                    >
                      <CIcon icon={cilSettings} />
                      Options
                    </CButton>
                    {dropdownOpen[item._id] && (
                      <div className="dropdown-menu show">
                        {hasAnyPermission('Transfer', ['manage_stock_transfer_all_center','manage_stock_transfer_own_center']) && (
                          <button 
                            className="dropdown-item"
                            onClick={() => handleEditData(item._id)}
                          >
                            <CIcon icon={cilPencil} className="me-2" /> Edit
                          </button>
                        )}

                        {hasAnyPermission('Transfer', ['delete_transfer_own_center','delete_transfer_all_center']) && (
                          <button 
                            className="dropdown-item"
                            onClick={() => handleDeleteData(item._id)}
                          >
                            <CIcon icon={cilTrash} className="me-2" /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                No {activeTab} stock transfers found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  return (
    <div>
      <div className='title'>Stock Transfer Request List </div>
    
      <SearchTransferModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        outlets={outlets}
      /> 
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasAnyPermission('Transfer', ['manage_stock_transfer_own_center','manage_stock_transfer_all_center']) && (
              <Link to='/add-stockTransfer'>
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
            {(activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate || activeSearch.statusStartDate || activeSearch.statusEndDate) && (
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
              disabled={customers.length === 0}
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
                active={activeTab === 'open'}
                onClick={() => handleTabChange('open')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'open' ? '4px solid #2759a2' : '3px solid transparent',
                  color:'black',
                  borderBottom: 'none'
                }}
              >
                Open
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'closed'}
                onClick={() => handleTabChange('closed')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'closed' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color:'black'
                }}
              >
                Closed
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
                disabled={!!(activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet)} 
                placeholder={activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet ? "Disabled during advanced search" : " "}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 'open'}>
              {renderTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'closed'}>
              {renderTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default StockTransfer;