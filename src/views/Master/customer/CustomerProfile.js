import React, { useState, useEffect, useRef } from 'react';
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilSettings } from '@coreui/icons';
import { confirmAction, showError, showSuccess } from 'src/utils/sweetAlerts';
import CustomerSerialNumber from './CustomerSerialNumber';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('device');

  const [deviceData, setDeviceData] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [shiftingData, setShiftingData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});

  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
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

  const handleOpenSerialModal = (product) => {
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/customers/${id}`);
        
        if (response.data.success) {
          setCustomer(response.data.data);
          fetchDeviceData();
        } else {
          throw new Error('Failed to fetch customer data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching customer:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchDeviceData = async () => {
    try {
      setLoadingTabs(prev => ({ ...prev, device: true }));
      const response = await axiosInstance.get(`/stockusage/customer/${id}/devices`);
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
      const response = await axiosInstance.get(`/stockusage/customer/${id}`);
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
      const response = await axiosInstance.get(`/shiftingRequest/customer/${id}/requests`);
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
        dataToSort = [...deviceData];
        setDataFunction = setDeviceData;
        break;
      case 'usage':
        dataToSort = [...usageData];
        setDataFunction = setUsageData;
        break;
      case 'shifting':
        dataToSort = [...shiftingData];
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



  const handleDamageReturn = async (usageId) => {
    try {
      const html = `Are you sure you want to mark this device as Damage?<br><br>`;
      
      const result = await confirmAction(
        'Are you sure to damage?',
        html,
        'warning',
        'Yes,Damage it!'
      );
  
      if (result.isConfirmed) {
        const response = await axiosInstance.patch(
          `/stockusage/damage/${usageId}/damage-return`,
          {
            remark: "Product marked as damaged - returned from customer"
          }
        );
  
        if (response.data.success) {
          showSuccess('Device has been marked as Damage Return successfully');
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
          <CTableHeaderCell scope="col" onClick={() => handleSort('Connection Type', 'device')} className="sortable-header">
            Connection Type {getSortIcon('Connection Type', 'device')}
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" onClick={() => handleSort('Package Amount', 'device')} className="sortable-header">
            Package Amount {getSortIcon('Package Amount', 'device')}
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" onClick={() => handleSort('Package Duration', 'device')} className="sortable-header">
            Package Duration {getSortIcon('Package Duration', 'device')}
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" onClick={() => handleSort('ONU Charges', 'device')} className="sortable-header">
            ONU Charges {getSortIcon('ONU Charges', 'device')}
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" onClick={() => handleSort('Installation Charges', 'device')} className="sortable-header">
            Installation Charges {getSortIcon('Installation Charges', 'device')}
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" onClick={() => handleSort('Remark', 'device')} className="sortable-header">
            Remark {getSortIcon('Remark', 'device')}
          </CTableHeaderCell>
          <CTableDataCell scope="col" className="sortable-header">Action</CTableDataCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {loadingTabs.device ? (
          <CTableRow>
            <CTableDataCell colSpan="11" className="text-center">
              <CSpinner size="sm" /> Loading device data...
            </CTableDataCell>
          </CTableRow>
        ) : deviceData.length > 0 ? (
          deviceData.map((item, index) => (
            <CTableRow key={item._id || index} className={item.type === 'Damage' ? 'damage-prouct' : 'use-product'}>
              <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item['Serial No.'] || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item.Type || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item['Connection Type'] || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item['Package Amount'] || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item['Package Duration'] || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item['ONU Charges'] || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item['Installation Charges'] || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item.Remark || 'N/A'}</CTableDataCell>
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
                                setSelectedProduct({
                                  productId: item.productId,
                                  productName: item.Product,
                                  warehouseId: item.center?.id,
                                });
                                setSerialModalVisible(true);
                              }}
                            >
                              <i className="fa fa-refresh"></i> Replace
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleDamageReturn(item.usageId,
)}
                            >
                              <i className="fa fa-recycle fa-margin "></i> Damage
                            </button>
                          </div>
                        )}
                      </div>
                    </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="11" className="text-center">
              No device data found
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  </div>
   <br></br>
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
          ) : usageData.length > 0 ? (
            usageData.map((item, index) => (
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
                No usage data found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  // Render Shifting Tab Table
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
            <CTableHeaderCell scope="col" onClick={() => handleSort('Status Detail', 'shifting')} className="sortable-header">
              Status Detail {getSortIcon('Status Detail', 'shifting')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Old Address', 'shifting')} className="sortable-header">
              Old Address {getSortIcon('Old Address', 'shifting')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Current Address', 'shifting')} className="sortable-header">
              Current Address {getSortIcon('Current Address', 'shifting')}
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingTabs.shifting ? (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center">
                <CSpinner size="sm" /> Loading shifting data...
              </CTableDataCell>
            </CTableRow>
          ) : shiftingData.length > 0 ? (
            shiftingData.map((item) => (
              <CTableRow key={item._id}>
                <CTableDataCell>{item['Center To'] || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.Date || 'N/A'}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
                <CTableDataCell>{item['Status Detail'] || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item['Old Address'] || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item['Current Address'] || 'N/A'}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center">
                No shifting data found
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
        Error loading customer profile: {error}
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="alert alert-warning" role="alert">
        Customer not found
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/edit-customer/${id}`);
  };

  const handleBack = () => {
    navigate('/customers-list');
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
          <h1 className="title">{customer.username}</h1>
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
          Customer Details
        </div>
        <CCardBody className="profile-body p-0">
          <table className="customer-details-table">
            <tbody>
              <tr className="table-row">
                <td className="label-cell">Name:</td>
                <td className="value-cell">{customer.name || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Mobile:</td>
                <td className="value-cell">{customer.mobile || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Email:</td>
                <td className="value-cell">{customer.email || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Center:</td>
                <td className="value-cell">{customer.center?.centerName || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Address:</td>
                <td className="value-cell">
                  {[customer.address1, customer.address2, customer.city, customer.state]
                    .filter(Boolean)
                    .join(' ') || 'N/A'}
                </td>
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
  onClose={() => setSerialModalVisible(false)}
  productId={selectedProduct?.productId}
  productName={selectedProduct?.productName}
  warehouseId={selectedProduct?.warehouseId}
/>

    </CContainer>
  );
};

export default CustomerProfile;