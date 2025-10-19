import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";

// BannerCarousel Component
const BannerCarousel = () => {
  const [banners, setBanners] = useState([]); // State to hold fetched banners

  // Fetch banners data from the API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("https://api.credenthealth.com/api/admin/getbanners");
        const data = await response.json();
        if (data && data.imageUrls) {
          // Format banner data
          const formattedBanners = data.imageUrls.map((banner) => ({
            image: `https://api.credenthealth.com/${banner.imageUrls[0]}`, // Using the first image as the main image
            title: "CREDENT HEALTH", // Updated title
            description: "Your trusted partner in healthcare, providing personalized care with cutting-edge medical technologies.", // Updated description
          }));
          setBanners(formattedBanners); // Set fetched banners to state
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners(); // Call the function to fetch banners
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      {/* Banner Carousel */}
      <Carousel
        interval={4000}
        controls={false}
        indicators={false}
        wrap={true}
        pause={false}
        className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]"
      >
        {banners.map((banner, index) => (
          <Carousel.Item key={index}>
            <div
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] bg-cover bg-center relative"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              {/* Text on left */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-6 md:pl-12 lg:pl-16">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 max-w-[90%] sm:max-w-sm md:max-w-md lg:max-w-lg">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {banner.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white mt-2">
                    {banner.description}
                  </p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
          </div>
  );
};

export default BannerCarousel;
