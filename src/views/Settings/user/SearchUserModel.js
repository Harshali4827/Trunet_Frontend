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
const SearchUserModel = ({ visible, onClose, onSearch, centers , roles, status}) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    center: '',
    role:'',
    status:''
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({ keyword: '', center: '' , role:'', status:''})
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
    setSearchData({ keyword: '', center: '' ,role:'', status:''})
    onSearch({ keyword: '', center: '' , role:'', status:''})
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
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Role
            </label>
            <CFormSelect
              id="role"
              name="role"
              value={searchData.role}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT ROLE</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.roleTitle}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <CFormSelect
             type="text"
             id="status"
             name="status"
             value={searchData.status}
             onChange={handleChange}
             className="form-input no-radius-input"
            >
              <option value=''>-SELECT-</option>
              <option value="Enable">Enable</option>
              <option value="Disable">Disable</option>
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

SearchUserModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  status: PropTypes.array.isRequired
}

export default SearchUserModel