import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'

import '../../../css/form.css'
import axiosInstance from 'src/axiosInstance'
import { showError, showSuccess } from 'src/utils/sweetAlerts'

const AddWarehouse = ({ visible, onClose, onDurationAdded, category }) => {
  const [warehouseName, setWarehouseName] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (category) {
      setWarehouseName(category.warehouseName || '')
    } else {
      setWarehouseName('')
    }
    setErrors({})
  }, [category, visible])

  const validateForm = () => {
    const newErrors = {}
    if (!warehouseName.trim()) {
      newErrors.warehouseName = 'This is a required field'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
  
    try {
      let response
      if (category) {
        response = await axiosInstance.put(`/warehouse/${category._id}`, {
            warehouseName
        })
        if (response.data.success) {
          showSuccess('Data updated successfully!')
          if (onDurationAdded) onDurationAdded(response.data.data, true)
          setWarehouseName('')
          onClose()
        }
      } else {
        response = await axiosInstance.post('/warehouse', {
            warehouseName
        })
        if (response.data.success) {
          showSuccess('Data added successfully!')
          if (onDurationAdded) onDurationAdded(response.data.data, false)
          setWarehouseName('')
          onClose()
        }
      }
    } catch (error) {
      console.error('Error saving package duration:', error)
  
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = {}
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg
        })
        setErrors(backendErrors)
      } else {
        showError('Failed to save data')
      }
    }
  }
  

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <CModalTitle>{category ? 'Edit Warehouse' : 'Add Warehouse'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label
              className={`form-label ${
                errors.warehouseName
                  ? 'error-label'
                  : warehouseName
                  ? 'valid-label'
                  : ''
              }`}
            >
              Warehouse <span style={{ color: 'red' }}>*</span>
            </label>
            <CFormInput
              type="text"
              placeholder="Warehouse"
              value={warehouseName}
              onChange={(e) => {
                setWarehouseName(e.target.value)
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, warehouseName: '' }))
                }
              }}
              className={`form-input ${
                errors.warehouseName
                  ? 'error-input'
                  : warehouseName
                  ? 'valid-input'
                  : ''
              }`}
            />
            {errors.warehouseName && (
              <span className="error">{errors.warehouseName}</span>
            )}
          </div>

          <div className="form-group">
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton className="submit-button" onClick={handleSubmit}>
          Submit
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

AddWarehouse.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDurationAdded: PropTypes.func,
  category: PropTypes.object
}

export default AddWarehouse
