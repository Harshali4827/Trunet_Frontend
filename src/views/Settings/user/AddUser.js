// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../../css/form.css';
// import { CAlert } from '@coreui/react';

// const AddUser = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     fullName: '',
//     username:'',
//     email: '',
//     mobile: '',
//     password:'',
//     confirmPassword:'',
//     role: '',
//     center: '',
//     status: ''
//   });

//   const [centers, setCenters] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ type: '', message: '' })

//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get('/centers');
//       setCenters(res.data.data || []);
//     } catch (error) {
//       console.log(error)
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const res = await axiosInstance.get('/role');
//       setRoles(res.data.data || []);
//     } catch (error) {
//       console.log(error)
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchData(id);
//     }
//     fetchRoles();
//     fetchCenters();
//   }, [id]);

//   const fetchData = async (itemId) => {
//     try {
//       const res = await axiosInstance.get(`/auth/user/${itemId}`);
//       const user = res.data.data.user;
  
//       setFormData({
//         fullName: user.fullName || '',
//         email: user.email || '',
//         username: user.username || '',
//         mobile: user.mobile || '',
//         password: '',
//         confirmPassword: '',
//         role: user.role?._id || '',
//         center: user.center?._id || '',
//         status: user.status || ''
//       });
//     } catch (error) {
//       console.log("error fetching data", error);
//     }
//   };  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Clear previous errors
//     setErrors({});

//     let newErrors = {};
//     ['fullName', 'mobile','username','email', 'center', 'password','confirmPassword','role','status'].forEach((field) => {
//       if (!formData[field]) newErrors[field] = 'This is a required field';
//     });

//     // Password confirmation validation
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(`/auth/user/${id}`, formData);
//         setAlert({ type: 'success', message: 'Data updated successfully!' })
//       } else {
//         await axiosInstance.post('/auth/register', formData);
//         setAlert({ type: 'success', message: 'Data saved successfully!' })
//       }
//       setTimeout(() => navigate('/user-list'),1500);
//     } catch (error) {
//       console.error('Error saving Data:', error)
    
//       let message = 'Failed to save Data. Please try again!'
//       let validationErrors = {};
    
//       if (error.response) {
//         const responseData = error.response.data;
        
//         // Handle validation errors from backend
//         if (responseData.success === false && responseData.errors && Array.isArray(responseData.errors)) {
//           responseData.errors.forEach(errorMsg => {
//             // Map backend error messages to specific fields
//             if (errorMsg.toLowerCase().includes('username')) {
//               validationErrors.username = errorMsg;
//             } else if (errorMsg.toLowerCase().includes('email')) {
//               validationErrors.email = errorMsg;
//             } else if (errorMsg.toLowerCase().includes('password')) {
//               validationErrors.password = errorMsg;
//             } else if (errorMsg.toLowerCase().includes('mobile')) {
//               validationErrors.mobile = errorMsg;
//             } else if (errorMsg.toLowerCase().includes('fullname')) {
//               validationErrors.fullName = errorMsg;
//             } else {
//               // For generic errors, show in alert
//               message = errorMsg;
//             }
//           });
          
//           // If we have field-specific validation errors, set them
//           if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//           }
//         }
        
//         // Use the general message if no specific field errors were found
//         if (Object.keys(validationErrors).length === 0) {
//           message = responseData?.message || responseData?.error || message;
//         }
//       } else if (error.request) {
//         message = 'No response from server. Please check your connection.';
//       } else {
//         message = error.message;
//       }
    
//       // Only show alert if we have a general message and no field-specific errors
//       if (message && Object.keys(validationErrors).length === 0) {
//         setAlert({ type: 'danger', message });
//       }
//     }    
//   };

//   const handleReset = () => {
//     setFormData({
//         fullName: '',
//         username:'',
//         email: '',
//         mobile: '',
//         password:'',
//         confirmPassword:'',
//         role: '',
//         center: '',
//         status: ''
//     });
//     setErrors({});
//     setAlert({ type: '', message: '' });
//   };

