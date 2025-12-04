import { useState } from "react";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";

export default function ItemManagement() {
  const [showItemModal, setShowItemModal] = useState(false);

  const handleCloseModal = () => setShowItemModal(false);

  return (
    // Added 'container' to compress width and 'py-4' for vertical spacing
    <div className="container h-100 d-flex flex-column fade-in py-4">
      {/* --- Header Section --- */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">
            <i className="bx bx-layer me-2 text-primary"></i>
            Inventory Management
          </h4>
          <p className="text-muted small mb-0">
            View, delete, and manage lost & found items.
          </p>
        </div>

        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm rounded-pill transition-all"
          onClick={() => setShowItemModal(true)}
        >
          <i className="bx bx-plus-circle fs-5"></i>
          <span>Add New Item</span>
        </button>
      </div>

      {/* --- Full Width List Container --- */}
      {/* flex-grow-1 ensures it takes remaining height, overflow-hidden keeps scroll inside card */}
      <div className="card border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
        <div className="card-body p-0 overflow-auto">
          {/* Passed canDelete=true so Admins can remove items */}
          <ItemList canDelete={true} />
        </div>
      </div>

      {/* =========================
             ADD ITEM MODAL
         ========================= */}
      {showItemModal && (
        <>
          {/* Backdrop with Blur */}
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
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                {/* Modal Header */}
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    <i className="bx bx-package text-primary"></i>
                    Register New Item
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  <ItemForm onSuccess={handleCloseModal} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
