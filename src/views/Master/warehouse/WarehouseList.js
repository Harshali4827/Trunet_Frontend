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
import AddWarehouse from './AddWarehouse';

const WarehouseList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingDuration, setEditingDuration] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const fetchDuration = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/warehouse');
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDuration();
  }, []);


  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...categories].sort((a, b) => {
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

    setCategories(sortedCustomers);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const filteredCategories = categories.filter(category =>
    Object.values(category).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue =>
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handleDeleteCategory = async (categoryId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/warehouse/${categoryId}`);
        setCategories((prev) => prev.filter((c) => c._id !== categoryId));
        showSuccess('Product Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting product Category:', error);
      }
    }
  };
 
  const handleCategoryAdded = (category, isEdit) => {
    if (isEdit) {
      setCategories((prev) =>
        prev.map((p) => (p._id === category._id ? category : p))
      )
    } else {
      setCategories((prev) => [...prev, category])
    }
  }

  const handleEditCategory = (category) => {
    setEditingDuration(category)
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
        Error loading warehouse: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Warehouse List  </div>
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
                <CTableHeaderCell scope="col" onClick={() => handleSort('warehouseName')} className="sortable-header">
                 Warehouse Name {getSortIcon('warehouseName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <CTableRow key={category._id}>
                    <CTableDataCell>{category.warehouseName}</CTableDataCell>
                    <CTableDataCell>
                      <div className="dropdown-container" ref={el => dropdownRefs.current[category._id] = el}>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => toggleDropdown(category._id)}
                        >
                          <CIcon icon={cilSettings} /> Options
                        </CButton>
                        {dropdownOpen[category._id] && (
                          <div className="dropdown-menu show">
                            <button
                              className="dropdown-item"
                              onClick={() => handleEditCategory(category)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => handleDeleteCategory(category._id)}
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
                    No package duration found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
          </div>
        </CCardBody>
      </CCard>
<AddWarehouse
  visible={showModal}
  onClose={() => {
    setShowModal(false)
    setEditingDuration(null)
  }}
  onDurationAdded={handleCategoryAdded}
  category={editingDuration}
/>

    </div>
  );
};

export default WarehouseList;
