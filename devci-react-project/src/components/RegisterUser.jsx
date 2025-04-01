import { useState } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    role: "doctor",
    specialization: "",
    hospital: "",
    license_number: "",
    access_level: "basic",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { ...formData };
    if (formData.role !== "doctor") {
      delete userData.specialization;
      delete userData.hospital;
    }
    if (formData.role !== "pharmacist") {
      delete userData.license_number;
    }
    if (formData.role !== "admin") {
      delete userData.access_level;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful!");
      } else {
        setMessage(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      setMessage("Registration failed: Server error");
    }
  };

  return (
    <div>
      <h2>Register User</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required />
        
        <select name="role" onChange={handleChange} required>
          <option value="doctor">Doctor</option>
          <option value="pharmacist">Pharmacist</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === "doctor" && (
          <>
            <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} required />
            <input type="text" name="hospital" placeholder="Hospital" onChange={handleChange} required />
          </>
        )}
        
        {formData.role === "pharmacist" && (
          <input type="text" name="license_number" placeholder="License Number" onChange={handleChange} required />
        )}
        
        {formData.role === "admin" && (
          <select name="access_level" onChange={handleChange} required>
            <option value="basic">Basic</option>
            <option value="super">Super</option>
          </select>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
