import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Sidebar from "../../components/Sidebar/Sidebar";
import CourseCard from "../../components/CourseCard/CourseCard";
import "./CoursesPage.css";

function CoursesPage({
  courseContract,
  studentContract,
  account,
  isInstructor,
  isAdmin,
}) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseCount = await courseContract.courseCount();
        const coursesArray = [];

        for (let i = 1; i <= Number(courseCount); i++) {
          const courseData = await courseContract.getCourse(i);

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
        console.error("Error fetching courses:", error);
      }
    };

    if (courseContract) {
      fetchCourses();
    }
  }, [courseContract, studentContract]);

  return (
    <div className="courses-page">
      <Sidebar
        studentContract={studentContract}
        account={account}
        isInstructor={isInstructor}
        isAdmin={isAdmin}
      />
      <div className="courses-content">
        <h1>Tüm Kurslar</h1>
        <div className="courses-list">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p>Mevcut kurs bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
