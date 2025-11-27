// import React, { useState, useEffect } from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CButton
// } from '@coreui/react'
// import PropTypes from 'prop-types'
// import '../../css/form.css'
// import DatePicker from 'src/utils/DatePicker'

// const ReportSearchmodel = ({ visible, onClose, onSearch, centers, initialSearchData }) => {
//   const [searchData, setSearchData] = useState({
//     center: '',
//     date: ''
//   })

//   useEffect(() => {
//     if (visible) {
//       setSearchData(initialSearchData || { center: '', date: '' });
//     }
//   }, [visible, initialSearchData])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setSearchData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleDateChange = (dateValue) => {
//     setSearchData(prev => ({ ...prev, date: dateValue }))
//   }

//   const handleSearch = () => {
//     onSearch(searchData)
//     onClose()
//   }

//   const handleClose = () => {
//     setSearchData(initialSearchData || { center: '', date: '' })
//     onClose()
//   }

//   return (
//     <CModal size="lg" visible={visible} onClose={handleClose}>
//       <CModalHeader>
//         <CModalTitle>Search</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         <div className="form-row">
//         <div className="form-group">
//             <label className="form-label">
//               Date
//             </label>
//             <DatePicker
//               value={searchData.date}
//               onChange={handleDateChange}
//               placeholder="Date"
//               className="no-radius-input date-input"
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="center">
//               Branch
//             </label>
//             <CFormSelect
//               id="center"
//               name="center"
//               value={searchData.center}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//             >
//               <option value="">SELECT</option>
//               {centers.map((center) => (
//                 <option key={center._id} value={center._id}>
//                   {center.centerName}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </div>
//       </CModalBody>

//       <CModalFooter>
//         <CButton 
//           color="secondary" 
//           className="me-2" 
//           onClick={handleClose}
//         >
//           Close
//         </CButton>
//         <CButton 
//           color="primary" 
//           onClick={handleSearch}
//         >
//           Search
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// ReportSearchmodel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   initialSearchData: PropTypes.object
// }

// export default ReportSearchmodel


import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import DatePicker from 'src/utils/DatePicker'

const ReportSearchmodel = ({ visible, onClose, onSearch, centers, initialSearchData }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    date: ''
  })
  const formatDateForPicker = (dateValue) => {
    if (!dateValue) return '';

    if (dateValue.includes(' to ')) {
      return dateValue;
    }

    return dateValue;
  };

  useEffect(() => {
    if (visible) {
      if (initialSearchData) {
        setSearchData({
          center: initialSearchData.center || '',
          date: formatDateForPicker(initialSearchData.date) || ''
        });
      } else {
        setSearchData({ center: '', date: '' });
      }
    }
  }, [visible, initialSearchData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (dateValue) => {
    setSearchData(prev => ({ ...prev, date: dateValue }))
  }

  const handleSearch = () => {
    onSearch(searchData)
    onClose()
  }

  const handleClose = () => {
    if (initialSearchData) {
      setSearchData({
        center: initialSearchData.center || '',
        date: formatDateForPicker(initialSearchData.date) || ''
      });
    } else {
      setSearchData({ center: '', date: '' });
    }
    onClose()
  }
  const handleReset = () => {
    setSearchData({ center: '', date: '' });
  }

  return (
    <CModal size="lg" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Date
            </label>
            <DatePicker
              value={searchData.date}
              onChange={handleDateChange}
              placeholder="Date"
              className="no-radius-input date-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="center">
              Branch
            </label>
            <CFormSelect
              id="center"
              name="center"
              value={searchData.center}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.centerName}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleReset}
        >
          Clear
        </CButton>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleClose}
        >
          Close
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ReportSearchmodel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  initialSearchData: PropTypes.object
}

ReportSearchmodel.defaultProps = {
  initialSearchData: null
}

export default ReportSearchmodel