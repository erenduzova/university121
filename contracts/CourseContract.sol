// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CourseContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant INSTRUCTOR_ROLE = keccak256("INSTRUCTOR_ROLE");

    struct Course {
        uint256 id;
        string title;
        string description;
        uint256 price;
        address instructor;
        string image;
        uint256 rating;
    }

    mapping(uint256 => Course) public courses;
    uint256 public courseCount = 0;

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function addCourse(
        string memory _title,
        string memory _description,
        uint256 _price,
        string memory _image
    ) public onlyRole(INSTRUCTOR_ROLE) {
        courseCount++;
        courses[courseCount] = Course(
            courseCount,
            _title,
            _description,
            _price,
            msg.sender,
            _image,
            0 // Initialize rating to 0
        );
    }

    function grantInstructorRole(address account) public onlyRole(ADMIN_ROLE) {
        grantRole(INSTRUCTOR_ROLE, account);
    }

    function revokeInstructorRole(address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(INSTRUCTOR_ROLE, account);
    }

    function getCourse(uint256 _courseId)
        public
        view
        returns (
            uint256 id,
            string memory title,
            string memory description,
            uint256 price,
            address instructor,
            string memory image,
            uint256 rating
        )
    {
        require(_courseId > 0 && _courseId <= courseCount, "Course does not exist");
        Course memory course = courses[_courseId];
        return (
            course.id,
            course.title,
            course.description,
            course.price,
            course.instructor,
            course.image,
            course.rating
        );
    }
}
