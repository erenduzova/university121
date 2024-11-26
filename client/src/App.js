// App.js

import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import StudentContractABI from "./contracts/StudentContract.json";
import CourseContractABI from "./contracts/CourseContract.json";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";

import StudentRegistration from "./components/StudentRegistration";

function App() {
  const [studentContract, setStudentContract] = useState(null);
  const [courseContract, setCourseContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [refreshEnrollment, setRefreshEnrollment] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Check if MetaMask is connected
  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            // User is connected to MetaMask
            setAccount(accounts[0]);
            await connectContracts(accounts[0]);
          } else {
            setAccount(null);
          }
        } catch (error) {
          console.error("Error checking accounts:", error);
          setAccount(null);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    checkIfConnected();
  }, []);

  // Function to connect contracts after MetaMask is connected
  const connectContracts = async (accountAddress) => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(accountAddress);

        // Contract addresses (from deployment)
        const studentContractAddress =
          "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // Update with your actual address
        const courseContractAddress =
          "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // Update with your actual address

        // Create contract instances
        const studentContract = new ethers.Contract(
          studentContractAddress,
          StudentContractABI.abi,
          signer
        );
        setStudentContract(studentContract);

        const courseContract = new ethers.Contract(
          courseContractAddress,
          CourseContractABI.abi,
          signer
        );
        setCourseContract(courseContract);
      } catch (error) {
        console.error("Error connecting to contracts:", error);
        setAccount(null);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Function to handle MetaMask connection when user clicks "Connect MetaMask"
  const handleConnectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await connectContracts(accounts[0]);
        } else {
          setAccount(null);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setAccount(null);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Check user roles
  useEffect(() => {
    const checkRoles = async () => {
      if (!courseContract || !account) return;

      try {
        const INSTRUCTOR_ROLE = ethers.id("INSTRUCTOR_ROLE");
        const ADMIN_ROLE = await courseContract.DEFAULT_ADMIN_ROLE();

        const hasInstructorRole = await courseContract.hasRole(
          INSTRUCTOR_ROLE,
          account
        );
        console.log("Has Instructor Role:", hasInstructorRole);
        setIsInstructor(hasInstructorRole);

        const hasAdminRole = await courseContract.hasRole(ADMIN_ROLE, account);
        console.log("Has Admin Role:", hasAdminRole);
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error("Error checking roles:", error);
      }
    };

    if (courseContract && account && isRegistered) {
      checkRoles();
    }
  }, [courseContract, account, isRegistered]);

  // Check if the user is registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (!studentContract || !account) return;

      try {
        const registered = await studentContract.isRegistered(account);
        console.log("Is Registered:", registered);
        setIsRegistered(registered);
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    if (studentContract && account) {
      checkRegistration();
    }
  }, [studentContract, account]);

  // Handle MetaMask account and network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await connectContracts(accounts[0]);
        } else {
          setAccount(null);
          setStudentContract(null);
          setCourseContract(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Router>
      <div className="container">
        {!account ? (
          // Render the HomePage component with onConnect prop
          <HomePage onConnect={handleConnectMetaMask} />
        ) : !studentContract || !courseContract ? (
          <p>Loading contracts...</p>
        ) : !isRegistered ? (
          <StudentRegistration
            studentContract={studentContract}
            onRegister={() => setIsRegistered(true)}
          />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  isInstructor={isInstructor}
                  isAdmin={isAdmin}
                  courseContract={courseContract}
                  studentContract={studentContract}
                  account={account}
                  refreshCourses={refreshCourses}
                  setRefreshCourses={setRefreshCourses}
                  refreshEnrollment={refreshEnrollment}
                  setRefreshEnrollment={setRefreshEnrollment}
                />
              }
            />
            {/* Add more routes here if needed */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
