import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ studentContract, account, isInstructor, isAdmin }) {
  const [user, setUser] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!studentContract || !account) {
        return;
      }

      try {
        const userData = await studentContract.students(account);

        // Log userData to inspect its structure
        console.log("Fetched user data:", userData);

        const user = {
          firstName: userData[0],
          lastName: userData[1],
          headline: userData[2],
        };
        setUser(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [studentContract, account]);

  if (!user) {
    return (
      <aside className="sidebar">
        <p>Loading user data...</p>
      </aside>
    );
  }

  const { firstName, lastName, headline } = user;
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  return (
    <aside className="sidebar">
      <div className="profile-initials">{initials}</div>
      <h3 className="profile-name">{`${firstName} ${lastName}`}</h3>
      <p className="profile-headline">{headline}</p>
      <ul className="sidebar-menu">
        <li>
          <Link to="/profile">Profil</Link>
        </li>
        <li>
          <Link to="/courses">Tüm Kurslar</Link>
        </li>
        <li>
          <Link to="/enrolled-courses">Kayıtlı Kurslarım</Link>
        </li>
        {isInstructor && (
          <>
            <li>
              <Link to="/add-course">Kurs Ekle</Link>
            </li>
            {/* Add more instructor-specific links here */}
          </>
        )}
        {isAdmin && (
          <>
            <li>
              <Link to="/grant-instructor">Öğretmen Rolü Ata</Link>
            </li>
            {/* Add more admin-specific links here */}
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
