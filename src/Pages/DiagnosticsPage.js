import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { X, Check, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiagnosticsPage = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    addressType: "Home"
  });

  const staff = JSON.parse(sessionStorage.getItem("staff"));

  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();

  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(`${staff._id}`);
  const [availableDates, setAvailableDates] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState("");



  // In DiagnosticsPage component, add these states and effects
  const [isPackageBooking, setIsPackageBooking] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [newFamilyMember, setNewFamilyMember] = useState({
    fullName: "",
    mobileNumber: "",
    age: "",
    gender: "",
    DOB: "",
    height: "",
    weight: "",
    relation: "",
    eyeSight: "",
    BP: "",
    BMI: ""
  });
  const [showFamilyForm, setShowFamilyForm] = useState(false);

  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    // Fetch diagnostics centers
    axios
      .get("https://api.credenthealth.com/api/admin/alldiagnostics")
      .then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          setDiagnostics(response.data.data);
        } else {
          setDiagnostics([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching diagnostics");
        setLoading(false);
      });

    // Fetch wallet data
    if (staffId) {
      fetchWalletData();
    }

    // Fetch family members of the staff
    if (staffId) {
      fetchFamilyMembers();
    }
  }, [staffId]);


  // Fetch family members
  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get(`https://api.credenthealth.com/api/staff/getallfamily/${staffId}`);
      setFamilyMembers(response.data.family_members || []);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`https://api.credenthealth.com/api/staff/getaddresses/${staffId}`);
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Fetch available slots for a diagnostic center
  const fetchSlots = async (diagnosticId, date, type) => {
    setSlotLoading(true);
    setSlotError("");
    try {
      const response = await axios.get(
        `https://api.credenthealth.com/api/staff/diagnosticslots/${diagnosticId}?date=${date}&type=${type}`
      );

      if (response.data.slots && response.data.slots.length > 0) {
        setAvailableSlots(response.data.slots);
      } else {
        setAvailableSlots([]);
        setSlotError("No slots available for the selected date");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlotError("Error fetching available slots");
      setAvailableSlots([]);
    } finally {
      setSlotLoading(false);
    }
  };

  // Handle popup close
  const handlePopupClose = () => {
    setShowServiceModal(false);
    setShowBookingModal(false);
    setSelectedDiagnostic(null);
    setSelectedOption("");
    setAvailableSlots([]);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedAddress("");
    setSelectedFamilyMember("");
    setAvailableDates([]);
    setSlotError("");
  };

  // Handle Diagnostic Center selection - Show Service Type Modal
  const handleDiagnosticClick = async (diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setShowServiceModal(true);
  };

  // Handle Service Type Selection - Show Booking Modal
  const handleServiceSelect = async (option) => {
    setSelectedOption(option);

    // Fetch addresses when service type is selected
    await fetchAddresses();

    // Extract unique dates from both slot types
    const homeDates = selectedDiagnostic.homeCollectionSlots
      .filter(slot => !slot.isBooked)
      .map(slot => slot.date);

    const centerDates = selectedDiagnostic.centerVisitSlots
      .filter(slot => !slot.isBooked)
      .map(slot => slot.date);

    // Combine and get unique dates
    const allDates = [...new Set([...homeDates, ...centerDates])].sort();
    setAvailableDates(allDates);

    // Close service modal and open booking modal
    setShowServiceModal(false);
    setShowBookingModal(true);
  };

  // Handle Date Selection
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setAvailableSlots([]);

    if (selectedOption) {
      await fetchSlots(selectedDiagnostic._id, date, selectedOption);
    }
  };

  // Handle Time Selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle address form input change
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new family member form change
  const handleFamilyInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create new address
  const handleCreateAddress = async () => {
    try {
      const response = await axios.post(
        `https://api.credenthealth.com/api/staff/create-address/${staffId}`,
        newAddress
      );

      if (response.data.success) {
        // Refresh addresses list
        await fetchAddresses();
        setShowAddressForm(false);
        setNewAddress({
          street: "",
          city: "",
          state: "",
          country: "India",
          postalCode: "",
          addressType: "Home"
        });
      }
    } catch (error) {
      console.error("Error creating address:", error);
    }
  };

  // Handle adding new family member
  const handleAddFamilyMember = async () => {
    if (!staffId) return;
    try {
      const response = await axios.post(
        `https://api.credenthealth.com/api/staff/create-family/${staffId}`,
        newFamilyMember
      );

      alert("Family member added successfully");
      await fetchFamilyMembers();
      setNewFamilyMember({
        fullName: "",
        mobileNumber: "",
        age: "",
        gender: "",
        DOB: "",
        height: "",
        weight: "",
        relation: "",
        eyeSight: "",
        BP: "",
        BMI: ""
      });
      setShowFamilyForm(false);
    } catch (error) {
      console.error("Error adding family member:", error);
      alert("Error adding family member");
    }
  };

  // Handle family member selection
  const handleFamilyMemberSelect = (familyMemberId) => {
    setSelectedFamilyMember(familyMemberId);
  };

  // Check if booking button should be disabled
  const isBookingDisabled = () => {
    if (!selectedOption || !selectedFamilyMember) return true;

    if (selectedOption === "Home Collection") {
      return !selectedAddress || !selectedDate || !selectedTime;
    } else if (selectedOption === "Center Visit") {
      return !selectedDate || !selectedTime;
    }

    return true;
  };

  // ✅ Fetch Wallet Data
  const fetchWalletData = async () => {
    try {
      const response = await axios.get(
        `https://api.credenthealth.com/api/staff/wallet/${staffId}`
      );
      console.log("Wallet Data Response:", response.data);

      // Debug: show raw API response

      setWalletData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      return null;
    }
  };


  useEffect(() => {
    // Check if we're coming from package booking
    const packageId = localStorage.getItem('packageId');
    const packageName = localStorage.getItem('packageName');
    const packagePrice = localStorage.getItem('packagePrice');

    if (packageId && packageName && packagePrice) {
      setIsPackageBooking(true);
      setPackageData({
        packageId,
        packageName,
        price: parseInt(packagePrice)
      });

      // Clear the stored data
      localStorage.removeItem('packageId');
      localStorage.removeItem('packageName');
      localStorage.removeItem('packagePrice');
    }
  }, []);



  // ✅ Handle Booking
  const handleBooking = async () => {
    if (isBookingDisabled()) {
      alert("Please fill all required fields");
      return;
    }

    setProcessingPayment(true);

    try {
      let walletDataToUse = walletData;
      if (!walletDataToUse) {
        walletDataToUse = await fetchWalletData();
      }

      const availableBalance = isPackageBooking
        ? walletDataToUse?.forPackages || 0
        : walletDataToUse?.forTests || 0;

      const servicePrice = isPackageBooking
        ? packageData.price
        : selectedDiagnostic.price || 0;

      // ✅ Wallet balance sufficient
      if (availableBalance >= servicePrice) {
        let response;
        if (isPackageBooking) {
          response = await axios.post(
            `https://api.credenthealth.com/api/staff/package-bookings/${staffId}`,
            {
              familyMemberId: selectedFamilyMember,
              diagnosticId: selectedDiagnostic._id,
              packageId: packageData.packageId,
              serviceType: selectedOption,
              date: selectedDate,
              timeSlot: selectedTime,
              addressId: selectedOption === "Home Collection" ? selectedAddress : null,
              useWallet: true,
            }
          );
        } else {
          response = await axios.post(
            `https://api.credenthealth.com/api/staff/create-bookings/${staffId}`,
            {
              familyMemberId: selectedFamilyMember,
              diagnosticId: selectedDiagnostic._id,
              serviceType: selectedOption,
              date: selectedDate,
              timeSlot: selectedTime,
              addressId: selectedOption === "Home Collection" ? selectedAddress : null,
              useWallet: true,
            }
          );
        }

        if (response.data.isSuccessfull) {
          alert("✅ Booking Successful with Wallet!");
          handlePopupClose();
          navigate('/mybookings');
        } else {
          alert("Booking failed: " + response.data.message);
        }
      } else {
        // ✅ Wallet kam hai → Razorpay open
        initializeRazorpayPayment(servicePrice, availableBalance, isPackageBooking);
      }
    } catch (error) {
      console.error("Error creating booking:", error);

      let availableBalance = isPackageBooking
        ? (walletData?.forPackages || 0)
        : (walletData?.forTests || 0);

      let servicePrice = isPackageBooking
        ? (packageData?.price || 0)
        : (selectedDiagnostic?.price || 0);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message.includes("Insufficient wallet balance")
      ) {
        initializeRazorpayPayment(servicePrice, availableBalance, isPackageBooking);
      } else {
        alert("Booking failed. Please try again.");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  // ✅ Razorpay Script Loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Update the Razorpay initialization to handle both booking types
  const initializeRazorpayPayment = async (servicePrice, walletBalanceUsed, isPackage = false) => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      return;
    }

    const options = {
      key: "rzp_test_BxtRNvflG06PTV",
      amount: servicePrice * 100, // 🔥 Always send FULL price in paise
      currency: "INR",
      name: "Credent Health",
      description: isPackage ? "Package Payment" : "Diagnostics Payment",
      handler: async function (response) {
        const razorpayTransactionId = response.razorpay_payment_id;

        try {
          let bookingResponse;

          if (isPackage) {
            // Package booking with Razorpay
            bookingResponse = await axios.post(
              `https://api.credenthealth.com/api/staff/package-bookings/${staffId}`,
              {
                familyMemberId: selectedFamilyMember,
                diagnosticId: selectedDiagnostic._id,
                packageId: packageData.packageId,
                serviceType: selectedOption,
                date: selectedDate,
                timeSlot: selectedTime,
                addressId: selectedOption === "Home Collection" ? selectedAddress : null,
                transactionId: razorpayTransactionId,
                walletAmount: walletBalanceUsed || 0, // ✅ bata do wallet kitna use hua
              }
            );
          } else {
            // Regular diagnostic booking with Razorpay
            bookingResponse = await axios.post(
              `https://api.credenthealth.com/api/staff/create-bookings/${staffId}`,
              {
                familyMemberId: selectedFamilyMember,
                diagnosticId: selectedDiagnostic._id,
                serviceType: selectedOption,
                date: selectedDate,
                timeSlot: selectedTime,
                addressId: selectedOption === "Home Collection" ? selectedAddress : null,
                transactionId: razorpayTransactionId,
                walletAmount: walletBalanceUsed || 0,
              }
            );
          }

          if (bookingResponse.data.isSuccessfull) {
            alert("✅ Booking Successful after Payment!");
            handlePopupClose();
            navigate('/mybookings');
          } else {
            alert("Booking failed after payment: " + bookingResponse.data.message);
          }
        } catch (error) {
          console.error("Error completing booking:", error);
          alert("Booking completion failed. Please contact support.");
        }
      },
      prefill: {
        name: localStorage.getItem("staffName") || "Customer",
        email: localStorage.getItem("staffEmail") || "customer@example.com",
        contact: localStorage.getItem("staffPhone") || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };




  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
        <div className="flex-grow bg-gray-100 py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Home Collection Centers</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {diagnostics.length === 0 && !loading && (
              <p className="text-center text-gray-600">No diagnostics centers available.</p>
            )}
            {diagnostics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diagnostics.map((diagnostic) => (
                  <div key={diagnostic._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={`https://api.credenthealth.com${diagnostic.image}`}
                      alt={diagnostic.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{diagnostic.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">{diagnostic.address}</p>
                      <button
                        onClick={() => handleDiagnosticClick(diagnostic)}
                        className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        Select Diagnostic
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Service Type Selection Modal */}
        {showServiceModal && selectedDiagnostic && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
                Book Appointment
              </h3>

              <div className="space-y-4">
                {/* Home Collection */}
                <button
                  onClick={() => handleServiceSelect("Home Collection")}
                  className="w-full p-4 bg-gray-100 border-2  rounded-lg flex items-center transition-colors"
                >
                  <img
                    src="/images/home.png" // replace with your image path
                    alt="Home Collection"
                    className="w-12 h-12 mr-4"
                  />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-black-800">Home Collection</h4>
                    <p className="text-sm text-gray-600 mt-1">Book lab tests with sample collection at your doorsteps</p>
                  </div>
                </button>

                {/* Center Visit */}
                <button
                  onClick={() => handleServiceSelect("Center Visit")}
                  className="w-full p-4 bg-gray-100 border-2 rounded-lg flex items-center transition-colors"
                >
                  <img
                    src="/images/center.png" // replace with your image path
                    alt="Center Visit"
                    className="w-12 h-12 mr-4"
                  />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-black-800">Center Visit</h4>
                    <p className="text-sm text-gray-600 mt-1">Find nearby clinics or diagnostic centers</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePopupClose}
                  className="w-full px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Booking Details Modal */}
        {showBookingModal && selectedDiagnostic && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={handlePopupClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>

              <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Select Slot
              </h3>

              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Choose Date</h4>
                {availableDates.length > 0 ? (
                  <>
                    {/* Date Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {availableDates.map((date, index) => {
                        const dateObj = new Date(date);
                        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const dayName = dayNames[dateObj.getDay()];
                        const dayNumber = dateObj.getDate();

                        return (
                          <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-md text-sm relative ${selectedDate === date
                              ? 'bg-white-600 text-black'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {selectedDate === date && (
                              <span className="absolute top-1 right-1 bg-green-600 rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                                <Check size={10} color="white" strokeWidth={3} />
                              </span>
                            )}
                            <span className="text-xs font-medium">{dayName}</span>
                            <span className="text-lg font-semibold">{dayNumber}</span>
                          </button>
                        );
                      })}
                    </div>

                  </>
                ) : (
                  <p className="text-gray-600">No available dates found.</p>
                )}
              </div>


              {/* Time Slot Selection */}
              {selectedDate && selectedOption && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Choose Time</h4>

                  {slotLoading && <p className="text-gray-600">Loading available slots...</p>}
                  {slotError && <p className="text-red-500">{slotError}</p>}

                  {!slotLoading && availableSlots.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.slice(0, 10).map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleTimeSelect(slot.timeSlot)}
                          className={`p-3 rounded-md border-2 text-sm font-medium ${selectedTime === slot.timeSlot
                            ? 'bg-green-100 text-black border-green-400'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                          {slot.timeSlot}
                        </button>
                      ))}

                      {/* Show remaining slots if viewAll is true */}
                      {showAll &&
                        availableSlots.slice(10).map((slot, index) => (
                          <button
                            key={index + 10}
                            onClick={() => handleTimeSelect(slot.timeSlot)}
                            className={`p-3 rounded-md border-2 text-sm font-medium ${selectedTime === slot.timeSlot
                              ? 'bg-green-100 text-black border-green-400'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                              }`}
                          >
                            {slot.timeSlot}
                          </button>
                        ))}

                      {/* View All / Show Less Button */}
                      {availableSlots.length > 10 && (
                        <button
                          type="button"
                          onClick={() => setShowAll(!showAll)}
                          className="btn btn-lg text-blue-600 text-sm font-medium hover:underline self-start"
                        >
                          {showAll ? 'Show Less' : 'View All'}
                        </button>
                      )}
                    </div>
                  )}

                  {!slotLoading && availableSlots.length === 0 && !slotError && (
                    <p className="text-gray-600">No available time slots for the selected date.</p>
                  )}
                </div>
              )}




              {/* Family Member Selection */}
              <div className="mb-6">
                <button
                  onClick={() => setShowFamilyForm(true)}
                  className="w-full mb-2 p-3 text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  + Add Family Member
                </button>

                <div className="grid gap-2 max-h-32 overflow-y-auto">
                  {/* Default option */}
                  <label
                    className={`p-3 rounded-lg border-2 cursor-pointer flex justify-between items-center ${selectedFamilyMember === staff._id
                      ? "border-blue-200 bg-blue-50 text-primary"
                      : "border-gray-300"
                      }`}
                  >
                    <div>
                      <h4 className="font-medium">{staff.name}</h4>
                      <p className="text-xs">Self • {staff.age || "N/A"} yrs • {staff.gender || "N/A"}</p>
                    </div>
                    <input
                      type="radio"
                      name="selectedFamilyMember"
                      value={staff._id}
                      checked={selectedFamilyMember === staff._id}
                      onChange={() => handleFamilyMemberSelect(staff._id)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                  </label>

                  {/* Map the rest of the family members */}
                  {familyMembers.map((member) => (
                    <label
                      key={member._id}
                      className={`p-3 rounded-lg border-2 cursor-pointer flex justify-between items-center ${selectedFamilyMember === member._id
                        ? "border-blue-200 bg-blue-50 text-primary"
                        : "border-gray-300"
                        }`}
                    >
                      <div>
                        <h4 className="font-medium">{member.fullName}</h4>
                        <p className="text-xs">
                          {member.relation} • {member.age} yrs • {member.gender}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="selectedFamilyMember"
                        value={member._id}
                        checked={selectedFamilyMember === member._id}
                        onChange={() => handleFamilyMemberSelect(member._id)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                    </label>
                  ))}
                </div>

              </div>


              {/* Home Collection Address Selection */}
              {selectedOption === "Home Collection" && selectedDate && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold">Select Address</h4>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <span className="mr-1">+</span> Add New Address
                    </button>
                  </div>

                  {addresses.length > 0 ? (
                    <div className="grid gap-2 max-h-40 overflow-y-auto">
                      {addresses.map((address) => (
                        <label
                          key={address._id}
                          className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col ${selectedAddress === address._id
                            ? 'border-blue-200 bg-blue-50 text-primary'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{address.addressType}</h4>
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={address._id}
                              checked={selectedAddress === address._id}
                              onChange={() => setSelectedAddress(address._id)}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.street}, {address.city}, {address.state} - {address.postalCode}
                          </p>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No addresses found. Please add an address for home collection.
                    </p>
                  )}
                </div>
              )}


              {/* Action Buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePopupClose}
                  className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={isBookingDisabled() || processingPayment}
                  className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-md transition-colors ${isBookingDisabled() || processingPayment
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                    }`}
                >
                  {processingPayment ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Address Form Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold text-center mb-5">Add New Address</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                  <select
                    name="addressType"
                    value={newAddress.addressType}
                    onChange={handleAddressInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleAddressInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter postal code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={newAddress.country}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Enter country"
                      defaultValue="India"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAddress}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Family Member Form Modal */}
        {showFamilyForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold text-center mb-4">Add Family Member</h2>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={newFamilyMember.fullName}
                  onChange={handleFamilyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={newFamilyMember.mobileNumber}
                  onChange={handleFamilyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={newFamilyMember.age}
                  onChange={handleFamilyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select
                  name="gender"
                  value={newFamilyMember.gender}
                  onChange={handleFamilyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex flex-col">
                  <label htmlFor="DOB" className="mb-1 text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="DOB"
                    name="DOB"
                    value={newFamilyMember.DOB}
                    onChange={handleFamilyInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <input
                  type="number"
                  name="height"
                  placeholder="Height (cm)"
                  value={newFamilyMember.height}
                  onChange={handleFamilyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  value={newFamilyMember.weight}
                  onChange={handleFamilyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="eyeSight"
                    value={newFamilyMember.eyeSight}
                    onChange={handleFamilyInputChange}
                    placeholder="Eye Sight"
                    className="w-1/3 p-3 border rounded"
                  />
                  <input
                    type="number"
                    name="BMI"
                    value={newFamilyMember.BMI}
                    onChange={handleFamilyInputChange}
                    placeholder="BMI"
                    className="w-1/3 p-3 border rounded"
                  />
                  <input
                    type="text"
                    name="BP"
                    value={newFamilyMember.BP}
                    onChange={handleFamilyInputChange}
                    placeholder="BP"
                    className="w-1/3 p-3 border rounded"
                  />
                </div>
                <select
                  name="relation"
                  value={newFamilyMember.relation}
                  onChange={handleFamilyInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Relation</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowFamilyForm(false)}
                  className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFamilyMember}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default DiagnosticsPage;