//   return (
//     <div className="form-container">
//       <div className="title">{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           {alert.message && (
//             <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
//                {alert.message}
//             </CAlert>
//           )}
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <div className="form-group">
//                 <label 
//                   className={`form-label 
//                     ${errors.role ? 'error-label' : formData.role ? 'valid-label' : ''}`}
//                   htmlFor="role">
//                   Role <span className="required">*</span>
//                 </label>
//                 <select
//                   type="text"
//                   id="role"
//                   name="role"
//                   className={`form-input 
//                     ${errors.role ? 'error-input' : formData.role ? 'valid-input' : ''}`}
//                   value={formData.role}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   {
//                     roles.map((role) =>(
//                       <option key={role._id} value={role._id}>
//                         {role.roleTitle}
//                       </option>
//                     ))
//                   }
//                 </select>
//                 {errors.role && <span className="error">{errors.role}</span>}
//               </div>
//               <div className="form-group">
//                 <label className={`form-label 
//                   ${errors.center ? 'error-label' : formData.center? 'valid-label' : ''}`}
//                   htmlFor="center">
//                   Center <span className="required">*</span>
//                 </label>
//                 <select
//                   id="center"
//                   name="center"
//                   className={`form-input 
//                     ${errors.center ? 'error-input' : formData.center ? 'valid-input' : ''}`}
//                   value={formData.center}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   {centers.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.centerName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.center && <span className="error">{errors.center}</span>}
//               </div>
//               <div className="form-group">
//                 <label 
//                   className={`form-label 
//                     ${errors.fullName ? 'error-label' : formData.fullName ? 'valid-label' : ''}`} 
//                   htmlFor="fullName">
//                   Full Name <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="fullName"
//                   name="fullName"
//                   className={`form-input 
//                     ${errors.fullName ? 'error-input' : formData.fullName ? 'valid-input' : ''}`}
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   placeholder='Full Name'
//                 />
//                  {errors.fullName && <span className="error">{errors.fullName}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label  
//                   className={`form-label 
//                     ${errors.username ? 'error-label' : formData.username ? 'valid-label' : ''}`}
//                   htmlFor="username">
//                   Username <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   className={`form-input 
//                     ${errors.username ? 'error-input' : formData.username ? 'valid-input' : ''}`}
//                   value={formData.username}
//                   onChange={handleChange}
//                   placeholder='Username'
//                 />
//                 {errors.username && <span className="error">{errors.username}</span>}
//               </div>
//               <div className="form-group">
//                 <label  
//                   className={`form-label 
//                     ${errors.email ? 'error-label' : formData.email ? 'valid-label' : ''}`}
//                   htmlFor="email">
//                   Email <span className="required">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   className={`form-input 
//                     ${errors.email ? 'error-input' : formData.email ? 'valid-input' : ''}`}
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder='Email'
//                 />
//                 {errors.email && <span className="error">{errors.email}</span>}
//               </div>

//               <div className="form-group">
//                 <label 
//                   className={`form-label 
//                     ${errors.mobile ? 'error-label' : formData.mobile ? 'valid-label' : ''}`} 
//                   htmlFor="mobile">
//                   Mobile <span className="required">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="mobile"
//                   name="mobile"
//                   className={`form-input 
//                     ${errors.mobile ? 'error-input' : formData.mobile ? 'valid-input' : ''}`}
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   placeholder='10 Digit Mobile No.'
//                 />
//                 {errors.mobile && <span className="error">{errors.mobile}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label 
//                   className={`form-label 
//                     ${errors.status ? 'error-label' : formData.status ? 'valid-label' : ''}`}
//                   htmlFor="status">
//                   Status <span className="required">*</span>
//                 </label>
//                  <select 
//                   className={`form-input 
//                     ${errors.status ? 'error-input' : formData.status ? 'valid-input' : ''}`}
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   >
//                   <option value="">SELECT</option>
//                   <option value="Enable">Enable</option>
//                   <option value="Disable">Disable</option>
//                 </select>
//                 {errors.status && <span className="error">{errors.status}</span>}
//               </div>
//               <div className="form-group"></div>
//               <div className="form-group"></div>
//             </div>
            
