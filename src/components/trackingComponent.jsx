import { useState, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Shipments from "./shipments"; 

export default function ShipmentList() {
  const [shipments, setShipments] = useState(Shipments);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const inputRefs = useRef({});

  const filteredShipments = shipments.filter((shipment) =>
    (Array.isArray(shipment.containerNo)
      ? shipment.containerNo.join(",")
      : shipment.containerNo
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (shipment) => {
    setEditData({ ...shipment });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    const requiredFields = [
      "containerNo",
      "paar",
      "products"
    ];

    const newData = { ...editData };
    const errors = {};

    requiredFields.forEach((field) => {
      const value = inputRefs.current[field]?.value?.trim();
      if (!value) {
        errors[field] = "This field is required.";
      } else {
        if (field === "containerNo") {
          newData[field] = value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        } else {
          newData[field] = value;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      const updatedList = shipments.map((s) =>
        s.billLandingNo === newData.billLandingNo ? newData : s
      );
      setShipments(updatedList);
      setMessage("✅ Shipment updated successfully.");
      setShowEditModal(false);
      setEditData(null);
    } catch (err) {
      console.error("Error updating shipment:", err);
      setMessage("❌ Failed to update shipment.");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteData || !deleteData.billLandingNo) return;

    setLoading(true);
    try {
      setShipments((prev) =>
        prev.filter((s) => s.billLandingNo !== deleteData.billLandingNo)
      );
      setMessage("🗑️ Shipment deleted.");
      setDeleteData(null);
    } catch (err) {
      console.error("Error deleting shipment:", err);
      setMessage("❌ Failed to delete shipment.");
    }
    setLoading(false);
  };

  const InfoRow = ({ label, value, style }) => (
    <div className="flex flex-col p-2">
      <span className="text-sm underline">{label}:</span>
      <span className="font-bold text-xl" style={style}>
        {value || "—"}
      </span>
    </div>
  );

  const Modal = ({ title, children, visible }) => (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity min-w-max ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } bg-black bg-opacity-40`}
    >
      <div className="bg-gray-100 p-6 rounded-tr-2xl shadow-lg w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-8 border-2 w-max rounded-tr-2xl py-1 px-2">{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded shadow-lg text-lg font-medium">
            Loading, please wait...
          </div>
        </div>
      )}

      {message && (
        <div className="fixed top-6 right-6 bg-green-100 border border-green-300 text-green-700 p-4 text-xl rounded-tl-2xl shadow">
          {message}
          <button onClick={() => setMessage("")} className="ml-4 font-bold cursor-pointer hover:scale-105 delay-200 text-xl absolute top-0 right-2 text-black">
            ×
          </button>
        </div>
      )}

      <div className="w-1/2 p-4 fixed right-11">
        <input
          type="text"
          placeholder="Search by container number..."
          className="w-full px-4 py-2 border-2 bg-gray-100 rounded-tl-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="gap-2 flex flex-col p-2 mt-16">
        {filteredShipments.map((shipment, idx) => (
          <div
            key={`${shipment.billLandingNo}-${idx}`}
            className="bg-gray-100 text-[var(--Accent)] shadow-md odd:rounded-br-2xl even:rounded-tr-2xl p-6 flex-1 min-w-[20rem] border-2"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold px-2 py-1 border-2 text-black rounded-tr-xl">
                {shipment.billLandingNo} - {" "}
                <span className="text-black font-mono font-semibold">
                  {Array.isArray(shipment.containerNo)
                    ? `{${shipment.containerNo.join(" - ")}}`
                    : `{${shipment.containerNo || "—"}}`}
                </span>
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(shipment)}
                  className="hover:scale-110 text-shadow-blue-400 cursor-pointer"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => setDeleteData(shipment)}
                  className="text-red-700 hover:scale-110 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex justify-around flex-wrap">
              <InfoRow label="Products" value={shipment.products} />
              <InfoRow
                label="Shipping Line"
                value={(shipment.shippingLine || "").replace(/_/g, " ")}
              />
              <InfoRow label="Port of loading" value={shipment.portOfLoading} />
              <InfoRow label="Port of discharge" value={shipment.portOfDischarge} />
                            <InfoRow label="Vessel" value={shipment.vessel} />

              <InfoRow
                label="Status"
                value={shipment.status}
                style={{
                  color: shipment.status !== "Arrived" ? "Purple" : "Green",
                }}
              />
              <InfoRow label="ETA" value={shipment.ETA} />
              <InfoRow label="PAAR" value={shipment.paar} />
            </div>
          </div>
        ))}
      </div>

      {deleteData && (
        <Modal title="Confirm Deletion" visible={true}>
          <p>
            Are you sure you want to delete shipment{" "}
            <strong>{deleteData.billLandingNo}</strong>?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleteData(null)}
              className="px-4 py-2 bg-gray-300 rounded-tr-xl hover:opacity-80 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-700 text-white rounded-tl-2xl hover:opacity-80 cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete Shipment"}
            </button>
          </div>
        </Modal>
      )}

      <Modal
        title={`Edit Shipment - ${editData?.billLandingNo ?? ""}`}
        visible={showEditModal}
      >
        {editData && (
          <>
            <div className="grid grid-cols-3 gap-5 min-w-auto">
              {[ 
                "containerNo",
                "products",
                "paar"
              ].map((field) => (
                <div className="flex flex-col mb-3" key={field}>
                  <label className="capitalize text-sm font-medium">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    id={field}
                    className={`border rounded-tr-lg px-2 py-1 ${
                      formErrors[field] ? "border-red-500" : ""
                    }`}
                    defaultValue={
                      field === "containerNo"
                        ? Array.isArray(editData.containerNo)
                          ? editData.containerNo.join(", ")
                          : editData.containerNo || ""
                        : editData?.[field] ?? ""
                    }
                    ref={(el) => {
                      if (el) inputRefs.current[field] = el;
                    }}
                  />
                  {formErrors[field] && (
                    <span className="text-xs text-red-500">
                      {formErrors[field]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditData(null);
                  setShowEditModal(false);
                  setMessage("");
                }}
                className="px-4 py-2 bg-gray-200 rounded-tr-xl hover:opacity-80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-tl-xl hover:opacity-80 cursor-pointer ${
                  loading ? "bg-gray-400" : "bg-green-700"
                }`}
              >
                {loading ? "Updating..." : "Update Shipment"}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
