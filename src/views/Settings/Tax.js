import React, { useState } from "react";
import '../../components/Styling.css'; 

function Tax()
{
const initialData = [
        {title:'SGST@9',category:'SGST',rate:'9',remark:''},
        {title:'IGST@9',category:'SGST',rate:'9',remark:'',},   
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
         {/* <h1 className='headingF'>Center's Stock</h1>  */}
                <div className='top_border'>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',marginTop:'10px',
                 }}>
                     <form style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
       
                       <hr style={{ margin: '15px 0 10px', opacity: '0.1', flexBasis: '100%' }} />
       
                       <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', marginRight: '20px' }}>
                           <label>Search:</label>
                           <input type="text" placeholder="" className='searchBTN' />
                       </div>
                       </form>
                       </div>
                       <div style={{ overflowX: 'auto', marginTop: '10px',marginLeft:'10px',marginRight:'10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
    <th style={thStyle}>Title {renderSortControls('title')}</th>
    <th style={thStyle}>Category {renderSortControls('category')}</th>
    <th style={thStyle}>Rate {renderSortControls('rate')}</th>
    <th style={thStyle}>Remark {renderSortControls('remark')}</th>
    <th style={thStyle}>Status {renderSortControls('status')}</th>
  </tr>
</thead>
<tbody>
  {data.map((item, index) => (
    <tr key={index}>
      <td style={tdStyle}>{item.title}</td>
      <td style={tdStyle}>{item.category}</td>
      <td style={tdStyle}>{item.rate}</td>
      <td style={tdStyle}>{item.remark}</td>
      <td style={tdStyle}>
        <button style={{backgroundColor:'#00a65a',
                display: 'inline',
    padding:' .2em .6em .3em',
    fontSize:'75%',
    fontWeight: '700',
    lineHeight: '1',
    textalign: 'center',
    whitespace: 'nowrap',
    verticalalign: 'baseline',
    borderradius: '.25em',
    color:'white',
    borderColor:'#00a65a',
        }}>Enable</button>
      </td>
    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                       </div>
        </>
    )
}
export default Tax;