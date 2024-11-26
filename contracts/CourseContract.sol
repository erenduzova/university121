// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CourseContract is AccessControl  {

    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant INSTRUCTOR_ROLE = keccak256("INSTRUCTOR_ROLE");

    struct Course {
        uint256 id;
        string name;
    }

    mapping(uint256 => Course) public courses;
    uint256 public courseCount = 0;

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function addCourse(string memory _name) public onlyRole(INSTRUCTOR_ROLE) {
        courseCount++;
        courses[courseCount] = Course(courseCount, _name);
    }

    function grantInstructorRole(address account) public onlyRole(ADMIN_ROLE) {
        grantRole(INSTRUCTOR_ROLE, account);
    }

     // Optionally, add function to revoke instructor role
    function revokeInstructorRole(address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(INSTRUCTOR_ROLE, account);
    }

    function getCourse(uint256 _courseId) public view returns (string memory) {
        require(_courseId > 0 && _courseId <= courseCount, "Course does not exist");
        return courses[_courseId].name;
    }
}
