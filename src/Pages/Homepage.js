import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoriesPage from "./CategoriesPage";
import RecentActivityPage from "./RecentActivityPage";
import DoctorBlogsPage from "./DoctorBlogs";
import BannerCarousel from "./BannerCarousel"; // 👈 import new banner component

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md mb-20">
        <Navbar />
      </div>

      <div className="pt-[90px] bg-gray-50 flex-1">
        {/* Banner */}
        <BannerCarousel />

        {/* Other Sections */}
        <CategoriesPage />
        <RecentActivityPage />
      </div>

      {/* Footer with flexbox to always stay at the bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
