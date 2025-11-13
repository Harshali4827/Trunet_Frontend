// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts.js';
// pdfMake.vfs = pdfFonts.vfs;


// const formatCurrency = (num) => `₹ ${num.toFixed(2)}`;

// const numberToWords = (num) => {
//   const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
//   return formatter.format(num);
// };

// export const generateInvoice = (reseller, centers, challans) => {
//     const company = {
//       name: 'SSV Telecom Private Limited FY 22-23',
//       address: 'A-1, Landmark CHS, Sector 14, Vashi , Navi Mumbai',
//       gstin: '27ABECS3422Q1ZX',
//     };
  
//     const buyer = reseller?.businessName || 'SSV Alpha Broadband LLP';
//     const buyerAddr =
//       reseller?.address1 || 'A/3, Landmark Soc, Sector-14 , Vashi, Navi Mumbai';
//     const buyerGST = reseller?.gstNumber || '27AEGFS1650E1Z6';
  
//     const invoiceNo =
//       'STEL/' + new Date().getFullYear().toString().slice(-2) + '/001';
//     const invoiceDate = new Date().toLocaleDateString('en-GB');
  
//     const allProducts = challans?.length
//       ? challans.flatMap(c =>
//           c.products.map(p => ({
//             name: p.product?.productTitle || 'Item Name',
//             qty: p.approvedQuantity || 0,
//             rate: p.product?.rate || 0,
//             hsn: p.product?.productCode || '00000000',
//             amount: (p.approvedQuantity || 0) * (p.product?.rate || 0),
//           }))
//         )
//       : [
//           { name: 'Fiber Cable 12F', qty: 10, rate: 784.3, hsn: '90011000', amount: 7843 },
//           { name: 'Power Adapter 12V', qty: 8, rate: 51.36, hsn: '85044090', amount: 410.88 },
//         ];
  
//     const subtotal = allProducts.reduce((a, b) => a + b.amount, 0);
//     const cgst = subtotal * 0.09;
//     const sgst = subtotal * 0.09;
//     const total = subtotal + cgst + sgst;
  
//     const itemsTable = [
//       [
//         { text: 'Sl No.', style: 'tableHeader' },
//         { text: 'Description of Goods', style: 'tableHeader' },
//         { text: 'Quantity', style: 'tableHeader' },
//         { text: 'Rate', style: 'tableHeader' },
//         { text: 'Amount', style: 'tableHeader' },
//         { text: 'HSN/SAC', style: 'tableHeader' },
//       ],
//       ...allProducts.map((p, i) => [
//         i + 1,
//         p.name,
//         p.qty,
//         p.rate.toFixed(2),
//         p.amount.toFixed(2),
//         p.hsn,
//       ]),
//     ];
  
//     const docDefinition = {
//       pageMargins: [30, 30, 30, 40],
//       footer: (currentPage, pageCount) => ({
//         columns: [
//           { text: 'This is a Computer Generated Invoice', alignment: 'left', fontSize: 8 },
//           { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', fontSize: 8 },
//         ],
//         margin: [30, 0],
//       }),
//       content: [
//         { text: 'Tax Invoice', style: 'title', alignment: 'center' },
  
//         {
//           columns: [
//             {
//               width: '40%',
//               stack: [
//                 { text: company.name, bold: true },
//                 { text: company.address },
//                 { text: `GSTIN/UIN: ${company.gstin}` },
//               ],
//             },
//             {
//               width: '30%',
//               stack: [
//                 { text: `Invoice No.: ${invoiceNo}`, alignment: 'right' },
//                 { text: `Delivery Note: ${invoiceDate}`, alignment: 'right' },
//               ],
//             },
//             {
//                 width: '30%',
//                 stack: [
//                   { text: `Dated.: ${invoiceNo}`, alignment: 'right' },
//                   { text: `Mode/Terms of Payment: ${invoiceDate}`, alignment: 'right' },
//                 ],
//               },
//           ],
//         },
  
//         { text: '\n' },
  
