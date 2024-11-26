// src/components/HomePage.js

import React from "react";

function HomePage({ onConnect }) {
  return (
    <div className="my-4">
      <h2>Welcome to University 121</h2>
      <p>Please connect your MetaMask wallet to access the application.</p>
      <button className="btn btn-primary" onClick={onConnect}>
        Connect MetaMask
      </button>
    </div>
  );
}

export default HomePage;
