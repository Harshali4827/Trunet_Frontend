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
//   CSpinner,
//   CBadge
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilSettings } from '@coreui/icons';
// import { Link } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import ReportSearchmodel from '../reportSubmission/ReportSearchModel';

// const RepairTeamStock = () => {
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

//       const url = params.toString() ? `/faulty-stock/repair-transfers/center?${params.toString()}` : '/faulty-stock/repair-transfers/center';
      
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

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       'under_repair': 'warning',
//       'repaired': 'success',
//       'irreparable': 'danger',
//       'damaged': 'secondary',
//       'disposed': 'dark',
//       'returned_to_vendor': 'info'
//     };
    
//     return statusColors[status] || 'secondary';
//   };
//   const getFlattenedData = () => {
//     const flattenedData = [];
    
//     data.forEach(repairTransfer => {
//       const { serialNumbers, product, quantity, ...rest } = repairTransfer;
      
//       if (product?.trackSerialNumber === "Yes" && serialNumbers && serialNumbers.length > 0) {
//         serialNumbers.forEach(serial => {
//           flattenedData.push({
//             ...rest,
//             product,
//             serialNumber: serial.serialNumber,
//             serialStatus: serial.status,
//             quantity: 1,
//             isSerialized: true,
//             originalQuantity: quantity,
//             repairHistory: serial.repairHistory || []
//           });
//         });
//       } else {

//         flattenedData.push({
//           ...rest,
//           product,
//           serialNumber: 'N/A',
//           serialStatus: repairTransfer.status,
//           quantity: quantity,
//           isSerialized: false,
//           originalQuantity: quantity,
//           repairHistory: repairTransfer.repairUpdates || []
//         });
//       }
//     });
    
//     return flattenedData;
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const flattenedData = getFlattenedData();
//     const sortedData = [...flattenedData].sort((a, b) => {
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

//   const flattenedData = getFlattenedData();

//   const filteredData = flattenedData.filter(item => {
//     if (activeSearch.center || activeSearch.date) {
//       return true;
//     }
    
//     const searchFields = [
//       item.product?.productTitle,
//       item.fromCenter?.centerName,
//       item.serialNumber,
//       item.serialStatus,
//       item.transferRemark
//     ];
    
//     return searchFields.some(field => 
//       field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   const sortedData = [...filteredData].sort((a, b) => {
//     if (!sortConfig.key) return 0;
    
//     let aValue = a;
//     let bValue = b;
    
//     if (sortConfig.key.includes('.')) {
//       const keys = sortConfig.key.split('.');
//       aValue = keys.reduce((obj, k) => obj && obj[k], a);
//       bValue = keys.reduce((obj, k) => obj && obj[k], b);
//     } else {
//       aValue = a[sortConfig.key];
//       bValue = b[sortConfig.key];
//     }
    
//     if (aValue < bValue) {
//       return sortConfig.direction === 'ascending' ? -1 : 1;
//     }
//     if (aValue > bValue) {
//       return sortConfig.direction === 'ascending' ? 1 : -1;
//     }
//     return 0;
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
//               <Link to='/transfer-repaired-stock'>
//                 <CButton size="sm" className="action-btn me-1">
//                 <i className="fa fa-exchange fa-margin"></i> Transfer
//                 </CButton>
//               </Link>
//               <Link to='/repaired-stock'>
//                 <CButton size="sm" className="action-btn me-1">
//                 <i className="fa fa-reply fa-margin"></i> Repaired
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
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                    Date {getSortIcon('date')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('fromCenter.centerName')} className="sortable-header">
//                  Center {getSortIcon('fromCenter.centerName')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('product.productTitle')} className="sortable-header">
//                  Product {getSortIcon('product.productTitle')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('serialNumber')} className="sortable-header">
//                  Serial Number {getSortIcon('serialNumber')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('quantity')} className="sortable-header">
//                   Quantity {getSortIcon('quantity')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('serialStatus')} className="sortable-header">
//                  Status {getSortIcon('serialStatus')}
//                 </CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {sortedData.length > 0 ? (
//                 sortedData.map((item, index) => (
//                   <CTableRow key={`${item._id}-${item.serialNumber}-${index}`} 
//                     className={
//                       item.serialStatus === 'repaired' ? 'use-product-row' : 
//                       item.serialStatus === 'irreparable' ? 'damage-product-row' : 
//                       item.serialStatus === 'under_repair' ? 'warning-row' : ''
//                     }>
//                     <CTableDataCell>
//                       {formatDate(item.date || '')}
//                     </CTableDataCell>
//                     <CTableDataCell>{item.fromCenter?.centerName || ' '}</CTableDataCell>
//                     <CTableDataCell>
//                       {item.product?.productTitle || ' '}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {item.isSerialized ? item.serialNumber : ' '}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {item.quantity}
//                       {item.isSerialized && item.originalQuantity > 1 && (
//                         <small className="text-muted d-block">
//                           of {item.originalQuantity}
//                         </small>
//                       )}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       <CBadge color={getStatusBadge(item.serialStatus)}>
//                         {item.serialStatus?.replace('_', ' ') || ' '}
//                       </CBadge>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan="7" className="text-center">
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