//         {
//           columns: [
//             {
//               width: '40%',
//               stack: [
//                 { text: 'Consignee (Ship To)', style: 'subheader' },
//                 { text: buyer, bold: true },
//                 { text: centers?.map(c => c.centerName).join(', ') || 'All Alpha Area.' },
//                 { text: `GSTIN/UIN: ${buyerGST}` },
//                 { text: 'State Name: Maharashtra, Code: 27' },
//               ],
//             },
//             {
//                 width: '30%',
//                 stack: [
//                   { text: `Reference No. & Date: ${invoiceNo}`, alignment: 'right' },
//                   { text: `Buyer’s Order No.: ${invoiceDate}`, alignment: 'right' },
//                 ],
//               },
//               {
//                 width: '30%',
//                 stack: [
//                   { text: `Other References: ${invoiceNo}`, alignment: 'right' },
//                   { text: `Dated: ${invoiceDate}`, alignment: 'right' },
//                 ],
//               },
//           ],
//         },
//         { text: '\n' },
//         {
//             columns: [
//               {
//                 width: '40%',
//                 stack: [
//                   { text: 'Buyer (Bill To)', style: 'subheader' },
//                   { text: buyer, bold: true },
//                   { text: buyerAddr },
//                   { text: `GSTIN/UIN: ${buyerGST}` },
//                   { text: 'State Name: Maharashtra, Code: 27' },
//                 ],
//               },
//               {
//                 width: '30%',
//                 stack: [
//                   { text: `Dispatch Doc No: ${invoiceNo}`, alignment: 'right' },
//                   { text: `Dispatched through: ${invoiceDate}`, alignment: 'right' },
//                 ],
//               },
//               {
//                 width: '30%',
//                 stack: [
//                   { text: `Delivery Note Date: ${invoiceNo}`, alignment: 'right' },
//                   { text: `Destination ${invoiceDate}`, alignment: 'right' },
//                 ],
//               },
//             ],
//           },
  
//         { text: '\n' },
//         {
//           table: {
//             headerRows: 1,
//             widths: [20, '*', 50, 50, 60, 60],
//             body: itemsTable,
//           },
//           layout: 'lightHorizontalLines',
//         },
  
//         { text: '\n' },
//         {
//           columns: [
//             { width: '*', text: '' },
//             {
//               width: 'auto',
//               stack: [
//                 { text: `Subtotal: ₹${subtotal.toFixed(2)}` },
//                 { text: `CGST (9%): ₹${cgst.toFixed(2)}` },
//                 { text: `SGST (9%): ₹${sgst.toFixed(2)}` },
//                 { text: `Total: ₹${total.toFixed(2)}`, bold: true },
//               ],
//             },
//           ],
//         },
  
//         { text: '\nAmount Chargeable (in words):', bold: true },
//         { text: 'INR ' + total.toFixed(0) + ' Only' },
  
//         { text: '\nDeclaration', bold: true },
//         {
//           text: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
//         },
  
//         { text: '\nFor SSV Telecom Private Limited FY 22-23', alignment: 'right' },
//         { text: 'Authorised Signatory', alignment: 'right' },
//       ],
//       styles: {
//         title: { fontSize: 16, bold: true, margin: [0, 0, 0, 8] },
//         subheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 3] },
//         tableHeader: { bold: true, fillColor: '#f2f2f2' },
//       },
//     };
  
//     pdfMake.createPdf(docDefinition).download(`${buyer}_Invoice.pdf`);
//   };
  

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.vfs;

const formatCurrency = (num) => `₹ ${num.toFixed(2)}`;

