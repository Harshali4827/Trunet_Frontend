// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
// import { Link } from 'react-router-dom';
// import React from 'react';
// const IndentCard = () => {
//   return (
//     <div className="pt-3 px-6 transition-all duration-300">
//       <h2 className="text-2xl text-[#333333] font-light mb-3">Dashboard</h2>

//       <div className="flex w-74 shadow overflow-hidden bg-white">
//         {/* Left Section - Green background with icon */}
//         <div className="bg-[#00A65A] p-7 flex items-center justify-center">
//           <FontAwesomeIcon icon={faCartShopping} size="2x" className="text-white" />
//         </div>

//         {/* Right Section - White background with text */}
//         <div className="bg-white text-black pl-3  pt-1 flex flex-col">
//           <div className="text-sm text-[#3C8DBC] hover:text-[#72AFDB]"><Link to='/order/index/indent'>TOTAL INDENT</Link></div>
//           <div className="text-lg font-bold text-[#333333]">520/389</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndentCard;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React from 'react';

const IndentCard = () => {
  const containerStyle = {
    paddingTop: '0.75rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    transition: 'all 0.3s ease'
  };

  const headingStyle = {
    fontSize: '1.5rem',
    color: '#333333',
    fontWeight: '300',
    marginBottom: '0.75rem'
  };

  const cardStyle = {
    display: 'flex',
    width: '18.5rem', // ~74 * 0.25rem (1rem = 16px)
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    backgroundColor: 'white'
  };

  const leftSectionStyle = {
    backgroundColor: '#00A65A',
    padding: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const iconStyle = {
    color: 'white'
  };

  const rightSectionStyle = {
    backgroundColor: 'white',
    color: 'black',
    paddingLeft: '0.75rem',
    paddingTop: '0.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const linkStyle = {
    fontSize: '0.875rem',
    color: '#3C8DBC',
    textDecoration: 'none'
  };

  const linkHoverStyle = {
    color: '#72AFDB'
  };

  const countTextStyle = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#333333'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Dashboard</h2>

      <div style={cardStyle}>
        {/* Left Section - Green background with icon */}
        <div style={leftSectionStyle}>
          <FontAwesomeIcon icon={faCartShopping} size="2x" style={iconStyle} />
        </div>

        {/* Right Section - White background with text */}
        <div style={rightSectionStyle}>
          <Link
            to="/order/index/indent"
            style={linkStyle}
            onMouseEnter={e => (e.target.style.color = linkHoverStyle.color)}
            onMouseLeave={e => (e.target.style.color = linkStyle.color)}
          >
            TOTAL INDENT
          </Link>
          <div style={countTextStyle}>520/389</div>
        </div>
      </div>
    </div>
  );
};

export default IndentCard;

