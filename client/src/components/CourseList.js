// src/components/CourseList.js

import React, { useState, useEffect } from "react";

function CourseList({
  courseContract,
  refresh,
  studentContract,
  account,
  onEnroll,
}) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseCountBN = await courseContract.courseCount();
        const courseCount = Number(courseCountBN);

        const courseArray = [];
        for (let i = 1; i <= courseCount; i++) {
          const course = await courseContract.courses(i);
          const instructorAddress = course.instructor;
          let instructorName;
          try {
            instructorName = await studentContract.getStudentName(
              instructorAddress
            );
          } catch {
            instructorName = "Unknown Instructor";
          }

          courseArray.push({
            id: i,
            name: course.name,
            instructor: instructorName,
          });
        }
        setCourses(courseArray);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };

    if (courseContract && studentContract) {
      loadCourses();
    }
  }, [courseContract, studentContract, refresh]);

  const handleEnroll = async (courseId) => {
    try {
      if (!studentContract.runner) {
        console.error(
          "Runner is undefined. Ensure the contract is connected with a signer."
        );
        return;
      }

      const tx = await studentContract.enrollInCourse(courseId);
      await tx.wait();
      alert("Enrollment successful!");
      if (onEnroll) {
        onEnroll();
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      let errorMessage = "An error occurred while enrolling in the course.";
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="my-4">
      <h2>Courses</h2>
      <ul className="list-group">
        {courses.map((course) => (
          <li
            key={course.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{course.name}</strong> (ID: {course.id})
              <br />
              Instructor: {course.instructor}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleEnroll(course.id)}
            >
              Enroll
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
