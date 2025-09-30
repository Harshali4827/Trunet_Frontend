import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPrint, faSearch,} from "@fortawesome/free-solid-svg-icons";
import '../../components/Styling.css'; 

function OnuTrackReport()
{
    const initialData = [
  { activationDate: '2025-07-20',customer: 'John Doe',product: 'Router Z500',serialNo: 'SN12345678',
   connectionType: 'Fiber',partnerName: 'Partner A',area: 'North Zone',onuAmount: 2000
  },

  { activationDate: '2025-07-21',customer: 'Jane Smith',product: 'Router X300',serialNo: 'SN87654321',
   connectionType: 'DSL',partnerName: 'Partner B',area: 'East Zone',onuAmount: 1500
  },
];
         const [data, setData] = useState(initialData);
         const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
       
         const handleSort = (key, direction) => {
           const sortedData = [...data].sort((a, b) => {
             if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
             if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
             return 0;
           });
           setData(sortedData);
           setSortConfig({ key, direction });
         };
       
         const renderSortControls = (key) => {
           const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
           const isDesc = sortConfig.key === key && sortConfig.direction === 'desc';
           return (
             <span style={{ marginLeft: '6px' }}>
               <span
                 onClick={() => handleSort(key, 'asc')}
                 style={{ fontWeight: isAsc ? 'bold' : 'normal', cursor: 'pointer' }}
               >
                 ↑
               </span>
               <span
                 onClick={() => handleSort(key, 'desc')}
                 style={{ fontWeight: isDesc ? 'bold' : 'normal', marginLeft: '4px', cursor: 'pointer' }}
               >
                 ↓
               </span>
             </span>
           );
         };
       
         const thStyle = {
           backgroundColor: '#f4f4f4',
           border: '1px solid #ccc',
           padding: '8px',
           textAlign: 'left'
         };
       
         const tdStyle = {
           border: '1px solid #ccc',
           padding: '8px'
         };

    return(
        <>
         {/* <h1 className='headingF'>Onu Track Report</h1>  */}
                <div className='top_border' >
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',marginTop:'10px',
                 }}>
                     <form style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        <div style={{ display:'flex',flexWrap:'wrap',gap:'10px',marginLeft:'10px'}}>
                                        <button className='buttonsASE'>
                                         <FontAwesomeIcon icon={faSearch} className='iconsASE' /> Search
                                       </button>
                                        <button className='buttonsASE'>
                                         <FontAwesomeIcon icon={faFileExcel}  className='iconsASE' />Export
                                       </button>
                                       <button  className='buttonsASE'>
                                         <FontAwesomeIcon icon={faPrint} className='iconsASE'/>Print
                                       </button>
                                     </div>
       
                       <hr style={{ margin: '15px 0 10px', opacity: '0.1', flexBasis: '100%' }} />
       
                       <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', marginRight: '20px' }}>
                           <label>Search:</label>
                           <input type="text" placeholder="" className='searchBTN' />
                       </div>
                       </form>
                       </div>
                       <div style={{ overflowX: 'auto',  margin:'10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>               
  <tr>
    <th style={thStyle}>Activation Date {renderSortControls('activationDate')}</th>
    <th style={thStyle}>Customer {renderSortControls('customer')}</th>
    <th style={thStyle}>Product {renderSortControls('product')}</th>
    <th style={thStyle}>Serial No. {renderSortControls('serialNo')}</th>
    <th style={thStyle}>Connection Type {renderSortControls('connectionType')}</th>
    <th style={thStyle}>Partner Name {renderSortControls('partnerName')}</th>
    <th style={thStyle}>Area {renderSortControls('area')}</th>
    <th style={thStyle}>ONU Amount {renderSortControls('onuAmount')}</th>
  </tr>
</thead>
<tbody>
  {data.map((item, index) => (
    <tr key={index}>
      <td style={tdStyle}>{item.activationDate}</td>
      <td style={tdStyle}>{item.customer}</td>
      <td style={tdStyle}>{item.product}</td>
      <td style={tdStyle}>{item.serialNo}</td>
      <td style={tdStyle}>{item.connectionType}</td>
      <td style={tdStyle}>{item.partnerName}</td>
      <td style={tdStyle}>{item.area}</td>
      <td style={tdStyle}>{item.onuAmount}</td>
    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                       </div>
        </>
    )
}
export default OnuTrackReport;