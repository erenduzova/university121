// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract StudentContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    struct Student {
        string name;
        uint256[] enrolledCourses;
    }

    mapping(address => Student) public students;

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function registerStudent(string memory _name) public {
        require(bytes(students[msg.sender].name).length == 0, "Student already registered");
        students[msg.sender].name = _name;
    }

    function enrollInCourse(uint256 _courseId) public {
        require(bytes(students[msg.sender].name).length != 0, "Student not registered");

        // Check for duplicate enrollment
        for (uint256 i = 0; i < students[msg.sender].enrolledCourses.length; i++) {
            require(students[msg.sender].enrolledCourses[i] != _courseId, "Already enrolled in this course");
        }

        students[msg.sender].enrolledCourses.push(_courseId);
    }

    function getEnrolledCourses(address _student) public view returns (uint256[] memory) {
        return students[_student].enrolledCourses;
    }
}