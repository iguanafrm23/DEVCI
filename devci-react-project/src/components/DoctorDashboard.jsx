import React, { useState, useEffect } from "react";
import LOGOUT from "./LOGOUT";
// import { prescriptionService } from "../services/api";

const DoctorDashboard = () => {
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [info, setInfo] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch prescriptions from backend
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoadingPrescriptions(true);
        const data = await prescriptionService.getDoctorPrescriptions(user.id);
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    if (user && user.id) {
      fetchPrescriptions();
    }
  }, [user?.id]);

  const validate = () => {
    const validationErrors = {};
    if (!patientName) validationErrors.patientName = "Patient name is required";
    if (!patientAge) validationErrors.patientAge = "Age is required";
    if (!info) validationErrors.info = "Contact is required";
    if (!medication) validationErrors.medication = "Medicine is required";
    if (!dosage) validationErrors.dosage = "Please select a dosage";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientName") setPatientName(value);
    else if (name === "patientAge") setPatientAge(value);
    else if (name === "info") setInfo(value);
    else if (name === "medication") setMedication(value);
    else if (name === "dosage") setDosage(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newPrescription = {
      doctor_id: user.id,
      patientName,
      patientAge,
      contact: info,
      medication,
      dosage,
      instructions: message,
    };

    try {
      setLoading(true);
      const savedPrescription = await prescriptionService.createPrescription(newPrescription);
      setPrescriptions([savedPrescription, ...prescriptions]);

      alert("Patient prescription is saved ✅");

      // Clear input fields
      setPatientName("");
      setPatientAge("");
      setInfo("");
      setMedication("");
      setDosage("");
      setMessage("");
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-400 flex-col">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Doctor's Prescription</h2>

        <div className="mb-4">
          <label className="block font-semibold">Patient's Name:</label>
          <input
            type="text"
            name="patientName"
            value={patientName}
            onChange={handleChange}
            placeholder="Enter patient's name"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          {errors.patientName && <span className="text-red-500 text-sm">{errors.patientName}</span>}
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Patient's Age:</label>
          <input
            type="text"
            name="patientAge"
            value={patientAge}
            onChange={handleChange}
            placeholder="Enter age"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          {errors.patientAge && <span className="text-red-500 text-sm">{errors.patientAge}</span>}
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Contact:</label>
          <input
            type="text"
            name="info"
            value={info}
            onChange={handleChange}
            placeholder="Enter contact number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          {errors.info && <span className="text-red-500 text-sm">{errors.info}</span>}
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Medicine Name:</label>
          <input
            type="text"
            name="medication"
            value={medication}
            onChange={handleChange}
            placeholder="Enter medicine name"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          {errors.medication && <span className="text-red-500 text-sm">{errors.medication}</span>}
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Select Dosage:</label>
          <select
            name="dosage"
            value={dosage}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select dosage</option>
            <option value="1×2">1×2</option>
            <option value="2×2">2×2</option>
            <option value="2×3">2×3</option>
            <option value="2×4">2×4</option>
            <option value="3×3">3×3</option>
            <option value="3×1">3×1</option>
          </select>
          {errors.dosage && <span className="text-red-500 text-sm">{errors.dosage}</span>}
        </div>

        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Instructions for medication"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        ></textarea>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? "Saving..." : "Set Prescription"}
        </button>
      </form>

      {/* Patient Logs - View Saved Prescriptions */}
      <div className="w-full max-w-2xl mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Patient Logs</h2>
        
        {loadingPrescriptions ? (
          <p className="text-gray-500">Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions recorded yet.</p>
        ) : (
          <ul>
            {prescriptions.map((prescription) => (
              <li key={prescription.id} className="border-b py-2">
                <p><strong>Doctor:</strong> {prescription.doctor_name}</p>
                <p><strong>Patient:</strong> {prescription.patientName}</p>
                <p><strong>Age:</strong> {prescription.patientAge}</p>
                <p><strong>Contact:</strong> {prescription.contact}</p>
                <p><strong>Medication:</strong> {prescription.medication}</p>
                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                <p><strong>Instructions:</strong> {prescription.instructions || "N/A"}</p>
                <p><strong>Status:</strong> {prescription.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <LOGOUT />
    </div>
  );
};

export default DoctorDashboard;