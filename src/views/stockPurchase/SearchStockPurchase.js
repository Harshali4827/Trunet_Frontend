// import React, { useState, useEffect } from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormInput,
//   CFormSelect,
//   CButton
// } from '@coreui/react'
// import PropTypes from 'prop-types'
// import '../../css/form.css'
// import DatePicker from 'src/utils/DatePicker'

// const SearchStockPurchase = ({ visible, onClose, onSearch, centers }) => {
//   const [searchData, setSearchData] = useState({
//     keyword: '',
//     outlet: '',
//     startDate: '',
//     endDate: ''
//   })

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({ 
//         keyword: '', 
//         outlet: '', 
//         startDate: '', 
//         endDate: '' 
//       })
//     }
//   }, [visible])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setSearchData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleDateChange = (dateValue) => {
//     if (dateValue && dateValue.includes(' to ')) {
//       const [startDate, endDate] = dateValue.split(' to ');
//       const formatDateForAPI = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         return `${year}-${month}-${day}`;
//       };
      
//       setSearchData(prev => ({ 
//         ...prev, 
//         startDate: formatDateForAPI(startDate),
//         endDate: formatDateForAPI(endDate)
//       }));
//     } else {
//       setSearchData(prev => ({ 
//         ...prev, 
//         startDate: '',
//         endDate: ''
//       }));
//     }
//   };

//   const handleSearch = () => {
//     if (searchData.startDate && searchData.endDate) {
//       const start = new Date(searchData.startDate);
//       const end = new Date(searchData.endDate);
//       if (start > end) {
//         alert('Start date cannot be after end date');
//         return;
//       }
//     }
    
//     onSearch(searchData)
//     onClose()
//   }

//   const handleReset = () => {
//     setSearchData({ 
//       keyword: '', 
//       outlet: '', 
//       startDate: '', 
//       endDate: '' 
//     })
//     onSearch({ 
//       keyword: '', 
//       outlet: '', 
//       startDate: '', 
//       endDate: '' 
//     })
//     onClose()
//   }

//   const handleClose = () => {
//     onClose()
//   }

//   return (
//     <CModal size="lg" visible={visible} onClose={handleClose}>
//       <CModalHeader>
//         <CModalTitle>Search</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="keyword">
//               Keyword
//             </label>
//             <CFormInput
//               type="text"
//               id="keyword"
//               name="keyword"
//               value={searchData.keyword}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//               placeholder='Keyword'
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="outlet">
//               Outlet
//             </label>
//             <CFormSelect
//               id="outlet"
//               name="outlet"
//               value={searchData.outlet}
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
        
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="date">
//               Date Range
//             </label>
//             <DatePicker
//               value={searchData.date}
//               onChange={handleDateChange}
//               placeholder="Date"
//               className="no-radius-input date-input"
//             />
//           </div>
//         </div>
//       </CModalBody>

//       <CModalFooter>
//         <CButton 
//           color="secondary" 
//           className="me-2" 
//           onClick={handleReset}
//         >
//           Clear All
//         </CButton>
//         <CButton 
//           color="primary" 
//           onClick={handleSearch}
//         >
//           Apply Filters
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// SearchStockPurchase.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired
// }

// export default SearchStockPurchase




import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import DatePicker from 'src/utils/DatePicker'

const SearchStockPurchase = ({ visible, onClose, onSearch, centers }) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    outlet: '',
    startDate: '',
    endDate: ''
  })

  // Convert startDate and endDate to DatePicker format
  const formatDateForPicker = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Get the value for DatePicker
  const getDatePickerValue = () => {
    if (searchData.startDate && searchData.endDate) {
      return `${formatDateForPicker(searchData.startDate)} to ${formatDateForPicker(searchData.endDate)}`;
    }
    return '';
  };

  useEffect(() => {
    if (!visible) {
      setSearchData({ 
        keyword: '', 
        outlet: '', 
        startDate: '', 
        endDate: '' 
      })
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(' to ')) {
      const [startDate, endDate] = dateValue.split(' to ');
      const formatDateForAPI = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
      };
      
      setSearchData(prev => ({ 
        ...prev, 
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate)
      }));
    } else {
      setSearchData(prev => ({ 
        ...prev, 
        startDate: '',
        endDate: ''
      }));
    }
  };

  const handleSearch = () => {
    if (searchData.startDate && searchData.endDate) {
      const start = new Date(searchData.startDate);
      const end = new Date(searchData.endDate);
      if (start > end) {
        alert('Start date cannot be after end date');
        return;
      }
    }
    
    onSearch(searchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({ 
      keyword: '', 
      outlet: '', 
      startDate: '', 
      endDate: '' 
    })
    onSearch({ 
      keyword: '', 
      outlet: '', 
      startDate: '', 
      endDate: '' 
    })
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <CModal size="lg" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="keyword">
              Keyword
            </label>
            <CFormInput
              type="text"
              id="keyword"
              name="keyword"
              value={searchData.keyword}
              onChange={handleChange}
              className="form-input no-radius-input"
              placeholder='Keyword'
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="outlet">
              Outlet
            </label>
            <CFormSelect
              id="outlet"
              name="outlet"
              value={searchData.outlet}
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
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              Date Range
            </label>
            {/* Pass the formatted date value to DatePicker */}
            <DatePicker
              value={getDatePickerValue()} // This is the key fix
              onChange={handleDateChange}
              placeholder="Date"
              className="no-radius-input date-input"
            />
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
         className='reset-button'
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

SearchStockPurchase.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired
}

export default SearchStockPurchase