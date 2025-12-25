import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import Select from "react-select";

const ResellerStockSearch = ({ visible, onClose, onSearch, resellers,products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    reseller: ''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ product: '', reseller: '' })
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
    setSearchData({ product: '', reseller: '' })
    onSearch({ product: '', reseller: '' })
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="reseller">
              Reseller
            </label>
            <Select
    id="reseller"
    name="reseller"
    placeholder="Select Reseller..."
    value={
      searchData.reseller
        ? {
            value: searchData.reseller,
            label: resellers.find((c) => c._id === searchData.reseller)
              ? resellers.find((c) => c._id === searchData.reseller).businessName
              : "",
          }
        : null
    }
    onChange={(selected) =>
      setSearchData((prev) => ({
        ...prev,
        reseller: selected ? selected.value : "",
      }))
    }
    options={resellers.map((reseller) => ({
      value: reseller._id,
      label: reseller.businessName,
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

ResellerStockSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  resellers: PropTypes.array.isRequired,
  products:PropTypes.array.isRequired
}

export default ResellerStockSearch