export const generateInvoice = (reseller, centers, challans) => {
  const company = {
    name: 'SSV Telecom Private Limited FY 22-23',
    address: 'A-1, Landmark CHS, Sector 14, Vashi , Navi Mumbai',
    gstin: '27ABECS3422Q1ZX',
  };

  const buyer = reseller?.businessName || 'SSV Alpha Broadband LLP';
  const buyerAddr = reseller?.address1 || 'A/3, Landmark Soc, Sector-14 , Vashi, Navi Mumbai';
  const buyerGST = reseller?.gstNumber || '27AEGFS1650E1Z6';

  const invoiceNo = 'STEL/' + new Date().getFullYear().toString().slice(-2) + '/001';
  const invoiceDate = new Date().toLocaleDateString('en-GB');

  const allProducts = challans?.length
    ? challans.flatMap(c =>
        c.products.map(p => ({
          name: p.product?.productTitle || 'Item Name',
          qty: p.approvedQuantity || 0,
          rate: p.product?.rate || 0,
          hsn: p.product?.productCode || '00000000',
          amount: (p.approvedQuantity || 0) * (p.product?.rate || 0),
        })),
      )
    : [
        { name: 'Fiber Cable 12F', qty: 10, rate: 784.3, hsn: '90011000', amount: 7843 },
        { name: 'Power Adapter 12V', qty: 8, rate: 51.36, hsn: '85044090', amount: 410.88 },
      ];

  const subtotal = allProducts.reduce((a, b) => a + b.amount, 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  // Border layout for main header block
  const headerBlock = {
    table: {
      widths: ['40%', '30%', '30%'],
      body: [
        [
          {
            stack: [
              { text: company.name, bold: true, fontSize: 11 },
              { text: company.address, fontSize: 9 },
              { text: `GSTIN/UIN: ${company.gstin}`, fontSize: 9 },
            ],
          },
          {
            stack: [
              { text: `Invoice No.: ${invoiceNo}`, fontSize: 9 },
              { text: `Delivery Note: ${invoiceDate}`, fontSize: 9 },
              { text: `Mode/Terms of Payment: ${invoiceDate}`, fontSize: 9 },
            ],
          },
          {
            stack: [
              { text: `Dated: ${invoiceDate}`, fontSize: 9 },
              { text: `Buyer’s Order No.: ${invoiceNo}`, fontSize: 9 },
              { text: `Other References: -`, fontSize: 9 },
            ],
          },
        ],
        [
          {
            stack: [
              { text: 'Consignee (Ship To)', bold: true, margin: [0, 3, 0, 2] },
              { text: buyer, bold: true, fontSize: 10 },
              { text: centers?.map(c => c.centerName).join(', ') || 'All Alpha Area.', fontSize: 9 },
              { text: `GSTIN/UIN: ${buyerGST}`, fontSize: 9 },
              { text: 'State Name: Maharashtra, Code: 27', fontSize: 9 },
            ],
          },
          {
            stack: [
              { text: `Reference No. & Date: ${invoiceNo}`, fontSize: 9 },
              { text: `Dispatch Doc No: ${invoiceNo}`, fontSize: 9 },
              { text: `Delivery Note Date: ${invoiceDate}`, fontSize: 9 },
            ],
          },
          {
            stack: [
              { text: `Dispatched through: ${invoiceDate}`, fontSize: 9 },
              { text: `Destination: All Alpha Area.`, fontSize: 9 },
            ],
          },
        ],
        [
          {
            stack: [
              { text: 'Buyer (Bill To)', bold: true, margin: [0, 3, 0, 2] },
              { text: buyer, bold: true, fontSize: 10 },
              { text: buyerAddr, fontSize: 9 },
              { text: `GSTIN/UIN: ${buyerGST}`, fontSize: 9 },
              { text: 'State Name: Maharashtra, Code: 27', fontSize: 9 },
            ],
          },
          { text: '', fontSize: 9 },
          { text: '', fontSize: 9 },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0.7,
      vLineWidth: () => 0.7,
    },
  };

  // Item Table with borders
  const itemsTable = {
    table: {
      headerRows: 1,
      widths: [25, '*', 60, 60, 60, 70],
      body: [
        [
          { text: 'Sl No.', style: 'tableHeader' },
          { text: 'Description of Goods', style: 'tableHeader' },
          { text: 'HSN/SAC', style: 'tableHeader' },
          { text: 'Quantity', style: 'tableHeader' },
          { text: 'Rate', style: 'tableHeader' },
          { text: 'Amount', style: 'tableHeader' },
        ],
        ...allProducts.map((p, i) => [
          { text: i + 1, alignment: 'center', fontSize: 9 },
          { text: p.name, fontSize: 9 },
          { text: p.hsn, alignment: 'center', fontSize: 9 },
          { text: p.qty, alignment: 'center', fontSize: 9 },
          { text: formatCurrency(p.rate), alignment: 'right', fontSize: 9 },
          { text: formatCurrency(p.amount), alignment: 'right', fontSize: 9 },
        ]),
      ],
    },
    layout: {
      hLineWidth: () => 0.7,
      vLineWidth: () => 0.7,
    },
  };

  // Totals + Declaration Block
  const totalsBlock = {
    table: {
      widths: ['70%', '30%'],
      body: [
        [
          {
            stack: [
              { text: 'Amount Chargeable (in words):', bold: true, margin: [0, 0, 0, 2] },
              { text: `INR ${total.toFixed(2)} Only`, fontSize: 9 },
              { text: '\nDeclaration', bold: true },
              {
                text: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
                fontSize: 9,
              },
            ],
          },
          {
            stack: [
              { text: `Subtotal: ${formatCurrency(subtotal)}`, alignment: 'right', fontSize: 9 },
              { text: `CGST (9%): ${formatCurrency(cgst)}`, alignment: 'right', fontSize: 9 },
              { text: `SGST (9%): ${formatCurrency(sgst)}`, alignment: 'right', fontSize: 9 },
              { text: `Total: ${formatCurrency(total)}`, bold: true, alignment: 'right', fontSize: 10 },
              { text: '\nFor SSV Telecom Private Limited FY 22-23', alignment: 'right', fontSize: 9 },
              { text: 'Authorised Signatory', alignment: 'right', fontSize: 9 },
            ],
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0.7,
      vLineWidth: () => 0.7,
    },
  };

  // Build PDF definition
  const docDefinition = {
    pageMargins: [20, 20, 20, 30],
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: 'This is a Computer Generated Invoice', alignment: 'left', fontSize: 8 },
        { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', fontSize: 8 },
      ],
      margin: [30, 0],
    }),
    content: [
      { text: 'TAX INVOICE', style: 'title', alignment: 'center', margin: [0, 0, 0, 5] },
      headerBlock,
      { text: '\n' },
      itemsTable,
      { text: '\n' },
      totalsBlock,
    ],
    styles: {
      title: { fontSize: 14, bold: true },
      tableHeader: { bold: true, fillColor: '#f2f2f2', alignment: 'center', fontSize: 10 },
    },
  };

  pdfMake.createPdf(docDefinition).download(`${buyer}_Invoice.pdf`);
};
