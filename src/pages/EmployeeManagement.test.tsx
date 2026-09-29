import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as employeeApi from "../services/employeeApi";
import employeeReducer from "../store/employeeSlice";
import EmployeeManagement from "./EmployeeManagement";
import type { Employee } from "../types/employee";

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

const renderPage = () => {
  const store = configureStore({ reducer: { employees: employeeReducer } });
  return render(<Provider store={store}><EmployeeManagement /></Provider>);
};

describe("EmployeeManagement interactions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(employeeApi.getEmployees).mockResolvedValue([employee]);
    vi.mocked(employeeApi.getCountries).mockResolvedValue([{ id: "1", country: "India" }]);
  });

  it("searches by ID and shows a clear not-found message", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.getEmployeeById).mockResolvedValue(null);
    renderPage();

    await screen.findByText("Jordan Lee");
    await user.type(screen.getByRole("searchbox", { name: "Search employee by ID" }), "404");
    await user.click(screen.getByRole("button", { name: "Search ID" }));

    expect(await screen.findByText(/No employee found with ID “404”/)).toBeInTheDocument();
    expect(employeeApi.getEmployeeById).toHaveBeenCalledWith("404");
  });

  it("creates an employee and updates the directory", async () => {
    const user = userEvent.setup();
    const created = { ...employee, id: "2", name: "Sam Rivera", email: "sam@example.com" };
    vi.mocked(employeeApi.createEmployee).mockResolvedValue(created);
    renderPage();

    await screen.findByText("Jordan Lee");
    await user.click(screen.getByRole("button", { name: "Add employee" }));
    await user.type(screen.getByLabelText("Name"), "Sam Rivera");
    await user.type(screen.getByLabelText("Work email"), "sam@example.com");
    await user.type(screen.getByLabelText("Mobile"), "5551234567");
    await user.selectOptions(screen.getByLabelText("Country"), "India");
    await user.type(screen.getByLabelText("State"), "Gujarat");
    await user.type(screen.getByLabelText("District"), "Surat");
    await user.click(screen.getByRole("button", { name: "Add to directory" }));

    expect(await screen.findByText("Sam Rivera")).toBeInTheDocument();
    expect(employeeApi.createEmployee).toHaveBeenCalledWith({
      name: "Sam Rivera",
      email: "sam@example.com",
      mobile: "5551234567",
      country: "India",
      state: "Gujarat",
      district: "Surat",
    });
  });

  it("edits a prefilled employee and updates the displayed row", async () => {
    const user = userEvent.setup();
    const updated = { ...employee, name: "Jordan Chen" };
    vi.mocked(employeeApi.updateEmployee).mockResolvedValue(updated);
    renderPage();

    await screen.findByText("Jordan Lee");
    await user.click(screen.getByRole("button", { name: "Edit Jordan Lee" }));
    expect(screen.getByLabelText("Work email")).toHaveValue(employee.email);
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Jordan Chen");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Jordan Chen")).toBeInTheDocument();
    expect(employeeApi.updateEmployee).toHaveBeenCalledWith("1", expect.objectContaining({ name: "Jordan Chen" }));
  });

  it("requires confirmation before deleting an employee", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.deleteEmployee).mockResolvedValue();
    renderPage();

    await screen.findByText("Jordan Lee");
    await user.click(screen.getByRole("button", { name: "Delete Jordan Lee" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(employeeApi.deleteEmployee).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete employee" }));
    expect(await screen.findByText("No employees yet. Add an employee to start your directory.")).toBeInTheDocument();
    expect(employeeApi.deleteEmployee).toHaveBeenCalledWith("1");
  });
});