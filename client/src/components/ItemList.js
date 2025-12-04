import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/items";

export default function ItemList({ canDelete }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setItems(res.data);
    } catch (err) {
      console.error("Error loading items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const markReturned = async (id) => {
    try {
      await axios.patch(`${API}/${id}`);
      loadItems();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API}/${id}`);
        loadItems();
      } catch (err) {
        alert("Error deleting item");
      }
    }
  };

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5 fade-in">
      {/* HEADER & SEARCH */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-6">
          <h4 className="fw-bold text-dark mb-1">
            <i className="bx bxs-component me-2 text-primary"></i>
            Items Registry
          </h4>
          <p className="text-muted small mb-0">
            Browse lost, found, and returned items.
          </p>
        </div>
        <div className="col-md-6">
          <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border">
            <span className="input-group-text bg-white border-0 ps-3">
              <i className="bx bx-search text-muted"></i>
            </span>
            <input
              className="form-control border-0 ps-1"
              placeholder="Search items by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary text-opacity-50"
            role="status"
          ></div>
          <p className="text-muted small mt-2">Loading items...</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div className="col-md-6 col-lg-4 col-xl-3" key={item._id}>
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div
                    className="position-relative bg-light"
                    style={{ height: "200px" }}
                  >
                    {item.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        alt="Item"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted opacity-25">
                        <i
                          className="bx bx-image-alt"
                          style={{ fontSize: "4rem" }}
                        ></i>
                      </div>
                    )}

                    {/* Floating Badge */}
                    <div className="position-absolute top-0 end-0 m-3">
                      {item.returned ? (
                        <span className="badge bg-success bg-opacity-75 backdrop-blur shadow-sm rounded-pill fw-normal">
                          <i className="bx bx-check-double me-1"></i> Returned
                        </span>
                      ) : (
                        <span
                          className={`badge shadow-sm rounded-pill fw-normal text-uppercase ${
                            item.status === "lost"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTENT BODY */}
                  <div className="card-body p-3 d-flex flex-column">
                    <h6
                      className="fw-bold text-dark mb-1 text-truncate"
                      title={item.title}
                    >
                      {item.title}
                    </h6>

                    <p
                      className="text-muted small mb-3 flex-grow-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "No description provided."}
                    </p>

                    {/* Meta Data */}
                    <div className="bg-light rounded-3 p-2 mb-3">
                      <div className="d-flex align-items-center text-muted small mb-1">
                        <i className="bx bx-user me-2 text-primary opacity-50"></i>
                        <span className="text-truncate">
                          {item.contact || "No contact info"}
                        </span>
                      </div>
                      {/* You could add Date here if available in data */}
                      {/* <div className="d-flex align-items-center text-muted small">
                            <i className='bx bx-calendar me-2 text-primary opacity-50'></i>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div> */}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="d-flex gap-2 mt-auto">
                      {!item.returned && (
                        <button
                          className="btn btn-outline-success btn-sm flex-fill rounded-pill d-flex align-items-center justify-content-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            markReturned(item._id);
                          }}
                          title="Mark as Returned"
                        >
                          <i className="bx bx-check"></i> Return
                        </button>
                      )}

                      {canDelete && (
                        <button
                          className="btn btn-outline-danger btn-sm flex-fill rounded-pill d-flex align-items-center justify-content-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item._id);
                          }}
                          title="Delete Item"
                        >
                          <i className="bx bx-trash"></i> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="mb-3 text-muted opacity-25">
                <i
                  className="bx bx-search-alt"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h6 className="text-muted">No items found matching "{search}"</h6>
            </div>
          )}
        </div>
      )}

      {/* ============================
       VIEW ITEM MODAL
=============================== */}
      {selectedItem && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 1040,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          ></div>

          {/* Modal */}
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                {/* Header */}
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2 text-dark">
                    <i className="bx bx-notepad text-primary"></i>
                    Item Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedItem(null)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* LEFT COL: IMAGE */}
                    <div className="col-lg-6">
                      <div
                        className="rounded-4 overflow-hidden bg-light border position-relative shadow-sm d-flex align-items-center justify-content-center"
                        style={{ height: "320px" }}
                      >
                        {selectedItem.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${selectedItem.image}`}
                            alt="Item"
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="text-center text-muted opacity-50">
                            <i
                              className="bx bx-image-alt"
                              style={{ fontSize: "5rem" }}
                            ></i>
                            <p className="small mb-0">No image uploaded</p>
                          </div>
                        )}

                        {/* Floating Status Badge */}
                        <div className="position-absolute top-0 start-0 m-3">
                          {selectedItem.returned ? (
                            <span className="badge bg-success shadow-sm px-3 py-2 rounded-pill fw-normal">
                              <i className="bx bx-check-double me-1"></i>{" "}
                              Returned
                            </span>
                          ) : (
                            <span
                              className={`badge shadow-sm px-3 py-2 rounded-pill fw-normal text-uppercase ${
                                selectedItem.status === "lost"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {selectedItem.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COL: INFO */}
                    <div className="col-lg-6 d-flex flex-column">
                      <div>
                        <h3 className="fw-bold text-dark mb-3">
                          {selectedItem.title}
                        </h3>

                        <div className="mb-4">
                          <label
                            className="text-uppercase text-muted fw-bold small mb-1"
                            style={{
                              fontSize: "0.7rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Description
                          </label>
                          <p
                            className="text-muted"
                            style={{ lineHeight: "1.6" }}
                          >
                            {selectedItem.description ||
                              "No detailed description provided."}
                          </p>
                        </div>
                      </div>

                      {/* Meta Data Box */}
                      <div className="mt-auto bg-light rounded-3 p-3 border">
                        {/* User Info */}
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="d-flex align-items-center justify-content-center bg-white rounded-circle text-primary shadow-sm me-3"
                            style={{ width: "36px", height: "36px" }}
                          >
                            <i className="bx bx-user"></i>
                          </div>
                          <div style={{ lineHeight: "1.2" }}>
                            <div className="small fw-bold text-dark">
                              Listed By
                            </div>
                            <div className="small text-muted">
                              {selectedItem.userId?.name || "Unknown User"}
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="d-flex align-items-center">
                          <div
                            className="d-flex align-items-center justify-content-center bg-white rounded-circle text-primary shadow-sm me-3"
                            style={{ width: "36px", height: "36px" }}
                          >
                            <i className="bx bx-phone"></i>
                          </div>
                          <div style={{ lineHeight: "1.2" }}>
                            <div className="small fw-bold text-dark">
                              Contact Info
                            </div>
                            <div className="small text-muted">
                              {selectedItem.contact ||
                                "No contact info available"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer border-top-0 pt-0">
                  <button
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Optional: Add custom CSS for hover effect in your global CSS file */}
      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .backdrop-blur {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}
