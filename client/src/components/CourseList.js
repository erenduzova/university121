import React, { useState, useEffect } from "react";

function CourseList({ courseContract, refresh }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Fetch courseCount as a bigint
        const courseCountBN = await courseContract.courseCount();
        // Convert bigint to number
        const courseCount = Number(courseCountBN);

        const courseArray = [];
        for (let i = 1; i <= courseCount; i++) {
          const course = await courseContract.courses(i);
          courseArray.push(course);
        }
        setCourses(courseArray);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };

    if (courseContract) {
      loadCourses();
    }
  }, [courseContract, refresh]);

  return (
    <div className="my-4">
      <h2>Courses</h2>
      <ul className="list-group">
        {courses.map((course, index) => (
          <li key={index} className="list-group-item">
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
