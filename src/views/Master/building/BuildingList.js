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
import SearchBuildingModel from './SearchBuildingModel';
import Pagination from 'src/utils/Pagination';
import usePermission from 'src/utils/usePermission';

const BuildingList = () => {
  const [buildings, setBuildings] = useState([]);
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
  const { hasAnyPermission } = usePermission();
  const dropdownRefs = useRef({});
  const navigate = useNavigate();

 const fetchBuildings = async (searchParams = {},  page = 1) => {
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
    const url = params.toString() ? `/buildings?${params.toString()}` : '/buildings';
    const response = await axiosInstance.get(url);

    if (response.data.success) {
      setBuildings(response.data.data);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
    } else {
      throw new Error('API returned unsuccessful response');
    }
  } catch (err) {
    setError(err.message);
    console.error('Error fetching buildings:', err);
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
    fetchCenters();
    fetchBuildings();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchBuildings(activeSearch, page);
  };
  
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedBuildings = [...buildings].sort((a, b) => {
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

    setBuildings(sortedBuildings);
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
    fetchBuildings(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '' });
    setSearchTerm('');
    fetchBuildings({},1);
  };

  const filteredBuildings = buildings.filter(building =>
    Object.values(building).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handleDeletebuilding = async (buildingId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/buildings/${buildingId}`);
        setBuildings((prev) => prev.filter((c) => c._id !== buildingId));
  
        showSuccess('building deleted successfully!');
      } catch (error) {
        console.error('Error deleting building:', error);
        // showError(error);
      }
    }
  };
  
  const handleEditbuilding = (buildingId) => {
     navigate(`/edit-building/${buildingId}`)
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
        Error loading buildings: {error}
      </div>
    );
  }
  const handleClick = (buildingId) => {
    navigate(`/building-profile/${buildingId}`);
  }
  return (
    <div>
      <div className='title'>Building List </div>
      <SearchBuildingModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
          {hasAnyPermission('Settings', ['manage_building_all_center','manage_building_own_center']) && (
            <Link to='/add-building'>
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Add
              </CButton>
            </Link>
          )}
            <CButton size="sm" className="action-btn me-1" onClick={() => setSearchModalVisible(true)}>
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.keyword || activeSearch.center) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
                 <CIcon icon={cilZoomOut} className='icon' />Reset Search
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
                <CTableHeaderCell scope="col" onClick={() => handleSort('buildingName')} className="sortable-header">
                  Building {getSortIcon('buildingName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('name')} className="sortable-header">
                 Address {getSortIcon('address1')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                  Branch {getSortIcon('center.centerName')}
                </CTableHeaderCell>
            
                <CTableHeaderCell scope="col">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredBuildings.length > 0 ? (
                filteredBuildings.map((building) => (
                  <CTableRow key={building._id}>
                    <CTableDataCell>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleClick(building._id)}
                        style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                      >
                        {building.buildingName}
                      </button>
                      </CTableDataCell>
                    <CTableDataCell>{building.address1}</CTableDataCell>
                    <CTableDataCell>{building.center?.centerName || ''}</CTableDataCell>
                    <CTableDataCell>
                    {hasAnyPermission('Settings', ['manage_building_all_center','manage_building_own_center']) && (
                      <div className="dropdown-container" ref={el => dropdownRefs.current[building._id] = el}>
                        <CButton 
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => toggleDropdown(building._id)}
                        >
                          <CIcon icon={cilSettings} /> Options
                        </CButton>
                        {dropdownOpen[building._id] && (
                          <div className="dropdown-menu show">
                            <button 
                              className="dropdown-item"
                              onClick={() => handleEditbuilding(building._id)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleDeletebuilding(building._id)}
                            >
                              <CIcon icon={cilTrash} className="me-2" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center">
                    No buildings found
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

export default BuildingList;



// import React from 'react';
// import axiosInstance from 'src/axiosInstance';
// import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts';
// import SearchBuildingModel from './SearchBuildingModel';
// import { useNavigate } from 'react-router-dom';
// import ReusableTable from 'src/views/common/ReusableTable';
// const BuildingList = () => {
//   const navigate = useNavigate();
//   const fetchBuildings = async (searchParams = {}, page = 1) => {
//     const params = new URLSearchParams(searchParams);
//     params.append('page', page);
//     const response = await axiosInstance.get(`/buildings?${params.toString()}`);
//     return { data: response.data.data, pagination: response.data.pagination };
//   };

//   const fetchCenters = async () => {
//     const res = await axiosInstance.get('/centers');
//     return res.data.data;
//   };

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       await axiosInstance.delete(`/buildings/${id}`);
//       showSuccess('Building deleted successfully!');
//     }
//   };

//   return (
//     <ReusableTable
//       title="Building List"
//       fetchData={fetchBuildings}
//       fetchCenters={fetchCenters}
//       addLink="/add-building"
//       searchComponent={SearchBuildingModel}
//       onEdit={(id) => navigate(`/edit-building/${id}`)}
//       onDelete={handleDelete}
//       columns={[
//         { key: 'buildingName', label: 'Building', sortable: true },
//         { key: 'address1', label: 'Address', sortable: true },
//         { key: 'center.centerName', label: 'Center', sortable: true },
//       ]}
//     />
//   );
// };
// export default BuildingList;
