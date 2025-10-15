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
const SearchCenterStock = ({ visible, onClose, onSearch, centers,products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: ''
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
              <option value="">SELECT CENTER</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productTitle}
                </option>
              ))}
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

SearchCenterStock.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products:PropTypes.array.isRequired
}

export default SearchCenterStock