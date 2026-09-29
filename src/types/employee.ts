export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
}

export type EmployeeInput = Omit<Employee, "id">;

export interface Country {
  id: string;
  country: string;
  flag?: string;
}