import '../../css/table.css';
import '../../css/form.css'
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilHistory, cilUser, cilTags, cilInfo } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import usePermission from 'src/utils/usePermission';
import SearchAuditLogs from './SearchAuditLogs';

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchAuditLogs = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.center) {
        params.append('user', searchParams.center);
      }
      
      params.append('sortBy', sortConfig.key);
      params.append('sortOrder', sortConfig.direction === 'ascending' ? 'asc' : 'desc');
      
      params.append('page', page);
      
      const url = params.toString() ? `/auditLogs?${params.toString()}` : '/auditLogs';
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setAuditLogs(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers?centerType=Center');
      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    fetchAuditLogs(activeSearch, currentPage);
  }, [sortConfig]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchAuditLogs(activeSearch, page);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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
    fetchAuditLogs(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '' });
    setSearchTerm('');
    fetchAuditLogs({}, 1);
  };

  const getActionBadge = (action) => {
    const actionColors = {
      CREATE: 'success',
      UPDATE: 'info',
      DELETE: 'danger',
      LOGIN: 'primary',
      LOGOUT: 'secondary',
      EXPORT: 'warning',
      IMPORT: 'warning',
      APPROVE: 'success',
      REJECT: 'danger',
      ENABLE: 'success',
      DISABLE: 'danger',
    };
    
    const color = actionColors[action] || 'secondary';
    return <CBadge color={color}>{action}</CBadge>;
  };

  const getStatusBadge = (status) => {
    return status === 'SUCCESS' 
      ? <CBadge color="success">Success</CBadge>
      : <CBadge color="danger">Failed</CBadge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (log.details && log.details.toLowerCase().includes(searchLower)) ||
      (log.errorMessage && log.errorMessage.toLowerCase().includes(searchLower)) ||
      (log.user?.fullName && log.user.fullName.toLowerCase().includes(searchLower)) ||
      (log.user?.username && log.user.username.toLowerCase().includes(searchLower)) ||
      (log.entity && log.entity.toLowerCase().includes(searchLower)) ||
      (log.action && log.action.toLowerCase().includes(searchLower)) ||
      (log.ipAddress && log.ipAddress.includes(searchTerm))
    );
  });

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
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Audit Logs</div>
      
      <SearchAuditLogs
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
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
            <div className="text-muted">
              Total Records: {totalItems}
            </div>
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
                  <CTableHeaderCell 
                    scope="col" 
                    onClick={() => handleSort('timestamp')} 
                    className="sortable-header"
                  >
                    Timestamp {getSortIcon('timestamp')}
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    onClick={() => handleSort('user.fullName')} 
                    className="sortable-header"
                  >
                    User {getSortIcon('user.fullName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    onClick={() => handleSort('action')} 
                    className="sortable-header"
                  >
                    Action {getSortIcon('action')}
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    onClick={() => handleSort('entity')} 
                    className="sortable-header"
                  >
                    Entity {getSortIcon('entity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell 
                    scope="col" 
                    onClick={() => handleSort('status')} 
                    className="sortable-header"
                  >
                    Status {getSortIcon('status')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Details
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    IP Address
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <CTableRow key={log._id}>
                      <CTableDataCell>
                        {formatDate(log.timestamp)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {log.user?.fullName || log.user?.username || 'Unknown'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getActionBadge(log.action)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {log.entity}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getStatusBadge(log.status)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {log.details}
                          {log.errorMessage && (
                            <div className="text-danger small mt-1">
                              Error: {log.errorMessage}
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <code className="small">{log.ipAddress || '-'}</code>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      No audit logs found
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

export default AuditLogs;