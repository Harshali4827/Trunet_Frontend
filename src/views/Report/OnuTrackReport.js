import '../../css/table.css';
import '../../css/form.css';
import '../../css/profile.css'
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
  CModalHeader,
  CModalTitle,
  CModal,
  CModalBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import { formatDate } from 'src/utils/FormatDateTime';
import ONUSearch from './ONUSearch';

const OnuTrackReport = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    product: '', 
    status: '', 
    keyword: '', 
    reseller: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dropdownRefs = useRef({});
  
  const [selectedSerial, setSelectedSerial] = useState(null);
  const [serialHistory, setSerialHistory] = useState([]);
  const [serialModalVisible, setSerialModalVisible] = useState(false);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.status) {
        params.append('status', searchParams.status);
      }
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller);
      }

      
      params.append('page', page);
      const url = `/reports/onu-report?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data);
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
      console.error('Error fetching data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
    fetchResellers();
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
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      product: '', 
      status: '', 
      keyword: '', 
      reseller: ''
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.product || 
           activeSearch.status || 
           activeSearch.keyword || 
           activeSearch.reseller ||
           activeSearch.usageType ||
           activeSearch.customer;
  };

  const filteredData = data.filter(record => {
    if (isSearchActive()) {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return Object.values(record).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchLower)
        );
      }
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });

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

  const handleSerialClick = (serial, productId) => {
    const history = data.flatMap(record => 
      record.items
        .filter(item => item.serialNumbers && item.serialNumbers.some(sn => sn.serialNumber === serial))
        .map(item => ({
          date: record.date,
          transaction: 'Customer Usage',
          type: record.connectionType,
          useIn: record.usageType,
          product: item.product?.productTitle,
          centerFrom: record.center?.centerName,
          customer: record.customer?.name
        }))
    );
    setSelectedSerial(serial);
    setSerialHistory(history);
    setSerialModalVisible(true);
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
      const params = new URLSearchParams();
      
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.status) {
        params.append('status', activeSearch.status);
      }
      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword);
      }
      if (activeSearch.reseller) {
        params.append('reseller', activeSearch.reseller);
      }
      
      const apiUrl = `/reports/onu-report?${params.toString()}`;
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      const exportData = response.data.data;
      
      if (!exportData || exportData.length === 0) {
        showError('No data available for export');
        return;
      }
  
      const headers = [
        'Activation Date',
        'Customer',
        'Serial Number',
        'Connection Type',
        'Reseller Name',
        'Area',
        'ONU Amount',
      ];
  
      const csvData = exportData.flatMap(record => 
        record.items.flatMap(item => 
          (item.serialNumbers || []).map(serial => [
            formatDate(record.date),
            record.customer?.username || '',
            serial.serialNumber || serial,
            record.connectionType || '',
            record.center?.reseller?.businessName || '',
            record.center?.area?.areaName || '',
            record.onuCharges || 0,
          ])
        )
      );
  
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
      const downloadUrl = URL.createObjectURL(blob);
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', `Product Serial Report ${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='title'>ONU Track Report</div>
    
      <ONUSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        resellers={resellers}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {isSearchActive() && (
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
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={generateDetailExport}
              disabled={loading}
            >
              <i className="fa fa-fw fa-file-excel"></i>
              {loading ? 'Exporting...' : 'Export'}
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
          <div className="d-flex justify-content-between mb-3">
            <div>
              <strong>Total Records: {filteredData.length}</strong>
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
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Activation Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('customer.username')} className="sortable-header">
                    Customer {getSortIcon('customer.username')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('items.product.productTitle')} className="sortable-header">
                    Product {getSortIcon('items.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="sortable-header">
                    Serial Number
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="sortable-header">
                    Status
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('connectionType')} className="sortable-header">
                    Connection Type {getSortIcon('connectionType')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.reseller.businessName')} className="sortable-header">
                    Reseller Name {getSortIcon('center.reseller.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.area.areaName')} className="sortable-header">
                    Area {getSortIcon('center.area.areaName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('onuCharges')} className="sortable-header">
                    ONU Amount {getSortIcon('onuCharges')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.flatMap(record =>
                      record.items.flatMap(item =>
                        (item.serialNumbers || []).map((serial, index) => (
                          <CTableRow key={`${record._id}-${item._id}-${serial.serialNumber || serial}-${index}`} 
                            className={serial.status === 'consumed' ? 'use-product-row' : 
                            serial.status === 'damaged' ? 'damage-product-row' : ''}
                          >
                            <CTableDataCell>
                              {formatDate(record.date)}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.customer?.username || ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              {item.product?.productTitle || ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              <button 
                                className="btn btn-link p-0 text-decoration-none"
                                style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                                onClick={() => handleSerialClick(serial.serialNumber || serial, item.product?.productId)}
                              >
                                {serial.serialNumber || serial}
                              </button>
                            </CTableDataCell>
                            <CTableDataCell>{serial.status || 'unknown'}</CTableDataCell>
                            <CTableDataCell>{record.connectionType || ''}</CTableDataCell>
                            <CTableDataCell>{record.center?.reseller?.businessName || ''}</CTableDataCell>
                            <CTableDataCell>{record.center?.area?.areaName || ''}</CTableDataCell>
                            <CTableDataCell>{item.onuCharges || 0}</CTableDataCell>
                          </CTableRow>
                        ))
                      )
                    )}
                  </>
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
          <br />
          <span className='use_product'></span>&nbsp;Use Product
          <span className='damage_product'></span>&nbsp;Damage Product
        </CCardBody>
      </CCard>

      <CModal visible={serialModalVisible} onClose={() => setSerialModalVisible(false)} size="xl">
        <CModalHeader>
          <CModalTitle>Serial No. {selectedSerial} Track History</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Transaction</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Use In</CTableHeaderCell>
                  <CTableHeaderCell>Product</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {serialHistory.length > 0 ? (
                  serialHistory.map((row, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{formatDate(row.date)}</CTableDataCell>
                      <CTableDataCell>{row.transaction}</CTableDataCell>
                      <CTableDataCell>{row.type}</CTableDataCell>
                      <CTableDataCell>{row.useIn}</CTableDataCell>
                      <CTableDataCell>{row.product}</CTableDataCell>
                      <CTableDataCell>{row.centerFrom}</CTableDataCell>
                      <CTableDataCell>{row.customer}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      No history found for this serial number
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default OnuTrackReport;