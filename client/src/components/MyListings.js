import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/items/mine";

export default function MyListings() {
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setMine(res.data);
    } catch (err) {
      console.error("Error loading listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markReturned = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/items/${id}`);
      load();
    } catch (err) {
      alert("Failed to update item status.");
    }
  };

  const deleteItem = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this listing? This cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`);
        load();
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  return (
    <div className="container py-4 fade-in">
      {/* HEADER */}
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">
          <i className="bx bxs-bookmarks me-2 text-primary"></i>
          My Listings
        </h4>
        <p className="text-muted small mb-0">
          Manage the items you have reported as lost or found.
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted text-uppercase small">
                  <th className="ps-4 py-3" style={{ width: "40%" }}>
                    Item Details
                  </th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Location</th>
                  <th className="text-end pe-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div
                        className="spinner-border text-primary text-opacity-50"
                        role="status"
                      ></div>
                      <p className="text-muted small mt-2">
                        Loading your items...
                      </p>
                    </td>
                  </tr>
                ) : mine.length > 0 ? (
                  mine.map((i) => (
                    <tr key={i._id} style={{ transition: "all 0.2s" }}>
                      {/* 1. Item Image & Title */}
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 bg-light border d-flex align-items-center justify-content-center overflow-hidden"
                            style={{ width: "50px", height: "50px" }}
                          >
                            {i.image ? (
                              <img
                                src={`http://localhost:5000/uploads/${i.image}`}
                                className="w-100 h-100"
                                style={{ objectFit: "cover" }}
                                alt="item"
                              />
                            ) : (
                              <i className="bx bx-image text-muted opacity-50 fs-4"></i>
                            )}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">
                              {i.title}
                            </div>
                            <div
                              className="small text-muted text-truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {i.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Status Badge */}
                      <td>
                        {i.returned ? (
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-normal">
                            <i className="bx bx-check-double me-1"></i> Returned
                          </span>
                        ) : (
                          <span
                            className={`badge rounded-pill px-3 py-2 fw-normal ${
                              i.status === "Lost"
                                ? "bg-danger bg-opacity-10 text-danger"
                                : "bg-warning bg-opacity-10 text-warning"
                            }`}
                          >
                            {i.status}
                          </span>
                        )}
                      </td>

                      {/* 3. Location */}
                      <td>
                        <div className="d-flex align-items-center text-muted small">
                          <i className="bx bx-map me-1"></i>{" "}
                          {i.location || "N/A"}
                        </div>
                      </td>

                      {/* 4. Actions */}
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          {!i.returned && (
                            <button
                              className="btn btn-outline-success btn-sm rounded-pill d-flex align-items-center gap-1"
                              onClick={() => markReturned(i._id)}
                              title="Mark as Returned"
                            >
                              <i className="bx bx-check"></i>
                              <span className="d-none d-md-inline">
                                Mark Returned
                              </span>
                            </button>
                          )}

                          <button
                            className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center gap-1"
                            onClick={() => deleteItem(i._id)}
                            title="Delete Listing"
                          >
                            <i className="bx bx-trash"></i>
                            <span className="d-none d-md-inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      <i className="bx bx-ghost fs-1 mb-2 opacity-25"></i>
                      <p>You haven't posted any items yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
