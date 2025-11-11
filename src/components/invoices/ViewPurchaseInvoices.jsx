import React, { useEffect, useState } from "react";
import SidebarLayout from "../layout/SidebarLayout.jsx";
import Notification from "../Notification.jsx";
import API_BASE_URL from "../../../config/API_BASE_URL.js";

const ViewPurchaseInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "info" });

  const [summary, setSummary] = useState({
    total1: 0,
    total2: 0,
    average: 0,
    totalPurchase: 0,
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/purchase-invoice`);
        const data = await res.json();
        if (data.success) {
          setInvoices(data.invoices);
          calculateSummary(data.invoices);
        } else {
          setNotification({ message: data.message || "Failed to fetch invoices", type: "error" });
        }
      } catch (error) {
        console.error(error);
        setNotification({ message: "Server error!", type: "error" });
      }
    };
    fetchInvoices();
  }, []);

  const calculateSummary = (invoices) => {
    if (invoices.length === 0) return;

    let total1 = 0; // Sum of finalWeight
    let total2 = 0; // Sum of netWeight
    let sumForAverage = 0; // Sum for calculating Average
    let totalPurchase = 0; // Sum of weightKG

    invoices.forEach(inv => {
      total1 += Number(inv.finalWeight || 0);
      total2 += Number(inv.netWeight || 0);
      sumForAverage += Number(inv.netWeight40KG || 0);
      totalPurchase += Number(inv.weightKG || 0);
    });

    setSummary({
      total1: total1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      total2: total2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      average: (sumForAverage / invoices.length).toFixed(5),
      totalPurchase: totalPurchase.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    });
  };

  const openInvoicePrint = (invoice) => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;

    const content = `
      <html>
        <head>
          <title>Purchase Invoice ${invoice.builtyNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #000; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>Purchase Invoice: ${invoice.builtyNumber}</h2>
          <p><strong>Date:</strong> ${invoice.date}</p>
          <p><strong>Ledger Reference:</strong> ${invoice.ledgerReference}</p>
          <p><strong>Vehicle Number:</strong> ${invoice.vehicleNumber}</p>
          <p><strong>Vendor:</strong> ${invoice.vendorName}</p>
          <p><strong>Broker:</strong> ${invoice.brokerName}</p>
          <p><strong>Paddy Type:</strong> ${invoice.paddyType}</p>

          <table>
            <tr>
              <th>Quantity</th><th>Empty Vehicle Weight</th><th>Filled Vehicle Weight</th><th>Subtract Weight</th>
            </tr>
            <tr>
              <td>${invoice.quantity}</td>
              <td>${invoice.emptyVehicleWeight}</td>
              <td>${invoice.filledVehicleWeight}</td>
              <td>${invoice.subtractWeight}</td>
            </tr>
          </table>

          <table>
            <tr>
              <th>Bag Weight</th><th>Final Weight</th><th>Moisture %</th><th>Moisture Adj. Cal.</th>
            </tr>
            <tr>
              <td>${invoice.bagWeight}</td>
              <td>${invoice.finalWeight}</td>
              <td>${invoice.moisturePercent}</td>
              <td>${invoice.moistureAdjCal}</td>
            </tr>
          </table>

          <table>
            <tr>
              <th>Moisture Adjustment</th><th>Net Weight Cal.</th><th>Net Weight</th><th>Net Weight 40KG</th>
            </tr>
            <tr>
              <td>${invoice.moistureAdjustment}</td>
              <td>${invoice.netWeightCal}</td>
              <td>${invoice.netWeight}</td>
              <td>${invoice.netWeight40KG}</td>
            </tr>
          </table>

          <table>
            <tr>
              <th>Weight KG</th><th>Rate / 40kg</th><th>Amount Cal.</th><th>Amount</th>
            </tr>
            <tr>
              <td>${invoice.weightKG}</td>
              <td>${invoice.rate40kg}</td>
              <td>${invoice.amountCal}</td>
              <td>${invoice.amount}</td>
            </tr>
          </table>

          <p><strong>Difference:</strong> ${invoice.difference}</p>
          <p><strong>Rent Adjustment:</strong> ${invoice.rentAdjustment}</p>
          <script>window.print();</script>
        </body>
      </html>
    `;

    newWindow.document.write(content);
    newWindow.document.close();
  };

  return (
    <SidebarLayout>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "info" })}
      />

      <h2 className="text-2xl font-bold mb-4">View Purchase Invoices</h2>

      {/* Highlight Averages */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-200 p-4 rounded text-center font-semibold">Total</div>
        <div className="bg-gray-200 p-4 rounded text-center font-semibold">Total</div>
        <div className="bg-gray-200 p-4 rounded text-center font-semibold">Average</div>
        <div className="bg-gray-200 p-4 rounded text-center font-semibold">Total Purchase</div>

        <div className="bg-white p-4 rounded text-center font-semibold">{summary.total1}</div>
        <div className="bg-white p-4 rounded text-center font-semibold">{summary.total2}</div>
        <div className="bg-white p-4 rounded text-center font-semibold">{summary.average}</div>
        <div className="bg-white p-4 rounded text-center font-semibold">{summary.totalPurchase}</div>
      </div>

      {invoices.length === 0 ? (
        <p>No purchase invoices found.</p>
      ) : (
        <div className="space-y-8">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white shadow-md p-6 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  Invoice: {invoice.builtyNumber} ({invoice.date})
                </h3>
                <button
                  onClick={() => openInvoicePrint(invoice)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View/Print
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p><strong>Ledger Reference:</strong> {invoice.ledgerReference}</p>
                  <p><strong>Vehicle Number:</strong> {invoice.vehicleNumber}</p>
                  <p><strong>Vendor:</strong> {invoice.vendorName}</p>
                  <p><strong>Broker:</strong> {invoice.brokerName}</p>
                  <p><strong>Paddy Type:</strong> {invoice.paddyType}</p>
                </div>

                <div>
                  <p><strong>Quantity:</strong> {invoice.quantity}</p>
                  <p><strong>Empty Vehicle Weight:</strong> {invoice.emptyVehicleWeight}</p>
                  <p><strong>Filled Vehicle Weight:</strong> {invoice.filledVehicleWeight}</p>
                  <p><strong>Subtract Weight:</strong> {invoice.subtractWeight}</p>
                  <p><strong>Bag Weight:</strong> {invoice.bagWeight}</p>
                </div>

                <div>
                  <p><strong>Final Weight:</strong> {invoice.finalWeight}</p>
                  <p><strong>Moisture %:</strong> {invoice.moisturePercent}</p>
                  <p><strong>Moisture Adj. Cal.:</strong> {invoice.moistureAdjCal}</p>
                  <p><strong>Moisture Adjustment:</strong> {invoice.moistureAdjustment}</p>
                  <p><strong>Net Weight Cal.:</strong> {invoice.netWeightCal}</p>
                  <p><strong>Net Weight:</strong> {invoice.netWeight}</p>
                  <p><strong>Net Weight 40KG:</strong> {invoice.netWeight40KG}</p>
                </div>

                <div>
                  <p><strong>Weight KG:</strong> {invoice.weightKG}</p>
                  <p><strong>Rate / 40kg:</strong> {invoice.rate40kg}</p>
                  <p><strong>Amount Cal.:</strong> {invoice.amountCal}</p>
                  <p><strong>Amount:</strong> {invoice.amount}</p>
                  <p><strong>Difference:</strong> {invoice.difference}</p>
                  <p><strong>Rent Adjustment:</strong> {invoice.rentAdjustment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SidebarLayout>
  );
};

export default ViewPurchaseInvoices;
