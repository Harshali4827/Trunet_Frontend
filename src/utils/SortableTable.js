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
import { cilArrowTop, cilArrowBottom, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import Pagination from './Pagination';
import PropTypes from 'prop-types';
const SortableTable = ({
  title,
  fetchData,   
  columns, 
  onEdit,
  onDelete,
  searchModal,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});

  const loadData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const response = await fetchData(searchParams, page);
      setData(response.data);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    loadData(activeSearch, page);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...data].sort((a, b) => {
      let aValue = key.includes('.') ? key.split('.').reduce((obj, k) => obj && obj[k], a) : a[key];
      let bValue = key.includes('.') ? key.split('.').reduce((obj, k) => obj && obj[k], b) : b[key];

      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nested => nested?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newState = {};
      let shouldUpdate = false;
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          newState[key] = false;
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) setDropdownOpen(prev => ({ ...prev, ...newState }));
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height:'50vh'}}><CSpinner /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className='title'>{title}</div>
      {searchModal}
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div></div>
          <div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </CCardHeader>
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormInput
                type="text"
                placeholder="Search..."
                style={{maxWidth:'350px'}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  {columns.map(col => (
                    <CTableHeaderCell
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={col.sortable ? 'sortable-header' : ''}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{col.label}</span>
                        {col.sortable && getSortIcon(col.key)}
                      </div>
                    </CTableHeaderCell>
                  ))}
                  {(onEdit || onDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length ? filteredData.map(item => (
                  <CTableRow key={item._id}>
                    {columns.map(col => (
                      <CTableDataCell key={col.key}>
                        {col.render ? col.render(item) : item[col.key]}
                      </CTableDataCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <CTableDataCell>
                        <div className="dropdown-container" ref={el => dropdownRefs.current[item._id] = el}>
                          <CButton size="sm" className='option-button btn-sm' onClick={() => toggleDropdown(item._id)}>
                            <CIcon icon={cilSettings} /> Options
                          </CButton>
                          {dropdownOpen[item._id] && (
                            <div className="dropdown-menu show">
                              {onEdit && <button className="dropdown-item" onClick={() => onEdit(item)}><CIcon icon={cilPencil} /> Edit</button>}
                              {onDelete && <button className="dropdown-item" onClick={() => onDelete(item)}><CIcon icon={cilTrash} /> Delete</button>}
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                )) : (
                  <CTableRow>
                    <CTableDataCell colSpan={columns.length + 1} className="text-center">No data found</CTableDataCell>
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

SortableTable.propTypes = {
  title: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  searchModal: PropTypes.element,
};

export default SortableTable;
