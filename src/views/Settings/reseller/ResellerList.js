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
import { cilArrowTop, cilArrowBottom, cilPlus, cilSettings, cilPencil, cilTrash} from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { confirmDelete, showError, showSuccess } from 'src/utils/sweetAlerts';
import Pagination from 'src/utils/Pagination';

const ResellerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dropdownRefs = useRef({});

 const navigate = useNavigate();

    const fetchData= async (searchParams = {}, page=1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchParams.keyword) {
          params.append('search', searchParams.keyword);
        }
        params.append('page', page);
        const url = params.toString() ? `/resellers?${params.toString()}` : '/resellers';
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

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
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

  const filteredCustomers = customers.filter(customer =>
    Object.values(customer).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handleDeleteVendor = async (vendorId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/resellers/${vendorId}`);
        setCustomers((prev) => prev.filter((c) => c._id !== vendorId));
  
        showSuccess('Data deleted successfully!');
      } catch (error) {
        console.error('Error deleting data:', error);
        showError(error);
      }
    }
  };
  
  const handleEditVendor = (vendorId) => {
     navigate(`/update-reseller/${vendorId}`)
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
        Error loading vendor: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Reseller List </div>
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <Link to='/add-reseller'>
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Add
              </CButton>
            </Link>
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
          <CTable striped bordered hover responsive className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" onClick={() => handleSort('centerName')} className="sortable-header">
                  Business Name {getSortIcon('centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('centerCode')} className="sortable-header">
                Contact {getSortIcon('centerCode')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerType')} className="sortable-header">
                  Name {getSortIcon('center.centerType')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('mobile')} className="sortable-header">
                  Mobile {getSortIcon('mobile')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('email')} className="sortable-header">
                  Email {getSortIcon('email')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('city')} className="sortable-header">
                  City {getSortIcon('city')}
                </CTableHeaderCell>
                
    
                <CTableHeaderCell scope="col">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((vendor) => (
                  <CTableRow key={vendor._id}>
                    <CTableDataCell>{vendor.businessName}</CTableDataCell>
                    <CTableDataCell>{vendor.contactNumber}</CTableDataCell>
                    <CTableDataCell>{vendor.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{vendor.mobile}</CTableDataCell>
                    <CTableDataCell>{vendor.email}</CTableDataCell>
                    <CTableDataCell>{vendor.city}</CTableDataCell>
                    <CTableDataCell>
                      <div className="dropdown-container" ref={el => dropdownRefs.current[vendor._id] = el}>
                        <CButton 
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => toggleDropdown(vendor._id)}
                        >
                          <CIcon icon={cilSettings} /> Options
                        </CButton>
                        {dropdownOpen[vendor._id] && (
                          <div className="dropdown-menu show">
                            <button 
                              className="dropdown-item"
                              onClick={() => handleEditVendor(vendor._id)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleDeleteVendor(vendor._id)}
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
                    No vendor found
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

export default ResellerList;