import React from "react";
import "./Features.css";
import FeatureImage1 from "../../assets/images/1.png";
import FeatureImage2 from "../../assets/images/2.png";
import FeatureImage3 from "../../assets/images/3.png";

const featuresData = [
  {
    id: 1,
    title: "Merkeziyetsiz Sertifika",
    description:
      "Öğrenciler, başarılarını blok zinciri üzerinden doğrulanabilir dijital sertifikalar olarak alır. Bu sertifikalar, merkeziyetsiz bir ağda saklanır ve her zaman erişilebilir durumdadır.",
    image: FeatureImage1,
    alt: "Merkeziyetsiz Sertifika",
  },
  {
    id: 2,
    title: "Öğrenci ve Eğitmen Kontrolü",
    description:
      "Öğrenciler ve eğitmenler, kurs seçimi ve içerik yönetimi konusunda tam kontrol sahibidir. Her kullanıcı, kendi eğitim sürecini yönetebilir ve değerlendirme sürecine katkıda bulunabilir.",
    image: FeatureImage2,
    alt: "Öğrenci ve Eğitmen Kontrolü",
  },
  {
    id: 3,
    title: "Güvenli Veri Yönetimi",
    description:
      "Blok zinciri altyapısıyla, tüm veriler güvence altındadır. Öğrenci ve eğitmen bilgileri, merkezi olmayan bir şekilde saklanarak, gizliliği ve güvenliği üst düzeyde korur.",
    image: FeatureImage3,
    alt: "Güvenli Veri Yönetimi",
  },
];

function Features() {
  return (
    <section className="feature-section">
      <div className="custom-container">
        {featuresData.map((feature) => (
          <div className="feature" key={feature.id}>
            <div className="feature-image-container">
              <img
                src={feature.image}
                alt={feature.alt}
                className="feature-image"
              />
            </div>
            <div className="feature-text">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
