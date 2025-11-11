import GeneralJournal from "../models/GeneralJournalEntry.js"; // Your general journal model
import PurchaseInvoice from "../models/PurchaseInvoice.js";
import SalesInvoice from "../models/SalesInvoice.js";

/**
 * GET /ledger
 * Optional query params: startDate, endDate, account
 */
export const getLedger = async (req, res) => {
  try {
    const { startDate, endDate, account } = req.query;

    // Fetch all journal entries
    let journalEntries = await GeneralJournal.find();

    // Optional: include purchase invoices as journal entries
    const purchaseInvoices = await PurchaseInvoice.find();
    const salesInvoices = await SalesInvoice.find();

    // Map purchase invoices to ledger format
    const purchaseLedgerEntries = purchaseInvoices.flatMap((inv) => [
      {
        date: inv.date,
        account: "Inventory",
        description: "Purchased Inventory",
        debit: inv.amount,
        credit: 0,
      },
      {
        date: inv.date,
        account: inv.vendorName,
        description: "Purchased Inventory",
        debit: 0,
        credit: inv.amount,
      },
    ]);

    // Map sales invoices to ledger format
    const salesLedgerEntries = salesInvoices.flatMap((inv) => [
      {
        date: inv.date,
        account: "Cash",
        description: "Sold Inventory",
        debit: inv.amount,
        credit: 0,
      },
      {
        date: inv.date,
        account: "Sales",
        description: "Sold Inventory",
        debit: 0,
        credit: inv.amount,
      },
    ]);

    // Map journal entries to ledger format
    const journalLedgerEntries = journalEntries.map((entry) => ({
      date: entry.date,
      account: entry.account,
      description: entry.description,
      debit: entry.debit || 0,
      credit: entry.credit || 0,
    }));

    // Combine all entries
    let allEntries = [
      ...journalLedgerEntries,
      ...purchaseLedgerEntries,
      ...salesLedgerEntries,
    ];

    // Apply filters
    if (startDate) {
      allEntries = allEntries.filter((e) => new Date(e.date) >= new Date(startDate));
    }
    if (endDate) {
      allEntries = allEntries.filter((e) => new Date(e.date) <= new Date(endDate));
    }
    if (account) {
      allEntries = allEntries.filter((e) =>
        e.account.toLowerCase().includes(account.toLowerCase())
      );
    }

    // Sort by date
    allEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ success: true, entries: allEntries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
