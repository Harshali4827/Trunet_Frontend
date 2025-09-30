import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faCog, faXmark} from "@fortawesome/free-solid-svg-icons";
import '../../components/Styling.css'; 

function Partner()
{
const initialData = [
   {partnerName:'TRU FUTURE'},
   {partnerName:'TRU ALPHA'},
         ];
          const [showPopup, setShowPopup] = useState(false);
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
         {/* <h1 className='headingF'>Role List</h1>  */}
                <div className='top_border'>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',marginTop:'10px',
                 }}>
                     <form style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        <div style={{ display:'flex',flexWrap:'wrap',gap:'10px',marginLeft:'10px'}}>
                       <button  className='buttonsASE' onClick={(e) => {e.preventDefault();setShowPopup(true);}}
                                >
                                  <FontAwesomeIcon icon={faPlus} className='iconsASE'/>Add
                                </button>
                                     </div>
       
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
  <th style={thStyle}>Partner Name{renderSortControls('partnerName')}</th>
  <th style={thStyle}>Action</th>
</tr>
</thead>
<tbody>
  {data.map((item, index) => (
    <tr key={index}>
      <td style={tdStyle}>{item.partnerName}</td>
      <td style={tdStyle}>
        <button
          style={{
            marginRight: '5px',
            backgroundColor: '#f4f4f4',
            color: '#444',
            borderColor: '#ddd',
            borderRadius: '3px',
            boxShadow: 'none',
            border: '1px solid transparent',
            display: 'inline-block',
          }}
        >
          <FontAwesomeIcon icon={faCog} className="iconsASE" style={{ color: '#444' }} /> Option
        </button>
      </td>
    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                       </div>
                         {/* POPUP */}
{showPopup && (
<div style={{
position: 'fixed',
top: 0, left: 0,
width: '100%',
height: '100%',
backgroundColor: 'rgba(0,0,0,0.4)',
display: 'flex',
justifyContent: 'center',
alignItems: 'flex-start', 
paddingTop: '50px',  
zIndex: 1000
}}>
<div style={{
backgroundColor: '#fff',
padding: '20px',
borderRadius: '8px',
width: '700px',
maxWidth: '90%'
}}>

<div style={{ position: 'relative' }}>
{/* Close Button */}
<button
onClick={() => setShowPopup(false)}  
style={{
position: 'absolute',
top: '10px',
right: '10px',
background: 'transparent',
border: 'none',
fontSize: '18px',
cursor: 'pointer',
}}
>
<FontAwesomeIcon icon={faXmark} />
</button>
</div>
<h4 style={{
    fontSize: '18px',
    fontWeight: '500',
    display: 'block',
    marginBlockStart: '1.33em',
    marginBlockEnd: '1.33em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
  }}>
    Partner Add
  </h4>

<hr style={{ margin: "15px 0 10px", opacity: "0.1" }} />

  <form style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
    {/* Row with both fields */}
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <label className="label">Partner Name <span style={{ color: '#dc3545' }}>*</span></label>
        <input
          type="text"
          placeholder="Product category remark"
          style={{
            display: 'block',
            // width: '100%',
            width:'66%',
            height: '34px',
            padding: '6px 12px',
            fontSize: '14px',
            lineHeight: '1.42857143',
            color: '#555',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
          }}
        />
      </div>
    </div>
    <hr style={{ margin: "15px 0 10px", opacity: "0.1" }} />

    {/* Submit Button */}
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginBottom: "10px" }}>
      <button className="submit_Next" style={{ backgroundColor: '#dd4b39', borderColor: '#d73925' }}>
        Submit
      </button>
    </div>
  </form>
  </div>
  </div>
             )}
        </>
    )
}
export default Partner;