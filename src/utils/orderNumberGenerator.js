// export const generateOrderNumber = async (axiosInstance) => {
//     try {
//       const userCenter = JSON.parse(localStorage.getItem('userCenter'));
//       const centerName = userCenter?.centerName?.replace(/\s+/g, '') || 'DEFAULTCENTER';

//       const now = new Date();
//       const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
      
//       const response = await axiosInstance.get('/stocktransfer/latest-order');
      
//       let serialNumber = 1;
//       if (response.data.success && response.data.data) {
//         const lastOrderNo = response.data.data.orderNumber;
//         const parts = lastOrderNo.split('/');
//         if (parts.length === 4) {
//           const lastSerial = parseInt(parts[3]);
//           if (!isNaN(lastSerial)) {
//             serialNumber = lastSerial + 1;
//           }
//         }
//       }
      
//       return `TF/${centerName.toUpperCase()}/${monthYear}/${serialNumber}`;
      
//     } catch (error) {
//       console.error('Error generating order number:', error);
//       const userCenter = JSON.parse(localStorage.getItem('userCenter'));
//       const centerName = userCenter?.centerName?.replace(/\s+/g, '') || 'DEFAULTCENTER';
//       console.log('CenterName:', centerName);
//       const monthYear = `${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getFullYear()).slice(-2)}`;
      
//       return `TF/${centerName.toUpperCase()}/${monthYear}/1`;
//     }
//   };



export const generateOrderNumber = async (axiosInstance, type = 'stocktransfer') => {
  try {
    const userCenter = JSON.parse(localStorage.getItem('userCenter'));
    const centerName = userCenter?.centerName?.replace(/\s+/g, '') || 'DEFAULTCENTER';

    const now = new Date();
    const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
    
    // Determine API endpoint and prefix based on type
    const config = {
      stocktransfer: {
        apiEndpoint: '/stocktransfer/latest-order',
        prefix: 'TF'
      },
      stockrequest: {
        apiEndpoint: '/stockrequest/recent-order-number', 
        prefix: 'SR'
      }
    };

    const { apiEndpoint, prefix } = config[type] || config.stocktransfer;
    
    const response = await axiosInstance.get(apiEndpoint);
    
    let serialNumber = 1;
    if (response.data.success && response.data.data) {
      const lastOrderNo = response.data.data.orderNumber || response.data.data.transferNumber;
      const parts = lastOrderNo.split('/');
      if (parts.length >= 2) {
        const lastSerial = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSerial)) {
          serialNumber = lastSerial + 1;
        }
      }
    }
    
    return `${prefix}/${centerName.toUpperCase()}/${monthYear}/${serialNumber}`;
    
  } catch (error) {
    console.error('Error generating order number:', error);
    const userCenter = JSON.parse(localStorage.getItem('userCenter'));
    const centerName = userCenter?.centerName?.replace(/\s+/g, '') || 'DEFAULTCENTER';
    const monthYear = `${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getFullYear()).slice(-2)}`;
    
    const prefix = type === 'stockrequest' ? 'SR' : 'TF';
    return `${prefix}/${centerName.toUpperCase()}/${monthYear}/1`;
  }
};