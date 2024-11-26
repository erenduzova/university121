const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy StudentContract
  const StudentContract = await hre.ethers.getContractFactory(
    "StudentContract"
  );
  const studentContract = await StudentContract.deploy();
  await studentContract.waitForDeployment();
  console.log(
    "StudentContract deployed to:",
    await studentContract.getAddress()
  );

  // Deploy CourseContract
  const CourseContract = await hre.ethers.getContractFactory("CourseContract");
  const courseContract = await CourseContract.deploy();
  await courseContract.waitForDeployment();
  console.log("CourseContract deployed to:", await courseContract.getAddress());

  // Grant INSTRUCTOR_ROLE to deployer
  // const tx = await courseContract.grantInstructorRole(deployer.address);
  // await tx.wait();
  // console.log("INSTRUCTOR_ROLE granted to deployer:", deployer.address);
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contracts:", error);
    process.exit(1);
  });
