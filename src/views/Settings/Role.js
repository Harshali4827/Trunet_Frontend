import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faCog, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import '../../components/Styling.css'; 

function Role()
{
   //  for 2nd form...
          const [showForm, setShowForm] = useState(false);
          const handleForm = () => {
    setShowForm((prev) => !prev);
  };
         
const initialData = [
    {id:'1',role:'center',permission:'Add purchase stock'},
     {id:'2',role:'outlet',permission:'move stock'},
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
           {!showForm ? (
    <>
         {/* <h1 className='headingF'>Role List</h1>  */}
                <div className='top_border'>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',marginTop:'10px',
                 }}>
                     <form style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        <div style={{ display:'flex',flexWrap:'wrap',gap:'10px',marginLeft:'10px'}}>
                                        <button  className='buttonsASE'
                                onClick={() => setShowForm(true)}
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
  <th style={thStyle}>Id {renderSortControls('id')}</th>
  <th style={thStyle}>Role{renderSortControls('role')}</th>
  <th style={thStyle}>Permission{renderSortControls('permission')}</th>
  <th style={thStyle}>Action</th>
</tr>
</thead>
<tbody>
  {data.map((item, index) => (
    <tr key={index}>
      <td style={tdStyle}>{item.id}</td>
      <td style={tdStyle}>{item.role}</td>
      <td style={tdStyle}>{item.permission}</td>
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
                       </>
           ):(
            <>
           
        <div 
              style={{ display: "flex", alignItems: "center", gap: "10px",marginBottom:'10px' }}
            
              >
                <button  onClick={handleForm}
                  style={{display:'inline-block',textRendering:'auto',boxSizing:'border-box',color:'white',cursor:'pointer',backgroundColor:'#2759a2',borderColor:'#2759a2',boxShadow:'none',border:'1px solid transparent',padding:'5px 10px',fontSize:'12px',lineHeight:'1.5',textAlign:'center',textDecoration:'none',backgroundImage:'none',whiteSpace:'nowrap',verticalAlign:'middle',borderRadius:'3px',}}
                  
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{color: 'white',marginRight: '6px',fontSize:'12px',border: 'none',display: 'inline-block',textRendering: 'auto'
                    }}
                  />
                  Back
                </button>
                <h1 style={{ marginBottom: "20px",fontSize:'24px',margin:'0',fontFamily:'sans-serif' ,fontWeight:'500',display:'block',boxSizing:'border-box'}}>Add Role</h1>
              </div>
        <div
        style={{borderTop: "3px solid #2759A2",padding: "10px",display: "flex",flexDirection: "column",backgroundColor: "white"
        }}
      >
       <form
          style={{
            display: 'flex',gap: '20px',flexDirection: 'column'
          }}
        >
         
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* 1st ROW..  */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <label className="label">Role Title<span style={{ color: '#dc3545' }}>*</span></label>
        <input
          type="text"
          placeholder="Role Title"
          style={{
            display: 'block',
            width: '100%',
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
  </form>
  </div>
            </>
           )}
        </>
    )
}
export default Role;