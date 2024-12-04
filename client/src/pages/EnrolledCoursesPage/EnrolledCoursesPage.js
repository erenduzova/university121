import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import CourseCard from "../../components/CourseCard/CourseCard";
import "./EnrolledCoursesPage.css";
import { ethers } from "ethers";

function EnrolledCoursesPage({
  courseContract,
  studentContract,
  account,
  isInstructor,
  isAdmin,
}) {
  const [courses, setCourses] = useState([]);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const courseIds = await studentContract.getEnrolledCourses(account);
        const coursesArray = [];

        for (let i = 0; i < courseIds.length; i++) {
          const courseId = Number(courseIds[i]);
          const courseData = await courseContract.getCourse(courseId);
          // Fetch instructor's name
          let instructorName = "Unknown";
          try {
            instructorName = await studentContract.getStudentName(
              courseData[4]
            );
          } catch (error) {
            console.error(
              `Failed to fetch name for instructor ${courseData[4]}`
            );
          }
          const course = {
            id: Number(courseData[0]),
            title: courseData[1],
            description: courseData[2],
            price: ethers.formatEther(courseData[3]),
            instructor: { address: courseData[4], name: instructorName },
            image: courseData[5],
            rating: Number(courseData[6]),
          };
          coursesArray.push(course);
        }

        setCourses(coursesArray);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    if (courseContract && studentContract) {
      fetchEnrolledCourses();
    }
  }, [courseContract, studentContract, account]);

  return (
    <div className="enrolled-courses-page">
      <Sidebar
        studentContract={studentContract}
        account={account}
        isInstructor={isInstructor}
        isAdmin={isAdmin}
      />
      <div className="enrolled-courses-content">
        <h1>Kayıtlı Kurslarım</h1>
        <div className="courses-list">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p>Henüz herhangi bir kursa kayıtlı değilsiniz.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnrolledCoursesPage;
