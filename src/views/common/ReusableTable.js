
import React, { useState, useEffect, useRef } from 'react';
import {
  CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CCard, CCardBody, CCardHeader,
  CButton, CFormInput, CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilArrowTop, cilArrowBottom, cilSearch, cilPlus,
  cilSettings, cilPencil, cilTrash, cilZoomOut
} from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import Pagination from 'src/utils/Pagination';
import PropTypes from "prop-types";
import '../../css/table.css';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';

const getValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const ReusableTable = ({
  title,
  fetchData,         
  fetchCenters,      
  addLink,             
  searchComponent: SearchModal, 
  columns,           
  onRowClick,         
  onEdit,             
  onDelete,            
}) => {
  const [records, setRecords] = useState([]);
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();


  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };


  useEffect(() => {
    if (fetchCenters) {
      fetchCenters().then((res) => setCenters(res));
    }
    handleFetch();
  }, []);

  const handleFetch = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const { data, pagination } = await fetchData(searchParams, page);
      setRecords(data);
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    handleFetch(activeSearch, page);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...records].sort((a, b) => {
      const aValue = getValue(a, key);
      const bValue = getValue(b, key);

      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setRecords(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    handleFetch(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '' });
    setSearchTerm('');
    handleFetch({}, 1);
  };

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(
          (nested) =>
            nested &&
            nested.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return (
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(dropdownRefs.current).forEach((key) => {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key].contains(event.target)
        ) {
          newDropdownState[key] = false;
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({ ...prev, ...newDropdownState }));
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
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div>
      <div className="title">{title}</div>

      {SearchModal && (
        <SearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSearch={handleSearch}
          centers={centers}
        />
      )}

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            {addLink && (
              <CButton size="sm" className="action-btn me-1" as="a" onClick={() => navigate(addLink)} >
                <CIcon icon={cilPlus} /> Add
              </CButton>
            )}
            {SearchModal && (
              <CButton
                size="sm"
                className="action-btn me-1"
                onClick={() => setSearchModalVisible(true)}
              >
                <CIcon icon={cilSearch} /> Search
              </CButton>
            )}
            {(activeSearch.keyword || activeSearch.center) && (
              <CButton
                size="sm"
                color="secondary"
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
                <CIcon icon={cilZoomOut} /> Reset Search
              </CButton>
            )}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </CCardHeader>

        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className="d-flex">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{ maxWidth: '350px', height: '30px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="d-inline-block square-search"
              />
            </div>
          </div>

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  {columns.map((col) => (
                    <CTableHeaderCell
                      key={col.key}
                      scope="col"
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                      className={col.sortable ? 'sortable-header' : ''}
                    >
                      {col.label} {col.sortable && getSortIcon(col.key)}
                    </CTableHeaderCell>
                  ))}
                  {(onEdit || onDelete) && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((row) => (
                    <CTableRow key={row._id} onClick={() => onRowClick && onRowClick(row)}>
                      {columns.map((col) => (
                        <CTableDataCell key={col.key}>
                          {col.render ? col.render(row) : getValue(row, col.key) || "-"}
                        </CTableDataCell>
                      ))}

                      {(onEdit || onDelete) && (
                        // <CTableDataCell>
                        //   <div ref={(el) => (dropdownRefs.current[row._id] = el)}>
                        //     <CButton size="sm" className="option-button btn-sm" 
                        //     onClick={(e) => {
                        //       e.stopPropagation();
                        //       toggleDropdown(row._id);
                        //     }}
                        //     >
                        //       <CIcon icon={cilSettings} /> Options
                        //     </CButton>
                        //     {dropdownOpen[row._id] &&(
                        //       <div className="dropdown-menu show">
                        //         {onEdit && (
                        //           <button className="dropdown-item" onClick={() => onEdit(row._id)}>
                        //             <CIcon icon={cilPencil} className="me-2" /> Edit
                        //           </button>
                        //         )}
                        //         {onDelete && (
                        //           <button className="dropdown-item" onClick={() => onDelete(row._id)}>
                        //             <CIcon icon={cilTrash} className="me-2" /> Delete
                        //           </button>
                        //         )}
                        //       </div>
                        //     )}
                        //   </div>
                        // </CTableDataCell>
  <CTableDataCell>
  <button size="sm" className="option-button btn-sm" onClick={(e) => handleClick(e, row._id)}>
  <CIcon icon={cilSettings} />Options
  </button>

  <Menu
    id={`menu-${row._id}`}
    anchorEl={anchorEl}
    open={menuId === row._id}
    onClose={handleClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    {onEdit && <MenuItem onClick={() => { onEdit(row._id); handleClose(); }}> <CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>}
    {onDelete && <MenuItem onClick={() => { onDelete(row._id); handleClose(); }}><CIcon icon={cilTrash} className="me-2" />Delete</MenuItem>}
  </Menu>
</CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={columns.length + 1} className="text-center">
                      No records found
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

ReusableTable.propTypes = {
  title: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchCenters: PropTypes.func,
  addLink: PropTypes.string,
  searchComponent: PropTypes.elementType,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  onRowClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ReusableTable;
