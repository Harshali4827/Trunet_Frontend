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
import { formatDate} from 'src/utils/FormatDateTime';

const UsageDetail = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', outlet: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      params.append('page', page);
      const url = params.toString() ? `/reports/usages?${params.toString()}` : '/reports/usages';
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

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

  const getFlattenedData = () => {
    const flattened = [];
    data.forEach(purchase => {
      if (purchase.products && purchase.products.length > 0) {
        purchase.products.forEach(product => {
          flattened.push({
            ...purchase,
            productDetail: product,
            uniqueKey: `${purchase._id}_${product._id}`
          });
        });
      } else {
        flattened.push({
          ...purchase,
          productDetail: null,
          uniqueKey: `${purchase._id}_no_product`
        });
      }
    });
    return flattened;
  };

  const calculateTotals = () => {
    const totals = {
      totalQty: 0,
      onuCharges: 0,
      packageAmount: 0,
      installationCharges: 0,
      shiftingAmount: 0,
      wireChangeAmount: 0,
      totalRevenue: 0,
    };
  
    getFlattenedData().forEach(item => {
      totals.totalQty += parseFloat(item.quantity || 0);
      totals.onuCharges += parseFloat(item.onuCharges || 0);
      totals.packageAmount += parseFloat(item.packageAmount || 0);
      totals.installationCharges += parseFloat(item.installationCharges || 0);
      totals.shiftingAmount += parseFloat(item.shiftingAmount || 0);
      totals.wireChangeAmount += parseFloat(item.wireChangeAmount || 0);
      totals.totalRevenue += parseFloat(item.totalRevenue || 0);
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
    setActiveSearch(searchData);
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', outlet: '' });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const filteredFlattenedData = getFlattenedData().filter(item => {
    if (activeSearch.keyword || activeSearch.outlet) {
      return true;
    }
    return Object.values(item).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
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
        Error loading data: {error}
      </div>
    );
  }

  const totals = calculateTotals();

  const fetchAllDataForExport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/reports/usages');
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
        'Date',
        'Type',
        'Center',
        'Product',
        'Product Type',
        'Qty',
        'User/Building',
        'Address',
        'Mobile',
        'Package Duration',
        'Status',
        'ONU Chrg.',
        'Pkt. Amt.',
        'Inst. Chrg.',
        'Shifting Amount',
        'Wire Change Amount',
        'Total Amount',
        'Reason'
      ];
  
      const csvData = allData.map(item => [
        formatDate(item.date || ''),
        item.usageType || '',
        item.center?.centerName || '',
        item.product?.productTitle || '',
        item.product?.productCategory || '',
        item.quantity || 0,
        item.customer?.username || '',
        item.address1 || '',
        item.mobile || '',
        item.packageDuration || '',
        item.status || '',
        item.onuCharges || '',
        item.packageAmount || '',
        item.installationCharges || '',
        item.shiftingAmount || '',
        item.wireChangeAmount || '',
        item.totalRevenue || '',
        item.reason || ''
      ]);
  
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row
            .map(field => {
              const stringField = String(field ?? '');
              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Usage_stock_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    }
  };

  return (
    <div>
      <div className='title'>Usage Stock Report </div>
    
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
            {(activeSearch.keyword || activeSearch.outlet) && (
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Type {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
                    Center {getSortIcon('outlet')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
                    Product {getSortIcon('productDetail.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
                    Product type{getSortIcon('productDetail.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.purchasedQuantity')} className="sortable-header">
                    Qty {getSortIcon('productDetail.purchasedQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.purchasedQuantity')} className="sortable-header">
                    User/Building {getSortIcon('productDetail.purchasedQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
                    Address {getSortIcon('invoiceNo')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Mobile {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Packgae Duration {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.price')} className="sortable-header">
                    Status {getSortIcon('productDetail.price')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    ONU Chrg. {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Pkt. Amt. {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Inst. Chrg. {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Shifting Amount {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Wire Change Amount {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
                    Total Amount {getSortIcon('remark')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Reason {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item) => (
                      <CTableRow key={item.uniqueKey}>
                        <CTableDataCell>
                          {formatDate(item.date || '')}
                        </CTableDataCell>
                        <CTableDataCell>{item.usageType || ''}</CTableDataCell>
                        <CTableDataCell>{item.center?.centerName || ''}</CTableDataCell>
                        <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
                        <CTableDataCell>
                         {item.product?.productCategory || ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.quantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.customer?.username || ''}
                        </CTableDataCell>
                        <CTableDataCell>{item.address1 || ''}</CTableDataCell>
                        <CTableDataCell>{item.mobile || ''}</CTableDataCell>
                        <CTableDataCell>{item.packageDuration || ''}</CTableDataCell>
                        <CTableDataCell>{item.status || ''}</CTableDataCell>
                        <CTableDataCell>{item.onuCharges || ''}</CTableDataCell>
                        <CTableDataCell>{item.packageAmount || ''}</CTableDataCell>
                        <CTableDataCell>{item.installationCharges || ''}</CTableDataCell>
                        <CTableDataCell>{item.shiftingAmount || ''}</CTableDataCell>
                        <CTableDataCell>{item.wireChangeAmount || ''}</CTableDataCell>
                        <CTableDataCell>{item.totalRevenue || ''}</CTableDataCell>
                        <CTableDataCell>{item.reason || ''}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5">Total</CTableDataCell>
                      <CTableDataCell>{totals.totalQty.toFixed(2)}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{totals.onuCharges.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.packageAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.installationCharges.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.shiftingAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.wireChangeAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.totalRevenue.toFixed(2)}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
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

export default UsageDetail;