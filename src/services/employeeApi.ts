import axios from "axios";
import type { Country, Employee, EmployeeInput } from "../types/employee";

const API_BASE = "https://669b3f09276e45187d34eb4e.mockapi.io/api/v1";
const EMPLOYEE_URL = `${API_BASE}/employee`;
const COUNTRY_URL = `${API_BASE}/country`;

interface ApiEnvelope<T> {
  value?: T;
  Count?: number;
}

type ApiEmployee = Partial<Employee> & {
  id?: string | number;
  emailId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: { country?: string };
};

const unwrap = <T,>(data: T | ApiEnvelope<T>): T => {
  if (data && typeof data === "object" && "value" in data) {
    return (data as ApiEnvelope<T>).value as T;
  }
  return data as T;
};

const normalizeEmployee = (employee: ApiEmployee): Employee => ({
  id: String(employee.id ?? ""),
  name: employee.name ?? [employee.firstName, employee.lastName].filter(Boolean).join(" "),
  email: employee.email ?? employee.emailId ?? "",
  mobile: employee.mobile ?? employee.phone ?? "",
  country: employee.country ?? employee.address?.country ?? "",
  state: employee.state ?? "",
  district: employee.district ?? "",
});

const toApiEmployee = (employee: EmployeeInput) => ({
  name: employee.name,
  email: employee.email,
  emailId: employee.email,
  mobile: employee.mobile,
  country: employee.country,
  state: employee.state,
  district: employee.district,
});

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await axios.get<ApiEnvelope<ApiEmployee[]> | ApiEmployee[]>(EMPLOYEE_URL);
  return unwrap(data).map(normalizeEmployee);
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const { data } = await axios.get<ApiEmployee>(`${EMPLOYEE_URL}/${encodeURIComponent(id)}`);
    return normalizeEmployee(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
};

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await axios.get<ApiEnvelope<Country[]> | Country[]>(COUNTRY_URL);
  return unwrap(data).map((country) => ({
    id: String(country.id),
    country: country.country,
    flag: country.flag,
  }));
};

export const createEmployee = async (employee: EmployeeInput): Promise<Employee> => {
  const { data } = await axios.post<ApiEmployee>(EMPLOYEE_URL, toApiEmployee(employee));
  return normalizeEmployee(data);
};

export const updateEmployee = async (
  id: string,
  employee: EmployeeInput,
): Promise<Employee> => {
  const { data } = await axios.put<ApiEmployee>(
    `${EMPLOYEE_URL}/${encodeURIComponent(id)}`,
    toApiEmployee(employee),
  );
  return normalizeEmployee({ ...data, id: data.id ?? id, ...employee });
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axios.delete(`${EMPLOYEE_URL}/${encodeURIComponent(id)}`);
};

