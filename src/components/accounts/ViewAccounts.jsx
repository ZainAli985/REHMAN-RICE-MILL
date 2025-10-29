import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../config/API_BASE_URL";
import Notification from "../Notification.jsx";
import SidebarLayout from "../layout/SidebarLayout.jsx";

export default function ViewAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get-accounts`);
        const data = await res.json();

        if (res.ok) {
          setAccounts(data);
          setFilteredAccounts(data);
        } else {
          setNotificationMessage("Failed to fetch accounts.");
          setNotificationType("error");
        }
      } catch (error) {
        console.error(error);
        setNotificationMessage("Server error while fetching accounts.");
        setNotificationType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (filterType === "") {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(
        (acc) => acc.accountType === filterType
      );
      setFilteredAccounts(filtered);
    }
  }, [filterType, accounts]);

  return (
    <SidebarLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Accounts Overview
        </h2>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="font-semibold text-gray-700">Filter by Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All</option>
            <option value="Assets">Assets</option>
            <option value="Liabilities">Liabilities</option>
            <option value="Equity">Equity</option>
            <option value="Expense">Expense</option>
            <option value="Revenue">Revenue</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center py-6 text-gray-600">Loading accounts...</p>
        ) : filteredAccounts.length === 0 ? (
          <p className="text-center py-6 text-gray-600">No accounts found.</p>
        ) : (
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="py-3 px-5 border-b">Account Type</th>
                <th className="py-3 px-5 border-b">Sub Account Type</th>
                <th className="py-3 px-5 border-b">Account Name</th>
                <th className="py-3 px-5 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc._id}
                  className="hover:bg-gray-50 transition border-b last:border-none"
                >
                  <td className="py-3 px-5">{acc.accountType}</td>
                  <td className="py-3 px-5">{acc.subAccountType}</td>
                  <td className="py-3 px-5 font-medium">{acc.accountName}</td>
                  <td className="py-3 px-5 text-gray-500">
                    {new Date(acc.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Notification message={notificationMessage} type={notificationType} />
    </SidebarLayout>
  );
}
