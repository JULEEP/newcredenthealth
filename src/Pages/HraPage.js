// HraPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // back arrow icon
import axios from "axios";
import Navbar from "./Navbar";

const HraPage = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [hraData, setHraData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendMessage, setBackendMessage] = useState("");

  const BASE_URL = "https://api.credenthealth.com";
  const staffId = localStorage.getItem("staffId");
  const navigate = useNavigate();

  useEffect(() => {
    if (staffId) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/api/staff/allhracat/${staffId}`)
        .then((response) => {
          if (response.data.message) {
            setBackendMessage(response.data.message);
          }
          if (response.data.hras && response.data.hras.length > 0) {
            setHraData(response.data.hras);
          } else {
            setHraData([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching HRA data");
          setLoading(false);
        });
    } else {
      setError("Staff ID not found.");
      setLoading(false);
    }
  }, [staffId]);

  const handleStart = () => {
    setShowMessage(false);
  };

  const handleBack = () => {
    if (!showMessage) {
      setShowMessage(true); // go back to intro page
    } else {
      navigate(-1); // go back in history
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/hra-questions?category=${categoryName}`);
  };

  return (
  <div className="bg-white min-h-screen flex flex-col pb-20">
    {/* Navbar */}
    <Navbar />

    {/* Content Wrapper with padding-top */}
    <div className="flex-1 pt-16 px-5 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center mb-4">
        <IoArrowBack
          size={24}
          className="cursor-pointer"
          onClick={handleBack}
        />
        <h1 className="flex-1 text-center text-lg font-semibold">HRA</h1>
        <div className="w-6" /> {/* spacer to balance layout */}
      </div>

      {showMessage ? (
        <div className="max-w-md mx-auto">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-4">
            Know Your <span className="text-blue-600">Health</span> Risk
          </h2>

          {/* What's This */}
          <h3 className="text-lg font-semibold mb-1">What's This?</h3>
          <p className="text-gray-700 mb-4">
            A quick, evidence-based questionnaire that spots potential health
            risks and gives you an instant overview of your current health risk.
            <br />
            <br />
            These questions guide you to wellness, not fear.
          </p>

          {/* Why Take It */}
          <h3 className="text-lg font-semibold mb-1">Why Take It?</h3>
          <ul className="list-disc pl-5 text-gray-700 mb-4">
            <li>Insight in 5 minutes - snapshot of your current health risk.</li>
            <li>Preventive focus - catch early warning signs before they develop.</li>
            <li>Actionable tips - simple next steps you can start today.</li>
          </ul>

          {/* Note */}
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-semibold">Note:</span> This is not a medical
            diagnosis and is for education purposes. Your answers stay private
            and will be used for analysis to get you a score.
          </p>

          {/* Backend message */}
          {backendMessage && (
            <p className="text-green-500 text-center font-semibold mb-4">
              {backendMessage}
            </p>
          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-3 bg-blue-100 text-blue-600 font-semibold rounded-md mb-10"
          >
            Let&apos;s Start
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : hraData.length > 0 ? (
            hraData.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-3 border rounded-md cursor-pointer"
                onClick={() => handleCategoryClick(item.hraName)}
              >
                <img
                  src={BASE_URL + item.hraImage}
                  alt={item.hraName}
                  className="w-12 h-12 object-cover rounded mr-3"
                />
                <p className="text-base font-semibold">{item.hraName}</p>
              </div>
            ))
          ) : (
            <p>No health risk data available.</p>
          )}
        </div>
      )}
    </div>
  </div>
);

};

export default HraPage;
