import mongoose from "mongoose";

const creditEntrySchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Credit amount must be positive"],
  },
});

const generalJournalEntrySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      default: "",
    },
    comments: {
      type: String,
      trim: true,
      default: "",
    },
    debitAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Debit account is required"],
    },
    debitAmount: {
      type: Number,
      required: [true, "Debit amount is required"],
      min: [0, "Debit amount must be positive"],
    },
    creditEntries: {
      type: [creditEntrySchema],
      validate: [
        {
          validator: function (arr) {
            return arr.length > 0;
          },
          message: "At least one credit entry is required.",
        },
      ],
    },
    totalCredit: {
      type: Number,
      required: true,
      default: 0,
    },
    isBalanced: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔹 Pre-save validation: ensure debit == total credits
generalJournalEntrySchema.pre("save", function (next) {
  this.totalCredit = this.creditEntries.reduce((sum, c) => sum + c.amount, 0);
  this.isBalanced = this.debitAmount === this.totalCredit;
  if (!this.isBalanced) {
    return next(new Error("Debit and Credit totals must be equal."));
  }
  next();
});

export default mongoose.model("GeneralJournalEntry", generalJournalEntrySchema);
