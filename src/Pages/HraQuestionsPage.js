import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const BASE_URL = "https://api.credenthealth.com";

const HraQuestionsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // default All
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [staffId, setStaffId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // for one-question-at-a-time
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupDetails, setPopupDetails] = useState(null);

  const navigate = useNavigate();

  // Get staffId from localStorage
  useEffect(() => {
    const storedStaffId = localStorage.getItem("staffId");
    if (storedStaffId) {
      setStaffId(storedStaffId);
    } else {
      setError("Staff ID not found in localStorage");
    }
  }, []);

// Fetch categories
useEffect(() => {
  if (!staffId) return;

  axios
    .get(`${BASE_URL}/api/staff/allhracat/${staffId}`)
    .then((res) => {
      if (res.data && res.data.hras && res.data.hras.length > 0) {
        // prepend All option
        setCategories([{ hraName: "All" }, ...res.data.hras]);
      } else {
        setCategories([{ hraName: "All" }]);
      }
    })
    .catch(() => setError("No categories found"));
}, [staffId]);


  // Fetch questions (All / Category)
  useEffect(() => {
    setLoading(true);
    let url = `${BASE_URL}/api/admin/hra-questions`;

    if (selectedCategory && selectedCategory !== "All") {
      url = `${BASE_URL}/api/admin/hra-questions?hraCategoryName=${selectedCategory}`;
    }

    axios
      .get(url)
      .then((res) => {
        if (res.data.hraQuestions) {
          setQuestions(res.data.hraQuestions);
          setCurrentIndex(0); // reset to first question
        } else {
          setQuestions([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No HRA questions");
        setLoading(false);
      });
  }, [selectedCategory]);

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.keys(answers).map((qId) => ({
      questionId: qId,
      selectedOption: answers[qId],
    }));

    const payload = { staffId, answers: formattedAnswers };

    axios
      .post(`${BASE_URL}/api/staff/submit-hra-answers`, payload)
      .then((res) => {
        setPopupMessage(res.data.message);
        setPopupDetails({
          totalPoints: res.data.totalPoints,
          riskLevel: res.data.riskLevel,
          riskMessage: res.data.riskMessage,
        });
      })
      .catch((err) =>
        alert(`Error: ${err.response ? err.response.data.message : err.message}`)
      );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4 text-black">HRA</h2>
        <p className="text-lg font-semibold text-center mb-6">Testing</p>

        {/* Dropdown */}
        <div className="flex justify-center mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat.hraName}>
                {cat.hraName}
              </option>
            ))}
          </select>
        </div>

        {/* Questions */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : questions.length > 0 ? (
          <div>
            {/* Progress */}
            <p className="text-center font-medium mb-4">
              Question {currentIndex + 1} of {questions.length}
            </p>

            {/* Single Question */}
            <div className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h3 className="font-semibold mb-3">
                {currentIndex + 1}. {questions[currentIndex].question}
              </h3>
              <div className="space-y-3">
                {questions[currentIndex].options.map((opt) => (
                  <label
                    key={opt._id}
                    className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${questions[currentIndex]._id}`}
                      checked={answers[questions[currentIndex]._id] === opt._id}
                      onChange={() =>
                        handleAnswerSelect(questions[currentIndex]._id, opt._id)
                      }
                      className="h-5 w-5 text-blue-600"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`px-6 py-2 rounded-md ${
                  currentIndex === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No questions found.</p>
        )}
      </div>

      {/* Popup */}
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-center">{popupMessage}</h3>
            <div className="mt-4 text-center">
              <p>Total Points: {popupDetails.totalPoints}</p>
              <p>Risk Level: {popupDetails.riskLevel}</p>
              <p>{popupDetails.riskMessage}</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setPopupMessage(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HraQuestionsPage;
