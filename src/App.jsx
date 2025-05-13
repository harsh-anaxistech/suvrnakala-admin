import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register"; // Assuming you have a Register component
import MainLayout from "./components/Home/MainLayout";
import Products from "./components/Products/Products"
import Dashboard from "./components/dashboard/Dashboard";// Component to protect routes
import ProductsCategory from "./components/category/ProductsCategory"
import CRM from "./components/Content/Content"
import Blogs from "./components/blogs/Blogs"
import BlogsCategory from "./components/category/BlogsCategory"
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/mainLayout"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="product-category" element={<ProductsCategory />} />
          <Route path="content" element={<CRM />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blog-category" element={<BlogsCategory />} />

          {/* Add more nested routes here, e.g., <Route path="profile" element={<Profile />} /> */}
        </Route>

        {/* Catch-all route for invalid paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;