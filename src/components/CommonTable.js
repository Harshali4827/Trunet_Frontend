function CommonTable()
{
    return(
        <>
         <h5>Closing Stock Logs</h5>
                <div style={{borderTop:'3px solid #2759A2',padding:'10px',display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center',backgroundColor:'white',shadow:'rounded'}}>            
                    <form style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            {/* buttons  */}
                        <div style={{ display:'flex',flexWrap:'wrap',gap:'10px'}}>
                        <button style={{backgroundColor:'#2759A2', color:'white',border:'none',padding:'4px 8px',cursor:'pointer',borderRadius:'4px'}}><FontAwesomeIcon icon={faPlus} style={{ marginRight:'6px'}} size="lg"/>Add</button>
                        <button style={{backgroundColor:'#2759A2', color:'white',border:'none',padding:'4px 8px',cursor:'pointer',borderRadius:'4px'}}><FontAwesomeIcon icon={faSearch} style={{ marginRight:'6px'}}  size="lg"/>Export</button>
                        <button style={{backgroundColor:'#2759A2', color:'white',border:'none',padding:'4px 8px',cursor:'pointer',borderRadius:'4px'}}><FontAwesomeIcon icon={faFileExcel} style={{ marginRight:'6px'}}/>Search</button>
                        </div>

                        <hr style={{margin:'15px 0 10px',opacity:'0.1',flexBasis:'100%'}}></hr>
            {/* Search Buttonns  */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',marginRight:'20px' }}>
            <label>Search:</label>
            <input type="search" placeholder="" style={{padding: '2px 3px',width:'180px',height:'27px',borderLeft: "2px solid #212121",borderTop: "2px solid #212121",borderRight: "2px solid #767676",borderBottom: "2px solid #767676",}}/>
            </div>
            
                  </form>
               </div>
        </>

    )
}
export default CommonTable;