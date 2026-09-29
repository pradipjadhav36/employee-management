import type { EmployeeInput } from "../types/employee";

export type EmployeeFieldErrors = Partial<Record<keyof EmployeeInput, string>>;

export const validateEmployee = (employee: EmployeeInput): EmployeeFieldErrors => {
  const errors: EmployeeFieldErrors = {};
  const fields: Array<[keyof EmployeeInput, string, number]> = [
    ["name", "Name", 80],
    ["mobile", "Mobile", 20],
    ["country", "Country", 80],
    ["state", "State", 80],
    ["district", "District", 80],
  ];

  for (const [field, label, maxLength] of fields) {
    const value = employee[field].trim();
    if (!value) errors[field] = `${label} is required.`;
    else if (field === "name" && value.length < 2) {
      errors[field] = "Name must be at least 2 characters long.";
    }
    else if (value.length > maxLength) {
      errors[field] = `${label} must be ${maxLength} characters or fewer.`;
    }
  }

  const email = employee.email.trim();
  if (!email) errors.email = "Email is required.";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const mobileDigits = employee.mobile.replace(/\D/g, "").length;
  if (employee.mobile.trim() && mobileDigits < 7) {
    errors.mobile = "Mobile number must contain at least 7 digits.";
  }

  return errors;
};