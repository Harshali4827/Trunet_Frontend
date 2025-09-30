import React from "react";
import '../../components/Styling.css'; 
function PopUpForm()
{
    return(
        <>
         <div style={{
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white"
}}>
  <h4 style={{
    fontSize: '18px',
    fontWeight: '500',
    display: 'block',
    marginBlockStart: '1.33em',
    marginBlockEnd: '1.33em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
  }}>
    Product Category Add
  </h4>

<hr style={{ margin: "15px 0 10px", opacity: "0.1" }} />

  <form style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
    {/* Row with both fields */}
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Product Category */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <label className="label">Product Category<span style={{ color: '#dc3545' }}>*</span></label>
        <input
          type="text"
          placeholder="Product Category"
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

      {/* Product Category Remark */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <label className="label">Product Category Remark</label>
        <input
          type="text"
          placeholder="Product category remark"
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
    <hr style={{ margin: "15px 0 10px", opacity: "0.1" }} />

    {/* Submit Button */}
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginBottom: "10px" }}>
      <button className="submit_Next" style={{ backgroundColor: '#dd4b39', borderColor: '#d73925' }}>
        Submit
      </button>
    </div>
  </form>
</div>
        </>
    )
}
export default PopUpForm;