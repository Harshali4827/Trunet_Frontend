// import React, { useState} from 'react'
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
// import '../../css/search.css';
// import DatePicker from 'src/utils/DatePicker';

// const SearchSaleInvoice = ({ visible, onClose, onSearch, centers, resellers }) => {
//   const [searchData, setSearchData] = useState({
//     center: '',
//     reseller: '',
//     indentDate: '',
//     indentStartDate: '',
//     indentEndDate: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setSearchData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleIndentDateChange = (dateValue) => {
//     if (dateValue && dateValue.includes(' to ')) {
//       const [startDate, endDate] = dateValue.split(' to ');
//       const formatDateForAPI = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         return `${year}-${month}-${day}`;
//       };
      
//       setSearchData(prev => ({ 
//         ...prev, 
//         indentStartDate: formatDateForAPI(startDate),
//         indentEndDate: formatDateForAPI(endDate)
//       }));
//     } else {
//       setSearchData(prev => ({ 
//         ...prev, 
//         indentStartDate: '',
//         indentEndDate: ''
//       }));
//     }
//   };

//   const handleSearch = () => {
//     const apiSearchData = {
//       keyword: searchData.indentNo,
//       center: searchData.center,
//       outlet: searchData.outlet,
//       status: searchData.currentStatus !== 'Any Status' ? searchData.currentStatus : ''
//     };
//     if (searchData.startDate && searchData.endDate) {
//       apiSearchData.startDate = searchData.startDate;
//       apiSearchData.endDate = searchData.endDate;
//     }
//     if (searchData.indentStartDate && searchData.indentEndDate) {
//       apiSearchData.startDate = searchData.indentStartDate;
//       apiSearchData.endDate = searchData.indentEndDate;
//     }

//     console.log('Search Data:', apiSearchData);
//     onSearch(apiSearchData);
//     onClose();
//   }
//   return (
//     <>
//       <CModal size="lg" visible={visible} onClose={onClose}>
//         <CModalHeader>
//           <CModalTitle>Search</CModalTitle>
//         </CModalHeader>

//         <CModalBody>
//           <div className="form-row">
//           <div className="form-group">
//               <label className="form-label">Reseller</label>
//               <CFormSelect
//                 name="reseller"
//                 value={searchData.reseller}
//                 onChange={handleChange}
//                 className="form-input no-radius-input"
//               >
//                 <option value="">SELECT</option>
//                 {resellers.map((reseller) => (
//                   <option key={reseller._id} value={reseller._id}>
//                     {reseller.businessName}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Center</label>
//               <CFormSelect
//                 name="center"
//                 value={searchData.center}
//                 onChange={handleChange}
//                 className="form-input no-radius-input"
//               >
//                 <option value="">SELECT</option>
//                 {centers.map((center) => (
//                   <option key={center._id} value={center._id}>
//                     {center.centerName}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>
//           </div>
        
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Date</label>
//               <DatePicker
//                 value={searchData.indentStartDate && searchData.indentEndDate 
//                   ? `${searchData.indentStartDate.split('-').reverse().join('-')} to ${searchData.indentEndDate.split('-').reverse().join('-')}`
//                   : ''}
//                 onChange={handleIndentDateChange}
//                 placeholder="Indent Date"
//                 className="no-radius-input date-input"
//               />
//             </div>
//             <div className="form-group">

//             </div>
//           </div>
//         </CModalBody>

//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose}>
//             Close
//           </CButton>
//           <CButton color="primary" onClick={handleSearch}>
//             Search
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// SearchSaleInvoice.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   resellers: PropTypes.array.isRequired
// }

// export default SearchSaleInvoice;


import React, { useState } from 'react'
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
import '../../css/search.css';
import DatePicker from 'src/utils/DatePicker';

const SearchSaleInvoice = ({ visible, onClose, onSearch, centers, resellers }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    reseller: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(' to ')) {
      const [startDate, endDate] = dateValue.split(' to ');
      
      // The DatePicker returns dates in DD-MM-YYYY format
      // Convert to YYYY-MM-DD for API
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
    const apiSearchData = {
      center: searchData.center,
      reseller: searchData.reseller
    };

    // Add date filters if they exist
    if (searchData.startDate && searchData.endDate) {
      apiSearchData.startDate = searchData.startDate;
      apiSearchData.endDate = searchData.endDate;
    }

    console.log('Search Data for API:', apiSearchData);
    onSearch(apiSearchData);
    onClose();
  }

  const handleReset = () => {
    setSearchData({
      center: '',
      reseller: '',
      startDate: '',
      endDate: ''
    });
  }

  return (
    <>
      <CModal size="lg" visible={visible} onClose={onClose}>
        <CModalHeader>
          <CModalTitle>Search Sale Invoices</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reseller</label>
              <CFormSelect
                name="reseller"
                value={searchData.reseller}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value="">SELECT RESELLER</option>
                {resellers.map((reseller) => (
                  <option key={reseller._id} value={reseller._id}>
                    {reseller.businessName}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="form-group">
              <label className="form-label">Center</label>
              <CFormSelect
                name="center"
                value={searchData.center}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value="">SELECT CENTER</option>
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
              <label className="form-label">Date Range</label>
              <DatePicker
                value={searchData.startDate && searchData.endDate 
                  ? `${searchData.startDate.split('-').reverse().join('-')} to ${searchData.endDate.split('-').reverse().join('-')}`
                  : ''}
                onChange={handleDateChange}
                placeholder="Select date range"
                className="no-radius-input date-input"
              />
            </div>
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={handleReset}>
            Reset
          </CButton>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSearch}>
            Search
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

SearchSaleInvoice.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired
}

export default SearchSaleInvoice;