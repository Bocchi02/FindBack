import { useEffect, useState } from "react";
import axios from "axios";

const API = "/api/users";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // -----------------------
  // LOAD USERS
  // -----------------------
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // -----------------------
  // STATS CALCULATIONS (New)
  // -----------------------
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = totalUsers - adminCount;

  // -----------------------
  // MODAL HANDLERS
  // -----------------------
  const openCreate = () => {
    setForm({ name: "", email: "", password: "", role: "user" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditingId(user._id);
    setShowModal(true);
  };

  // -----------------------
  // CRUD OPERATIONS
  // -----------------------
  const saveUser = async (e) => {
    e.preventDefault();
    try {
      if (!editingId) {
        await axios.post(API, form);
      } else {
        await axios.put(`${API}/${editingId}`, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
      }
      setShowModal(false);
      loadUsers();
    } catch {
      alert("Failed to save user");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await axios.delete(`${API}/${id}`);
        loadUsers();
      } catch {
        alert("Failed to delete user");
      }
    }
  };

  // Helper to get initials for avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="container py-5 fade-in">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0 text-dark">
            <i className="bx bxs-user-account me-2 text-primary"></i>
            User Management
          </h4>
          <p className="text-muted small mb-0">
            Manage your team members and roles.
          </p>
        </div>

        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm rounded-pill"
          onClick={openCreate}
        >
          <i className="bx bx-plus fs-5"></i>
          <span>Add New</span>
        </button>
      </div>

      {/* 1. TOP STATS ROW (Added for consistency with Dashboard) */}
      <div className="row g-4 mb-4">
        {/* Total Users */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bx bx-group fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1 text-uppercase fw-bold ls-1">
                  Total Users
                </h6>
                <h2 className="mb-0 fw-bold text-dark">
                  {loading ? "-" : totalUsers}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-purple bg-opacity-10 text-purple-dark"
                style={{
                  width: "60px",
                  height: "60px",
                  color: "#5925dc",
                  backgroundColor: "#e0cffc",
                }}
              >
                <i className="bx bx-shield-quarter fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1 text-uppercase fw-bold ls-1">
                  Administrators
                </h6>
                <h2 className="mb-0 fw-bold text-dark">
                  {loading ? "-" : adminCount}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Regular Users */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bx bx-user fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1 text-uppercase fw-bold ls-1">
                  Regular Users
                </h6>
                <h2 className="mb-0 fw-bold text-dark">
                  {loading ? "-" : userCount}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* USER TABLE CARD */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted text-uppercase small">
                  <th className="ps-4 py-3" style={{ width: "40%" }}>
                    User
                  </th>
                  <th className="py-3">Role</th>
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
                      <p className="text-muted small mt-2">Loading users...</p>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} style={{ transition: "all 0.2s" }}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center">
                          {/* Modern Avatar Circle */}
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary fw-bold me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">
                              {u.name}
                            </div>
                            <div className="small text-muted d-flex align-items-center">
                              <i className="bx bx-envelope me-1"></i>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 fw-normal d-inline-flex align-items-center gap-1 ${
                            u.role === "admin"
                              ? "bg-purple text-purple-dark"
                              : "bg-secondary bg-opacity-10 text-secondary"
                          }`}
                          style={
                            u.role === "admin"
                              ? { backgroundColor: "#e0cffc", color: "#5925dc" }
                              : {}
                          }
                        >
                          <i
                            className={`bx ${
                              u.role === "admin"
                                ? "bx-shield-quarter"
                                : "bx-user"
                            }`}
                          ></i>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center text-muted hover-primary"
                            style={{ width: "32px", height: "32px" }}
                            title="Edit User"
                            onClick={() => openEdit(u)}
                          >
                            <i className="bx bx-edit-alt fs-6"></i>
                          </button>

                          <button
                            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center text-muted hover-danger"
                            style={{ width: "32px", height: "32px" }}
                            title="Delete User"
                            onClick={() => deleteUser(u._id)}
                          >
                            <i className="bx bx-trash fs-6"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      <i className="bx bx-search fs-1 mb-2 text-muted opacity-50"></i>
                      <p className="mb-0">No users found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =====================================================
                            USER MODAL
      ===================================================== */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040, backgroundColor: "rgba(0,0,0,0.5)" }}
          ></div>

          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    <i
                      className={`bx ${
                        editingId ? "bx-edit-alt" : "bx-user-plus"
                      } text-primary`}
                    ></i>
                    {editingId ? "Update User" : "Create New User"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <form onSubmit={saveUser}>
                  <div className="modal-body pt-4">
                    {/* Name Input */}
                    <div className="form-floating mb-3">
                      <input
                        className="form-control rounded-3"
                        id="floatingName"
                        placeholder="Full Name"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                      <label htmlFor="floatingName">
                        <i className="bx bx-id-card me-1"></i> Full Name
                      </label>
                    </div>

                    {/* Email Input */}
                    <div className="form-floating mb-3">
                      <input
                        className="form-control rounded-3"
                        id="floatingEmail"
                        placeholder="Email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                      <label htmlFor="floatingEmail">
                        <i className="bx bx-envelope me-1"></i> Email Address
                      </label>
                    </div>

                    {/* Password */}
                    {!editingId && (
                      <div className="form-floating mb-3">
                        <input
                          className="form-control rounded-3"
                          id="floatingPass"
                          placeholder="Password"
                          type="password"
                          required
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                        />
                        <label htmlFor="floatingPass">
                          <i className="bx bx-lock-alt me-1"></i> Password
                        </label>
                      </div>
                    )}

                    {/* Role Select */}
                    <div className="mb-2">
                      <label className="form-label small text-muted fw-bold ms-1">
                        ASSIGN ROLE
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 text-muted">
                          <i className="bx bx-shield"></i>
                        </span>
                        <select
                          className="form-select border-start-0 ps-0"
                          value={form.role}
                          onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                          }
                        >
                          <option value="user">User</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top-0">
                    <button
                      type="button"
                      className="btn btn-light text-muted px-4 rounded-pill"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 rounded-pill"
                    >
                      {editingId ? "Save Changes" : "Create Account"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
