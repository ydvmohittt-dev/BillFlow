import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";

function calculate(items, taxPercent) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );
  const taxAmount = (subtotal * Number(taxPercent || 0)) / 100;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number((subtotal + taxAmount).toFixed(2)),
  };
}

function normalizedStatus(status, dueDate) {
  if (status === "paid" || status === "draft") return status;
  if (status === "overdue" || status === "sent") {
    return new Date(dueDate) < new Date() ? "overdue" : "sent";
  }
  return status || "draft";
}

export async function list(req, res) {
  const query = { user: req.user._id };
  if (req.query.status) query.status = req.query.status;
  if (req.query.clientId) query.client = req.query.clientId;
  if (req.query.from || req.query.to) query.createdAt = {};
  if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
  if (req.query.to) {
    const end = new Date(req.query.to);
    end.setHours(23, 59, 59, 999);
    query.createdAt.$lte = end;
  }
  const invoices = await Invoice.find(query)
    .populate("client", "name email")
    .sort({ createdAt: -1 });
  const updates = invoices.map(async (invoice) => {
    if (invoice.status === "sent" && new Date(invoice.dueDate) < new Date()) {
      invoice.status = "overdue";
      await invoice.save();
    }
    return invoice;
  });
  res.json(await Promise.all(updates));
}

export async function getOne(req, res) {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    user: req.user._id,
  })
    .populate("client")
    .populate("user", "name email");
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  if (invoice.status === "sent" && new Date(invoice.dueDate) < new Date()) {
    invoice.status = "overdue";
    await invoice.save();
  }
  res.json(invoice);
}

export async function create(req, res) {
  const { invoiceNumber, clientId, items, taxPercent, dueDate, status } =
    req.body;
  if (
    !invoiceNumber ||
    !clientId ||
    !Array.isArray(items) ||
    !items.length ||
    !dueDate
  )
    return res.status(400).json({
      message: "Invoice number, client, items and due date are required",
    });
  if (
    items.some(
      (i) =>
        !String(i.description || "").trim() ||
        Number(i.quantity) <= 0 ||
        Number(i.unitPrice) < 0,
    )
  )
    return res.status(400).json({
      message:
        "Every line item must have a description, positive quantity and valid unit price",
    });
  const client = await Client.findOne({ _id: clientId, user: req.user._id });
  if (!client)
    return res.status(400).json({ message: "Selected client is invalid" });
  const totals = calculate(items, taxPercent);
  const invoice = await Invoice.create({
    user: req.user._id,
    client: clientId,
    invoiceNumber,
    items,
    taxPercent: Number(taxPercent || 0),
    dueDate,
    status: normalizedStatus(status, dueDate),
    ...totals,
  });
  res.status(201).json(await invoice.populate("client"));
}

export async function updateStatus(req, res) {
  const allowed = ["draft", "sent", "paid", "overdue"];
  if (!allowed.includes(req.body.status))
    return res.status(400).json({ message: "Invalid status" });
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status: req.body.status },
    { new: true },
  )
    .populate("client")
    .populate("user", "name email");
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
}
