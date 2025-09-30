import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CButton, CSpinner, CContainer, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormLabel, CFormInput } from '@coreui/react';
import axiosInstance from 'src/axiosInstance';
import '../../css/profile.css'
import '../../css/form.css';

const StockProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/stockrequest/${id}`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleBack = () => {
    navigate('/stock-request');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error loading stock request: {error}</div>;
  }

  if (!data) {
    return <div className="alert alert-warning">Stock Request not found</div>;
  }

  return (
    <CContainer fluid>
      <div className="title">
        <CButton size="sm" className="back-button me-3" onClick={handleBack}>
          <i className="fa fa-fw fa-arrow-left"></i> Back
        </CButton>
        Indent Detail
      </div>

      <CCard className="profile-card">

        <div className="subtitle-row">
    <div className="subtitle">
      Indent: {data.orderNumber || ''}
      {data.status && (
        <span className={`status-badge ${data.status.toLowerCase()}`}>
          {data.status}
        </span>
      )}
    </div>

    <CButton size="sm" className="print-btn">
      <i className="fa fa-print me-1"></i> Print Indent
    </CButton>
  </div>
        <CCardBody className="profile-body p-0">
  <table className="customer-details-table">
    <tbody>
      <tr className="table-row">
        <td className="profile-label-cell">Center/Center Code:</td>
        <td className="profile-value-cell">{data.orderNumber || ''}</td>

        <td className="profile-label-cell">Shipment Date:</td>
        <td className="profile-value-cell">{data.shipmentDate || ''}</td>

        <td className="profile-label-cell">Completed on:</td>
        <td className="profile-value-cell">{data.completedOn || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Indent Date:</td>
        <td className="profile-value-cell">{data.date || ''}</td>

        <td className="profile-label-cell">Expected Delivery:</td>
        <td className="profile-value-cell">{data.expectedDelivery || ''}</td>

        <td className="profile-label-cell">Completed by:</td>
        <td className="profile-value-cell">{data.completedBy || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Remark:</td>
        <td className="profile-value-cell">{data.remark || ''}</td>

        <td className="profile-label-cell">Shipment Detail:</td>
        <td className="profile-value-cell">{data.shipmentDetail || ''}</td>

        <td className="profile-label-cell">Incomplete on:</td>
        <td className="profile-value-cell">{data.incompleteOn || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Created at:</td>
        <td className="profile-value-cell">{data.createdAt || ''}</td>

        <td className="profile-label-cell">Shipment Remark:</td>
        <td className="profile-value-cell">{data.shipmentRemark || ''}</td>

        <td className="profile-label-cell">Incomplete by:</td>
        <td className="profile-value-cell">{data.incompleteBy || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Created by:</td>
        <td className="profile-value-cell">{data.createdBy?.fullName || ''}</td>

        <td className="profile-label-cell">Document:</td>
        <td className="profile-value-cell">{data.document || ''}</td>

        <td className="profile-label-cell">Incomplete Remark:</td>
        <td className="profile-value-cell">{data.incompleteRemark || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Approved at:</td>
        <td className="profile-value-cell">{data.approvedAt || ''}</td>

        <td className="profile-label-cell">Shipped at:</td>
        <td className="profile-value-cell">{data.shippedAt || ''}</td>

        <td className="profile-label-cell">Received at:</td>
        <td className="profile-value-cell">{data.receivedAt || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Approved by:</td>
        <td className="profile-value-cell">{data.approvedBy || ''}</td>

        <td className="profile-label-cell">Shipped by:</td>
        <td className="profile-value-cell">{data.shippedBy || ''}</td>

        <td className="profile-label-cell">Received by:</td>
        <td className="profile-value-cell">{data.receivedBy || ''}</td>
      </tr>
    </tbody>
  </table>
</CCardBody>


      </CCard>

<CCard className="profile-card" style={{ marginTop: '20px' }}>
  <div className="subtitle-row d-flex justify-content-between align-items-center">
    <div className="subtitle">Product Details</div>
    <div className="action-buttons">
      {data.status === 'Incomplete' && (
        <CButton className="btn-action btn-incomplete">
          Change Qty &amp; Complete Request
        </CButton>
      )}

      {data.status === 'Confirmed' && (
        <>
          <CButton className="btn-action btn-submitted me-2">
            Change Approved Qty
          </CButton>
          <CButton className="btn-action btn-submitted me-2">
              <i className="fa fa-truck me-1"></i> Ship the Goods
             </CButton>

          <CButton className="btn-action btn-reject">
            Reject Request
          </CButton>
        </>
      )}

      {data.status === 'Shipped' && (
        <>
          <CButton className="btn-action btn-update me-2">
            Update Shipment
          </CButton>
          <CButton className="btn-action btn-reject">
            Cancel Shipment
          </CButton>
        </>
      )}

      {data.status === 'Submitted' && (
        <>
          <CButton className="btn-action btn-submitted me-2">
            Submit &amp; Approve Request
          </CButton>
          <CButton className="btn-action btn-reject">
            Submit &amp; Reject Request
          </CButton>
        </>
      )}
    </div>
  </div>

  <CCardBody>
    <div className="d-flex justify-content-between mb-3">
      <div></div>
      <div className="d-flex">
        <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
        <CFormInput
          type="text"
          className="d-inline-block square-search search-input"
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    <CTable bordered striped responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Product</CTableHeaderCell>
          <CTableHeaderCell>Center Stock</CTableHeaderCell>
          <CTableHeaderCell>Requested Qty</CTableHeaderCell>
          <CTableHeaderCell>Stock Qty</CTableHeaderCell>
          <CTableHeaderCell>Product Remark</CTableHeaderCell>
          <CTableHeaderCell>Approved Qty</CTableHeaderCell>
          <CTableHeaderCell>Approved Remark</CTableHeaderCell>
          <CTableHeaderCell>Received Qty</CTableHeaderCell>
          <CTableHeaderCell>Received Remark</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data.products?.length > 0 ? (
          data.products.map((item) => (
            <CTableRow key={item._id}>
              <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
              <CTableDataCell>{item.centerStockQuantity || 0}</CTableDataCell>
              <CTableDataCell>{item.quantity || 0}</CTableDataCell>
              <CTableDataCell>{item.productInStock || 0}</CTableDataCell>
              <CTableDataCell>{item.productRemark || ''}</CTableDataCell>
              <CTableDataCell>{item.approvedQty || '-'}</CTableDataCell>
              <CTableDataCell>{item.approvedRemark || '-'}</CTableDataCell>
              <CTableDataCell>{item.receivedQty || '-'}</CTableDataCell>
              <CTableDataCell>{item.receivedRemark || '-'}</CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={9} className="text-center">
              No products found
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  </CCardBody>
</CCard>

    </CContainer>
  );
};

export default StockProfile;
