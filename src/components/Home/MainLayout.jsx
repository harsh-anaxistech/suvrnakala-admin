

import API from "../../api";
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import axios from "axios";
import "./Layout.css";

const MainLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const loggedInUserId = localStorage.getItem("userId"); // Adjust based on your auth setup

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const checkUserStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // If token or user ID is missing, rely on ProtectedRoute to redirect
      if (!token || !user || !user.id) {
        return;
      }

      // Fetch user data (optional, only if needed for MainLayout)
      const response = await API.get(`/employees/${user.id}`);
      console.log("User data:", response.data);
      // Update state or context with response.data if needed
    } catch (error) {
      console.error("Error checking user status:", error);
      // Do not redirect; ProtectedRoute handles authentication
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <div className="layout-container">
      {/* Sidebar on the Left */}
      <div>
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Sticky Topbar */}
        <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;