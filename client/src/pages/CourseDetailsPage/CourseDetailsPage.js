import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useParams } from "react-router-dom";
import "./CourseDetailsPage.css";
import { ethers } from "ethers";

function CourseDetailsPage({
  courseContract,
  studentContract,
  account,
  isInstructor,
  isAdmin,
}) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await courseContract.getCourse(id);
        const instructorName = await studentContract.getStudentName(
          courseData[4]
        );
        const courseDetail = {
          id: Number(courseData[0]),
          title: courseData[1],
          description: courseData[2],
          price: ethers.formatEther(courseData[3]),
          instructor: { address: courseData[4], name: instructorName },
          image: courseData[5],
          rating: Number(courseData[6]),
        };
        setCourse(courseDetail);

        // Check if the user is enrolled
        const enrolledCourses = await studentContract.getEnrolledCourses(
          account
        );
        const enrolledCourseIds = enrolledCourses.map((courseId) =>
          Number(courseId)
        );
        setIsEnrolled(enrolledCourseIds.includes(Number(id)));
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    if (courseContract && studentContract) {
      fetchCourse();
    }
  }, [courseContract, studentContract, id, account]);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const txResponse = await studentContract.enrollInCourse(course.id, {
        value: ethers.parseEther(course.price),
      });
      await txResponse.wait();
      alert("Kursa başarıyla kayıt oldunuz!");
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Kursa kayıt olurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="course-details-page">
      <Sidebar
        studentContract={studentContract}
        account={account}
        isInstructor={isInstructor}
        isAdmin={isAdmin}
      />
      <div className="course-details-content">
        <h1>{course.title}</h1>
        <img src={course.image} alt={course.title} />
        <p>
          Öğretmen: {course.instructor.name} ({course.instructor.address})
        </p>
        <p>
          <strong>Değerlendirme:</strong> ⭐ {course.rating}
        </p>
        <p>
          <strong>Fiyat:</strong> {course.price} ETH
        </p>
        <p>
          <strong>Açıklama:</strong> {course.description}
        </p>
        {isEnrolled ? (
          <p className="enrolled-message">Bu kursa kayıtlısınız.</p>
        ) : (
          <button className="btn" onClick={handleEnroll} disabled={loading}>
            {loading ? "Kayıt Yapılıyor..." : "Kursa Kayıt Ol"}
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseDetailsPage;
