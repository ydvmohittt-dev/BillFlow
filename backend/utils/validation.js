export function requireFields(body, fields) {
  return fields.filter((field) => !String(body[field] ?? "").trim());
}

export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}
