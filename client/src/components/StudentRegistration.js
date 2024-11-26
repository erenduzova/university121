// src/components/StudentRegistration.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentRegistration({ studentContract, onRegister }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const registerStudent = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    try {
      const tx = await studentContract.registerStudent(name);
      await tx.wait();
      alert("Registration successful!");
      setName("");
      if (onRegister) {
        onRegister();
      }
      // Navigate to dashboard
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="my-4">
      <h2>Register</h2>
      <input
        type="text"
        className="form-control my-2"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn btn-primary" onClick={registerStudent}>
        Register
      </button>
    </div>
  );
}

export default StudentRegistration;
