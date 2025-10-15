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

const CommonSearch = ({ visible, onClose, onSearch, centers, products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ product: '', center: '', startDate: '', endDate: '' })
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(' to ')) {
      const [startDate, endDate] = dateValue.split(' to ');
      setSearchData(prev => ({ 
        ...prev, 
        startDate: startDate,
        endDate: endDate
      }));
    } else {
      setSearchData(prev => ({ 
        ...prev, 
        startDate: '',
        endDate: ''
      }));
    }
  }

  const handleSearch = () => {
    // Convert date format before sending to parent
    const formattedSearchData = {
      ...searchData,
      date: searchData.startDate && searchData.endDate 
        ? `${searchData.startDate} to ${searchData.endDate}`
        : ''
    };
    onSearch(formattedSearchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({ product: '', center: '', startDate: '', endDate: '' })
    onSearch({ product: '', center: '', startDate: '', endDate: '' })
  }

  const getDateDisplayValue = () => {
    if (searchData.startDate && searchData.endDate) {
      return `${searchData.startDate} to ${searchData.endDate}`;
    }
    return '';
  }

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
              Date Range
            </label>
            <DatePicker
              value={getDateDisplayValue()}
              onChange={handleDateChange}
              placeholder="Select Date Range"
              className="no-radius-input date-input"
            />
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleReset}
        >
          Reset
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

CommonSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired
}

export default CommonSearch