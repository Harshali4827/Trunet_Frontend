// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../../css/profile.css';
// import '../../../css/table.css';
// import {
//   CCard,
//   CCardBody,
//   CButton,
//   CSpinner,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CTabContent,
//   CTabPane,
//   CContainer,
//   CTableDataCell,
//   CTableRow,
//   CTable,
//   CTableHead,
//   CTableHeaderCell,
//   CTableBody,
//   CBadge,
//   CFormInput,
//   CFormLabel
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowBottom, cilArrowTop } from '@coreui/icons';

// const ControlRoomProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('device');

//   const [deviceData, setDeviceData] = useState([]);
//   const [usageData, setUsageData] = useState([]);
//   const [shiftingData, setShiftingData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingTabs, setLoadingTabs] = useState({
//     device: false,
//     usage: false,
//     shifting: false
//   });

//   const [sortConfig, setSortConfig] = useState({ 
//     key: null, 
//     direction: 'ascending',
//     tab: 'device'
//   });

//   const filteredDeviceData = useMemo(() => {
//     if (!searchTerm) return deviceData;
//     return deviceData.filter(item => 
//       Object.values(item).some(value => 
//         value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [deviceData, searchTerm]);

//   const filteredUsageData = useMemo(() => {
//     if (!searchTerm) return usageData;
//     return usageData.filter(item => 
//       Object.values(item).some(value => 
//         value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [usageData, searchTerm]);

//   const filteredShiftingData = useMemo(() => {
//     if (!searchTerm) return shiftingData;
//     return shiftingData.filter(item => 
//       Object.values(item).some(value => 
//         value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [shiftingData, searchTerm]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(`/controlRooms/${id}`);
        
//         if (response.data.success) {
//           setData(response.data.data);
//           fetchDeviceData();
//         } else {
//           throw new Error('Failed to fetch data');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//      fetchData();
//     }
//   }, [id]);

//   const fetchDeviceData = async () => {
//     try {
//       setLoadingTabs(prev => ({ ...prev, device: true }));
//       const response = await axiosInstance.get(`/stockusage/control-room/${id}/devices`);
//       if (response.data.success) {
//         setDeviceData(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching device data:', err);
//       setDeviceData([]);
//     } finally {
//       setLoadingTabs(prev => ({ ...prev, device: false }));
//     }
//   };

//   const fetchUsageData = async () => {
//     try {
//       setLoadingTabs(prev => ({ ...prev, usage: true }));
//       const response = await axiosInstance.get(`/stockusage/control-room/${id}`);
//       if (response.data.success) {
//         setUsageData(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching usage data:', err);
//       setUsageData([]);
//     } finally {
//       setLoadingTabs(prev => ({ ...prev, usage: false }));
//     }
//   };

//   const fetchShiftingData = async () => {
//     try {
//       setLoadingTabs(prev => ({ ...prev, shifting: true }));
//       const response = await axiosInstance.get(`/shiftingRequest/controlRooms/${id}/requests`);
//       if (response.data.success) {
//         setShiftingData(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching shifting data:', err);
//       setShiftingData([]);
//     } finally {
//       setLoadingTabs(prev => ({ ...prev, shifting: false }));
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');

//     switch (tab) {
//       case 'device':
//         if (deviceData.length === 0) {
//           fetchDeviceData();
//         }
//         break;
//       case 'usage':
//         if (usageData.length === 0) {
//           fetchUsageData();
//         }
//         break;
//       case 'shifting':
//         if (shiftingData.length === 0) {
//           fetchShiftingData();
//         }
//         break;
//       default:
//         break;
//     }
//   };

//   const handleSort = (key, tab) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending' && sortConfig.tab === tab) {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction, tab });
  
//     let dataToSort = [];
//     let setDataFunction = null;
  
//     switch (tab) {
//       case 'device':
//         dataToSort = [...filteredDeviceData];
//         setDataFunction = setDeviceData;
//         break;
//       case 'usage':
//         dataToSort = [...filteredUsageData];
//         setDataFunction = setUsageData;
//         break;
//       case 'shifting':
//         dataToSort = [...filteredShiftingData];
//         setDataFunction = setShiftingData;
//         break;
//       default:
//         return;
//     }
  
