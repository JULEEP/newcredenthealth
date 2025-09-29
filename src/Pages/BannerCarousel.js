import React from "react";
import { Carousel } from "react-bootstrap";

// Banner data: images + text
const banners = [
  {
    image:
      "https://st3.depositphotos.com/1500360/33756/i/450/depositphotos_337561066-stock-photo-medical-equipment-and-supplies-on.jpg",
    title: "Quality Medical Care",
    description:
      "Your health is our priority. Experience the best medical services with our expert team.",
  },
  {
    image:
      "https://st3.depositphotos.com/1500360/33756/i/450/depositphotos_337561066-stock-photo-medical-equipment-and-supplies-on.jpg",
    title: "Advanced Diagnostics",
    description:
      "State-of-the-art diagnostic tools to ensure accurate and timely results.",
  },
  {
    image:
      "https://st3.depositphotos.com/1500360/33756/i/450/depositphotos_337561066-stock-photo-medical-equipment-and-supplies-on.jpg",
    title: "Compassionate Care",
    description:
      "Our staff provides personalized care and attention to every patient.",
  },
];

const BannerCarousel = () => {
  return (
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
  );
};

export default BannerCarousel;
