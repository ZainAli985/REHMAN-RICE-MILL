import React from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import { FiPlusCircle, FiEye, FiShoppingCart, FiFileText } from "react-icons/fi";

const InvoiceDashboard = () => {
  const navigate = useNavigate();

  const boxes = [
    { label: "Add Sales", path: "/add-invoice-sales", color: "bg-blue-500", icon: <FiPlusCircle size={30} /> },
    { label: "View Sales Invoices", path: "/view-sales-invoices", color: "bg-green-500", icon: <FiEye size={30} /> },
    { label: "Add Purchase", path: "/add-invoice-purchase", color: "bg-yellow-500", icon: <FiShoppingCart size={30} /> },
    { label: "View Purchase Invoices", path: "/view-purchase-invoices", color: "bg-red-500", icon: <FiFileText size={30} /> },
  ];

  return (
    <SidebarLayout>
      <h2 className="text-2xl font-bold mb-6">Invoices Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boxes.map((box) => (
          <div
            key={box.label}
            onClick={() => navigate(box.path)}
            className={`${box.color} cursor-pointer text-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-xl font-semibold hover:scale-105 transform transition`}
          >
            <div className="mb-4">{box.icon}</div>
            <div className="text-center">{box.label}</div>
          </div>
        ))}
      </div>
    </SidebarLayout>
  );
};

export default InvoiceDashboard;
