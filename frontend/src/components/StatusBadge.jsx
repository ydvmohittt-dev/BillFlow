import { CheckCircle2, Clock3, AlertCircle, Send } from "./Icons";
const meta = {
  paid: ["Paid", CheckCircle2],
  draft: ["Draft", Clock3],
  sent: ["Sent", Send],
  overdue: ["Overdue", AlertCircle],
};
export default function StatusBadge({ status }) {
  const [label, Icon] = meta[status] || meta.draft;
  return (
    <span className={`status ${status}`}>
      <Icon size={14} />
      {label}
    </span>
  );
}
