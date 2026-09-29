import { useEffect, useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeFrom";
import SearchEmployee from "../components/SearchEmployee";
import ConfirmDialog from "../components/ConfirmDialog";
import type { Employee, EmployeeInput } from "../types/employee";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addEmployee,
  clearEmployeeSearch,
  clearMutationError,
  editEmployee,
  employeeSelectors,
  fetchCountries,
  fetchEmployees,
  removeEmployee,
  searchEmployeeById,
} from "../store/employeeSlice";
import "./EmployeeManagement.css";

function EmployeeManagement() {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(employeeSelectors.selectAll);
  const countries = useAppSelector((state) => state.employees.countries);
  const loading = useAppSelector((state) => state.employees.loading);
  const countriesLoading = useAppSelector((state) => state.employees.countriesLoading);
  const countriesError = useAppSelector((state) => state.employees.countriesError);
  const mutationLoading = useAppSelector((state) => state.employees.mutationLoading);
  const mutationError = useAppSelector((state) => state.employees.mutationError);
  const error = useAppSelector((state) => state.employees.error);
  const searchResult = useAppSelector((state) => state.employees.searchResult);
  const searchCompleted = useAppSelector((state) => state.employees.searchCompleted);
  const searchLoading = useAppSelector((state) => state.employees.searchLoading);
  const searchError = useAppSelector((state) => state.employees.searchError);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const visibleEmployees = searchCompleted ? (searchResult ? [searchResult] : []) : employees;

  useEffect(() => {
    void dispatch(fetchEmployees());
    void dispatch(fetchCountries());
  }, [dispatch]);

  const openAddForm = () => {
    dispatch(clearMutationError());
    setEditingEmployee(null);
    setShowForm(true);
  };

  const openEditForm = (employee: Employee) => {
    dispatch(clearMutationError());
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) void dispatch(searchEmployeeById(searchTerm.trim()));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    dispatch(clearEmployeeSearch());
  };

  const handleSave = async (values: EmployeeInput) => {
    try {
      if (editingEmployee) {
        await dispatch(editEmployee({ id: editingEmployee.id, employee: values })).unwrap();
      } else {
        await dispatch(addEmployee(values)).unwrap();
        setSearchTerm("");
        dispatch(clearEmployeeSearch());
      }
      setShowForm(false);
      setEditingEmployee(null);
    } catch {
      return;
    }
  };

  const handleDelete = async () => {
    if (!deletingEmployee) return;
    try {
      await dispatch(removeEmployee(deletingEmployee.id)).unwrap();
      setDeletingEmployee(null);
      if (searchResult?.id === deletingEmployee.id) dispatch(clearEmployeeSearch());
    } catch {
      return;
    }
  };

  const openDeleteConfirmation = (employee: Employee) => {
    dispatch(clearMutationError());
    setDeletingEmployee(employee);
  };

  return (
    <div className="workspace">
      <aside aria-label="Main navigation" className="sidebar">
        <div className="brand">
          <span aria-hidden="true" className="brand-mark">e</span>
          <span className="brand-name">evergreen</span>
        </div>
        <p className="side-label">Workspace</p>
        <div aria-current="page" className="nav-item">
          <span aria-hidden="true" className="nav-icon">E</span>
          <span className="nav-text">Employees</span>
        </div>
        <div className="sidebar-bottom">
          <span aria-hidden="true" className="user-avatar">AD</span>
          <div className="user-copy">
            <strong>Admin</strong>
            <span>Workspace owner</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span aria-hidden="true">/</span>
            <span className="breadcrumb-current">Employees</span>
          </div>
          <div className="topbar-note">
            <span aria-hidden="true" className="online-dot" />
            Team directory
          </div>
        </div>

        <section className="page-heading">
          <div>
            <p className="eyebrow">People operations</p>
            <h1>Employee directory</h1>
            <p>Manage your team and keep employee records up to date.</p>
          </div>
            <button
              className="primary-button btn btn-success"
              onClick={openAddForm}
            type="button"
          >
            <span aria-hidden="true" className="button-plus">+</span>
            Add employee
          </button>
        </section>

        <section aria-label="Employee summary" className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Total employees</span>
            <strong className="stat-value">{loading ? "—" : employees.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Matching search</span>
            <strong className="stat-value">{loading ? "—" : (searchCompleted ? visibleEmployees.length : employees.length)}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Countries available</span>
            <strong className="stat-value">{countriesLoading ? "—" : countries.length}</strong>
          </div>
        </section>

        <section aria-labelledby="directory-title" className="directory-panel">
          <div className="directory-header">
            <div className="directory-title">
              <h2 id="directory-title">All employees</h2>
              <p>Search for a specific employee using their ID.</p>
            </div>
            <SearchEmployee loading={searchLoading} onChange={handleSearchChange} onSubmit={handleSearch} value={searchTerm} />
          </div>

          {loading ? (
            <div className="loading-state" role="status">Loading employee directory...</div>
          ) : error ? (
            <div className="error-state" role="alert">
              <p>{error}</p>
              <button className="secondary-button btn btn-outline-secondary" onClick={() => void dispatch(fetchEmployees())} type="button">Try again</button>
            </div>
          ) : searchError ? (
            <div className="error-state" role="alert">Search failed: {searchError}</div>
          ) : searchCompleted && !searchResult ? (
            <div className="empty-state" role="status">No employee found with ID “{searchTerm}”. Check the ID and try again.</div>
          ) : visibleEmployees.length ? (
            <EmployeeTable employees={visibleEmployees} onDelete={openDeleteConfirmation} onEdit={openEditForm} />
          ) : (
            <div className="empty-state" role="status">No employees yet. Add an employee to start your directory.</div>
          )}

          <div className="table-footer">
            <span>{loading ? "Loading records" : `Showing ${visibleEmployees.length} of ${employees.length} employees`}</span>
            <span>Directory</span>
          </div>
        </section>
      </main>

      {showForm && (
        <EmployeeForm
          countries={countries}
          countriesError={countriesError}
          countriesLoading={countriesLoading}
          employee={editingEmployee ?? undefined}
          error={mutationError}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSave}
          submitting={mutationLoading}
        />
      )}
      {deletingEmployee && (
        <ConfirmDialog
          confirmLabel="Delete employee"
          error={mutationError}
          message={`This will permanently remove ${deletingEmployee.name} from the employee directory.`}
          onCancel={() => setDeletingEmployee(null)}
          onConfirm={() => void handleDelete()}
          pending={mutationLoading}
          title="Delete employee?"
        />
      )}
    </div>
  );
}



export default EmployeeManagement;