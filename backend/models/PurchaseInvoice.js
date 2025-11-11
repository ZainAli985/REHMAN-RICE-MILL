import mongoose from "mongoose";

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    ledgerReference: String,
    vehicleNumber: { type: String, required: true },
    builtyNumber: { type: String, required: true },
    vendorName: { type: String, required: true },
    brokerName: String,
    paddyType: String,
    quantity: Number,
    emptyVehicleWeight: Number,
    filledVehicleWeight: Number,
    subtractWeight: Number,
    bagWeight: Number,
    finalWeight: Number,
    moisturePercent: Number,
    moistureAdjCal: Number,
    moistureAdjustment: Number,
    netWeight: Number,
    netWeight40KG: Number,
    weightKG: Number,
    rate40kg: Number,
    amountCal: Number,
    amount: Number,
    difference: Number,
    rentAdjustment: Number,
  },
  { timestamps: true }
);

const PurchaseInvoice =
  mongoose.models.PurchaseInvoice ||
  mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);

export default PurchaseInvoice;
