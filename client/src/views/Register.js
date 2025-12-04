import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API = "/api/auth/register";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(API, form);
      // Optional: You could show a success message state here instead of alert
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light fade-in px-3">
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body p-5">
          {/* HEADER */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
              style={{ width: "60px", height: "60px" }}
            >
              <i className="bx bxs-user-plus fs-1"></i>
            </div>
            <h3 className="fw-bold text-dark tracking-tight">Create Account</h3>
            <p className="text-muted small mb-0">
              Join our community to report and find items.
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 py-2 rounded-3 small"
              role="alert"
            >
              <i className="bx bxs-error-circle fs-5"></i>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {/* Full Name */}
            <div className="form-floating mb-3">
              <input
                className="form-control rounded-3"
                id="floatingName"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label htmlFor="floatingName" className="text-muted">
                <i className="bx bx-user me-1"></i> Full Name
              </label>
            </div>

            {/* Email */}
            <div className="form-floating mb-3">
              <input
                className="form-control rounded-3"
                id="floatingEmail"
                placeholder="name@example.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label htmlFor="floatingEmail" className="text-muted">
                <i className="bx bx-envelope me-1"></i> Email Address
              </label>
            </div>

            {/* Password */}
            <div className="form-floating mb-4">
              <input
                className="form-control rounded-3"
                id="floatingPassword"
                placeholder="Password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <label htmlFor="floatingPassword" className="text-muted">
                <i className="bx bx-lock-alt me-1"></i> Choose Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <i className="bx bx-right-arrow-alt fs-5"></i>
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary fw-bold text-decoration-none"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
