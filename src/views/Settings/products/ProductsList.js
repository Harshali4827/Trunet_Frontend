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
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts';
import SearchProductModel from './SearchProductModel';
import Pagination from 'src/utils/Pagination';

const ProductList = () => {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const dropdownRefs = useRef({});

 const navigate = useNavigate();

 const fetchProducts = async (searchParams = {}, page = 1) => {
  try {
    setLoading(true);
    const params = new URLSearchParams();

    if (searchParams.keyword) params.append('search', searchParams.keyword);
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.status) params.append('status', searchParams.status);
    params.append('page', page);
    const url = params.toString() ? `/products?${params.toString()}` : '/products';
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
    console.error('Error fetching products:', err);
  } finally {
    setLoading(false);
  }
};


    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/product-category');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching product Category:', error);
      }
    };
    useEffect(() => {
      fetchProducts();
      fetchCategories();
    }, []);

    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages) return;
      fetchProducts(activeSearch, page);
    };
  

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
    fetchProducts(searchData,1);
  };
  
  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', category: '', status: '' });
    setSearchTerm('');
    fetchProducts({},1);
  };
  

  const filteredCustomers = customers.filter(customer =>
    Object.values(customer).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handleDeleteData= async (itemId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/products/${itemId}`);
        setCustomers((prev) => prev.filter((c) => c._id !== itemId));
  
        showSuccess('Data deleted successfully!');
      } catch (error) {
        console.error('Error deleting Data:', error);
      }
    }
  };
  
  const handleEditData = (itemId) => {
     navigate(`/edit-product/${itemId}`)
  };

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
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Product List </div>
      <SearchProductModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        categories={categories}
      />
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <Link to='/add-product'>
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Add
              </CButton>
            </Link>
            <CButton size="sm" onClick={() => setSearchModalVisible(true)}  className="action-btn me-1">
              <CIcon icon={cilSearch}
              onClick={() => setSearchModalVisible(true)} className='icon' /> Search
            </CButton>
            {(activeSearch.keyword || activeSearch.category || activeSearch.status) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
                 <CIcon icon={cilZoomOut} className='icon' />Reset Search
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
          <CTable striped bordered hover responsive className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" onClick={() => handleSort('centerName')} className="sortable-header">
                  Product Name {getSortIcon('centerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('centerCode')} className="sortable-header">
                 Product Category {getSortIcon('centerCode')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerType')} className="sortable-header">
                 Product Code {getSortIcon('center.centerType')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('email')} className="sortable-header">
                  Product Price {getSortIcon('email')}
                </CTableHeaderCell>
                
                <CTableHeaderCell scope="col" onClick={() => handleSort('mobile')} className="sortable-header">
                  Product Description {getSortIcon('mobile')}
                </CTableHeaderCell>
               
                <CTableHeaderCell scope="col" onClick={() => handleSort('city')} className="sortable-header">
                  Status {getSortIcon('city')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  Image
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((product) => (
                  <CTableRow key={product._id}>
                    <CTableDataCell>{product.productTitle}</CTableDataCell>
                    <CTableDataCell>{product.productCategory.productCategory || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{product.productCode || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{product.productPrice}</CTableDataCell>
                    <CTableDataCell>{product.description}</CTableDataCell>
                    <CTableDataCell>{product.status}</CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell>
                      <div className="dropdown-container" ref={el => dropdownRefs.current[product._id] = el}>
                        <CButton 
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => toggleDropdown(product._id)}
                        >
                          <CIcon icon={cilSettings} /> Options
                        </CButton>
                        {dropdownOpen[product._id] && (
                          <div className="dropdown-menu show">
                            <button 
                              className="dropdown-item"
                              onClick={() => handleEditData(product._id)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleDeleteData(product._id)}
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
                    No product found
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

export default ProductList;