// MyBookings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const staffId = localStorage.getItem("staffId");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!staffId) {
      setError("Staff ID is missing. Please log in again.");
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [staffId]);

  // ✅ Fetch Bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.credenthealth.com/api/staff/mybookings/${staffId}`
      );
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      setError(
        "Error fetching bookings: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Booking fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cancel Booking
  const handleCancelBooking = async (booking) => {
    try {
      const response = await axios.put(
        `https://api.credenthealth.com/api/staff/cancel-booking/${staffId}/${booking.bookingId || booking._id}`,
        { status: "Cancelled" }
      );
      if (response.data.booking) {
        alert("Booking successfully cancelled.");
        fetchBookings();
        setSelectedBooking(null);
      } else {
        alert(response.data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Cancel Error:", error);
      alert("Error while cancelling booking.");
    }
  };

  // ✅ Fetch Slots for Reschedule
  const fetchAvailableSlots = async (doctorId, date, consultationType) => {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    try {
      const response = await axios.get(
        `https://api.credenthealth.com/api/staff/doctor-slots/${doctorId}?date=${date}&type=${consultationType}`
      );
      if (response.data.slots && response.data.slots.length > 0) {
        setAvailableSlots(response.data.slots);
      } else {
        setAvailableSlots([]);
        alert("No slots available for the selected date");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      alert("Error fetching available slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // ✅ Confirm Reschedule
  const confirmReschedule = async () => {
    if (!selectedBooking || !selectedDate || !selectedSlot) {
      alert("Please select a date and slot before confirming.");
      return;
    }

    try {
      const response = await axios.put(
        `https://api.credenthealth.com/api/staff/reschedulebooking/${staffId}/${selectedBooking.bookingId || selectedBooking._id}`,
        {
          newDay: new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          newDate: selectedDate,
          newTimeSlot: selectedSlot,
        }
      );

      if (response.data.isSuccessfull) {
        alert("Booking rescheduled successfully.");
        fetchBookings();
        setShowReschedule(false);
        setSelectedBooking(null);
      } else {
        alert(response.data.message || "Failed to reschedule booking.");
      }
    } catch (error) {
      console.error("Reschedule Error:", error);
      alert("Error while rescheduling booking.");
    }
  };

  /* 🔹 Helper function */
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ✅ UI Starts
  if (loading) {
    return (
      <div className="my-12 text-center text-lg">Loading your bookings...</div>
    );
  }

  if (error) {
    return (
      <div className="my-12 text-center text-lg text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchBookings}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => window.history.back()}
          className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">My bookings</h2>

        {bookings.length === 0 ? (
          <div className="text-center text-lg text-gray-500">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId || booking._id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-col mb-2">
                    <h3 className="font-bold text-gray-800">
                      {booking.type === "Online"
                        ? "Online Consultation"
                        : booking.type || "Consultation"}
                    </h3>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
                    ₹{booking.payableAmount || booking.totalPrice}
                  </span>
                </div>

                <p className="text-sm">
                  <span className="font-semibold">Booking ID:</span>{" "}
                  {booking.diagnosticBookingId || booking.doctorConsultationBookingId || booking.bookingId}
                </p>

                <p className="text-sm">
                  <span className="font-semibold">Date & Time:</span>{" "}
                  {formatDate(booking.date)} , {booking.timeSlot}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Payment:</span>{" "}
                  ₹{booking.payableAmount || booking.totalPrice}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="text-gray-600 text-sm underline"
                  >
                    Booking Details
                  </button>
                  <span 
                    className={`border px-3 py-1 rounded-full text-xs ${
                      booking.status === "Cancelled" 
                        ? "border-red-600 text-red-600" 
                        : "border-green-600 text-green-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {selectedBooking.type || "Online Consultation"}
            </h3>

            {/* Info */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Service Type</span>
                <span>{selectedBooking.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Booking ID</span>
                <span>
                  {selectedBooking.doctorConsultationBookingId ||
                    selectedBooking.bookingId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date & Time</span>
                <span>
                  {formatDate(selectedBooking.date)} -{" "}
                  {selectedBooking.timeSlot}
                </span>
              </div>
              {selectedBooking.patient && (
                <div className="flex justify-between">
                  <span className="font-semibold">Family Member</span>
                  <span>{selectedBooking.patient.name}</span>
                </div>
              )}
              {selectedBooking.doctor && (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold">Doctor Name</span>
                    <span>{selectedBooking.doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Qualification</span>
                    <span>{selectedBooking.doctor.qualification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Specialization</span>
                    <span>{selectedBooking.doctor.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Venue</span>
                    <span>{selectedBooking.doctor.address}</span>
                  </div>
                </>
              )}
            </div>

            {/* Buttons - Only show if booking is not cancelled */}
            <div className="mt-6 space-y-3">
              {selectedBooking.status !== "Cancelled" && (
                <>
                  <button
                    onClick={() => {
                      setShowReschedule(true);
                      setSelectedDate("");
                      setSelectedSlot("");
                      setAvailableSlots([]);
                    }}
                    className="w-full border border-green-600 text-green-600 py-2 rounded-md font-semibold"
                  >
                    Reschedule Booking
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full border border-red-600 text-red-600 py-2 rounded-md font-semibold"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Cancel Confirmation Popup */}
      {showCancelConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
            <h4 className="text-lg font-semibold mb-4">Cancel this booking?</h4>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleCancelBooking(selectedBooking);
                  setShowCancelConfirm(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Reschedule Modal */}
      {showReschedule && selectedBooking && (
        <div className="fixed inset-0 bg-gray-500/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 
                      max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Reschedule Booking</h3>

            {/* Current Booking */}
            <div className="bg-blue-100 p-3 rounded-md mb-4">
              <p className="text-sm font-semibold">Current Booking</p>
              <p className="text-blue-700 font-medium">
                {new Date(selectedBooking.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                - {selectedBooking.time}
              </p>
            </div>

            {/* Dates Row (7 days) */}
            <div className="flex space-x-2 overflow-x-auto mb-4">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(new Date(d));
                      fetchAvailableSlots(
                        selectedBooking.doctorId._id,
                        formatDate(d),
                        selectedBooking.type.toLowerCase()
                      );
                    }}
                    className={`flex flex-col items-center min-w-[50px] px-2 py-2 rounded-md ${
                      selectedDate instanceof Date &&
                      selectedDate.toDateString() === d.toDateString()
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-lg font-semibold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 gap-3">
              {availableSlots.length > 0 ? (
                availableSlots
                  .filter((slot) => !slot.isExpired)
                  .map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => !slot.isBooked && setSelectedSlot(slot.timeSlot)}
                      disabled={slot.isBooked}
                      className={`p-2 rounded-md text-sm transition-colors ${
                        slot.isBooked
                          ? "bg-red-500 text-white cursor-not-allowed"
                          : selectedSlot === slot.timeSlot
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {slot.timeSlot}
                    </button>
                  ))
              ) : (
                <p>No slots available for this date</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-6">
              {/* Cancel Left */}
              <button
                onClick={() => setShowReschedule(false)}
                className="px-3 py-1.5 rounded-full bg-gray-200 text-purple-600 text-sm font-medium"
              >
                Cancel
              </button>

              {/* Reschedule Right */}
              <button
                onClick={() => {
                  if (!selectedSlot) {
                    alert("Please select a time slot first!");
                    return;
                  }
                  const payload = {
                    date: formatDate(selectedDate),
                    type: selectedBooking.type.toLowerCase(),
                    timeSlot: selectedSlot,
                  };
                  confirmReschedule(payload);
                }}
                disabled={!selectedSlot}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedSlot
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;