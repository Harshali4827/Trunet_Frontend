import '../../css/table.css';
import '../../css/form.css';
import '../../css/profile.css';
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { confirmDelete, showError, showSuccess } from 'src/utils/sweetAlerts';
import SearchStockModel from './SearchStockModel';
import Pagination from 'src/utils/Pagination';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import usePermission from 'src/utils/usePermission';

const StockRequest = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeTab, setActiveTab] = useState('open');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  
  const { hasPermission, hasAnyPermission } = usePermission();
  
  const statusFilters = {
    open: ['Confirmed', 'Submitted', 'Shipped', 'Incompleted', 'Draft'],
    closed: ['Rejected', 'Completed']
  };

  const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (!searchParams.status) {
        const statuses = statusFilters[tab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      } else {
        params.append('status', searchParams.status);
      }

      if (searchParams.keyword) {
        params.append('orderNumber', searchParams.keyword);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      
      params.append('page', page);
      
      const url = `/stockrequest?${params.toString()}`;
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
    fetchData(activeSearch, activeTab, page);
  };
  
  useEffect(() => {
    fetchData(activeSearch, activeTab);
  }, [activeTab]);

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
    fetchData(searchData, activeTab, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '', status: '' });
    setSearchTerm('');
    fetchData({}, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSearch({ keyword: '', center: '', status: '' });
    setSearchTerm('');
  };
  
  const handleClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`);
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.status) {
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
  
  const fetchAllDataForExport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/stockrequest');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching data for export:', err);
      showError('Error fetching data for export');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditCustomer = (customerId) => {
    navigate(`/edit-stockRequest/${customerId}`)
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => {
      const isCurrentlyOpen = !!prev[id];
      const newState = {};
      if (!isCurrentlyOpen) {
        newState[id] = true;
      }
      return newState;
    });
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
        Error loading data: {error}
      </div>
    );
  }
  
  const generateDetailExport = async () => {
    try {
      setLoading(true);
    
      const allData = await fetchAllDataForExport();
      
      if (!allData || allData.length === 0) {
        showError('No data available for export');
        return;
      }

      const headers = [
        'Order Date',
        'Order Number', 
        'Status',
        'Center Title',
        'Approved At',
        'Shipped At',
        'Shipped Date',
        'Reject At',
        'Reject Remark',
        'Completed At',
        'Product Title',
        'Product Qty',
        'Approved Qty',
        'Approved Remark',
        'Received Qty',
        'Received Remark'
      ];

      const csvData = allData.flatMap(request => {
        if (!request.products || request.products.length === 0) {
          return [[
            formatDate(request.date),
            request.orderNumber,
            request.status,
            request.center?.centerName || 'N/A',
            request.approvalInfo?.approvedAt ? formatDateTime(request.approvalInfo.approvedAt) : '',
            request.shippingInfo?.shippedAt ? formatDateTime(request.shippingInfo.shippedAt) : '',
            request.shippingInfo?.shippedDate ? formatDate(request.shippingInfo.shippedDate) : '',
            request.completionInfo?.incompleteOn ? formatDateTime(request.completionInfo.incompleteOn) : '',
            '',
            request.completionInfo?.completedOn ? formatDateTime(request.completionInfo.completedOn) : '',
            'No Product',
            0,
            0,
            '',
            0,
            ''
          ]];
        }
  
        return request.products.map(product => [
          formatDate(request.date),
          request.orderNumber,
          request.status,
          request.center?.centerName || 'N/A',
          request.approvalInfo?.approvedAt ? formatDateTime(request.approvalInfo.approvedAt) : '',
          request.shippingInfo?.shippedAt ? formatDateTime(request.shippingInfo.shippedAt) : '',
          request.shippingInfo?.shippedDate ? formatDate(request.shippingInfo.shippedDate) : '',
          request.completionInfo?.incompleteOn ? formatDateTime(request.completionInfo.incompleteOn) : '',
          '',
          request.completionInfo?.completedOn ? formatDateTime(request.completionInfo.completedOn) : '',
          product.product?.productTitle || '',
          product.quantity || 0,
          product.approvedQuantity || 0,
          product.approvedRemark || '',
          product.receivedQuantity || 0,
          product.receivedRemark || ''
        ]);
      });
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            const stringField = String(field || '');
            return `"${stringField.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `indent_detail_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };
  
  const renderTable = () => (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
              Date {getSortIcon('date')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('orderNumber')} className="sortable-header">
             Number {getSortIcon('orderNumber')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('warehouse.warehouseName')} className="sortable-header">
              From {getSortIcon('warehouse.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
              Center {getSortIcon('center.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.email')} className="sortable-header">
              Posted By {getSortIcon('createdBy.email')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('status')} className="sortable-header">
              Status {getSortIcon('status')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('mobile')} className="sortable-header">
              Remarks {getSortIcon('products[0].productRemark')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((item) => (
              <CTableRow key={item._id} 
                className={item.status === 'Submitted' ? 'selected-row' : ''}>

                <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
                <CTableDataCell>
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleClick(item._id)}
                    style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                  >
                    {item.orderNumber}
                  </button>
                </CTableDataCell>
                <CTableDataCell>{item.warehouse?.centerName || ''}</CTableDataCell>
                <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  {item.createdBy?.email || 'N/A'} 
                  {item.createdAt && ` At ${new Date(item.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: 'numeric',
                    hour12: true 
                  })}`}
                </CTableDataCell>
                <CTableDataCell>
                  {item.status && (
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  )}
                </CTableDataCell>
                <CTableDataCell>{item.products[0].productRemark}</CTableDataCell>
                <CTableDataCell>
                  {['Shipped', 'Incompleted', 'Rejected'].includes(item.status) ? null : (
                    <div
                      className="dropdown-container"
                      ref={el => dropdownRefs.current[item._id] = el}
                      onClick={(e) => e.stopPropagation()}
                    >
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
                          {item.status === 'Submitted' && hasPermission('Indent', 'manage_indent') && (
                            <button
                              className="dropdown-item"
                              onClick={() => handleEditCustomer(item._id)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                          )}

                          {hasAnyPermission('Indent', ['delete_indent_own_center','delete_indent_all_center']) && (
                           <button className="dropdown-item" onClick={() => handleDeleteCustomer(item._id)}>
                                <CIcon icon={cilTrash} className="me-2" /> Delete
                           </button>
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
                No {activeTab} stock requests found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  return (
    <div>
      <div className='title'>Stock Request List </div>
    
      <SearchStockModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
              {hasPermission('Indent', 'manage_indent') && (
                  <Link to='/add-stockRequest'>
                  <CButton size="sm" className="action-btn me-1">
                       <CIcon icon={cilPlus} className='icon'/> Add
                  </CButton>
                </Link>
              )}
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
               <CIcon icon={cilZoomOut} className='icon' />Reset Search
              </CButton>
            )}
             <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={generateDetailExport}
              disabled={customers.length === 0}
            >
              <i className="fa fa-fw fa-file-excel"></i>
               Detail Export
            </CButton>
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
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'open'}
                onClick={() => handleTabChange('open')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'open' ? '4px solid #2759a2' : '3px solid transparent',
                  color:'black',
                  borderBottom: 'none'
                }}
              >
                Open
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'closed'}
                onClick={() => handleTabChange('closed')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'closed' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color:'black'
                }}
              >
                Closed
              </CNavLink>
            </CNavItem>
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div>
              {activeSearch.keyword && (
                <span className="badge bg-primary me-2">
                  Keyword: {activeSearch.keyword}
                </span>
              )}
              {activeSearch.center && (
                <span className="badge bg-info me-2">
                  Center: {centers.find(c => c._id === activeSearch.center)?.centerName || activeSearch.center}
                </span>
              )}
              {activeSearch.status && (
                <span className="badge bg-warning">
                  Status: {activeSearch.status}
                </span>
              )}
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!(activeSearch.keyword || activeSearch.center || activeSearch.status)} 
                placeholder={activeSearch.keyword || activeSearch.center || activeSearch.status ? "Disabled during advanced search" : " "}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 'open'}>
              {renderTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'closed'}>
              {renderTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default StockRequest;