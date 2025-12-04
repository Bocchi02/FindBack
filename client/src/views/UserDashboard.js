import { useState, useEffect } from "react";

import SidebarUser from "../components/SidebarUser";
import BrowseLost from "../components/BrowseLost";
import MyListings from "../components/MyListings";
import ItemForm from "../components/ItemForm";

export default function UserDashboard({ user, onLogout }) {
  // Initialize tab from localStorage or default to 'browse'
  const [tab, setTab] = useState(
    () => localStorage.getItem("userTab") || "browse"
  );

  // Persist tab selection
  useEffect(() => {
    localStorage.setItem("userTab", tab);
  }, [tab]);

  // Dynamic Header Title Helper
  const getPageTitle = () => {
    switch (tab) {
      case "browse":
        return "Browse Items";
      case "post":
        return "Report Lost Item";
      case "mine":
        return "My Listings";
      default:
        return "User Dashboard";
    }
  };

  return (
    <div
      className="d-flex bg-light font-sans"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar - Passed 'tab' for active highlighting */}
      <SidebarUser tab={tab} setTab={setTab} />

      {/* Main Layout */}
      <div className="flex-grow-1 d-flex flex-column h-100 position-relative">
        {/* --- Top Header --- */}
        <header
          className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm"
          style={{ zIndex: 10, minHeight: "70px" }}
        >
          {/* Page Title Area */}
          <div className="d-flex align-items-center gap-3">
            {/* Mobile Sidebar Toggle could go here if needed */}
            <div>
              <h5 className="fw-bold text-dark m-0 tracking-tight">
                {getPageTitle()}
              </h5>
              <span className="small text-muted fw-medium">User Portal</span>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="d-flex align-items-center gap-4">
            <div className="text-end lh-1 d-none d-sm-block">
              <div className="small fw-bold text-dark">{user.name}</div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                Community Member
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
          {/* We don't need padding here because the sub-components 
             (BrowseLost, MyListings, ItemForm) 
             already have their own container/padding logic.
          */}
          <div className="h-100 w-100 fade-in">
            {tab === "browse" && <BrowseLost />}

            {tab === "post" && <ItemForm />}

            {tab === "mine" && <MyListings />}
          </div>
        </main>
      </div>
    </div>
  );
}
