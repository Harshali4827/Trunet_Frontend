import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';

const AddControlRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    center: '',
    buildingName: '',
    displayName: '',
    address1: '',
    address2: '',
    landmark: '',
    pincode: '',
  });

  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers');
        setCenters(res.data.data || []);
      } catch (error) {
        console.error('Error fetching centers:', error);
      }
    };
    fetchCenters();
  }, []);


  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  // const fetchData = async (controlRoomId) => {
  //   try {
  //     const res = await axiosInstance.get(`/controlRooms/${controlRoomId}`);
  //     setFormData(res.data.data);
  //   } catch (error) {
  //     console.error('Error fetching controlRoom:', error);
  //   }
  // };

  const fetchData = async (controlRoomId) => {
    try {
      const res = await axiosInstance.get(`/controlRooms/${controlRoomId}`);
      const data = res.data.data;
  
      setFormData({
        center: data.center?._id || '',
        buildingName: data.buildingName || '',
        displayName: data.displayName || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        landmark: data.landmark || '',
        pincode: data.pincode || ''
      });
    } catch (error) {
      console.error('Error fetching controlRoom:', error);
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
    ['center', 'buildingName', 'displayName', 'address1'].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/controlRooms/${id}`, formData);
      } else {
        await axiosInstance.post('/controlRooms', formData);
      }
      navigate('/controlRoom-list');
    } catch (error) {
      console.error('Error saving controlRoom:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      center: '',
      buildingName: '',
      displayName: '',
      address1: '',
      address2: '',
      landmark: '',
      pincode: ''
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Control Room</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
            <div className="form-group">
                <label 
                className={`form-label 
                ${errors.center ? 'error-label' : formData.center ? 'valid-label' : ''}`}
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
                ${errors.buildingName ? 'error-label' : formData.buildingName ? 'valid-label' : ''}`}
                htmlFor="buildingName">
                  Building Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="buildingName"
                  name="buildingName"
                  className={`form-input 
                    ${errors.buildingName ? 'error-input' : formData.buildingName ? 'valid-input' : ''}`}
                  value={formData.buildingName}
                  onChange={handleChange}
                />
                {errors.buildingName && <span className="error">{errors.buildingName}</span>}
              </div>

              <div className="form-group">
                <label 
                className={`form-label 
                ${errors.displayName ? 'error-label' : formData.displayName ? 'valid-label' : ''}`}
                htmlFor="displayName">
                  Display Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  className={`form-input 
                  ${errors.displayName ? 'error-input' : formData.displayName ? 'valid-input' : ''}`}
                  value={formData.displayName}
                  onChange={handleChange}
                />
                {errors.displayName && <span className="error">{errors.displayName}</span>}
              </div>
            </div>

            <div className="form-row">
             
            <div className="form-group">
                <label 
               className={`form-label 
                ${errors.address1 ? 'error-label' : formData.address1 ? 'valid-label' : ''}`}
                htmlFor="address1">
                Address Line 1<span className="required">*</span>
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
                Address Line 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  className="form-input"
                  value={formData.address2}
                  onChange={handleChange}
                />
                {errors.address2 && <span className="error">{errors.address2}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="landmark">
                Landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  className="form-input"
                  value={formData.landmark}
                  onChange={handleChange}
                />
                {errors.landmark && <span className="error">{errors.landmark}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="pincode">
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-input"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group"></div>
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

export default AddControlRoom;
