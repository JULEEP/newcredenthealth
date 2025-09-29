import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 px-4">
      <div className="container">

        <div className="row gy-4">

          {/* About */}
          <div className="col-12 col-lg-4">
            <h3 className="d-flex align-items-center mb-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="img-fluid me-2"
                style={{ width: '50px', height: '50px' }}
              />
              Credenhealth
            </h3>
            <p className="mb-3">Your complete healthcare solution for consultations, diagnostics, and health management.</p>
            
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4 col-lg-2">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/home" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/profile" className="text-light text-decoration-none">Profile</a></li>
              <li><a href="/medicalrecord" className="text-light text-decoration-none">Medical Records</a></li>
              <li><a href="/family" className="text-light text-decoration-none">Family Members</a></li>
            </ul>
          </div>

          {/* Features */}
          <div className="col-6 col-md-4 col-lg-3">
            <h5 className="mb-3">Features</h5>
            <ul className="list-unstyled">
              <li><a href="/mybookings" className="text-light text-decoration-none">My Bookings</a></li>
              <li><a href="/cart" className="text-light text-decoration-none">My Cart</a></li>
              <li><a href="/wallet" className="text-light text-decoration-none">Wallet</a></li>
              <li><a href="/chat" className="text-light text-decoration-none">Chats</a></li>
              <li><a href="/help" className="text-light text-decoration-none">Help</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-4 col-lg-3">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center mb-2">
                <FaMapMarkerAlt className="me-2" /> GROUND FLOOR BEECH E-1, MANYATA EMBASSY BUSINESS, Venkateshapura, Bangalore North, Bangalore- 560045,
                Karnataka
              </li>
              <li className="d-flex align-items-center mb-2">
                <FaPhone className="me-2" /> +91 7619196856
              </li>
              <li className="d-flex align-items-center">
                <FaEnvelope className="me-2" /> credenthealth@gmail.com
              </li>
            </ul>
          </div>

        </div>

        <hr className="mt-5 mb-4 border-secondary" />

        <div className="text-center mt-3">
          <p className="mb-0">&copy; 2025 Credenhealth. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;