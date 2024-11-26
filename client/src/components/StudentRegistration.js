import React, { useState } from "react";

function StudentRegistration({ studentContract }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const registerStudent = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    try {
      setMessage("");

      // Ensure runner is defined
      if (!studentContract.runner) {
        console.error(
          "Runner is undefined. Ensure the contract is connected with a signer."
        );
        setMessage("Contract runner is undefined.");
        return;
      }

      // Optional: Log the runner's address (signer's address)
      const signerAddress = await studentContract.runner.getAddress();
      console.log("Signer Address in StudentRegistration.js:", signerAddress);

      const tx = await studentContract.registerStudent(name);
      await tx.wait();
      setMessage("Student registered successfully!");
      setName("");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "An error occurred during registration.";
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.error && error.error.reason) {
        errorMessage = error.error.reason;
      } else if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (error.info && error.info.error && error.info.error.message) {
        errorMessage = error.info.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
    }
  };

  return (
    <div className="my-4">
      <h2>Register Student</h2>
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
      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}

export default StudentRegistration;
