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
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CoursesPage from "./pages/CoursesPage/CoursesPage";
import EnrolledCoursesPage from "./pages/EnrolledCoursesPage/EnrolledCoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage/CourseDetailsPage";
import AddCoursePage from "./pages/AddCoursePage/AddCoursePage";
import GrantInstructorPage from "./pages/GrantInstructorPage/GrantInstructorPage";

function App() {
  const [studentContract, setStudentContract] = useState(null);
  const [courseContract, setCourseContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

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
            setLoading(false);
          }
        } catch (error) {
          console.error("Error checking accounts:", error);
          setAccount(null);
          setLoading(false);
        }
      } else {
        alert("Please install MetaMask!");
        setLoading(false);
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
        const courseContractAddress =
          "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with actual address
        const studentContractAddress =
          "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Update with actual address

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
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
      setLoading(false);
    }
  };

  // Function to handle MetaMask connection when user clicks "MetaMask'a Bağlan"
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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setAccount(null);
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
      setLoading(false);
    }
  };

  // Check user roles
  useEffect(() => {
    const checkRoles = async () => {
      if (!courseContract || !account) return;

      try {
        const INSTRUCTOR_ROLE = ethers.keccak256(
          ethers.toUtf8Bytes("INSTRUCTOR_ROLE")
        );
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
      if (!studentContract || !account) {
        setLoading(false);
        return;
      }

      try {
        const registered = await studentContract.isRegistered(account);
        console.log("Is Registered:", registered);
        setIsRegistered(registered);
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setLoading(false);
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
          setLoading(true);
          setIsRegistered(false);
          setIsInstructor(false);
          setIsAdmin(false);
          await connectContracts(accounts[0]);
        } else {
          setAccount(null);
          setStudentContract(null);
          setCourseContract(null);
          setIsRegistered(false);
          setIsInstructor(false);
          setIsAdmin(false);
          setLoading(false);
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
        {loading ? (
          <p>Yükleniyor...</p>
        ) : !account || !studentContract || !courseContract ? (
          // If not connected or contracts not loaded, render HomePage
          <HomePage onConnect={handleConnectMetaMask} />
        ) : (
          // Contracts are loaded and account is connected
          <Routes>
            {/* Registration Route */}
            {!isRegistered && (
              <>
                <Route
                  path="/register"
                  element={
                    <RegistrationPage
                      studentContract={studentContract}
                      account={account}
                      onRegister={() => setIsRegistered(true)}
                    />
                  }
                />
                {/* Redirect any other route to /register */}
                <Route path="*" element={<Navigate to="/register" replace />} />
              </>
            )}

            {/* Authenticated Routes */}
            {isRegistered && (
              <>
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/courses" replace />} />
                {/* Profile Route */}
                <Route
                  path="/profile"
                  element={
                    <ProfilePage
                      account={account}
                      studentContract={studentContract}
                      isInstructor={isInstructor}
                      isAdmin={isAdmin}
                    />
                  }
                />
                {/* Courses Route */}
                <Route
                  path="/courses"
                  element={
                    <CoursesPage
                      courseContract={courseContract}
                      studentContract={studentContract}
                      account={account}
                      isInstructor={isInstructor}
                      isAdmin={isAdmin}
                    />
                  }
                />
                {/* Enrolled Courses Route */}
                <Route
                  path="/enrolled-courses"
                  element={
                    <EnrolledCoursesPage
                      courseContract={courseContract}
                      studentContract={studentContract}
                      account={account}
                      isInstructor={isInstructor}
                      isAdmin={isAdmin}
                    />
                  }
                />
                {/* Course Details Route */}
                <Route
                  path="/courses/:id"
                  element={
                    <CourseDetailsPage
                      courseContract={courseContract}
                      studentContract={studentContract}
                      account={account}
                      isInstructor={isInstructor}
                      isAdmin={isAdmin}
                    />
                  }
                />
                {isInstructor && (
                  <Route
                    path="/add-course"
                    element={
                      <AddCoursePage
                        courseContract={courseContract}
                        studentContract={studentContract}
                        account={account}
                        isInstructor={isInstructor}
                        isAdmin={isAdmin}
                      />
                    }
                  />
                )}
                {isAdmin && (
                  <Route
                    path="/grant-instructor"
                    element={
                      <GrantInstructorPage
                        courseContract={courseContract}
                        studentContract={studentContract}
                        account={account}
                        isInstructor={isInstructor}
                        isAdmin={isAdmin}
                      />
                    }
                  />
                )}
                {/* Redirect unknown routes to /courses */}
                <Route path="*" element={<Navigate to="/courses" replace />} />
              </>
            )}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
