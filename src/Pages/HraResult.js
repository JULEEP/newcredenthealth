import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { BiArrowBack } from "react-icons/bi";

const HraResult = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    console.log("HRA Result State:", state);

    const { 
        riskLevel = "Unknown", 
        riskMessage = "No risk assessment available", 
        totalQuestions = 0, 
        answeredQuestions = 0,
        prescribedForCategories = {},
        message = ""
    } = state || {};

    const percentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    
    // Proper circle calculations
    const radius = 40; // ViewBox ke according radius
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-md mx-auto flex items-center justify-center relative py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 text-gray-600 hover:text-black transition flex items-center gap-1 border border-1 rounded-md px-2 py-1"
                >
                    <BiArrowBack /> Back
                </button>

                <h2 className="text-xl font-bold text-center">HRA</h2>
            </div>

            <div className="flex flex-col items-center justify-center px-6 pb-20 pt-4 max-w-md mx-auto text-center">
                <h2 className="text-xl font-bold mb-6">Health Risk Assessment Result</h2>

                <div className="w-full bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="text-left flex-1">
                            <p className="text-black-600 font-medium text-lg">
                                Your answers have been recorded
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Assessment completed successfully
                            </p>
                        </div>
                        
                        <div className="relative flex-shrink-0">
                            {/* Outer container */}
                            <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-500 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-blue-600 font-bold text-lg">
                                        {answeredQuestions}/{totalQuestions}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress circle - FIXED */}
                            <svg className="absolute top-0 left-0 w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="8"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-600 mb-2">
                        Your Health Risk Level:{" "}
                        <span className={`font-bold ${
                            riskLevel.toLowerCase().includes('low') ? 'text-green-600' :
                            riskLevel.toLowerCase().includes('moderate') ? 'text-yellow-600' :
                            riskLevel.toLowerCase().includes('high') ? 'text-red-600' :
                            'text-black'
                        }`}>
                            {riskLevel} Risk
                        </span>
                    </p>
                    
                    {Object.keys(prescribedForCategories).length > 0 ? (
                        <div className="mt-4">
                            <h4 className="text-md font-semibold text-gray-700 mb-3">
                                Prescribed Action:
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(prescribedForCategories).map(([category, recommendation]) => (
                                    <div key={category} className="bg-white border border-gray-200 rounded-lg p-3 text-left">
                                        <p className="text-sm text-gray-700">{recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600 mt-2">
                            Recommended Action:{" "}
                            <span className="text-black">{riskMessage}</span>
                        </p>
                    )}
                </div>

                <div className="w-full text-center">
                    <h3 className="text-lg font-bold mt-8">Congratulations!</h3>
                    <img
                        src="/trophy.png"
                        alt="Trophy"
                        className="w-16 h-16 mx-auto my-3"
                    />

                    <p className="text-gray-700">
                        🎉 You've successfully completed your Health Risk Assessment!
                    </p>

                    <button
                        onClick={() => navigate("/questions")}
                        className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HraResult;