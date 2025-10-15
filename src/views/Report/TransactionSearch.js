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

const TransactionSearch = ({ visible, onClose, onSearch, centers,products,customers }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    usageType:''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ product: '', center: '' })
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
    setSearchData({ product: '', center: '' })
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
        dateFilter: 'Custom',
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate)
      }));
    } else {
      setSearchData(prev => ({ 
        ...prev, 
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
              Center
            </label>
            <CFormSelect
              id="center"
              name="center"
              value={searchData.center}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT CENTER</option>
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
                <option value="Indent">Indent</option>
                <option value="Usage">Usage</option>
                <option value="User Usage">User Usage</option>
                <option value="Building Usage">Building Usage</option>
                <option value="Control Room Usage">Control Room Usage</option>
                <option value="Sales">Sales</option>
                <option value="Purchase">Purchase</option>
                <option value="Purchase">Purchase</option>
                <option value="Adjustment">Adjustment</option>
            </CFormSelect>
          </div>
        </div>

        <div className="form-row">
        <div className="form-group">
            <label className="form-label" htmlFor="product">
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
              <option value="">SELECT CENTER</option>
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
              placeholder="Date"
              className="no-radius-input date-input"
            />
          </div>
          <div className="form-group"></div>
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

TransactionSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products:PropTypes.array.isRequired,
  customers:PropTypes.array.isRequired
}

export default TransactionSearch