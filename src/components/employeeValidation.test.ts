import { describe, expect, it } from "vitest";
import { validateEmployee } from "./employeeValidation";
import type { EmployeeInput } from "../types/employee";

const validEmployee: EmployeeInput = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  mobile: "+1 555 0100",
  country: "United States",
  state: "California",
  district: "San Francisco",
};

describe("validateEmployee", () => {
  it("accepts valid employee details", () => {
    expect(validateEmployee(validEmployee)).toEqual({});
  });

  it("requires every field and validates email and mobile", () => {
    const errors = validateEmployee({
      ...validEmployee,
      name: " ",
      email: "not-an-email",
      mobile: "123",
      country: "",
      state: "",
      district: "",
    });

    expect(errors).toMatchObject({
      name: "Name is required.",
      email: "Enter a valid email address.",
      mobile: "Mobile number must contain at least 7 digits.",
      country: "Country is required.",
      state: "State is required.",
      district: "District is required.",
    });
  });

  it("enforces field length limits", () => {
    const errors = validateEmployee({ ...validEmployee, name: "a".repeat(81) });
    expect(errors.name).toBe("Name must be 80 characters or fewer.");
    expect(validateEmployee({ ...validEmployee, name: "J" }).name).toBe("Name must be at least 2 characters long.");
  });
});