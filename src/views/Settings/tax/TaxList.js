import '../../../css/table.css';
import '../../../css/form.css';
import React, { useState} from 'react';
import {
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CCard, CCardBody, CFormInput,CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom } from '@coreui/icons';

const TaxList = () => {
  const staticData = [
    { title: "SGST@9%", category: "SGST", rate: 9, remark: "", status: "Enable" },
    { title: "CGST@9%", category: "CGST", rate: 9, remark: "", status: "Enable" },
    { title: "IGST@9%", category: "IGST", rate: 9, remark: "", status: "Enable" },
    { title: "IGST@18%", category: "IGST", rate: 18, remark: "", status: "Enable" },
    { title: "SGST@2.5%", category: "SGST", rate: 2.5, remark: "", status: "Enable" },
    { title: "CGST@2.5%", category: "CGST", rate: 2.5, remark: "", status: "Enable" },
    { title: "IGST@5%", category: "IGST", rate: 5, remark: "", status: "Enable" },
    { title: "SGST@6%", category: "SGST", rate: 6, remark: "", status: "Enable" },
    { title: "CGST@6%", category: "CGST", rate: 6, remark: "", status: "Enable" },
    { title: "IGST@12%", category: "IGST", rate: 12, remark: "", status: "Enable" },
    { title: "SGST@14%", category: "SGST", rate: 14, remark: "", status: "Enable" },
    { title: "CGST@14%", category: "CGST", rate: 14, remark: "", status: "Enable" },
    { title: "IGST@28%", category: "IGST", rate: 28, remark: "", status: "Enable" }
  ];

  const [data, setData] = useState(staticData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? 
      <CIcon icon={cilArrowTop} className="ms-1" /> : 
      <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='title'>Tax List</div>

      <CCard className='mt-4 table-container'>
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
              />
            </div>
          </div>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover responsive className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell onClick={() => handleSort("title")} className="sortable-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Title</span> {getSortIcon("title")}
                    </div>
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort("category")} className="sortable-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Category</span> {getSortIcon("category")}
                    </div>
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort("rate")} className="sortable-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Rate</span> {getSortIcon("rate")}
                    </div>
                  </CTableHeaderCell>
                  <CTableHeaderCell>Remark</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{item.title}</CTableDataCell>
                      <CTableDataCell>{item.category}</CTableDataCell>
                      <CTableDataCell>{item.rate}</CTableDataCell>
                      <CTableDataCell>{item.remark}</CTableDataCell>
                      <CTableDataCell>
                        <span className="badge bg-success">{item.status}</span>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center">No records found</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TaxList;
