import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaWallet,
  FaQuestionCircle,
  FaUsers,
  FaCog,
  FaMapMarkerAlt,
  FaUserShield,
  FaTrash,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ProfilePage = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const staffId = localStorage.getItem("staffId"); // staffId from login

  const menuItems = [
    { icon: <FaWallet className="text-blue-500" />, label: "Wallet", path: "/wallet" },
    { icon: <FaQuestionCircle className="text-purple-500" />, label: "Help", path: "/help" },
    { icon: <FaUsers className="text-green-500" />, label: "Family Members", path: "/family" },
    // { icon: <FaCog className="text-gray-500" />, label: "Settings", path: "/settings" },
    { icon: <FaFileAlt className="text-orange-500" />, label: "Wellness Read", path: "/doctorblogs", },
    { icon: <FaMapMarkerAlt className="text-blue-400" />, label: "Address", path: "/address" },
    { icon: <FaUserShield className="text-green-400" />, label: "Privacy Policy", path: "https://credenthealth-policies.onrender.com/privacy-and-policy" }, // External link
    { icon: <FaTrash className="text-red-500" />, label: "Delete Account", path: "/delete-account" },
    { icon: <FaFileAlt className="text-blue-600" />, label: "Terms & Conditions", path: "https://credenthealth-policies.onrender.com/terms-and-conditions" },
    { icon: <FaBell className="text-purple-500" />, label: "Notifications", path: "/notification" },
  ];

  useEffect(() => {
    if (staffId) {
      axios
        .get(`https://api.credenthealth.com/api/staff/getprofile/${staffId}`)
        .then((res) => {
          setStaff(res.data.staff);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch profile");
          setLoading(false);
        });
    } else {
      setError("No staffId found");
      setLoading(false);
    }
  }, [staffId]);

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Navbar fixed top */}
      <Navbar />
      <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="relative flex items-center border-b p-4">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()} // or navigate(-1) if using react-router
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
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

            {/* Header */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800">
              Menu
            </h1>
          </div>


          {/* User Info */}
          <div className="p-6 border-b flex items-center space-x-4">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <img
                  src={`https://api.credenthealth.com${staff.profileImage}`}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h2 className="font-semibold text-gray-800">{staff.name}</h2>
                  <p className="text-gray-500 text-sm">{staff.email}</p>
                </div>
              </>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-3">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  // Check if the path is an external URL
                  if (item.path.startsWith("http")) {
                    window.open(item.path, "_blank");
                  } else {
                    navigate(item.path);
                  }
                }}
                className="flex items-center p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                  {item.icon}
                </div>
                <p className="text-gray-800 font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Logout Button (Always at bottom but visible) */}
          <div className="p-4">
            <button
              onClick={() => {
                localStorage.removeItem("staffId");
                navigate("/");
              }}
              className="w-full border border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 mb-12"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
