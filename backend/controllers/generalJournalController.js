import GeneralJournalEntry from "../models/GeneralJournalEntry.js";
import Account from "../models/Account.js";

// Create a new general journal entry
export const createGeneralEntry = async (req, res) => {
  try {
    const { description, comments, debitAccount, debitAmount, creditEntries } = req.body;

    if (!debitAccount || !debitAmount || !creditEntries || creditEntries.length === 0) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Calculate total credit
    const totalCredit = creditEntries.reduce((sum, c) => sum + (c.amount || 0), 0);

    if (Number(debitAmount) !== totalCredit) {
      return res.status(400).json({ message: "Debit and Credit amounts must be equal." });
    }

    const newEntry = new GeneralJournalEntry({
      description,
      comments,
      debitAccount,
      debitAmount,
      creditEntries,
    });

    await newEntry.save();
    res.status(201).json({ message: "Journal entry recorded successfully.", entry: newEntry });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    res.status(500).json({ message: "Server error while saving journal entry." });
  }
};

// Get all general journal entries
export const getGeneralEntries = async (req, res) => {
  try {
    const entries = await GeneralJournalEntry.find()
      .populate("debitAccount", "accountName accountType")
      .populate("creditEntries.account", "accountName accountType")
      .sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ message: "Failed to fetch journal entries." });
  }
};

export const deleteGeneralEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Entry ID is required." });
    }

    const entry = await GeneralJournalEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found." });
    }

    await entry.deleteOne(); // or entry.remove() depending on Mongoose version

    res.status(200).json({ message: "Journal entry deleted successfully." });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({ message: "Server error while deleting journal entry." });
  }
};