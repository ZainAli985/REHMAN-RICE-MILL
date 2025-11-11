import React, { useEffect, useState } from "react";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import Notification from "../Notification.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL.js";

const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "info" });
  const [filters, setFilters] = useState({ startDate: "", endDate: "", account: "" });

  useEffect(() => {
    fetchLedgerEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, filters]);

  const fetchLedgerEntries = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/ledger`);
      const data = await res.json();
      if (data.success) {
        // Sort by date
        const sorted = data.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEntries(sorted);
      } else {
        setNotification({ message: data.message || "Failed to fetch ledger entries", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: "Server error!", type: "error" });
    }
  };

  const applyFilters = () => {
    let temp = [...entries];

    if (filters.startDate) {
      temp = temp.filter(e => new Date(e.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      temp = temp.filter(e => new Date(e.date) <= new Date(filters.endDate));
    }
    if (filters.account) {
      temp = temp.filter(e => e.account.toLowerCase().includes(filters.account.toLowerCase()));
    }

    setFilteredEntries(temp);
  };

  // Calculate running balance
  const getRunningBalance = (entries) => {
    let balance = 0;
    return entries.map(entry => {
      balance += Number(entry.debit || 0) - Number(entry.credit || 0);
      return { ...entry, balance };
    });
  };

  const runningEntries = getRunningBalance(filteredEntries);

  // Grand totals
  const totalDebit = runningEntries.reduce((sum, e) => sum + Number(e.debit || 0), 0);
  const totalCredit = runningEntries.reduce((sum, e) => sum + Number(e.credit || 0), 0);

  return (
    <SidebarLayout>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "info" })}
      />

      <h2 className="text-2xl font-bold mb-4">Ledger</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={filters.startDate}
          onChange={e => setFilters({ ...filters, startDate: e.target.value })}
          className="input"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={e => setFilters({ ...filters, endDate: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Account"
          value={filters.account}
          onChange={e => setFilters({ ...filters, account: e.target.value })}
          className="input"
        />
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply
        </button>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Account</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Debit</th>
              <th className="border px-4 py-2">Credit</th>
              <th className="border px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {runningEntries.map((entry, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{entry.date}</td>
                <td className="border px-4 py-2">{entry.account}</td>
                <td className="border px-4 py-2">{entry.description}</td>
                <td className="border px-4 py-2 text-right">{entry.debit?.toLocaleString()}</td>
                <td className="border px-4 py-2 text-right">{entry.credit?.toLocaleString()}</td>
                <td className="border px-4 py-2 text-right">{entry.balance.toLocaleString()}</td>
              </tr>
            ))}
            {/* Grand total */}
            <tr className="font-bold bg-gray-100">
              <td className="border px-4 py-2" colSpan={3}>Grand Total</td>
              <td className="border px-4 py-2 text-right">{totalDebit.toLocaleString()}</td>
              <td className="border px-4 py-2 text-right">{totalCredit.toLocaleString()}</td>
              <td className="border px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
};

export default Ledger;
