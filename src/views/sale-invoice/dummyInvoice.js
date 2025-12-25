import '../../css/table.css';
import '../../css/form.css';
import '../../css/profile.css';
import React, { useState, useRef, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch,cilZoomOut, cilFile } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';

import Pagination from 'src/utils/Pagination';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import ChallanModal from '../stockRequest/ChallanModal';
import SearchSaleInvoice from './SearchSaleInvoice';
import { numToWords } from 'src/utils/NumToWords';

const SaleInvoices = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedChallans, setSelectedChallans] = useState([]);
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    center: '', 
    reseller: '',
    status: 'Completed',
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);

  const [invoiceMetaData, setInvoiceMetaData] = useState(null);
  
  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'Completed');
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }

      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller);
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
  
      params.append('page', page);
      
      const url = `/stockrequest?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setCustomers(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);

        console.log('Fetched data:', response.data.data.length, 'items');
        console.log('Pagination:', response.data.pagination);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers');
      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  const handleSelectChallan = (id) => {
    setSelectedChallans((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedChallans(filteredCustomers.map((c) => c._id));
    } else {
      setSelectedChallans([]);
    }
  };
  
  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchResellers();
  }, []);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...customers].sort((a, b) => {
      let aValue = a;
      let bValue = b;
      
      if (key.includes('.')) {
        const keys = key.split('.');
        aValue = keys.reduce((obj, k) => obj && obj[k], a);
        bValue = keys.reduce((obj, k) => obj && obj[k], b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setCustomers(sortedCustomers);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const handleSearch = (searchData) => {
    const searchWithCompleted = { ...searchData, status: 'Completed' };
    setActiveSearch(searchWithCompleted);
    fetchData(searchWithCompleted, 1);
  };

 const handleResetSearch = () => {
  const resetSearch = { 
    center: '', 
    reseller: '',
    startDate: '',
    endDate: '',
  };
  setActiveSearch(resetSearch);
  setSearchTerm('');
  fetchData(resetSearch, 1);
};

  const handleClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`);
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.outlet) {
      return true;
    }
    return Object.values(customer).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
  
  const handleGenerateChallan = (item) => {
    setSelectedChallan(item);
    setShowChallanModal(true);
  };

  // const handleGenerateInvoice = (metaData) => {
  //   setInvoiceMetaData(metaData);
  
  //   const selectedData = customers.filter(c => selectedChallans.includes(c._id));
  //   if (selectedData.length === 0) return;
  
  //   const reseller = selectedData[0]?.center?.reseller;
  //   const invoiceNumber = `STEL/25-26/${Math.floor(Math.random() * 100)}`;
  //   const invoiceDate = '31-Jul-25';
  
  //   const allCenters = [
  //     ...new Set(selectedData.map(c => c.center?.centerName).filter(Boolean))
  //   ];
  //   const centersList = allCenters.join(', ');
  
  //   const productMap = new Map();
    
  //   selectedData.flatMap(challan => challan.products).forEach(product => {
  //     const productId = product.product?._id || product.product?.productTitle;
  //     const quantity = product.receivedQuantity || product.approvedQuantity || 0;
  //     const rate = product.rate || product.product?.salePrice || 0;
      
  //     if (productMap.has(productId)) {
  //       const existing = productMap.get(productId);
  //       existing.quantity += quantity;
  //       existing.totalAmount += quantity * rate;
  //     } else {
  //       productMap.set(productId, {
  //         productTitle: product.product?.productTitle || '',
  //         hsnCode: product.product?.hsnCode || '85176990',
  //         quantity: quantity,
  //         rate: rate,
  //         totalAmount: quantity * rate,
  //         unit: 'Nos'
  //       });
  //     }
  //   });

  //   const combinedProducts = Array.from(productMap.values());

  //   const totalBeforeTax = combinedProducts.reduce((sum, p) => sum + p.totalAmount, 0);
  //   const cgst = totalBeforeTax * 0.09;
  //   const sgst = totalBeforeTax * 0.09;
  //   const roundOff = Math.round(totalBeforeTax + cgst + sgst) - (totalBeforeTax + cgst + sgst);
  //   const total = totalBeforeTax + cgst + sgst + roundOff;

  //   const hsnMap = new Map();
  //   combinedProducts.forEach(product => {
  //     const hsn = product.hsnCode;
  //     const taxableValue = product.totalAmount;
  //     const cgstAmount = taxableValue * 0.09;
  //     const sgstAmount = taxableValue * 0.09;
  //     const totalTax = cgstAmount + sgstAmount;
      
  //     if (hsnMap.has(hsn)) {
  //       const existing = hsnMap.get(hsn);
  //       existing.taxableValue += taxableValue;
  //       existing.cgstAmount += cgstAmount;
  //       existing.sgstAmount += sgstAmount;
  //       existing.totalTax += totalTax;
  //     } else {
  //       hsnMap.set(hsn, {
  //         hsnCode: hsn,
  //         taxableValue: taxableValue,
  //         cgstAmount: cgstAmount,
  //         sgstAmount: sgstAmount,
  //         totalTax: totalTax
  //       });
  //     }
  //   });
  
  //   const hsnSummary = Array.from(hsnMap.values());
  
  //   const productsPerPage = 8;
  //   const pages = [];
  //   for (let i = 0; i < combinedProducts.length; i += productsPerPage) {
  //     pages.push(combinedProducts.slice(i, i + productsPerPage));
  //   }
  
  //   const invoiceWindow = window.open('', '_blank');
  //   invoiceWindow.document.write(`
  //     <html>
  //     <head>
  //       <title>Invoice - ${reseller?.businessName || 'SSV Alpha Broadband LLP'}</title>
  //       <style>
  //         @page { size: A4; margin: 12mm; }
  //         body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0;}
  //         .title { text-align: center; font-weight: bold; font-size: 16px; margin: 6px 0; }
  //         .main-border { border: 1px solid #000; width: 100%; border-collapse: collapse; }
  //         .main-border td, .main-border th { border: 1px solid #000; padding: 5px; vertical-align: top; }
  //         .meta-table { width: 100%; border-collapse: collapse; }
  //         .meta-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
  //         .label { font-weight: bold; }
  //         .right { text-align: right; }
  //         .bold { font-weight: bold; }
  //         .footer-note { font-style: italic; text-align: right; margin-top: 4px; }
  //         @media print { .page-break { page-break-before: always; } }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="title">Tax Invoice</div>
  
  //       ${pages.map((products, pageIndex) => `
  //         <table class="main-border">
  //           <tr>
  //             <td style="width:50%;">
  //               <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
  //                 <div class="bold">SSV Telecom Private Limited FY 22-23</div>
  //                 A-1, Landmark CHS, Sector 14<br/>
  //                 Vashi, Navi Mumbai<br/>
  //                 27ABECS3422Q1ZX<br/>
  //                 GSTIN/UIN: 27ABECS3422Q1ZX
  //               </div>
  
  //               <span class="label">Consignee (Ship to)</span><br/>
  //               ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
  //               ${centersList || 'All Alpha Area'}<br/><br/>
  //               GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
  //               State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
  //               <hr/>
  
  //               <span class="label">Buyer (Bill to)</span><br/>
  //               ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
  //               ${reseller?.address1 || 'A/3, Landmark Soc, Sector-14, Vashi'}<br/>
  //               GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
  //               State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
  //             </td>
  
  //             <td style="width:50%; padding:0;">
  //               <table class="meta-table">
  //                 <tr>
  //                   <td><span class="label">Invoice No.</span><br/>${invoiceNumber}</td>
  //                   <td><span class="label">Dated</span><br/>${invoiceDate}</td>
  //                 </tr>
  //                 <tr>
  //                   <td><span class="label">Delivery Note</span><br/>${metaData?.deliveryNote || ''}</td>
  //                   <td><span class="label">Mode/Terms of Payment</span><br/>${metaData?.modeOfPayment || ''}</td>
  //                 </tr>
  //                 <tr>
  //                   <td><span class="label">Reference No. & Date</span><br/>${metaData?.referenceNo || ''} ${metaData?.referenceDate ? new Date(metaData.referenceDate).toLocaleDateString() : ''}</td>
  //                   <td><span class="label">Other References</span><br/>${metaData?.otherReferences || ''}</td>
  //                 </tr>
  //                 <tr>
  //                   <td><span class="label">Buyer's Order No.</span><br/>${metaData?.buyerOrderNo || ''}</td>
  //                   <td><span class="label">Dated</span><br/>${metaData?.buyerOrderDate ? new Date(metaData.buyerOrderDate).toLocaleDateString() : ''}</td>
  //                 </tr>
  //                 <tr>
  //                   <td><span class="label">Dispatch Doc No.</span><br/>${metaData?.dispatchDocNo || '16.07-31.07.25'}</td>
  //                   <td><span class="label">Delivery Note Date</span><br/>${metaData?.deliveryNoteDate ? new Date(metaData.deliveryNoteDate).toLocaleDateString() : ''}</td>
  //                 </tr>
  //                 <tr>
  //                   <td><span class="label">Dispatched through</span><br/>${metaData?.dispatchedThrough || ''}</td>
  //                   <td><span class="label">Destination</span><br/><b>${metaData?.destination || 'All Alpha Area'}</b></td>
  //                 </tr>
  //                 <tr>
  //                   <td colspan="2"><span class="label">Terms of Delivery</span><br/>${metaData?.termsOfDelivery || ''}</td>
  //                 </tr>
  //               </table>
  //             </td>
  //           </tr>
  //         </table>
  
  //         <table class="main-border" style="margin-top:10px;">
  //           <thead>
  //             <tr>
  //               <th>Sl No.</th>
  //               <th>Description of Goods</th>
  //               <th>HSN/SAC</th>
  //               <th>Quantity</th>
  //               <th>Rate</th>
  //               <th>Per</th>
  //               <th>Amount</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${products.map((p, i) => `
  //               <tr>
  //                 <td>${pageIndex * productsPerPage + i + 1}</td>
  //                 <td>${p.productTitle}</td>
  //                 <td>${p.hsnCode}</td>
  //                 <td class="right">${p.quantity}</td>
  //                 <td class="right">${p.rate.toFixed(2)}</td>
  //                 <td>${p.unit}</td>
  //                 <td class="right">${p.totalAmount.toFixed(2)}</td>
  //               </tr>`).join('')}
  //               ${pageIndex === pages.length - 1 ? `
  //               <tr><td colspan="5" rowspan="5"></td><td><b></b></td><td class="right">${totalBeforeTax.toFixed(2)}</td></tr>
  //               <tr><td><b>Output CGST @9%</b></td><td class="right">${cgst.toFixed(2)}</td></tr>
  //               <tr><td><b>Output SGST @9%</b></td><td class="right">${sgst.toFixed(2)}</td></tr>
  //               <tr><td><b>Round Off</b></td><td class="right">${roundOff.toFixed(2)}</td></tr>
  //               <tr><td><b>Total</b></td><td class="right">${total.toFixed(2)}</td></tr>
  //               <tr><td colspan="7"><b>Amount Chargeable (in words):</b><i>${numToWords(total)}</i></td></tr>` : ''}
  //           </tbody>
  //         </table>
  //         ${pageIndex < pages.length - 1 ? '<div class="footer-note">continued ...</div><div class="page-break"></div>' : ''}
  //       `).join('')}
  
  //       <!-- Tax Summary Page -->
  //       <div class="page-break"></div>

  //       <div class="analysis-header" style="display:flex; justify-content:space-between; margin-top:10px;">
  //         <div>Invoice No. <strong>${invoiceNumber}</strong></div>
  //         <div>Dated <strong>${invoiceDate}</strong></div>
  //       </div>
  
  //       <div style="text-align:center;">
  //         <p><strong>SSV Telecom Private Limited</strong><br/>
  //           A-1, Landmark CHS, Sector 14<br/>
  //           Vashi , Navi Mumbai<br/>
  //           27ABECS3422Q1ZX<br/>
  //           GSTIN/UIN: 27ABECS3422Q1ZX<br/><br/>
  //           Party: <strong>SSV Telecom Private Limited</strong><br/>
  //           A/3, Landmark Soc, Sector-14 , Vashi<br/>
  //           Navi Mumbai<br/>
  //           GSTIN/UIN : 27AEGFS1650E1Z6<br/>
  //           State Name : Maharashtra, Code : 27
  //         </p>
  //       </div>
  
  //       <table class="main-border" style="margin-top:10px;">
  //         <thead>
  //           <tr>
  //             <th>HSN/SAC</th>
  //             <th>Taxable Value</th>
  //             <th colspan="2">CGST</th>
  //             <th colspan="2">SGST</th>
  //             <th>Total Tax Amount</th>
  //           </tr>
  //           <tr>
  //             <th></th>
  //             <th></th>
  //             <th>Rate</th>
  //             <th>Amount</th>
  //             <th>Rate</th>
  //             <th>Amount</th>
  //             <th></th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${hsnSummary.map(hsn => `
  //             <tr>
  //               <td>${hsn.hsnCode}</td>
  //               <td class="right">${hsn.taxableValue.toFixed(2)}</td>
  //               <td>9%</td>
  //               <td class="right">${hsn.cgstAmount.toFixed(2)}</td>
  //               <td>9%</td>
  //               <td class="right">${hsn.sgstAmount.toFixed(2)}</td>
  //               <td class="right">${hsn.totalTax.toFixed(2)}</td>
  //             </tr>`).join('')}
  //            <tr class="bold">
  //             <td><b>Total</b></td>
  //             <td class="right">${totalBeforeTax.toFixed(2)}</td>
  //             <td></td>
  //             <td class="right">${cgst.toFixed(2)}</td>
  //             <td></td>
  //             <td class="right">${sgst.toFixed(2)}</td>
  //             <td class="right">${(cgst + sgst).toFixed(2)}</td>
  //           </tr>
  //            <tr>
  //          <td colspan="7"><b>Taxable Amount (in words):</b> <i>${numToWords(parseFloat((cgst + sgst).toFixed(2)))}
  //         </i></td>
  //          </tr>
  //         </tbody>
  //       </table>
  
  //       <script>window.onload = () => window.print();</script>
  //     </body>
  //     </html>
  //   `);
  
  //   invoiceWindow.document.close();
  // };
  
  const handleGenerateInvoice = (metaData) => {
    setInvoiceMetaData(metaData);
  
    const selectedData = customers.filter(c => selectedChallans.includes(c._id));
    if (selectedData.length === 0) return;
  
    const reseller = selectedData[0]?.center?.reseller;
    const invoiceNumber = `STEL/25-26/${Math.floor(Math.random() * 100)}`;
    const invoiceDate = '31-Jul-25';
  
    const allCenters = [
      ...new Set(selectedData.map(c => c.center?.centerName).filter(Boolean))
    ];
    const centersList = allCenters.join(', ');
  
    const productMap = new Map();
    const repairCostPerUnit = 150; // Repair cost for reseller/repair stock
    
    selectedData.forEach(challan => {
      challan.products.forEach(product => {
        const productId = product.product?._id || product.product?.productTitle;
        const sourceBreakdown = product.sourceBreakdown || {};
        const fromResellerQty = sourceBreakdown.fromReseller?.quantity || 0;
        const fromOutletQty = sourceBreakdown.fromOutlet?.quantity || 0;
        const totalQty = product.receivedQuantity || product.approvedQuantity || 0;
        
        const salePrice = product.product?.salePrice || product.rate || 0;
        const productTitle = product.product?.productTitle || '';
        const hsnCode = product.product?.hsnCode || '85176990';
        
        if (productMap.has(productId)) {
          const existing = productMap.get(productId);
          
          // Calculate amounts based on source
          const outletAmount = fromOutletQty * salePrice;
          const resellerAmount = fromResellerQty * repairCostPerUnit; // Repair cost only
          
          existing.quantity += totalQty;
          existing.outletQty += fromOutletQty;
          existing.resellerQty += fromResellerQty;
          existing.outletAmount += outletAmount;
          existing.resellerAmount += resellerAmount;
          existing.totalAmount += outletAmount + resellerAmount;
        } else {
          // Calculate amounts based on source
          const outletAmount = fromOutletQty * salePrice;
          const resellerAmount = fromResellerQty * repairCostPerUnit; // Repair cost only
          
          productMap.set(productId, {
            productTitle: productTitle,
            hsnCode: hsnCode,
            quantity: totalQty,
            outletQty: fromOutletQty, // New stock from outlet
            resellerQty: fromResellerQty, // Repair stock from reseller
            rate: salePrice,
            repairRate: repairCostPerUnit, // Repair cost rate
            outletAmount: outletAmount,
            resellerAmount: resellerAmount,
            totalAmount: outletAmount + resellerAmount,
            unit: 'Nos'
          });
        }
      });
    });
  
    const combinedProducts = Array.from(productMap.values());
  
    // Calculate totals
    const totalOutletAmount = combinedProducts.reduce((sum, p) => sum + p.outletAmount, 0);
    const totalResellerAmount = combinedProducts.reduce((sum, p) => sum + p.resellerAmount, 0);
    const totalBeforeTax = totalOutletAmount + totalResellerAmount;
    
    const cgst = totalBeforeTax * 0.09;
    const sgst = totalBeforeTax * 0.09;
    const roundOff = Math.round(totalBeforeTax + cgst + sgst) - (totalBeforeTax + cgst + sgst);
    const total = totalBeforeTax + cgst + sgst + roundOff;
  
    const hsnMap = new Map();
    combinedProducts.forEach(product => {
      const hsn = product.hsnCode;
      const taxableValue = product.totalAmount;
      const cgstAmount = taxableValue * 0.09;
      const sgstAmount = taxableValue * 0.09;
      const totalTax = cgstAmount + sgstAmount;
      
      if (hsnMap.has(hsn)) {
        const existing = hsnMap.get(hsn);
        existing.taxableValue += taxableValue;
        existing.cgstAmount += cgstAmount;
        existing.sgstAmount += sgstAmount;
        existing.totalTax += totalTax;
      } else {
        hsnMap.set(hsn, {
          hsnCode: hsn,
          taxableValue: taxableValue,
          cgstAmount: cgstAmount,
          sgstAmount: sgstAmount,
          totalTax: totalTax
        });
      }
    });
  
    const hsnSummary = Array.from(hsnMap.values());
  
    const productsPerPage = 8;
    const pages = [];
    for (let i = 0; i < combinedProducts.length; i += productsPerPage) {
      pages.push(combinedProducts.slice(i, i + productsPerPage));
    }
  
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
      <html>
      <head>
        <title>Invoice - ${reseller?.businessName || 'SSV Alpha Broadband LLP'}</title>
        <style>
          @page { size: A4; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0;}
          .title { text-align: center; font-weight: bold; font-size: 16px; margin: 6px 0; }
          .main-border { border: 1px solid #000; width: 100%; border-collapse: collapse; }
          .main-border td, .main-border th { border: 1px solid #000; padding: 5px; vertical-align: top; }
          .meta-table { width: 100%; border-collapse: collapse; }
          .meta-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
          .label { font-weight: bold; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .footer-note { font-style: italic; text-align: right; margin-top: 4px; }
          .repair-note { color: #666; font-size: 0.9em; }
          @media print { .page-break { page-break-before: always; } }
        </style>
      </head>
      <body>
        <div class="title">Tax Invoice</div>
  
        ${pages.map((products, pageIndex) => `
          <table class="main-border">
            <tr>
              <td style="width:50%;">
                <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
                  <div class="bold">SSV Telecom Private Limited FY 22-23</div>
                  A-1, Landmark CHS, Sector 14<br/>
                  Vashi, Navi Mumbai<br/>
                  27ABECS3422Q1ZX<br/>
                  GSTIN/UIN: 27ABECS3422Q1ZX
                </div>
  
                <span class="label">Consignee (Ship to)</span><br/>
                ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
                ${centersList || 'All Alpha Area'}<br/><br/>
                GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
                State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
                <hr/>
  
                <span class="label">Buyer (Bill to)</span><br/>
                ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
                ${reseller?.address1 || 'A/3, Landmark Soc, Sector-14, Vashi'}<br/>
                GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
                State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
              </td>
  
              <td style="width:50%; padding:0;">
                <table class="meta-table">
                  <tr>
                    <td><span class="label">Invoice No.</span><br/>${invoiceNumber}</td>
                    <td><span class="label">Dated</span><br/>${invoiceDate}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Delivery Note</span><br/>${metaData?.deliveryNote || ''}</td>
                    <td><span class="label">Mode/Terms of Payment</span><br/>${metaData?.modeOfPayment || ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Reference No. & Date</span><br/>${metaData?.referenceNo || ''} ${metaData?.referenceDate ? new Date(metaData.referenceDate).toLocaleDateString() : ''}</td>
                    <td><span class="label">Other References</span><br/>${metaData?.otherReferences || ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Buyer's Order No.</span><br/>${metaData?.buyerOrderNo || ''}</td>
                    <td><span class="label">Dated</span><br/>${metaData?.buyerOrderDate ? new Date(metaData.buyerOrderDate).toLocaleDateString() : ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Dispatch Doc No.</span><br/>${metaData?.dispatchDocNo || '16.07-31.07.25'}</td>
                    <td><span class="label">Delivery Note Date</span><br/>${metaData?.deliveryNoteDate ? new Date(metaData.deliveryNoteDate).toLocaleDateString() : ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Dispatched through</span><br/>${metaData?.dispatchedThrough || ''}</td>
                    <td><span class="label">Destination</span><br/><b>${metaData?.destination || 'All Alpha Area'}</b></td>
                  </tr>
                  <tr>
                    <td colspan="2"><span class="label">Terms of Delivery</span><br/>${metaData?.termsOfDelivery || ''}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
  
          <table class="main-border" style="margin-top:10px;">
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Description of Goods</th>
                <th>HSN/SAC</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Per</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((p, i) => {
                const productIndex = pageIndex * productsPerPage + i + 1;
                
                // If product has both outlet and reseller quantities, show separate rows
                if (p.outletQty > 0 && p.resellerQty > 0) {
                  return `
                    <!-- New product row -->
                    <tr>
                      <td rowspan="2">${productIndex}</td>
                      <td>${p.productTitle} (New)</td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.outletQty}</td>
                      <td class="right">${p.rate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.outletAmount.toFixed(2)}</td>
                    </tr>
                    <!-- Repair product row -->
                    <tr>
                      <td>${p.productTitle} <span class="repair-note">(Repair Return)</span></td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.resellerQty}</td>
                      <td class="right">${p.repairRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.resellerAmount.toFixed(2)}</td>
                    </tr>
                  `;
                } else if (p.resellerQty > 0) {
                  // Only repair returns
                  return `
                    <tr>
                      <td>${productIndex}</td>
                      <td>${p.productTitle} <span class="repair-note">(Repair Return)</span></td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.resellerQty}</td>
                      <td class="right">${p.repairRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.resellerAmount.toFixed(2)}</td>
                    </tr>
                  `;
                } else {
                  // Only new products
                  return `
                    <tr>
                      <td>${productIndex}</td>
                      <td>${p.productTitle}</td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.outletQty}</td>
                      <td class="right">${p.rate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.outletAmount.toFixed(2)}</td>
                    </tr>
                  `;
                }
              }).join('')}
              ${pageIndex === pages.length - 1 ? `
              <tr>
                <td colspan="4" rowspan="7"></td>
                <td colspan="2"><b>Subtotal (New Products)</b></td>
                <td class="right">${totalOutletAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2"><b>Subtotal (Repair Returns)</b></td>
                <td class="right">${totalResellerAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2"><b>Total Before Tax</b></td>
                <td class="right">${totalBeforeTax.toFixed(2)}</td>
              </tr>
              <tr><td colspan="2"><b>Output CGST @9%</b></td><td class="right">${cgst.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Output SGST @9%</b></td><td class="right">${sgst.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Round Off</b></td><td class="right">${roundOff.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Total</b></td><td class="right">${total.toFixed(2)}</td></tr>
              <tr><td colspan="7"><b>Amount Chargeable (in words):</b><i>${numToWords(total)}</i></td></tr>` : ''}
            </tbody>
          </table>
          ${pageIndex < pages.length - 1 ? '<div class="footer-note">continued ...</div><div class="page-break"></div>' : ''}
        `).join('')}
  
        <!-- Tax Summary Page -->
        <div class="page-break"></div>
  
        <div class="analysis-header" style="display:flex; justify-content:space-between; margin-top:10px;">
          <div>Invoice No. <strong>${invoiceNumber}</strong></div>
          <div>Dated <strong>${invoiceDate}</strong></div>
        </div>
  
        <div style="text-align:center;">
          <p><strong>SSV Telecom Private Limited</strong><br/>
            A-1, Landmark CHS, Sector 14<br/>
            Vashi , Navi Mumbai<br/>
            27ABECS3422Q1ZX<br/>
            GSTIN/UIN: 27ABECS3422Q1ZX<br/><br/>
            Party: <strong>SSV Telecom Private Limited</strong><br/>
            A/3, Landmark Soc, Sector-14 , Vashi<br/>
            Navi Mumbai<br/>
            GSTIN/UIN : 27AEGFS1650E1Z6<br/>
            State Name : Maharashtra, Code : 27
          </p>
        </div>
  
        <table class="main-border" style="margin-top:10px;">
          <thead>
            <tr>
              <th>HSN/SAC</th>
              <th>Taxable Value</th>
              <th colspan="2">CGST</th>
              <th colspan="2">SGST</th>
              <th>Total Tax Amount</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Rate</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${hsnSummary.map(hsn => `
              <tr>
                <td>${hsn.hsnCode}</td>
                <td class="right">${hsn.taxableValue.toFixed(2)}</td>
                <td>9%</td>
                <td class="right">${hsn.cgstAmount.toFixed(2)}</td>
                <td>9%</td>
                <td class="right">${hsn.sgstAmount.toFixed(2)}</td>
                <td class="right">${hsn.totalTax.toFixed(2)}</td>
              </tr>`).join('')}
             <tr class="bold">
              <td><b>Total</b></td>
              <td class="right">${totalBeforeTax.toFixed(2)}</td>
              <td></td>
              <td class="right">${cgst.toFixed(2)}</td>
              <td></td>
              <td class="right">${sgst.toFixed(2)}</td>
              <td class="right">${(cgst + sgst).toFixed(2)}</td>
            </tr>
             <tr>
           <td colspan="7"><b>Taxable Amount (in words):</b> <i>${numToWords(parseFloat((cgst + sgst).toFixed(2)))}
          </i></td>
           </tr>
          </tbody>
        </table>
        
        <!-- Summary Section -->
        <div style="margin-top: 20px; padding: 10px; border: 1px solid #000;">
          <h4>Invoice Summary</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px; border-bottom: 1px solid #ddd;"><strong>New Products:</strong></td>
              <td style="padding: 5px; border-bottom: 1px solid #ddd; text-align: right;">₹ ${totalOutletAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px; border-bottom: 1px solid #ddd;"><strong>Repair Returns (${repairCostPerUnit}/unit):</strong></td>
              <td style="padding: 5px; border-bottom: 1px solid #ddd; text-align: right;">₹ ${totalResellerAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px; border-bottom: 1px solid #ddd;"><strong>Subtotal:</strong></td>
              <td style="padding: 5px; border-bottom: 1px solid #ddd; text-align: right;">₹ ${totalBeforeTax.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px; border-bottom: 1px solid #ddd;"><strong>GST (18%):</strong></td>
              <td style="padding: 5px; border-bottom: 1px solid #ddd; text-align: right;">₹ ${(cgst + sgst).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px;"><strong>Total Invoice Amount:</strong></td>
              <td style="padding: 5px; text-align: right;"><strong>₹ ${total.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>
  
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
  
    invoiceWindow.document.close();
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
        Error loading data: {error}
      </div>
    );
  }
  
  const renderTable = () => (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
          <CTableHeaderCell scope="col">
  <input
    type="checkbox"
    checked={selectedChallans.length === filteredCustomers.length}
    onChange={handleSelectAll}
  />
</CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
              Order Date {getSortIcon('date')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('orderNumber')} className="sortable-header">
              Order Number {getSortIcon('orderNumber')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('challanNo')} className="sortable-header">
              Challan No {getSortIcon('challanNo')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('challanDate')} className="sortable-header">
              Challan Date {getSortIcon('challanDate')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('warehouse.centerName')} className="sortable-header">
              Warehouse {getSortIcon('warehouse.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
              Branch {getSortIcon('center.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.email')} className="sortable-header">
              Posted By {getSortIcon('createdBy.email')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('completionInfo.completedOn')} className="sortable-header">
              Completed At {getSortIcon('completionInfo.completedOn')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((item) => (
              <CTableRow key={item._id}>
<CTableDataCell>
  <input
    type="checkbox"
    checked={selectedChallans.includes(item._id)}
    onChange={() => handleSelectChallan(item._id)}
  />
</CTableDataCell>

                <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
                <CTableDataCell>
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleClick(item._id)}
                    style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                  >
                    {item.orderNumber}
                  </button>
                </CTableDataCell>
                <CTableDataCell>
                  <strong>{item.challanNo || 'N/A'}</strong>
                </CTableDataCell>
                <CTableDataCell>
                  {item.challanDate ? formatDate(item.challanDate) : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>{item.warehouse?.centerName || ''}</CTableDataCell>
                <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  {item.createdBy?.email || 'N/A'} 
                  {item.createdAt && ` At ${new Date(item.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: 'numeric',
                    hour12: true 
                  })}`}
                </CTableDataCell>
                <CTableDataCell>
                  {item.completionInfo?.completedOn ? formatDateTime(item.completionInfo.completedOn) : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex gap-1">
                    <div
                      className="dropdown-container"
                      ref={el => dropdownRefs.current[item._id] = el}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CButton
                        size="sm"
                        className='option-button btn-sm'
                        onClick={() => handleGenerateChallan(item)}
                      >
                        <CIcon icon={cilFile} />
                       Challan
                      </CButton>
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center">
                No completed stock requests found for invoice generation
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
  return (
    <div>
      <div className='title'>Sale Invoices</div>
    
      <SearchSaleInvoice
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        resellers={resellers}
        defaultStatus="Completed" 
      />

      <ChallanModal
        visible={showChallanModal}
        onClose={() => setShowChallanModal(false)}
        data={selectedChallan}
      />

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.reseller || activeSearch.center || activeSearch.startDate || activeSearch.endDate) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
               <CIcon icon={cilZoomOut} className='icon' />Reset Search
              </CButton>
            )}
            {(activeSearch.reseller || activeSearch.startDate || activeSearch.endDate || activeSearch.center) && selectedChallans.length > 0 && (
                <CButton 
                    size="sm"
                    className="action-btn me-2"
                   onClick={handleGenerateInvoice}
                >
                <CIcon icon={cilFile} className="me-1" />
                     Generate Invoice
                </CButton>
            )}

          </div>
          
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!(activeSearch.keyword || activeSearch.center || activeSearch.outlet)} 
                placeholder={activeSearch.keyword || activeSearch.center || activeSearch.outlet ? "Disabled during advanced search" : ""}
              />
            </div>
          </div>

          {renderTable()}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default SaleInvoices;