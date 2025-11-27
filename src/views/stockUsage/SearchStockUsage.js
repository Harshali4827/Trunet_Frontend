import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
const SearchStockUsage = ({ visible, onClose, onSearch, centers }) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    center: '',
    usageType:''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ keyword: '', center: '', usageType:'' })
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
    setSearchData({ keyword: '', center: '', usageType:'' })
    onSearch({ keyword: '', center: '', usageType:'' })
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
                <label className='form-label'>
                  Usage Type <span className="required">*</span>
                </label>
                <select
                  name="usageType"
                  className='form-input'
                  value={searchData.usageType}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Customer">Customer</option>
                  <option value="Building">Building</option>
                  <option value="Building to Building">Building to Building</option>
                  <option value="Control Room">Control Room</option>
                  <option value="Damage">Damage</option>
                  <option value="Stolen from Center">Stolen from Center</option>
                  <option value="Stolen from Field">Stolen from Field</option>
                  <option value="Other">Other</option>
                </select>
              </div>
        </div>
        <div className="form-row">
        <div className="form-group">
            <label className="form-label" htmlFor="keyword">
              Keyword
            </label>
            <CFormInput
              type="text"
              id="keyword"
              name="keyword"
              value={searchData.keyword}
              onChange={handleChange}
              className="form-input no-radius-input"
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
          Reset
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

SearchStockUsage.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired
}

export default SearchStockUsage