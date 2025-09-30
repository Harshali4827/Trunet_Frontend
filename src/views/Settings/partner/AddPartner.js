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

// const AddPartner = ({ visible, onClose, onPartnerAdded, partner }) => {
//   const [partnerName, setPartnerName] = useState('')

//   useEffect(() => {
//     if (partner) {
//       setPartnerName(partner.partnerName || '')
//     } else {
//       setPartnerName('')
//     }
//   }, [partner])

//   const handleSubmit = async () => {
//     if (!partnerName.trim()) {
//       showError('Partner name is required')
//       return
//     }

//     try {
//       let response
//       if (partner) {
//         response = await axiosInstance.put(`/partners/${partner._id}`, { partnerName })
//         if (response.data.success) {
//           showSuccess('Partner updated successfully!')
//           onPartnerAdded(response.data.data, true)
//         }
//       } else {
//         response = await axiosInstance.post('/partners', { partnerName })
//         if (response.data.success) {
//           showSuccess('Partner added successfully!')
//           onPartnerAdded(response.data.data, false)
//         }
//       }

//       setPartnerName('')
//       onClose()
//     } catch (error) {
//       console.error('Error saving partner:', error)
//       showError('Failed to save partner')
//     }
//   }

//   return (
//     <CModal size="lg" visible={visible} onClose={onClose}>
//       <CModalHeader className="d-flex justify-content-between align-items-center">
//         <CModalTitle>{partner ? 'Edit Partner' : 'Add Partner'}</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         <div className="mb-3">
//           <label className="form-label">
//             Partner Name <span style={{ color: 'red' }}>*</span>
//           </label>
//           <CFormInput
//             type="text"
//             placeholder="Enter partner name"
//             value={partnerName}
//             onChange={(e) => setPartnerName(e.target.value)}
//             className="no-radius-input"
//             style={{ width: '60%' }}
//             required
//           />
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

// AddPartner.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onPartnerAdded: PropTypes.func.isRequired,
//   partner: PropTypes.object
// }

// export default AddPartner


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
import '../../../css/form.css'   // <-- make sure this has .error, .error-input, .valid-input classes

const AddPartner = ({ visible, onClose, onPartnerAdded, partner }) => {
  const [partnerName, setPartnerName] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (partner) {
      setPartnerName(partner.partnerName || '')
    } else {
      setPartnerName('')
    }
    setErrors({})
  }, [partner, visible])

  const validateForm = () => {
    const newErrors = {}
    if (!partnerName.trim()) {
      newErrors.partnerName = 'This is a required field'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      let response
      if (partner) {
        response = await axiosInstance.put(`/partners/${partner._id}`, { partnerName })
        if (response.data.success) {
          showSuccess('Partner updated successfully!')
          if (onPartnerAdded) onPartnerAdded(response.data.data, true)
        }
      } else {
        response = await axiosInstance.post('/partners', { partnerName })
        if (response.data.success) {
          showSuccess('Partner added successfully!')
          if (onPartnerAdded) onPartnerAdded(response.data.data, false)
        }
      }

      setPartnerName('')
      onClose()
    } catch (error) {
      console.error('Error saving partner:', error)
      showError('Failed to save partner')
    }
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <CModalTitle>{partner ? 'Edit Partner' : 'Add Partner'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="mb-3">
          <label
            className={`form-label ${
              errors.partnerName
                ? 'error-label'
                : partnerName
                ? 'valid-label'
                : ''
            }`}
          >
            Partner Name <span style={{ color: 'red' }}>*</span>
          </label>
          <CFormInput
            type="text"
            placeholder="Enter partner name"
            value={partnerName}
            onChange={(e) => {
              setPartnerName(e.target.value)
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, partnerName: '' }))
              }
            }}
            className={`no-radius-input ${
              errors.partnerName
                ? 'error-input'
                : partnerName
                ? 'valid-input'
                : ''
            }`}
            style={{ width: '60%' }}
          />
          {errors.partnerName && (
            <span className="error">{errors.partnerName}</span>
          )}
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

AddPartner.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPartnerAdded: PropTypes.func,
  partner: PropTypes.object
}

export default AddPartner
