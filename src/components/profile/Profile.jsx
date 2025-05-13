import React, { useEffect, useState } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    group: "",
    maritalStatus: "",
    birthday: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [user, setUser] = useState(null);

  const getUserInitials = () => {
    if (!user) return "U";
    const firstNameInitial = user.firstName ? user.firstName.charAt(0) : "";
    const lastNameInitial = user.lastName ? user.lastName.charAt(0) : "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/employees/${userId}`)
      .then((res) => {
        setEmployee(res.data);
      })
      .catch((err) => {
        console.error("Error fetching employee:", err);
      });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:5000/api/employees/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => console.error("Failed to fetch user", err));
    }

    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
  }, []);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/employees/${userId}`,
        {
          firstName: employee.firstName,
          lastName: employee.lastName,
          contactNo: employee.contactNo,
          maritalStatus: employee.maritalStatus,
          birthday: employee.birthday,
        }
      );

      console.log("Profile updated", res.data);
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile. Check the console.");
    }
  };

  return (
    <Container className=" mt-2 mb-2 ">
      <div className=" bg-white p-4 border rounded-3 ">
        <Card className="border rounded-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              {/* Profile Image and Info */}
              <div className="d-flex gap-3 align-items-center">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="rounded-circle profile-img"
                  />
                ) : (
                  <div className="avatar-initials">{getUserInitials()}</div>
                )}
                <div>
                  <h6 className="mb-1 fw-bold information-title-text">
                    {employee.firstName} {employee.lastName}
                  </h6>
                  <p className="text-muted small mb-1">{employee.group}</p>
                </div>
              </div>

              {/* Button */}
              <div className="d-flex align-items-center mt-3 mt-md-0">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="edit-button  rounded-5 d-flex align-items-center gap-2"
                  >
                    <i className="edit-button-icon bi bi-pencil"></i> Edit
                  </button>
                ) : (
                  <button
                    className="save-button rounded-5 d-flex align-items-center"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="border rounded-3 mt-3 ">
          <Card.Body className=" p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-semibold information-title-text">
                Personal Information
              </h4>
            </div>

            <Row className="mb-3">
              <Col md={6} className="mb-3">
                <div>
                  <div className="text-muted small">First Name</div>
                  {editMode ? (
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={employee.firstName}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="fw-semibold information-text">
                      {employee.firstName}
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div>
                  <div className="text-muted small">Last Name</div>
                  {editMode ? (
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={employee.lastName}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="fw-semibold information-text">
                      {employee.lastName}
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div>
                  <div className="text-muted small">Email address</div>
                  {editMode ? (
                    <Form.Control
                      type="text"
                      name="email"
                      value={employee.email}
                      readOnly
                      plaintext={false}
                      className="bg-white"
                    />
                  ) : (
                    <div className="fw-semibold information-text">
                      {employee.group}
                    </div>
                  )}
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div>
                  <div className="text-muted small">Group</div>
                  {editMode ? (
                    <Form.Control
                      type="text"
                      name="group"
                      value={employee.group}
                      readOnly
                      plaintext={false}
                      className="bg-white"
                    />
                  ) : (
                    <div className="fw-semibold information-text">
                      {employee.group}
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div>
                  <div className="text-muted small">Phone</div>
                  {editMode ? (
                    <Form.Control
                      type="text"
                      name="contactNo"
                      value={employee.contactNo}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="fw-semibold information-text">
                      {employee.contactNo}
                    </div>
                  )}
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div>
                  <div className="text-muted small">Birthday</div>
                  {editMode ? (
                    <Form.Control
                      type="date"
                      name="birthday"
                      value={employee.birthday}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="fw-semibold information-text">
                      {employee.birthday}
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div>
                  <div className="text-muted small">Marital Status</div>
                  {editMode ? (
                    <Form.Select
                      name="maritalStatus"
                      value={employee.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </Form.Select>
                  ) : (
                    <div className="fw-semibold information-text">
                      {employee.maritalStatus}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Profile;
