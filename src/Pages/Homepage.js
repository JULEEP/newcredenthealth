import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoriesPage from "./CategoriesPage";
import RecentActivityPage from "./RecentActivityPage";
import DoctorBlogsPage from "./DoctorBlogs";
import BannerCarousel from "./BannerCarousel"; // 👈 import new banner component

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white ">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="App Logo"
          className="w-24 h-24 animate-bounce mb-4"
        />

        {/* App/Website Name */}
        <h1 className="text-3xl font-bold text-gray-800">Credenthealth</h1>

        {/* Tagline */}
        <p className="mt-2 text-gray-500 animate-pulse">
          One Platform, Total Wellness
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md mb-20">
        <Navbar />
      </div>

      <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
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
    </div >

  );
};

export default HomePage;
