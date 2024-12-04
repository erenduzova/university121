// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CourseContract.sol"; // Import the CourseContract

contract StudentContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    struct Student {
        string firstName;
        string lastName;
        string headline;
        uint256[] enrolledCourses;
    }

    mapping(address => Student) public students;
    address public courseContractAddress;

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function setCourseContractAddress(address _courseContractAddress) public onlyRole(ADMIN_ROLE) {
        courseContractAddress = _courseContractAddress;
    }

    function registerStudent(
        string memory _firstName,
        string memory _lastName,
        string memory _headline
    ) public {
        require(bytes(students[msg.sender].firstName).length == 0, "Student already registered");

        // Assign struct fields individually
        students[msg.sender].firstName = _firstName;
        students[msg.sender].lastName = _lastName;
        students[msg.sender].headline = _headline;
        // No need to initialize enrolledCourses; it's empty by default
    }

    function enrollInCourse(uint256 _courseId) public payable {
        require(bytes(students[msg.sender].firstName).length != 0, "Student not registered");
        require(_courseId > 0, "Invalid course ID");
        require(courseContractAddress != address(0), "CourseContract address not set");

        // Fetch course details from CourseContract
        CourseContract courseContract = CourseContract(courseContractAddress);
        (, , , uint256 price, address instructor, , ) = courseContract.getCourse(_courseId);

        require(msg.value == price, "Incorrect payment amount");

        // Check for duplicate enrollment
        for (uint256 i = 0; i < students[msg.sender].enrolledCourses.length; i++) {
            require(students[msg.sender].enrolledCourses[i] != _courseId, "Already enrolled in this course");
        }

        students[msg.sender].enrolledCourses.push(_courseId);

        // Transfer funds to the instructor
        payable(instructor).transfer(msg.value);
    }

    function getEnrolledCourses(address _student) public view returns (uint256[] memory) {
        return students[_student].enrolledCourses;
    }

    // Added isRegistered function
    function isRegistered(address _student) public view returns (bool) {
        return bytes(students[_student].firstName).length != 0;
    }

    // Get student's full name
    function getStudentName(address _student) public view returns (string memory) {
        return string(abi.encodePacked(students[_student].firstName, " ", students[_student].lastName));
    }

    // Get student's headline
    function getStudentHeadline(address _student) public view returns (string memory) {
        return students[_student].headline;
    }

    // Add updateProfile function
    function updateProfile(
        string memory _firstName,
        string memory _lastName,
        string memory _headline
    ) public {
        require(bytes(students[msg.sender].firstName).length != 0, "Student not registered");

        students[msg.sender].firstName = _firstName;
        students[msg.sender].lastName = _lastName;
        students[msg.sender].headline = _headline;
    }
}
