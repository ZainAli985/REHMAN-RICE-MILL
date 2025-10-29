import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL";
import Notification from "../Notification.jsx";

export default function ViewGeneralEntries() {
  const [entries, setEntries] = useState([]);
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

      if (!res.ok) {
        const message =
          (data && data.message) ||
          `Server returned ${res.status} ${res.statusText}`;
        throw new Error(message);
      }

      if (!data) throw new Error("Invalid JSON from server");
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setNotificationMessage(error.message);
      setNotificationType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

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

      if (!res.ok) {
        const message =
          (data && data.message) ||
          `Server returned ${res.status} ${res.statusText}`;
        throw new Error(message);
      }

      setEntries((prev) => prev.filter((entry) => entry._id !== id));
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

      {/* Entries Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          VIEW GENERAL JOURNAL ENTRIES
        </h2>

        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading entries...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            No journal entries found.
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
                {entries.map((entry) => (
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
