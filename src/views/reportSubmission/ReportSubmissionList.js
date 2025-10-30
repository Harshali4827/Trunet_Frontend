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
// import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilZoomOut, cilSettings } from '@coreui/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import ReportSearchmodel from './ReportSearchModel';

// const ReportSubmissionList = () => {
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
//   const navigate = useNavigate();

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

//       const url = params.toString() ? `/reportsubmission?${params.toString()}` : '/reportsubmission';
      
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
  
//   const handleClick = (itemId) => {
//     navigate(`/edit-reportSubmission/${itemId}`);
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
//       <div className='title'>Closing Stock Logs </div>
    
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
//             <Link to='/add-reportSubmission'>
//               <CButton size="sm" className="action-btn me-1">
//                 <CIcon icon={cilPlus} className='icon'/> Add
//               </CButton>
//             </Link>
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
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
//                   Remark {getSortIcon('remark')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')} className="sortable-header">
//                   Created At {getSortIcon('createdAt')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.fullname')} className="sortable-header">
//                   Created By {getSortIcon('createdBy.fullname')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
//                   Approve Remark {getSortIcon('remark')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell>
//                   Options
//                 </CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((customer) => (
//                   <CTableRow key={customer._id}>
//                     <CTableDataCell>
//                       <button 
//                         className="btn btn-link p-0 text-decoration-none"
//                         onClick={() => handleClick(customer._id)}
//                         style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                       >
//                         {formatDate(customer.date || '')}
//                       </button>
//                     </CTableDataCell>
//                     <CTableDataCell>{customer.center?.centerName || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{customer.remark || ''}</CTableDataCell>
//                     <CTableDataCell>{formatDateTime(customer.createdAt || 'N/A')}</CTableDataCell>
//                     <CTableDataCell>{customer.createdBy.email || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{customer.remark || ''}</CTableDataCell>
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
//                             >
//                             <i className="fa fa-exchange fa-margin"></i> Approve
//                             </button>
//                             <button 
//                             className="dropdown-item"
//                             >
//                             <i className="fa fa-exchange fa-margin"></i> Duplicate Entry
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

// export default ReportSubmissionList;


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
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilZoomOut, cilSettings } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import ReportSearchmodel from './ReportSearchModel';
import Swal from 'sweetalert2';

const ReportSubmissionList = () => {
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
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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

      const url = params.toString() ? `/reportsubmission?${params.toString()}` : '/reportsubmission';
      
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
  
  const handleClick = (itemId) => {
    navigate(`/edit-reportSubmission/${itemId}`);
  };

  const handleApprove = async (item) => {
    setDropdownOpen(prev => ({ ...prev, [item._id]: false }));

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to approve this stock closing entry?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6d7d9c',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.patch(
          `/reportsubmission/${item._id}/status`,
          { status: 'Approved' }
        );

        if (response.data.success) {
          setData(prevData => 
            prevData.map(customer => 
              customer._id === item._id 
                ? { ...customer, status: 'Approved' }
                : customer
            )
          );

          Swal.fire(
            'Approved!',
            'Stock closing has been approved successfully.',
            'success'
          );
        } else {
          throw new Error(response.data.message || 'Failed to approve');
        }
      } catch (error) {
        console.error('Error approving stock closing:', error);
        Swal.fire(
          'Error!',
          error.response?.data?.message || 'Failed to approve stock closing.',
          'error'
        );
      }
    }
  };

  const handleDuplicate = async (item) => {
    setDropdownOpen(prev => ({ ...prev, [item._id]: false }));

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to mark this stock closing entry as duplicate?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6d7d9c',
      confirmButtonText: 'Yes, mark as duplicate!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.patch(
          `/reportsubmission/${item._id}/status`,
          { status: 'Duplicate' }
        );

        if (response.data.success) {
          setData(prevData => 
            prevData.map(customer => 
              customer._id === item._id 
                ? { ...customer, status: 'Duplicate' }
                : customer
            )
          );

          Swal.fire(
            'Marked as Duplicate!',
            'Stock closing has been marked as duplicate.',
            'success'
          );
        } else {
          throw new Error(response.data.message || 'Failed to mark as duplicate');
        }
      } catch (error) {
        console.error('Error marking stock closing as duplicate:', error);
        Swal.fire(
          'Error!',
          error.response?.data?.message || 'Failed to mark as duplicate.',
          'error'
        );
      }
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
        Error loading data: {error}
      </div>
    );
  }

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <div className='title'>Closing Stock Logs </div>
    
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
            <Link to='/add-reportSubmission'>
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Add
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
                   Date {getSortIcon('username')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                 Center {getSortIcon('center.centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
                  Remark {getSortIcon('remark')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')} className="sortable-header">
                  Created At {getSortIcon('createdAt')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.fullname')} className="sortable-header">
                  Created By {getSortIcon('createdBy.fullname')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
                  Approve Remark {getSortIcon('remark')}
                </CTableHeaderCell>
                <CTableHeaderCell>
                  Options
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.length > 0 ? (
                filteredData.map((customer) => (
                  <CTableRow key={customer._id}>
                    <CTableDataCell>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleClick(customer._id)}
                        style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                      >
                        {formatDate(customer.date || '')}
                      </button>
                    </CTableDataCell>
                    <CTableDataCell>{customer.center?.centerName || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{customer.remark || ''}</CTableDataCell>
                    <CTableDataCell>{formatDateTime(customer.createdAt || 'N/A')}</CTableDataCell>
                    <CTableDataCell>{customer.createdBy.email || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{customer.remark || ''}</CTableDataCell>
                    <CTableDataCell>
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
                              onClick={() => handleApprove(customer)}
                            >
                            <i className="fa fa-exchange fa-margin"></i> Approve
                            </button>
                            <button 
                            className="dropdown-item"
                            onClick={() => handleDuplicate(customer)}
                            >
                            <i className="fa fa-exchange fa-margin"></i> Duplicate Entry
                          </button>
                          </div>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center">
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

export default ReportSubmissionList;