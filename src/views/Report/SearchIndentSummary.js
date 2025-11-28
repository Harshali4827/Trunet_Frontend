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
import Select from "react-select";

const SearchIndentSummary = ({ visible, onClose, onSearch, centers, products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    usageType: '',
    startDate: '',
    endDate: '',
    dateDisplay: ''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ 
        product: '', 
        center: '', 
        usageType: '', 
        startDate: '', 
        endDate: '',
        dateDisplay: '' 
      })
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    const apiSearchData = {
      product: searchData.product,
      center: searchData.center,
      usageType: searchData.usageType,
      startDate: searchData.startDate,
      endDate: searchData.endDate
    }
    onSearch(apiSearchData)
    onClose()
  }

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(' to ')) {
      const [startDate, endDate] = dateValue.split(' to ');
      
      setSearchData(prev => ({ 
        ...prev, 
        dateDisplay: dateValue, 
        startDate: startDate,  
        endDate: endDate       
      }));
    } else {
      setSearchData(prev => ({ 
        ...prev, 
        dateDisplay: '',
        startDate: '',
        endDate: ''
      }));
    }
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
              Branch
            </label>
            <Select
    id="center"
    name="center"
    placeholder="Select Branch..."
    value={
      searchData.center
        ? {
            value: searchData.center,
            label: centers.find((c) => c._id === searchData.center)
              ? centers.find((c) => c._id === searchData.center).centerName
              : "",
          }
        : null
    }
    onChange={(selected) =>
      setSearchData((prev) => ({
        ...prev,
        center: selected ? selected.value : "",
      }))
    }
    options={centers.map((center) => ({
      value: center._id,
      label: center.centerName,
    }))}
    isClearable
    classNamePrefix="react-select"
    className="no-radius-input"
  />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="usageType">
              Usage Type
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
            <label className="form-label" htmlFor="date">
              Date
            </label>
            <DatePicker
              value={searchData.dateDisplay}
              onChange={handleDateChange}
              placeholder="Select Date Range"
              className="no-radius-input date-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="product">
              Product
            </label>
            <Select
  id="product"
  name="product"
  placeholder="Search Product..."
  value={
    searchData.product
      ? {
          value: searchData.product,
          label: products.find((p) => p._id === searchData.product)?.productTitle
        }
      : null
  }
  onChange={(selected) =>
    setSearchData((prev) => ({ ...prev, product: selected ? selected.value : "" }))
  }
  options={products.map((product) => ({
    value: product._id,
    label: product.productTitle,
  }))}
  isClearable
  classNamePrefix="react-select"
  className="no-radius-input"
/>

          </div>
        </div>

      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={onClose}
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

SearchIndentSummary.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired
}

export default SearchIndentSummary