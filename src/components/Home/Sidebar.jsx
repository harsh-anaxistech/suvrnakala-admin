import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbDashboard } from "react-icons/tb";
import { BiCategory, BiImageAdd, BiCartAdd } from "react-icons/bi";
import { MdContentPaste } from "react-icons/md";
import { TbLogs } from "react-icons/tb";
import { AiOutlineGold } from "react-icons/ai";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { RiFunctionAddLine } from "react-icons/ri";

import logo from "../../assets/SuvaranKala_logo_1.png";
import "./Layout.css";

function Sidebar({ isOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenus, setOpenMenus] = useState({ blogs: false, products: false });
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const links = [
    {
      path: "dashboard",
      icon: <TbDashboard size={20} />,
      label: "Dashboard",
    },
    {
      label: "Products",
      icon: <AiOutlineGold size={20} />,
      isParent: true,
      subLinks: [
        {
          path: "products",
          icon: <BiCartAdd size={18} />,
          label: "Add Products",
        },
        {
          path: "product-category",
          icon: <RiFunctionAddLine size={18} />,
          label: "Add Products Category",
        },
      ],
    },
    {
      label: "Blogs",
      icon: <TbLogs size={20} />,
      isParent: true,
      subLinks: [
        {
          path: "blogs",
          icon: <BiImageAdd size={18} />,
          label: "Add Blogs",
        },
        {
          path: "blog-category",
          icon: <RiFunctionAddLine size={18} />,
          label: "Add Blogs Category",
        },
      ],
    },
    {
      path: "content",
      icon: <MdContentPaste size={20} />,
      label: "Content",
    },
  ];

  return (
    <div
      className={`sidebar-container ${isCollapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""
        } ${isOpen ? "open" : "collapsed"}`}
    >
      <div className="sidebar-header">
        {!isCollapsed && !isMobile && (
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        )}
      </div>

      <div className="sidebar-menu">
        {links.map((link) => (
          <div key={link.label || link.path}>
            {link.isParent ? (
              <>
                <div
                  className={`menu-item ${link.subLinks.some((sub) => isActive(sub.path)) ? "active" : ""
                    } mt-1`}
                  onClick={() => toggleMenu(link.label.toLowerCase())}
                >
                  <span className="menu-icon">{link.icon}</span>
                  {!isCollapsed && !isMobile && (
                    <>
                      <span className="menu-label">{link.label}</span>
                      <span className="menu-arrow">
                        {openMenus[link.label.toLowerCase()] ? (
                          <FaChevronDown size={12} />
                        ) : (
                          <FaChevronRight size={12} />
                        )}
                      </span>
                    </>
                  )}
                </div>
                {openMenus[link.label.toLowerCase()] &&
                  !isCollapsed &&
                  !isMobile &&
                  link.subLinks.map((subLink) => (
                    <Link
                      key={subLink.path}
                      to={`/MainLayout/${subLink.path}`}
                      className={`menu-item sub-menu-item ${isActive(subLink.path) ? "active" : ""
                        } mt-1`}
                    >
                      <span className="menu-icon">{subLink.icon}</span>
                      <span className="menu-label">{subLink.label}</span>
                    </Link>
                  ))}
              </>
            ) : (
              <Link
                to={`/MainLayout/${link.path}`}
                className={`menu-item ${isActive(link.path) ? "active" : ""} mt-1`}
              >
                <span className="menu-icon">{link.icon}</span>
                {!isCollapsed && !isMobile && (
                  <span className="menu-label">{link.label}</span>
                )}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;