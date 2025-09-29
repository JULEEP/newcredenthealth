import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaPlus } from "react-icons/fa";

const ScanAndXRayPage = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null); // For Show More toggle
  const navigate = useNavigate();

  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get(
          "https://api.credenthealth.com/api/admin/getallxrays"
        );
        if (response.data && response.data.length > 0) {
          setScans(response.data);
        } else {
          setError("No scans available");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  // Add ALL scans to cart
  const addAllToCart = async () => {
    if (!staffId) {
      alert("Staff ID not found in localStorage!");
      return;
    }

    try {
      for (let scan of scans) {
        await axios.post(
          `https://api.credenthealth.com/api/staff/addcart/${staffId}`,
          {
            itemId: scan._id,
            action: "inc",
          }
        );
      }
      alert("All items added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      console.error("❌ Error adding all to cart:", err);
      alert("Error adding all items to cart");
    }
  };

  // Add SINGLE scan to cart
  const addSingleToCart = async (scan) => {
    if (!staffId) {
      alert("Staff ID not found in localStorage!");
      return;
    }

    try {
      await axios.post(
        `https://api.credenthealth.com/api/staff/addcart/${staffId}`,
        {
          itemId: scan._id,
          action: "inc",
        }
      );
      alert(`${scan.title} added to cart!`);
    } catch (err) {
      console.error("❌ Error adding single item to cart:", err);
      alert("Error adding item to cart");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />

      <div className="py-4 px-4 sm:px-6 lg:px-8">

             <button
      onClick={() => window.history.back()} // ya navigate(-1) use kar sakte ho agar react-router use ho raha hai
      className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
    </button>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search X-rays..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <h2 className="font-semibold text-lg mb-4">
          Popular Scans & X-ray's
        </h2>

        {loading && (
          <p className="text-center text-lg text-gray-600">Loading scans...</p>
        )}
        {error && <p className="text-center text-lg text-red-500">{error}</p>}

        <div className="space-y-4">
          {scans.map((scan, index) => (
            <div
              key={scan._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col"
            >
              <div className="flex justify-between items-start">
                {/* Left side */}
                <div className="flex items-center">
                  <img
                    src={`https://api.credenthealth.com${scan.image}`}
                    alt={scan.title}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h2 className="font-semibold">{scan.title}</h2>
                    <p className="text-sm text-gray-500">
                      Report in: {scan.reportTime || "24"} hrs
                    </p>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end">
                  <p className="font-bold">₹ {scan.price}</p>
                  <p className="text-xs text-gray-500">Onwards</p>

                  {/* Buttons */}
                  <div className="flex items-center mt-2">
                    <button
                      onClick={addAllToCart}
                      className="bg-[#2E67F6] text-white px-4 py-1 rounded-md text-sm mr-2"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => addSingleToCart(scan)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>

              {/* Show More toggle */}
              <div className="mt-3">
                {expanded === index && (
                  <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-600">
                    {scan.preparation || "No extra preparation required."}
                  </div>
                )}
                <button
                  className="text-sm text-blue-600 mt-2"
                  onClick={() =>
                    setExpanded(expanded === index ? null : index)
                  }
                >
                  {expanded === index ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanAndXRayPage;
