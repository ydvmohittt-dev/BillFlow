import mongoose from "mongoose";
const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0.01 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);
const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    invoiceNumber: { type: String, required: true, trim: true },
    items: {
      type: [lineItemSchema],
      required: true,
      validate: (v) => v.length > 0,
    },
    taxPercent: { type: Number, default: 0, min: 0, max: 100 },
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true },
);

//it ensure invoice number under a particular user will be unique and can be efficiently fetch based on user.
invoiceSchema.index({ user: 1, invoiceNumber: 1 }, { unique: true });


//it ensure all the invoices will be fetched efficiently based on user and are sorted in newest first format
invoiceSchema.index({ user: 1, createdAt: -1 });
export default mongoose.model("Invoice", invoiceSchema);
