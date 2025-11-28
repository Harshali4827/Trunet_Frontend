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
import { CFormInput } from '@coreui/react-pro'
import Select from 'react-select'

const ONUSearch = ({ visible, onClose, onSearch, products, resellers, centers }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    status: '',
    keyword: '',
    reseller: '',
    usageType: '',
    customer: ''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ 
        product: '', 
        status: '', 
        keyword: '', 
        reseller: '',
        usageType: '',
        customer: ''
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
      status: '', 
      keyword: '', 
      reseller: '',
      usageType: '',
      customer: ''
    })
    onSearch({ 
      product: '', 
      status: '', 
      keyword: '', 
      reseller: '',
      usageType: '',
      customer: ''
    })
    onClose()
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="product">
              Product
            </label>
            {/* <CFormSelect
              id="product"
              name="product"
              value={searchData.product}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productTitle}
                </option>
              ))}
            </CFormSelect> */}
              <Select
              id="product"
              name="product"
              placeholder="Search Product..."
              value={
                searchData.product
                  ? {
                      value: searchData.product,
                      label:
                        products.find((p) => p._id === searchData.product)?.productTitle || ''
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  product: selected ? selected.value : ''
                }))
              }
              options={products.map((p) => ({
                value: p._id,
                label: p.productTitle
              }))}
              isClearable
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <CFormSelect
              id="status"
              name="status"
              value={searchData.status}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT</option>
              <option value="all">All</option>
              <option value="consumed">In Use</option>
              <option value="Not in Use">Not in Use</option>
              <option value="damaged">Damage</option>
              <option value="Own Product">Own Product</option>
            </CFormSelect>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="reseller">
              Reseller Name
            </label>
            <Select
    id="reseller"
    name="reseller"
    placeholder="Select Reseller..."
    value={
      searchData.reseller
        ? {
            value: searchData.reseller,
            label: resellers.find((r) => r._id === searchData.reseller)
              ? resellers.find((r) => r._id === searchData.reseller).businessName
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

ONUSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired,
  centers: PropTypes.array
}

export default ONUSearch