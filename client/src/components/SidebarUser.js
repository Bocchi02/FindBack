export default function SidebarUser({ tab, setTab }) {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 bg-white border-end h-100"
      style={{ width: "260px", transition: "width 0.3s" }}
    >
      {/* --- Internal CSS for Interactions --- */}
      <style>
        {`
          .nav-link {
            transition: all 0.2s ease-in-out;
            border-radius: 12px;
            font-weight: 500;
            color: #6c757d; /* text-muted */
            margin-bottom: 4px;
            text-align: left;
            background: transparent;
            border: none;
          }
          
          /* Hover State */
          .nav-link:hover {
            background-color: #f8f9fa;
            color: #212529;
            transform: translateX(4px);
          }

          /* Active State */
          .nav-link.active {
            background-color: rgba(13, 110, 253, 0.1);
            color: #f8f9fa !important;
            font-weight: 600;
          }
          
          .nav-icon {
            font-size: 1.3rem;
            min-width: 24px;
          }
        `}
      </style>

      {/* --- Brand / Logo Section --- */}
      <div className="p-4 d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
          style={{ width: "36px", height: "36px" }}
        >
          <img
            src="/logo-hehe.png"
            alt="Logo"
            style={{ width: "24px", height: "24px" }}
          />
        </div>
        <div>
          <h6
            className="m-0 fw-bold text-dark tracking-tight"
            style={{ lineHeight: "1" }}
          >
            FindBack
          </h6>
          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
            User Portal
          </small>
        </div>
      </div>

      <div className="px-3 py-2">
        <small
          className="text-uppercase text-muted fw-bold"
          style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
        >
          Menu
        </small>
      </div>

      {/* --- Navigation Links --- */}
      <ul className="nav nav-pills flex-column px-3 mb-auto">
        <li className="nav-item">
          <button
            className={`nav-link w-100 d-flex align-items-center px-3 py-2 ${
              tab === "browse" ? "active" : ""
            }`}
            onClick={() => setTab("browse")}
          >
            <i
              className={`bx ${
                tab === "browse" ? "bxs-search-alt-2" : "bx-search-alt"
              } nav-icon me-3`}
            ></i>
            Browse Items
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link w-100 d-flex align-items-center px-3 py-2 ${
              tab === "post" ? "active" : ""
            }`}
            onClick={() => setTab("post")}
          >
            <i
              className={`bx ${
                tab === "post" ? "bxs-plus-circle" : "bx-plus-circle"
              } nav-icon me-3`}
            ></i>
            Post Lost Item
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link w-100 d-flex align-items-center px-3 py-2 ${
              tab === "mine" ? "active" : ""
            }`}
            onClick={() => setTab("mine")}
          >
            <i
              className={`bx ${
                tab === "mine" ? "bxs-bookmarks" : "bx-bookmark"
              } nav-icon me-3`}
            ></i>
            My Listings
          </button>
        </li>
      </ul>
    </div>
  );
}
