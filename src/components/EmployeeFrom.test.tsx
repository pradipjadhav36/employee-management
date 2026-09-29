import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EmployeeForm from "./EmployeeFrom";
import type { Employee } from "../types/employee";

const employee: Employee = {
  id: "12",
  name: "Jordan Lee",
  email: "jordan@example.com",
  mobile: "5550100",
  country: "India",
  state: "Maharashtra",
  district: "Pune",
};

const renderForm = (onSubmit = vi.fn()) => render(
  <EmployeeForm
    countries={[{ id: "1", country: "India" }]}
    countriesError={null}
    countriesLoading={false}
    error={null}
    onCancel={vi.fn()}
    onSubmit={onSubmit}
    submitting={false}
  />,
);

describe("EmployeeForm", () => {
  it("shows validation errors and does not submit an empty form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm(onSubmit);

    await user.click(screen.getByRole("button", { name: "Add to directory" }));

    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("prepopulates edit fields and submits the updated details", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EmployeeForm
        countries={[{ id: "1", country: "India" }]}
        countriesError={null}
        countriesLoading={false}
        employee={employee}
        error={null}
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        submitting={false}
      />,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Jordan Lee");
    expect(screen.getByLabelText("Country")).toHaveValue("India");
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Jordan Chen");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSubmit).toHaveBeenCalledWith({ ...employee, id: undefined, name: "Jordan Chen" });
  });
});