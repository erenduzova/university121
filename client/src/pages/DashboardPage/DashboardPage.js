// src/pages/DashboardPage.js

import React, { useEffect, useState } from "react";
import CourseList from "../../components/CourseList";
import AddCourse from "../../components/AddCourse";
import StudentDashboard from "../../components/StudentDashboard";
import GrantInstructor from "../../components/GrantInstructor";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./DashboardPage.css";

function DashboardPage(props) {
  const {
    isInstructor,
    isAdmin,
    courseContract,
    studentContract,
    account,
    refreshCourses,
    setRefreshCourses,
    refreshEnrollment,
    setRefreshEnrollment,
  } = props;

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    headline: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const student = await studentContract.students(account);
        const firstName = student.firstName;
        const lastName = student.lastName;
        const headline = student.headline;

        setUser({ firstName, lastName, headline });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (studentContract && account) {
      fetchUserData();
    }
  }, [studentContract, account]);

  const handleLogout = () => {
    // Reset application state or navigate to login page
    // For example, you might clear user data and redirect:
    // setAccount(null);
    // setIsRegistered(false);
    // Navigate to home page
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="dashboard-content">
        {/* Your dashboard content goes here */}
        <div>
          {isInstructor && (
            <AddCourse
              courseContract={courseContract}
              onCourseAdded={() => setRefreshCourses(!refreshCourses)}
            />
          )}
          {isAdmin && (
            <GrantInstructor
              courseContract={courseContract}
              account={account}
            />
          )}
          <CourseList
            courseContract={courseContract}
            refresh={refreshCourses}
            studentContract={studentContract}
            account={account}
            onEnroll={() => setRefreshEnrollment(!refreshEnrollment)}
          />
          <StudentDashboard
            studentContract={studentContract}
            courseContract={courseContract}
            account={account}
            refresh={refreshEnrollment}
          />
        </div>
        {/* Your dashboard finishes here */}
        <h1>Welcome, {user.firstName}!</h1>
        {/* Additional content based on roles */}
      </div>
    </div>
  );
}

export default DashboardPage;
