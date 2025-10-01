import React from 'react'
import { CAlert } from '@coreui/react'
import PropTypes from 'prop-types'

const CustomAlert = ({ type, message, onClose }) => {
  if (!message) return null

  return (
    <CAlert color={type} dismissible onClose={onClose}>
      {message}
    </CAlert>
  )
}

CustomAlert.propTypes = {
  type: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
  message: PropTypes.string,
  onClose: PropTypes.func
}

export default CustomAlert
