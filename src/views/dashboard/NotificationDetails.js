import React from "react";
import { useState } from "react";
import PropTypes from 'prop-types';



const NotificationDetails = ({ notification, onBack }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  NotificationDetails.propTypes = {
  notification: PropTypes.any, // Adjust as needed
  onBack: PropTypes.func.isRequired,
};


  const data = [
    {
      product: "Splicing Box (2 Port)",
      centerStock: "13",
      requestedQty: "5",
      productRemark: "",
      approvedQty: "0",
      approvedRemark: "Out of stock",
      receivedQty: "",
      receivedRemark: "Not received",
    },
    {
      product: "Splicing Box (4 Port)",
      centerStock: "10",
      requestedQty: "3",
      productRemark: "",
      approvedQty: "3",
      approvedRemark: "Approved",
      receivedQty: "",
      receivedRemark: "Pending delivery",
    },
    {
      product: "Fiber Patch Cord (SC-SC)",
      centerStock: "25",
      requestedQty: "10",
      productRemark: "For new installation",
      approvedQty: "8",
      approvedRemark: "Partial approval",
      receivedQty: "8",
      receivedRemark: "Received on 20 Jun",
    },
    {
      product: "Fiber Patch Cord (LC-LC)",
      centerStock: "18",
      requestedQty: "5",
      productRemark: "",
      approvedQty: "5",
      approvedRemark: "Approved",
      receivedQty: "5",
      receivedRemark: "Received on 21 Jun",
    },
    {
      product: "Optical Splitter (1x8)",
      centerStock: "7",
      requestedQty: "2",
      productRemark: "For maintenance",
      approvedQty: "2",
      approvedRemark: "Approved",
      receivedQty: "2",
      receivedRemark: "Received on 22 Jun",
    },
    {
      product: "Optical Splitter (1x16)",
      centerStock: "4",
      requestedQty: "1",
      productRemark: "",
      approvedQty: "0",
      approvedRemark: "Out of stock",
      receivedQty: "",
      receivedRemark: "Not received",
    },
    {
      product: "Fiber Termination Box",
      centerStock: "9",
      requestedQty: "3",
      productRemark: "For customer premises",
      approvedQty: "3",
      approvedRemark: "Approved",
      receivedQty: "3",
      receivedRemark: "Received on 23 Jun",
    },
    {
      product: "Fiber Cable (100m)",
      centerStock: "6",
      requestedQty: "2",
      productRemark: "",
      approvedQty: "1",
      approvedRemark: "Partial approval",
      receivedQty: "1",
      receivedRemark: "Received on 24 Jun",
    },
    {
      product: "Fiber Cable (500m)",
      centerStock: "3",
      requestedQty: "1",
      productRemark: "For backbone",
      approvedQty: "0",
      approvedRemark: "Out of stock",
      receivedQty: "",
      receivedRemark: "Not received",
    },
    {
      product: "Fiber Connector (SC)",
      centerStock: "45",
      requestedQty: "20",
      productRemark: "",
      approvedQty: "20",
      approvedRemark: "Approved",
      receivedQty: "20",
      receivedRemark: "Received on 25 Jun",
    },
    {
      product: "Fiber Connector (LC)",
      centerStock: "38",
      requestedQty: "15",
      productRemark: "For new customers",
      approvedQty: "15",
      approvedRemark: "Approved",
      receivedQty: "15",
      receivedRemark: "Received on 26 Jun",
    },
    {
      product: "Fiber Adapter (SC)",
      centerStock: "22",
      requestedQty: "10",
      productRemark: "",
      approvedQty: "10",
      approvedRemark: "Approved",
      receivedQty: "10",
      receivedRemark: "Received on 27 Jun",
    },
  ];

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split(" ");
    return new Date(`${month} ${day}, ${year}`);
  };

  const compare = (a, b, key) => {
    if (key === "date") {
      const dateA = parseDate(a[key]);
      const dateB = parseDate(b[key]);
      return dateB - dateA; // latest first
    }
    const valA = a[key]?.toLowerCase() || "";
    const valB = b[key]?.toLowerCase() || "";
    return valA.localeCompare(valB, undefined, { numeric: true });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const result = compare(a, b, sortConfig.key);
    return sortConfig.direction === "asc" ? result : -result;
  });

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2.5} 
      stroke="currentColor" 
      className="w-3 h-3 ml-1"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" 
      />
    </svg>
  );

  return (
    <div className="mt-1 pt-3 px-6 space-y-4">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="bg-[#2759A2] text-white px-3 py-1 rounded cursor-pointer"
        >
          Back
        </button>
        <h2 className="font-light text-xl pl-1 text-[#444444]">
          Indent Details
        </h2>
      </div>

      {/* Indent Detail Section */}
      <div className="bg-white rounded shadow border-t-3 border-[#2759A2] py-1 px-2">
        <div className="flex justify-between">
          <div className="flex gap-5">
            <h3 className="text-[#444444] text-xl">
              Indent : VASHO/VASHIHO/0625/4
            </h3>
            <button
              onClick={onBack}
              className="bg-[#2759A2] text-white px-3  rounded cursor-text"
            >
              Confirmed
            </button>
          </div>
          <button
            onClick={onBack}
            className="bg-[#2759A2] text-white px-3 py-1 rounded cursor-pointer"
          >
            Print Indent
          </button>
        </div>

        {/* 6-Column Product Table with equal spacing */}
        <div className="mt-7 mx-4">
          <table
            className="w-full"
            style={{ border: "1px solid #f0f0f0", tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "18.66%" }} />
              <col style={{ width: "17.66%" }} />
              <col style={{ width: "16.66%" }} />
              <col style={{ width: "16.66%" }} />
              <col style={{ width: "16.66%" }} />
              <col style={{ width: "13.66%" }} />
            </colgroup>
            <tbody>
              {[
                {
                  product: "Center/Center Code",
                  centerStock: "VASHO/VASHI HO",
                  requestedQty: "Shipment Date",
                  approvedQty: "Completed on",
                },
                {
                  product: "Indent Date",
                  centerStock: "20 Jun 2025",
                  requestedQty: "Expected Delivery",
                  approvedQty: "Completed by",
                },
                {
                  product: "Remark",
                  centerStock: "Ram sajan ( GTB Office ) for main line",
                  requestedQty: "Shipment Detail",
                  approvedQty: "Incomplete on",
                },
                {
                  product: "Created at",
                  centerStock: "20 Jun 2025 04:25 PM",
                  requestedQty: "Shipment Remark",
                  approvedQty: "Incomplete by",
                },
                {
                  product: "Created by",
                  centerStock: "VASHI HO",
                  requestedQty: "Document",
                  approvedQty: "Incomplete Remark",
                },
                {
                  product: "Approved at",
                  centerStock: "23 Jun 2025 01:22 PM",
                  requestedQty: "Shipment at",
                  approvedQty: "Received at",
                },
                {
                  product: "Approved by",
                  centerStock: "VASHI WAREHOUSE",
                  requestedQty: "Shipped by",
                  approvedQty: "Received by",
                }
              ].map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-3 py-1.5 text-[#333333] text-sm align-top font-bold  border border-[#f0f0f0]">
                    {item.product}
                  </td>
                  <td className="px-3 py-1.5 text-gray-700 text-sm align-top  border border-[#f0f0f0]">
                    {item.centerStock}
                  </td>
                  <td className="px-3 py-1.5 text-gray-700 text-sm align-top border font-bold border-[#f0f0f0]">
                    {item.requestedQty}
                  </td>
                  <td className="px-3 py-1.5 text-gray-700 text-sm align-top border border-[#f0f0f0]">
                   
                  </td>
                  <td className="px-3 py-1.5 text-gray-700 text-sm align-top font-bold  border border-[#f0f0f0]">
                    {item.approvedQty}
                  </td>
                  <td className="px-3 py-1.5 text-gray-700 text-sm align-top  border border-[#f0f0f0]">
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      

      <div className="bg-white rounded-lg shadow border-t-3 border-[#2759A2]">
        <h3 className="text-[#444444] text-xl pl-3 pt-2">
          Product Details
        </h3>

        <div className="mt-3 flex justify-end gap-2 items-center pr-4">
          <div className="flex items-center">
            <h2 className="text-[#333333] text-sm mr-2">Search:</h2>
            <div className="relative">
              <input
                type="text"
                placeholder=""
                className="pl-2 py-0.5 text-sm focus:outline-none"
                style={{
                  borderLeft: "2px solid #212121",
                  borderTop: "2px solid #212121",
                  borderRight: "2px solid #767676",
                  borderBottom: "2px solid #767676"
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ border: "1px solid #f0f0f0" }}>
              <thead className="">
                <tr>
                  {[
                    { key: "product", label: "Product", width: "8%" },
                    { key: "centerStock", label: "Center Stock", width: "12%" },
                    { key: "requestedQty", label: "Requested Qty", width: "14%" },
                    { key: "productRemark", label: "Product Remark", width: "18%" },
                    { key: "approvedQty", label: "Approved Qty", width: "12%" },
                    { key: "approvedRemark", label: "Approved Remark", width: "15%" },
                    { key: "receivedQty", label: "Received Qty", width: "12%" },
                    { key: "receivedRemark", label: "Received Remark", width: "18%" },
                  ].map(({ key, label, width }) => (
                    <th
                      key={key}
                      onClick={() => requestSort(key)}
                      className="text-left px-2 py-2 cursor-pointer hover:bg-gray-50"
                      style={{ 
                        padding: "8px 8px", 
                        color: "#333333",
                        border: "1px solid #f0f0f0",
                        backgroundColor: "white",
                        width: width,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{label}</span>
                        <SortIcon />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td 
                      className="px-2 pt-1 pb-3.5 text-gray-700 text-sm align-top" 
                      style={{ 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.product}
                    </td>
                    <td 
                      className="px-2 py-1 text-[#338ab7] hover:text-[#89BCD9] cursor-pointer text-sm align-top" 
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.centerStock}
                    </td>
                    <td 
                      className="px-2 py-1 text-gray-700 text-sm align-top" 
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.requestedQty}
                    </td>
                    <td 
                      className="px-2 py-1 text-gray-700 text-sm align-top" 
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.productRemark}
                    </td>
                    <td 
                      className="px-2 py-1 text-gray-700 text-sm align-top" 
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.approvedQty}
                    </td>
                    <td 
                      className="px-2 py-1 text-gray-700 text-sm align-top" 
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.approvedRemark}
                    </td>
                    <td
                      className="px-2 py-1 text-gray-700 text-sm align-top"
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.receivedQty}
                    </td>
                    <td
                      className="px-2 py-1 text-gray-700 text-sm align-top"
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "14px", 
                        border: "1px solid #f0f0f0",
                        wordWrap: "break-word"
                      }}
                    >
                      {item.receivedRemark}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;