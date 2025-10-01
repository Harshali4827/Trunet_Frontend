import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { CAlert } from '@coreui/react';

const AddVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    businessName: '',
    businessName: '',
    name: '',
    mobile: '',
    email:'',
    gstNumber: '',
    panNumber: '',
    address1: '',
    address2: '',
    city: '',
    logo: ''
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    if (id) {
     fetchVendor(id);
    }
  }, [id]);

  const fetchVendor = async (centerId) => {
    try {
      const res = await axiosInstance.get(`/vendor/${centerId}`);
      setFormData(res.data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
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
    ['businessName', 'contactNumber', 'name', 'email', 'address1'].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This is a required field';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/vendor/${id}`, formData);
        setAlert({ type: 'success', message: 'Data updated successfully!' })
      } else {
        await axiosInstance.post('/vendor', formData);
        setAlert({ type: 'success', message: 'Data added successfully!' })
      }
      setTimeout(() =>navigate('/vendor-list'),1500);
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
      businessName: '',
      businessName: '',
      name: '',
      mobile: '',
      email:'',
      gstNumber: '',
      panNumber: '',
      address1: '',
      address2: '',
      city: '',
      logo: ''
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Vendor</div>
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
                  ${errors.businessName ? 'error-label' : formData.businessName ? 'valid-label' : ''}`}
                htmlFor="businessName">
                 Business Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  className={`form-input 
                  ${errors.businessName ? 'error-input' : formData.businessName ? 'valid-input' : ''}`}
                  value={formData.businessName}
                  onChange={handleChange}
                />
                {errors.businessName && <span className="error">{errors.businessName}</span>}
              </div>
              <div className="form-group">
                <label 
                className={`form-label 
                ${errors.contactNumber ? 'error-label' : formData.contactNumber ? 'valid-label' : ''}`} 
                htmlFor="contactNumber">
                 Contact Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  className={`form-input 
                  ${errors.contactNumber ? 'error-input' : formData.contactNumber ? 'valid-input' : ''}`}
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
                {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
              </div>

              <div className="form-group">
                <label 
                 className={`form-label 
                  ${errors.name ? 'error-label' : formData.name ? 'valid-label' : ''}`}
                htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input 
                  ${errors.name ? 'error-input' : formData.name ? 'valid-input' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label 
                className="form-label" 
                htmlFor="mobile">
                 Mobile
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className="form-input"
                  value={formData.mobile}
                  onChange={handleChange}
                />
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
                <label className="form-label" htmlFor="gstNumber">
                 GST No
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  className="form-input"
                  value={formData.gstNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
             <div className="form-group">
                <label className="form-label" htmlFor="panNumber">
                  Pan No
                </label>
                <input
                  type="tel"
                  id="panNumber"
                  name="panNumber"
                  className="form-input"
                  value={formData.panNumber}
                  onChange={handleChange}
                />
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
             </div>
            
          
            <div className="form-row">
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
              <div className="form-group">
                <label className="form-label" htmlFor="logo">
                 Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  className="form-input"
                  value={formData.logo}
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

export default AddVendor;