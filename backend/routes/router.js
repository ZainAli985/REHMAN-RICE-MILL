import express from "express";
import { login } from "../controllers/auth.js";
import { createAccount, getAccounts } from "../controllers/accounts.js";
import { createGeneralEntry, deleteGeneralEntry, getGeneralEntries } from "../controllers/generalJournalController.js";

const router = express.Router();

router.post('/login', login);
router.post("/create-account", createAccount);
router.get("/get-accounts", getAccounts);
router.post("/create-journal-entry", createGeneralEntry);
router.get("/get-journal-entries", getGeneralEntries);
router.delete("/delete-journal-entry/:id", deleteGeneralEntry);

export default router;