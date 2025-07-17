// File: src/App.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle, Share2, Upload } from "lucide-react";
import "./TFG.css";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // Replace with your actual URL

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    college: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [clickCount, setClickCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("techForGirlsSubmitted")) {
      setSubmitted(true);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters.";
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be exactly 10 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.college.trim()) newErrors.college = "College/Department is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleWhatsAppShare = () => {
    if (clickCount < 5) {
      const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
      const url = `https://wa.me/?text=${message}`;
      window.open(url, "_blank");
      setClickCount(prev => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (clickCount < 5) {
      alert("Please complete the 5 WhatsApp shares before submitting.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("phone", formData.phone);
    submissionData.append("email", formData.email);
    submissionData.append("college", formData.college);
    submissionData.append("file", formData.file);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: submissionData,
      });
      setSubmitted(true);
      localStorage.setItem("techForGirlsSubmitted", true);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-container">
        <h2>Tech For Girls Registration</h2>
        {submitted ? (
          <div className="thank-you">
            <CheckCircle size={48} color="green" />
            <p>🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleInputChange} required disabled={submitted} />
            {errors.name && <p className="error-text">{errors.name}</p>}

            <input name="phone" type="number" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required disabled={submitted} />
            {errors.phone && <p className="error-text">{errors.phone}</p>}

            <input name="email" type="email" placeholder="Email ID" value={formData.email} onChange={handleInputChange} required disabled={submitted} />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <input name="college" type="text" placeholder="College/Department" value={formData.college} onChange={handleInputChange} required disabled={submitted} />
            {errors.college && <p className="error-text">{errors.college}</p>}

            <div className="file-upload">
              <label htmlFor="screenshot">
                <Upload size={20} /> Upload Screenshot
              </label>
              <input id="screenshot" type="file" accept="image/*,application/pdf" onChange={handleFileChange} disabled={submitted} />
            </div>

            <button type="button" onClick={handleWhatsAppShare} disabled={clickCount >= 5 || submitted}>
              <Share2 size={16} /> Share on WhatsApp
            </button>
            <p>Click count: {clickCount}/5</p>
            {clickCount >= 5 && <p>Sharing complete. Please continue.</p>}

            <button type="submit" disabled={submitted}>Submit Registration</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;
