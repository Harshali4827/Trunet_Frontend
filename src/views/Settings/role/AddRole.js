import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { CAlert, CButton } from '@coreui/react';

const AddRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    roleTitle: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' })
 
  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id]);

  const fetchCustomer = async (itemId) => {
    try {
      const res = await axiosInstance.get(`/role/${itemId}`);
      const data = res.data.data;
  
      setFormData({
        roleTitle: data.roleTitle || '',
      });
    } catch (error) {
      console.log("error fetching data", error)
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
    ['roleTitle'].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This is a required field';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/role/${id}`, formData);
        setAlert({ type: 'success', message: 'Data updated successfully!' })
      } else {
        await axiosInstance.post('/role', formData);
        setAlert({ type: 'success', message: 'Data added successfully!' })
      }
      setTimeout(() =>navigate('/role-list'),1500);
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

  const handleBack = () => {
    navigate('/role-list')
  }
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
        {id ? 'Edit' : 'Add'} Role
    </div>
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
                  ${errors.roleTitle ? 'error-label' : formData.roleTitle ? 'valid-label' : ''}`}
                htmlFor="roleTitle">
                  Role Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="roleTitle"
                  name="roleTitle"
                 className={`form-input 
                  ${errors.roleTitle ? 'error-input' : formData.roleTitle ? 'valid-input' : ''}`}
                  value={formData.roleTitle}
                  onChange={handleChange}
                />
                {errors.roleTitle && <span className="error">{errors.roleTitle}</span>}
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

export default AddRole;
