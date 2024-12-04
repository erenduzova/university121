import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./RegistrationPage.css";

function RegistrationPage({ onRegister, studentContract, account }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Validate the input fields

    try {
      const tx = await studentContract.registerStudent(
        firstName,
        lastName,
        headline
      );
      await tx.wait();

      // Call the onRegister callback to update the state
      onRegister();
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="registration-container">
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <div className="registration-form-group">
            <label>Ad</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="registration-form-group">
            <label>Soyad</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="registration-form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Kayıt Ol
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default RegistrationPage;
