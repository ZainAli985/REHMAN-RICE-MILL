import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL.js";
import Notification from "../Notification.jsx";

export default function GeneralJournalEntry() {
  const [accounts, setAccounts] = useState([]);
  const [debitAccount, setDebitAccount] = useState("");
  const [debitSearch, setDebitSearch] = useState("");
  const [debitDropdownOpen, setDebitDropdownOpen] = useState(false);

  const [creditEntries, setCreditEntries] = useState([
    { account: "", amount: "", search: "", open: false },
  ]);

  const [debitAmount, setDebitAmount] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");

  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const triggerNotification = (msg, type = "info") => {
    setNotificationMessage("");
    setTimeout(() => {
      setNotificationMessage(msg);
      setNotificationType(type);
    }, 20);
  };

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

  const handleAddCreditRow = () => {
    setCreditEntries((prev) => [
      ...prev,
      { account: "", amount: "", search: "", open: false },
    ]);
  };

  const handleDeleteCreditRow = (index) => {
    if (creditEntries.length === 1) {
      triggerNotification("At least one credit entry is required!", "warning");
      return;
    }
    setCreditEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreditChange = (index, field, value) => {
    setCreditEntries((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const calcTotalCredit = () =>
    creditEntries.reduce((sum, c) => {
      const n = parseFloat(String(c.amount).trim()) || 0;
      return sum + n;
    }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!debitAccount || String(debitAmount).trim() === "") {
      triggerNotification("Fill all required fields (*)", "warning");
      return;
    }

    const debit = Number(parseFloat(String(debitAmount).trim()) || 0);
    const totalCredit = Number(calcTotalCredit());

    if (Math.abs(debit - totalCredit) > 0.001) {
      triggerNotification("Debit and Credit amounts must be equal!", "error");
      return;
    }

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
      creditEntries: creditEntries.map((c) => ({
        account: c.account,
        amount: Number(parseFloat(String(c.amount))),
      })),
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
        setDebitAccount("");
        setDebitAmount("");
        setCreditEntries([{ account: "", amount: "", search: "", open: false }]);
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

  const totalCredit = calcTotalCredit();
  const debitNumeric = Number(parseFloat(String(debitAmount).trim()) || 0);
  const balanced = Math.abs(debitNumeric - totalCredit) <= 0.001;

  const filterAccounts = (query) =>
    accounts.filter(
      (a) =>
        a.accountName.toLowerCase().includes(query.toLowerCase()) ||
        a.accountType.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <SidebarLayout>
      {/* Top Buttons */}
      <div className="w-full bg-gray-800 text-white rounded-t-xl flex flex-wrap justify-center md:justify-start items-center px-6 py-3 mb-6 shadow-md">
        <Link
          to="/general-journal-entry"
          className="px-5 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 mr-3"
        >
          + Create Journal Entry
        </Link>
        <Link
          to="/view-general-entries"
          className="px-5 py-2 rounded-md font-medium bg-gray-700 hover:bg-gray-600"
        >
          📋 View Journal Entries
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          GENERAL JOURNAL ENTRY
        </h2>

        <div className="flex flex-col md:flex-row justify-between mb-6 text-sm text-gray-600">
          <span>
            Debit: <b>${debitNumeric.toFixed(2)}</b>
          </span>
          <span>
            Credit: <b>${totalCredit.toFixed(2)}</b>
          </span>
          <span>
            {balanced ? (
              <span className="text-green-600 font-semibold">Balanced ✓</span>
            ) : (
              <span className="text-red-600 font-semibold">Not balanced</span>
            )}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Debit Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Debit Account Dropdown */}
            <div className="relative">
              <label className="block font-semibold text-gray-700 mb-2">
                Debit Account *
              </label>
              <div
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white cursor-pointer hover:ring-2 hover:ring-blue-500"
                onClick={() => setDebitDropdownOpen((p) => !p)}
              >
                {debitAccount
                  ? accounts.find((a) => a._id === debitAccount)?.accountName ||
                    "Select Debit Account"
                  : "Select Debit Account"}
              </div>
              {debitDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <input
                    type="text"
                    value={debitSearch}
                    onChange={(e) => setDebitSearch(e.target.value)}
                    placeholder="Search account..."
                    className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  />
                  {filterAccounts(debitSearch).map((acc) => (
                    <div
                      key={acc._id}
                      className="px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setDebitAccount(acc._id);
                        setDebitDropdownOpen(false);
                        setDebitSearch("");
                      }}
                    >
                      {acc.accountName} ({acc.accountType})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Debit Amount */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Debit Amount *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={debitAmount}
                onChange={(e) => setDebitAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Credit Section */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Credit Accounts *
            </label>
            {creditEntries.map((entry, index) => (
              <div
                key={index}
                className="grid md:grid-cols-2 gap-4 mb-3 items-center"
              >
                {/* Credit Account Dropdown */}
                <div className="relative">
                  <div
                    className="border border-gray-300 rounded-lg px-4 py-3 bg-white cursor-pointer hover:ring-2 hover:ring-blue-500"
                    onClick={() =>
                      setCreditEntries((prev) =>
                        prev.map((e, i) => ({
                          ...e,
                          open: i === index ? !e.open : false,
                        }))
                      )
                    }
                  >
                    {entry.account
                      ? accounts.find((a) => a._id === entry.account)
                          ?.accountName || "Select Credit Account"
                      : "Select Credit Account"}
                  </div>
                  {entry.open && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <input
                        type="text"
                        value={entry.search}
                        onChange={(e) =>
                          handleCreditChange(index, "search", e.target.value)
                        }
                        placeholder="Search account..."
                        className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      />
                      {filterAccounts(entry.search).map((acc) => (
                        <div
                          key={acc._id}
                          className="px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            handleCreditChange(index, "account", acc._id);
                            handleCreditChange(index, "open", false);
                            handleCreditChange(index, "search", "");
                          }}
                        >
                          {acc.accountName} ({acc.accountType})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Credit Amount */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={entry.amount}
                    onChange={(e) =>
                      handleCreditChange(index, "amount", e.target.value)
                    }
                    placeholder="Enter amount"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  />
                  {creditEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCreditRow(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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

          {/* Description & Comments */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Journal Entry
            </button>
          </div>
        </form>
      </div>

      <Notification
        message={notificationMessage}
        type={notificationType}
        onClose={() => setNotificationMessage("")}
      />
    </SidebarLayout>
  );
}
