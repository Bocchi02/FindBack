import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import UserList from "../components/UserList";
import ItemManagement from "../components/ItemManagement";

export default function AdminDashboard({ user, onLogout }) {
  const [tab, setTab] = useState(
    () => localStorage.getItem("adminTab") || "dashboard"
  );

  useEffect(() => {
    localStorage.setItem("adminTab", tab);
  }, [tab]);

  return (
    <div
      className="d-flex bg-light font-sans"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <Sidebar tab={tab} setTab={setTab} />

      {/* Main Layout */}
      <div className="flex-grow-1 d-flex flex-column h-100 position-relative">
        {/* --- Top Header --- */}
        <header
          className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm"
          style={{ zIndex: 10, minHeight: "70px" }}
        >
          {/* Brand/Title Area */}
          <div className="d-flex align-items-center gap-3"></div>

          {/* User Profile & Actions */}
          <div className="d-flex align-items-center gap-4">
            <div className="text-end lh-1 d-none d-sm-block">
              <div className="small fw-bold text-dark">{user.name}</div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                Administrator
              </div>
            </div>

            <div className="vr h-50 mx-1 text-muted opacity-25"></div>

            <button
              className="btn btn-light btn-sm text-danger d-flex align-items-center justify-content-center rounded-circle hover-danger transition-all"
              onClick={onLogout}
              style={{ width: "40px", height: "40px" }}
              title="Logout"
            >
              <i className="bx bx-log-out-circle fs-5"></i>
            </button>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <main className="flex-grow-1 overflow-auto bg-light position-relative">
          <div className="container-fluid p-4 h-100 fade-in">
            {/* 1. DASHBOARD TAB */}
            {tab === "dashboard" && <Dashboard />}

            {/* 2. USERS TAB */}
            {tab === "users" && <UserList />}

            {/* 3. ITEMS TAB (Refactored) */}
            {tab === "items" && <ItemManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}
