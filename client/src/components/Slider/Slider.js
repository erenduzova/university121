import React, { useState, useEffect } from "react";
import "./Slider.css";

import image1 from "../../assets/images/1.png";
import image2 from "../../assets/images/2.png";
import image3 from "../../assets/images/3.png";

const images = [
  { src: image1, alt: "Eğitim" },
  { src: image2, alt: "Öğrenci" },
  { src: image3, alt: "Akademik Başarı" },
];

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider" aria-live="polite">
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        className="slider-image"
        loading="lazy"
      />
    </div>
  );
}

export default Slider;
