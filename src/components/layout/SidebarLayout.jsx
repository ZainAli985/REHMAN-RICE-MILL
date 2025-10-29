import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUser,
  FiBook,
  FiFileText,
  FiLayers,
} from "react-icons/fi";

export default function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/create-account", label: "Create Account", icon: <FiUser /> },
    { to: "/view-accounts", label: "View Accounts", icon: <FiBook /> },
    { to: "/add-invoice", label: "Create Invoice", icon: <FiFileText /> },
    { to: "/general-entries", label: "General Entries", icon: <FiLayers /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 z-50`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-wide">ADMIN PANEL</h1>
          <button
            className="text-white md:hidden focus:outline-none"
            onClick={toggleSidebar}
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition ${
                location.pathname === link.to ? "bg-gray-800" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-40">
          {/* Left Section — Logo + Name */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              className="text-gray-800 md:hidden focus:outline-none"
              onClick={toggleSidebar}
            >
              <FiMenu size={24} />
            </button>

            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
                AL REHMAN RICE MILL
              </h1>
            </div>
          </div>

          {/* Right Section — Welcome Text */}
          <p className="text-gray-600 text-lg font-medium hidden sm:block">
            Welcome, <span className="font-semibold text-blue-600">Ali Raza</span>
          </p>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
}
