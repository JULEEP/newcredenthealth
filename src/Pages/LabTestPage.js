import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCartPlus, FaCheck, FaChevronDown, FaChevronUp, FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const LabTestPage = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openTestId, setOpenTestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const staffId = localStorage.getItem('staffId');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('https://api.credenthealth.com/api/admin/alltests');
        if (response.data && response.data.tests) {
          setTests(response.data.tests);
          setFilteredTests(response.data.tests);
        } else {
          setError('No tests data found');
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Filter tests based on search
  useEffect(() => {
    const filtered = tests.filter((test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTests(filtered);
  }, [searchTerm, tests]);

  const openModal = (test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
  };

  const addToCart = async () => {
    if (!staffId) {
      alert('Staff ID not found in localStorage!');
      return;
    }

    try {
      const response = await axios.post(
        `https://api.credenthealth.com/api/staff/addcart/${staffId}`,
        { itemId: selectedTest._id, action: 'inc' }
      );

      if (response.status === 200) {
        alert('Item added to cart successfully!');
        closeModal();
        navigate('/cart');
      } else {
        alert('Failed to add item to cart');
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      alert('Error adding item to cart');
    }
  };

  const toggleDetails = (testId) => {
    setOpenTestId(openTestId === testId ? null : testId);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="py-6 px-4 sm:px-6 lg:px-8 flex-1">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Lab Tests</h1>

        {/* Search Box */}
        <div className="flex justify-end mb-6">
          <div className="relative w-full max-w-md mb-6">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lab tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {loading && <p className="text-center text-lg text-gray-600">Loading tests...</p>}
        {error && <p className="text-center text-lg text-red-500">{error}</p>}

        {/* Popular Tests Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Tests</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div
                key={test._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-all duration-300"
              >
                {/* Top row: Name + Price */}
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-base font-semibold text-gray-800 relative group pb-1">
                    {test.name}
                    <span className="absolute left-0 bottom-0 mt-2 h-1 bg-blue-500 rounded w-1/4 animate-underline"></span>
                  </h2>
                  <span className="text-base font-semibold text-gray-800">₹{test.price}</span>
                </div>

                {/* Small details */}
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{test.fastingRequired ? 'Fasting Required' : 'No Fasting'}</span>
                  <span>Onwards</span>
                </div>

                {/* Home collection badge */}
                {test.homeCollectionAvailable && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mb-2">
                    <FaCheck className="inline mr-1" /> Home Collection Available
                  </span>
                )}

                {/* More info / Book Now */}
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <button
                    className="flex items-center gap-1 font-medium hover:text-gray-700 transition-colors"
                    onClick={() => toggleDetails(test._id)}
                  >
                    {openTestId === test._id ? <FaChevronUp /> : <FaChevronDown />}
                    {openTestId === test._id ? "Less info" : "More info"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      className="text-white bg-[#2E67F6] px-3 py-2 rounded hover:bg-[#2559cc] transition-colors"
                      onClick={() => openModal(test)}
                    >
                      Book Now
                    </button>
                    <div className="bg-blue-100 text-[#2E67F6] rounded-full w-7 h-7 flex items-center justify-center">
                      <FaPlus className="w-4 h-4" onClick={() => openModal(test)} />
                    </div>
                  </div>
                </div>

                {/* Description / Instruction */}
                {openTestId === test._id && (
                  <div className="mt-2 p-3 rounded border border-blue-100">
                    {test.description && (
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">Description</h3>
                        <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{test.description}</p>
                      </div>
                    )}
                    {test.instruction && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">Instructions</h3>
                        <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{test.instruction}</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500 col-span-full">No lab tests available.</p>
          )}
        </div>
      </main>

      {/* Modal for Add to Cart Confirmation */}
      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add to Cart</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to add <strong>{selectedTest.name}</strong> to your cart?
            </p>

            <div className="flex justify-between space-x-4">
              <button
                className="flex-1 text-white bg-gray-600 p-3 rounded-full hover:bg-gray-500 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="flex-1 text-white bg-[#2E67F6] p-3 rounded-full hover:bg-[#2559cc] transition-colors"
                onClick={addToCart}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LabTestPage;
