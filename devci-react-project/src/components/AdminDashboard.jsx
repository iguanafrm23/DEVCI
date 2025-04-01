import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGOUT from './LOGOUT';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [hospital, setHospital] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [errors, setErrors] = useState({});
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const navigate = useNavigate();

    // Fetch data from localStorage on component mount
    useEffect(() => {
        const storedAuditLogs = JSON.parse(localStorage.getItem("auditLogs")) || [];
        setAuditLogs(storedAuditLogs);

        const storedPrescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
        setPrescriptions(storedPrescriptions);
    }, []);

    const validate = () => {
        const validationErrors = {};
        if (!name) validationErrors.name = "Doctor's ID is required";
        if (!email) {
            validationErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = "Invalid email format";
        }
        if (!hospital) validationErrors.hospital = "Hospital name is required";
        if (!specialization) validationErrors.specialization = "Specialization is required";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") setName(value);
        else if (name === "hospital") setHospital(value);
        else if (name === "email") setEmail(value);
        else if (name === "specialization") setSpecialization(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const doctorData = { id: Date.now(), name, email, hospital, specialization };

        if (editingDoctor !== null) {
            setDoctors(doctors.map(doc => doc.id === editingDoctor ? doctorData : doc));
            setEditingDoctor(null);
            alert("Doctor updated successfully!");
        } else {
            setDoctors([...doctors, doctorData]);
        }

        setName("");
        setEmail("");
        setHospital("");
        setSpecialization("");
    };

    const handleDelete = (doctorId) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        setDoctors(doctors.filter(doc => doc.id !== doctorId));
    };

    const handleEdit = (doctorId) => {
        const doctor = doctors.find((doc) => doc.id === doctorId);
        if (!doctor) return;

        setName(doctor.name);
        setEmail(doctor.email);
        setHospital(doctor.hospital);
        setSpecialization(doctor.specialization);
        setEditingDoctor(doctor.id);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-center mb-4">ADMIN'S DASHBOARD</h1>

            {/* Doctor Registration Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">{editingDoctor !== null ? "Edit Doctor" : "Register Doctor"}</h2>

                <label className="block font-semibold">Doctor's ID:</label>
                <input type="text" name="name" value={name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mb-4" />
                {errors.name && <span className="text-red-500 text-xs italic">{errors.name}</span>}

                <label className="block font-semibold">Hospital:</label>
                <input type="text" name="hospital" value={hospital} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mb-4" />
                {errors.hospital && <span className="text-red-500 text-xs italic">{errors.hospital}</span>}

                <label className="block font-semibold">Email Address:</label>
                <input type="email" name="email" value={email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mb-4" />
                {errors.email && <span className="text-red-500 text-xs italic">{errors.email}</span>}

                <label className="block font-semibold">Specialization:</label>
                <input type="text" name="specialization" value={specialization} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mb-4" />
                {errors.specialization && <span className="text-red-500 text-xs italic">{errors.specialization}</span>}

                <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded w-full" type="submit">
                    {editingDoctor !== null ? "Update Doctor" : "Register Doctor"}
                </button>
            </form>

            {/* Doctors List */}
            <div className="w-full max-w-2xl mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Registered Doctors</h2>
                {doctors.length === 0 ? (
                    <p className="text-gray-500">No doctors registered.</p>
                ) : (
                    <ul>
                        {doctors.map((doctor) => (
                            <li key={doctor.id} className="flex justify-between items-center border-b py-2">
                                <div>
                                    <p><strong>ID:</strong> {doctor.name}</p>
                                    <p><strong>Hospital:</strong> {doctor.hospital}</p>
                                    <p><strong>Email:</strong> {doctor.email}</p>
                                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                                </div>
                                <div>
                                    <button onClick={() => handleEdit(doctor.id)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700">Edit</button>
                                    <button onClick={() => handleDelete(doctor.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pharmacist Audit Logs */}
            <div className="w-full max-w-2xl mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Pharmacist Audit Logs</h2>
                {auditLogs.length === 0 ? (
                    <p className="text-gray-500">No audit logs available.</p>
                ) : (
                    <ul>
                        {auditLogs.map((log) => (
                            <li key={log.id} className="border-b py-2">
                                <p><strong>Pharmacist:</strong> {log.pharmacistName}</p>
                                <p><strong>Medication Issued:</strong> {log.medication}</p>
                                <p><strong>Transaction Status:</strong> {log.status}</p>
                                <p><strong>Time:</strong> {log.time}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Doctors' Prescriptions */}
            <div className="w-full max-w-2xl mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Doctors' Prescriptions</h2>
                {prescriptions.length === 0 ? (
                    <p className="text-gray-500">No prescriptions available.</p>
                ) : (
                    <ul>
                        {prescriptions.map((prescription) => (
                            <li key={prescription.id} className="border-b py-2">
                                <p><strong>Doctor:</strong> {prescription.doctorName}</p>
                                <p><strong>Patient:</strong> {prescription.patientName}</p>
                                <p><strong>Medication:</strong> {prescription.medication}</p>
                                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <LOGOUT />
        </div>
    );
};

export default AdminDashboard;

