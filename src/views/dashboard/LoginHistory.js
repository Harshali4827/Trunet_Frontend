import React, { useState, useEffect } from "react";
import axiosInstance from "src/axiosInstance";

const LoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const fetchLoginHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/auth/login-history");

      if (response.data.success) {
        setLoginHistory(response.data.data.loginHistory);
      }
    } catch (err) {
      console.error("Error fetching login history:", err);
      setError("Failed to load login history");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLoginHistory();
  }, []);

  if (loading) {
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
            padding: "2rem",
            borderRadius: "0.25rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            borderTop: "3px solid #2759A2",
            textAlign: "center",
          }}
        >
          Loading login history...
        </div>
      </div>
    );
  }

  if (error) {
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
            padding: "2rem",
            borderRadius: "0.25rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            borderTop: "3px solid #2759A2",
            textAlign: "center",
            color: "#e74c3c",
          }}
        >
          {error}
          <button
            onClick={fetchLoginHistory}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#2759A2",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            maxHeight: "400px",
          }}
        >
          {loginHistory.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#666",
                fontSize: "0.875rem",
              }}
            >
              No login history found
            </div>
          ) : (
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
                {loginHistory.map((record, idx) => (
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
                    <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {record.user?.fullName}
                    </td>
                    <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {record.user?.email}
                    </td>
                    <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {record.browser}
                    </td>
                    <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {record.ip}
                    </td>
                    <td style={{ padding: "0.25rem 0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {formatDate(record.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;