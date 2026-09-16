import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";
import { isEmail, requireFields } from "../utils/validation.js";

export async function list(req, res) {
  res.json(await Client.find({ user: req.user._id }).sort({ createdAt: -1 }));
}
export async function create(req, res) {
  const missing = requireFields(req.body, [
    "name",
    "email",
    "phone",
    "billingAddress",
  ]);
  if (missing.length)
    return res.status(400).json({ message: `Missing: ${missing.join(", ")}` });
  if (!isEmail(req.body.email))
    return res.status(400).json({ message: "Enter a valid email address" });
  res
    .status(201)
    .json(await Client.create({ ...req.body, user: req.user._id }));
}
export async function update(req, res) {
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json(client);
}
export async function remove(req, res) {
  const client = await Client.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!client) return res.status(404).json({ message: "Client not found" });
  await Invoice.deleteMany({ client: client._id, user: req.user._id });
  res.status(204).send();
}
