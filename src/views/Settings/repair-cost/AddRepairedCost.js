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
import Select from 'react-select'

const AddRepairedCost = ({ visible, onClose, onRepairCostAdded, repairCost }) => {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    product: '',
    repairCost: ''
  })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products')
        if (response.data.success) {
          // Filter products that don't already have a repair cost (except when editing)
          const allProducts = response.data.data;
          setProducts(allProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    
    if (visible) {
      fetchProducts()
    }
  }, [visible])

  useEffect(() => {
    if (repairCost) {
      setFormData({
        product: repairCost.product?._id || '',
        repairCost: repairCost.repairCost || ''
      })
    } else {
      setFormData({ product: '', repairCost: '' })
    }
    setErrors({})
    setAlert({ type: '', message: '' })
  }, [repairCost, visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    let newErrors = {}
    
    if (!formData.product) newErrors.product = 'Product is required'
    if (!formData.repairCost || formData.repairCost < 0) newErrors.repairCost = 'Valid repair cost (≥ 0) is required'

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    try {
      const payload = {
        product: formData.product,
        repairCost: parseFloat(formData.repairCost)
      }

      let response
      if (repairCost) {
        response = await axiosInstance.put(`/repair-costs/${repairCost._id}`, payload)
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Repair cost updated successfully!' })
          onRepairCostAdded(response.data.data, true)
        }
      } else {
        response = await axiosInstance.post('/repair-costs', payload)
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Repair cost added successfully!' })
          onRepairCostAdded(response.data.data, false)
        }
      }

      // Reset form
      setFormData({ product: '', repairCost: '' })
      setErrors({})
      
      setTimeout(() => {
        setAlert({ type: '', message: '' })
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Error saving repair cost:', error)
      let errorMessage = 'Failed to save repair cost'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      setAlert({ type: 'danger', message: errorMessage })
    }
  }

  const getSelectedProductName = () => {
    if (!formData.product) return ''
    const selected = products.find(p => p._id === formData.product)
    return selected ? `${selected.productTitle} (${selected.productCode})` : ''
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{repairCost ? 'Edit Repair Cost' : 'Add Repair Cost'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {alert.message && (
          <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
            {alert.message}
          </CAlert>
        )}

        <div className="form-row">
          <div className="form-group">
            <label
              className={`form-label ${
                errors.product ? 'error-label' : formData.product ? 'valid-label' : ''
              }`}
              htmlFor="product"
            >
              Product <span className="required">*</span>
            </label>
            <Select
              id="product"
              name="product"
              placeholder="Select Product..."
              value={
                formData.product
                  ? {
                      value: formData.product,
                      label: getSelectedProductName()
                    }
                  : null
              }
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  product: selected ? selected.value : ""
                }))
              }
              options={products.map((product) => ({
                value: product._id,
                label: `${product.productTitle} (${product.productCode})`
              }))}
              isDisabled={!!repairCost} // Disable product selection when editing
              isClearable={!repairCost} // Allow clearing only when adding new
              classNamePrefix="react-select"
              className={`no-radius-input ${
                errors.product ? "error-input" : formData.product ? "valid-input" : ""
              }`}
            />
            {errors.product && <span className="error">{errors.product}</span>}
            {repairCost && (
              <small className="text-muted">Product cannot be changed when editing</small>
            )}
          </div>

          <div className="form-group">
            <label
              className={`form-label ${
                errors.repairCost ? 'error-label' : formData.repairCost ? 'valid-label' : ''
              }`}
              htmlFor="repairCost"
            >
              Repair Cost (₹) <span className="required">*</span>
            </label>
            <CFormInput
              type="number"
              id="repairCost"
              name="repairCost"
              placeholder="Enter repair cost"
              value={formData.repairCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`form-input no-radius-input ${
                errors.repairCost ? 'error-input' : formData.repairCost ? 'valid-input' : ''
              }`}
            />
            {errors.repairCost && <span className="error">{errors.repairCost}</span>}
          </div>
        </div>

        {/* Product Details Preview */}
        {formData.product && (
          <div className="product-details-preview mt-3 p-3 border rounded">
            <h6>Product Details:</h6>
            {(() => {
              const selectedProduct = products.find(p => p._id === formData.product)
              if (!selectedProduct) return null
              
              return (
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Product Code:</strong> {selectedProduct.productCode}</p>
                    <p><strong>Product Name:</strong> {selectedProduct.productTitle}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Sale Price:</strong> ₹ {selectedProduct.salePrice?.toFixed(2) || '0.00'}</p>
                    <p><strong>HSN Code:</strong> {selectedProduct.hsnCode || 'N/A'}</p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton className="cancel-button me-2" color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton className="submit-button" onClick={handleSubmit}>
          {repairCost ? 'Update' : 'Submit'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

AddRepairedCost.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRepairCostAdded: PropTypes.func.isRequired,
  repairCost: PropTypes.object
}

export default AddRepairedCost