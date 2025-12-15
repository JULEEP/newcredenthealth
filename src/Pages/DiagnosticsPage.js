import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { X, Check, MapPin, Phone, Mail, Calendar, Clock, User, Home, Building, Plus, Trash2, TestTube, Package, Scan } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const DiagnosticsPage = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [filteredDiagnostics, setFilteredDiagnostics] = useState([]);
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

  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [showAllDates, setShowAllDates] = useState(false);
  const [showAllSlots, setShowAllSlots] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [fromCart, setFromCart] = useState(false);
  const [cartDiagnosticIds, setCartDiagnosticIds] = useState([]);
  
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
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetailsType, setSelectedDetailsType] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsData, setDetailsData] = useState([]);

  const staffId = localStorage.getItem("staffId");
  const companyId = localStorage.getItem("companyId");
  const staff = JSON.parse(sessionStorage.getItem("staff"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Location state:", location.state);
    
    if (location.state) {
      if (location.state.cartItems) {
        setFromCart(true);
        setCartItems(location.state.cartItems);
      }
      if (location.state.diagnosticIds) {
        setCartDiagnosticIds(location.state.diagnosticIds);
      }
    }
    
    fetchCompanyDiagnostics();
    
    if (staffId) {
      fetchWalletData();
      fetchFamilyMembers();
      if (staff && staff._id) {
        setSelectedFamilyMember(staff._id);
      }
    }
  }, [staffId, location.state]);

  const findMatchingDiagnostics = (allDiagnostics) => {
    if (!fromCart || cartItems.length === 0) {
      setFilteredDiagnostics(allDiagnostics);
      return;
    }
    
    console.log("Finding matching diagnostics for cart items:", cartItems);
    
    const cartItemIds = cartItems.map(item => item.itemId);
    console.log("Cart Item IDs:", cartItemIds);
    
    const matchingCenters = [];
    
    allDiagnostics.forEach(diagnostic => {
      let hasMatchingItems = false;
      
      // Check tests
      if (diagnostic.tests && Array.isArray(diagnostic.tests)) {
        hasMatchingItems = diagnostic.tests.some(test => 
          cartItemIds.includes(test._id)
        );
      }
      
      // Check scans
      if (!hasMatchingItems && diagnostic.scans && Array.isArray(diagnostic.scans)) {
        hasMatchingItems = diagnostic.scans.some(scan => 
          cartItemIds.includes(scan._id)
        );
      }
      
      // Check packages
      if (!hasMatchingItems && diagnostic.packages && Array.isArray(diagnostic.packages)) {
        hasMatchingItems = diagnostic.packages.some(pkg => 
          cartItemIds.includes(pkg._id)
        );
      }
      
      // If has matching items, include in filtered list
      if (hasMatchingItems) {
        matchingCenters.push(diagnostic);
      }
    });
    
    console.log("Matching diagnostics found:", matchingCenters.length);
    setFilteredDiagnostics(matchingCenters);
  };

 const fetchCompanyDiagnostics = async () => {
  setLoading(true);
  setError("");
  
  if (!companyId) {
    setError("Company ID not found. Please login again.");
    setLoading(false);
    return;
  }
  
  // ✅ Staff ID get karein
  const staffId = localStorage.getItem("staffId");
  
  // ✅ Dono IDs required hain
  if (!staffId) {
    setError("Staff ID not found. Please login again.");
    setLoading(false);
    return;
  }
  
  console.log("🔍 API Call Parameters:", { companyId, staffId });
  
  try {
    // ✅ New API with both companyId and staffId
    const response = await axios.get(
      `https://api.credenthealth.com/api/admin/allcompaniesdiagnostics/${companyId}/${staffId}`
    );
    
    console.log("✅ API Response:", response.data);
    
    if (response.data && response.data.data) {
      const transformedDiagnostics = response.data.data.map(diagnostic => {
        let tests = [];
        let packages = [];
        let scans = [];
        
        if (Array.isArray(diagnostic.tests)) {
          tests = diagnostic.tests;
        }
        
        if (Array.isArray(diagnostic.packages)) {
          packages = diagnostic.packages;
        }
        
        if (Array.isArray(diagnostic.scans)) {
          scans = diagnostic.scans;
        }
        
        return {
          ...diagnostic,
          tests: tests,
          packages: packages,
          scans: scans,
          matchesCart: diagnostic.matchesCart || false,
          matchedItemCount: diagnostic.matchedItemCount || 0
        };
      });
      
      setDiagnostics(transformedDiagnostics);
      findMatchingDiagnostics(transformedDiagnostics);
      
      // ✅ Cart info display karein
      if (response.data.cartInfo) {
        console.log("🛒 Cart Information:", response.data.cartInfo);
        
        // Optional: User ko cart info show karein
        if (response.data.cartInfo.hasCart) {
          console.log(`User ke cart mein ${response.data.cartInfo.cartItemCount} items hain`);
        }
      }
    } else {
      setDiagnostics([]);
      setFilteredDiagnostics([]);
      setError("No diagnostics found for your company");
    }
    setLoading(false);
  } catch (err) {
    console.error("❌ Error fetching company diagnostics:", err);
    
    // ✅ Detailed error logging
    if (err.response) {
      console.error("Error Status:", err.response.status);
      console.error("Error Data:", err.response.data);
      console.error("Error Headers:", err.response.headers);
      
      // ✅ Specific error messages
      if (err.response.status === 400) {
        if (err.response.data?.message?.includes("staffId")) {
          setError("Staff ID is required. Please login again.");
        } else if (err.response.data?.message?.includes("companyId")) {
          setError("Company ID is required. Please login again.");
        } else {
          setError(err.response.data?.message || "Bad request");
        }
      } else if (err.response.status === 404) {
        setError("API endpoint not found. Please check backend routes.");
      } else if (err.response.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(`Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
      }
    } else if (err.request) {
      // ✅ Network error
      console.error("Network Error:", err.request);
      setError("Network error. Please check your internet connection.");
    } else {
      // ✅ Setup error
      console.error("Setup Error:", err.message);
      setError("Error setting up request.");
    }
    
    setLoading(false);
  }
};
  const handleDetailsClick = (diagnostic, type) => {
    setSelectedDiagnostic(diagnostic);
    setSelectedDetailsType(type);
    setShowDetailsModal(true);
    
    setDetailsLoading(true);
    
    setTimeout(() => {
      let data = [];
      
      switch(type) {
        case 'tests':
          data = diagnostic.tests || [];
          break;
        case 'packages':
          data = diagnostic.packages || [];
          break;
        case 'scans':
          data = diagnostic.scans || [];
          break;
        default:
          data = [];
      }
      
      setDetailsData(data);
      setDetailsLoading(false);
    }, 300);
  };

  const checkDiagnosticHasCartItems = (diagnostic) => {
    if (!fromCart || cartItems.length === 0) return false;
    
    const cartItemIds = cartItems.map(item => item.itemId);
    let hasCartItems = false;
    
    if (diagnostic.tests && Array.isArray(diagnostic.tests)) {
      hasCartItems = diagnostic.tests.some(test => 
        cartItemIds.includes(test._id)
      );
    }
    
    if (!hasCartItems && diagnostic.scans && Array.isArray(diagnostic.scans)) {
      hasCartItems = diagnostic.scans.some(scan => 
        cartItemIds.includes(scan._id)
      );
    }
    
    if (!hasCartItems && diagnostic.packages && Array.isArray(diagnostic.packages)) {
      hasCartItems = diagnostic.packages.some(pkg => 
        cartItemIds.includes(pkg._id)
      );
    }
    
    return hasCartItems;
  };

  const getCartItemsInDiagnostic = (diagnostic) => {
    if (!fromCart || cartItems.length === 0) return [];
    
    const cartItemIds = cartItems.map(item => item.itemId);
    const itemsInThisDiagnostic = [];
    
    if (diagnostic.tests && Array.isArray(diagnostic.tests)) {
      diagnostic.tests.forEach(test => {
        if (cartItemIds.includes(test._id)) {
          const cartItem = cartItems.find(item => item.itemId === test._id);
          if (cartItem) {
            itemsInThisDiagnostic.push({
              ...cartItem,
              type: 'test'
            });
          }
        }
      });
    }
    
    if (diagnostic.scans && Array.isArray(diagnostic.scans)) {
      diagnostic.scans.forEach(scan => {
        if (cartItemIds.includes(scan._id)) {
          const cartItem = cartItems.find(item => item.itemId === scan._id);
          if (cartItem) {
            itemsInThisDiagnostic.push({
              ...cartItem,
              type: 'scan'
            });
          }
        }
      });
    }
    
    if (diagnostic.packages && Array.isArray(diagnostic.packages)) {
      diagnostic.packages.forEach(pkg => {
        if (cartItemIds.includes(pkg._id)) {
          const cartItem = cartItems.find(item => item.itemId === pkg._id);
          if (cartItem) {
            itemsInThisDiagnostic.push({
              ...cartItem,
              type: 'package'
            });
          }
        }
      });
    }
    
    return itemsInThisDiagnostic;
  };

  const addToBookings = () => {
    if (!selectedDiagnostic || !selectedOption || !selectedDate || !selectedTime || !selectedFamilyMember) {
      alert("Please fill all required fields");
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      diagnostic: selectedDiagnostic,
      serviceType: selectedOption,
      date: selectedDate,
      timeSlot: selectedTime,
      addressId: selectedOption === "Home Collection" ? selectedAddress : null,
      familyMemberId: selectedFamilyMember,
      price: selectedDiagnostic.price || 0
    };

    setBookings(prev => [...prev, newBooking]);
    
    setSelectedDate("");
    setSelectedTime("");
    setSelectedAddress("");
    setAvailableSlots([]);
    setAvailableDates([]);
    
    alert(`✅ ${selectedDiagnostic.name} added to bookings! You can add more diagnostics.`);
  };

  const removeBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const calculateTotalPrice = () => {
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  };

  const handleMultipleBookings = async () => {
    if (bookings.length === 0) {
      alert("Please add at least one booking");
      return;
    }

    setProcessingPayment(true);

    try {
      let walletDataToUse = walletData;
      if (!walletDataToUse) {
        walletDataToUse = await fetchWalletData();
      }

      const availableBalance = walletDataToUse?.forTests || 0;
      const totalPrice = calculateTotalPrice();

      if (availableBalance >= totalPrice) {
        const bookingPromises = bookings.map(booking => 
          axios.post(
            `https://api.credenthealth.com/api/staff/create-bookings/${staffId}`,
            {
              familyMemberId: booking.familyMemberId,
              diagnosticId: booking.diagnostic._id,
              serviceType: booking.serviceType,
              date: booking.date,
              timeSlot: booking.timeSlot,
              addressId: booking.addressId,
              useWallet: true,
            }
          )
        );

        const responses = await Promise.all(bookingPromises);
        const allSuccessful = responses.every(response => response.data.isSuccessfull);

        if (allSuccessful) {
          alert(`✅ ${bookings.length} Bookings Successful with Wallet!`);
          setBookings([]);
          handlePopupClose();
          navigate('/mybookings');
        } else {
          alert("Some bookings failed. Please check your bookings.");
        }
      } else {
        initializeRazorpayMultiplePayment(totalPrice, availableBalance);
      }
    } catch (error) {
      console.error("Error creating multiple bookings:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get(`https://api.credenthealth.com/api/staff/getallfamily/${staffId}`);
      setFamilyMembers(response.data.family_members || []);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`https://api.credenthealth.com/api/staff/getaddresses/${staffId}`);
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

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
      setSlotError("Error fetching available slots. Please try another date.");
      setAvailableSlots([]);
    } finally {
      setSlotLoading(false);
    }
  };

  const fetchAvailableDates = async (diagnosticId, option) => {
    try {
      const today = new Date();
      const dates = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        try {
          const response = await axios.get(
            `https://api.credenthealth.com/api/staff/diagnosticslots/${diagnosticId}?date=${dateString}&type=${option}`
          );
          
          if (response.data.slots && response.data.slots.length > 0) {
            const availableSlots = response.data.slots.filter(slot => !slot.isBooked);
            if (availableSlots.length > 0) {
              dates.push(dateString);
            }
          }
        } catch (error) {
          continue;
        }
      }
      
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
      setAvailableDates([]);
    }
  };

  const handlePopupClose = () => {
    setShowServiceModal(false);
    setShowBookingModal(false);
    setSelectedDiagnostic(null);
    setSelectedOption("");
    setAvailableSlots([]);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedAddress("");
    setSelectedFamilyMember(staff?._id || "");
    setAvailableDates([]);
    setSlotError("");
    setShowAllSlots(false);
    setShowAllDates(false);
  };

  const handleDiagnosticClick = (diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setShowServiceModal(true);
  };

  const handleServiceSelect = async (option) => {
    setSelectedOption(option);
    await fetchAddresses();
    setShowServiceModal(false);
    setShowBookingModal(true);

    if (selectedDiagnostic && selectedDiagnostic._id) {
      await fetchAvailableDates(selectedDiagnostic._id, option);
    }
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setAvailableSlots([]);
    setShowAllSlots(false);

    if (selectedOption && selectedDiagnostic) {
      await fetchSlots(selectedDiagnostic._id, date, selectedOption);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSelectAnotherDiagnostic = (diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
    setAvailableDates([]);
    
    if (selectedOption && diagnostic._id) {
      fetchAvailableDates(diagnostic._id, selectedOption);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFamilyInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAddress = async () => {
    try {
      const response = await axios.post(
        `https://api.credenthealth.com/api/staff/create-address/${staffId}`,
        newAddress
      );

      if (response.data.success) {
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

  const handleFamilyMemberSelect = (familyMemberId) => {
    setSelectedFamilyMember(familyMemberId);
  };

  const isAddBookingDisabled = () => {
    if (!selectedOption || !selectedFamilyMember) return true;

    if (selectedOption === "Home Collection") {
      return !selectedAddress || !selectedDate || !selectedTime;
    } else if (selectedOption === "Center Visit") {
      return !selectedDate || !selectedTime;
    }

    return true;
  };

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(
        `https://api.credenthealth.com/api/staff/wallet/${staffId}`
      );
      setWalletData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      return null;
    }
  };

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

  const initializeRazorpayMultiplePayment = async (totalPrice, walletBalanceUsed) => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      return;
    }

    const options = {
      key: "rzp_test_BxtRNvflG06PTV",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Credent Health",
      description: `Multiple Diagnostics Booking (${bookings.length} centers)`,
      handler: async function (response) {
        const razorpayTransactionId = response.razorpay_payment_id;

        try {
          const bookingPromises = bookings.map(booking => 
            axios.post(
              `https://api.credenthealth.com/api/staff/create-bookings/${staffId}`,
              {
                familyMemberId: booking.familyMemberId,
                diagnosticId: booking.diagnostic._id,
                serviceType: booking.serviceType,
                date: booking.date,
                timeSlot: booking.timeSlot,
                addressId: booking.addressId,
                transactionId: razorpayTransactionId,
                walletAmount: walletBalanceUsed || 0,
              }
            )
          );

          const responses = await Promise.all(bookingPromises);
          const allSuccessful = responses.every(response => response.data.isSuccessfull);

          if (allSuccessful) {
            alert(`✅ ${bookings.length} Bookings Successful after Payment!`);
            setBookings([]);
            handlePopupClose();
            navigate('/mybookings');
          } else {
            alert("Some bookings failed after payment. Please contact support.");
          }
        } catch (error) {
          console.error("Error completing multiple bookings:", error);
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

  const getHeaderText = () => {
    if (fromCart && cartItems.length > 0) {
      return `Diagnostic Centers for Your Cart Items`;
    } else {
      return "Your Company's Diagnostic Centers";
    }
  };

  const getDescriptionText = () => {
    if (fromCart && cartItems.length > 0) {
      const matchingCount = filteredDiagnostics.length;
      const totalCount = diagnostics.length;
      return `${matchingCount} out of ${totalCount} diagnostics have your cart items`;
    } else {
      return "Select diagnostic centers from your company's approved list";
    }
  };

  const getDiagnosticColor = (centerType) => {
    switch(centerType?.toLowerCase()) {
      case 'hospital':
        return 'bg-red-50 border-red-200';
      case 'clinic':
        return 'bg-blue-50 border-blue-200';
      case 'lab':
        return 'bg-green-50 border-green-200';
      case 'diagnostic center':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getDiagnosticIcon = (centerType) => {
    switch(centerType?.toLowerCase()) {
      case 'hospital':
        return '🏥';
      case 'clinic':
        return '🏥';
      case 'lab':
        return '🧪';
      case 'diagnostic center':
        return '🏢';
      default:
        return '🏥';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return "";
    return timeString.replace(":00", "").replace(/(AM|PM)/, " $1");
  };

  const getCountDisplay = (diagnostic, type) => {
    const items = diagnostic[type];
    if (!Array.isArray(items)) return "0";
    const count = items.length;
    return count > 0 ? `${count}+` : "0";
  };

  const getDetailsTitle = () => {
    switch(selectedDetailsType) {
      case 'tests': return '🧪 Available Tests';
      case 'scans': return '📷 Available Scans';
      case 'packages': return '📦 Health Packages';
      default: return 'Details';
    }
  };

  const getDetailsIcon = () => {
    switch(selectedDetailsType) {
      case 'tests': return <TestTube className="w-8 h-8 text-blue-600" />;
      case 'scans': return <Scan className="w-8 h-8 text-green-600" />;
      case 'packages': return <Package className="w-8 h-8 text-purple-600" />;
      default: return null;
    }
  };

  const getEmptyMessage = () => {
    switch(selectedDetailsType) {
      case 'tests': return 'No tests available for this diagnostic center.';
      case 'scans': return 'No scans available for this diagnostic center.';
      case 'packages': return 'No packages available for this diagnostic center.';
      default: return 'No data available.';
    }
  };

  const renderDiagnosticCard = (diagnostic) => {
    const isAlreadyBooked = bookings.some(b => b.diagnostic._id === diagnostic._id);
    const hasCartItems = checkDiagnosticHasCartItems(diagnostic);
    const cartItemsInDiagnostic = getCartItemsInDiagnostic(diagnostic);
    
    return (
      <div key={diagnostic._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative p-6">
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${diagnostic.centerType?.toLowerCase() === 'hospital' ? 'bg-red-100 text-red-800' : 
              diagnostic.centerType?.toLowerCase() === 'clinic' ? 'bg-blue-100 text-blue-800' : 
              diagnostic.centerType?.toLowerCase() === 'lab' ? 'bg-green-100 text-green-800' : 
              'bg-purple-100 text-purple-800'}`}>
              {diagnostic.centerType || "Diagnostic Center"}
            </span>
          </div>
          
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
              Company Approved
            </span>
          </div>
          
          {fromCart && hasCartItems && cartItemsInDiagnostic.length > 0 && (
            <div className="absolute top-16 left-4 z-10">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm flex items-center">
                <Check className="w-3 h-3 mr-1" />
                {cartItemsInDiagnostic.length} Cart Item{cartItemsInDiagnostic.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          {isAlreadyBooked && (
            <div className={`absolute top-16 ${fromCart && hasCartItems ? 'left-24' : 'left-4'} z-10`}>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                ✓ In Your Bookings
              </span>
            </div>
          )}
          
          <div className={`mb-4 p-4 rounded-xl inline-block ${getDiagnosticColor(diagnostic.centerType)}`}>
            <span className="text-3xl">{getDiagnosticIcon(diagnostic.centerType)}</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {diagnostic.name}
          </h3>
          
          <div className="flex items-start mb-4">
            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {diagnostic.address}
            </p>
          </div>
          
          {fromCart && cartItemsInDiagnostic.length > 0 && (
            <div className="mb-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs font-medium text-orange-800 mb-1">
                Your cart items available here:
              </p>
              <div className="space-y-1">
                {cartItemsInDiagnostic.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <Check className="w-3 h-3 text-green-600 mr-2" />
                    <span className="text-xs text-gray-700 truncate">{item.title}</span>
                  </div>
                ))}
                {cartItemsInDiagnostic.length > 2 && (
                  <p className="text-xs text-gray-600">
                    +{cartItemsInDiagnostic.length - 2} more items
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div 
              onClick={() => handleDetailsClick(diagnostic, 'tests')}
              className="bg-blue-50 rounded-lg p-2 text-center cursor-pointer hover:bg-blue-100 transition-colors duration-200 border border-blue-100 hover:border-blue-300 active:scale-95"
              title="Click to view available tests"
            >
              <div className="flex items-center justify-center">
                <TestTube className="w-3 h-3 text-blue-600 mr-1" />
                <span className="text-xs font-medium text-blue-700">
                  {getCountDisplay(diagnostic, 'tests')} Tests
                </span>
              </div>
              <div className="text-[10px] text-blue-500 mt-0.5 opacity-70">
                Click to view
              </div>
            </div>
            
            <div 
              onClick={() => handleDetailsClick(diagnostic, 'scans')}
              className="bg-green-50 rounded-lg p-2 text-center cursor-pointer hover:bg-green-100 transition-colors duration-200 border border-green-100 hover:border-green-300 active:scale-95"
              title="Click to view available scans"
            >
              <div className="flex items-center justify-center">
                <Scan className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs font-medium text-green-700">
                  {getCountDisplay(diagnostic, 'scans')} Scans
                </span>
              </div>
              <div className="text-[10px] text-green-500 mt-0.5 opacity-70">
                Click to view
              </div>
            </div>
            
            {/* <div 
              onClick={() => handleDetailsClick(diagnostic, 'packages')}
              className="bg-purple-50 rounded-lg p-2 text-center cursor-pointer hover:bg-purple-100 transition-colors duration-200 border border-purple-100 hover:border-purple-300 active:scale-95"
              title="Click to view available packages"
            >
              <div className="flex items-center justify-center">
                <Package className="w-3 h-3 text-purple-600 mr-1" />
                <span className="text-xs font-medium text-purple-700">
                  {getCountDisplay(diagnostic, 'packages')} Packages
                </span>
              </div>
              <div className="text-[10px] text-purple-500 mt-0.5 opacity-70">
                Click to view
              </div>
            </div> */}
          </div>
          
          <div className="space-y-2 mb-4">
            {diagnostic.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{diagnostic.description}</p>
            )}
            
            {diagnostic.phone && (
              <div className="flex items-center text-gray-500 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                <span>{diagnostic.phone}</span>
              </div>
            )}
            
            {diagnostic.email && (
              <div className="flex items-center text-gray-500 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{diagnostic.email}</span>
              </div>
            )}
          </div>
          
          {diagnostic.price && (
            <div className="mb-4">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600">Approx. Price</span>
                <span className="text-lg font-bold text-blue-600">₹{diagnostic.price}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={() => handleDiagnosticClick(diagnostic)}
            disabled={isAlreadyBooked}
            className={`w-full py-3.5 font-semibold rounded-xl border-2 transition-all duration-300 group-hover:shadow-md flex items-center justify-center ${
              isAlreadyBooked
                ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:text-blue-800 hover:shadow-lg'
            }`}
          >
            {isAlreadyBooked ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Already Added
              </>
            ) : (
              <>
                <span>Select Diagnostic</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">Available Today</span>
            </div>
            <span className="text-xs text-gray-500">
              {diagnostic.phone ? '24/7 Support' : 'Mon-Sun'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
        <div className="flex-grow bg-gradient-to-br from-gray-50 to-blue-50 py-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {getHeaderText()}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {getDescriptionText()}
              </p>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              
              {fromCart && cartItems.length > 0 && (
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <span className="text-blue-700 font-medium">
                    📦 {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in cart
                  </span>
                </div>
              )}
            </div>

            {bookings.length > 0 && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-600 p-2 rounded-lg mr-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Your Bookings ({bookings.length})
                      </h3>
                      <p className="text-gray-600">Total: ₹{calculateTotalPrice()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleMultipleBookings}
                      disabled={processingPayment}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    >
                      {processingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Book All ({bookings.length})
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                      <button
                        onClick={() => removeBooking(booking.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{booking.diagnostic.name}</h4>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full mr-2">
                              {booking.serviceType}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(booking.date)}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Time: <span className="font-semibold">{formatTimeDisplay(booking.timeSlot)}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {booking.diagnostic.address?.split(",")[0]}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-sm font-bold text-gray-900">₹{booking.price || 0}</p>
                          <div className={`w-3 h-3 rounded-full mt-2 ${booking.diagnostic.centerType?.toLowerCase() === 'hospital' ? 'bg-red-500' : 
                            booking.diagnostic.centerType?.toLowerCase() === 'clinic' ? 'bg-blue-500' : 
                            booking.diagnostic.centerType?.toLowerCase() === 'lab' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-blue-200 text-center">
                  <button
                    onClick={() => {
                      setSelectedDiagnostic(null);
                      setShowServiceModal(false);
                      setShowBookingModal(false);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another Diagnostic
                  </button>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading diagnostic centers...</p>
              </div>
            )}
            
            {filteredDiagnostics.length === 0 && !loading && fromCart && cartItems.length > 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">No diagnostic centers found for your cart items.</p>
                <p className="text-gray-500 mb-4">Try adding different tests/scans or contact your company.</p>
                <button
                  onClick={() => navigate('/cart')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back to Cart
                </button>
              </div>
            )}
            
            {filteredDiagnostics.length === 0 && !loading && !fromCart && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">No diagnostic centers available for your company.</p>
                <button
                  onClick={fetchCompanyDiagnostics}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {filteredDiagnostics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiagnostics.map((diagnostic) => renderDiagnosticCard(diagnostic))}
              </div>
            )}
          </div>
        </div>

        {/* NEW: Details Modal for Tests/Packages/Scans */}
        {showDetailsModal && selectedDiagnostic && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-4">
                      {getDetailsIcon()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {getDetailsTitle()}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {selectedDiagnostic.name} • {selectedDiagnostic.address?.split(",")[0]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedDetailsType("");
                      setDetailsData([]);
                    }}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {detailsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading {selectedDetailsType}...</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Total {selectedDetailsType.charAt(0).toUpperCase() + selectedDetailsType.slice(1)}: {detailsData.length}
                      </h4>
                    </div>
                    
                    {detailsData.length > 0 ? (
                      <div className="grid gap-4">
                        {detailsData.map((item, index) => {
                          const isInCart = cartItems.some(cartItem => cartItem.itemId === item._id);
                          
                          return (
                            <div key={item._id || index} className={`bg-gray-50 rounded-xl p-5 border ${isInCart ? 'border-green-300 bg-green-50' : 'border-gray-200'} hover:border-gray-300 transition-colors`}>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h5 className="font-semibold text-gray-900 text-lg">
                                      {item.name || item.title || `${selectedDetailsType.slice(0, -1)} ${index + 1}`}
                                    </h5>
                                    {isInCart && (
                                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                        In Your Cart
                                      </span>
                                    )}
                                  </div>
                                  
                                  {item.description && (
                                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                  )}
                                  
                                  {item.preparation && (
                                    <div className="mt-3">
                                      <span className="text-sm font-medium text-gray-700">Preparation: </span>
                                      <p className="text-sm text-gray-600 mt-1">{item.preparation}</p>
                                    </div>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-4 mt-3">
                                    {item.price !== undefined && item.price !== null && (
                                      <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-700 mr-2">Price:</span>
                                        <span className="text-lg font-bold text-blue-600">₹{item.price}</span>
                                      </div>
                                    )}
                                    
                                    {(item.reportHour || item.reportTime) && (
                                      <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-700 mr-2">Report Time:</span>
                                        <span className="text-sm text-gray-600">{item.reportHour || item.reportTime} hours</span>
                                      </div>
                                    )}
                                    
                                    {item.totalTestsIncluded && (
                                      <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-700 mr-2">Tests Included:</span>
                                        <span className="text-sm font-bold text-purple-600">{item.totalTestsIncluded}</span>
                                      </div>
                                    )}
                                    
                                    {item.fastingRequired !== undefined && (
                                      <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-700 mr-2">Fasting:</span>
                                        <span className={`text-sm ${item.fastingRequired ? 'text-red-600' : 'text-green-600'}`}>
                                          {item.fastingRequired ? 'Required' : 'Not Required'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="ml-4">
                                  {item.gender && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      item.gender === 'Male' ? 'bg-blue-100 text-blue-800' :
                                      item.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {item.gender}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-300 mb-4">
                          {selectedDetailsType === 'tests' && <TestTube className="w-20 h-20 mx-auto" />}
                          {selectedDetailsType === 'scans' && <Scan className="w-20 h-20 mx-auto" />}
                          {selectedDetailsType === 'packages' && <Package className="w-20 h-20 mx-auto" />}
                        </div>
                        <p className="text-gray-600 text-lg">{getEmptyMessage()}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing details for <span className="font-semibold">{selectedDiagnostic.name}</span>
                  </p>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedDetailsType("");
                      setDetailsData([]);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Type Selection Modal */}
        {showServiceModal && selectedDiagnostic && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Book Appointment
                </h3>
                <p className="text-gray-600">Select service type for {selectedDiagnostic.name}</p>
                {selectedDiagnostic.price && (
                  <div className="mt-2 inline-block px-4 py-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">Approx. Price: ₹{selectedDiagnostic.price}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleServiceSelect("Home Collection")}
                  className="w-full p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100 rounded-xl flex items-center transition-all duration-300 hover:from-green-100 hover:to-emerald-100 hover:border-green-200 hover:shadow-lg group"
                >
                  <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-700">Home Collection</h4>
                    <p className="text-sm text-gray-600 mt-1">Book lab tests with sample collection at your doorsteps</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => handleServiceSelect("Center Visit")}
                  className="w-full p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl flex items-center transition-all duration-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200 hover:shadow-lg group"
                >
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">Center Visit</h4>
                    <p className="text-sm text-gray-600 mt-1">Find nearby clinics or diagnostic centers</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePopupClose}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showBookingModal && selectedDiagnostic && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white p-0 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
              {/* Left Panel */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">All Diagnostics</h3>
                  <p className="text-gray-600 text-sm">Select a diagnostic to book</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {filteredDiagnostics.map((diagnostic) => {
                    const isSelected = selectedDiagnostic._id === diagnostic._id;
                    const isBooked = bookings.some(b => b.diagnostic._id === diagnostic._id);
                    const hasCartItems = checkDiagnosticHasCartItems(diagnostic);
                    
                    return (
                      <div
                        key={diagnostic._id}
                        onClick={() => handleSelectAnotherDiagnostic(diagnostic)}
                        className={`mb-3 p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                          isSelected
                            ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50'
                            : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                        } ${isBooked ? 'opacity-70' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${getDiagnosticColor(diagnostic.centerType)}`}>
                            <span className="text-lg">{getDiagnosticIcon(diagnostic.centerType)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">{diagnostic.name}</h4>
                              <div className="flex flex-col items-end">
                                {isBooked && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-1">
                                    ✓ Added
                                  </span>
                                )}
                                {hasCartItems && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                    Cart Items
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">{diagnostic.address?.split(",")[0]}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                {getCountDisplay(diagnostic, 'tests')} Tests
                              </span>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                {getCountDisplay(diagnostic, 'scans')} Scans
                              </span>
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                {getCountDisplay(diagnostic, 'packages')} Pkgs
                              </span>
                            </div>
                            
                            {diagnostic.price && (
                              <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Price</span>
                                <span className="text-sm font-bold text-blue-600">₹{diagnostic.price}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Bookings: {bookings.length}</p>
                      <p className="text-sm text-gray-600">Total: ₹{calculateTotalPrice()}</p>
                    </div>
                    <button
                      onClick={handleMultipleBookings}
                      disabled={processingPayment || bookings.length === 0}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${bookings.length === 0 || processingPayment
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md'
                      }`}
                    >
                      {processingPayment ? 'Processing...' : 'Book All'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="w-2/3 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Book {selectedDiagnostic.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedDiagnostic.centerType?.toLowerCase() === 'hospital' ? 'bg-red-100 text-red-800' : 
                          selectedDiagnostic.centerType?.toLowerCase() === 'clinic' ? 'bg-blue-100 text-blue-800' : 
                          selectedDiagnostic.centerType?.toLowerCase() === 'lab' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                          {selectedDiagnostic.centerType || "Diagnostic Center"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {selectedOption === "Home Collection" ? "🏠 Home Collection" : "🏢 Center Visit"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handlePopupClose}
                      className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                      <X size={22} />
                    </button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 truncate">{selectedDiagnostic.address?.split(",")[0]}</span>
                      </div>
                      {selectedDiagnostic.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{selectedDiagnostic.phone}</span>
                        </div>
                      )}
                      {selectedDiagnostic.price && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">Price:</span>
                          <span className="text-lg font-bold text-blue-600">₹{selectedDiagnostic.price}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-white rounded-lg p-2 text-center border cursor-pointer hover:bg-blue-50" onClick={() => handleDetailsClick(selectedDiagnostic, 'tests')}>
                        <TestTube className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-700">{getCountDisplay(selectedDiagnostic, 'tests')} Tests</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center border cursor-pointer hover:bg-green-50" onClick={() => handleDetailsClick(selectedDiagnostic, 'scans')}>
                        <Scan className="w-4 h-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-700">{getCountDisplay(selectedDiagnostic, 'scans')} Scans</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center border cursor-pointer hover:bg-purple-50" onClick={() => handleDetailsClick(selectedDiagnostic, 'packages')}>
                        <Package className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-700">{getCountDisplay(selectedDiagnostic, 'packages')} Packages</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Date Selection */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="text-lg font-semibold text-gray-800">Choose Date</h4>
                    </div>
                    {availableDates.length > 0 ? (
                      <>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {(showAllDates ? availableDates : availableDates.slice(0, 4)).map((date, index) => {
                            const dateObj = new Date(date);
                            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            const dayName = dayNames[dateObj.getDay()];
                            const dayNumber = dateObj.getDate();
                            const month = dateObj.toLocaleDateString('en-US', { month: 'short' });

                            return (
                              <button
                                key={index}
                                onClick={() => handleDateSelect(date)}
                                className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl text-sm relative transition-all duration-300 ${selectedDate === date
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
                                  }`}
                              >
                                {selectedDate === date && (
                                  <span className="absolute -top-1 -right-1 bg-white border border-blue-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                    <Check size={12} className="text-blue-600" strokeWidth={3} />
                                  </span>
                                )}
                                <span className="text-xs font-medium opacity-80">{dayName}</span>
                                <span className="text-2xl font-bold mt-1">{dayNumber}</span>
                                <span className="text-xs font-medium opacity-80 mt-1">{month}</span>
                              </button>
                            );
                          })}
                        </div>

                        {availableDates.length > 4 && (
                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => setShowAllDates(!showAllDates)}
                              className="text-blue-600 text-sm font-medium hover:text-blue-700 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              {showAllDates ? 'Show Less' : `View All ${availableDates.length} Dates`}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-xl">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No available dates found. Please try another service type.</p>
                      </div>
                    )}
                  </div>

                  {/* Time Slot Selection */}
                  {selectedDate && selectedOption && (
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="text-lg font-semibold text-gray-800">Choose Time Slot</h4>
                      </div>

                      {slotLoading && (
                        <div className="text-center py-6">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                          <p className="mt-3 text-gray-600">Loading available slots...</p>
                        </div>
                      )}
                      {slotError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-red-600 text-center">{slotError}</p>
                        </div>
                      )}

                      {!slotLoading && availableSlots.length > 0 && (
                        <>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {(showAllSlots ? availableSlots : availableSlots.slice(0, 6)).map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => handleTimeSelect(slot.timeSlot)}
                                className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${selectedTime === slot.timeSlot
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg transform scale-105'
                                    : slot.isBooked
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:shadow-md'
                                  }`}
                                disabled={slot.isBooked}
                              >
                                {formatTimeDisplay(slot.timeSlot)}
                                {slot.isBooked && " (Booked)"}
                              </button>
                            ))}
                          </div>

                          {availableSlots.length > 6 && (
                            <div className="text-center">
                              <button
                                type="button"
                                onClick={() => setShowAllSlots(!showAllSlots)}
                                className="text-blue-600 text-sm font-medium hover:text-blue-700 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                {showAllSlots ? 'Show Less' : `View All ${availableSlots.length} Slots`}
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {!slotLoading && availableSlots.length === 0 && !slotError && selectedDate && (
                        <div className="text-center py-6 bg-gray-50 rounded-xl">
                          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No available time slots for the selected date.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Family Member Selection */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="text-lg font-semibold text-gray-800">Select Patient</h4>
                      </div>
                      <button
                        onClick={() => setShowFamilyForm(true)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Family Member
                      </button>
                    </div>

                    <div className="grid gap-3 max-h-64 overflow-y-auto pr-2">
                      {staff && staff._id && (
                        <label
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${selectedFamilyMember === staff._id
                            ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">Self • {staff.age || "N/A"} yrs • {staff.gender || "N/A"}</p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="selectedFamilyMember"
                            value={staff._id}
                            checked={selectedFamilyMember === staff._id}
                            onChange={() => handleFamilyMemberSelect(staff._id)}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                        </label>
                      )}

                      {familyMembers.map((member) => (
                        <label
                          key={member._id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${selectedFamilyMember === member._id
                            ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{member.fullName}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {member.relation} • {member.age} yrs • {member.gender}
                              </p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="selectedFamilyMember"
                            value={member._id}
                            checked={selectedFamilyMember === member._id}
                            onChange={() => handleFamilyMemberSelect(member._id)}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedOption === "Home Collection" && selectedDate && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Home className="w-5 h-5 text-blue-600 mr-2" />
                          <h4 className="text-lg font-semibold text-gray-800">Select Address</h4>
                        </div>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add New Address
                        </button>
                      </div>

                      {addresses.length > 0 ? (
                        <div className="grid gap-3 max-h-48 overflow-y-auto pr-2">
                          {addresses.map((address) => (
                            <label
                              key={address._id}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col ${selectedAddress === address._id
                                ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${address.addressType === 'Home' ? 'bg-blue-100' :
                                    address.addressType === 'Work' ? 'bg-green-100' : 'bg-purple-100'
                                    }`}>
                                    {address.addressType === 'Home' ? (
                                      <Home className="w-4 h-4 text-blue-600" />
                                    ) : address.addressType === 'Work' ? (
                                      <Building className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <MapPin className="w-4 h-4 text-purple-600" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{address.addressType}</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {address.street}, {address.city}, {address.state} - {address.postalCode}
                                    </p>
                                  </div>
                                </div>
                                <input
                                  type="radio"
                                  name="selectedAddress"
                                  value={address._id}
                                  checked={selectedAddress === address._id}
                                  onChange={() => setSelectedAddress(address._id)}
                                  className="form-radio h-5 w-5 text-blue-600"
                                />
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-xl">
                          <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-3">No addresses found.</p>
                          <button
                            onClick={() => setShowAddressForm(true)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Add Your First Address
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <p>Currently selected: <span className="font-semibold">{selectedDiagnostic.name}</span></p>
                      <p>Service: <span className="font-semibold">{selectedOption}</span></p>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={addToBookings}
                        disabled={isAddBookingDisabled()}
                        className={`px-8 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center ${isAddBookingDisabled()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                          }`}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add to Bookings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Address Form Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add New Address</h3>
                <p className="text-gray-600">Enter your address details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                  <select
                    name="addressType"
                    value={newAddress.addressType}
                    onChange={handleAddressInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Home">🏠 Home</option>
                    <option value="Work">🏢 Work</option>
                    <option value="Other">📍 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleAddressInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter country"
                      defaultValue="India"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAddress}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Family Member Form Modal */}
        {showFamilyForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Family Member</h2>
                <p className="text-gray-600">Enter family member details</p>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={newFamilyMember.fullName}
                  onChange={handleFamilyInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={newFamilyMember.mobileNumber}
                  onChange={handleFamilyInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={newFamilyMember.age}
                    onChange={handleFamilyInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <select
                    name="gender"
                    value={newFamilyMember.gender}
                    onChange={handleFamilyInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="DOB" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="DOB"
                    name="DOB"
                    value={newFamilyMember.DOB}
                    onChange={handleFamilyInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    value={newFamilyMember.height}
                    onChange={handleFamilyInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    value={newFamilyMember.weight}
                    onChange={handleFamilyInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="eyeSight"
                    value={newFamilyMember.eyeSight}
                    onChange={handleFamilyInputChange}
                    placeholder="Eye Sight"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <input
                    type="number"
                    name="BMI"
                    value={newFamilyMember.BMI}
                    onChange={handleFamilyInputChange}
                    placeholder="BMI"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <input
                    type="text"
                    name="BP"
                    value={newFamilyMember.BP}
                    onChange={handleFamilyInputChange}
                    placeholder="BP"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <select
                  name="relation"
                  value={newFamilyMember.relation}
                  onChange={handleFamilyInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Relation</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Wife">Wife</option>
                  <option value="Husband">Husband</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                </select>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowFamilyForm(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFamilyMember}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300"
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