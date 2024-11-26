/* global BigInt */
import React, { useState } from "react";

function Enroll({ studentContract, onEnroll }) {
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEnroll = async (e) => {
    e.preventDefault();

    if (!courseId || courseId <= 0) {
      alert("Please enter a valid course ID.");
      return;
    }

    try {
      setLoading(true);
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
      console.log("Signer Address in Enroll.js:", signerAddress);

      const tx = await studentContract.enrollInCourse(BigInt(courseId));
      await tx.wait();

      setMessage("Enrollment successful!");
      setCourseId("");

      // Trigger the refresh callback
      if (onEnroll) {
        onEnroll();
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);

      let errorMessage = "An error occurred while enrolling in the course.";
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
      <h2>Enroll in a Course</h2>
      <form onSubmit={handleEnroll}>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !courseId}
        >
          {loading ? "Enrolling..." : "Enroll"}
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

export default Enroll;
