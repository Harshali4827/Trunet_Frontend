// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/form.css';

// const AddReportSubmission = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     name: '',
//     mobile: '',
//     email: '',
   
//   });
//   const [errors, setErrors] = useState({});
//   const [centers, setCenters] = useState([]);
//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const res = await axiosInstance.get('/centers');
//         setCenters(res.data.data || []);
//       } catch (error) {
//        console.log(error)
//       }
//     };
//     fetchCenters();
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchCustomer(id);
//     }
//   }, [id]);

//   const fetchCustomer = async (customerId) => {
//     try {
//       const res = await axiosInstance.get(`/customers/${customerId}`);
//       setFormData(res.data.data);
//     } catch (error) {
//      console.log("error fetching customers", error)
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let newErrors = {};
//     ['username', 'mobile'].forEach((field) => {
//       if (!formData[field]) newErrors[field] = 'This is a required field';
//     });

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(`/customers/${id}`, formData);
//       } else {
//         await axiosInstance.post('/customers', formData);
//       }
//       navigate('/customers-list');
//     } catch (error) {
//       console.error('Error saving customer:', error);
//     }
//   };

//   return (
//     <div className="form-container">
//       <div className="title">{id ? 'Edit' : 'Add'} Closing Stock</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//             <div className="form-group">
//                 <label 
//                   className={`form-label 
//                     ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
//                   htmlFor="date">
//                   Date <span className="required">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   className={`form-input 
//                     ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
//                   value={formData.date}
//                   onChange={handleChange}
//                 />
//                 {errors.date && <span className="error-text">{errors.date}</span>}
//               </div>
//               <div className="form-group">
//               Stock closing for other center
//                 </div>
//                 <div className="form-group">
//                 <label className={`form-label 
//                   ${errors.centerId ? 'error-label' : formData.centerId ? 'valid-label' : ''}`}
//                   htmlFor="centerId">
//                   Center <span className="required">*</span>
//                 </label>
//                 <select
//                   id="centerId"
//                   name="centerId"
//                   className={`form-input 
//                     ${errors.centerId ? 'error-input' : formData.centerId ? 'valid-input' : ''}`}
//                   value={formData.centerId}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   {centers.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.centerName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.centerId && <span className="error">{errors.centerId}</span>}
//               </div>

//               <div className="form-group">
//                 <label className="form-label" htmlFor="remark">
//                   Remark  <span className="required">*</span>
//                 </label>
//                 <textarea
//                   id="remark"
//                   name="remark"
//                   className="form-textarea"
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Remark"
//                 />
//                  {errors.remark && <span className="error">{errors.remark}</span>}
//               </div>
//             </div>
//             <div className="form-footer">
//               <button type="submit" className="reset-button">
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddReportSubmission;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import { CButton } from '@coreui/react';

const AddReportSubmission = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    mobile: '',
    email: '',
    centerId: '',
    remark: '',
  });

  const [errors, setErrors] = useState({});
  const [centers, setCenters] = useState([]);
  const [otherCenter, setOtherCenter] = useState(false); // 👈 for checkbox

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers');
        setCenters(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id]);

  const fetchCustomer = async (customerId) => {
    try {
      const res = await axiosInstance.get(`/customers/${customerId}`);
      setFormData(res.data.data);
    } catch (error) {
      console.log("error fetching customers", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.date) newErrors.date = 'This is a required field';
    if (otherCenter && !formData.centerId) newErrors.centerId = 'This is a required field';
    if (!formData.remark) newErrors.remark = 'This is a required field';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/customers/${id}`, formData);
      } else {
        await axiosInstance.post('/customers', formData);
      }
      navigate('/customers-list');
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };
  const handleBack = () => {
    navigate('/report-submission');
  };
  return (
    <div className="form-container">
      <div className="title">
      <CButton
          size="sm"
          className="back-button me-3"
          onClick={handleBack}
        >
          <i className="fa fa-fw fa-arrow-left"></i>Back
        </CButton>
        {id ? 'Edit' : 'Add'} Closing Stock</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              {/* Date */}
              <div className="form-group">
                <label 
                  className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
                  htmlFor="date"
                >
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`form-input ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="form-group" style={{ marginTop: "30px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={otherCenter}
                    onChange={(e) => setOtherCenter(e.target.checked)}
                  />{' '}
                  Stock closing for other center
                </label>
              </div>

              {otherCenter && (
                <div className="form-group">
                  <label 
                    className={`form-label ${errors.centerId ? 'error-label' : formData.centerId ? 'valid-label' : ''}`}
                    htmlFor="centerId"
                  >
                    Center <span className="required">*</span>
                  </label>
                  <select
                    id="centerId"
                    name="centerId"
                    className={`form-input ${errors.centerId ? 'error-input' : formData.centerId ? 'valid-input' : ''}`}
                    value={formData.centerId}
                    onChange={handleChange}
                  >
                    <option value="">SELECT</option>
                    {centers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.centerName}
                      </option>
                    ))}
                  </select>
                  {errors.centerId && <span className="error">{errors.centerId}</span>}
                </div>
              )}

              <div className="form-group">
                <label 
                className={`form-label ${errors.remark ? 'error-label' : formData.remark ? 'valid-label' : ''}`}
                htmlFor="remark">
                  Remark <span className="required">*</span>
                </label>
                <textarea
                  id="remark"
                  name="remark"
                  className={`form-textarea ${errors.remark ? 'error-input' : formData.remark ? 'valid-input' : ''}`}
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Remark"
                />
                {errors.remark && <span className="error">{errors.remark}</span>}
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="reset-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReportSubmission;
