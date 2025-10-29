import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      required: true,
      enum: ["Assets", "Liabilities", "Equity", "Revenue", "Expense"],
    },
    subAccountType: {
      type: String,
      required: true,
      enum: [
        "Current Assets",
        "Fixed Assets",
        "Current Liabilities",
        "Fixed Liabilities",
        "Equity",
        "Expenses",
        "Revenue",
        "Contra Revenue",
      ],
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