//             <h4>Password</h4>
//             <div className="form-row">
//               <div className="form-group">
//                 <label  
//                   className={`form-label 
//                     ${errors.password ? 'error-label' : formData.password ? 'valid-label' : ''}`}
//                   htmlFor="password">
//                   Password <span className="required">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   className={`form-input 
//                     ${errors.password ? 'error-input' : formData.password ? 'valid-input' : ''}`}
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder='Password'
//                 />
//                 {errors.password && <span className="error">{errors.password}</span>}
//               </div>

//               <div className="form-group">
//                 <label 
//                   className={`form-label 
//                     ${errors.confirmPassword ? 'error-label' : formData.confirmPassword ? 'valid-label' : ''}`} 
//                   htmlFor="confirmPassword">
//                   Confirm Password <span className="required">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   className={`form-input 
//                     ${errors.confirmPassword ? 'error-input' : formData.confirmPassword ? 'valid-input' : ''}`}
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                    placeholder='Confirm Password'
//                 />
//                 {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
//               </div>
//               <div className="form-group"></div>
//             </div>

//             <div className="form-footer">
//               <button type="button" className="reset-button" onClick={handleReset}>
//                 Reset
//               </button>
//               <button type="submit" className="submit-button">
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddUser;



import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { CAlert } from '@coreui/react';

const AddUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
    center: '',
    status: ''
  });

  const [centers, setCenters] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers');
      setCenters(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get('/role');
      setRoles(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchData(id);
    }
    fetchRoles();
    fetchCenters();
  }, [id]);

  const fetchData = async (itemId) => {
    try {
      const res = await axiosInstance.get(`/auth/user/${itemId}`);
      const user = res.data.data.user;

      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        mobile: user.mobile || '',
        password: '', // Don't pre-fill password for security
        confirmPassword: '', // Don't pre-fill confirm password
        role: user.role?._id || '',
        center: user.center?._id || '',
        status: user.status || ''
      });
    } catch (error) {
      console.log("error fetching data", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Common required fields for both add and edit
    const requiredFields = ['fullName', 'mobile', 'username', 'email', 'center', 'role', 'status'];
    
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This is a required field';
    });

    // Password validation only for new users
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Password is required for new users';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      }
    }

    // Password confirmation validation (only if passwords are provided)
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Password length validation (only if password is provided)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare data for API call
      const submitData = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
        center: formData.center,
        status: formData.status
      };

      // Only include password if it's provided (for updates) or for new users
      if (formData.password) {
        submitData.password = formData.password;
      }

      if (isEditing) {
        await axiosInstance.put(`/auth/user/${id}`, submitData);
        setAlert({ type: 'success', message: 'User updated successfully!' });
      } else {
        await axiosInstance.post('/auth/register', submitData);
        setAlert({ type: 'success', message: 'User created successfully!' });
      }
      
      setTimeout(() => navigate('/user-list'), 1500);
    } catch (error) {
      console.error('Error saving Data:', error);
    
      let message = `Failed to ${isEditing ? 'update' : 'create'} user. Please try again!`;
      let validationErrors = {};
    
      if (error.response) {
        const responseData = error.response.data;
        
        // Handle validation errors from backend
        if (responseData.success === false && responseData.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach(errorMsg => {
            if (errorMsg.toLowerCase().includes('username')) {
              validationErrors.username = errorMsg;
            } else if (errorMsg.toLowerCase().includes('email')) {
              validationErrors.email = errorMsg;
            } else if (errorMsg.toLowerCase().includes('password')) {
              validationErrors.password = errorMsg;
            } else if (errorMsg.toLowerCase().includes('mobile')) {
              validationErrors.mobile = errorMsg;
            } else if (errorMsg.toLowerCase().includes('fullname')) {
              validationErrors.fullName = errorMsg;
            } else {
              message = errorMsg;
            }
          });
          
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
          }
        }
        
        if (Object.keys(validationErrors).length === 0) {
          message = responseData?.message || responseData?.error || message;
        }
      } else if (error.request) {
        message = 'No response from server. Please check your connection.';
      } else {
        message = error.message;
      }
    
      if (message && Object.keys(validationErrors).length === 0) {
        setAlert({ type: 'danger', message });
      }
    }    
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      role: '',
      center: '',
      status: ''
    });
    setErrors({});
    setAlert({ type: '', message: '' });
  };

  return (
    <div className="form-container">
      <div className="title">{isEditing ? 'Edit' : 'Add'} User</div>
      <div className="form-card">
        <div className="form-body">
          {alert.message && (
            <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
              {alert.message}
            </CAlert>
          )}
          <form onSubmit={handleSubmit}>
             <div className="form-row">
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.role ? 'error-label' : formData.role ? 'valid-label' : ''}`}
                  htmlFor="role">
                  Role <span className="required">*</span>
                </label>
                <select
                  type="text"
                  id="role"
                  name="role"
                  className={`form-input 
                    ${errors.role ? 'error-input' : formData.role ? 'valid-input' : ''}`}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  {
                    roles.map((role) =>(
                      <option key={role._id} value={role._id}>
                        {role.roleTitle}
                      </option>
                    ))
                  }
                </select>
                {errors.role && <span className="error">{errors.role}</span>}
              </div>
              <div className="form-group">
                <label className={`form-label 
                  ${errors.center ? 'error-label' : formData.center? 'valid-label' : ''}`}
                  htmlFor="center">
                  Center <span className="required">*</span>
                </label>
                <select
                  id="center"
                  name="center"
                  className={`form-input 
                    ${errors.center ? 'error-input' : formData.center ? 'valid-input' : ''}`}
                  value={formData.center}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  {centers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.centerName}
                    </option>
                  ))}
                </select>
                {errors.center && <span className="error">{errors.center}</span>}
              </div>
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.fullName ? 'error-label' : formData.fullName ? 'valid-label' : ''}`} 
                  htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input 
                    ${errors.fullName ? 'error-input' : formData.fullName ? 'valid-input' : ''}`}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='Full Name'
                />
                 {errors.fullName && <span className="error">{errors.fullName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label  
                  className={`form-label 
                    ${errors.username ? 'error-label' : formData.username ? 'valid-label' : ''}`}
                  htmlFor="username">
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-input 
                    ${errors.username ? 'error-input' : formData.username ? 'valid-input' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Username'
                />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label  
                  className={`form-label 
                    ${errors.email ? 'error-label' : formData.email ? 'valid-label' : ''}`}
                  htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input 
                    ${errors.email ? 'error-input' : formData.email ? 'valid-input' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email'
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.mobile ? 'error-label' : formData.mobile ? 'valid-label' : ''}`} 
                  htmlFor="mobile">
                  Mobile <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className={`form-input 
                    ${errors.mobile ? 'error-input' : formData.mobile ? 'valid-input' : ''}`}
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder='10 Digit Mobile No.'
                />
                {errors.mobile && <span className="error">{errors.mobile}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.status ? 'error-label' : formData.status ? 'valid-label' : ''}`}
                  htmlFor="status">
                  Status <span className="required">*</span>
                </label>
                 <select 
                  className={`form-input 
                    ${errors.status ? 'error-input' : formData.status ? 'valid-input' : ''}`}
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  >
                  <option value="">SELECT</option>
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>
                {errors.status && <span className="error">{errors.status}</span>}
              </div>
              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>
            
            
            <h4>Password</h4>
            <div className="form-row">
              <div className="form-group">
                <label  
                  className={`form-label 
                    ${errors.password ? 'error-label' : formData.password ? 'valid-label' : ''}`}
                  htmlFor="password">
                  Password {!isEditing && <span className="required">*</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input 
                    ${errors.password ? 'error-input' : formData.password ? 'valid-input' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditing ? 'Enter new password' : 'Password'}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.confirmPassword ? 'error-label' : formData.confirmPassword ? 'valid-label' : ''}`} 
                  htmlFor="confirmPassword">
                  Confirm Password {!isEditing && <span className="required">*</span>}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input 
                    ${errors.confirmPassword ? 'error-input' : formData.confirmPassword ? 'valid-input' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={isEditing ? 'Confirm new password' : 'Confirm Password'}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
              <div className="form-group"></div>
            </div>

            <div className="form-footer">
              <button type="button" className="reset-button" onClick={handleReset}>
                Reset
              </button>
              <button type="submit" className="submit-button">
                {isEditing ? 'Update' : 'Create'} User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;