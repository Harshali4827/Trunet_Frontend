// import React, { useState,useEffect} from 'react'
// import PropTypes from 'prop-types'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CFormInput,
//   CFormTextarea
// } from '@coreui/react'

// const ShipGoodsModal = ({ visible, onClose, onSubmit, initialData }) => {
//     const [shipmentData, setShipmentData] = useState({
//       shippedDate: new Date().toISOString().split('T')[0],
//       expectedDeliveryDate: new Date().toISOString().split('T')[0],
//       shipmentDetails: '',
//       shipmentRemark: '',
//       documents: []
//     })


//     useEffect(() => {
//       if (initialData) {
//         setShipmentData(initialData)
//       }
//     }, [initialData])
  
//     const handleChange = (field, value) => {
//       setShipmentData(prev => ({ ...prev, [field]: value }))
//     }
  
//     const handleFileChange = (e) => {
//       handleChange('documents', Array.from(e.target.files))
//     }
  
//     const handleSubmit = () => {
//       onSubmit(shipmentData)
//     }
  
//     return (
//       <CModal visible={visible} onClose={onClose} size="lg">
//         <CModalHeader closeButton>
//           <CModalTitle>Shipment</CModalTitle>
//         </CModalHeader>
  
//         <CModalBody>
//           <CFormInput
//             type="date"
//             label="Shipment Date"
//             value={shipmentData.shippedDate}
//             onChange={e => handleChange('shippedDate', e.target.value)}
//             className="mb-3"
//           />
  
//           <CFormInput
//             type="date"
//             label="Expected Delivery Date"
//             value={shipmentData.expectedDeliveryDate}
//             onChange={e => handleChange('expectedDeliveryDate', e.target.value)}
//             className="mb-3"
//           />
  
//           <CFormInput
//             type="file"
//             label="File Attachment"
//             multiple
//             onChange={handleFileChange}
//           />
  
//           <CFormTextarea
//             label="Shipment Details"
//             rows={3}
//             value={shipmentData.shipmentDetails}
//             onChange={e => handleChange('shipmentDetails', e.target.value)}
//             className="mb-3"
//           />
  
//           <CFormTextarea
//             label="Shipment Remark"
//             rows={2}
//             value={shipmentData.shipmentRemark}
//             onChange={e => handleChange('shipmentRemark', e.target.value)}
//             className="mb-3"
//           />
//         </CModalBody>
  
//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleSubmit}>
//             Submit Shipment
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     )
//   }

// ShipGoodsModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   initialData: PropTypes.object,
// }

// export default ShipGoodsModal



import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormTextarea
} from '@coreui/react'

const getToday = () => new Date().toISOString().split('T')[0];

const ShipGoodsModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [shipmentData, setShipmentData] = useState({
    shippedDate: getToday(),
    expectedDeliveryDate: getToday(),
    shipmentDetails: '',
    shipmentRemark: '',
    documents: []
  });

  useEffect(() => {
    if (initialData) {
      setShipmentData({
        shippedDate: initialData.shippedDate || getToday(),
        expectedDeliveryDate: initialData.expectedDeliveryDate || getToday(),
        shipmentDetails: initialData.shipmentDetails || '',
        shipmentRemark: initialData.shipmentRemark || '',
        documents: initialData.documents || []
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setShipmentData(prev => ({ ...prev, [field]: value }));
  }

  const handleFileChange = (e) => {
    handleChange('documents', Array.from(e.target.files));
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit(shipmentData);
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>Shipment</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CFormInput
          type="date"
          label="Shipment Date"
          value={shipmentData.shippedDate}
          onChange={e => handleChange('shippedDate', e.target.value)}
          className="mb-3"
        />

        <CFormInput
          type="date"
          label="Expected Delivery Date"
          value={shipmentData.expectedDeliveryDate}
          onChange={e => handleChange('expectedDeliveryDate', e.target.value)}
          className="mb-3"
        />

        <CFormInput
          type="file"
          label="File Attachment"
          multiple
          onChange={handleFileChange}
        />

        <CFormTextarea
          label="Shipment Details"
          rows={3}
          value={shipmentData.shipmentDetails}
          onChange={e => handleChange('shipmentDetails', e.target.value)}
          className="mb-3"
        />

        <CFormTextarea
          label="Shipment Remark"
          rows={2}
          value={shipmentData.shipmentRemark}
          onChange={e => handleChange('shipmentRemark', e.target.value)}
          className="mb-3"
        />
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
         Close
        </CButton>
        <CButton className='reset-button' onClick={handleSubmit}>
          Submit
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ShipGoodsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object
}

export default ShipGoodsModal
