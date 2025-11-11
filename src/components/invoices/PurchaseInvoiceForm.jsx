import React, { useState, useEffect } from "react";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import Notification from "../Notification.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL.js";

const PurchaseInvoiceForm = () => {
  const [form, setForm] = useState({
    date: "",
    ledgerReference: "",
    vehicleNumber: "",
    builtyNumber: "",
    vendorName: "",
    brokerName: "",
    paddyType: "",
    quantity: "",
    emptyVehicleWeight: "",
    filledVehicleWeight: "",
    subtractWeight: "",
    bagWeight: "",
    finalWeight: "",
    moisturePercent: "",
    moistureAdjCal: "",
    moistureAdjustment: "",
    netWeightCal: "",
    netWeight: "",
    netWeight40KG: "",
    weightKG: "",
    rate40kg: "",
    amountCal: "",
    amount: "",
    difference: "",
    rentAdjustment: ""
  });

  const [notification, setNotification] = useState({ message: "", type: "info" });

  // Auto calculations whenever relevant fields change
  useEffect(() => {
    const subtractWeight =
      form.filledVehicleWeight && form.emptyVehicleWeight
        ? form.filledVehicleWeight - form.emptyVehicleWeight
        : 0;

    const finalWeight =
      subtractWeight && form.bagWeight
        ? subtractWeight - form.bagWeight
        : subtractWeight;

    const moistureAdjCal =
      finalWeight && form.moisturePercent
        ? (finalWeight * form.moisturePercent) / 100
        : 0;

    const netWeight = finalWeight - moistureAdjCal;

    const netWeight40KG = netWeight ? netWeight / 40 : 0;

    const amount = netWeight40KG && form.rate40kg ? netWeight40KG * form.rate40kg : 0;

    setForm((prev) => ({
      ...prev,
      subtractWeight,
      finalWeight,
      moistureAdjCal,
      moistureAdjustment: moistureAdjCal,
      netWeight,
      netWeight40KG,
      amountCal: amount,
      amount
    }));
  }, [
    form.emptyVehicleWeight,
    form.filledVehicleWeight,
    form.bagWeight,
    form.moisturePercent,
    form.rate40kg
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.date || !form.vehicleNumber || !form.vendorName || !form.builtyNumber) {
      return setNotification({ message: "Please fill required fields", type: "error" });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/purchase-invoice/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        setNotification({ message: "Purchase invoice saved successfully!", type: "success" });
        setForm({
          date: "",
          ledgerReference: "",
          vehicleNumber: "",
          builtyNumber: "",
          vendorName: "",
          brokerName: "",
          paddyType: "",
          quantity: "",
          emptyVehicleWeight: "",
          filledVehicleWeight: "",
          subtractWeight: "",
          bagWeight: "",
          finalWeight: "",
          moisturePercent: "",
          moistureAdjCal: "",
          moistureAdjustment: "",
          netWeightCal: "",
          netWeight: "",
          netWeight40KG: "",
          weightKG: "",
          rate40kg: "",
          amountCal: "",
          amount: "",
          difference: "",
          rentAdjustment: ""
        });
      } else {
        setNotification({ message: data.message || "Failed to save invoice", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: "Server error!", type: "error" });
    }
  };

  return (
    <SidebarLayout>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "info" })}
      />

      <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold border-b pb-3">Purchase Invoice Entry</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
          <input type="date" name="date" value={form.date} onChange={handleChange} className="input" placeholder="Date" />
          <input name="ledgerReference" value={form.ledgerReference} onChange={handleChange} className="input" placeholder="Ledger Reference" />
          <input name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} className="input" placeholder="Vehicle Number" />
          <input name="builtyNumber" value={form.builtyNumber} onChange={handleChange} className="input" placeholder="Builty Number" />
          <input name="vendorName" value={form.vendorName} onChange={handleChange} className="input" placeholder="Vendor Name" />
          <input name="brokerName" value={form.brokerName} onChange={handleChange} className="input" placeholder="Broker Name" />
          <input name="paddyType" value={form.paddyType} onChange={handleChange} className="input" placeholder="Paddy Type" />
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="input" placeholder="Quantity" />
          <input type="number" name="emptyVehicleWeight" value={form.emptyVehicleWeight} onChange={handleChange} className="input" placeholder="Empty Vehicle Weight" />
          <input type="number" name="filledVehicleWeight" value={form.filledVehicleWeight} onChange={handleChange} className="input" placeholder="Filled Vehicle Weight" />
          <input type="number" name="subtractWeight" value={form.subtractWeight} readOnly className="input bg-gray-100" placeholder="Subtract Weight" />
          <input type="number" name="bagWeight" value={form.bagWeight} onChange={handleChange} className="input" placeholder="Bag Weight" />
          <input type="number" name="finalWeight" value={form.finalWeight} readOnly className="input bg-gray-100" placeholder="Final Weight" />
          <input type="number" name="moisturePercent" value={form.moisturePercent} onChange={handleChange} className="input" placeholder="Moisture %" />
          <input type="number" name="moistureAdjCal" value={form.moistureAdjCal} readOnly className="input bg-gray-100" placeholder="Moisture Adj. Cal." />
          <input type="number" name="moistureAdjustment" value={form.moistureAdjustment} readOnly className="input bg-gray-100" placeholder="Moisture Adjustment" />
          <input type="number" name="netWeight" value={form.netWeight} readOnly className="input bg-gray-100" placeholder="Net Weight" />
          <input type="number" name="netWeight40KG" value={form.netWeight40KG} readOnly className="input bg-gray-100" placeholder="Net Weight / 40Kg" />
          <input type="number" name="rate40kg" value={form.rate40kg} onChange={handleChange} className="input" placeholder="Rate / 40kg" />
          <input type="number" name="amountCal" value={form.amountCal} readOnly className="input bg-gray-100" placeholder="Amount Cal." />
          <input type="number" name="amount" value={form.amount} readOnly className="input bg-gray-100" placeholder="Amount" />
          <input type="number" name="difference" value={form.difference} onChange={handleChange} className="input" placeholder="Difference" />
          <input type="number" name="rentAdjustment" value={form.rentAdjustment} onChange={handleChange} className="input" placeholder="Rent Adjustment" />

          <button type="submit" className="col-span-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save Purchase Invoice
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
};

export default PurchaseInvoiceForm;
