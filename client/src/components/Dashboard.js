import { useEffect, useState } from "react";
import axios from "axios";
import Charts from "./Charts";

const API = "http://localhost:5000/api/dashboard";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(API);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data");
      }
    };
    load();
  }, []);

  // Helper for avatars
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Modern Loading State
  if (!data)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100 py-5">
        <div
          className="spinner-border text-primary text-opacity-50"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted small mt-2">Loading analytics...</p>
      </div>
    );

  const { recentUsers, recentItems, stats } = data;

  return (
    <div className="container py-5 fade-in">
      {/* HEADER */}
      <div className="mb-4">
        <h4 className="fw-bold mb-0 text-dark">
          <i className="bx bxs-dashboard me-2 text-primary"></i>
          Dashboard Overview
        </h4>
        <p className="text-muted small mb-0">
          Real-time statistics and recent activity.
        </p>
      </div>

      {/* 1. TOP STATS ROW */}
      <div className="row g-4 mb-4">
        {/* Card: Lost Items */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bx bx-search fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1 text-uppercase fw-bold ls-1">
                  Lost Items
                </h6>
                <h2 className="mb-0 fw-bold text-dark">{stats.lost}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Found Items */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bx bx-box fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1 text-uppercase fw-bold ls-1">
                  Found Items
                </h6>
                <h2 className="mb-0 fw-bold text-dark">{stats.found}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Returned/Success */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bx bx-check-shield fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1 text-uppercase fw-bold ls-1">
                  Returned
                </h6>
                <h2 className="mb-0 fw-bold text-dark">
                  {stats.returned || 0}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="row g-4">
        {/* LEFT: Recent Users */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom-0">
              <h6 className="m-0 fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bx bx-group text-primary"></i> Recent Users
              </h6>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr className="text-muted text-uppercase small">
                      <th className="ps-4 py-3">User</th>
                      <th className="pe-4 py-3 text-end">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.slice(0, 5).map((u) => (
                      <tr key={u._id} style={{ transition: "all 0.2s" }}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {/* Avatar */}
                            <div
                              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary fw-bold"
                              style={{
                                width: "35px",
                                height: "35px",
                                fontSize: "14px",
                              }}
                            >
                              {getInitials(u.name)}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark fs-6">
                                {u.name}
                              </div>
                              <div
                                className="text-muted small"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="pe-4 py-3 text-end">
                          <span
                            className={`badge rounded-pill px-3 py-2 fw-normal ${
                              u.role === "admin"
                                ? "bg-purple text-purple-dark" // Assuming custom CSS or generic fallback
                                : "bg-secondary bg-opacity-10 text-secondary"
                            }`}
                            style={
                              u.role === "admin"
                                ? {
                                    backgroundColor: "#e0cffc",
                                    color: "#5925dc",
                                  }
                                : {}
                            }
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Recent Items */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom-0">
              <h6 className="m-0 fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bx bx-package text-primary"></i> Recent Reports
              </h6>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr className="text-muted text-uppercase small">
                      <th className="ps-4 py-3">Item Details</th>
                      <th className="pe-4 py-3 text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentItems.slice(0, 5).map((i) => (
                      <tr key={i._id} style={{ transition: "all 0.2s" }}>
                        <td className="ps-4 py-3">
                          <div className="fw-semibold text-dark">{i.title}</div>
                          <div className="text-muted small d-flex align-items-center">
                            <i
                              className="bx bx-user me-1"
                              style={{ fontSize: "0.8rem" }}
                            ></i>
                            {i.userId?.name || "Unknown"}
                          </div>
                        </td>
                        <td className="pe-4 py-3 text-end">
                          {i.returned ? (
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-normal">
                              <i className="bx bx-check me-1"></i> Returned
                            </span>
                          ) : (
                            <span
                              className={`badge rounded-pill px-3 py-2 fw-normal ${
                                i.status === "lost"
                                  ? "bg-danger bg-opacity-10 text-danger"
                                  : "bg-warning bg-opacity-10 text-warning"
                              }`}
                            >
                              <i
                                className={`bx ${
                                  i.status === "lost" ? "bx-search" : "bx-box"
                                } me-1`}
                              ></i>
                              {i.status.toUpperCase()}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHART SECTION */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom-0">
              <h6 className="m-0 fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bx bx-pie-chart-alt-2 text-primary"></i> Analytics
                Overview
              </h6>
            </div>
            <div
              className="card-body d-flex justify-content-center align-items-center py-4"
              style={{ minHeight: "300px" }}
            >
              <Charts
                lost={stats.lost}
                found={stats.found}
                returned={stats.returned}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
