// src/components/GrantInstructor/GrantInstructor.js

import React, { useState } from "react";
import "./GrantInstructor.css";

function GrantInstructor({ courseContract, account }) {
  const [addressToGrant, setAddressToGrant] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGrant = async (e) => {
    e.preventDefault();

    if (!addressToGrant) {
      alert("Lütfen bir adres girin.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Call the grantInstructorRole function from the contract
      const tx = await courseContract.grantInstructorRole(addressToGrant);
      await tx.wait();

      setMessage(`Instructor rolü ${addressToGrant} adresine verildi.`);
      setAddressToGrant("");
    } catch (error) {
      console.error("Error granting instructor role:", error);

      let errorMessage = "Instructor rolü verilirken bir hata oluştu.";
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grant-instructor-form">
      <form onSubmit={handleGrant}>
        <div className="form-group">
          <label>Hesap Adresi</label>
          <input
            type="text"
            className="form-control"
            placeholder="Adres girin"
            value={addressToGrant}
            onChange={(e) => setAddressToGrant(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Veriliyor..." : "Eğitmen Rolü Ver"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default GrantInstructor;
