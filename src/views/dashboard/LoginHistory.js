// import React from "react";
// const LoginHistory = () => {
//   return (
//     <div className="mt-4 pb-10 px-6 transition-all duration-300">
//       <div className="bg-white py-1 rounded shadow border-t-3 border-[#2759A2]">
//         <h2 className="font-light text-xl mb-2 px-3 text-[#444444]">Login History</h2>
//         <div className="relative overflow-y-auto max-h-[260px] scrollbar-hide">
//           <table className="w-full text-sm table-fixed">
//             <thead>
//               <tr className="shadow text-[#444444]">
//                 <th className="text-left p-2 px-3 w-[18%]">Name</th>
//                 <th className="text-left p-2 px-3 w-[18%]">Email</th>
//                 <th className="text-left p-2 px-3 w-[20%]">Browser</th>
//                 <th className="text-left p-2 px-3 w-[20%]">IP</th>
//                 <th className="text-left p-2 px-3 w-[18%]">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.135.62', '25 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '25 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
//                 ['NOC Team', 'noc@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '23 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.135.62', '25 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '25 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
//                 ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
//                 ['NOC Team', 'noc@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '23 June, 2025'],
//               ].map(([name, email, browser, ip, date], idx) => (
//                 <tr key={idx} className="hover:bg-gray-100 shadow-xs text-[#444444]">
//                   <td className="p-1 px-3 truncate">{name}</td>
//                   <td className="p-1 px-3 truncate">{email}</td>
//                   <td className="p-1 px-3 truncate">{browser}</td>
//                   <td className="p-1 px-3 truncate">{ip}</td>
//                   <td className="p-1 px-3 truncate">{date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginHistory;

import React from "react";

const LoginHistory = () => {
  return (
    <div
      style={{
        marginTop: "1rem",
        paddingBottom: "2.5rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          borderRadius: "0.25rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          borderTop: "3px solid #2759A2",
        }}
      >
        <h2
          style={{
            fontWeight: "300",
            fontSize: "1.25rem",
            marginBottom: "0.5rem",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            color: "#444444",
          }}
        >
          Login History
        </h2>
        <div
          style={{
            position: "relative",
            overflowY: "auto",
            maxHeight: "260px",
          }}
        >
          <table
            style={{
              width: "100%",
              fontSize: "0.875rem",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  color: "#444444",
                }}
              >
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", width: "18%" }}>Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", width: "18%" }}>Email</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", width: "20%" }}>Browser</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", width: "20%" }}>IP</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", width: "18%" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.135.62', '25 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '25 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
                ['NOC Team', 'noc@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '23 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '26 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.135.62', '25 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '223.233.83.80', '25 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
                ['VASHI HO', 'Infocus.VashiHO@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '24 June, 2025'],
                ['NOC Team', 'noc@trunet.co.in', 'Chrome 137.0.0.0', '103.175.190.58', '23 June, 2025'],
              ].map(([name, email, browser, ip, date], idx) => (
                <tr
                  key={idx}
                  style={{
                    color: "#444444",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f7f7f7")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</td>
                  <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</td>
                  <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{browser}</td>
                  <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ip}</td>
                  <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;
