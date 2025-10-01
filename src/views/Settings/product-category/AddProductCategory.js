import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton,
  CAlert
} from '@coreui/react'
import PropTypes from 'prop-types'
import axiosInstance from 'src/axiosInstance'
import '../../../css/form.css'

const AddProductCategory = ({ visible, onClose, onCategoryAdded, category }) => {
  const [productCategory, setProductCategory] = useState('')
  const [remark, setRemark] = useState('')
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    if (category) {
      setProductCategory(category.productCategory || '')
      setRemark(category.remark || '')
    } else {
      setProductCategory('')
      setRemark('')
    }
    setErrors({})
    setAlert({ type: '', message: '' })
  }, [category, visible])

  const validateForm = () => {
    const newErrors = {}
    if (!productCategory.trim()) {
      newErrors.productCategory = 'This is a required field'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      let response
      if (category) {
        response = await axiosInstance.put(`/product-category/${category._id}`, {
          productCategory,
          remark,
        })
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Product Category updated successfully!' })
          if (onCategoryAdded) onCategoryAdded(response.data.data, true)
        }
      } else {
        response = await axiosInstance.post('/product-category', {
          productCategory,
          remark,
        })
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Product Category added successfully!' })
          if (onCategoryAdded) onCategoryAdded(response.data.data, false)
        }
      }
      setProductCategory('')
      setRemark('')
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      console.error('Error saving product category:', error)
     
      if (error.response?.data?.errors) {
        const backendErrors = {}
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg
        })
        setErrors(backendErrors)
      } else {
        const msg =
          error.response?.data?.message ||
          error.message ||
          'Failed to save product category'
        setAlert({ type: 'danger', message: msg })
      }
    }
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <CModalTitle>{category ? 'Edit Product Category' : 'Add Product Category'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {alert.message && (
          <CAlert
            color={alert.type}
            dismissible
            onClose={() => setAlert({ type: '', message: '' })}
          >
            {alert.message}
          </CAlert>
        )}

        <div className="form-row">
          <div className="form-group">
            <label
              className={`form-label ${
                errors.productCategory
                  ? 'error-label'
                  : productCategory
                  ? 'valid-label'
                  : ''
              }`}
            >
              Product Category <span style={{ color: 'red' }}>*</span>
            </label>
            <CFormInput
              type="text"
              placeholder="Product Category"
              value={productCategory}
              onChange={(e) => {
                setProductCategory(e.target.value)
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, productCategory: '' }))
                }
              }}
              className={`form-input ${
                errors.productCategory
                  ? 'error-input'
                  : productCategory
                  ? 'valid-input'
                  : ''
              }`}
            />
            {errors.productCategory && (
              <span className="error">{errors.productCategory}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Remark</label>
            <CFormInput
              type="text"
              placeholder="Product category remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="form-input"
            />
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

AddProductCategory.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCategoryAdded: PropTypes.func,
  category: PropTypes.object
}

export default AddProductCategory
