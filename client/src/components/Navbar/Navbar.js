import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo2.png";

function Navbar({ onConnect, account, isRegistered }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderAuthButtons = () => {
    if (!account) {
      // Status 1: Not logged in to MetaMask
      return (
        <button className="navbar-btn-link" onClick={onConnect}>
          MetaMask'a Bağlan
        </button>
      );
    } else if (!isRegistered) {
      // Status 2: Logged in to MetaMask but not registered
      return (
        <Link to="/register" className="navbar-btn-link">
          Kayıt Ol
        </Link>
      );
    } else {
      // Status 3: Logged in and registered
      return (
        <Link to="/courses" className="navbar-btn-link">
          Tüm Kurslar
        </Link>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Üniversite Logosu" />
      </div>
      <button className="navbar-toggler" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        {/* Other links can be added here */}
        <li className="navbar-auth">{renderAuthButtons()}</li>
      </ul>
    </nav>
  );
}

export default Navbar;
