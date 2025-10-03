import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CButton, CSpinner, CContainer, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CFormText, CAlert } from '@coreui/react';
import axiosInstance from 'src/axiosInstance';
import '../../css/profile.css'
import '../../css/form.css';
import ShipGoodsModal from './ShipGoodsModal';
import IncompleteRemarkModal from './IncompleteRemarkModal';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';

const StockProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [shipmentModal, setShipmentModal] = useState(false)
  const [errors, setErrors] = useState({});
  const [currentShipmentAction, setCurrentShipmentAction] = useState(null);
  const [incompleteModal, setIncompleteModal] = useState(false);
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = userCenter.centerType || 'Outlet';
  const [productReceipts, setProductReceipts] = useState([]);

 const [shipmentData, setShipmentData] = useState({
    shippedDate: '',
    expectedDeliveryDate: '',
    shipmentDetails: '',
    shipmentRemark: '',
    documents: []
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/stockrequest/${id}`);
        if (response.data.success) {
          setData(response.data.data);
          const initialApproved = response.data.data.products.map(item => ({
            _id: item._id,    
            productId: item.product?._id,   
            approvedQty:item.approvedQuantity !== undefined && item.approvedQuantity !== null? item.approvedQuantity: item.quantity || '',
  
            approvedRemark: item.approvedRemark || ''
          }));
          setApprovedProducts(initialApproved);
          
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

  const handleShipGoods = async (shipmentData) => {
    try {
      const response = await axiosInstance.post(`/stockrequest/${id}/ship`, shipmentData)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
        setShipmentModal(false)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
      }
    } catch (err) {
      console.error(err)
      setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
    }
  }

  const handleBack = () => navigate('/stock-request');

  useEffect(() => {
    if (data?.products) {
      const initialReceipts = data.products.map(item => ({
        productId: item._id,
        receivedQuantity: item.approvedQuantity || item.quantity || 0,
        receivedRemark: ''
      }));
      setProductReceipts(initialReceipts);
    }
  }, [data]);
  
  const handleReceiptChange = (productId, field, value) => {
    setProductReceipts(prev =>
      prev.map(p => (p.productId === productId ? { ...p, [field]: value } : p))
    );
  };

  const handleApprovedChange = (productId, field, value) => {
    if (field === 'approvedQty') {
      if (value === '' || /^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, [productId]: undefined }));
      } else {
        setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
      }
    }
  
    setApprovedProducts(prev =>
      prev.map(p =>
        p._id === productId ? { ...p, [field]: value } : p
      )
    );
  };  

const handleApprove = async () => {
  let hasError = false;
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
      hasError = true;
    }
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || ''
    };
  });

  if (hasError) return;

  try {
    const response = await axiosInstance.post(`/stockrequest/${id}/approve`, {
      productApprovals: payload
    });

    if (response.data.success) {
      setAlert({ type: 'success', message: 'Stock request approved successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to approve request', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error approving stock request', visible: true });
  }
};

// Reject
const handleReject = async () => {
  try {
    const response = await axiosInstance.put(`/stockrequest/${id}`, { status: 'Rejected' });
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Stock request rejected successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to reject request', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error rejecting stock request', visible: true });
  }
};

// Submit
const handleSubmitRequest = async () => {
  try {
    const response = await axiosInstance.put(`/stockrequest/${id}`, { status: 'Submitted' });
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data submitted successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to submit', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error to submit data', visible: true });
  }
};

// approve qty
const handleChangeApprovedQty = async () => {
  let hasError = false;
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({
        ...prev,
        [p._id]: 'The input value was not a correct number',
      }));
      hasError = true;
    }
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
    };
  });

  if (hasError) return;

  try {
    const response = await axiosInstance.patch(
      `/stockrequest/${id}/approved-quantities`,
      { productApprovals: payload }
    );

    if (response.data.success) {
      setAlert({
        type: 'success',
        message: 'Approved quantities updated successfully',
        visible: true,
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to update approved quantities',
        visible: true,
      });
    }
  } catch (err) {
    console.error(err);
    const backendMessage =
      err.response?.data?.message || 'Error updating approved quantities';

    setAlert({
      type: 'danger',
      message: backendMessage,
      visible: true,
    });
  }
};

//Cancel Shipment
const handleCancelShipment = async () => {
  try {
    const response = await axiosInstance.post(`/stockrequest/${id}/reject-shipment`);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Shipment canceled successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to cancel shipment', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error canceling shipment', visible: true });
  }
};

// complete

const handleCompleteIndent = async () => {
  try {
    let payload = [];

    if (userCenterType === 'Center') {
      payload = productReceipts;
    } else {
      payload = data.products.map(item => ({
        // productId: item._id,
        productId: item.product?._id,   
        receivedQuantity: item.approvedQuantity || item.quantity || 0,
        receivedRemark: ''
      }));
    }

    const response = await axiosInstance.post(`/stockrequest/${id}/complete`, {
      productReceipts: payload,
    });

    if (response.data.success) {
      setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error completing indent', visible: true });
  }
};

// Update Shipment
const handleOpenUpdateShipment = () => {
  if (data.shippingInfo) {
    setShipmentData({
      shippedDate: data.shippingInfo.shippedDate?.split('T')[0] || '',
      expectedDeliveryDate: data.shippingInfo.expectedDeliveryDate?.split('T')[0] || '',
      shipmentDetails: data.shippingInfo.shipmentDetails || '',
      shipmentRemark: data.shippingInfo.shipmentRemark || '',
      documents: data.shippingInfo.documents || []
    });
  }
  setCurrentShipmentAction(() => handleUpdateShipment);
  setShipmentModal(true);
};

const handleUpdateShipment = async (shipmentData) => {
  try {
    const response = await axiosInstance.patch(`/stockrequest/${id}/shipping-info`, shipmentData);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Shipment updated successfully', visible: true });
      setShipmentModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to update shipment', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error updating shipment', visible: true });
  }
};

const handleMarkIncomplete = async (remark) => {
  try {
    const response = await axiosInstance.post(
      `/stockrequest/${id}/mark-incomplete`,
      { incompleteRemark: remark }
    );
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Stock request marked as incomplete', visible: true });
      setIncompleteModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to mark incomplete', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error marking incomplete', visible: true });
  }
};


const handleInomplete = async () => {
  try {
    const approvalsPayload = approvedProducts.map(p => ({
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty) || 0,
      approvedRemark: p.approvedRemark || ''
    }));
    const receiptsPayload = approvalsPayload.map(a => ({
      productId: a.productId,
      receivedQuantity: a.approvedQuantity,
      receivedRemark: '',
    }));

    const response = await axiosInstance.patch(
      `/stockrequest/${id}/complete-incomplete`,
      {
        productApprovals: approvalsPayload,
        productReceipts: receiptsPayload,
      }
    );

    if (response.data.success) {
      setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error completing indent', visible: true });
  }
};

  const handleApprovedBlur = (productId, value) => {
    if (value === '' || !/^\d+$/.test(value)) {
      setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>;
  if (error) return <div className="alert alert-danger">Error loading stock request: {error}</div>;
  if (!data) return <div className="alert alert-warning">Stock Request not found</div>;

  return (
    <CContainer fluid>
      {alert.visible && (
  <CAlert color={alert.type} dismissible onClose={() => setAlert({ ...alert, visible: false })}>
    {alert.message}
  </CAlert>
)}

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

    <div className="d-flex align-items-center">

    {data.status === 'Shipped' && (
      <CButton className='btn-action btn-incomplete me-2' onClick={handleCompleteIndent}>
      Complete The Indent
      </CButton>
    )}
     <CButton className="print-btn">
      <i className="fa fa-print me-1"></i> Print Indent
    </CButton>
  </div>
  </div>
        <CCardBody className="profile-body p-0">
  <table className="customer-details-table">
    <tbody>
      <tr className="table-row">
        <td className="profile-label-cell">Center/Center Code:</td>
        <td className="profile-value-cell">{data.orderNumber || ''}</td>

        <td className="profile-label-cell">Shipment Date:</td>
        <td className="profile-value-cell">{formatDate(data.shippingInfo.shippedDate || '')}</td>

        <td className="profile-label-cell">Completed on:</td>
        <td className="profile-value-cell">{formatDateTime(data.completionInfo?.completedOn || '')}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Indent Date:</td>
        <td className="profile-value-cell">{data.date || ''}</td>

        <td className="profile-label-cell">Expected Delivery:</td>
        <td className="profile-value-cell">{formatDate(data.shippingInfo.expectedDeliveryDate || '')}</td>

        <td className="profile-label-cell">Completed by:</td>
        <td className="profile-value-cell">{data.completionInfo?.completedBy?.fullName || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Remark:</td>
        <td className="profile-value-cell">{data.remark || ''}</td>

        <td className="profile-label-cell">Shipment Detail:</td>
        <td className="profile-value-cell">{data.shippingInfo?.shipmentDetails || ''}</td>

        <td className="profile-label-cell">Incomplete on:</td>
        <td className="profile-value-cell">{formatDateTime(data.incompleteOn || '')}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Created at:</td>
        <td className="profile-value-cell">{formatDateTime(data.createdAt)}</td>

        <td className="profile-label-cell">Shipment Remark:</td>
        <td className="profile-value-cell">{data.shippingInfo?.shipmentRemark || ''}</td>

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
        <td className="profile-value-cell">{formatDateTime(data.approvalInfo?.approvedAt || '')}</td>

        <td className="profile-label-cell">Shipped at:</td>
        <td className="profile-value-cell">{formatDateTime(data.shippingInfo?.shippedAt || '')}</td>

        <td className="profile-label-cell">Received at:</td>
        <td className="profile-value-cell">{formatDateTime(data.receivingInfo?.receivedAt || '')}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Approved by:</td>
        <td className="profile-value-cell">{data.approvalInfo?.approvedBy.fullName || ''}</td>

        <td className="profile-label-cell">Shipped by:</td>
        <td className="profile-value-cell">{data.shippingInfo?.shippedBy?.fullName || ''}</td>

        <td className="profile-label-cell">Received by:</td>
        <td className="profile-value-cell">{data.receivingInfo?.receivedBy?.fullName || ''}</td>
      </tr>
    </tbody>
  </table>
</CCardBody>

     </CCard>
     <CCard className="profile-card" style={{ marginTop: '20px' }}>
        <div className="subtitle-row d-flex justify-content-between align-items-center">
          <div className="subtitle">Product Details</div>
       <div className="action-buttons">

       {data.status === 'Draft' && (
        <>
          <CButton className="btn-action btn-submitted me-2" onClick={handleSubmitRequest}>
            Submit
          </CButton>
        </>
      )}

      {data.status === 'Confirmed' && (
        <>
          <CButton className="btn-action btn-submitted me-2" onClick={handleChangeApprovedQty}>
            Change Approved Qty
          </CButton>
          <CButton className="btn-action btn-submitted me-2" 
            onClick={() => {
              setCurrentShipmentAction(() => handleShipGoods);
              setShipmentModal(true);
            }}
         >
              <i className="fa fa-truck me-1"></i> Ship the Goods
             </CButton>

          <CButton className="btn-action btn-reject" onClick={handleReject}>
            Reject Request
          </CButton>
        </>
      )}

      {data.status === 'Shipped' && (
        <>
          <CButton className="btn-action btn-update me-2" onClick={handleOpenUpdateShipment}>
            Update Shipment
          </CButton>
          <CButton className="btn-action btn-reject me-2" onClick={handleCancelShipment}>
            Cancel Shipment
          </CButton>
          <CButton className="btn-action btn-reject me-2" onClick={handleReject}>
            Reject Request
          </CButton>
          <CButton className="btn-action btn-update"
           onClick={() => setIncompleteModal(true)}
          >
            Incomplete
          </CButton>
        </>
      )}

      {data.status === 'Submitted' && (
        <>
          <CButton className="btn-action btn-submitted me-2" onClick={handleApprove}>
            Submit &amp; Approve Request
          </CButton>
          <CButton className="btn-action btn-reject" onClick={handleReject}>
            Submit &amp; Reject Request
          </CButton>
        </>
      )}

        {data.status === 'Incompleted' && (
        <>
          <CButton className="btn-action btn-incomplete me-2" onClick={handleInomplete}>
            Change Qty And Complete Request
          </CButton>
        </>
      )}

    </div>
    </div>
        <CCardBody>
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
                data.products.map(item => {
                  const approvedItem = approvedProducts.find(p => p._id === item._id) || {};
                  return (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
                      <CTableDataCell>{item.centerStockQuantity || 0}</CTableDataCell>
                      <CTableDataCell>{item.quantity || 0}</CTableDataCell>
                      <CTableDataCell>{item.productInStock || 0}</CTableDataCell>
                      <CTableDataCell>{item.productRemark || ''}</CTableDataCell>

                
                      <CTableDataCell>
                      <CFormInput
  type="text"
  value={approvedItem.approvedQty}
  onChange={e => handleApprovedChange(item._id, 'approvedQty', e.target.value)}
  onBlur={e => handleApprovedBlur(item._id, e.target.value)}
  className={errors[item._id] ? 'is-invalid' : ''}
/>
  {errors[item._id] && <CFormText className="text-danger">{errors[item._id]}</CFormText>}
</CTableDataCell>


                      <CTableDataCell>
                      <CFormInput
  type="text"
  value={approvedItem.approvedRemark || ''}
  onChange={e => handleApprovedChange(item._id, 'approvedRemark', e.target.value)}
/>
                      </CTableDataCell>

                      {/* <CTableDataCell>{item.receivedQty || '-'}</CTableDataCell>
                      <CTableDataCell>{item.receivedRemark || '-'}</CTableDataCell> */}

<CTableDataCell>
  {userCenterType === 'Center' && data.status === 'Shipped' ? (
    <CFormInput
      type="text"
      value={productReceipts.find(p => p.productId === item._id)?.receivedQuantity || ''}
      onChange={e => handleReceiptChange(item._id, 'receivedQuantity', e.target.value)}
    />
  ) : (
    item.receivedQty || item.approvedQuantity || 0
  )}
</CTableDataCell>

<CTableDataCell>
  {userCenterType === 'Center' && data.status === 'Shipped' ? (
    <CFormInput
      type="text"
      value={productReceipts.find(p => p.productId === item._id)?.receivedRemark || ''}
      onChange={e => handleReceiptChange(item._id, 'receivedRemark', e.target.value)}
    />
  ) : (
    item.receivedRemark || '-'
  )}
</CTableDataCell>

                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={9} className="text-center">No products found</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <ShipGoodsModal
  visible={shipmentModal}
  onClose={() => setShipmentModal(false)}
  onSubmit={currentShipmentAction}
  initialData={shipmentData} 
/>
<IncompleteRemarkModal
  visible={incompleteModal}
  onClose={() => setIncompleteModal(false)}
  onSubmit={handleMarkIncomplete}
  initialRemark={data.incompleteRemark}
/>

    </CContainer>
  );
};

export default StockProfile;
