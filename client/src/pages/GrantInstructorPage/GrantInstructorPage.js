// src/pages/GrantInstructorPage/GrantInstructorPage.js

import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import GrantInstructor from "../../components/GrantInstructor/GrantInstructor";
import "./GrantInstructorPage.css";

function GrantInstructorPage({
  courseContract,
  studentContract,
  account,
  isInstructor,
  isAdmin,
}) {
  return (
    <div className="grant-instructor-page">
      <Sidebar
        studentContract={studentContract}
        account={account}
        isInstructor={isInstructor}
        isAdmin={isAdmin}
      />
      <div className="grant-instructor-content">
        <h1>Eğitmen Rolü Ver</h1>
        <GrantInstructor courseContract={courseContract} account={account} />
      </div>
    </div>
  );
}

export default GrantInstructorPage;
