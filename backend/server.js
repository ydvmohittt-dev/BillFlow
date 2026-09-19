import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";


const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "https://billflow-project.onrender.com",
    credentials: true,
  })
);

app.options("*", cors({
  origin: "https://billflow-project.onrender.com",
  credentials: true,
}));



app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.json({ message: "BillFlow Backend is running" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);


mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Database Connected Successfully"))
  .then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch((error) => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
