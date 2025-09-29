import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { FaPlus, FaUser, FaEdit, FaTrash } from "react-icons/fa";

const FamilyPage = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    fullName: "",
    mobileNumber: "",
    age: "",
    gender: "",
    DOB: "",
    height: "",
    weight: "",
    eyeSight: "",
    BMI: "",
    BP: "",
    relation: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Retrieve staffId from localStorage
  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    if (staffId) {
      // Fetch all family members
      axios
        .get(`https://api.credenthealth.com/api/staff/getallfamily/${staffId}`)
        .then((response) => {
          setFamilyMembers(response.data.family_members);
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching family members");
          setLoading(false);
        });
    } else {
      setError("No staffId found in localStorage");
      setLoading(false);
    }
  }, [staffId]);

  const handleInputChange = (e) => {
    setNewFamilyMember({
      ...newFamilyMember,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode && selectedMember) {
      // Update family member API call
      axios
        .put(
          `https://api.credenthealth.com/api/staff/update-family/${staffId}/${selectedMember._id}`,
          newFamilyMember
        )
        .then((response) => {
          const updatedFamilyMembers = familyMembers.map((member) =>
            member._id === selectedMember._id
              ? response.data.family_member
              : member
          );
          setFamilyMembers(updatedFamilyMembers);
          resetForm();
        })
        .catch(() => setError("Error updating family member"));
    } else {
      // Add new family member API call
      axios
        .post(
          `https://api.credenthealth.com/api/staff/create-family/${staffId}`,
          newFamilyMember
        )
        .then((response) => {
          setFamilyMembers([...familyMembers, response.data.family_member]);
          resetForm();
        })
        .catch(() => setError("Error adding family member"));
    }
  };

  const resetForm = () => {
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
      BMI: "",
      BP: "",
      description: ""
    });
    setEditMode(false);
    setSelectedMember(null);
    setIsFormVisible(false); // back to list
  };

  const handleEdit = (member) => {
    setNewFamilyMember({
      fullName: member.fullName,
      mobileNumber: member.mobileNumber,
      age: member.age,
      gender: member.gender,
      DOB: member.DOB,
      height: member.height,
      weight: member.weight,
      relation: member.relation,
      eyeSight: member.eyeSight,
      BMI: member.BMI,
      BP: member.BP,
      description: member.description
    });
    setEditMode(true);
    setSelectedMember(member);
    setIsFormVisible(true); // show form
  };

  const handleRemove = (memberId) => {
    axios
      .delete(
        `https://api.credenthealth.com/api/staff/remove-family/${staffId}/${memberId}`
      )
      .then(() => {
        setFamilyMembers(
          familyMembers.filter((member) => member._id !== memberId)
        );
      })
      .catch(() => setError("Error removing family member"));
  };

  const genderOptions = ["Male", "Female", "Other"];
  const relationOptions = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Spouse",
    "Friend",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
        <div className="flex-grow px-4 py-6">
          {!isFormVisible ? (
            <>
              {/* List Page */}
              <h2 className="text-xl font-bold mb-6">Family Members</h2>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              {/* Add button */}
              <button
                onClick={() => setIsFormVisible(true)}
                className="flex items-center border border-blue-500 bg-white text-blue-500 py-3 px-4 rounded-lg w-full mb-6 font-medium"
              >
                {/* Icon with blue background */}
                <div className="bg-blue-500 text-white p-2 rounded-full mr-2 flex items-center justify-center">
                  <FaPlus size={16} />
                </div>
                Add your family members
              </button>


              {/* Members List */}
              {loading && (
                <p className="text-center text-gray-600">Loading...</p>
              )}
              {familyMembers.length === 0 && !loading && (
                <p className="text-center text-gray-600">
                  No family members found.
                </p>
              )}

              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    {/* Left side - person icon + details */}
                    <div className="flex items-center space-x-3">
                      <FaUser size={30} className="text-blue-500" />
                      <div>
                        <p className="font-bold text-gray-800">
                          {member.fullName}
                        </p>
                        <p className="text-gray-600">
                          {member.relation} | Age: {member.age} | {member.gender}
                        </p>
                      </div>
                    </div>

                    {/* Right side - actions */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleRemove(member._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Form Page */}
              <h2 className="text-xl font-bold mb-6">
                {editMode ? "Edit Family Member" : "Add Your Family Members"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  value={newFamilyMember.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full p-3 border rounded"
                />

                <select
                  name="relation"
                  value={newFamilyMember.relation}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded"
                >
                  <option value="">Select Relation</option>
                  {relationOptions.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="mobileNumber"
                  value={newFamilyMember.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className="w-full p-3 border rounded"
                />

                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="age"
                    value={newFamilyMember.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                    className="w-1/2 p-3 border rounded"
                  />
                  <select
                    name="gender"
                    value={newFamilyMember.gender}
                    onChange={handleInputChange}
                    className="w-1/2 p-3 border rounded"
                  >
                    <option value="">Gender</option>
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="date"
                  name="DOB"
                  value={newFamilyMember.DOB}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded"
                />

                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="height"
                    value={newFamilyMember.height}
                    onChange={handleInputChange}
                    placeholder="Height (cm)"
                    className="w-1/2 p-3 border rounded"
                  />
                  <input
                    type="number"
                    name="weight"
                    value={newFamilyMember.weight}
                    onChange={handleInputChange}
                    placeholder="Weight (kg)"
                    className="w-1/2 p-3 border rounded"
                  />
                </div>

                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="eyeSight"
                    value={newFamilyMember.eyeSight}
                    onChange={handleInputChange}
                    placeholder="Eye Sight"
                    className="w-1/3 p-3 border rounded"
                  />
                  <input
                    type="number"
                    name="BMI"
                    value={newFamilyMember.BMI}
                    onChange={handleInputChange}
                    placeholder="BMI"
                    className="w-1/3 p-3 border rounded"
                  />
                  <input
                    type="text"
                    name="BP"
                    value={newFamilyMember.BP}
                    onChange={handleInputChange}
                    placeholder="BP"
                    className="w-1/3 p-3 border rounded"
                  />
                </div>

                <textarea
                  name="description"
                  value={newFamilyMember.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-3 border rounded"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg mt-2"
                >
                  Cancel
                </button>
              </form>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyPage;
