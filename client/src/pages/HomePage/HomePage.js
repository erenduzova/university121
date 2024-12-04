import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Slider from "../../components/Slider/Slider";
import About from "../../components/About/About";
import Features from "../../components/Features/Features";
import Footer from "../../components/Footer/Footer";

function HomePage({ onConnect, account, isRegistered }) {
  return (
    <div>
      <Navbar
        onConnect={onConnect}
        account={account}
        isRegistered={isRegistered}
      />
      <Slider />
      <About />
      <Features />
      <Footer />
    </div>
  );
}

export default HomePage;
