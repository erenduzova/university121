import React, { useState } from "react";

function GrantInstructor({ courseContract, account }) {
  const [addressToGrant, setAddressToGrant] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGrant = async (e) => {
    e.preventDefault();

    if (!addressToGrant) {
      alert("Please enter an address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Ensure runner is defined
      if (!courseContract.runner) {
        console.error(
          "Runner is undefined. Ensure the contract is connected with a signer."
        );
        setMessage("Contract runner is undefined.");
        return;
      }

      // Access the runner (signer) and get the address
      const signerAddress = await courseContract.runner.getAddress();
      console.log("Signer Address in GrantInstructor.js:", signerAddress);

      // Confirm that the signer is the admin account
      if (signerAddress.toLowerCase() !== account.toLowerCase()) {
        console.error("Signer address does not match account.");
        setMessage("Signer address does not match account.");
        return;
      }

      // Log the address to grant
      console.log("Address to grant:", addressToGrant);

      // Grant the INSTRUCTOR_ROLE to the specified address
      const tx = await courseContract.grantInstructorRole(addressToGrant);
      await tx.wait();

      setMessage(`Instructor role granted to ${addressToGrant}`);
      setAddressToGrant("");
    } catch (error) {
      console.error("Error granting instructor role:", error);

      let errorMessage = "Failed to grant instructor role.";

      // Extract error message from different possible structures
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <h2>Grant Instructor Role</h2>
      <form onSubmit={handleGrant}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Account Address"
            value={addressToGrant}
            onChange={(e) => setAddressToGrant(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Granting..." : "Grant Role"}
        </button>
      </form>
      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}

export default GrantInstructor;
