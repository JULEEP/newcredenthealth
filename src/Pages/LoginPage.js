import React, { useState } from "react";
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
        navigate("/home");
      }
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row shadow-lg rounded-5 w-75" style={{ minHeight: "60vh" }}>
        {/* Left Image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/logo.png"
            alt="Login Illustration"
            className="img-fluid h-100 w-100 p-5"
            style={{ objectFit: "cover", borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem" }}
          />
        </div>

        {/* Right Form */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white p-4 rounded-end">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center mb-4 fs-3" style={{ fontWeight: 900 }}>Login</h1>


            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