//     const sortedData = dataToSort.sort((a, b) => {
//       let aValue = a;
//       let bValue = b;

//       if (key.includes(' ')) {
//         aValue = a[key];
//         bValue = b[key];
//       } else if (key.includes('.')) {
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
  
//     setDataFunction(sortedData);
//   };

//   const getSortIcon = (key, tab) => {
//     if (sortConfig.key !== key || sortConfig.tab !== tab) {
//       return null;
//     }
//     return sortConfig.direction === 'ascending'
//       ? <CIcon icon={cilArrowTop} className="ms-1" />
//       : <CIcon icon={cilArrowBottom} className="ms-1" />;
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       'Pending': 'warning',
//       'Approve': 'success',
//       'Rejected': 'danger',
//       'Completed': 'primary'
//     };
    
//     return (
//       <CBadge color={statusConfig[status] || 'secondary'}>
//         {status}
//       </CBadge>
//     );
//   };

//   const renderDeviceTable = () => (
//     <div>
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col" onClick={() => handleSort('Product', 'device')} className="sortable-header">
//                 Product {getSortIcon('Product', 'device')}
//               </CTableHeaderCell>
//               <CTableHeaderCell scope="col" onClick={() => handleSort('Serial No.', 'device')} className="sortable-header">
//                 Serial No {getSortIcon('Serial No.', 'device')}
//               </CTableHeaderCell>
//               <CTableHeaderCell scope="col" onClick={() => handleSort('Type', 'device')} className="sortable-header">
//                 Type {getSortIcon('Type', 'device')}
//               </CTableHeaderCell>
//               <CTableHeaderCell scope="col" onClick={() => handleSort('Date', 'device')} className="sortable-header">
//                 Date {getSortIcon('Date', 'device')}
//               </CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {loadingTabs.device ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="4" className="text-center">
//                   <CSpinner size="sm" /> Loading device data...
//                 </CTableDataCell>
//               </CTableRow>
//             ) : filteredDeviceData.length > 0 ? (
//               filteredDeviceData.map((item, index) => (
//                 <CTableRow key={item._id || index} className={item.type === 'Damage' ? 'damage-prouct' : 'use-product'}>
//                   <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item['Serial No.'] || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.Type || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
//                 </CTableRow>
//               ))
//             ) : (
//               <CTableRow>
//                 <CTableDataCell colSpan="4" className="text-center">
//                   {deviceData.length === 0 ? 'No device data found' : 'No matching devices found'}
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//       <br />
//       <span className='use_product'></span>&nbsp;Use Product
//       <span className='damage_product'></span>&nbsp;Damage Product
//     </div>
//   );

