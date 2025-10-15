import '../../../css/table.css';
import '../../../css/form.css';
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
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts';
import SearchCustomerModel from './SearchCustomerModel';
import Pagination from 'src/utils/Pagination';

const TaxList = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  const fetchCustomers = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
  
      if (searchParams.keyword) params.append('search', searchParams.keyword);
      if (searchParams.center) params.append('center', searchParams.center);
  
      params.append('page', page);
  
      const url = params.toString() ? `/customers?${params.toString()}` : '/customers';
      const response = await axiosInstance.get(url);
  
      if (response.data.success) {
        setCustomers(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.message);
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
    fetchCustomers();
    fetchCenters();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchCustomers(activeSearch, page);
  };
  

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
    fetchCustomers(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '' });
    setSearchTerm('');
    fetchCustomers({}, 1); 
  };
  
  const handleUsernameClick = (customerId) => {
    navigate(`/customer-profile/${customerId}`);
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center) {
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

  const handleDeleteCustomer = async (customerId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/customers/${customerId}`);
        setCustomers((prev) => prev.filter((c) => c._id !== customerId));
        showSuccess('Customer deleted successfully!');
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };
  
  const handleEditCustomer = (customerId) => {
    navigate(`/edit-customer/${customerId}`)
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
        Error loading customers: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Customer List </div>
    
      <SearchCustomerModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <Link to='/add-customer'>
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Add
              </CButton>
            </Link>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.keyword || activeSearch.center) && (
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
   
          
          <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />

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
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
          <CTable striped bordered hover responsive className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" onClick={() => handleSort('username')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>User Name</span>
                    {getSortIcon('username')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('name')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Name</span>
                    {getSortIcon('name')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Center</span>
                    {getSortIcon('center.centerName')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.partner.partnerName')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Partner</span>
                    {getSortIcon('center.partner.partnerName')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.area.areaName')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Area</span>
                    {getSortIcon('center.area.areaName')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('mobile')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Mobile</span>
                    {getSortIcon('mobile')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('email')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Email</span>
                    {getSortIcon('email')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('city')} className="sortable-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>City</span>
                    {getSortIcon('city')}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <CTableRow key={customer._id}>
                    <CTableDataCell>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleUsernameClick(customer._id)}
                        style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                      >
                        {customer.username}
                      </button>
                    </CTableDataCell>
                    <CTableDataCell>{customer.name}</CTableDataCell>
                    <CTableDataCell>{customer.center?.centerName || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{customer.center?.partner?.partnerName || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{customer.center?.area?.areaName || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{customer.mobile}</CTableDataCell>
                    <CTableDataCell>{customer.email}</CTableDataCell>
                    <CTableDataCell>{customer.city}</CTableDataCell>
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
                              onClick={() => handleEditCustomer(customer._id)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleDeleteCustomer(customer._id)}
                            >
                              <CIcon icon={cilTrash} className="me-2" /> Delete
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
                    No customers found
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

export default TaxList;