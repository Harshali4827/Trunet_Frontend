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
  CPaginationItem,
  CPagination,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilArrowTop,
  cilArrowBottom,
  cilPlus,
  cilSettings,
  cilPencil,
  cilTrash
} from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts';
import AddArea from './AddArea';

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingArea,setEditingArea] = useState(null)
  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/areas');
        if (response.data.success) {
          setAreas(response.data.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching areas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...areas].sort((a, b) => {
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

      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setAreas(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const filteredData = areas.filter(partner =>
    Object.values(partner).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue =>
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handleDeletePartner = async (partnerId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/areas/${partnerId}`);
        setAreas((prev) => prev.filter((c) => c._id !== partnerId));
        showSuccess('Center deleted successfully!');
      } catch (error) {
        console.error('Error deleting center:', error);
      }
    }
  };
 
  const handleAreaAdded = async (newArea, isEdit) => {
    if (isEdit) {
      setAreas((prev) =>
        prev.map((p) => (p._id === newArea._id ? newArea : p))
      )
    } else {
      try {
        const response = await axiosInstance.get('/areas')
        if (response.data.success) {
          setAreas(response.data.data)
        }
      } catch (err) {
        console.error('Error refreshing areas:', err)
        setAreas((prev) => [...prev, newArea])
      }
    }
  }
  

  const handleEditPartner = (partner) => {
   setEditingArea(partner)
    setShowModal(true)
  }

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        Error loading partner: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Area List</div>
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={() => setShowModal(true)}>
              <CIcon icon={cilPlus} className='icon' /> Add
            </CButton>
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
                <CTableHeaderCell scope="col" onClick={() => handleSort('partnerName')} className="sortable-header">
                  Partner Name {getSortIcon('partnerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('centerName')} className="sortable-header">
                 Area Name {getSortIcon('centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.length > 0 ? (
                filteredData.map((area) => (
                  <CTableRow key={area._id}>
                    <CTableDataCell>{area.partner?.partnerName}</CTableDataCell>
                    <CTableDataCell>{area.areaName}</CTableDataCell>
                    <CTableDataCell>
                      <div className="dropdown-container" ref={el => dropdownRefs.current[area._id] = el}>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => toggleDropdown(area._id)}
                        >
                          <CIcon icon={cilSettings} /> Options
                        </CButton>
                        {dropdownOpen[area._id] && (
                          <div className="dropdown-menu show">
                            <button
                              className="dropdown-item"
                              onClick={() => handleEditPartner(area)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => handleDeletePartner(area._id)}
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
                    No area found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
          </div>
        </CCardBody>
      </CCard>
<AddArea
  visible={showModal}
  onClose={() => {
    setShowModal(false)
   setEditingArea(null)
  }}
  onAreaAdded={handleAreaAdded}
  area={editingArea}
/>

    </div>
  );
};

export default AreaList;
