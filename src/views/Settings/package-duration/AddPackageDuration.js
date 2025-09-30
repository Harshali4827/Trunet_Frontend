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
import axiosInstance from 'src/axiosInstance'
import { showSuccess, showError } from 'src/utils/sweetAlerts'
import '../../../css/form.css'

const AddPackageDuration = ({ visible, onClose, onDurationAdded, category }) => {
  const [packageDuration, setPackageDuration] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (category) {
      setPackageDuration(category.packageDuration || '')
    } else {
      setPackageDuration('')
    }
    setErrors({})
  }, [category, visible])

  const validateForm = () => {
    const newErrors = {}
    if (!packageDuration.trim()) {
      newErrors.packageDuration = 'This is a required field'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
  
    try {
      let response
      if (category) {
        response = await axiosInstance.put(`/packageDuration/${category._id}`, {
          packageDuration
        })
        if (response.data.success) {
          showSuccess('Package Duration updated successfully!')
          if (onDurationAdded) onDurationAdded(response.data.data, true)
          setPackageDuration('')
          onClose()
        }
      } else {
        response = await axiosInstance.post('/packageDuration', {
          packageDuration
        })
        if (response.data.success) {
          showSuccess('Package Duration added successfully!')
          if (onDurationAdded) onDurationAdded(response.data.data, false)
          setPackageDuration('')
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
        showError('Failed to save package duration')
      }
    }
  }
  

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <CModalTitle>{category ? 'Edit Package Duration' : 'Add Package Duration'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label
              className={`form-label ${
                errors.packageDuration
                  ? 'error-label'
                  : packageDuration
                  ? 'valid-label'
                  : ''
              }`}
            >
              Package Duration <span style={{ color: 'red' }}>*</span>
            </label>
            <CFormInput
              type="text"
              placeholder="Package Duration"
              value={packageDuration}
              onChange={(e) => {
                setPackageDuration(e.target.value)
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, packageDuration: '' }))
                }
              }}
              className={`form-input ${
                errors.packageDuration
                  ? 'error-input'
                  : packageDuration
                  ? 'valid-input'
                  : ''
              }`}
            />
            {errors.packageDuration && (
              <span className="error">{errors.packageDuration}</span>
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

AddPackageDuration.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDurationAdded: PropTypes.func,
  category: PropTypes.object
}

export default AddPackageDuration
