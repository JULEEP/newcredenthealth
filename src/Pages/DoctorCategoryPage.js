import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DoctorCategoryPage = () => {
  const { category, type } = useParams();
  const [doctorCategoryData, setDoctorCategoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [specialCategoryData, setSpecialCategoryData] = useState([]);
  const [selectedSpecialCategories, setSelectedSpecialCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ DEBUG: Check what parameters we're receiving
  useEffect(() => {
    console.log("📍 DoctorCategoryPage Debug:");
    console.log("Category from URL:", category);
    console.log("Type from URL:", type);
    console.log("Full URL:", window.location.href);
  }, [category, type]);

  // Background color options for categories
  const bgColors = [
    "bg-blue-100",
    "bg-red-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-purple-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-green-100",
  ];

  // Fetch doctor category data
  useEffect(() => {
    axios
      .get("https://api.credenthealth.com/api/admin/getallcategory")
      .then((response) => {
        setDoctorCategoryData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctor categories:", error);
        setLoading(false);
      });
  }, [category, type]);

  // Fetch special category data
  useEffect(() => {
    axios
      .get("https://api.credenthealth.com/api/admin/getspecialcategory")
      .then((response) => {
        setSpecialCategoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching special categories:", error);
      });
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      setFilteredData(doctorCategoryData);
    } else {
      const filtered = doctorCategoryData.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSpecialCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSpecialCategories((prev) =>
      prev.includes(selectedValue)
        ? prev.filter((item) => item !== selectedValue)
        : [...prev, selectedValue]
    );
  };

  const handleBack = () => {
    navigate("/home");
  };

  // ✅ FIXED: Special categories navigate with consultationType
  const handleSubmit = () => {
    if (selectedSpecialCategories.length === 0) {
      alert("Please select at least one special category.");
    } else {
      const selectedCategoriesString = selectedSpecialCategories.join(",");
      
      console.log("📍 Navigating to DoctorList with:", {
        categories: selectedCategoriesString,
        consultationType: type
      });
      
      navigate(`/doctor-list/${selectedCategoriesString}`, {
        state: { 
          consultationType: type,
          fromCategoryPage: true 
        }
      });
    }
  };

  // ✅ FIXED: Normal category navigate with consultationType
  const handleCategoryClick = (categoryName) => {
    console.log("📍 Navigating to DoctorList with:", {
      category: categoryName,
      consultationType: type
    });
    
    navigate(`/doctor-list/${categoryName}`, {
      state: { 
        consultationType: type,
        fromCategoryPage: true 
      }
    });
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          {/* ✅ DISPLAY CURRENT CONSULTATION TYPE */}
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
              Consultation Type: {type || "Not Specified"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Book {type === 'Offline' ? 'Clinic Visit' : 'Virtual Consultation'}
          </h1>

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search doctor category..."
              className="w-full sm:w-96 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Display doctor category data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredData.map((item, index) => {
              const bgColor = bgColors[index % bgColors.length];
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                  onClick={() => handleCategoryClick(item.name)}
                >
                  <div className={`${bgColor} p-6 flex justify-center items-center`}>
                    <img
                      src={`https://api.credenthealth.com${item.image}`}
                      alt={item.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div className={`${bgColor} p-4 text-center`}>
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{type} Consultation</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Special Categories Section */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">
              Didn't Find your Issue?
            </h2>
            <p className="text-muted mb-3">Please Be more Specific</p>
            <div className="space-y-4">
              {specialCategoryData.map((specialCategory, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    value={specialCategory.name}
                    onChange={handleSpecialCategoryChange}
                    className="mr-2"
                  />
                  <label className="text-lg text-gray-800">
                    {specialCategory.name}
                  </label>
                </div>
              ))}
            </div>

            {selectedSpecialCategories.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleSubmit}
                  className="p-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                >
                  Find Doctors ({type} Consultation)
                </button>
              </div>
            )}
          </div>

          {/* Debug Button */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => console.log({
                currentType: type,
                currentCategory: category,
                url: window.location.href
              })}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Debug Info
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorCategoryPage;