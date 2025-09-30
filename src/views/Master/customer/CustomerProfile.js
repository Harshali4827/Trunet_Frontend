import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CButton, CSpinner, CContainer } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft} from '@coreui/icons';
import axiosInstance from 'src/axiosInstance';
import '../../../css/profile.css';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/customers/${id}`);
        
        if (response.data.success) {
          setCustomer(response.data.data);
        } else {
          throw new Error('Failed to fetch customer data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching customer:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
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
        Error loading customer profile: {error}
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="alert alert-warning" role="alert">
        Customer not found
      </div>
    );
  }
  const handleEdit = () => {
    navigate(`/edit-customer/${id}`);
  };

  return (
    <CContainer fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
      
        <div className="title-container">
          <h1 className="title">{customer.username}</h1>
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
            Customer Details
        </div>
        <CCardBody className="profile-body p-0">
          <table className="customer-details-table">
            <tbody>
              <tr className="table-row">
                <td className="label-cell">Name:</td>
                <td className="value-cell">{customer.name || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Mobile:</td>
                <td className="value-cell">{customer.mobile || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Email:</td>
                <td className="value-cell">{customer.email || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Center:</td>
                <td className="value-cell">{customer.center?.centerName || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Address:</td>
                <td className="value-cell">
                  {[customer.address1, customer.address2, customer.city, customer.state]
                    .filter(Boolean)
                    .join(' ') || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default CustomerProfile;