// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip
// } from 'chart.js';

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// const CenterUsage = () => {
//   const data = {
//     labels: [
//       'Fiber 6F', 'Fiber 4F', 'Fiber 12F', 'Small Sleeve',
//       'Planesheets', 'Fiber 24F', 'Fiber 48F', 'Blue Jointer', 'Visiting Card', 'Cable Tie 300 mm(pkt)'
//     ],
//     datasets: [
//       {
//         data: [105402, 63824, 61906, 68000, 57118, 9000, 8320, 4850, 4849, 3600],
//         backgroundColor: '#61BEAB',
//         borderWidth: 0,
//         barThickness: 107
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     layout: {
//       padding: {
//         bottom: 30
//       }
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         callbacks: {
//           label: (context) =>
//             `${context.label}: ${context.parsed.y.toLocaleString()}`
//         }
//       }
//     },
//     scales: {
//       x: {
//         ticks: {
//           maxRotation: 40,
//           minRotation: 30,
//           align: 'end',
//           color: '#333',
//           padding: 1
//         },
//         grid: { display: false }
//       },
//       y: {
//         beginAtZero: true,
//         min: 0,
//         max: 200000,
//         ticks: {
//           stepSize: 12500,
//           color: '#333',
//           autoSkip: false,
//           maxTicksLimit: 17,
//           callback: (value) =>
//             value % 12500 === 0 ? value.toLocaleString() : ''
//         },
//         grid: { display: false }
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded shadow border-t-3 border-[#2759A2] pb-6 px-2 mt-6 mx-6" style={{ height: '720px' }}>
//       {/* Header row with dropdown */}
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-xl font-light text-[#444444] m-0">Center Usage</h2>
//         <select className="border border-gray-300 mt-2 px-3 py-2 text-sm text-gray-700">
//           <option>30 Days</option>
//           <option>60 Days</option>
//           <option>90 Days</option>
//           <option>1 Year</option>
//         </select>
//       </div>
//       <Bar data={data} options={options} className='mt-13 px-5' />
//     </div>
//   );
// };

// export default CenterUsage;
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const CenterUsage = () => {
  const data = {
    labels: [
      'Fiber 6F', 'Fiber 4F', 'Fiber 12F', 'Small Sleeve',
      'Planesheets', 'Fiber 24F', 'Fiber 48F', 'Blue Jointer', 'Visiting Card', 'Cable Tie 300 mm(pkt)'
    ],
    datasets: [
      {
        data: [105402, 63824, 61906, 68000, 57118, 9000, 8320, 4850, 4849, 3600],
        backgroundColor: '#61BEAB',
        borderWidth: 0,
        barThickness: 107
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 30
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 40,
          minRotation: 30,
          align: 'end',
          color: '#333',
          padding: 1
        },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 200000,
        ticks: {
          stepSize: 12500,
          color: '#333',
          autoSkip: false,
          maxTicksLimit: 17,
          callback: (value) =>
            value % 12500 === 0 ? value.toLocaleString() : ''
        },
        grid: { display: false }
      }
    }
  };

  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderTop: '3px solid #2759A2',
    paddingBottom: '1.5rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    marginTop: '1.5rem',
    marginLeft: '1.5rem',
    marginRight: '1.5rem',
    height: '720px'
  };

  const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '300',
    color: '#444444',
    margin: 0
  };

  const selectStyle = {
    border: '1px solid #d1d5db',
    marginTop: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    color: '#4b5563'
  };

  const chartWrapperStyle = {
    marginTop: '3.25rem',
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
    height: 'calc(100% - 70px)' // to adjust for header height
  };

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <h2 style={titleStyle}>Center Usage</h2>
        <select style={selectStyle}>
          <option>30 Days</option>
          <option>60 Days</option>
          <option>90 Days</option>
          <option>1 Year</option>
        </select>
      </div>
      <div style={chartWrapperStyle}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default CenterUsage;

