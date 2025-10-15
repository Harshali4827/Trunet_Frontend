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

// const UsageSummary = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ keyword: '', outlet: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet);
//       }
//       params.append('page', page);
//       const url = params.toString() ? `/reports/usages/summary?${params.toString()}` : '/reports/usages/summary';
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

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
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
//       TotalQuantity: 0,
//     };
  
//     data.forEach(item => {
//       totals.TotalQuantity += parseFloat(item.TotalQuantity || 0);
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
//     setActiveSearch({ keyword: '', outlet: '' });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const filteredFlattenedData = getFlattenedData().filter(item => {
//     if (activeSearch.keyword || activeSearch.outlet) {
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
//       const response = await axiosInstance.get('/reports/usages/summary');
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
//         'Center',
//         'Product',
//         'Count'
//       ];
  
//       const csvData = allData.flatMap(purchase => {
//         if (purchase.products && purchase.products.length > 0) {
//           return purchase.products.map(product => [
//             purchase.Center,
//             purchase.Product || 0,
//             purchase.TotalQuantity || 'N/A',
//           ]);
//         } else {
//           return [[
//             purchase.Center,
//             purchase.Product || 0,
//             purchase.TotalQuantity || 'N/A',
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
//       link.setAttribute('download', `usage_summary_report_${new Date().toISOString().split('T')[0]}.csv`);
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
//       <div className='title'>Usage Summary Report</div>
    
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
//             {(activeSearch.keyword || activeSearch.outlet) && (
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
//         <div style={{backgroundColor:'#00c0ef',borderColor:'#00acd6',borderRadius:'3px',display:'block',
//                 padding: '15px',
//                  marginBottom: '20px',
//                  border: '1px solid transparent',width:'100%',marginLeft:'10px',marginRight:'10px'}}>
                
//                     <h4 style={{fontweight: '600',
//                         display: 'block',
//                         marginblockstart: '1.33em',
//                         marginblockend: '1.33em',
//                         margininlinestart: '0px',
//                         margininlineend: '0px',
//                         fontsize:'18px',
//                         marginBottom:'10px',
//                         color:'#fff',
//                     }}>Showing Result</h4>
//                     <li style={{color:'#fff'}}><strong style={{color:'#fff',fontSize: '14px',}}>Month:</strong>July-2025</li>
//                 </div>
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
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('Center')} className="sortable-header">
//                     Center {getSortIcon('Center')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('Product')} className="sortable-header">
//                     Product {getSortIcon('Product')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('TotalQuantity')} className="sortable-header">
//                     Total Qty {getSortIcon('TotalQuantity')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredFlattenedData.length > 0 ? (
//                   <>
//                     {filteredFlattenedData.map((item) => (
//                       <CTableRow key={item.uniqueKey}>
//                         <CTableDataCell>{item.Center || ''}</CTableDataCell>
//                         <CTableDataCell>
//                           {item.Product || 'No Product'}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.TotalQuantity || 0}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="2">Total</CTableDataCell>
//                       <CTableDataCell>{totals.TotalQuantity.toFixed(2)}</CTableDataCell>
//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="8" className="text-center">
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

// export default UsageSummary;


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
  CSpinner,
  CFormLabel,
  CFormInput
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';

const UsageSummary = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', outlet: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchParams.keyword) params.append('search', searchParams.keyword);
      if (searchParams.outlet) params.append('outlet', searchParams.outlet);
      params.append('page', page);

      const url = params.toString()
        ? `/reports/usages/summary?${params.toString()}`
        : '/reports/usages/summary';

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data || []);
        setSummary(response.data.summary || null);
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

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

  const calculateTotals = () => {
    const totals = { TotalQuantity: 0 };
    data.forEach(item => {
      totals.TotalQuantity += parseFloat(item.TotalQuantity || 0);
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
      const aValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), a);
      const bValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), b);
      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) =>
    sortConfig.key === key ? (
      sortConfig.direction === 'ascending'
        ? <CIcon icon={cilArrowTop} className="ms-1" />
        : <CIcon icon={cilArrowBottom} className="ms-1" />
    ) : null;

  const totals = calculateTotals();
  
   const fetchAllDataForExport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/reports/usages/summary');
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
  
      const headers = [
        'Center',
        'Product',
        'Count'
      ];
  
      const csvData = allData.flatMap(purchase => {
        if (purchase.products && purchase.products.length > 0) {
          return purchase.products.map(product => [
            purchase.Center,
            purchase.Product || 0,
            purchase.TotalQuantity || 'N/A',
          ]);
        } else {
          return [[
            purchase.Center,
            purchase.Product || 0,
            purchase.TotalQuantity || 'N/A',
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
      link.setAttribute('download', `usage_summary_report_${new Date().toISOString().split('T')[0]}.csv`);
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


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error loading data: {error}</div>;
  }

  const formattedMonth = summary?.period
    ? new Date(`${summary.period.split('/')[1]}-${summary.period.split('/')[0]}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div>
      <div className='title'>Usage Summary Report</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={() => setSearchModalVisible(true)}>
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.keyword || activeSearch.outlet) && (
              <CButton size="sm" color="secondary" className="action-btn me-1" onClick={() => fetchData({}, 1)}>
                <CIcon icon={cilZoomOut} className='icon' /> Reset Search
              </CButton>
            )}
            <CButton 
              size="sm" 
               className="action-btn me-1"
               onClick={generateDetailExport}
             >
               <i className="fa fa-fw fa-file-excel"></i>
                Export
            </CButton>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </CCardHeader>

        <CCardBody>
          <div className='summary-report'>
            <h4 className='summary-title'>
              Showing Result
            </h4>
            <ul className='summary-list'>
              <li><strong>Month:</strong> {formattedMonth}</li>
            </ul>
          </div>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell onClick={() => handleSort('Center')}>Center {getSortIcon('Center')}</CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('Product')}>Product {getSortIcon('Product')}</CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('TotalQuantity')}>Total Qty {getSortIcon('TotalQuantity')}</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.length > 0 ? (
                  <>
                    {data.map((item, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{item.Center}</CTableDataCell>
                        <CTableDataCell>{item.Product}</CTableDataCell>
                        <CTableDataCell>{item.TotalQuantity}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="2">Total</CTableDataCell>
                      <CTableDataCell>{totals.TotalQuantity.toFixed(2)}</CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="3" className="text-center">No data found</CTableDataCell>
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

export default UsageSummary;
