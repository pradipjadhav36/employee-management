import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as employeeApi from "../services/employeeApi";
import type { Country, Employee, EmployeeInput } from "../types/employee";

const employeeAdapter = createEntityAdapter<Employee, string>({
  selectId: (employee) => employee.id,
  sortComparer: (left, right) => left.name.localeCompare(right.name),
});

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? "The request failed.";
  }
  return error instanceof Error ? error.message : "Something went wrong.";
};

export const fetchEmployees = createAsyncThunk<Employee[], void, { rejectValue: string }>(
  "employees/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await employeeApi.getEmployees();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchCountries = createAsyncThunk<Country[], void, { rejectValue: string }>(
  "employees/fetchCountries",
  async (_, { rejectWithValue }) => {
    try {
      return await employeeApi.getCountries();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const searchEmployeeById = createAsyncThunk<
  Employee | null,
  string,
  { rejectValue: string }
>("employees/searchById", async (id, { rejectWithValue }) => {
  try {
    return await employeeApi.getEmployeeById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addEmployee = createAsyncThunk<Employee, EmployeeInput, { rejectValue: string }>(
  "employees/add",
  async (employee, { rejectWithValue }) => {
    try {
      return await employeeApi.createEmployee(employee);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const editEmployee = createAsyncThunk<
  Employee,
  { id: string; employee: EmployeeInput },
  { rejectValue: string }
>("employees/edit", async ({ id, employee }, { rejectWithValue }) => {
  try {
    return await employeeApi.updateEmployee(id, employee);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeEmployee = createAsyncThunk<string, string, { rejectValue: string }>(
  "employees/remove",
  async (id, { rejectWithValue }) => {
    try {
      await employeeApi.deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = employeeAdapter.getInitialState({
  loading: false,
  countriesLoading: false,
  mutationLoading: false,
  searchLoading: false,
  error: null as string | null,
  countriesError: null as string | null,
  mutationError: null as string | null,
  searchError: null as string | null,
  countries: [] as Country[],
  searchResult: null as Employee | null,
  searchCompleted: false,
});

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployeeSearch(state) {
      state.searchResult = null;
      state.searchError = null;
      state.searchCompleted = false;
    },
    clearMutationError(state) {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        employeeAdapter.setAll(state, action.payload);
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Could not load employees.";
      })
      .addCase(fetchCountries.pending, (state) => {
        state.countriesLoading = true;
        state.countriesError = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countriesLoading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.countriesLoading = false;
        state.countriesError = action.payload ?? action.error.message ?? "Could not load countries.";
      })
      .addCase(searchEmployeeById.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        state.searchCompleted = false;
      })
      .addCase(searchEmployeeById.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResult = action.payload;
        state.searchCompleted = true;
      })
      .addCase(searchEmployeeById.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload ?? action.error.message ?? "Could not search employees.";
        state.searchCompleted = true;
      })
      .addCase(addEmployee.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.mutationLoading = false;
        employeeAdapter.addOne(state, action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload ?? action.error.message ?? "Could not add employee.";
      })
      .addCase(editEmployee.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.mutationLoading = false;
        employeeAdapter.upsertOne(state, action.payload);
        if (state.searchResult?.id === action.payload.id) state.searchResult = action.payload;
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload ?? action.error.message ?? "Could not update employee.";
      })
      .addCase(removeEmployee.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.mutationLoading = false;
        employeeAdapter.removeOne(state, action.payload);
        if (state.searchResult?.id === action.payload) {
          state.searchResult = null;
          state.searchCompleted = true;
        }
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload ?? action.error.message ?? "Could not delete employee.";
      });
  },
});

export const { clearEmployeeSearch, clearMutationError } = employeeSlice.actions;
export const employeeSelectors = employeeAdapter.getSelectors<{
  employees: typeof initialState;
}>((state) => state.employees);
export default employeeSlice.reducer;