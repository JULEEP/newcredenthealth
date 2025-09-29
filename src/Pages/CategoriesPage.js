import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Doctor Consultation", image: "/category/doc.png" },
  { name: "Lab Test & Packages", image: "/category/lab.png" },
  { name: "HRA", image: "/category/hra.png" },
  { name: "Eye Care", image: "/category/eyecare.png" },
  { name: "Dental Care", image: "/category/dentalcare.png" },
  { name: "Medicines", image: "/category/medicines.png" },
];

const CategoriesPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    if (categoryName === "Doctor Consultation") {
      setSelectedCategory(categoryName);
      setShowPopup(true);
    } else if (categoryName === "Lab Test & Packages") {
      navigate("/lab-category");
    } else if (categoryName === "HRA") {
      navigate("/hra-category");
    } else if (
      categoryName === "Eye Care" ||
      categoryName === "Dental Care" ||
      categoryName === "Medicines"
    ) {
      setShowComingSoon(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setShowComingSoon(false);
  };

const handleNavigateToDoctorCategory = (type) => {
  // type => visit-clinic OR virtual-consultation
  const consultationType = type === "visit-clinic" ? "Offline" : "Online";

  navigate(`/doctor-category/${selectedCategory}/${type}`, {
    state: { consultationType },  // ✅ yahan bhej diya
  });

  setShowPopup(false);
};

  return (
    <div className="px-4 py-6">
      {/* Categories Grid - simple & compact */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-12 h-12 object-contain mb-2"
            />
            <p className="text-sm font-medium text-gray-700 text-center">
              {category.name}
            </p>
          </div>
        ))}
      </div>

      {/* Doctor Consultation Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={handlePopupClose}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Choose Consultation Type
            </h3>

            <div className="space-y-3">
              {/* Visit Clinic */}
              <div
                onClick={() => handleNavigateToDoctorCategory("visit-clinic")}
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <img
                    src="/images/clinic.png"
                    alt="Visit Clinic"
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">Visit Clinic</h4>
                    <p className="text-xs text-gray-600">
                      Meet the doctor in person at the clinic.
                    </p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-500"></i>
              </div>

              {/* Virtual Consultation */}
              <div
                onClick={() =>
                  handleNavigateToDoctorCategory("virtual-consultation")
                }
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <img
                    src="/images/virtual.png"
                    alt="Virtual Consultation"
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Virtual Consultation
                    </h4>
                    <p className="text-xs text-gray-600">
                      Consult online from your home.
                    </p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-500"></i>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handlePopupClose}
                className="text-blue-500 font-semibold hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Popup */}
      {showComingSoon && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handlePopupClose}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="https://i.gifer.com/TweA.gif"
              alt="Coming Soon"
              className="w-32 h-32 object-contain mb-4"
            />
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Coming Soon
            </h3>
            <p className="text-sm text-gray-600 text-center">
              This feature will be available soon. Stay tuned!
            </p>
            <button
              onClick={handlePopupClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
