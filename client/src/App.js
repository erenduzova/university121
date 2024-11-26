import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import StudentContractABI from "./contracts/StudentContract.json";
import CourseContractABI from "./contracts/CourseContract.json";

import StudentRegistration from "./components/StudentRegistration";
import CourseList from "./components/CourseList";
import Enroll from "./components/Enroll";
import AddCourse from "./components/AddCourse";
import StudentDashboard from "./components/StudentDashboard";
import GrantInstructor from "./components/GrantInstructor";

function App() {
  const [studentContract, setStudentContract] = useState(null);
  const [courseContract, setCourseContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [refreshEnrollment, setRefreshEnrollment] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState(false);

  useEffect(() => {
    const connectBlockchain = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Create Web3 provider
          const provider = new BrowserProvider(window.ethereum);

          // Get the signer
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          // Log the signer's address
          console.log("Signer Address in App.js:", address);

          // Contract addresses (from deployment)
          const studentContractAddress =
            "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const courseContractAddress =
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    connectBlockchain();
  }, []);

  // Check user roles
  useEffect(() => {
    const checkRoles = async () => {
      if (!courseContract || !account) return;

      try {
        // Define role identifiers
        const INSTRUCTOR_ROLE = ethers.id("INSTRUCTOR_ROLE");
        const ADMIN_ROLE = await courseContract.DEFAULT_ADMIN_ROLE();

        // Check if the user has the instructor role
        const hasInstructorRole = await courseContract.hasRole(
          INSTRUCTOR_ROLE,
          account
        );
        console.log("Has Instructor Role:", hasInstructorRole);
        setIsInstructor(hasInstructorRole);

        // Check if the user has the admin role
        const hasAdminRole = await courseContract.hasRole(ADMIN_ROLE, account);
        console.log("Has Admin Role:", hasAdminRole);
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error("Error checking roles:", error);
      }
    };

    checkRoles();
  }, [courseContract, account]);

  // Handle MetaMask account and network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="container">
      <h1 className="mt-4">University 121</h1>
      {!studentContract || !courseContract ? (
        <p>Loading contracts...</p>
      ) : (
        <>
          <StudentRegistration studentContract={studentContract} />
          {isInstructor && (
            <AddCourse
              courseContract={courseContract}
              onCourseAdded={() => setRefreshCourses(!refreshCourses)}
            />
          )}
          {isAdmin && (
            <GrantInstructor
              courseContract={courseContract}
              account={account}
            />
          )}
          <CourseList
            courseContract={courseContract}
            refresh={refreshCourses}
          />
          <Enroll
            studentContract={studentContract}
            onEnroll={() => setRefreshEnrollment(!refreshEnrollment)}
          />
          <StudentDashboard
            studentContract={studentContract}
            courseContract={courseContract}
            account={account}
            refresh={refreshEnrollment}
          />
        </>
      )}
    </div>
  );
}

export default App;
