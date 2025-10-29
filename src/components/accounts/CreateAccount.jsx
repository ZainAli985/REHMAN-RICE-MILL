import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../config/API_BASE_URL";
import Notification from "../Notification.jsx";
import SidebarLayout from "../layout/SidebarLayout.jsx";

export default function CreateAccount() {
  const [accountType, setAccountType] = useState("");
  const [subAccountType, setSubAccountType] = useState("");
  const [accountName, setAccountName] = useState("");
  const [availableSubs, setAvailableSubs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  // Strict mapping: main → allowed sub groups
  const subAccountOptions = {
    Assets: ["Current Assets", "Fixed Assets"],
    Liabilities: ["Current Liabilities", "Fixed Liabilities"],
    Equity: ["Equity"],
    Revenue: ["Revenue", "Contra Revenue"],
    Expense: ["Expenses"],
  };

  useEffect(() => {
    setSubAccountType("");
    if (accountType) {
      setAvailableSubs(subAccountOptions[accountType] || []);
    } else {
      setAvailableSubs([]);
    }
  }, [accountType]);

  const isValidPair = (main, sub) => {
    if (!main || !sub) return false;
    const allowed = subAccountOptions[main] || [];
    return allowed.includes(sub);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountType || !subAccountType || !accountName) {
      setNotificationMessage("All fields are required!");
      setNotificationType("warning");
      return;
    }

    if (!isValidPair(accountType, subAccountType)) {
      setNotificationMessage("Invalid sub-account for this main account type!");
      setNotificationType("error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType, subAccountType, accountName }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotificationMessage(data.message || "Account created successfully!");
        setNotificationType("success");
        setAccountType("");
        setSubAccountType("");
        setAccountName("");
      } else {
        setNotificationMessage(data.message || "Failed to create account!");
        setNotificationType("error");
      }
    } catch (error) {
      console.error(error);
      setNotificationMessage("Server error, please try again later!");
      setNotificationType("error");
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto w-full bg-white shadow-lg rounded-xl p-10 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create New Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Account Type</option>
                <option value="Assets">Assets</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Equity">Equity</option>
                <option value="Expense">Expense</option>
                <option value="Revenue">Revenue</option>
              </select>
            </div>

            {/* Sub Account Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Sub Account Type
              </label>
              <select
                value={subAccountType}
                onChange={(e) => setSubAccountType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={!accountType}
              >
                <option value="">Select Sub Account Type</option>
                {availableSubs.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter Account Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>

      <Notification message={notificationMessage} type={notificationType} />
    </SidebarLayout>
  );
}
