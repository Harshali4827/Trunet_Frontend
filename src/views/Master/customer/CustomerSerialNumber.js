import React, { useEffect, useState } from 'react';
import '../../../css/form.css'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CFormCheck,
  CAlert
} from '@coreui/react'
import axiosInstance from 'src/axiosInstance'
import { showSuccess, showError } from 'src/utils/sweetAlerts'

const CustomerSerialNumber = ({ 
  visible, 
  onClose, 
  productId, 
  productName, 
  usageId, 
  oldSerialNumber, 
  onReplaceSuccess 
}) => {
  const [availableSerials, setAvailableSerials] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [selectedSerial, setSelectedSerial] = useState('')
  const [markAsDamage, setMarkAsDamage] = useState(false)

  useEffect(() => {
    const fetchAvailableSerials = async () => {
      if (!visible || !productId) return

      try {
        setLoading(true)
        setError('')
        setAvailableSerials([])
        setSelectedSerial('')
        setMarkAsDamage(false)

        const response = await axiosInstance.get(
          `/stockrequest/serial-numbers/product/${productId}`,
        )

        if (response.data.success) {
          setAvailableSerials(response.data.data.availableSerials || [])
        } else {
          throw new Error(response.data.message || 'Failed to fetch serial numbers')
        }
      } catch (err) {
        console.error('Error fetching serial numbers:', err)
        setError(err.response?.data?.message || err.message || 'Failed to fetch serial numbers')
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableSerials()
  }, [visible, productId])

  const handleSave = async () => {
    if (!selectedSerial && !markAsDamage) {
      showError('Please select either a new serial number for replacement or mark as damage')
      return
    }

    try {
      setSaving(true)
      const requests = []
      if (selectedSerial) {
        const replacePayload = {
          originalUsageId: usageId,
          productId: productId,
          oldSerialNumber: oldSerialNumber,
          newSerialNumber: selectedSerial
        }
        requests.push(
          axiosInstance.post('/stockusage/replace-serial', replacePayload)
        )
      }

      if (markAsDamage) {
        const damagePayload = {
          usageId: usageId,
          serialNumber: oldSerialNumber,
          remark: "Product marked as damaged - returned from customer"
        }
        requests.push(
          axiosInstance.post('/damage/damage-returns', damagePayload)
        )
      }

      const responses = await Promise.all(requests)
      const allSuccess = responses.every(response => response.data.success)
      
      if (allSuccess) {
        let successMessage = ''
        
        if (selectedSerial && markAsDamage) {
          successMessage = `Serial number replaced successfully and old serial ${oldSerialNumber} marked as damaged!`
        } else if (selectedSerial) {
          successMessage = `Serial number replaced successfully!`
        } else if (markAsDamage) {
          successMessage = `Serial number ${oldSerialNumber} marked as damaged successfully!`
        }

        showSuccess(successMessage)
        
        if (onReplaceSuccess) {
          onReplaceSuccess()
        }
        onClose()
      } else {
        throw new Error('One or more operations failed')
      }

    } catch (err) {
      console.error('Error in save operation:', err)
      showError(err.response?.data?.message || err.message || 'Failed to process request')
    } finally {
      setSaving(false)
    }
  }
  
  const handleDamageCheckbox = (event) => {
    setMarkAsDamage(event.target.checked)
  }

  const toggleDamageCheckbox = () => {
    setMarkAsDamage(!markAsDamage)
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>Replace/Damage product serial - {productName}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {loading && (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <p className="mt-2">Loading available serial numbers...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-danger text-center py-3">
            <strong>{error}</strong>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-3">
              <strong>Current Serial Number:</strong> {oldSerialNumber}
            </div>
            
            <CTable bordered responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>New Serial No.</CTableHeaderCell>
                  <CTableHeaderCell>Damage</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>
                    <CFormSelect
                      value={selectedSerial}
                      onChange={(e) => setSelectedSerial(e.target.value)}
                      disabled={saving}
                    >
                      <option value="">-- Select New Serial Number --</option>
                      {availableSerials.map((serial, index) => (
                        <option
                          key={index}
                          value={serial.serialNumber || serial.SerialNo || serial}
                        >
                          {serial.serialNumber || serial.SerialNo || serial}
                        </option>
                      ))}
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell className="fw-bold">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="damageCheckbox"
                        checked={markAsDamage}
                        onChange={handleDamageCheckbox}
                        disabled={saving}
                      />
                      <label className="form-check-label" htmlFor="damageCheckbox">
                        Damaged old serial product
                      </label>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </>
        )}

        {!loading && !error && availableSerials.length === 0 && (
          <CAlert color="warning" className="text-center">
            No available serial numbers found for replacement.
          </CAlert>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </CButton>

        <CButton 
          color="primary" 
          onClick={handleSave}
          disabled={(!selectedSerial && !markAsDamage) || saving}
        >
          {saving ? <CSpinner size="sm" /> : 'Save Changes'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

CustomerSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  usageId: PropTypes.string.isRequired,
  oldSerialNumber: PropTypes.string.isRequired,
  onReplaceSuccess: PropTypes.func
}

CustomerSerialNumber.defaultProps = {
  productId: '',
  productName: '',
  usageId: '',
  oldSerialNumber: ''
}

export default CustomerSerialNumber