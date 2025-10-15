import '../../css/table.css';
import '../../css/profile.css';
import '../../css/form.css';
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
  CSpinner,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilSettings, cilZoomOut, cilTrash, cilPencil } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import SearchShiftingModel from './SearchShiftingModel';
import { formatDate } from 'src/utils/FormatDateTime';
import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts';
import Pagination from 'src/utils/Pagination';
import usePermission from 'src/utils/usePermission';

const ShiftinRequestList = () => {
  const [buildings, setBuildings] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const userCenter = loggedInUser.center ? loggedInUser.center._id : null;

  const { hasAnyPermission } = usePermission(); 

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchParams.keyword) params.append('search', searchParams.keyword);
      if (searchParams.center) params.append('center', searchParams.center);
      params.append('page', page);
      const url = params.toString() ? `/shiftingRequest?${params.toString()}` : '/shiftingRequest';
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
      if (response.data.success) setCenters(response.data.data);
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  useEffect(() => {
    fetchCenters();
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

    const sortedBuildings = [...buildings].sort((a, b) => {
      let aValue = a, bValue = b;
      if (key.includes('.')) {
        const keys = key.split('.');
        aValue = keys.reduce((obj, k) => obj && obj[k], a);
        bValue = keys.reduce((obj, k) => obj && obj[k], b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setBuildings(sortedBuildings);
  };

  const getSortIcon = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === 'ascending'
        ? <CIcon icon={cilArrowTop} className="ms-1" />
        : <CIcon icon={cilArrowBottom} className="ms-1" />
      : null;

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '' });
    setSearchTerm('');
    fetchData({}, 1);
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

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({ ...prev, [id]: !prev[id] }));
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleStatusChange = async (id, status) => {
    try {
      const response = await axiosInstance.put(`/shiftingRequest/${id}/status`, { status });
      if (response.data.success) {
        setAlert({
          visible: true,
          type: 'success',
          message: `Request ${status === 'Approve' ? 'approved' : 'rejected'} successfully.`,
        });
        fetchData();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setAlert({
        visible: true,
        type: 'danger',
        message: err.response?.data?.message || 'Error updating status',
      });
    } finally {
      setTimeout(() => setAlert({ visible: false, type: '', message: '' }), 3000);
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
    return (
      <div className="alert alert-danger" role="alert">
        Error loading shifting requests: {error}
      </div>
    );
  }

    const canEditDelete = (building) => {
      return userCenter && building.fromCenter && building.fromCenter._id === userCenter;
    };
  
    const canApproveReject = (building) => {
      return userCenter && building.toCenter && building.toCenter._id === userCenter;
    };
  
    const shouldShowActions = (building) => {
      return building.status === 'Pending' && (canEditDelete(building) || canApproveReject(building));
    };

    const handleDelete = async (itemId) => {
      const result = await confirmDelete();
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/shiftingRequest/${itemId}`);
          setBuildings((prev) => prev.filter((c) => c._id !== itemId));
          showSuccess('Data deleted successfully!');
        } catch (error) {
          console.error('Error deleting data:', error);
        }
      }
    };
    
    const handleEdit = (itemId) => {
      navigate(`/edit-shiftingRequest/${itemId}`)
    };
  return (
    <div>
      <div className='title'>Shifting Request List</div>
      {alert.visible && (
        <CAlert color={alert.type} dismissible onClose={() => setAlert({ visible: false })}>
          {alert.message}
        </CAlert>
      )}

      <SearchShiftingModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>

          {hasAnyPermission('Shifting', ['manage_shifting_all_center','manage_shifting_own_center']) && (
            <Link to='/add-shiftingRequest'>
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon' /> Add
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
                <CIcon icon={cilZoomOut} className='icon' /> Reset Search
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
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
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
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>From Center</CTableHeaderCell>
                  <CTableHeaderCell>To Center</CTableHeaderCell>
                  <CTableHeaderCell>Remark</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Status Detail</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredBuildings.length > 0 ? (
                  filteredBuildings.map((building) => (
                    <CTableRow key={building._id} className={building.status === 'Pending' ? 'selected-row' : ''}>
                      <CTableDataCell>{building.customer?.name}</CTableDataCell>
                      <CTableDataCell>{building.fromCenter?.centerName}</CTableDataCell>
                      <CTableDataCell>{building.toCenter?.centerName || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{building.remark}</CTableDataCell>
                      <CTableDataCell> {building.status && (
                    <span className={`status-badge ${building.status.toLowerCase()}`}>
                      {building.status}
                    </span>
                  )}</CTableDataCell>
                      <CTableDataCell>
                        {building.status === 'Approve' && building.approvedBy
                          ? `Approve At ${formatDate(building.approvedAt)} by ${building.approvedBy.fullName}`
                          : building.status === 'Reject' && building.rejectedBy
                          ? `Rejecte At ${formatDate(building.rejectedAt)} by ${building.rejectedBy.fullName}`
                          : ' '}
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(building.date)}</CTableDataCell>

<CTableDataCell>
  {building.status === 'Pending' && (
             <div className="dropdown-container" ref={el => dropdownRefs.current[building._id] = el}>
             <CButton
               size="sm"
               className='option-button btn-sm'
               onClick={() => toggleDropdown(building._id)}
               disabled={!shouldShowActions(building)}
             >
               <CIcon icon={cilSettings} /> Options
             </CButton>
             {dropdownOpen[building._id] && shouldShowActions(building) && (
               <div className="dropdown-menu show">
                 {canEditDelete(building) && hasAnyPermission('Shifting', ['manage_shifting_all_center','manage_shifting_own_center']) && (
                   <>
                     <button 
                                       className="dropdown-item"
                                       onClick={() => handleEdit(building._id)}
                                     >
                                       <CIcon icon={cilPencil} className="me-2" /> Edit
                                     </button>
                                     <button 
                                       className="dropdown-item"
                                       onClick={() => handleDelete(building._id)}
                                     >
                                       <CIcon icon={cilTrash} className="me-2" /> Delete
                                     </button>
                   </>
                 )}
                 {canApproveReject(building) && hasAnyPermission('Shifting', ['accept_shifting_all_center','accept_shifting_own_center']) &&(
                   <>
                     <button
                       className="dropdown-item"
                       onClick={() => handleStatusChange(building._id, 'Approve')}
                     >
                       Approve
                     </button>
                     <button
                       className="dropdown-item"
                       onClick={() => handleStatusChange(building._id, 'Reject')}
                     >
                       Reject
                     </button>
                   </>
                 )}
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
                      No shifting requests found
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

export default ShiftinRequestList;
