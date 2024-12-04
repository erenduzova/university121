const hre = require("hardhat");

async function main() {
  // Get the signer (deployer)
  const [deployer] = await hre.ethers.getSigners();

  // Get the contract factories
  const CourseContractFactory = await hre.ethers.getContractFactory(
    "CourseContract"
  );
  const StudentContractFactory = await hre.ethers.getContractFactory(
    "StudentContract"
  );

  // Deploy CourseContract
  const courseContract = await CourseContractFactory.deploy();
  await courseContract.waitForDeployment(); // Ensure deployment is complete
  const courseContractAddress = courseContract.target;
  console.log("CourseContract deployed to:", courseContractAddress);

  // Deploy StudentContract
  const studentContract = await StudentContractFactory.deploy();
  await studentContract.waitForDeployment(); // Ensure deployment is complete
  const studentContractAddress = studentContract.target;
  console.log("StudentContract deployed to:", studentContractAddress);

  // Set the CourseContract address in StudentContract
  const tx = await studentContract.setCourseContractAddress(
    courseContractAddress
  );
  await tx.wait();
  console.log("CourseContract address set in StudentContract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contracts:", error);
    process.exit(1);
  });
