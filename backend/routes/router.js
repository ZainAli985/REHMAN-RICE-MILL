import express from "express";
import { login } from "../controllers/auth.js";
import { createAccount, getAccounts } from "../controllers/accounts.js";
import { createGeneralEntry, deleteGeneralEntry, getGeneralEntries } from "../controllers/generalJournalController.js";
import {
  createSalesInvoice,
  getAllSalesInvoices,
  getSalesInvoiceById,
  updateSalesInvoice,
  deleteSalesInvoice,
} from "../controllers/salesInvoiceController.js";
import {
  createPurchaseInvoice,
  getAllPurchaseInvoices,
  getPurchaseInvoiceById,
  updatePurchaseInvoice,
  deletePurchaseInvoice,
} from "../controllers/purchaseInvoiceController.js";

const router = express.Router();

// Auth routes
router.post('/login', login);

// Accounts routes
router.post("/create-account", createAccount);
router.get("/get-accounts", getAccounts);

// General Journal routes
router.post("/create-journal-entry", createGeneralEntry);
router.get("/get-journal-entries", getGeneralEntries);
router.delete("/delete-journal-entry/:id", deleteGeneralEntry);

// Sales Invoice routes
router.post("/sales-invoice/create", createSalesInvoice);
router.get("/sales-invoice", getAllSalesInvoices);
router.get("/sales-invoice/:id", getSalesInvoiceById);
router.put("/sales-invoice/:id", updateSalesInvoice);
router.delete("/sales-invoice/:id", deleteSalesInvoice);

// Purchase Invoice routes
router.post("/purchase-invoice/create", createPurchaseInvoice);
router.get("/purchase-invoice", getAllPurchaseInvoices);
router.get("/purchase-invoice/:id", getPurchaseInvoiceById);
router.put("/purchase-invoice/:id", updatePurchaseInvoice);
router.delete("/purchase-invoice/:id", deletePurchaseInvoice);

export default router;
