import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import DatePicker from 'src/utils/DatePicker'

const SearchUsageDetail = ({ visible, onClose, onSearch, centers, products, customers }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    usageType: '',
    customer: '',
    date: '',
    startDate: '',
    endDate: '',
    connectionType:''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ 
        product: '', 
        center: '', 
        usageType: '', 
        customer: '', 
        date: '', 
        startDate: '', 
        endDate: '',
        connectionType:''
      })
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    onSearch(searchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({ 
      product: '', 
      center: '', 
      usageType: '', 
      customer: '', 
      date: '', 
      startDate: '', 
      endDate: '',
      connectionType:''
    })
    onSearch({ product: '', center: '' })
  }

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(' to ')) {
      const [startDate, endDate] = dateValue.split(' to ');
      const formatDateForAPI = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
      };
      
      setSearchData(prev => ({ 
        ...prev, 
        date: dateValue,
        dateFilter: 'Custom',
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate)
      }));
    } else {
      setSearchData(prev => ({ 
        ...prev, 
        date: dateValue,
        dateFilter: '',
        startDate: '',
        endDate: ''
      }));
    }
  };

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="center">
              Branch
            </label>
            <CFormSelect
              id="center"
              name="center"
              value={searchData.center}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.centerName}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="usageType">
              Type
            </label>
            <CFormSelect
              id="usageType"
              name="usageType"
              value={searchData.usageType}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">-SELECT-</option>
              <option value="Customer">Customer</option>
              <option value="Building">Building</option>
              <option value="Building to Building">Building to Building</option>
              <option value="Control Room">Control Room</option>
              <option value="Damage">Damage</option>
              <option value="Stolen from Center">Stolen from Center</option>
              <option value="Stolen from Field">Stolen from Field</option>
              <option value="Other">Other</option>
            </CFormSelect>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="customer">
              User
            </label>
            <CFormSelect
              id="customer"
              name="customer"
              value={searchData.customer}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">-SELECT-</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.username}-{customer.mobile}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="product">
              Product
            </label>
            <CFormSelect
              id="product"
              name="product"
              value={searchData.product}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT PRODUCT</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productTitle}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              Date
            </label>
            <DatePicker
              value={searchData.date}
              onChange={handleDateChange}
              placeholder="Select Date Range"
              className="no-radius-input date-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="connectionType">
              Connection Type
            </label>
            <CFormSelect
              id="connectionType"
              name="connectionType"
              value={searchData.connectionType}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT</option>
              <option value="New">new</option>
              <option value="Convert">convert</option>
              <option value="Shifting">shifting</option>
              <option value="Repair">Repair</option>
            </CFormSelect>
          </div>
        </div>

      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleReset}
        >
          Close
        </CButton>
        <CButton 
          className="reset-button" 
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

SearchUsageDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired
}

export default SearchUsageDetail