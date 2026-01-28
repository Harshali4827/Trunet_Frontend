export const generateVoucherNumber = async (axiosInstance) => {
    try {
      // Get current financial year
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      let financialYear = '';
      if (currentMonth >= 4) {
        financialYear = `${currentYear.toString().slice(-2)}-${(currentYear + 1).toString().slice(-2)}`;
      } else {
        financialYear = `${(currentYear - 1).toString().slice(-2)}-${currentYear.toString().slice(-2)}`;
      }
      
      // Fetch last voucher number for this financial year
      const response = await axiosInstance.get('/raisePO/latest-voucher', {
        params: {
          financialYear: financialYear
        }
      });
      
      let sequenceNumber = 1;
      
      if (response.data.success && response.data.data?.voucherNo) {
        const lastVoucher = response.data.data.voucherNo;
        // Match pattern: STELE/01/25-26
        const match = lastVoucher.match(/^STELE\/(\d{2})\/\d{2}-\d{2}$/);
        
        if (match && match[1]) {
          sequenceNumber = parseInt(match[1]) + 1;
        }
      }
      
      const paddedSequence = sequenceNumber.toString().padStart(2, '0');
      return `STELE/${paddedSequence}/${financialYear}`;
      
    } catch (error) {
      console.error('Error generating voucher number:', error);
      // Fallback voucher number
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      let financialYear = '';
      if (currentMonth >= 4) {
        financialYear = `${currentYear.toString().slice(-2)}-${(currentYear + 1).toString().slice(-2)}`;
      } else {
        financialYear = `${(currentYear - 1).toString().slice(-2)}-${currentYear.toString().slice(-2)}`;
      }
      
      return `STELE/01/${financialYear}`;
    }
  };