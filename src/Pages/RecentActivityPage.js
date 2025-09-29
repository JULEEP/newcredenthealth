import React, { useState, useEffect } from "react";
import axios from "axios";

const RecentActivityPage = () => {
  const [doctorBooking, setDoctorBooking] = useState(null);
  const [packageBooking, setPackageBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const staffId = localStorage.getItem("staffId");

  const fetchDoctorBooking = async () => {
    try {
      const res = await axios.get(
        `https://api.credenthealth.com/api/staff/recent-doctor-booking/${staffId}`
      );
      setDoctorBooking(res.data.booking || null);
    } catch (err) {
      console.error("Doctor booking fetch error:", err);
    }
  };

  const fetchPackageBooking = async () => {
    try {
      const res = await axios.get(
        `https://api.credenthealth.com/api/staff/recent-package-booking/${staffId}`
      );
      setPackageBooking(res.data.package || null);
    } catch (err) {
      console.error("Package booking fetch error:", err);
    }
  };

  useEffect(() => {
    if (!staffId) {
      setError("Staff ID missing. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      await fetchDoctorBooking();
      await fetchPackageBooking();
      setLoading(false);
    };

    fetchData();
  }, [staffId]);

  return (
    <div className="bg-gray-50 py-8 px-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Activity
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Booking */}
          <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center gap-4">
            {doctorBooking ? (
              <>
                <img
                  src={`https://api.credenthealth.com${doctorBooking.doctorId.image}`}
                  alt="Doctor"
                  className="w-16 h-16 rounded-full object-cover border"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/64?text=No+Image")
                  }
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {doctorBooking.doctorId.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(doctorBooking.date).toLocaleDateString()} •{" "}
                    {doctorBooking.timeSlot}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No recent doctor booking.</p>
            )}
          </div>

          {/* Package Booking */}
          <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center gap-4">
            {packageBooking ? (
              <>
                <div>
                  <p className="font-medium text-gray-800">{packageBooking.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{packageBooking.price} • {packageBooking.totalTestsIncluded} tests
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No recent package booking.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivityPage;