//   const renderUsageTable = () => (
//     <div className="responsive-table-wrapper">
//       <CTable striped bordered hover className='responsive-table'>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Date', 'usage')} className="sortable-header">
//               Date {getSortIcon('Date', 'usage')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Type', 'usage')} className="sortable-header">
//               Type {getSortIcon('Type', 'usage')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Center', 'usage')} className="sortable-header">
//               Center {getSortIcon('Center', 'usage')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Product', 'usage')} className="sortable-header">
//               Product {getSortIcon('Product', 'usage')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Old Stock', 'usage')} className="sortable-header">
//               Old Stock {getSortIcon('Old Stock', 'usage')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Qty', 'usage')} className="sortable-header">
//               Qty {getSortIcon('Qty', 'usage')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Damage Qty', 'usage')} className="sortable-header">
//               Damage Qty {getSortIcon('Damage Qty', 'usage')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('New Stock', 'usage')} className="sortable-header">
//               New Stock {getSortIcon('New Stock', 'usage')}
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {loadingTabs.usage ? (
//             <CTableRow>
//               <CTableDataCell colSpan="8" className="text-center">
//                 <CSpinner size="sm" /> Loading usage data...
//               </CTableDataCell>
//             </CTableRow>
//           ) : filteredUsageData.length > 0 ? (
//             filteredUsageData.map((item, index) => (
//               <CTableRow key={item._id || index}>
//                 <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{item.Type || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{item.Center || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{item['Old Stock'] || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{item.Qty || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{item['Damage Qty'] || 0}</CTableDataCell>
//                 <CTableDataCell>{item['New Stock'] || 'N/A'}</CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="8" className="text-center">
//                 {usageData.length === 0 ? 'No usage data found' : 'No matching usage records found'}
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );

//   const renderShiftingTable = () => (
//     <div className="responsive-table-wrapper">
//       <CTable striped bordered hover className='responsive-table'>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Center To', 'shifting')} className="sortable-header">
//               Center To {getSortIcon('Center To', 'shifting')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('Date', 'shifting')} className="sortable-header">
//               Date {getSortIcon('Date', 'shifting')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('status', 'shifting')} className="sortable-header">
//               Status {getSortIcon('status', 'shifting')}
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {loadingTabs.shifting ? (
//             <CTableRow>
//               <CTableDataCell colSpan="3" className="text-center">
//                 <CSpinner size="sm" /> Loading shifting data...
//               </CTableDataCell>
//             </CTableRow>
//           ) : filteredShiftingData.length > 0 ? (
//             filteredShiftingData.map((item) => (
//               <CTableRow key={item._id}>
//                 <CTableDataCell>{item['Center To'] || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
//                 <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="3" className="text-center">
//                 {shiftingData.length === 0 ? 'No shifting data found' : 'No matching shifting records found'}
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );

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

//   if (!data) {
//     return (
//       <div className="alert alert-warning" role="alert">
//         Building not found
//       </div>
//     );
//   }

//  const handleEdit = () => {
//     navigate(`/edit-controlRoom/${id}`);
//   };

//   const handleBack = () => {
//     navigate('/controlRoom-list');
//   };

//   return (
//     <CContainer fluid>
//       <div className="d-flex justify-content-between align-items-center mb-4">
      
//         <div className="title-container">
//         <CButton
//           size="sm"
//           className="back-button me-3"
//           onClick={handleBack}
//         >
//           <i className="fa fa-fw fa-arrow-left"></i>Back
//         </CButton>
//           <h1 className="title">{data.buildingName}</h1>
//           <CButton 
//             size="sm" 
//             className="edit-icon-btn"
//             onClick={handleEdit}
//           >
//             <i className="fa fa-fw fa-edit"></i>
//           </CButton>
//         </div>
//       </div>

//       <CCard className="profile-card">
//         <div className='subtitle'>
//            Control Room Details
//         </div>
//         <CCardBody className="profile-body p-0">
//           <table className="customer-details-table">
//             <tbody>
//               <tr className="table-row">
//                 <td className="label-cell">Name:</td>
//                 <td className="value-cell">{data.buildingName || 'N/A'}</td>
//               </tr>
//               <tr className="table-row">
//                 <td className="label-cell">Address:</td>
//                 <td className="value-cell">{data.address1 || 'N/A'}</td>
//               </tr>
//               <tr className="table-row">
//                 <td className="label-cell">Center:</td>
//                 <td className="value-cell">{data.center?.centerName || 'N/A'}</td>
//               </tr>
//             </tbody>
//           </table>
//         </CCardBody>
//       </CCard>
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'device'}
//                 onClick={() => handleTabChange('device')}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'device' ? '4px solid #2759a2' : '3px solid transparent',
//                   color:'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                 Device
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'usage'}
//                 onClick={() => handleTabChange('usage')}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'usage' ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color:'black'
//                 }}
//               >
//                 Usage
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'shifting'}
//                 onClick={() => handleTabChange('shifting')}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'shifting' ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color:'black'
//                 }}
//               >
//                 Shifting
//               </CNavLink>
//             </CNavItem>
//           </CNav>
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
//           <CTabContent>
//             <CTabPane visible={activeTab === 'device'}>
//               {renderDeviceTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 'usage'}>
//               {renderUsageTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 'shifting'}>
//               {renderShiftingTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </CContainer>
//   );
// };

