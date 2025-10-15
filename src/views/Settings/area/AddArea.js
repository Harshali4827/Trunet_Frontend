import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CButton,
  CAlert
} from '@coreui/react'
import PropTypes from 'prop-types'
import axiosInstance from 'src/axiosInstance'
import '../../../css/form.css'

const AddArea = ({ visible, onClose, onAreaAdded, area }) => {
  const [partners, setPartners] = useState([])
  const [formData, setFormData] = useState({
    partnerId: '',
    areaName: ''
  })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ type: '', message: '' }) 

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axiosInstance.get('/partners')
        if (response.data.success) {
          setPartners(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching partners:', error)
      }
    }
    fetchPartners()
  }, [])

  useEffect(() => {
    if (area) {
      setFormData({
        partnerId: area.partner?._id || '',
        areaName: area.areaName || ''
      })
    } else {
      setFormData({ partnerId: '', areaName: '' })
    }
    setErrors({})
    setAlert({ type: '', message: '' })
  }, [area, visible])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    let newErrors = {}
    if (!formData.partnerId) newErrors.partnerId = 'This is a required field'
    if (!formData.areaName.trim()) newErrors.areaName = 'This is a required field'

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    try {
      let response
      if (area) {
        response = await axiosInstance.put(`/areas/${area._id}`, formData)
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Area updated successfully!' })
          onAreaAdded(response.data.data, true)
        }
      } else {
        response = await axiosInstance.post('/areas', formData)
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Area added successfully!' })
          onAreaAdded(response.data.data, false)
        }
      }

      setFormData({ partnerId: '', areaName: '' })
      setErrors({})
      setTimeout(() => {
        setAlert({ type: '', message: '' })
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Error saving area:', error)
      setAlert({ type: 'danger', message: 'Failed to save area' })
    }
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{area ? 'Edit Area' : 'Add Area'}</CModalTitle>
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
                errors.partnerId
                  ? 'error-label'
                  : formData.partnerId
                  ? 'valid-label'
                  : ''
              }`}
              htmlFor="partnerId"
            >
              Partner Name <span className="required">*</span>
            </label>
            <CFormSelect
              id="partnerId"
              name="partnerId"
              value={formData.partnerId}
              onChange={handleChange}
              className={`form-input no-radius-input ${
                errors.partnerId
                  ? 'error-input'
                  : formData.partnerId
                  ? 'valid-input'
                  : ''
              }`}
            >
              <option value="">SELECT</option>
              {partners.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.partnerName}
                </option>
              ))}
            </CFormSelect>
            {errors.partnerId && <span className="error">{errors.partnerId}</span>}
          </div>

          <div className="form-group">
            <label
              className={`form-label ${
                errors.areaName ? 'error-label' : formData.areaName ? 'valid-label' : ''
              }`}
              htmlFor="areaName"
            >
              Area Name <span className="required">*</span>
            </label>
            <CFormInput
              type="text"
              id="areaName"
              name="areaName"
              placeholder="Area"
              value={formData.areaName}
              onChange={handleChange}
              className={`form-input no-radius-input ${
                errors.areaName ? 'error-input' : formData.areaName ? 'valid-input' : ''
              }`}
            />
            {errors.areaName && <span className="error">{errors.areaName}</span>}
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

AddArea.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAreaAdded: PropTypes.func.isRequired,
  area: PropTypes.object
}

export default AddArea
