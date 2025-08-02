import { useEffect, useState } from "react";
import axios from "axios";
import ShipmentList from "../components/trackingComponent";
import AgaryLogo from "../assets/Agary_logo.png";

const baseURL = "https://nacon-v2.onrender.com";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [isNewEntryOpen, setNewEntry] = useState(false);
  const [formData, setFormData] = useState({
    nameOfProducts: "",
    billLandingNo: "",
    containerNo: "",
    paar: "",
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  async function fetchShipments() {
    try {
      const res = await axios.get(`${baseURL}/v2/shipments`);
      setShipments(res.data);
    } catch (err) {
      console.error("Error Fetching Shipments:", err);
    }
  }

  const openNewEntry = () => setNewEntry(true);

  const closeModals = () => {
    setNewEntry(false);
    setFormData({
      billLandingNo: "",
      containerNo: "",
      products: "",
      shippingLine: "",
      portOfLoading: "",
      portOfDischarge: "",
      vessel: "",
      status: "",
      ETA: "",
      paar: "",
    });
    setErrors({});
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = async (updated) => {
    try {
      const formatShippingLine = (line) =>
        line.replace(/\s+/g, "_").toUpperCase();

      const updatedShipment = {
        ...updated,
        containerNo: Array.isArray(updated.containerNo)
          ? updated.containerNo
          : [updated.containerNo],
        shippingLine: formatShippingLine(updated.shippingLine),
      };

      const res = await axios.put(
        `${baseURL}/v2/shipments/update`,
        updatedShipment
      );
      setShipments((prev) =>
        prev.map((s) =>
          s.billLandingNo === updated.billLandingNo ? res.data : s
        )
      );
    } catch (err) {
      console.error("Error updating shipment:", err);
    }
  };

  const handleDelete = async (billLandingNo) => {
    try {
      await axios.delete(`${baseURL}/v2/shipments/${billLandingNo}`);
      setShipments((prev) =>
        prev.filter((s) => s.billLandingNo !== billLandingNo)
      );
    } catch (err) {
      console.error("Error deleting shipment:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleCreate = async () => {
  const newErrors = {};
  Object.entries(formData).forEach(([k, v]) => {
    if (!v.trim()) newErrors[k] = `Enter ${k.replace(/([A-Z])/g, " $1")}.`;
  });
  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    return;
  }

  const containerNumbers = formData.containerNo
    .split(/[\s,-]+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const payload = {
    ...formData,
    containerNo: containerNumbers,
  };

  try {
    setIsLoading(true);
    const res = await axios.post(`${baseURL}/v2/shipments`, payload);
    setShipments((prev) => [...prev, res.data]);
    setSuccessMessage("Shipment entry created successfully.");
    setShowConfirm(true);
    closeModals();
  } catch (error) {
    console.error("Error response:", error.response?.data);
    const backendError =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";
    setErrorMessage(backendError);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="w-full text-[var(--Accent)] bg-blue-400 flex flex-col px-8 pb-2">
      <div className="flex justify-between ml-24 mr-12 items-center py-8">
        <h2 className="text-5xl font-extrabold text-black flex items-center gap-6">
          <img src={AgaryLogo} className="w-40 rounded-full" />
          <h2 className="text-3xl font-extrabold">Admin Dashboard</h2>
        </h2>
        <div className="flex gap-12">
          <button
            onClick={openNewEntry}
            className="text-lg flex gap-1 items-center group font-normal px-2 py-1 rounded-tr-2xl cursor-pointer shadow-md bg-[var(--Accent)] text-[var(--Secondary)] hover:scale-105 delay-200 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#e3e3e3"
            >
              <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
            </svg>
            <p className="group-hover:font-bold transition-transform delay-200">
              Create Shipment Entry
            </p>
          </button>
          <button
            onClick={handleLogout}
            className="text-lg flex group font-extrabold px-2 py-2 rounded-tl-2xl cursor-pointer shadow-md border-2 text-[var(--Accent)] hover:scale-105 delay-200 transition-all bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#121929"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            <p className="group-hover:flex hidden delay-200 transition-transform">
              Logout
            </p>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto bg-blue-400 border-2 rounded-tl-3xl h-full">
        <ShipmentList
          shipments={shipments}
          onUpdate={handleSave}
          onDelete={handleDelete}
          onSuccessMessage={setSuccessMessage}
        />
      </div>

      {isNewEntryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-6 rounded-lg flex flex-col w-max shadow-lg">
            <div className="text-xl font-extrabold mb-4 p-3 rounded-tr-xl border w-max">
              New Shipment Entry
            </div>

            <div className="space-y-4 grid grid-cols-3 gap-4">
              {["billLandingNo", "containerNo", "nameOfProducts", "paar"].map(
                (name) => (
                  <div key={name} className="flex flex-col">
                    <label
                      className="text-sm font-semibold mb-1"
                      htmlFor={name}
                    >
                      {name
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                      :
                    </label>
                    <input
                      name={name}
                      type="text"
                      id={name}
                      required
                      className="border rounded-tr-xl px-3 py-2"
                      value={formData[name]}
                      onChange={handleInputChange}
                    />
                    {errors[name] && (
                      <p className="text-red-500 text-xs">{errors[name]}</p>
                    )}
                  </div>
                )
              )}
            </div>
            {errorMessage && (
              <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm mt-2">{successMessage}</p>
            )}

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-200 rounded-tr-xl hover:opacity-80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-400 text-black rounded-tl-xl hover:opacity-80 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Shipment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm text-center shadow-md">
            <p className="text-red-600 font-semibold">{apiError}</p>
            <button
              className="mt-4 bg-gray-200 px-4 py-2 rounded hover:opacity-80"
              onClick={() => setApiError("")}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm text-center shadow-md">
            <p className="text-green-700 font-semibold">
              Shipment created successfully!
            </p>
            <button
              className="mt-4 bg-blue-400 text-black px-4 py-2 rounded hover:opacity-80"
              onClick={() => setShowConfirm(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
