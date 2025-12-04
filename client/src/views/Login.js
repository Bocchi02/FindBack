import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LOGIN_API = "/api/auth/login";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(LOGIN_API, form);
      // Small delay to show the loading animation smoothness
      setTimeout(() => onLogin(res.data), 500);
    } catch {
      setError("Invalid email or password.");
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
              <i className="bx bxs-user-circle fs-1"></i>
            </div>
            <h3 className="fw-bold text-dark tracking-tight">Welcome Back</h3>
            <p className="text-muted small mb-0">
              Sign in to manage lost & found items.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 py-2 rounded-3 small"
              role="alert"
            >
              <i className="bx bxs-error-circle fs-5"></i>
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={login}>
            <div className="form-floating mb-3">
              <input
                className="form-control rounded-3"
                id="floatingInput"
                placeholder="name@example.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label htmlFor="floatingInput" className="text-muted">
                <i className="bx bx-envelope me-1"></i> Email Address
              </label>
            </div>

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
                <i className="bx bx-lock-alt me-1"></i> Password
              </label>
            </div>

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
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="bx bx-right-arrow-alt fs-5"></i>
                </>
              )}
            </button>
          </form>
          {/* CREATE ACCOUNT LINK */}
          <div className="mt-4 text-center">
            <p className="text-muted small mb-2">Don’t have an account yet?</p>

            <Link
              to="/register"
              className="btn btn-outline-primary rounded-pill px-4 fw-bold"
            >
              <i className="bx bx-user-plus me-2"></i>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
