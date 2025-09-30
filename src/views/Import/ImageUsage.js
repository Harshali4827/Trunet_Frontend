
import React from "react";
import '../../components/Styling.css';

function ImageUsage() {
  return (
    <>
      {/* <h1 className='headingF'>Image Usage</h1> */}
      <div className="top_border">
        <form style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              width: '100%',
              padding: '10px 0'
            }}
          >
           <hr style={{ margin: '15px 0 10px', opacity: '0.1', flexBasis: '100%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' ,marginLeft:'20px'}}>
              <div>
                <label className="label">Csv File</label>
                <br />
               <div style={{
    border: '1px solid #ccc',
    borderRadius: '3px',
    // padding: '1px',
      padding: '2px 4px',
    display: 'inline-block',
    width: 'fit-content',

  }}>
    <input
      type="file"
      style={{
        border: 'none',
        // padding: '5px',
         padding: '2px',
        height: '24px',
      }}
    />
  </div>
  <p style={{ marginTop: '5px' }}>Upload Csv File</p>
</div>

              {/* CSV Sample Download Block */}
              <div>
                <label className="label">Csv Sample</label>
                <br />
                <button type="button" className="submit_Next" style={{ marginTop: '5px' }}>
                  Download Sample
                </button>
              </div>
            </div>
              <hr style={{ margin: '15px 0 10px', opacity: '0.1', flexBasis: '100%' }} />
            <div style={{display: 'flex',justifyContent: 'flex-end',width: '100%',marginRight: '10px',}}>
  <button type="submit" className="submit_Next">Upload</button>
</div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ImageUsage;
