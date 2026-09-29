import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEmployee, deleteEmployee, getCountries, getEmployees, updateEmployee } from "./employeeApi";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const employeeInput = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  mobile: "5550100",
  country: "United States",
  state: "California",
  district: "San Francisco",
};

describe("employee API adapter", () => {
  beforeEach(() => vi.resetAllMocks());

  it("maps the provided employee API response to the app model", async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { value: [{ id: "7", name: "Jordan Lee", emailId: "jordan@example.com", mobile: "5550100", country: "US", state: "CA", district: "SF" }] },
    });

    await expect(getEmployees()).resolves.toEqual([{
      id: "7",
      name: "Jordan Lee",
      email: "jordan@example.com",
      mobile: "5550100",
      country: "US",
      state: "CA",
      district: "SF",
    }]);
  });

  it("loads countries from the wrapped API response", async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: { value: [{ id: "1", country: "India", flag: "flag.png" }] } });
    await expect(getCountries()).resolves.toEqual([{ id: "1", country: "India", flag: "flag.png" }]);
  });

  it("posts, then maps the created employee response", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { id: "8", ...employeeInput } });
    await expect(createEmployee(employeeInput)).resolves.toMatchObject({ id: "8", ...employeeInput });
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/employee"), expect.objectContaining({ emailId: employeeInput.email }));
  });

  it("preserves the requested ID when an update response omits it", async () => {
    vi.mocked(axios.put).mockResolvedValueOnce({ data: { ...employeeInput } });
    await expect(updateEmployee("9", employeeInput)).resolves.toEqual({ id: "9", ...employeeInput });
  });

  it("deletes an employee by its encoded ID", async () => {
    vi.mocked(axios.delete).mockResolvedValueOnce({ data: {} });
    await expect(deleteEmployee("employee 10")).resolves.toBeUndefined();
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining("/employee/employee%2010"));
  });
});