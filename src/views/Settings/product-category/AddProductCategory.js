// import React, { useState, useEffect } from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormInput,
//   CButton
// } from '@coreui/react'
// import PropTypes from 'prop-types'
// import axiosInstance from 'src/axiosInstance'
// import { showSuccess, showError } from 'src/utils/sweetAlerts'
// import '../../../css/form.css'
// const AddProductCategory = ({ visible, onClose, onCategoryAdded, category }) => {
//   const [productCategory, setProductCategory] = useState('')
//   const [remark, setRemark] = useState('')

//   useEffect(() => {
//     if (category) {
//       setProductCategory(category.productCategory || '')
//       setRemark(category.remark || '')
//     } else {
//       setProductCategory('')
//       setRemark('')
//     }
//   }, [category])

//   const handleSubmit = async () => {
//     if (!productCategory.trim()) {
//       showError('Product Category is required')
//       return
//     }

//     try {
//       let response
//       if (category) {
//         response = await axiosInstance.put(`/product-category/${category._id}`, {
//           productCategory,
//           remark
//         })
//         if (response.data.success) {
//           showSuccess('Product Category updated successfully!')
//           onCategoryAdded(response.data.data, true)
//         }
//       } else {
//         response = await axiosInstance.post('/product-category', {
//           productCategory,
//           remark
//         })
//         if (response.data.success) {
//           showSuccess('Product Category added successfully!')
//           onCategoryAdded(response.data.data, false)
//         }
//       }
//       setProductCategory('')
//       setRemark('')
//       onClose()
//     } catch (error) {
//       console.error('Error saving product category:', error)
//       showError('Failed to save product category')
//     }
//   }

//   return (
//     <CModal size="lg" visible={visible} onClose={onClose}>
//       <CModalHeader className="d-flex justify-content-between align-items-center">
//         <CModalTitle>{category ? 'Edit Product Category' : 'Add Product Category'}</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">
//               Product Category <span style={{ color: 'red' }}>*</span>
//             </label>
//             <CFormInput
//               type="text"
//               placeholder="Product Category"
//               value={productCategory}
//               onChange={(e) => setProductCategory(e.target.value)}
//               className="no-radius-input"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Remark</label>
//             <CFormInput
//               type="text"
//               placeholder="Product category remark"
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//               className="no-radius-input"
//             />
//           </div>
//         </div>
//       </CModalBody>

//       <CModalFooter>
//         <CButton className="submit-button" onClick={handleSubmit}>
//           Submit
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// AddProductCategory.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onCategoryAdded: PropTypes.func.isRequired,
//   category: PropTypes.object
// }

// export default AddProductCategory



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

const AddProductCategory = ({ visible, onClose, onCategoryAdded, category }) => {
  const [productCategory, setProductCategory] = useState('')
  const [remark, setRemark] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (category) {
      setProductCategory(category.productCategory || '')
      setRemark(category.remark || '')
    } else {
      setProductCategory('')
      setRemark('')
    }
    setErrors({})
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
          remark
        })
        if (response.data.success) {
          showSuccess('Product Category updated successfully!')
          if (onCategoryAdded) onCategoryAdded(response.data.data, true)
        }
      } else {
        response = await axiosInstance.post('/product-category', {
          productCategory,
          remark
        })
        if (response.data.success) {
          showSuccess('Product Category added successfully!')
          if (onCategoryAdded) onCategoryAdded(response.data.data, false)
        }
      }
      setProductCategory('')
      setRemark('')
      onClose()
    } catch (error) {
      console.error('Error saving product category:', error)
      showError('Failed to save product category')
    }
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <CModalTitle>{category ? 'Edit Product Category' : 'Add Product Category'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
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
