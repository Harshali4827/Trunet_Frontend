import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faCog, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import '../../components/Styling.css'; 


function CenterSetting()
{
const initialData = [
               {title:'AIROLI',code:'AIR1',type:'center',email:'abc@gmail.com',mobile:'',address:'mumbai'},
               {title:'AIROLI',code:'AIR2',type:'Outlet',email:'xyz@gmail.co',mobile:'',address:'nashik'},
         ];
       
        //  for new form.. 
         const [showForm, setShowForm] = useState(false);
            const handleForm = () => {
            setShowForm((prev) => !prev);
          };

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
         {/* <h1 className='headingF'>Center List</h1>  */}
                <div className='top_border'>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',marginTop:'10px',
                 }}>
                     <form style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        <div style={{ display:'flex',flexWrap:'wrap',gap:'10px',marginLeft:'10px'}}>
                                        <button  className='buttonsASE'
                                // onClick={() => setShowForm(true)}
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
    <th style={thStyle}>Center Title {renderSortControls('title')}</th>
    <th style={thStyle}>Center Code {renderSortControls('code')}</th>
    <th style={thStyle}>Center Type {renderSortControls('type')}</th>
    <th style={thStyle}>Email {renderSortControls('email')}</th>
    <th style={thStyle}>Mobile {renderSortControls('mobile')}</th>
    <th style={thStyle}>Address {renderSortControls('address')}</th>
    <th style={thStyle}>Action</th>
  </tr>
