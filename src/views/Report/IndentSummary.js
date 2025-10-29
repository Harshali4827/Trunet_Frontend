import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
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
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import SearchIndentSummary from './SearchIndentSummary';
import { formatDisplayDate} from 'src/utils/FormatDateTime';

const IndentSummary = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    center: '', 
    product: '', 
    startDate: '', 
    endDate: '',
    usageType: '',
    keyword: '', 
    outlet: '' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.usageType) {
        params.append('usageType', searchParams.usageType);
      }
      if (searchParams.startDate && searchParams.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(searchParams.startDate));
        params.append('endDate', convertDateFormat(searchParams.endDate));
      }
      
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      
      params.append('page', page);
      const url = params.toString() ? `/reports/requests/summary?${params.toString()}` : '/reports/requests/summary';
      
      console.log('Fetching URL:', url);
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

  const calculateTotals = () => {
    const totals = {
      totalQty: 0,
    };
  
    data.forEach(item => {
      totals.totalQty += parseFloat(item.totalQty || 0);
    });
  
    return totals;
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
    const mergedSearchData = {
      ...activeSearch,
      ...searchData
    };
    setActiveSearch(mergedSearchData);
    fetchData(mergedSearchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      center: '', 
      product: '', 
      startDate: '', 
      endDate: '',
      usageType: '',
      keyword: '', 
      outlet: '' 
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.center || 
           activeSearch.product || 
           activeSearch.startDate || 
           activeSearch.endDate ||
           activeSearch.usageType ||
           activeSearch.keyword || 
           activeSearch.outlet;
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

  const totals = calculateTotals();

  const generateDetailExport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.usageType) {
        params.append('usageType', activeSearch.usageType);
      }
      if (activeSearch.startDate && activeSearch.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(activeSearch.startDate));
        params.append('endDate', convertDateFormat(activeSearch.endDate));
      }
      
      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword);
      }
      if (activeSearch.outlet) {
        params.append('outlet', activeSearch.outlet);
      }
      
      const apiUrl = params.toString() 
        ? `/reports/requests/summary?${params.toString()}` 
        : '/reports/requests/summary';
      
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
        'Center',
        'Parent Center',
        'Product',
        'Total Qty'
      ];
  
      const csvData = exportData.map(item => [
        item.center || 'N/A',
        item.parentCenter || 'N/A',
        item.product || 'N/A',
        item.totalQty || 0,
      ]);
  
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
      link.setAttribute('download', `indent_summary_report_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className='title'>Indent Summary Report</div>
      <SearchIndentSummary
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
       
           <div className='summary-report'>
              <h4 className='summary-title'>Showing Result</h4>
              <ul className='summary-list'>
              <li><strong>{formatDisplayDate(activeSearch.startDate, activeSearch.endDate)}</strong></li>
              </ul>
           </div>

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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center')} className="sortable-header">
                    Center {getSortIcon('center')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('parentCenter')} className="sortable-header">
                    Parent Center {getSortIcon('parentCenter')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('product')} className="sortable-header">
                    Product {getSortIcon('product')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('totalQty')} className="sortable-header">
                    Total Qty {getSortIcon('totalQty')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.length > 0 ? (
                  <>
                    {data.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{item.center || ''}</CTableDataCell>
                        <CTableDataCell>{item.parentCenter || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.product || 'No Product'}</CTableDataCell>
                        <CTableDataCell>{item.totalQty || 0}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="3">Total</CTableDataCell>
                      <CTableDataCell>{totals.totalQty.toFixed(2)}</CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="10" className="text-center">
                      No data found
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

export default IndentSummary;