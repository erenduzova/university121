// src/components/AddCourse.js

import React, { useState } from "react";

function AddCourse({ courseContract, onCourseAdded }) {
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!courseName) {
      alert("Please enter a course name.");
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

      // Optional: Log the runner's address (signer's address)
      const signerAddress = await courseContract.runner.getAddress();
      console.log("Signer Address in AddCourse.js:", signerAddress);

      // Call the addCourse function from the contract
      const tx = await courseContract.addCourse(courseName);
      await tx.wait();

      setMessage("Course added successfully!");
      setCourseName("");

      // Trigger the refresh callback
      if (onCourseAdded) {
        onCourseAdded();
      }
    } catch (error) {
      console.error("Error adding course:", error);

      let errorMessage = "An error occurred while adding the course.";
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
      <h2>Add Course</h2>
      <form onSubmit={handleAddCourse}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding Course..." : "Add Course"}
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

export default AddCourse;
