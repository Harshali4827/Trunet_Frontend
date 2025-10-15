import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { CAlert } from '@coreui/react';

const AddCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    mobile: '',
    email: '',
    centerId: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
  });

  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' })
 
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers');
        setCenters(res.data.data || []);
      } catch (error) {
       console.log(error)
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
      const data = res.data.data;
  
      setFormData({
        username: data.username || '',
        name: data.name || '',
        mobile: data.mobile || '',
        email: data.email || '',
        centerId: data.center?._id || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        city: data.city || '',
        state: data.state || '',
      });
    } catch (error) {
      console.log("error fetching customers", error)
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
    ['username', 'mobile', 'email', 'centerId', 'address1'].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This is a required field';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/customers/${id}`, formData);
        setAlert({ type: 'success', message: 'Data updated successfully!' })
      } else {
        await axiosInstance.post('/customers', formData);
        setAlert({ type: 'success', message: 'Data added successfully!' })
      }
      setTimeout(() =>navigate('/customers-list'),1500);
    } catch (error) {
      console.error('Error saving Data:', error)
    
      let message = 'Failed to save Data. Please try again!'
    
      if (error.response) {
        message = error.response.data?.message || error.response.data?.error || message
      } else if (error.request) {
        message = 'No response from server. Please check your connection.'
      } else {
        message = error.message
      }
    
      setAlert({ type: 'danger', message })
    }    
  };

  const handleReset = () => {
    setFormData({
      username: '',
      name: '',
      mobile: '',
      email: '',
      centerId: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Customer</div>
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
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className={`form-label 
                  ${errors.centerId ? 'error-label' : formData.centerId ? 'valid-label' : ''}`}
                  htmlFor="centerId">
                  Center <span className="required">*</span>
                </label>
                <select
                  id="centerId"
                  name="centerId"
                  className={`form-input 
                    ${errors.centerId ? 'error-input' : formData.centerId ? 'valid-input' : ''}`}
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

              <div className="form-group">
                <label 
                 className={`form-label 
                  ${errors.mobile ? 'error-label' : formData.mobile ? 'valid-label' : ''}`} htmlFor="mobile">
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
                />
                {errors.mobile && <span className="error">{errors.mobile}</span>}
              </div>

              <div className="form-group">
                <label 
                 className={`form-label 
                  ${errors.address1 ? 'error-label' : formData.address1 ? 'valid-label' : ''}`} 
                  htmlFor="address1">
                  Address 1 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  className={`form-input 
                  ${errors.address1 ? 'error-input' : formData.address1 ? 'valid-input' : ''}`}
                  value={formData.address1}
                  onChange={handleChange}
                />
                {errors.address1 && <span className="error">{errors.address1}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="address2">
                  Address 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  className="form-input"
                  value={formData.address2}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="button" className="reset-button" onClick={handleReset}>
                Reset
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
