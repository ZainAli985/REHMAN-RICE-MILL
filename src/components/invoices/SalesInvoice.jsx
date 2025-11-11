import React, { useState, useEffect } from "react";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import Notification from "../Notification.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL.js";

const SalesInvoice = () => {
  const [form, setForm] = useState({
    date: "",
    vehicleNo: "",
    builtyNo: "",
    vendorName: "",
    brokerName: "",
    paddyType: "",
    quantity: "",
    weight: "",
    bagWeight: "",
    netWeight: "",
    netWeight40: "",
    rate40: "",
    amount: "",
    sutliSilaiRate: "",
    sutliSilaiAmount: "",
    totalAmount: "",
    brokeryRate: "",
    brokery: "",
    totalAmount2: "",
  });

  const [notification, setNotification] = useState({ message: "", type: "info" });

  // Auto calculations
  useEffect(() => {
    const netWeight = form.weight && form.bagWeight ? form.weight - form.bagWeight : "";
    const netWeight40 = netWeight ? (netWeight / 40).toFixed(2) : "";
    const amount = netWeight40 && form.rate40 ? (netWeight40 * form.rate40).toFixed(2) : "";
    const sutliSilaiAmount =
      form.sutliSilaiRate && form.quantity ? (form.sutliSilaiRate * form.quantity).toFixed(2) : "";
    const totalAmount =
      amount && sutliSilaiAmount ? (parseFloat(amount) + parseFloat(sutliSilaiAmount)).toFixed(2) : amount || "";
    const brokery =
      totalAmount && form.brokeryRate
        ? ((parseFloat(totalAmount) * parseFloat(form.brokeryRate)) / 100).toFixed(2)
        : "";
    const totalAmount2 =
      totalAmount && brokery ? (parseFloat(totalAmount) - parseFloat(brokery)).toFixed(2) : totalAmount || "";

    setForm((prev) => ({
      ...prev,
      netWeight,
      netWeight40,
      amount,
      sutliSilaiAmount,
      totalAmount,
      brokery,
      totalAmount2,
    }));
  }, [
    form.weight,
    form.bagWeight,
    form.rate40,
    form.quantity,
    form.sutliSilaiRate,
    form.brokeryRate,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.date || !form.vehicleNo || !form.builtyNo || !form.vendorName) {
      return setNotification({ message: "Please fill all required fields!", type: "error" });
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/sales-invoice/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (data.success) {
        setNotification({ message: "Invoice submitted successfully!", type: "success" });
        setForm({
          date: "",
          vehicleNo: "",
          builtyNo: "",
          vendorName: "",
          brokerName: "",
          paddyType: "",
          quantity: "",
          weight: "",
          bagWeight: "",
          netWeight: "",
          netWeight40: "",
          rate40: "",
          amount: "",
          sutliSilaiRate: "",
          sutliSilaiAmount: "",
          totalAmount: "",
          brokeryRate: "",
          brokery: "",
          totalAmount2: "",
        });
      } else {
        setNotification({ message: data.message || "Failed to submit invoice.", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({ message: "Server error! Try again.", type: "error" });
    }
  };

  return (
    <SidebarLayout>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "info" })}
      />

      <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
          Sales Invoice Entry
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <input name="date" type="date" value={form.date} onChange={handleChange} className="input" placeholder="Date" />
          <input name="vehicleNo" value={form.vehicleNo} onChange={handleChange} className="input" placeholder="Vehicle No." />
          <input name="builtyNo" value={form.builtyNo} onChange={handleChange} className="input" placeholder="Builty No." />
          <input name="vendorName" value={form.vendorName} onChange={handleChange} className="input" placeholder="Vendor Name" />
          <input name="brokerName" value={form.brokerName} onChange={handleChange} className="input" placeholder="Broker Name" />
          <input name="paddyType" value={form.paddyType} onChange={handleChange} className="input" placeholder="Paddy Type" />
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} className="input" placeholder="Quantity" />
          <input name="weight" type="number" value={form.weight} onChange={handleChange} className="input" placeholder="Weight" />
          <input name="bagWeight" type="number" value={form.bagWeight} onChange={handleChange} className="input" placeholder="Bag Weight" />
          <input name="netWeight" type="number" value={form.netWeight} readOnly className="input bg-gray-100" placeholder="Net Weight" />
          <input name="netWeight40" type="number" value={form.netWeight40} readOnly className="input bg-gray-100" placeholder="Net Weight / 40Kg" />
          <input name="rate40" type="number" value={form.rate40} onChange={handleChange} className="input" placeholder="Rate / 40Kg" />
          <input name="amount" type="number" value={form.amount} readOnly className="input bg-gray-100" placeholder="Amount" />
          <input name="sutliSilaiRate" type="number" value={form.sutliSilaiRate} onChange={handleChange} className="input" placeholder="Sutli Silai Rate" />
          <input name="sutliSilaiAmount" type="number" value={form.sutliSilaiAmount} readOnly className="input bg-gray-100" placeholder="Sutli Silai Amount" />
          <input name="totalAmount" type="number" value={form.totalAmount} readOnly className="input bg-gray-100" placeholder="Total Amount" />
          <input name="brokeryRate" type="number" value={form.brokeryRate} onChange={handleChange} className="input" placeholder="Brokery Rate (%)" />
          <input name="brokery" type="number" value={form.brokery} readOnly className="input bg-gray-100" placeholder="Brokery" />
          <input name="totalAmount2" type="number" value={form.totalAmount2} readOnly className="input bg-gray-100" placeholder="Total Amount 2" />

          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Save Invoice
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
};

export default SalesInvoice;
