import mongoose from "mongoose";

const salesInvoiceSchema = new mongoose.Schema(
  {
    date: String,
    vehicleNo: String,
    builtyNo: String,
    vendorName: String,
    brokerName: String,
    paddyType: String,
    quantity: Number,
    weight: Number,
    bagWeight: Number,
    netWeight: Number,
    netWeight40: Number,
    rate40: Number,
    amount: Number,
    sutliSilaiRate: Number,
    sutliSilaiAmount: Number,
    totalAmount: Number,
    brokeryRate: Number,
    brokery: Number,
    totalAmount2: Number,
  },
  { timestamps: true }
);

const SalesInvoice =
  mongoose.models.SalesInvoice ||
  mongoose.model("SalesInvoice", salesInvoiceSchema);

export default SalesInvoice;