// export default RepairTeamStock;






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
  CBadge,
  CFormCheck,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilSettings, cilCheck } from '@coreui/icons';
import { Link } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { formatDate } from 'src/utils/FormatDateTime';
import ReportSearchmodel from '../reportSubmission/ReportSearchModel';
import { confirmAction, showSuccess, showError, showToast } from 'src/utils/sweetAlerts';

const RepairTeamStock = () => {
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

      const url = params.toString() ? `/faulty-stock/repair-transfers/center?${params.toString()}` : '/faulty-stock/repair-transfers/center';
      
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

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending_under_repair': 'warning',
      'under_repair': 'info',
      'repaired': 'success',
      'irreparable': 'danger',
      'damaged': 'secondary',
      'disposed': 'dark',
      'returned_to_vendor': 'info'
    };
    
    return statusColors[status] || 'secondary';
  };

  // Get flattened data with all items
  const getFlattenedData = () => {
    const flattenedData = [];
    
    data.forEach(repairTransfer => {
      const { serialNumbers, product, quantity, status, ...rest } = repairTransfer;
      
      if (product?.trackSerialNumber === "Yes" && serialNumbers && serialNumbers.length > 0) {
        serialNumbers.forEach(serial => {
          flattenedData.push({
            ...rest,
            product,
            serialNumber: serial.serialNumber,
            serialStatus: serial.status,
            quantity: 1,
            isSerialized: true,
            originalQuantity: quantity,
            transferStatus: status,
            repairHistory: serial.repairHistory || []
          });
        });
      } else {
        flattenedData.push({
          ...rest,
          product,
          serialNumber: 'N/A',
          serialStatus: status,
          quantity: quantity,
          isSerialized: false,
          originalQuantity: quantity,
          transferStatus: status,
          repairHistory: rest.repairUpdates || []
        });
      }
    });
    
    return flattenedData;
  };

  // Get only pending_under_repair items
  const getPendingUnderRepairItems = () => {
    const flattenedData = getFlattenedData();
    return flattenedData.filter(item => item.serialStatus === 'pending_under_repair');
  };

  // Handle checkbox selection
  const handleSelectItem = (itemId, isSelected) => {
    setSelectedItems(prev => {
      if (isSelected) {
        return [...prev, itemId];
      } else {
        return prev.filter(id => id !== itemId);
      }
    });
  };

  // Handle select all pending items
  const handleSelectAll = () => {
    const pendingItems = getPendingUnderRepairItems();
    const pendingItemIds = pendingItems.map(item => getItemUniqueId(item));
    
    if (selectedItems.length === pendingItemIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingItemIds);
    }
  };

  // Get unique ID for item selection
  const getItemUniqueId = (item) => {
    return `${item._id}-${item.serialNumber || 'non-serial'}`;
  };

  // Get selected pending items
  const getSelectedPendingItems = () => {
    const flattenedData = getFlattenedData();
    return flattenedData.filter(item => 
      selectedItems.includes(getItemUniqueId(item)) && 
      item.serialStatus === 'pending_under_repair'
    );
  };

  // Check if any pending items are selected
  const hasSelectedPendingItems = () => {
    return getSelectedPendingItems().length > 0;
  };

  // Accept pending items
  const acceptPendingItems = async () => {
    if (!hasSelectedPendingItems()) {
      showToast('Please select pending under repair items to accept', 'warning');
      return;
    }

    const selectedItems = getSelectedPendingItems();
    const itemCount = selectedItems.length;
    
    // Group by transfer ID
    const transfersMap = {};
    selectedItems.forEach(item => {
      if (!transfersMap[item._id]) {
        transfersMap[item._id] = {
          transferId: item._id,
          items: []
        };
      }
      
      transfersMap[item._id].items.push({
        serialNumber: item.serialNumber !== 'N/A' ? item.serialNumber : null,
        quantity: item.quantity
      });
    });

    const transferList = Object.values(transfersMap);
    
    confirmAction(
      'Accept Pending Under Repair Items',
      `<p>You are about to accept <strong>${itemCount} pending under repair item(s)</strong>.</p>
     `,
      'question',
      'Yes, Accept Items'
    ).then(async (result) => {
      if (result.isConfirmed) {
        await processAcceptance(transferList);
      }
    });
  };

  // Process acceptance
  const processAcceptance = async (transferList) => {
    setProcessing(true);
    setProcessError(null);
    setProcessSuccess(null);

    try {
      const results = [];
      
      for (const transferData of transferList) {
        try {
          const { transferId, items } = transferData;
          
          // Prepare request body
          const requestBody = {
            transferId: transferId,
            remark: 'Accepted by repair team'
          };

          // Add serial numbers if it's a serialized product
          const serialNumbers = items
            .filter(item => item.serialNumber)
            .map(item => ({ 
              serialNumber: item.serialNumber,
              remark: 'Accepted at repair center'
            }));

          if (serialNumbers.length > 0) {
            requestBody.acceptedQuantities = serialNumbers;
          } else {
            // For non-serialized products, send total quantity
            const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
            requestBody.acceptedQuantities = {
              totalAcceptedQty: totalQty,
              remark: `Accepted ${totalQty} items`
            };
          }

          const response = await axiosInstance.post('/faulty-stock/accept-repair-transfer', requestBody);

          if (response.data.success) {
            results.push({
              transferId: transferId,
              success: true,
              message: response.data.message
            });
          } else {
            results.push({
              transferId: transferId,
              success: false,
              message: response.data.message || 'Acceptance failed'
            });
          }
        } catch (error) {
          results.push({
            transferId: transferData.transferId,
            success: false,
            message: error.response?.data?.message || error.message
          });
        }
      }

      // Show results
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length === 0) {
        setProcessSuccess(`Successfully accepted all ${successful.length} transfers`);
        showSuccess(`Successfully accepted ${successful.length} transfer(s)`);
      } else {
        const errorMsg = `${successful.length} transfers accepted successfully, ` +
          `${failed.length} transfers failed`;
        setProcessError(errorMsg);
        showError(errorMsg);
      }

      // Refresh data
      await fetchData();

      // Reset selections
      setSelectedItems([]);

    } catch (error) {
      const errorMsg = `Error accepting items: ${error.message}`;
      setProcessError(errorMsg);
      showError(errorMsg);
    } finally {
      setProcessing(false);
      setTimeout(() => {
        setProcessSuccess(null);
        setProcessError(null);
      }, 5000);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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
        formatDate(item.createdAt || ''),
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
      let fileName = 'Repair-team-stock';
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
      
      showToast('Export completed successfully!', 'success');
      
    } catch (error) {
      console.error('Error generating CSV export:', error);
      showError('Error generating export file. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const flattenedData = getFlattenedData();

  const filteredData = flattenedData.filter(item => {
    if (activeSearch.center || activeSearch.date) {
      return true;
    }
    
    const searchFields = [
      item.product?.productTitle,
      item.fromCenter?.centerName,
      item.serialNumber,
      item.serialStatus,
      item.transferRemark
    ];
    
    return searchFields.some(field => 
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a;
    let bValue = b;
    
    if (sortConfig.key.includes('.')) {
      const keys = sortConfig.key.split('.');
      aValue = keys.reduce((obj, k) => obj && obj[k], a);
      bValue = keys.reduce((obj, k) => obj && obj[k], b);
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
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
              <Link to='/transfer-repaired-stock'>
                <CButton size="sm" className="action-btn me-1">
                <i className="fa fa-exchange fa-margin"></i> Transfer
                </CButton>
              </Link>
              <Link to='/repaired-stock'>
                <CButton size="sm" className="action-btn me-1">
                <i className="fa fa-reply fa-margin"></i> Repaired
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
            
            {/* Accept Button */}
            {hasSelectedPendingItems() && (
              <CButton 
                size="sm" 
                color="success" 
                className="action-btn me-1"
                onClick={acceptPendingItems}
                disabled={processing}
              >
                {processing ? (
                  <CSpinner size="sm" />
                ) : (
                  <>
                    <CIcon icon={cilCheck} className='icon' /> Accept ({getSelectedPendingItems().length})
                  </>
                )}
              </CButton>
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
                disabled={processing}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" width="50px">
                  <CFormCheck
                    id="header-select-all"
                    checked={selectedItems.length > 0 && selectedItems.length === getPendingUnderRepairItems().length}
                    onChange={handleSelectAll}
                    disabled={processing}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => !processing && handleSort('date')} className={`sortable-header ${processing ? 'disabled' : ''}`}>
                   Date {getSortIcon('date')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => !processing && handleSort('fromCenter.centerName')} className={`sortable-header ${processing ? 'disabled' : ''}`}>
                 Center {getSortIcon('fromCenter.centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => !processing && handleSort('product.productTitle')} className={`sortable-header ${processing ? 'disabled' : ''}`}>
                 Product {getSortIcon('product.productTitle')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => !processing && handleSort('serialNumber')} className={`sortable-header ${processing ? 'disabled' : ''}`}>
                 Serial Number {getSortIcon('serialNumber')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => !processing && handleSort('quantity')} className={`sortable-header ${processing ? 'disabled' : ''}`}>
                  Quantity {getSortIcon('quantity')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => !processing && handleSort('quantity')} className={`sortable-header ${processing ? 'disabled' : ''}`}>
                  Pending Quantity {getSortIcon('quantity')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => !processing && handleSort('serialStatus')} className={`sortable-header ${processing ? 'disabled' : ''}`}>
                 Status {getSortIcon('serialStatus')}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {sortedData.length > 0 ? (
                sortedData.map((item, index) => {
                  const isPending = item.serialStatus === 'pending_under_repair';
                  const itemId = getItemUniqueId(item);
                  const isSelected = selectedItems.includes(itemId);

                  return (
                    <CTableRow key={itemId} 
                      className={
                        item.serialStatus === 'repaired' ? 'use-product-row' : 
                        item.serialStatus === 'irreparable' ? 'damage-product-row' : 
                        item.serialStatus === 'under_repair' ? 'warning-row' :
                        item.serialStatus === 'pending_under_repair' ? 'pending-row' : ''
                      }>
                      <CTableDataCell>
                        {isPending && (
                          <CFormCheck
                            id={`select-${itemId}`}
                            checked={isSelected}
                            onChange={(e) => !processing && handleSelectItem(itemId, e.target.checked)}
                            disabled={processing}
                          />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(item.date || '')}
                      </CTableDataCell>
                      <CTableDataCell>{item.fromCenter?.centerName || ' '}</CTableDataCell>
                      <CTableDataCell>
                        {item.product?.productTitle || ' '}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.isSerialized ? item.serialNumber : ' '}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.quantity}
                        {item.isSerialized && item.originalQuantity > 1 && (
                          <small className="text-muted d-block">
                            of {item.originalQuantity}
                          </small>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.pendingUnderRepairQty || 0}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadge(item.serialStatus)}>
                          {item.serialStatus?.replace('_', ' ') || ' '}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-center">
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

export default RepairTeamStock;