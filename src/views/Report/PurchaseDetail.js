import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPrint, faSearch,} from "@fortawesome/free-solid-svg-icons";
import '../../components/Styling.css'; 

function PurchaseDetail()
{
const initialData = [
           { date: '24-7-25',center: 'Diva',      invoiceNo: '24.7-25',vendor:'Beauty Infotech',product:'red cutter',qty:'1',price:'544',remark:''},
           { date: '24-7-25',center: 'Mahalakshmi', invoiceNo: '24.7-25',vendor:'Beauty Infotech',product:'led',qty:'2',price:'445',remark:''},
           { date: '24-7-25',center: 'Mahalakshmi', invoiceNo: '24.7-25',vendor:'Beauty Infotech',product:'led',qty:'2',price:'543',remark:''},
           { date: '24-7-25',center: 'Mahalakshmi', invoiceNo: '24.7-25',vendor:'Beauty Infotech',product:'led',qty:'2',price:'43',remark:''},
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
         {/* <h1 className='headingF'>Purchase Detail</h1>  */}
                <div className='top_border'>
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
                <th style={thStyle}>Date {renderSortControls('date')}</th>
                <th style={thStyle}>Center {renderSortControls('center')}</th>
                <th style={thStyle}>Invoice No. {renderSortControls('invoiceNo')}</th>
                <th style={thStyle}>Vendor{renderSortControls('vendor')}</th>
                <th style={thStyle}>Product {renderSortControls('product')}</th>
                <th style={thStyle}>Qty {renderSortControls('qty')}</th>
                <th style={thStyle}>Price {renderSortControls('price')}</th>
                <th style={thStyle}>Remark {renderSortControls('remark')}</th>
                
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{item.date}</td>
                  <td style={tdStyle}>{item.center}</td>
                  <td style={tdStyle}>{item.invoiceNo}</td>
                  <td style={tdStyle}>{item.vendor}</td>
                  <td style={tdStyle}>{item.product}</td>
                  <td style={tdStyle}>{item.qty}</td>
                  <td style={tdStyle}>{item.price}</td>
                  <td style={tdStyle}>{item.remark}</td>
                </tr>
                  ))}
                </tbody>
              </table>
            </div>
                       </div>
        </>
    )
}
export default PurchaseDetail;