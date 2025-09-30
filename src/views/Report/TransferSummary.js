import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPrint, faSearch,} from "@fortawesome/free-solid-svg-icons";
import '../../components/Styling.css'; 

function TransferSummary()
{
const initialData = [
           { center: 'Vashi warehouse', parentCenter:'Airoli',product:'Green jointer', totalQty: '2345',},
           { center: 'Vashi warehouse', parentCenter:'Airoli',product: 'switch', totalQty: '1245',},
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
         {/* <h1 className='headingF'>Transfer Summary Report</h1>  */}
         
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
                <div style={{backgroundColor:'#00c0ef',borderColor:'#00acd6',borderRadius:'3px',display:'block',
                padding: '15px',
                 marginBottom: '20px',
                 border: '1px solid transparent',width:'100%',marginLeft:'10px',marginRight:'10px'}}>
                
                    <h4 style={{fontweight: '600',
                        display: 'block',
                        marginblockstart: '1.33em',
                        marginblockend: '1.33em',
                        margininlinestart: '0px',
                        margininlineend: '0px',
                        fontsize:'18px',
                        marginBottom:'10px',
                        color:'#fff',
                    }}>Showing Result</h4>
                    <li style={{color:'#fff'}}><strong style={{color:'#fff',fontSize: '14px',}}>Month:</strong>July-2025</li>
                </div>
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
                    <th style={thStyle}>Center {renderSortControls('center')}</th>
                    <th style={thStyle}>Parent Center {renderSortControls('parentCenter')}</th>
                    <th style={thStyle}>Product{renderSortControls('product')}</th>
                    <th style={thStyle}>Total Qty{renderSortControls('totalQty')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>{item.center}</td>
                      <td style={tdStyle}>{item.parentCenter}</td>
                      <td style={tdStyle}>{item.product}</td>
                      <td style={tdStyle}>{item.totalQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                       </div>
                       
        </>
    )
}
export default TransferSummary;