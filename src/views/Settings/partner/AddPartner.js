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

const AddPartner = ({ visible, onClose, onPartnerAdded, partner }) => {
  const [partnerName, setPartnerName] = useState('')
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ type: '', message: '' })
  useEffect(() => {
    if (partner) {
      setPartnerName(partner.partnerName || '')
    } else {
      setPartnerName('')
    }
    setErrors({})
    setAlert({ type: '', message: '' })
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
          setAlert({ type: 'success', message: 'Partner updated successfully!' })
          if (onPartnerAdded) onPartnerAdded(response.data.data, true)
        }
      } else {
        response = await axiosInstance.post('/partners', { partnerName })
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Partner added successfully!' })
          if (onPartnerAdded) onPartnerAdded(response.data.data, false)
        }
      }

      setPartnerName('')
      setTimeout(() => {
        setAlert({ type: '', message: '' })
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Error saving partner:', error)
      setAlert({ type: 'danger', message: 'Failed to save partner' })
    }
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <CModalTitle>{partner ? 'Edit Partner' : 'Add Partner'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {alert.message && (
          <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
            {alert.message}
          </CAlert>
        )}

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
