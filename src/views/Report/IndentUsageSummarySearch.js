import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CButton,
  CFormInput
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import Select from 'react-select'
const IndentUsageSummarySearch = ({ visible, onClose, onSearch, centers, products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    month: ''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ product: '', center: '', month: '' })
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
    setSearchData({ product: '', center: '', month: '' })
    onSearch({ product: '', center: '', month: '' })
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
            <label className="form-label" htmlFor="center">
              Branch
            </label>
            {/* <CFormSelect
              id="center"
              name="center"
              value={searchData.center}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT CENTER</option>
              <option value="all">All Centers</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.centerName}
                </option>
              ))}
            </CFormSelect> */}
            <Select
              id="center"
              name="center"
               placeholder="Search"
              value={
                searchData.center
                  ? {
                      value: searchData.center,
                      label:
                        searchData.center === "all"
                          ? "All Centers"
                          : centers.find((c) => c._id === searchData.center)
                          ? centers.find((c) => c._id === searchData.center).centerName
                          : ""
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  center: selected ? selected.value : ""
                }))
              }
              options={[
                { value: "all", label: "All Centers" },
                ...centers.map((center) => ({
                  value: center._id,
                  label: center.centerName
                }))
              ]}
              isClearable
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="month">
              Month
            </label>
            <CFormInput
              type='month'
              id="month"
              name="month"
              value={searchData.month}
              onChange={handleChange}
              className="form-input no-radius-input"
            />
          </div>
        </div>
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
              <option value="">SELECT PRODUCT</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productTitle}
                </option>
              ))}
            </CFormSelect> */}
             <Select
              id="product"
              name="product"
              placeholder="Search"
              value={
                searchData.product
                  ? {
                      value: searchData.product,
                      label: products.find((p) => p._id === searchData.product)
                        ? products.find((p) => p._id === searchData.product).productTitle
                        : ""
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  product: selected ? selected.value : ""
                }))
              }
              options={products.map((product) => ({
                value: product._id,
                label: product.productTitle
              }))}
              isClearable
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
          <div className="form-group">

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

IndentUsageSummarySearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired
}

export default IndentUsageSummarySearch