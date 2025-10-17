// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CListGroup,
//   CListGroupItem,
//   CSpinner,
// } from '@coreui/react';
// import axiosInstance from 'src/axiosInstance';


// const CustomerSerialNumber = ({ visible, onClose, productId, productName, warehouseId }) => {
//   const [availableSerials, setAvailableSerials] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchAvailableSerials = async () => {
//       if (!visible || !productId || !warehouseId) return;

//       try {
//         setLoading(true);
//         setError('');

//         const response = await axiosInstance.get(
//           `/stockpurchase/serial-numbers/product/${warehouseId}/${productId}`
//         );

//         if (response.data.success) {
//           setAvailableSerials(response.data.data.availableSerials || []);
//         } else {
//           throw new Error(response.data.message || 'Failed to fetch serial numbers');
//         }
//       } catch (err) {
//         console.error('Error fetching serial numbers:', err);
//         setError(err.response?.data?.message || err.message || 'Failed to fetch serial numbers');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAvailableSerials();
//   }, [visible, productId, warehouseId]);

//   return (
//     <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
//       <CModalHeader closeButton>
//         <CModalTitle>Available Serials for {productName}</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         {loading && (
//           <div className="text-center py-4">
//             <CSpinner color="primary" />
//             <p className="mt-2">Loading serial numbers...</p>
//           </div>
//         )}

//         {!loading && error && (
//           <div className="text-danger text-center py-3">
//             <strong>{error}</strong>
//           </div>
//         )}

//         {!loading && !error && (
//           <>
//             {availableSerials.length > 0 ? (
//               <CListGroup>
//                 {availableSerials.map((serial, index) => (
//                   <CListGroupItem key={index}>
//                     {serial.serialNumber || serial.SerialNo || serial}
//                   </CListGroupItem>
//                 ))}
//               </CListGroup>
//             ) : (
//               <p className="text-center text-muted">No available serial numbers found.</p>
//             )}
//           </>
//         )}
//       </CModalBody>

//       <CModalFooter>
//         <CButton color="secondary" onClick={onClose}>
//           Close
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   );
// };
// CustomerSerialNumber.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   productId: PropTypes.string.isRequired,
//   productName: PropTypes.string.isRequired,
//   warehouseId: PropTypes.string.isRequired,
// };

// CustomerSerialNumber.defaultProps = {
//   productId: '',
//   productName: '',
//   warehouseId: '',
// };

// export default CustomerSerialNumber;


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
} from '@coreui/react'
import axiosInstance from 'src/axiosInstance'

const CustomerSerialNumber = ({ visible, onClose, productId, productName, warehouseId }) => {
  const [availableSerials, setAvailableSerials] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSerial, setSelectedSerial] = useState('')
  const [damageChecked, setDamageChecked] = useState(false)

  useEffect(() => {
    const fetchAvailableSerials = async () => {
      if (!visible || !productId || !warehouseId) return

      try {
        setLoading(true)
        setError('')
        setAvailableSerials([])
        setSelectedSerial('')
        setDamageChecked(false)

        const response = await axiosInstance.get(
          `/stockpurchase/serial-numbers/product/${warehouseId}/${productId}`,
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
  }, [visible, productId, warehouseId])

  const handleSave = async () => {
    try {
      const payload = {
        productId,
        warehouseId,
        selectedSerial,
        isDamage: damageChecked,
      }

      console.log('Saving payload:', payload)
      onClose()
    } catch (err) {
      console.error('Error saving changes:', err)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>Serial Numbers for {productName}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {loading && (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <p className="mt-2">Loading serial numbers...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-danger text-center py-3">
            <strong>{error}</strong>
          </div>
        )}

        {!loading && !error && availableSerials.length > 0 && (
          <CTable bordered responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Serial Number</CTableHeaderCell>
                <CTableHeaderCell>Damage</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>
                  <CFormSelect
                    value={selectedSerial}
                    onChange={(e) => setSelectedSerial(e.target.value)}
                  >
                    <option value="">-- Select Serial Number --</option>
                    {availableSerials.map((s, index) => (
                      <option
                        key={index}
                        value={s.serialNumber || s.SerialNo || s}
                      >
                        {s.serialNumber || s.SerialNo || s}
                      </option>
                    ))}
                  </CFormSelect>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CFormCheck
                    checked={damageChecked}
                    onChange={(e) => setDamageChecked(e.target.checked)}
                    label="Damage old serial product"
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        )}

        {!loading && !error && availableSerials.length === 0 && (
          <p className="text-center text-muted">No available serial numbers found.</p>
        )}
      </CModalBody>

      <CModalFooter>

        <CButton color="secondary" onClick={onClose}>
        Close
        </CButton>
        <button 
          className='reset-button'
          onClick={handleSave}
        >
          Save Changes
        </button>
      </CModalFooter>
    </CModal>
  )
}

CustomerSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  warehouseId: PropTypes.string.isRequired,
}

CustomerSerialNumber.defaultProps = {
  productId: '',
  productName: '',
  warehouseId: '',
}

export default CustomerSerialNumber
