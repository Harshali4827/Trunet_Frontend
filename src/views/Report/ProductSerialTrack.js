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
import SearchCenterStock from './SearchCenterStock';
import { formatDate } from 'src/utils/FormatDateTime';
import ProductSerialSearch from './ProductSerialSearch';

const ProductSerialTrack = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({  product: '', outlet: '' });
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
        params.append('search', searchParams.product);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      params.append('page', page);
      const url = params.toString() ? `/reports/serialreport?${params.toString()}` : '/reports/serialreport';
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
      const response = await axiosInstance.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
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
    setActiveSearch({product: '', outlet: '' });
    setSearchTerm('');
    fetchData({},1);
  };

  const filteredData = data.filter(data => {
    if (activeSearch.product || activeSearch.outlet) {
      return true;
    }
    return Object.values(data).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleSerialClick = (serial) => {
    const history = data.filter((item) => item.Serial === serial);
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

  const fetchAllDataForExport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/reports/serialreport');
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
  
  const generateDetailExport = async () => {
    try {
      setLoading(true);
    
      const allData = await fetchAllDataForExport();
      
      if (!allData || allData.length === 0) {
        showError('No data available for export');
        return;
      }
  
      const headers = [
        'Serial',
        'Purchase Center',
        'Center',
        'Product',
        'Action At',
      ];
  
      const csvData = allData.flatMap(purchase => {
        if (purchase.products && purchase.products.length > 0) {
          return purchase.products.map(product => [
            purchase.Serial,
            purchase.PurchaseCenter || 'N/A',
            purchase.Center || "",
            purchase.Product || "",
            formatDate(purchase.ActionDate),
          ]);
        } else {
          return [[
            purchase.Serial,
            purchase.PurchaseCenter || 'N/A',
            purchase.Center || "",
            purchase.Product || "",
            formatDate(purchase.ActionDate),
          ]];
        }
      }
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
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `product_serial_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='title'>Product Serial Report</div>
    
      <ProductSerialSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
       products={products}
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
            {(activeSearch.product || activeSearch.outlet) && (
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
            >
              <i className="fa fa-fw fa-file-excel"></i>
               Export
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
                <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
                 Serial {getSortIcon('outlet')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                Purchase Center {getSortIcon('date')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
                  Center {getSortIcon('invoiceNo')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                  Product {getSortIcon('vendor.businessName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('damagedQuantity')} className="sortable-header">
                 Action At {getSortIcon('damagedQuantity')}
                </CTableHeaderCell>
             </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.length > 0 ? (
                <>
                  {filteredData.map((data) => (
                    <CTableRow key={data._id}
                    className={data.Status === 'consumed' ? 'selected-row' : ''}
                    >
                      <CTableDataCell>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                        onClick={() => handleSerialClick(data.Serial)}
                      >
                        {data.Serial || ''}
                      </button>
                      </CTableDataCell>
                      <CTableDataCell>{data.PurchaseCenter?.name || ''}</CTableDataCell>
                      <CTableDataCell>{data.Center?.name || ''}</CTableDataCell>
                      <CTableDataCell>{data.Product.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{formatDate(data.ActionDate || 0)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </>
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="11" className="text-center">
                    No data found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
          </div>
          <br></br>
       <span className='use_product'></span>&nbsp;Use Product
      <span className='damage_product'></span>&nbsp;Damage Product
        </CCardBody>
      </CCard>
      <CModal visible={serialModalVisible} onClose={() => setSerialModalVisible(false)} size="xl">
        <CModalHeader>
          <CModalTitle>Serial No.{selectedSerial} Track</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable striped bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Transaction</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Use In</CTableHeaderCell>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Center From</CTableHeaderCell>
                <CTableHeaderCell>Center To</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {serialHistory.map((row, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{formatDate(row.ActionDate)}</CTableDataCell>
                  <CTableDataCell>{row.Status === 'consumed' ? 'user usage ':'indent'}</CTableDataCell>
                  <CTableDataCell>{row.ConsumptionDetails ? 'Used' : 'Transfer'}</CTableDataCell>
                  <CTableDataCell>{row.ConsumptionDetails?.usageType || '-'}</CTableDataCell>
                  <CTableDataCell>{row.Product?.name || '-'}</CTableDataCell>
                  <CTableDataCell>{row.PurchaseCenter?.name || '-'}</CTableDataCell>
                  <CTableDataCell>{row.Center?.name || '-'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default ProductSerialTrack;
