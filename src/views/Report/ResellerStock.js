

import '../../css/table.css';
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError, showSuccess } from 'src/utils/sweetAlerts';
import ResellerStockSearch from './ResellerStockSearch';

const ResellerStock = () => {
  const [data, setData] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    product: '', 
    reseller: '', 
    center: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [centers, setCenters] = useState([]);

  const dropdownRefs = useRef({});

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller);
      }
      if (searchParams.center) {
        params.append('sourceCenter', searchParams.center);
      }
      if (searchParams.fromCenter) {
        params.append('fromCenter', searchParams.fromCenter);
      }
      params.append('page', page);
      const url = params.toString() 
        ? `/availablestock/reseller?${params.toString()}` 
        : '/availableStock/reseller';
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data.stock || []);
        setCurrentPage(response.data.data.pagination?.currentPage || 1);
        setTotalPages(response.data.data.pagination?.totalPages || 1);
        if (response.data.data.center) {
          setCenters([response.data.data.center]);
        } else if (response.data.data.sourceCenter) {
          setCenters([response.data.data.sourceCenter]);
        } else {
          setCenters([]);
        }
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching resellers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchResellers();
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
    setActiveSearch({ product: '', reseller: '', center: '' });
    setSearchTerm('');
    setCenters([]);
    fetchData({}, 1);
  };

  const filteredData = data.filter(data => {
    if (activeSearch.product || activeSearch.reseller || activeSearch.center) {
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

  const generateDetailExport = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.reseller) {
        params.append('reseller', activeSearch.reseller);
      }
      if (activeSearch.center) {
        params.append('sourceCenter', activeSearch.center);
      }
      
      params.append('page', 1);
      params.append('limit', 10000);
      
      const apiUrl = params.toString() 
        ? `/availableStock/reseller?${params.toString()}` 
        : '/availableStock/reseller';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      const exportData = response.data.data.stock || [];
      
      if (exportData.length === 0) {
        showError('No data available for export');
        return;
      }
      
      // Prepare CSV headers
      const headers = [
        'Reseller',
        'Product',
        'Category',
        'Available Quantity',
        'Consumed Quantity',
        // 'Total Quantity'
      ];
  
      // Prepare CSV data rows with proper handling for zero values
      const csvData = exportData.map(item => {
        const displayQty = item.displayQuantity !== undefined && item.displayQuantity !== null ? item.displayQuantity : 0;
        const displayConsumed = item.displayConsumed !== undefined && item.displayConsumed !== null ? item.displayConsumed : 0;
        // const totalQty = item.totalQuantity !== undefined && item.totalQuantity !== null ? item.totalQuantity : (displayQty + displayConsumed);
        
        return [                  
          item.resellerName || '',
          item.productName || '',
          item.productCategory?.name || "",
          displayQty,
          displayConsumed
          // totalQty
        ];
      });
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            let stringField;
            if (field === undefined || field === null) {
              stringField = '0';
            } else if (typeof field === 'number') {
              stringField = String(field);
            } else {
              stringField = String(field || '');
            }
            return `"${stringField.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      
      const filterText = [];
      if (activeSearch.product) {
        const product = products.find(p => p._id === activeSearch.product);
        if (product) filterText.push(product.name);
      }
      if (activeSearch.reseller) {
        const reseller = resellers.find(r => r._id === activeSearch.reseller);
        if (reseller) filterText.push(reseller.resellerName);
      }
      
      const filename = `reseller_stock_${filterText.length > 0 ? filterText.join('_') + '_' : ''}${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', filename);
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

  if (loading && data.length === 0) {
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
      <div className='title'>Reseller Stock</div>
    
      <ResellerStockSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        resellers={resellers}
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
            {(activeSearch.product || activeSearch.reseller || activeSearch.center) && (
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
              disabled={data.length === 0}
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
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('resellerName')} className="sortable-header">
                    Reseller {getSortIcon('resellerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productName')} className="sortable-header">
                    Product {getSortIcon('productName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productCategory.name')} className="sortable-header">
                    Category {getSortIcon('productCategory.name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('availableQuantity')} className="sortable-header">
                    Available {getSortIcon('availableQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('consumedQuantity')} className="sortable-header">
                    Consumed {getSortIcon('consumedQuantity')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          {item.resellerName || ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productName || ''}
                        </CTableDataCell>
                        <CTableDataCell>{item.productCategory?.name || ''}</CTableDataCell>
                        <CTableDataCell>
                          {/* {item.availableQuantity || 0} */}
                          {item.displayQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {/* {item.consumedQuantity || 0} */}
                          {item.displayConsumed || 0}
                          </CTableDataCell>
                      </CTableRow>
                    ))}
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="12" className="text-center">
                      {loading ? (
                        <CSpinner size="sm" />
                      ) : (
                        'No data found. Try adjusting your search filters.'
                      )}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
          
          {data.length > 0 && (
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing {filteredData.length} of {data.length} items
                  {totalPages > 1 && ` | Page ${currentPage} of ${totalPages}`}
                </small>
              </div>
              {totalPages > 1 && (
                <div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ResellerStock;