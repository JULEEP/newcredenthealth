import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoHomeOutline,
  IoPersonOutline,
  IoWalletOutline,
  IoCartOutline,
  IoMenuOutline,
  IoAddOutline,
} from "react-icons/io5";
import { CiChat1 } from "react-icons/ci";
import axios from "axios";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [cartCount, setCartCount] = useState(0); // ✅ Cart count state
  const navigate = useNavigate();

  const staffId = localStorage.getItem("staffId");

  // ✅ Fetch Wallet Balance
  useEffect(() => {
    if (staffId) {
      axios
        .get(`https://api.credenthealth.com/api/staff/wallet/${staffId}`)
        .then((response) => {
          setWalletBalance(response.data.wallet_balance);
        })
        .catch((error) => {
          console.error("Error fetching wallet data:", error);
        });
    }
  }, [staffId]);

  // ✅ Fetch Cart Count
  useEffect(() => {
    if (staffId) {
      axios
        .get(`https://api.credenthealth.com/api/staff/mycart/${staffId}`)
        .then((response) => {
          if (response.data && response.data.items) {
            setCartCount(response.data.items.length); // ✅ items ki length set karo
          }
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  }, [staffId]);

  // ✅ Reusable Icon Wrapper
  const IconWrapper = ({ children }) => (
    <div className="bg-white shadow-md rounded-full p-2 flex items-center justify-center relative">
      {children}
    </div>
  );

  return (
    <>
      {/* ✅ Top Navbar */}
      <header className="bg-white py-3 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 h-16">
          {/* Logo */}
       <div className="flex items-center gap-2">
  <Link to="/home" className="flex items-center gap-2 no-underline">
    <img
      src="/logo.png"
      alt="Logo"
      className="w-12 h-12 object-contain"
    />
    <h3 className="font-bold text-xl text-gray-900">Credenthealth</h3>
  </Link>
</div>


          {/* ✅ Right side */}
          <div className="flex items-center gap-6">
            {/* Desktop Nav */}
            <div className="hidden lg:flex gap-6 text-gray-700 text-sm font-medium">
              <button onClick={() => navigate("/home")} className="flex items-center gap-1">
                <IoHomeOutline size={20} /> Home
              </button>
              <button onClick={() => navigate("/mybookings")} className="flex items-center gap-1">
                <IoMenuOutline size={20} /> Bookings
              </button>
              <button onClick={() => navigate("/medicalrecord")} className="flex items-center gap-1">
                <IoAddOutline size={20} /> MedicalRecords
              </button>
              <button onClick={() => navigate("/chat")} className="flex items-center gap-1">
                <CiChat1 size={20} /> Chat
              </button>
              <button onClick={() => navigate("/profile")} className="flex items-center gap-1">
                <IoPersonOutline size={20} /> Profile
              </button>
            </div>

            {/* Wallet */}
           {walletBalance !== null && (
        <div
          onClick={() => navigate('/wallet')}
          className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition"
          title="Go to Wallet"
        >
          <IoWalletOutline size={20} />
          <span className="text-sm font-medium">₹{walletBalance}</span>
        </div>
      )}

            {/* Cart with Badge */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center text-gray-800 hover:text-gray-600"
            >
              <IoCartOutline size={26} />

              {/* 🔴 Always show badge, even if cartCount = 0 */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>

              <span className="hidden md:inline ml-1">Cart</span>
            </button>

          </div>
        </div>
      </header>

      {/* ✅ Bottom Navigation (Mobile only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t z-50">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <button onClick={() => navigate("/home")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoHomeOutline size={22} />
            </IconWrapper>
            Home
          </button>

          {/* Bookings */}
          <button onClick={() => navigate("/mybookings")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoMenuOutline size={22} />
            </IconWrapper>
            Bookings
          </button>

          {/* Records */}
          <button onClick={() => navigate("/medicalrecord")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoAddOutline size={22} />
            </IconWrapper>
            MedicalRecords
          </button>

          {/* Chats */}
          <button onClick={() => navigate("/chat")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <CiChat1 size={22} />
            </IconWrapper>
            Chat
          </button>

          {/* Profile */}
          <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-gray-700 text-xs">
            <IconWrapper>
              <IoPersonOutline size={22} />
            </IconWrapper>
            Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
