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
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilSettings } from '@coreui/icons';
// import { Link,} from 'react-router-dom';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';

// import Swal from 'sweetalert2';
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

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [repairType, setRepairType] = useState('');
//   const [nonSerialQty, setNonSerialQty] = useState(0);
//   const [nonSerialModal, setNonSerialModal] = useState(false);


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

//   const handleRepairAction = async (item, type) => {
//     setDropdownOpen(prev => ({ ...prev, [item._id]: false }));
  
//     try {
//       const productId = item.product?._id;
//       const response = await axiosInstance.get(`/faulty-stock/serials/${productId}`);
  
//       if (response.data.success) {
//         const productData = response.data.data.product;
//         const serialNumbers = response.data.data.serialNumbers || [];
  
//         setSelectedProduct({
//           ...item,
//           ...productData,
//           serialNumbers
//         });
  
//         setRepairType(type);
  
//         if (productData.trackSerialNumber === 'Yes') {
//           setModalVisible(true);
//         } else {
//           setNonSerialModal(true);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching serial info:', err);
//       Swal.fire('Error', 'Failed to fetch product serial information', 'error');
//     }
//   };
  

//   const handleSerialNumbersUpdate = async (productId, selectedSerials) => {
//     try {
//       const payload = {
//         productId,
//         repairType,
//         serialNumbers: selectedSerials.map(s => s.serialNumber),
//       };
  
//       const response = await axiosInstance.post('/faulty-stock/repair-update', payload);
  
//       if (response.data.success) {
//         Swal.fire('Success', `Product marked as ${repairType}`, 'success');
//         fetchData();
//       } else {
//         Swal.fire('Error', response.data.message || 'Update failed', 'error');
//       }
//     } catch (err) {
//       console.error('Error updating repair status:', err);
//       Swal.fire('Error', 'Failed to update repair status', 'error');
//     }
//   };
  

//   const handleNonSerialSubmit = async () => {
//     if (nonSerialQty <= 0) {
//       Swal.fire('Error', 'Please enter valid quantity', 'warning');
//       return;
//     }
  
//     try {
//       const payload = {
//         productId: selectedProduct.product?._id || selectedProduct.productId,
//         repairType,
//         quantity: nonSerialQty,
//       };
  
//       const response = await axiosInstance.post('/faulty-stock/repair-update', payload);
  
//       if (response.data.success) {
//         Swal.fire('Success', `Product marked as ${repairType}`, 'success');
//         fetchData();
//       } else {
//         Swal.fire('Error', response.data.message || 'Update failed', 'error');
//       }
//     } catch (err) {
//       console.error('Error updating non-serial repair status:', err);
//       Swal.fire('Error', 'Failed to update repair status', 'error');
//     } finally {
//       setNonSerialModal(false);
//     }
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
//         Error loading data: {error}
//       </div>
//     );
//   }

//   const toggleDropdown = (id) => {
//     setDropdownOpen(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };


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
//               <Link to='/repaired-stock'>
//                 <CButton size="sm" className="action-btn me-1">
//                 <i className="fa fa-exchange fa-margin"></i> Repaired
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
//                    Date {getSortIcon('username')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//                  Center {getSortIcon('center.centerName')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//                  Product {getSortIcon('center.centerName')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
//                   Quantity {getSortIcon('remark')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')} className="sortable-header">
//                  Status {getSortIcon('createdAt')}
//                 </CTableHeaderCell>
              
//                 <CTableHeaderCell>
//                   Options
//                 </CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((customer) => (
//                   <CTableRow key={customer._id} className={customer.status === 'Approved' ? 'use-product-row' : 
//                     customer.status === 'Duplicate' ? 'damage-product-row' : ''}>
//                     <CTableDataCell>
            
//                         {formatDate(customer.date || '')}
//                     </CTableDataCell>
//                     <CTableDataCell>{customer.fromCenter?.centerName || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{customer.product?.productTitle || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{customer.quantity || ''}</CTableDataCell>
//                     <CTableDataCell>{customer.overallStatus || ''}</CTableDataCell>
//                     <CTableDataCell>
//                     <div className="dropdown-container" ref={el => dropdownRefs.current[customer._id] = el}>
//                         <CButton 
//                           size="sm"
//                           className='option-button btn-sm'
//                           onClick={() => toggleDropdown(customer._id)}
//                         >
//                           <CIcon icon={cilSettings} />
//                           Options
//                         </CButton>
//                         {dropdownOpen[customer._id] && (
//                           <div className="dropdown-menu show">
//                             <button 
//                               className="dropdown-item"
//                               onClick={() => handleRepairAction(customer, 'repaired')}
//                             >
//                            <i className="fa fa-reply fa-margin"></i> Repaired
//                             </button>
//                             <button 
//                             className="dropdown-item"
//                             onClick={() => handleRepairAction(customer, 'irreparable')}
//                             >
//                              <i className="fa fa-recycle fa-margin"></i>&nbsp; Irreparable
//                           </button>
//                           </div>
//                         )}
//                       </div>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan="9" className="text-center">
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilSettings } from '@coreui/icons';
import { Link } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import ReportSearchmodel from '../reportSubmission/ReportSearchModel';

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
      'under_repair': 'warning',
      'repaired': 'success',
      'irreparable': 'danger',
      'damaged': 'secondary',
      'disposed': 'dark',
      'returned_to_vendor': 'info'
    };
    
    return statusColors[status] || 'secondary';
  };
  const getFlattenedData = () => {
    const flattenedData = [];
    
    data.forEach(repairTransfer => {
      const { serialNumbers, product, quantity, ...rest } = repairTransfer;
      
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
            repairHistory: serial.repairHistory || []
          });
        });
      } else {

        flattenedData.push({
          ...rest,
          product,
          serialNumber: 'N/A',
          serialStatus: repairTransfer.status,
          quantity: quantity,
          isSerialized: false,
          originalQuantity: quantity,
          repairHistory: repairTransfer.repairUpdates || []
        });
      }
    });
    
    return flattenedData;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const flattenedData = getFlattenedData();
    const sortedData = [...flattenedData].sort((a, b) => {
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
                <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                   Date {getSortIcon('date')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('fromCenter.centerName')} className="sortable-header">
                 Center {getSortIcon('fromCenter.centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('product.productTitle')} className="sortable-header">
                 Product {getSortIcon('product.productTitle')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('serialNumber')} className="sortable-header">
                 Serial Number {getSortIcon('serialNumber')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('quantity')} className="sortable-header">
                  Quantity {getSortIcon('quantity')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('serialStatus')} className="sortable-header">
                 Status {getSortIcon('serialStatus')}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {sortedData.length > 0 ? (
                sortedData.map((item, index) => (
                  <CTableRow key={`${item._id}-${item.serialNumber}-${index}`} 
                    className={
                      item.serialStatus === 'repaired' ? 'use-product-row' : 
                      item.serialStatus === 'irreparable' ? 'damage-product-row' : 
                      item.serialStatus === 'under_repair' ? 'warning-row' : ''
                    }>
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
                      <CBadge color={getStatusBadge(item.serialStatus)}>
                        {item.serialStatus?.replace('_', ' ') || ' '}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center">
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