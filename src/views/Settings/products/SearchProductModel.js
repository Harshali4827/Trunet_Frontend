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
import '../../../css/form.css'

const SearchProductModel = ({ visible, onClose, onSearch, categories }) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    category: '',
    status: ''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ keyword: '', category: '', status: '' })
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
    setSearchData({ keyword: '', category: '', status: '' })
    onSearch({ keyword: '', category: '', status: '' })
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
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

          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Product Category
            </label>
            <CFormSelect
              id="category"
              name="category"
              value={searchData.category}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT CATEGORY</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.productCategory}>
                  {cat.productCategory}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>
        <div className="form-row">
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
              <option value="">SELECT STATUS</option>
              <option value="Enable">Enable</option>
              <option value="Disable">Disable</option>
            </CFormSelect>
          </div>
          <div className="form-group">
            </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" className="me-2" onClick={handleReset}>
          Close
        </CButton>
        <CButton className="reset-button" onClick={handleSearch}>
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

SearchProductModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired
}

export default SearchProductModel
