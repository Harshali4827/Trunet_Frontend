// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect, useRef } from 'react';
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
//   CPaginationItem,
//   CPagination,
//   CSpinner
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// import { Link } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import ReportSearchmodel from '../reportSubmission/ReportSearchModel';
// import { CBadge } from '@coreui/react';
// const FaultyStock = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [activeSearch, setActiveSearch] = useState({ 
//     center: '',
//     date: ''
//   });
//   const [exportLoading, setExportLoading] = useState(false);
//   const dropdownRefs = useRef({});

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       Object.keys(dropdownRefs.current).forEach(key => {
//         const ref = dropdownRefs.current[key];
//         if (ref && !ref.contains(event.target)) {
//           setDropdownOpen(prev => ({
//             ...prev,
//             [key]: false
//           }));
//         }
//       });
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const fetchData = async (searchParams = {}) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
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

//       const url = params.toString() ? `/faulty-stock/product-status?${params.toString()}` : '/faulty-stock/product-status';
      
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setData(response.data.data || []);
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

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//   }, []);

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
//     fetchData(searchData);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       center: '',
//       date: ''
//     });
//     setSearchTerm('');
//     fetchData();
//   };

//   const generateCSVExport = async () => {
//     try {
//       setExportLoading(true);
      
//       const params = new URLSearchParams();
      
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
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
//         ? `/reportsubmission?${params.toString()}` 
//         : '/reportsubmission';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data || [];
      
//       if (exportData.length === 0) {
//         alert('No data available for export with current filters');
//         return;
//       }
//       const headers = [
//         'Date',
//         'Center',
//         'Remark',
//         'Created At',
//         'Created By'
//       ];
//       const csvData = exportData.map(item => [
//         formatDate(item.date || ''),
//         item.center?.centerName || '',
//         item.remark || '',
//         formatDateTime(item.createdAt || ''),
//         item.createdBy?.email || '',
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
//       let fileName = 'Closing-stock-log';
//       if (activeSearch.center || activeSearch.date) {
//         fileName += '_filtered';
//       }
//       fileName += `_${new Date().toISOString().split('T')[0]}.csv`;
      
//       link.setAttribute('download', fileName);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);
      
//     } catch (error) {
//       console.error('Error generating CSV export:', error);
//       alert('Error generating export file. Please try again.');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   const filteredData = data.filter(customer => {
//     if (activeSearch.center || activeSearch.date) {
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

// const renderStatusBadge = (status) => {
//   if (!status) return 'N/A';
  
//   const statusText = status.toLowerCase().replace(' ', '_');
  
//   let color = '';
//   switch(statusText) {
//     case 'damaged':
//       color = 'danger';
//       break;
//     case 'under_repair':
//     case 'under repair':
//       color = 'warning';
//       break;
//     case 'repaired':
//       color = 'success';
//       break;
//     default:
//       color = 'secondary';
//   }
  
//   return (
//     <CBadge color={color} shape="rounded-pill">
//       {status}
//     </CBadge>
//   );
// };
  
//   return (
//     <div>
//       <div className='title'>Faulty Stock</div>
    
//      <ReportSearchmodel
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         initialSearchData={activeSearch}
//       /> 
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//               <Link to='/transfer-faulty-stock'>
//                 <CButton size="sm" className="action-btn me-1">
//                 <i className="fa fa-exchange fa-margin"></i> Transfer
//                 </CButton>
//               </Link>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={generateCSVExport}
//               disabled={exportLoading}
//             >
//               {exportLoading ? (
//                 <CSpinner size="sm" />
//               ) : (
//                 <>
//                   <i className="fa fa-fw fa-file-excel"></i>
//                   Export
//                 </>
//               )}
//             </CButton>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setSearchModalVisible(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {(activeSearch.center || activeSearch.date) && (
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
//           </div>
//           <div>
//             <CPagination size="sm" aria-label="Page navigation">
//               <CPaginationItem>First</CPaginationItem>
//               <CPaginationItem>&lt;</CPaginationItem>
//               <CPaginationItem>1</CPaginationItem>
//               <CPaginationItem>&gt;</CPaginationItem>
//               <CPaginationItem>Last</CPaginationItem>
//             </CPagination>
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
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                    Date {getSortIcon('date')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//                  Center {getSortIcon('center.centerName')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('product.productTitle')} className="sortable-header">
//                  Product {getSortIcon('product.productTitle')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('quantity')} className="sortable-header">
//                  Total Quantity {getSortIcon('quantity')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('damageQty')} className="sortable-header">
//                  Damage Qty {getSortIcon('damageQty')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('underRepairQty')} className="sortable-header">
//                  Under Repair Qty {getSortIcon('underRepairQty')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('repairedQty')} className="sortable-header">
//                  Repaired Qty {getSortIcon('repairedQty')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('irrepairedQty')} className="sortable-header">
//                  Irrepaired Qty {getSortIcon('irrepairedQty')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('overallStatus')} className="sortable-header">
//                  Status {getSortIcon('overallStatus')}
//                 </CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((item) => {
//                   // Extract quantity values from different possible structures
//                   const totalQty = item.quantity || item.quantitySummary?.total || 0;
//                   const damageQty = item.damageQty || item.quantitySummary?.damageQty || 0;
//                   const underRepairQty = item.underRepairQty || item.quantitySummary?.underRepair || 0;
//                   const repairedQty = item.repairedQty || item.quantitySummary?.repaired || 0;
//                   const irrepairedQty = item.irrepairedQty || item.quantitySummary?.irrepaired || 0;

//                   return (
//                     <CTableRow key={item._id} 
//                       // className={
//                       //   item.overallStatus === 'damaged' ? 'damage-product-row' : 
//                       //   item.overallStatus === 'repaired' ? 'use-product-row' : 
//                       //   item.overallStatus === 'under_repair' ? 'under-repair-row' : ''
//                       // }
//                       >
//                       <CTableDataCell>
//                         {formatDate(item.date || '')}
//                       </CTableDataCell>
//                       <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {item.product?.productTitle || item.productDetails?.productTitle || ''}
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <strong>{totalQty}</strong>
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <span className="badge bg-danger text-white">{damageQty}</span>
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <span className="badge bg-warning text-dark">{underRepairQty}</span>
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <span className="badge bg-success text-white">{repairedQty}</span>
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <span className="badge bg-secondary text-white">{irrepairedQty}</span>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {renderStatusBadge(item.overallStatus || item.status || '')}
//                       </CTableDataCell>
//                     </CTableRow>
//                   );
//                 })
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan="10" className="text-center">
//                     No faulty stock records found
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

// export default FaultyStock;




import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect, useRef } from 'react';
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
  CPaginationItem,
  CPagination,
  CSpinner,
  CFormCheck,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilCheck} from '@coreui/icons';
import { Link } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import ReportSearchmodel from '../reportSubmission/ReportSearchModel';
import { confirmAction, showSuccess, showError} from 'src/utils/sweetAlerts';
import { CBadge } from '@coreui/react';

const FaultyStock = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeSearch, setActiveSearch] = useState({ 
    center: '',
    date: ''
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState(null);
  const [processSuccess, setProcessSuccess] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        const ref = dropdownRefs.current[key];
        if (ref && !ref.contains(event.target)) {
          setDropdownOpen(prev => ({
            ...prev,
            [key]: false
          }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = async (searchParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }

      if (searchParams.date && searchParams.date.includes(' to ')) {
        const [startDateStr, endDateStr] = searchParams.date.split(' to ');
        
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(startDateStr));
        params.append('endDate', convertDateFormat(endDateStr));
      }

      const url = params.toString() ? `/faulty-stock/product-status?${params.toString()}` : '/faulty-stock/product-status';
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data || []);
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
      console.error('Error fetching centers:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

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
    fetchData(searchData);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      center: '',
      date: ''
    });
    setSearchTerm('');
    fetchData();
  };

  // Handle checkbox selection
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    const pendingItems = data.filter(item => 
      item.overallStatus === 'pending_damage' || item.overallStatus === 'pending damage'
    ).map(item => item._id);
    
    if (selectedItems.length === pendingItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingItems);
    }
  };

  // Get selected pending items
  const getSelectedPendingItems = () => {
    return data.filter(item => 
      selectedItems.includes(item._id) && 
      (item.overallStatus === 'pending_damage' || item.overallStatus === 'pending damage')
    );
  };

  // Check if any pending items are selected
  const hasSelectedPendingItems = () => {
    return getSelectedPendingItems().length > 0;
  };

  
  const handleAction = async (action) => {
    const items = getSelectedPendingItems();
  
    if (items.length === 0) {
      return showError('Please select pending damage items');
    }
  
    const result = await confirmAction(
      action === 'accept' ? 'Accept Damage?' : 'Reject Damage?',
      `<b>${items.length}</b> item(s) will be ${action}ed.`,
      action === 'accept' ? 'question' : 'warning',
      action === 'accept' ? 'Yes, Accept' : 'Yes, Reject'
    );
  
    if (!result.isConfirmed) return;
  
    try {
      for (const item of items) {
        const payload = { faultyStockId: item._id };
  
        if (action === 'accept') {
          await axiosInstance.post('/faulty-stock/accept-damage', payload);
        } else {
          await axiosInstance.post('/faulty-stock/reject-damage', payload);
        }
      }
  
      showSuccess(`Successfully ${action}ed ${items.length} item(s)`);
      setSelectedItems([]);
      fetchData();
  
    } catch (error) {
      showError(error);
    }
  };
  

  const generateCSVExport = async () => {
    try {
      setExportLoading(true);
      
      const params = new URLSearchParams();
      
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      
      if (activeSearch.date && activeSearch.date.includes(' to ')) {
        const [startDateStr, endDateStr] = activeSearch.date.split(' to ');
        
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(startDateStr));
        params.append('endDate', convertDateFormat(endDateStr));
      }

      const apiUrl = params.toString() 
        ? `/reportsubmission?${params.toString()}` 
        : '/reportsubmission';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      const exportData = response.data.data || [];
      
      if (exportData.length === 0) {
        alert('No data available for export with current filters');
        return;
      }
      const headers = [
        'Date',
        'Center',
        'Remark',
        'Created At',
        'Created By'
      ];
      const csvData = exportData.map(item => [
        formatDate(item.date || ''),
        item.center?.centerName || '',
        item.remark || '',
        formatDateTime(item.createdAt || ''),
        item.createdBy?.email || '',
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
      let fileName = 'Closing-stock-log';
      if (activeSearch.center || activeSearch.date) {
        fileName += '_filtered';
      }
      fileName += `_${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Error generating CSV export:', error);
      alert('Error generating export file. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const filteredData = data.filter(customer => {
    if (activeSearch.center || activeSearch.date) {
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

const renderStatusBadge = (status) => {
  if (!status) return 'N/A';
  
  const statusText = status.toLowerCase().replace(' ', '_');
  
  let color = '';
  switch(statusText) {
    case 'pending_damage':
    case 'pending damage':
      color = 'warning';
      break;
    case 'damaged':
      color = 'danger';
      break;
    case 'under_repair':
    case 'under repair':
      color = 'info';
      break;
    case 'repaired':
      color = 'success';
      break;
    default:
      color = 'secondary';
  }
  
  return (
    <CBadge color={color} shape="rounded-pill">
      {status}
    </CBadge>
  );
};
  
  return (
    <div>
      <div className='title'>Faulty Stock</div>
    
     <ReportSearchmodel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        initialSearchData={activeSearch}
      /> 
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
              <Link to='/transfer-faulty-stock'>
                <CButton size="sm" className="action-btn me-1">
                <i className="fa fa-exchange fa-margin"></i> Transfer
                </CButton>
              </Link>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={generateCSVExport}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <CSpinner size="sm" />
              ) : (
                <>
                  <i className="fa fa-fw fa-file-excel"></i>
                  Export
                </>
              )}
            </CButton>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            
            {hasSelectedPendingItems() && (
  <>
    <CButton
      size="sm"
      color="success"
      className="action-btn me-1"
      onClick={() => handleAction('accept')}
    >
      <CIcon icon={cilCheck} /> Accept ({getSelectedPendingItems().length})
    </CButton>

    {/* <CButton
      size="sm"
      color="danger"
      className="action-btn me-1"
      onClick={() => handleAction('reject')}
    >
      <i className="fa fa-times" /> Reject ({getSelectedPendingItems().length})
    </CButton> */}
  </>
)}

            
            {(activeSearch.center || activeSearch.date) && (
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
            <CPagination size="sm" aria-label="Page navigation">
              <CPaginationItem>First</CPaginationItem>
              <CPaginationItem>&lt;</CPaginationItem>
              <CPaginationItem>1</CPaginationItem>
              <CPaginationItem>&gt;</CPaginationItem>
              <CPaginationItem>Last</CPaginationItem>
            </CPagination>
          </div>
        </CCardHeader>
        
        <CCardBody>
          {processSuccess && (
            <CAlert color="success" className="mb-3" onClose={() => setProcessSuccess(null)}>
              {processSuccess}
            </CAlert>
          )}
          {processError && (
            <CAlert color="danger" className="mb-3" onClose={() => setProcessError(null)}>
              {processError}
            </CAlert>
          )}
          
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
              <CTableHeaderCell scope="col" width="50px" className="text-center">
  <CFormCheck
    checked={
      selectedItems.length > 0 &&
      selectedItems.length === data.filter(
        i => i.overallStatus === 'pending_damage' || i.overallStatus === 'pending damage'
      ).length
    }
    onChange={handleSelectAll}
  />
</CTableHeaderCell>

                <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                   Date {getSortIcon('date')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                 Center {getSortIcon('center.centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('product.productTitle')} className="sortable-header">
                 Product {getSortIcon('product.productTitle')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('quantity')} className="sortable-header">
                 Total Quantity {getSortIcon('quantity')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('damageQty')} className="sortable-header">
                 Damage Qty {getSortIcon('damageQty')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('underRepairQty')} className="sortable-header">
                 Under Repair Qty {getSortIcon('underRepairQty')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('repairedQty')} className="sortable-header">
                 Repaired Qty {getSortIcon('repairedQty')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('irrepairedQty')} className="sortable-header">
                 Irrepaired Qty {getSortIcon('irrepairedQty')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('overallStatus')} className="sortable-header">
                 Status {getSortIcon('overallStatus')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                 Pending Qty
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  // Extract quantity values from different possible structures
                  const totalQty = item.quantity || item.quantitySummary?.total || 0;
                  const damageQty = item.damageQty || item.quantitySummary?.damageQty || 0;
                  const underRepairQty = item.underRepairQty || item.quantitySummary?.underRepair || 0;
                  const repairedQty = item.repairedQty || item.quantitySummary?.repaired || 0;
                  const irrepairedQty = item.irrepairedQty || item.quantitySummary?.irrepaired || 0;
                  const pendingQty = item.pendingDamageQty || item.quantitySummary?.pendingDamage || 0;
                  
                  const isPending = item.overallStatus === 'pending_damage' || item.overallStatus === 'pending damage';
                  const isSelected = selectedItems.includes(item._id);

                  return (
                    <CTableRow key={item._id}>
                     <CTableDataCell className="text-center">
  {isPending && (
    <CFormCheck
      checked={selectedItems.includes(item._id)}
      onChange={() => handleSelectItem(item._id)}
    />
  )}
</CTableDataCell>

                      <CTableDataCell>
                        {formatDate(item.createdAt || '')}
                      </CTableDataCell>
                      <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {item.product?.productTitle || item.productDetails?.productTitle || ''}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <strong>{totalQty}</strong>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <span className="badge bg-danger text-white">{damageQty}</span>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <span className="badge bg-warning text-dark">{underRepairQty}</span>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <span className="badge bg-success text-white">{repairedQty}</span>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <span className="badge bg-secondary text-white">{irrepairedQty}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        {renderStatusBadge(item.overallStatus || item.status || '')}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {pendingQty > 0 ? (
                          <span className="badge bg-warning text-dark">{pendingQty}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="12" className="text-center">
                    No faulty stock records found
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

export default FaultyStock;