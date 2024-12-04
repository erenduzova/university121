import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ProfilePage.css";

function ProfilePage({ account, studentContract, isInstructor, isAdmin }) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let role = "Student"; // Default role
        if (isInstructor) {
          role = "Instructor";
        }
        if (isAdmin) {
          role = "Admin";
        }

        // Fetch user data from the smart contract
        const student = await studentContract.students(account);
        const firstName = student.firstName;
        const lastName = student.lastName;
        const headline = student.headline;

        setUser({ firstName, lastName, headline, role });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (studentContract && account) {
      fetchUserData();
    }
  }, [studentContract, account, isInstructor, isAdmin]);

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update user data on the blockchain
      const tx = await studentContract.updateProfile(
        user.firstName,
        user.lastName,
        user.headline
      );
      await tx.wait();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <Sidebar
        studentContract={studentContract}
        account={account}
        isInstructor={isInstructor}
        isAdmin={isAdmin}
      />

      {/* Profile Form */}
      <main className="profile-form">
        <h1>Profil</h1>
        <form onSubmit={handleSubmit}>
          {/* Basics Section */}
          <div className="profile-form-group">
            <label htmlFor="firstName">Ad:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="lastName">Soyad:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="headline">Başlık:</label>
            <input
              type="text"
              id="headline"
              name="headline"
              value={user.headline}
              onChange={handleChange}
              maxLength={60}
              placeholder="Add a professional headline"
            />
          </div>
          {/* Role Display */}
          <div className="profile-form-group">
            <label>Rol:</label>
            <p className="role-display">{user.role}</p>
          </div>
          {/* Submit Button */}
          <button type="submit" className="save-button">
            Değişiklikleri Kaydet
          </button>
        </form>
      </main>
    </div>
  );
}

export default ProfilePage;
