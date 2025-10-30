import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL.js";
import Notification from "../Notification.jsx";

export default function GeneralJournalEntry() {
  const [accounts, setAccounts] = useState([]);
  const [debitAccount, setDebitAccount] = useState("");
  const [debitAmount, setDebitAmount] = useState("");
  const [creditEntries, setCreditEntries] = useState([{ account: "", amount: "" }]);
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");

  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  // Helper to trigger notification reliably even if same text repeats
  const triggerNotification = (msg, type = "info") => {
    // quick reset to force Notification remount
    setNotificationMessage("");
    setTimeout(() => {
      setNotificationMessage(msg);
      setNotificationType(type);
    }, 20);
  };

  // Fetch account list
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get-accounts`);
        const data = await res.json();
        if (res.ok) setAccounts(data);
        else throw new Error(data?.message || "Failed to fetch accounts");
      } catch (error) {
        console.error(error);
        triggerNotification("Error fetching accounts", "error");
      }
    };
    fetchAccounts();
  }, []);

  // Add new credit row
  const handleAddCreditRow = () => {
    setCreditEntries((prev) => [...prev, { account: "", amount: "" }]);
  };

  // Delete a credit row
  const handleDeleteCreditRow = (index) => {
    if (creditEntries.length === 1) {
      triggerNotification("At least one credit entry is required!", "warning");
      return;
    }
    setCreditEntries((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle credit input change
  const handleCreditChange = (index, field, value) => {
    setCreditEntries((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Calculate totals (used for validation / live indicator)
  const calcTotalCredit = () =>
    creditEntries.reduce((sum, c) => {
      const n = parseFloat(String(c.amount).trim()) || 0;
      return sum + n;
    }, 0);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic required checks
    if (!debitAccount || (String(debitAmount).trim() === "")) {
      triggerNotification("Fill all required fields (*)", "warning");
      return;
    }

    // numeric parsing
    const debit = Number(parseFloat(String(debitAmount).trim()) || 0);
    const totalCredit = Number(calcTotalCredit());

    // numeric comparison with tolerance to avoid floating point issues
    if (Math.abs(debit - totalCredit) > 0.001) {
      triggerNotification("Debit And Credit Amounts Must Be Equal!", "error");
      return;
    }

    // ensure every credit has an account and positive amount
    for (let i = 0; i < creditEntries.length; i++) {
      const c = creditEntries[i];
      if (!c.account || String(c.amount).trim() === "") {
        triggerNotification("Each credit line requires account and amount", "warning");
        return;
      }
      if (Number(parseFloat(String(c.amount))) <= 0) {
        triggerNotification("Credit amounts must be greater than 0", "warning");
        return;
      }
    }

    const entryData = {
      debitAccount,
      debitAmount: debit,
      creditEntries: creditEntries.map((c) => ({ account: c.account, amount: Number(parseFloat(String(c.amount))) })),
      description,
      comments,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/create-journal-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData),
      });

      const data = await res.json();
      if (res.ok) {
        triggerNotification(data.message || "Journal entry created!", "success");

        // Reset form
        setDebitAccount("");
        setDebitAmount("");
        setCreditEntries([{ account: "", amount: "" }]);
        setDescription("");
        setComments("");
      } else {
        throw new Error(data?.message || "Failed to create journal entry");
      }
    } catch (error) {
      console.error(error);
      triggerNotification(error.message || "Server error while creating entry", "error");
    }
  };

  // live balance state (optional display)
  const totalCredit = calcTotalCredit();
  const debitNumeric = Number(parseFloat(String(debitAmount).trim()) || 0);
  const balanced = Math.abs(debitNumeric - totalCredit) <= 0.001;

  return (
    <SidebarLayout>
      {/* Top Navigation Bar */}
      <div className="w-full bg-gray-800 text-white rounded-t-xl flex flex-wrap justify-center md:justify-start items-center px-6 py-3 mb-6 shadow-md">
        <Link
          to="/general-journal-entry"
          className="px-5 py-2 rounded-md font-medium transition-colors duration-300 bg-blue-600 hover:bg-blue-700 mr-3"
        >
          + Create Journal Entry
        </Link>
        <Link
          to="/view-general-entries"
          className="px-5 py-2 rounded-md font-medium transition-colors duration-300 bg-gray-700 hover:bg-gray-600"
        >
          📋 View Journal Entries
        </Link>
      </div>

      {/* Main Form */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">GENERAL JOURNAL ENTRY</h2>

        {/* Live totals indicator */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="text-sm text-gray-600">
            Debit: <span className="font-medium text-gray-800">${debitNumeric.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Credit: <span className="font-medium text-gray-800">${totalCredit.toFixed(2)}</span>
          </div>
          <div>
            {debitNumeric === 0 && totalCredit === 0 ? (
              <span className="text-gray-500 text-sm">Enter amounts to see balance</span>
            ) : balanced ? (
              <span className="text-green-600 font-semibold">Balanced ✓</span>
            ) : (
              <span className="text-red-600 font-semibold">Not balanced</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Debit Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Debit Account <span className="text-red-500">*</span>
              </label>
              <select
                value={debitAccount}
                onChange={(e) => setDebitAccount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Debit Account</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountName} ({acc.accountType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Debit Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={debitAmount}
                onChange={(e) => setDebitAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Credit Section */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Credit Accounts <span className="text-red-500">*</span>
            </label>

            {creditEntries.map((entry, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-4 mb-3 items-center">
                <select
                  value={entry.account}
                  onChange={(e) => handleCreditChange(index, "account", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Credit Account</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.accountName} ({acc.accountType})
                    </option>
                  ))}
                </select>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={entry.amount}
                    onChange={(e) => handleCreditChange(index, "amount", e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {creditEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCreditRow(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      title="Remove this line"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddCreditRow}
              className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              + Add Another Credit Account
            </button>
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Comments (optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter comments..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Save Journal Entry
            </button>
          </div>
        </form>
      </div>

      <Notification message={notificationMessage} type={notificationType} onClose={() => setNotificationMessage("")} />
    </SidebarLayout>
  );
}
