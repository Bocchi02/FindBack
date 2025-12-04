import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/items";

export default function ItemForm() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Lost",
    location: "",
    contact: "",
    image: null,
  });

  // Handle Text Inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Image Selection & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      data.append(k, v);
    });

    try {
      await axios.post(API, data);

      // Reset Form
      setForm({
        title: "",
        description: "",
        status: "Lost",
        location: "",
        contact: "",
        image: null,
      });
      setImagePreview(null);
      alert("Item successfully posted!");
    } catch (err) {
      alert("Failed to post item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container for centering and margins
    <div className="d-flex justify-content-center w-100 fade-in py-3">
      {/* Card constrained to max-width for compact look */}
      <div
        className="card border-0 shadow-sm rounded-4 p-4 w-100"
        style={{ maxWidth: "600px" }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-2"
            style={{ width: "50px", height: "50px" }}
          >
            <i className="bx bxs-megaphone fs-3"></i>
          </div>
          <h4 className="fw-bold text-dark">Report an Item</h4>
          <p className="text-muted small mb-0">
            Fill in the details below to notify the community.
          </p>
        </div>

        <form onSubmit={submitForm}>
          {/* --- 1. Image Upload Section --- */}
          <div className="mb-4 text-center">
            <label
              htmlFor="userImageUpload"
              className="d-block w-100 rounded-4 border-2 border-dashed position-relative overflow-hidden bg-light hover-bg-gray"
              style={{
                height: "180px", // Slightly more compact height
                borderStyle: "dashed",
                borderColor: "#ced4da",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {imagePreview ? (
                <div className="position-relative h-100 w-100 group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50 opacity-0 hover-opacity-100 transition-all text-white fw-bold">
                    <i className="bx bx-refresh fs-4 me-2"></i> Change Photo
                  </div>
                </div>
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                  <i className="bx bxs-camera-plus fs-1 mb-2 text-primary opacity-50"></i>
                  <span className="fw-semibold">Upload Photo</span>
                  <span className="small text-muted opacity-75">
                    (Tap to browse)
                  </span>
                </div>
              )}

              <input
                type="file"
                id="userImageUpload"
                className="d-none"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </label>
          </div>

          {/* --- 2. Title Input --- */}
          <div className="form-floating mb-3">
            <input
              className="form-control rounded-3"
              id="floatingTitle"
              placeholder="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingTitle">
              <i className="bx bx-tag me-1"></i> What is the item?
            </label>
          </div>

          {/* --- 3. Status & Location Row --- */}
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <div className="form-floating">
                <select
                  className="form-select rounded-3"
                  id="floatingStatus"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
                <label htmlFor="floatingStatus">Status</label>
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-floating">
                <input
                  className="form-control rounded-3"
                  id="floatingLocation"
                  placeholder="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingLocation">
                  <i className="bx bx-map me-1"></i> Where was it lost/found?
                </label>
              </div>
            </div>
          </div>

          {/* --- 4. Contact --- */}
          <div className="form-floating mb-3">
            <input
              className="form-control rounded-3"
              id="floatingContact"
              placeholder="Contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingContact">
              <i className="bx bx-phone me-1"></i> Contact Information
            </label>
          </div>

          {/* --- 5. Description --- */}
          <div className="form-floating mb-4">
            <textarea
              className="form-control rounded-3"
              id="floatingDesc"
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{ height: "100px" }}
              required
            />
            <label htmlFor="floatingDesc">
              <i className="bx bx-detail me-1"></i> Detailed Description
            </label>
          </div>

          {/* --- 6. Submit Button --- */}
          <button
            className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>
                Submitting...
              </>
            ) : (
              <>
                <i className="bx bx-paper-plane"></i> Submit Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Internal CSS for Hover Effects */}
      <style jsx>{`
        .hover-opacity-100:hover {
          opacity: 1 !important;
        }
        .hover-bg-gray:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}
