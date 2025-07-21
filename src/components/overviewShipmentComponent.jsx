import { useEffect, useState } from "react";
import AgaryLogo from "../assets/Agary_logo.png"
import axios from "axios";

const baseURL = "https://nacon-v2.onrender.com";

export default function OverviewShipmentComponent() {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchShipments() {
      try {
        const res = await axios.get(
          `${baseURL}/v2/shipments`
        );
        setShipments(res.data);
        setFilteredShipments(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shipments:", err);
        if(shipments.length == 0){
        setError("Failed to load shipments.");}
        setLoading(false);
      }
    }

    fetchShipments();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = shipments.filter((shipment) => {
      const containerList = Array.isArray(shipment.containerNo)
        ? shipment.containerNo
        : [shipment.containerNo];

      return containerList.some((no) => no.toLowerCase().includes(term));
    });

    setFilteredShipments(filtered);
  }, [searchTerm, shipments]);

  return (
    <div className="p-4 h-full flex flex-col gap-8">
      <div className="flex gap-6 items-center justify-around bg-gray-100 rounded-bl-2xl shadow-xl">
        <img src={AgaryLogo} className="w-32 rounded-full" />
        <h2 className="text-4xl uppercase font-bold my-8">
          Incoming Shipments View.
        </h2>
        <input
          type="text"
          placeholder="Search by Container No."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[45rem] min-w-[40rem] px-4 py-2 border rounded-bl-2xl shadow-sm"
        />
      </div>

      <div className="bg-gray-100 rounded-tl-2xl shadow-xl h-[42.5rem] flex justify-center items-start">
        {loading ? (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-t-blue-400 border-white rounded-full animate-spin"></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-2xl font-extrabold flex justify-center items-center w-full h-full bg-red-100 text-center">{error} Please Check Internet Connection</div>
        ) : (
          <div className="rounded-tl-2xl max-h-full overflow-y-auto w-full">
            <table className=" border-2 min-w-full text-left flex flex-col">
              <thead className=" bg-gray-900 text-white uppercase tracking-wider text-center text-md font-semibold sticky top-0 z-10">
                <tr className="grid grid-cols-9 min-w-full pt-1 items-center">
                  <th className="px-4 py-3">Container No.</th>
                  <th className="px-4 py-3">Name Of Product</th>
                  <th className="px-4 py-3">Shipping Line</th>
                  <th className="px-4 py-3">Port Of Loading</th>
                  <th className="px-4 py-3">Port Of Discharge</th>
                  <th className="px-4 py-3">Vessel</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">ETA</th>
                  <th className="px-4 py-3">PAAR</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filteredShipments.map((shipment, idx) => (
                  <tr
                    key={idx}
                    className="grid grid-cols-9 min-w-full items-center text-center bg-gray-100 hover:text-white text-md font-bold hover:bg-black hover:opacity-90 transition-all delay-200 min-h-[6.25rem]"
                  >
                    <td className="px-4 py-3 underline align-top text-md">
                      <code className="bg-[var(--NavBackgroundTwo)] p-2 rounded-tr-md whitespace-pre-line block border">
                        {Array.isArray(shipment.containerNo)
                          ? shipment.containerNo.map((num, i) => (
                              <div key={i}>{num}</div>
                            ))
                          : "-"}
                      </code>
                    </td>
                    <td className="px-4 py-3">{shipment.nameOfProducts || "-"}</td>
                    <td className="px-4 py-3">
                      {shipment.shippingLine || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {shipment.portOfLoading || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {shipment.portOfDischarge || "-"}
                    </td>
                    <td className="px-4 py-3">{shipment.vessel || "-"}</td>
                    <td className="px-4 py-3">{shipment.status || "-"}</td>
                    <td className="px-4 py-3">{shipment.ETA || "-"}</td>
                    <td className="px-4 py-3">{shipment.paar || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
