// src/components/StudentDashboard.js

import React, { useState, useEffect } from "react";

function StudentDashboard({
  studentContract,
  courseContract,
  account,
  refresh,
}) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      try {
        // Fetch enrolled course IDs
        const courseIds = await studentContract.getEnrolledCourses(account);

        // Fetch course details for each enrolled course
        const coursePromises = courseIds.map(async (courseIdBN) => {
          const courseId = Number(courseIdBN);
          const course = await courseContract.courses(courseId);
          const instructorAddress = course.instructor;

          // Try to get the instructor's name
          let instructorName;
          try {
            instructorName = await studentContract.getStudentName(
              instructorAddress
            );
            if (!instructorName) {
              instructorName = "Unknown Instructor";
            }
          } catch {
            instructorName = instructorAddress;
          }

          return {
            id: courseId,
            name: course.name,
            instructor: instructorName,
          };
        });

        const coursesData = await Promise.all(coursePromises);
        setEnrolledCourses(coursesData);
      } catch (error) {
        console.error("Error loading enrolled courses:", error);
      }
    };

    if (studentContract && courseContract && account) {
      loadEnrolledCourses();
    }
  }, [studentContract, courseContract, account, refresh]);

  return (
    <div className="my-4">
      <h2>Your Enrolled Courses</h2>
      {enrolledCourses.length > 0 ? (
        <ul className="list-group">
          {enrolledCourses.map((course) => (
            <li key={course.id} className="list-group-item">
              <strong>{course.name}</strong> (ID: {course.id})
              <br />
              Instructor: {course.instructor}
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not enrolled in any courses.</p>
      )}
    </div>
  );
}

export default StudentDashboard;
