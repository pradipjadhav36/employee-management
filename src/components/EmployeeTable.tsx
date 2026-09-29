import type { Employee } from "../types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <div className="table-scroll">
      <table className="employee-table table">
        <thead>
          <tr>
            <th scope="col">Employee</th>
            <th scope="col">Email</th>
            <th scope="col">Mobile</th>
            <th scope="col">Country</th>
            <th scope="col">State / District</th>
            <th scope="col">ID</th>
            <th aria-label="Actions" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const initials = employee.name.split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("");
            return (
              <tr key={employee.id}>
                <td className="employee-name">
                  <span aria-hidden="true" className="employee-avatar">
                    {initials}
                  </span>
                  {employee.name}
                </td>
                <td className="employee-email">{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>
                  <span className="country-cell">
                    <span aria-hidden="true" className="country-dot" />
                    {employee.country}
                  </span>
                </td>
                <td>{[employee.state, employee.district].filter(Boolean).join(", ") || "—"}</td>
                <td className="employee-id">#{employee.id}</td>
                <td className="row-actions">
                  <button aria-label={`Edit ${employee.name}`} className="row-action" onClick={() => onEdit(employee)} type="button">Edit</button>
                  <button aria-label={`Delete ${employee.name}`} className="row-action row-action-danger" onClick={() => onDelete(employee)} type="button">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;