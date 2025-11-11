import PurchaseInvoice from "../models/PurchaseInvoice.js";

// Create new purchase invoice
export const createPurchaseInvoice = async (req, res) => {
  try {
    const invoice = new PurchaseInvoice(req.body);
    await invoice.save();
    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all purchase invoices
export const getAllPurchaseInvoices = async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single invoice by ID
export const getPurchaseInvoiceById = async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.findById(req.params.id);
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update invoice
export const updatePurchaseInvoice = async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete invoice
export const deletePurchaseInvoice = async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.findByIdAndDelete(req.params.id);
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });
    res.status(200).json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
