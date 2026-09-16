export const interests = [
  "Business transformation",
  "ITSM / AI / digital transformation",
  "Professional training",
  "Sports & athlete development",
  "School & community programmes",
] as const;
export type Interest = (typeof interests)[number];
export type FormValues = {
  name: string;
  email: string;
  interest: string;
  message: string;
  website: string;
};
export type Field = "name" | "email" | "interest" | "message";
export const fields: Field[] = ["name", "email", "interest", "message"];
export const emptyValues: FormValues = {
  name: "",
  email: "",
  interest: "",
  message: "",
  website: "",
};
export function validate(field: Field, value: string): string {
  const v = value.trim();
  if (field === "name")
    return v.length < 2 || v.length > 80
      ? "Please enter 2–80 characters for your name."
      : "";
  if (field === "email")
    return v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? "Enter a valid email address (up to 254 characters)."
      : "";
  if (field === "interest")
    return interests.includes(v as Interest) ? "" : "Please choose an area.";
  return v.length < 10 || v.length > 1500
    ? "Please describe your goals in 10–1500 characters."
    : "";
}
