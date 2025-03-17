import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";

const AddPet = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    animalType: "",
    breed: "",
    subBreed: "",
    age: "",
    color: "",
    markers: "",
    allergies: "",
    diet: "",
    preferences: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Make sure the token is in the headers
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      console.log("Sending pet data:", formData);
      const res = await api.post("/api/pets", formData);
      console.log("Pet created:", res.data);

      navigate("/pets");
    } catch (err) {
      console.error("Error adding pet:", err);
      setError(
        err.response?.data?.message || "Failed to add pet. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const animalTypes = [
    "Dog",
    "Cat",
    "Bird",
    "Fish",
    "Rabbit",
    "Hamster",
    "Guinea Pig",
    "Reptile",
    "Other",
  ];

  return (
    <div>
      <h1>Add a New Pet</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Pet Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="animalType">Animal Type</label>
          <select
            id="animalType"
            name="animalType"
            value={formData.animalType}
            onChange={handleChange}
            required
          >
            <option value="">Select animal type</option>
            {animalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="breed">Breed</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="subBreed">Sub-breed</label>
          <input
            type="text"
            id="subBreed"
            name="subBreed"
            value={formData.subBreed}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="age">Age (years)</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="markers">Distinctive Markers</label>
          <textarea
            id="markers"
            name="markers"
            value={formData.markers}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="allergies">Allergies</label>
          <textarea
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="diet">Diet</label>
          <textarea
            id="diet"
            name="diet"
            value={formData.diet}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="preferences">Preferences</label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding Pet..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

export default AddPet;
