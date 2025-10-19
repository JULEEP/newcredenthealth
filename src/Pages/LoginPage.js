import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api.credenthealth.com/api/staff/login-staff",
        { email, password }
      );

      if (response.status === 200) {
        const { staff } = response.data;
        const { _id, name } = staff;
        localStorage.setItem("staffId", _id);
        localStorage.setItem("name", name);
        sessionStorage.setItem("staff", JSON.stringify(staff));
        navigate("/home");
      }
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row shadow-lg rounded-2xl w-full max-w-4xl bg-white overflow-hidden">

        {/* Left Image (desktop) */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/logo.png"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
          
          {/* Logo for mobile */}
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20 h-20 mb-6 md:hidden object-contain"
          />

          <div className="w-full max-w-md">
            <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-6">Login</h1>

            {error && (
              <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;