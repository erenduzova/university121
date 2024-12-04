import React from "react";
import { Link } from "react-router-dom";
import "./CourseCard.css";

function CourseCard({ course }) {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} />
      <h3>{course.title}</h3>
      <p>Öğretmen Adı: {course.instructor.name}</p>
      <p>Değerlendirme: ⭐ {course.rating}</p>
      <p>Fiyat: {course.price} ETH</p>
      <Link to={`/courses/${course.id}`} className="btn">
        Detaylar
      </Link>
    </div>
  );
}

export default CourseCard;
