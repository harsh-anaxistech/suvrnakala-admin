import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { Dropdown, Badge, Button } from "react-bootstrap";
import { GoGear } from "react-icons/go";
import { AiOutlinePoweroff } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import API from "../../api";

import "./Layout.css";

function Topbar({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || { name: "John", email: "john.doe@example.com" };
  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "JD";

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("user"); // Clear user details
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("user"); // Clear user details
      navigate("/");
    }
  };


  return (
    <nav className="navbar navbar-expand bg-white topbar sidebar-header mb-4 static-top" >
      <button
        className="btn border rounded-1 d-flex align-items-center justify-content-center"
        style={{
          width: "35px",
          height: "35px",
          padding: "0",
          borderWidth: "1px",
          outline: "none",
          boxShadow: "none",
        }}
        onClick={toggleSidebar}
      >
        <HiOutlineMenuAlt1 />
      </button>

      <div className="d-flex align-items-center ms-auto">
        {/* Profile Dropdown */}
        <div className="nav-item dropdown profile-dropdown">
          <Dropdown>
            <Dropdown.Toggle
              as="a"
              className="nav-link profile-toggle"
              bsPrefix="custom-toggle"
              role="button"
            >
              <div className="avatar-initials">{initials}</div>

            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-end border mt-3  profile-menu">
              <div className="p-3">
                <div className="d-flex align-items-center">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <h6
                        style={{
                          marginBottom: 0,
                          fontWeight: "500",
                          color: "#212529",
                          fontSize: "16px",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.name}
                      </h6>
                      <small
                        className="user-email"
                        style={{
                          color: "#6c757d",
                          fontSize: "11px",
                        }}
                      >
                        {user.email}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-wrapper">
                <div className="profile-item text-danger" onClick={handleLogout}>
                  <AiOutlinePoweroff size={15} className="profile-icon" />
                  <span>Logout</span>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

    </nav>
  );
}

export default Topbar;