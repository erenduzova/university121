// src/pages/AddCoursePage/AddCoursePage.js

import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import AddCourse from "../../components/AddCourse/AddCourse";
import "./AddCoursePage.css";

function AddCoursePage({
  courseContract,
  studentContract,
  account,
  isInstructor,
  isAdmin,
}) {
  return (
    <div className="add-course-page">
      <Sidebar
        studentContract={studentContract}
        account={account}
        isInstructor={isInstructor}
        isAdmin={isAdmin}
      />
      <div className="add-course-content">
        <h1 className="add-course-title">Kurs Ekle</h1>
        <AddCourse courseContract={courseContract} />
      </div>
    </div>
  );
}

export default AddCoursePage;
