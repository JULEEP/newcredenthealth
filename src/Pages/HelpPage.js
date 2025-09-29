// HelpPage.js
import React, { useState, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import { MdSupportAgent } from "react-icons/md"; // ✅ Support agent icon
import Navbar from "./Navbar";

const HelpPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState(""); 
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <IoArrowBack
          size={24}
          className="cursor-pointer"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
            } else {
              window.history.back();
            }
          }}
        />
        <h1 className="text-lg font-semibold">Support</h1>
        {!showForm ? (
          <button className="px-3 py-1 border rounded-full text-sm">Help</button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex items-start justify-center px-5 py-6">
        {!showForm ? (
          // First Screen
          <div className="text-center w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
              <MdSupportAgent className="text-gray-500 mb-2" size={64} /> {/* ✅ Icon */}
              <p className="text-gray-500">No support tickets found</p>
              <p className="text-gray-400 text-sm">
                Create your first support ticket below
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md"
            >
              Raise A Ticket
            </button>
          </div>
        ) : (
          // Second Screen (Form)
          <div className="w-full max-w-md space-y-5">
            {/* Reason */}
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
              <label className="block mb-2 text-gray-700 font-medium">Reason</label>
              <select className="w-full bg-transparent outline-none text-gray-600">
                <option>Payment Issues</option>
                <option>Booking Issues</option>
                <option>Technical Issues</option>
                <option>Account Issue</option>
                <option>Consultation Issue</option>
                <option>App Bug</option>
                <option>Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
              <label className="block mb-2 text-gray-700 font-medium">
                Description *
              </label>
              <textarea
                placeholder="Describe your issue in detail..."
                className="w-full bg-transparent outline-none resize-none"
                rows={4}
              />
            </div>

            {/* Upload */}
            <div
              className="bg-purple-50 p-6 rounded-lg shadow-sm text-center cursor-pointer"
              onClick={handleFileClick}
            >
              <FiUploadCloud className="mx-auto mb-2 text-gray-400" size={28} />
              <p className="text-gray-400">
                {fileName ? fileName : "Tap to select file"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Submit */}
            <button
              disabled
              className="w-full py-3 bg-gray-200 text-gray-400 font-semibold rounded-md shadow-sm cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
