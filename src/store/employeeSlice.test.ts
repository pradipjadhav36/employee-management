import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as employeeApi from "../services/employeeApi";
import type { Employee } from "../types/employee";
import employeeReducer, { addEmployee, editEmployee, fetchEmployees, removeEmployee } from "./employeeSlice";

vi.mock("../services/employeeApi", () => ({
  getEmployees: vi.fn(),
  getCountries: vi.fn(),
  getEmployeeById: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

const employee: Employee = {
  id: "1",
  name: "Jordan Lee",
  email: "jordan@example.com",
  mobile: "5550100",
  country: "India",
  state: "Maharashtra",
  district: "Pune",
};

const setupStore = () => configureStore({ reducer: { employees: employeeReducer } });

describe("employee Redux state", () => {
  beforeEach(() => vi.resetAllMocks());

  it("loads employee entities and clears loading state", async () => {
    vi.mocked(employeeApi.getEmployees).mockResolvedValue([employee]);
    const store = setupStore();
    await store.dispatch(fetchEmployees());
    expect(store.getState().employees.entities["1"]).toEqual(employee);
    expect(store.getState().employees.loading).toBe(false);
  });

  it("keeps API errors in state when loading fails", async () => {
    vi.mocked(employeeApi.getEmployees).mockRejectedValue(new Error("Service unavailable"));
    const store = setupStore();
    await store.dispatch(fetchEmployees());
    expect(store.getState().employees.error).toBe("Service unavailable");
    expect(store.getState().employees.loading).toBe(false);
  });

  it("updates entities after create, edit, and delete", async () => {
    vi.mocked(employeeApi.createEmployee).mockResolvedValue(employee);
    vi.mocked(employeeApi.updateEmployee).mockResolvedValue({ ...employee, name: "Jordan Chen" });
    vi.mocked(employeeApi.deleteEmployee).mockResolvedValue();
    const store = setupStore();

    await store.dispatch(addEmployee(employee));
    expect(store.getState().employees.entities["1"]?.name).toBe("Jordan Lee");
    await store.dispatch(editEmployee({ id: "1", employee: { ...employee, name: "Jordan Chen" } }));
    expect(store.getState().employees.entities["1"]?.name).toBe("Jordan Chen");
    await store.dispatch(removeEmployee("1"));
    expect(store.getState().employees.entities["1"]).toBeUndefined();
  });
});