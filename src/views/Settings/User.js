import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faCog, faSearch} from "@fortawesome/free-solid-svg-icons";
import '../../components/Styling.css'; 

function User()
{
const initialData = [
    {name:'Amit',role:'center',center:'AIROLI',email:'',mobile:''},
    {name:'Jay',role:'center',center:'AIROLI',email:'',mobile:''},
         ];

        //  for 2nd form...
        const [showForm, setShowForm] = useState(false);
       
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
         {/* <h1 className='headingF'>User List</h1>  */}
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
                                  <button  className='buttonsASE'>
                                  <FontAwesomeIcon icon={faSearch} className='iconsASE'/>Search
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
  <th style={thStyle}>Name {renderSortControls('name')}</th>
  <th style={thStyle}>Role {renderSortControls('role')}</th>
  <th style={thStyle}>Center {renderSortControls('center')}</th>
  <th style={thStyle}>Email {renderSortControls('email')}</th>
  <th style={thStyle}>Mobile {renderSortControls('mobile')}</th>
  <th style={thStyle}>Action</th>
</tr>
</thead>
<tbody>
  {data.map((item, index) => (
    <tr key={index}>
      <td style={tdStyle}>{item.name}</td>
      <td style={tdStyle}>{item.role}</td>
      <td style={tdStyle}>{item.center}</td>
      <td style={tdStyle}>{item.email}</td>
      <td style={tdStyle}>{item.mobile}</td>
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

            // 2nd form...
            <>
             <h1 style={{ marginBottom: "20px",fontSize:'24px',margin:'0',fontFamily:'sans-serif' ,fontWeight:'500',display:'block',boxSizing:'border-box'}}>Add User</h1>
         <div
        style={{
          borderTop: "3px solid #2759A2",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white"
        }}
      > 
       <form
          style={{
            display: 'flex',gap: '20px',flexDirection: 'column'
          }}
        >
          <h4 style={{display: 'inline-block',
    fontSize: '18px',
    margin: '0',
    lineHeight: '1',
    color:'#444'}}>User</h4>
    <hr style={{ margin: '15px 0 10px', opacity: '0.1', flexBasis: '100%' }} />
         
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* 1st ROW..  */}
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <label className="label" >Role <span style={{color:'#dc3545'}}>*</span></label>
    {/* <input type="text" value="username" placeholder="Username"  */}
    <select  style={{
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
                  textShadow:'none',}}>
                    <option value="">SELECT</option>
                     <option value="1">Admin</option>
                     <option value="2">Manager</option>
                     <option value="3">Outlet</option>
                     <option value="4">Center</option>
                     <option value="5">Center Observer</option>
                  </select>
    </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
     <label className="label" >
          Center<span style={{color:'#dc3545'}}>*</span></label>
        <select
        style={{
              color: '#444',
              lineHeight: '28px',
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
            <option value="center1">Center 1</option>
            <option value="center2">Center 2</option>
            <option value="center3">Center 3</option>
        </select>
  </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <label className="label">Full Name<span style={{color:'#dc3545'}}>*</span></label>
    <input type="text" value="Center Name" placeholder="Center Name" style={{
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
      {/* 2nd row..  */}
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
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
        <label className="label">Mobile<span style={{color:'#dc3545'}}>*</span> </label>
    <input type="text" value="Mobile" placeholder="10 Digit Mobile No." style={{
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
  </div>
  {/* 3rd row..  */}
  <h4 style={{display: 'inline-block',
    fontSize: '18px',
    margin: '0',
    lineHeight: '1',
    color:'#444'}}>Password</h4>
   <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
  <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
    <label className="label">Password<span style={{color:'#dc3545'}}>*</span></label>
    <input type="password"  placeholder="Password" style={{
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
    <label className="label">Confirm Password<span style={{color:'#dc3545'}}>*</span></label>
    <input type="password"  placeholder=" Confirm Password" style={{
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
   <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginBottom: "10px" }}>
    <button className="submit_Next">Reset</button>
    <button  className="submit_Next" style={{backgroundColor: '#dd4b39',
    borderColor:'#d73925'}}>Submit</button>
  </div>
       </form>
      </div>
            </>
          )}
        </>
    )
}
export default User;