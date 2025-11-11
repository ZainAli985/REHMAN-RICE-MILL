import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL.js";
import Notification from "../Notification.jsx";

export default function ViewGeneralEntries() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  // ✅ Safe JSON parser
  const safeJsonParse = async (res) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return null; // not valid JSON
    }
  };

  // ✅ Fetch all journal entries
  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get-journal-entries`);
      const data = await safeJsonParse(res);

      if (!res.ok) throw new Error(data?.message || "Failed to fetch entries");
      if (!data) throw new Error("Invalid JSON from server");

      setEntries(data);
      setFilteredEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setNotificationMessage(error.message);
      setNotificationType("error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get-accounts`);
      const data = await safeJsonParse(res);

      if (!res.ok) throw new Error(data?.message || "Failed to fetch accounts");
      if (!data) throw new Error("Invalid JSON from server");

      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setNotificationMessage(error.message);
      setNotificationType("error");
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchAccounts();
  }, []);

  // ✅ Handle filter
  const handleAccountFilter = (accountId) => {
    setSelectedAccount(accountId);

    if (accountId === "all") {
      setFilteredEntries(entries);
      return;
    }

    const filtered = entries.filter((entry) => {
      const debitMatch =
        entry.debitAccount?._id === accountId ||
        entry.debitAccount === accountId;

      const creditMatch = entry.creditEntries?.some(
        (c) => c.account?._id === accountId || c.account === accountId
      );

      return debitMatch || creditMatch;
    });

    setFilteredEntries(filtered);
  };

  // ✅ Delete journal entry
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/delete-journal-entry/${id}`, {
        method: "DELETE",
      });

      const data = await safeJsonParse(res);

      if (!res.ok) throw new Error(data?.message || "Delete failed");

      setEntries((prev) => prev.filter((entry) => entry._id !== id));
      setFilteredEntries((prev) => prev.filter((entry) => entry._id !== id));
      setNotificationMessage(data?.message || "Entry deleted successfully!");
      setNotificationType("success");
    } catch (error) {
      console.error(error);
      setNotificationMessage(error.message);
      setNotificationType("error");
    }
  };

  return (
    <SidebarLayout>
      {/* Top Navigation Bar */}
      <div className="w-full bg-gray-800 text-white rounded-t-xl flex flex-wrap justify-center md:justify-start items-center px-6 py-3 mb-6 shadow-md">
        <Link
          to="/general-journal-entry"
          className="px-5 py-2 rounded-md font-medium transition-colors duration-300 bg-gray-700 hover:bg-gray-600 mr-3"
        >
          + Create Journal Entry
        </Link>
        <Link
          to="/view-general-entries"
          className="px-5 py-2 rounded-md font-medium transition-colors duration-300 bg-blue-600 hover:bg-blue-700"
        >
          📋 View Journal Entries
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">Filter by Account</h3>
        <select
          value={selectedAccount}
          onChange={(e) => handleAccountFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
        >
          <option value="all">All Accounts</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.accountName}
            </option>
          ))}
        </select>
      </div>

      {/* Entries Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          VIEW GENERAL JOURNAL ENTRIES
        </h2>

        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading entries...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            No journal entries found for this account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                    Debit Account
                  </th>
                  <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                    Debit Amount
                  </th>
                  <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                    Credit Accounts
                  </th>
                  <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                    Date
                  </th>
                  <th className="text-center px-6 py-3 text-gray-700 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-800">
                      {entry.description || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {entry.debitAccount?.accountName || entry.debitAccount}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      ${entry.debitAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <ul className="list-disc list-inside space-y-1">
                        {entry.creditEntries?.map((credit, i) => (
                          <li key={i}>
                            {credit.account?.accountName || credit.account} — $
                            {credit.amount?.toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Notification
        message={notificationMessage}
        type={notificationType}
        onClose={() => setNotificationMessage("")}
      />
    </SidebarLayout>
  );
}
