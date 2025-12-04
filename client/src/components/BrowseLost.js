import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "http://localhost:5000/api/items/others";

export default function BrowseLost() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setItems(res.data);

        // AUTO-OPEN MODAL WHEN COMING FROM SHARED LINK
        if (id) {
          const matched = res.data.find((i) => i._id === id);
          if (matched) setSelectedItem(matched);
        }
      } catch (err) {
        console.error("Failed to load browse items", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <div className="container py-4 fade-in">
      {/* HEADER */}
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">
          <i className="bx bxs-search-alt-2 me-2 text-primary"></i>
          Browse Lost & Found
        </h4>
        <p className="text-muted small mb-0">
          Explore items reported by the community.
        </p>
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
          {items.length > 0 ? (
            items.map((i) => (
              <div className="col-md-6 col-lg-4 col-xl-3" key={i._id}>
                {/* CLICKABLE CARD */}
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card position-relative"
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => setSelectedItem(i)}
                >
                  {/* Image Section */}
                  <div
                    className="position-relative bg-light"
                    style={{ height: "200px" }}
                  >
                    {i.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${i.image}`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        alt="item"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted opacity-25">
                        <i
                          className="bx bx-image-alt"
                          style={{ fontSize: "4rem" }}
                        ></i>
                      </div>
                    )}

                    {/* Floating Status Badge */}
                    <div className="position-absolute top-0 end-0 m-3">
                      {i.returned ? (
                        <span className="badge bg-success bg-opacity-75 backdrop-blur shadow-sm rounded-pill fw-normal">
                          <i className="bx bx-check-double me-1"></i> Returned
                        </span>
                      ) : (
                        <span
                          className={`badge shadow-sm rounded-pill fw-normal text-uppercase ${
                            i.status === "lost"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {i.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="fw-bold text-dark mb-1 text-truncate">
                      {i.title}
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
                      {i.description || "No description provided."}
                    </p>

                    <div className="bg-light rounded-3 p-2">
                      <div className="d-flex align-items-center text-muted small mb-1">
                        <i className="bx bx-map me-2 text-primary opacity-50"></i>
                        <span className="text-truncate">
                          {i.location || "Unknown Location"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bx bx-search-alt fs-1 mb-2 opacity-25"></i>
              <p>No items found.</p>
            </div>
          )}
        </div>
      )}

      {/* ================================
             VIEW ITEM MODAL (Split View)
         ================================ */}
      {selectedItem && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 1040,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          ></div>

          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                {/* HEADER */}
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    <i className="bx bx-notepad text-primary"></i> Item Details
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedItem(null)}
                  ></button>
                </div>

                {/* BODY */}
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* LEFT: IMAGE */}
                    <div className="col-lg-6">
                      <div
                        className="rounded-4 overflow-hidden bg-light border position-relative shadow-sm d-flex align-items-center justify-content-center"
                        style={{ height: "320px" }}
                      >
                        {selectedItem.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${selectedItem.image}`}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                            alt="item"
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
                      </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="col-lg-6 d-flex flex-column">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h3 className="fw-bold text-dark mb-0">
                            {selectedItem.title}
                          </h3>
                          {selectedItem.returned ? (
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                              Returned
                            </span>
                          ) : (
                            <span
                              className={`badge rounded-pill px-3 ${
                                selectedItem.status === "lost"
                                  ? "bg-danger bg-opacity-10 text-danger"
                                  : "bg-warning bg-opacity-10 text-warning"
                              }`}
                            >
                              {selectedItem.status.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <p
                          className="text-muted"
                          style={{
                            lineHeight: "1.6",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {selectedItem.description ||
                            "No description provided."}
                        </p>
                      </div>

                      {/* Metadata Box */}
                      <div className="mt-auto bg-light rounded-3 p-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bx bx-map text-primary me-2"></i>
                          <span className="small text-muted fw-bold me-1">
                            Location:
                          </span>
                          <span className="small text-dark">
                            {selectedItem.location || "N/A"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bx bx-user text-primary me-2"></i>
                          <span className="small text-muted fw-bold me-1">
                            Listed by:
                          </span>
                          <span className="small text-dark">
                            {selectedItem.userId?.name || "Unknown"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bx bx-phone text-primary me-2"></i>
                          <span className="small text-muted fw-bold me-1">
                            Contact:
                          </span>
                          <span className="small text-dark">
                            {selectedItem.contact || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
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

      {/* Internal CSS for hover effects */}
      <style>{`
        .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
        .backdrop-blur {
            backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}