// export default ControlRoomProfile;




import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/profile.css';
import '../../../css/table.css';
import {
  CCard,
  CCardBody,
  CButton,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CContainer,
  CTableDataCell,
  CTableRow,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CBadge,
  CFormInput,
  CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilSettings } from '@coreui/icons';
import { confirmAction, showError, showSuccess } from 'src/utils/sweetAlerts';
import CustomerSerialNumber from '../customer/CustomerSerialNumber';

const ControlRoomProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('device');

  const [deviceData, setDeviceData] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [shiftingData, setShiftingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});

  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  const [loadingTabs, setLoadingTabs] = useState({
    device: false,
    usage: false,
    shifting: false
  });

  const [sortConfig, setSortConfig] = useState({ 
    key: null, 
    direction: 'ascending',
    tab: 'device'
  });

  const dropdownRefs = useRef({});

  const filteredDeviceData = useMemo(() => {
    if (!searchTerm) return deviceData;
    return deviceData.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [deviceData, searchTerm]);

  const filteredUsageData = useMemo(() => {
    if (!searchTerm) return usageData;
    return usageData.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [usageData, searchTerm]);

  const filteredShiftingData = useMemo(() => {
    if (!searchTerm) return shiftingData;
    return shiftingData.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [shiftingData, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/controlRooms/${id}`);
        
        if (response.data.success) {
          setData(response.data.data);
          fetchDeviceData();
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
     fetchData();
    }
  }, [id]);

  const fetchDeviceData = async () => {
    try {
      setLoadingTabs(prev => ({ ...prev, device: true }));
      const response = await axiosInstance.get(`/stockusage/control-room/${id}/devices`);
      if (response.data.success) {
        setDeviceData(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching device data:', err);
      setDeviceData([]);
    } finally {
      setLoadingTabs(prev => ({ ...prev, device: false }));
    }
  };

  const fetchUsageData = async () => {
    try {
      setLoadingTabs(prev => ({ ...prev, usage: true }));
      const response = await axiosInstance.get(`/stockusage/control-room/${id}`);
      if (response.data.success) {
        setUsageData(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setUsageData([]);
    } finally {
      setLoadingTabs(prev => ({ ...prev, usage: false }));
    }
  };

  const fetchShiftingData = async () => {
    try {
      setLoadingTabs(prev => ({ ...prev, shifting: true }));
      const response = await axiosInstance.get(`/shiftingRequest/controlRooms/${id}/requests`);
      if (response.data.success) {
        setShiftingData(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching shifting data:', err);
      setShiftingData([]);
    } finally {
      setLoadingTabs(prev => ({ ...prev, shifting: false }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');

    switch (tab) {
      case 'device':
        if (deviceData.length === 0) {
          fetchDeviceData();
        }
        break;
      case 'usage':
        if (usageData.length === 0) {
          fetchUsageData();
        }
        break;
      case 'shifting':
        if (shiftingData.length === 0) {
          fetchShiftingData();
        }
        break;
      default:
        break;
    }
  };

  const handleSort = (key, tab) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending' && sortConfig.tab === tab) {
      direction = 'descending';
    }
    setSortConfig({ key, direction, tab });
  
    let dataToSort = [];
    let setDataFunction = null;
  
    switch (tab) {
      case 'device':
        dataToSort = [...filteredDeviceData];
        setDataFunction = setDeviceData;
        break;
      case 'usage':
        dataToSort = [...filteredUsageData];
        setDataFunction = setUsageData;
        break;
      case 'shifting':
        dataToSort = [...filteredShiftingData];
        setDataFunction = setShiftingData;
        break;
      default:
        return;
    }
  
    const sortedData = dataToSort.sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(' ')) {
        aValue = a[key];
        bValue = b[key];
      } else if (key.includes('.')) {
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
  
    setDataFunction(sortedData);
  };

  const getSortIcon = (key, tab) => {
    if (sortConfig.key !== key || sortConfig.tab !== tab) {
      return null;
    }
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'warning',
      'Approve': 'success',
      'Rejected': 'danger',
      'Completed': 'primary'
    };
    
    return (
      <CBadge color={statusConfig[status] || 'secondary'}>
        {status}
      </CBadge>
    );
  };

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

  const handleDamageReturn = async (usageId, serialNumber) => {
    try {
      const html = `Are you sure you want to mark serial number <strong>${serialNumber}</strong> as Damage?<br><br>`;
      
      const result = await confirmAction(
        'Are you sure to damage?',
        html,
        'warning',
        'Yes,Damage it!'
      );
  
      if (result.isConfirmed) {
        const response = await axiosInstance.post(
          `/damage/damage-returns`,
          {
            usageId: usageId,
            serialNumber: serialNumber,
            remark: "Product marked as damaged - returned from control room"
          }
        );
  
        if (response.data.success) {
          showSuccess(`Serial number ${serialNumber} has been marked as Damage Return successfully`);
          fetchDeviceData();
        } else {
          throw new Error(response.data.message || 'Failed to mark as Damage Return');
        }
      }
    } catch (error) {
      console.error('Error in damage return:', error);
      showError(error);
    }
  };

  const renderDeviceTable = () => (
    <div>
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col" onClick={() => handleSort('Product', 'device')} className="sortable-header">
                Product {getSortIcon('Product', 'device')}
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('Serial No.', 'device')} className="sortable-header">
                Serial No {getSortIcon('Serial No.', 'device')}
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('Type', 'device')} className="sortable-header">
                Type {getSortIcon('Type', 'device')}
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('Date', 'device')} className="sortable-header">
                Date {getSortIcon('Date', 'device')}
              </CTableHeaderCell>
              <CTableDataCell scope="col" className="sortable-header">Action</CTableDataCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loadingTabs.device ? (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  <CSpinner size="sm" /> Loading device data...
                </CTableDataCell>
              </CTableRow>
            ) : filteredDeviceData.length > 0 ? (
              filteredDeviceData.map((item, index) => (
                <CTableRow key={item._id || index} className={item.type === 'Damage' ? 'damage-prouct' : 'use-product'}>
                  <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item['Serial No.'] || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.Type || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
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
                          <button 
                            className="dropdown-item"
                          >
                            <i className="fa fa-reply fa-margin "></i> Return
                          </button>

                          <button 
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedDevice({
                                productId: item.productId,
                                productName: item.Product,
                                usageId: item.usageId,
                                oldSerialNumber: item['Serial No.']
                              });
                              setSerialModalVisible(true);
                            }}
                          >
                            <i className="fa fa-refresh"></i> Replace
                          </button>

                          <button 
                            className="dropdown-item"
                            onClick={() => handleDamageReturn(item.usageId, item['Serial No.'])}
                          >
                            <i className="fa fa-recycle fa-margin"></i> Damage
                          </button>
                        </div>
                      )}
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  {deviceData.length === 0 ? 'No device data found' : 'No matching devices found'}
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
      <br />
      <span className='use_product'></span>&nbsp;Use Product
      <span className='damage_product'></span>&nbsp;Damage Product
    </div>
  );

  const renderUsageTable = () => (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Date', 'usage')} className="sortable-header">
              Date {getSortIcon('Date', 'usage')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Type', 'usage')} className="sortable-header">
              Type {getSortIcon('Type', 'usage')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Center', 'usage')} className="sortable-header">
              Center {getSortIcon('Center', 'usage')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Product', 'usage')} className="sortable-header">
              Product {getSortIcon('Product', 'usage')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Old Stock', 'usage')} className="sortable-header">
              Old Stock {getSortIcon('Old Stock', 'usage')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Qty', 'usage')} className="sortable-header">
              Qty {getSortIcon('Qty', 'usage')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Damage Qty', 'usage')} className="sortable-header">
              Damage Qty {getSortIcon('Damage Qty', 'usage')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('New Stock', 'usage')} className="sortable-header">
              New Stock {getSortIcon('New Stock', 'usage')}
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingTabs.usage ? (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                <CSpinner size="sm" /> Loading usage data...
              </CTableDataCell>
            </CTableRow>
          ) : filteredUsageData.length > 0 ? (
            filteredUsageData.map((item, index) => (
              <CTableRow key={item._id || index}>
                <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.Type || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.Center || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item['Old Stock'] || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.Qty || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item['Damage Qty'] || 0}</CTableDataCell>
                <CTableDataCell>{item['New Stock'] || 'N/A'}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                {usageData.length === 0 ? 'No usage data found' : 'No matching usage records found'}
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  const renderShiftingTable = () => (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Center To', 'shifting')} className="sortable-header">
              Center To {getSortIcon('Center To', 'shifting')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Date', 'shifting')} className="sortable-header">
              Date {getSortIcon('Date', 'shifting')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('status', 'shifting')} className="sortable-header">
              Status {getSortIcon('status', 'shifting')}
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingTabs.shifting ? (
            <CTableRow>
              <CTableDataCell colSpan="3" className="text-center">
                <CSpinner size="sm" /> Loading shifting data...
              </CTableDataCell>
            </CTableRow>
          ) : filteredShiftingData.length > 0 ? (
            filteredShiftingData.map((item) => (
              <CTableRow key={item._id}>
                <CTableDataCell>{item['Center To'] || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="3" className="text-center">
                {shiftingData.length === 0 ? 'No shifting data found' : 'No matching shifting records found'}
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

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

  if (!data) {
    return (
      <div className="alert alert-warning" role="alert">
        Control Room not found
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/edit-controlRoom/${id}`);
  };

  const handleBack = () => {
    navigate('/controlRoom-list');
  };

  return (
    <CContainer fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="title-container">
          <CButton
            size="sm"
            className="back-button me-3"
            onClick={handleBack}
          >
            <i className="fa fa-fw fa-arrow-left"></i>Back
          </CButton>
          <h1 className="title">{data.buildingName}</h1>
          <CButton 
            size="sm" 
            className="edit-icon-btn"
            onClick={handleEdit}
          >
            <i className="fa fa-fw fa-edit"></i>
          </CButton>
        </div>
      </div>

      <CCard className="profile-card">
        <div className='subtitle'>
           Control Room Details
        </div>
        <CCardBody className="profile-body p-0">
          <table className="customer-details-table">
            <tbody>
              <tr className="table-row">
                <td className="label-cell">Name:</td>
                <td className="value-cell">{data.buildingName || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Address:</td>
                <td className="value-cell">{data.address1 || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Center:</td>
                <td className="value-cell">{data.center?.centerName || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'device'}
                onClick={() => handleTabChange('device')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'device' ? '4px solid #2759a2' : '3px solid transparent',
                  color:'black',
                  borderBottom: 'none'
                }}
              >
                Device
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'usage'}
                onClick={() => handleTabChange('usage')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'usage' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color:'black'
                }}
              >
                Usage
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'shifting'}
                onClick={() => handleTabChange('shifting')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'shifting' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color:'black'
                }}
              >
                Shifting
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
              />
            </div>
          </div>
          <CTabContent>
            <CTabPane visible={activeTab === 'device'}>
              {renderDeviceTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'usage'}>
              {renderUsageTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'shifting'}>
              {renderShiftingTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      <CustomerSerialNumber
        visible={serialModalVisible}
        onClose={() => {
          setSerialModalVisible(false);
          setSelectedDevice(null);
        }}
        productId={selectedDevice?.productId}
        productName={selectedDevice?.productName}
        usageId={selectedDevice?.usageId}
        oldSerialNumber={selectedDevice?.oldSerialNumber}
        onReplaceSuccess={fetchDeviceData}
      />
    </CContainer>
  );
};

export default ControlRoomProfile;