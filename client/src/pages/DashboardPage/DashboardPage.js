// src/pages/DashboardPage.js

import React from "react";
import CourseList from "../../components/CourseList";
import AddCourse from "../../components/AddCourse";
import StudentDashboard from "../../components/StudentDashboard";
import GrantInstructor from "../../components/GrantInstructor";

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

  return (
    <div>
      {isInstructor && (
        <AddCourse
          courseContract={courseContract}
          onCourseAdded={() => setRefreshCourses(!refreshCourses)}
        />
      )}
      {isAdmin && (
        <GrantInstructor courseContract={courseContract} account={account} />
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
  );
}

export default DashboardPage;
