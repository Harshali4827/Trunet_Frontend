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
import Select from "react-select";

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