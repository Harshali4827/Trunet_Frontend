import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';

const AddUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password:'',
    confirmPassword:'',
    role: '',
    center: '',
    status: ''
  });

  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});

 
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
    fetchData(id);
    }
  }, [id]);

  const fetchData = async (customerId) => {
    try {
      const res = await axiosInstance.get(`/customers/${customerId}`);
      setFormData(res.data.data);
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
    ['fullName', 'mobile', 'email', 'center', 'password','confirmPassword','role','status'].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This is a required field';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/auth/register/${id}`, formData);
      } else {
        await axiosInstance.post('/auth/register', formData);
      }
      navigate('/user-list');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleReset = () => {
    setFormData({
        fullName: '',
        email: '',
        mobile: '',
        password:'',
        confirmPassword:'',
        role: '',
        center: '',
        status: ''
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} User</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.role ? 'error-label' : formData.role ? 'valid-label' : ''}`}
                htmlFor="role">
                  Role <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                 className={`form-input 
                  ${errors.role ? 'error-input' : formData.role ? 'valid-input' : ''}`}
                  value={formData.role}
                  onChange={handleChange}
                />
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
                    ${errors.fullName ? 'error-label' : formData.fullName ? 'valid-label' : ''}`} htmlFor="fullName">
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
                />
                 {errors.fullName && <span className="error">{errors.fullName}</span>}
              </div>
            </div>

            <div className="form-row">
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
            </div>
            <h4>Password</h4>
            <div className="form-row">
            <div className="form-group">
                <label  
                className={`form-label 
                  ${errors.password ? 'error-label' : formData.password ? 'valid-label' : ''}`}
                htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input 
                    ${errors.password ? 'error-input' : formData.password ? 'valid-input' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label 
                 className={`form-label 
                  ${errors.confirmPassword ? 'error-label' : formData.confirmPassword ? 'valid-label' : ''}`} htmlFor="confirmPassword">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input 
                    ${errors.confirmPassword ? 'error-input' : formData.confirmPassword ? 'valid-input' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
