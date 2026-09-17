import mongoose from "mongoose";
const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    billingAddress: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);
export default mongoose.model("Client", clientSchema);
