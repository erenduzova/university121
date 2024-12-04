// src/components/AddCourse/AddCourse.js

import React, { useState } from "react";
import { ethers } from "ethers";
import "./AddCourse.css";

function AddCourse({ courseContract }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !imageURL) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Convert price to wei (assuming price is in ether)
      const priceInWei = ethers.parseEther(price);

      // Call the addCourse function from the contract
      const tx = await courseContract.addCourse(
        title,
        description,
        priceInWei,
        imageURL
      );
      await tx.wait();

      setMessage("Kurs başarıyla eklendi!");
      // Reset form fields
      setTitle("");
      setDescription("");
      setPrice("");
      setImageURL("");
    } catch (error) {
      console.error("Error adding course:", error);

      let errorMessage = "Kurs eklenirken bir hata oluştu.";
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-form">
      <form onSubmit={handleAddCourse}>
        <div className="form-group">
          <label>Kurs Başlığı</label>
          <input
            type="text"
            className="form-control"
            placeholder="Kurs başlığı girin"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Kurs Açıklaması</label>
          <textarea
            className="form-control"
            placeholder="Kurs açıklaması girin"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Fiyat (ETH)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            placeholder="Fiyat girin"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Görsel</label>
          <input
            type="text"
            className="form-control"
            placeholder="Görsel URL'si girin"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Kurs Ekleniyor..." : "Kurs Ekle"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddCourse;
