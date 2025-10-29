// controllers/accountController.js (snippet)
import Account from "../models/Account.js";

const allowedSubAccountOptions = {
  Assets: ["Current Assets", "Fixed Assets"],
  Liabilities: ["Current Liabilities", "Fixed Liabilities"],
  Equity: ["Equity"],
  Revenue: ["Revenue", "Contra Revenue"],
  Expense: ["Expenses"],
};

export const createAccount = async (req, res) => {
  try {
    const { accountType, subAccountType, accountName } = req.body;

    if (!accountType || !subAccountType || !accountName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // server-side enforcement
    const allowed = allowedSubAccountOptions[accountType];
    if (!allowed || !allowed.includes(subAccountType)) {
      return res.status(400).json({ message: "Invalid subAccountType for selected accountType." });
    }

    const account = new Account({ accountType, subAccountType, accountName });
    await account.save();

    res.status(201).json({ message: "Account created successfully!", account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating account." });
  }
};


// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Public
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Server error while fetching accounts." });
  }
};