</thead>
<tbody>
  {data.map((item, index) => (
    <tr key={index}>
      <td style={tdStyle}>{item.title}</td>
      <td style={tdStyle}>{item.code}</td>
      <td style={tdStyle}>{item.type}</td>
      <td style={tdStyle}>{item.email}</td>
      <td style={tdStyle}>{item.mobile}</td>
      <td style={tdStyle}>{item.address}</td>
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
          // 2nd form..
          <>
  <div style={{ display: "flex", alignItems: "center", gap: "10px",marginBottom:'10px' }}>
                <button onClick={handleForm}
                  className="backBtn">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="iconsASE"
                  />
                  Back
                </button>
                <h1 style={{ marginBottom: "20px",fontSize:'24px',margin:'0',fontFamily:'sans-serif' ,fontWeight:'500',display:'block',boxSizing:'border-box'}}>Add Center</h1>
              </div>
               <div
        style={{
          borderTop: '3px solid #2759A2',padding: '10px',display: 'flex',flexDirection: 'column',backgroundColor: 'white'
        }}
      >

         <form
          style={{
            display: 'flex',gap: '20px',flexDirection: 'column'
          }}
        >
            {/* 1st ROW .. */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
 <div style={{ display: 'flex', flexDirection: 'column', flex: '1' ,gap:'2px'}}>
        <label className="label">Center Type <span style={{color:'#dc3545'}}>*</span></label>
        <select
        style={{
color: '#444',
lineHeight: '28px',
width:'100%',
maxWidth:'66%',
display: 'block',
paddingLeft: '8px',
paddingRight: '20px',
overflow: 'hidden',
textOverflow: 'ellipsis',
whiteSpace: 'nowrap',
boxSizing:'borderox',
height: 'auto',
margintop: '-4px',
fontWeight: '400',
boxSizing:'border-box',
height:'34px',
        }}
        >
            <option value="">SELECT</option>
            <option value="center1">Center </option>
            <option value="center2">Outlet</option>
        </select>
        </div>

 <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
 <label className="label">Center Name<span style={{color:'#dc3545'}}>*</span></label>
    <input type="text"  placeholder="Center Name" style={{
paddingBlock: '1px',
paddingInline: '2px',
display: 'block',
width: '100%',
maxWidth:'66%',
height: '34px',
padding: '6px 12px',
fontSize: '14px',
lineHeight: '1.42857143',
color: '#555',
backgroundColor: '#fff',
backgroundImage: 'none',
border: '1px solid #ccc',
boxShadow: 'none',
borderRadius:'0',
boxShadow:'none',
borderColor:'b94a48',
cursor:'text',
textTransform:'none',
        textIndent:'0px',
        textShadow:'none',
    }}></input>
  </div>
          </div>
          {/* 2nd ROW .. */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
 <label className="label">Center Code<span style={{color:'#dc3545'}}>*</span></label>
    <input type="text"  placeholder="Center Code" style={{
paddingBlock: '1px',
paddingInline: '2px',
display: 'block',
width: '100%',
height: '34px',
padding: '6px 12px',
fontSize: '14px',
lineHeight: '1.42857143',
color: '#555',
backgroundColor: '#fff',
backgroundImage: 'none',
border: '1px solid #ccc',
boxShadow: 'none',
borderRadius:'0',
boxShadow:'none',
borderColor:'b94a48',
cursor:'text',
textTransform:'none',
textIndent:'0px',
textShadow:'none',
    }}></input>
  </div>

    <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
 <label className="label">Email<span style={{color:'#dc3545'}}>*</span></label>
    <input type="text"  placeholder="Email" style={{
paddingBlock: '1px',
paddingInline: '2px',
display: 'block',
width: '100%',
height: '34px',
padding: '6px 12px',
fontSize: '14px',
lineHeight: '1.42857143',
color: '#555',
backgroundColor: '#fff',
backgroundImage: 'none',
border: '1px solid #ccc',
boxShadow: 'none',
borderRadius:'0',
boxShadow:'none',
borderColor:'b94a48',
cursor:'text',
textTransform:'none',
textIndent:'0px',
textShadow:'none',
    }}></input>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <label className="label">Mobile</label>
    <input type="text" value="Mobile" placeholder="Mobile" style={{
paddingBlock: '1px',
paddingInline: '2px',
display: 'block',
width: '100%',
height: '34px',
padding: '6px 12px',
fontSize: '14px',
lineHeight: '1.42857143',
color: '#555',
backgroundColor: '#fff',
backgroundImage: 'none',
border: '1px solid #ccc',
boxShadow: 'none',
borderRadius:'0',
boxShadow:'none',
borderColor:'b94a48',
cursor:'text',
textTransform:'none',
textIndent:'0px',
textShadow:'none',
    }}></input>
     </div>
  </div>
  {/* 3rd row.. */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
 <div style={{ display: 'flex', flexDirection: 'column', flex: '1' ,gap:'2px'}}>
        <label className="label">Status <span style={{color:'#dc3545'}}>*</span></label>
        <select
        style={{
color: '#444',
lineHeight: '28px',
width:'100%',
display: 'block',
paddingLeft: '8px',
paddingRight: '20px',
overflow: 'hidden',
textOverflow: 'ellipsis',
whiteSpace: 'nowrap',
boxSizing:'borderox',
height: 'auto',
margintop: '-4px',
fontWeight: '400',
boxSizing:'border-box',
height:'34px',
        }}
        >
            <option value="">SELECT</option>
            <option value="Enable">Enable </option>
            <option value="Disable">Disable</option>
        </select>
        </div>
<div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
 <label className="label">Address Line 1<span style={{color:'#dc3545'}}>*</span></label>
    <input type="text"  placeholder="Address Line 1" style={{
paddingBlock: '1px',
paddingInline: '2px',
display: 'block',
width: '100%',
height: '34px',
padding: '6px 12px',
fontSize: '14px',
lineHeight: '1.42857143',
color: '#555',
backgroundColor: '#fff',
backgroundImage: 'none',
border: '1px solid #ccc',
boxShadow: 'none',
borderRadius:'0',
boxShadow:'none',
borderColor:'b94a48',
cursor:'text',
textTransform:'none',
textIndent:'0px',
textShadow:'none',
    }}></input>
  </div>

 <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
 <label className="label">Address Line 2</label>
    <input type="text"  placeholder="Address Line 2" style={{
paddingBlock: '1px',
paddingInline: '2px',
display: 'block',
width: '100%',
height: '34px',
padding: '6px 12px',
fontSize: '14px',
lineHeight: '1.42857143',
color: '#555',
backgroundColor: '#fff',
backgroundImage: 'none',
border: '1px solid #ccc',
boxShadow: 'none',
borderRadius:'0',
boxShadow:'none',
borderColor:'b94a48',
cursor:'text',
textTransform:'none',
textIndent:'0px',
textShadow:'none',
    }}></input>
  </div>
        </div>

{/* 4th row..  */}
 <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
  <label className="label">City</label>
    <input type="text" placeholder="New Mumbai" style={{ padding: '6px', border: '1px solid #ccc' }} />
  </div>
 <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
    <label className="label">State</label>
    <select style={{
display: 'block',
paddingLeft: '8px',
paddingRight: '20px',
overflow: 'hidden',
textOverflow: 'ellipsis',
whiteSpace: 'nowrap',
color: '#444',
lineHeight: '28px',
width: '100%',
height: '34px',
    }}>
        <option value="Select">Select</option>
        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
        <option value="Andhra Pradesh">Andhra Pradesh</option>
        <option value="Andhra Pradesh (New)">Andhra Pradesh(New)</option>
        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
        <option value="Assam">Assam</option>
        <option value="Bihar">Bihar</option>
        <option value="Chandigarh">Chandigarh</option>
        <option value="Chattisgarh">Chattisgarh</option>
        <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
    </select>
   </div>
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1' ,gap:'2px'}}>
        <label className="label">Stock Verified</label>
        <select
        style={{
color: '#444',
lineHeight: '28px',
width:'100%',
display: 'block',
paddingLeft: '8px',
paddingRight: '20px',
overflow: 'hidden',
textOverflow: 'ellipsis',
whiteSpace: 'nowrap',
boxSizing:'borderox',
height: 'auto',
fontWeight: '400',
boxSizing:'border-box',
height:'34px',
        }}
        >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
        </div>
  </div>
  {/* 5th row... */}
 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
             <label className="label">Partner Name<span style={{color:'#dc3545'}}>*</span></label>
        <select
style={{
color: '#444',
lineHeight: '28px',
// width:'100%',
maxWidth:'66%',
display: 'block',
paddingLeft: '8px',
paddingRight: '20px',
overflow: 'hidden',
textOverflow: 'ellipsis',
whiteSpace: 'nowrap',
boxSizing:'borderox',
height: 'auto',
fontWeight: '400',
boxSizing:'border-box',
height:'34px',
        }}
        >
            <option value="SIDDHI BROADBAND ">SIDDHI BROADBAND </option>
            <option value="SSV TELECOM PVT LTD">SSV TELECOM PVT LTD</option>
            <option value="TRU ALPHA">TRU ALPHA</option>
            <option value="TRU CONNECT">TRU CONNECT</option>
            <option value="TRU FUTURE">TRU FUTURE</option>
            <option value="TRU N SSV">TRU N SSV</option>
            <option value="TRU SSV JASS">TRU SSV JASS</option>
            <option value="TRU SSV N SV INTERNET">TRU SSV N SV INTERNET</option>
        </select>
        </div>

   <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
             <label className="label">Area Name<span style={{color:'#dc3545'}}>*</span></label>
        <select
        style={{
color: '#444',
lineHeight: '28px',
// width:'100%',
maxWidth:'66%',
display: 'block',
paddingLeft: '8px',
paddingRight: '20px',
overflow: 'hidden',
textOverflow: 'ellipsis',
whiteSpace: 'nowrap',
boxSizing:'border-box',
height: 'auto',
fontWeight: '400',
boxSizing:'border-box',
height:'34px',
        }}
        >
            <option value="Yes">Select Area</option>
        </select>
        </div>

        </div>
       <div
          style={{display: 'flex',justifyContent: 'flex-end',gap: '6px',marginBottom: '10px',marginTop:'10px'
          }}
        >
            <button style={{backgroundColor: '#dd4b39',
    borderColor: '#d73925',
}}  className="submit_Next">Reset</button>
            <button className="submit_Next">Submit</button>
        </div>
          </form>
          </div>
          </>
         )}
        </>
    )
}
export default CenterSetting;