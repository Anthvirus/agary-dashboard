import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (adminId === "DemoAdmin1" && password === "Demo@pp1") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin");
    } else {
      setError("❌ Invalid admin ID or password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-1/4 bg-gray-100 p-8 rounded-tr-2xl shadow-md flex justify-center flex-col">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className=" text-red-400 p-2 rounded text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="adminId" className="block mb-1 text-sm font-medium text-black">
              Admin ID
            </label>
            <input
              type="text"
              id="adminId"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full px-4 py-2 border rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter Admin ID"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 hover:opacity-80 hover:scale-[101%] cursor-pointer bg-black text-white font-semibold rounded-br-lg transition duration-200"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
