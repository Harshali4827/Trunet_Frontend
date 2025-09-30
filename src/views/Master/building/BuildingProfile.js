import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CButton, CSpinner, CContainer } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';
import axiosInstance from 'src/axiosInstance';
import '../../../css/profile.css';

const BuildingProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/buildings/${id}`);
        
        if (response.data.success) {
            setBuilding(response.data.data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching building:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
     fetchBuilding();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading building profile: {error}
      </div>
    );
  }

  if (!building) {
    return (
      <div className="alert alert-warning" role="alert">
        Building not found
      </div>
    );
  }
  const handleEdit = () => {
    navigate(`/edit-building/${id}`);
  };

  return (
    <CContainer fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
      
        <div className="title-container">
          <h1 className="title">{building.buildingName}</h1>
          <CButton 
            size="sm" 
            className="edit-icon-btn"
            onClick={handleEdit}
          >
            <i className="fa fa-fw fa-edit"></i>
          </CButton>
        </div>

        <CButton color="secondary" onClick={handleBack}>
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back
        </CButton>
      </div>

      <CCard className="profile-card">
        <div className='subtitle'>
          Building Details
        </div>
        <CCardBody className="profile-body p-0">
          <table className="customer-details-table">
            <tbody>
              <tr className="table-row">
                <td className="label-cell">Name:</td>
                <td className="value-cell">{building.buildingName || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Address:</td>
                <td className="value-cell">{building.address1 || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Center:</td>
                <td className="value-cell">{building.center?.centerName || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default BuildingProfile;