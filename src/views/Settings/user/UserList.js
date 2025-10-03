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
import SearchUserModel from './SearchUserModel';
import Pagination from 'src/utils/Pagination';

const UserList = () => {
  const [data, setData] = useState([]);
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

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      params.append('page', page);
      const url = params.toString() ? `/auth?${params.toString()}` : '/auth';
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data.users);
        setCurrentPage(response.data.data.pagination.currentPage);
        setTotalPages(response.data.data.pagination.totalPages);
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
    fetchData(searchData,1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '' });
    setSearchTerm('');
    fetchData({},1);
  };

  const filteredData = data.filter(item => {
    if (activeSearch.keyword || activeSearch.center) {
      return true;
    }
    return Object.values(item).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const handleDeleteUser = async (itemId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/auth/${itemId}`);
        setData((prev) => prev.filter((c) => c._id !== itemId));
        showSuccess('Data deleted successfully!');
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };
  
  const handleEditData = (itemId) => {
    navigate(`/edit-user/${itemId}`)
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
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>User List</div>
    
      <SearchUserModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <Link to='/add-user'>
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
                <CTableHeaderCell scope="col" onClick={() => handleSort('fullName')} className="sortable-header">
                 Name {getSortIcon('fullName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('name')} className="sortable-header">
                 Role {getSortIcon('role.roleTitle')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                  Center {getSortIcon('center.centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('email')} className="sortable-header">
                  Email {getSortIcon('email')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('mobile')} className="sortable-header">
                  Mobile {getSortIcon('mobile')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>{item.fullName}</CTableDataCell>
                    <CTableDataCell>{item.role?.roleTitle || ''}</CTableDataCell>
                    <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                         <a 
                          href={`mailto:${item.email}`} 
                          className="btn btn-link p-0 text-decoration-none"
                          style={{color:'#337ab7'}}
                          >
                                  {item.email}
                          </a>
                      </CTableDataCell>
                    <CTableDataCell>
                          <a
                            href={`tel:${item.mobile}`} 
                            className="btn btn-link p-0 text-decoration-none"
                            style={{color:'#337ab7'}}
                          >
                                {item.mobile}
                          </a>
                    </CTableDataCell>
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
                              onClick={() => handleEditData(item._id)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleDeleteUser(item._id)}
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

export default UserList;

