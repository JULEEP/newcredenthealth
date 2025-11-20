import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 px-4">
      {/* Schema Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            "name": "Credent Health",
            "alternateName": "Credent Health by Elthium Healthcare Pvt Ltd",
            "url": "https://credenthealth.com",
            "logo": "https://credenthealth.com/logo.png",
            "description": "Credent Health - One Platform, Total Wellness. Comprehensive healthcare solutions and medical services.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "MSR NORTH TOWER, 16TH FLOOR, DR. PUNEETH RAJ KUMAR ROAD, MS RAMAIAH NORTH CITY, MANAYATA",
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "postalCode": "560045",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-7619196856",
              "email": "credenthealth@gmail.com",
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://www.facebook.com/credenthealth",
              "https://www.twitter.com/credenthealth",
              "https://www.instagram.com/credenthealth",
              "https://www.linkedin.com/company/credenthealth"
            ]
          })
        }}
      />
      
      <div className="container">
        <div className="row gy-4">
          {/* About - Improved with better text */}
          <div className="col-12 col-lg-4">
            <h3 className="d-flex align-items-center mb-3">
              <img
                src="/logo.png"
                alt="Credent Health Logo - Healthcare Solutions"
                className="img-fluid me-2"
                style={{ width: "50px", height: "50px" }}
              />
              Credent Health
            </h3>
            <p className="mb-3">
              <strong>Credent Health by Elthium Healthcare Pvt Ltd</strong> - 
              Your trusted partner for comprehensive healthcare solutions. 
              One Platform, Total Wellness - Offering medical services, 
              health management, and patient care services.
            </p>
            {/* Social Links */}
            <div className="d-flex gap-3 mt-3">
              <a 
                href="https://www.facebook.com/credenthealth" 
                className="text-light"
                aria-label="Follow Credent Health on Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="https://www.twitter.com/credenthealth" 
                className="text-light"
                aria-label="Follow Credent Health on Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://www.instagram.com/credenthealth" 
                className="text-light"
                aria-label="Follow Credent Health on Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/credenthealth" 
                className="text-light"
                aria-label="Follow Credent Health on LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4 col-lg-2">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/home" className="text-light text-decoration-none" title="Credent Health Home">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/profile" className="text-light text-decoration-none" title="Credent Health Profile">
                  Profile
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/medicalrecord"
                  className="text-light text-decoration-none"
                  title="Credent Health Medical Records"
                >
                  Medical Records
                </a>
              </li>
              <li className="mb-2">
                <a href="/family" className="text-light text-decoration-none" title="Credent Health Family Members">
                  Family Members
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="col-6 col-md-4 col-lg-3">
            <h5 className="mb-3">Healthcare Features</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="/mybookings"
                  className="text-light text-decoration-none"
                  title="Credent Health Bookings"
                >
                  My Bookings
                </a>
              </li>
              <li className="mb-2">
                <a href="/cart" className="text-light text-decoration-none" title="Credent Health Cart">
                  My Cart
                </a>
              </li>
              <li className="mb-2">
                <a href="/wallet" className="text-light text-decoration-none" title="Credent Health Wallet">
                  Wallet
                </a>
              </li>
              <li className="mb-2">
                <a href="/chat" className="text-light text-decoration-none" title="Credent Health Chat">
                  Chats
                </a>
              </li>
              <li className="mb-2">
                <a href="/help" className="text-light text-decoration-none" title="Credent Health Help">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-4 col-lg-3">
            <h5 className="mb-3">Contact Credent Health</h5>
            <ul className="list-unstyled">
              <li className="d-flex align-items-start mb-2">
                <FaMapMarkerAlt className="me-2 mt-1 flex-shrink-0" /> 
                <span>
                  ELTHIUM HEALTHCARE PVT LTD, MSR NORTH TOWER, 16TH FLOOR, 
                  DR. PUNEETH RAJ KUMAR ROAD, MS RAMAIAH NORTH CITY, 
                  MANAYATA, 560045 BENGALURU, KARNATAKA, INDIA
                </span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <FaPhone className="me-2 flex-shrink-0" /> 
                <a href="tel:+917619196856" className="text-light text-decoration-none">
                  +91 7619196856
                </a>
              </li>
              <li className="d-flex align-items-center">
                <FaEnvelope className="me-2 flex-shrink-0" /> 
                <a href="mailto:credenthealth@gmail.com" className="text-light text-decoration-none">
                  credenthealth@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="mt-5 mb-4 border-secondary" />

        {/* Bottom Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0 text-center text-md-start">
            &copy; 2025 <strong>Credent Health</strong> - Healthcare Solutions & Medical Services. All rights reserved.
          </p>

          {/* Privacy & Terms Links */}
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <a 
              href="/privacyandpolicy" 
              className="text-light text-decoration-none"
              title="Credent Health Privacy Policy"
            >
              Privacy Policy
            </a>
            <a
              href="/termsandconditions"
              className="text-light text-decoration-none"
              title="Credent Health Terms & Conditions"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;