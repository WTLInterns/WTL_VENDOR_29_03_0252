// components/Navbar.js
"use client";

import { FaSearch, FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
// import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility
  const { theme, toggleTheme } = useTheme(); // Use theme context

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Navbar */}
      <div className="w-full h-16 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-6 fixed top-0 left-0 z-50">
        {/* Left Side (Logo & Menu Icon) */}
        <div className="flex items-center space-x-4">
          <img src="/wtl-logos.png" alt="Aimcab Logo" className="w-20" />
        </div>

        {/* Right Side (Theme Toggle & Menu Icon) */}
        <div className="flex items-center space-x-6">
          
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <MdOutlineMenu
            className="text-gray-700 dark:text-gray-300 cursor-pointer text-2xl md:hidden"
            onClick={toggleSidebar}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;