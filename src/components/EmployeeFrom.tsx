import { useEffect, useState, type FormEvent } from "react";
import type { Country, Employee, EmployeeInput } from "../types/employee";
import { validateEmployee, type EmployeeFieldErrors } from "./employeeValidation";

interface EmployeeFormProps {
	onSubmit: (employee: EmployeeInput) => void | Promise<void>;
	onCancel: () => void;
	employee?: Employee;
	countries: Country[];
	countriesLoading: boolean;
	countriesError: string | null;
	submitting: boolean;
	error: string | null;
}

function EmployeeForm({
	onSubmit,
	onCancel,
	employee,
	countries,
	countriesLoading,
	countriesError,
	submitting,
	error,
}: EmployeeFormProps) {
	const [values, setValues] = useState<EmployeeInput>(() => ({
		name: employee?.name ?? "",
		email: employee?.email ?? "",
		mobile: employee?.mobile ?? "",
		country: employee?.country ?? "",
		state: employee?.state ?? "",
		district: employee?.district ?? "",
	}));
	const [errors, setErrors] = useState<EmployeeFieldErrors>({});

	useEffect(() => {
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") onCancel();
		};

		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [onCancel]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const nextErrors = validateEmployee(values);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length === 0) {
			void onSubmit(Object.fromEntries(
				Object.entries(values).map(([key, value]) => [key, value.trim()]),
			) as EmployeeInput);
		}
	};

	const updateField = (field: keyof EmployeeInput, value: string) => {
		setValues((current) => ({ ...current, [field]: value }));
		setErrors((current) => ({ ...current, [field]: undefined }));
	};

	const fieldError = (field: keyof EmployeeInput) => errors[field];

	return (
		<div
			className="modal-backdrop"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onCancel();
			}}
		>
			<section
				aria-labelledby="employee-form-title"
				aria-modal="true"
				className="employee-modal"
				role="dialog"
			>
				<div className="modal-heading">
					<div>
						<h2 id="employee-form-title">{employee ? "Edit employee" : "Add employee"}</h2>
						<p>{employee ? "Update this employee’s details." : "Enter the details to add a person to your directory."}</p>
					</div>
					<button
						aria-label="Close form"
						className="modal-close"
						onClick={onCancel}
						type="button"
					>
						×
					</button>
				</div>

				<form noValidate onSubmit={handleSubmit}>
					<div className="form-grid">
						<label className="form-field form-field-full">
							Name
							<input
								autoFocus
								autoComplete="name"
								aria-invalid={Boolean(fieldError("name"))}
								aria-describedby={fieldError("name") ? "name-error" : undefined}
								maxLength={80}
								onChange={(event) => updateField("name", event.target.value)}
								placeholder="e.g. Jordan Lee"
								value={values.name}
							/>
							{fieldError("name") && <span className="field-error" id="name-error">{fieldError("name")}</span>}
						</label>
						<label className="form-field form-field-full">
							Work email
							<input
								autoComplete="email"
								aria-invalid={Boolean(fieldError("email"))}
								aria-describedby={fieldError("email") ? "email-error" : undefined}
								maxLength={254}
								onChange={(event) => updateField("email", event.target.value)}
								placeholder="jordan@company.com"
								type="email"
								value={values.email}
							/>
							{fieldError("email") && <span className="field-error" id="email-error">{fieldError("email")}</span>}
						</label>
						<label className="form-field">
							Mobile
							<input
								autoComplete="tel"
								aria-invalid={Boolean(fieldError("mobile"))}
								aria-describedby={fieldError("mobile") ? "mobile-error" : undefined}
								maxLength={20}
								onChange={(event) => updateField("mobile", event.target.value)}
								placeholder="+1 555 0100"
								type="tel"
								value={values.mobile}
							/>
							{fieldError("mobile") && <span className="field-error" id="mobile-error">{fieldError("mobile")}</span>}
						</label>
						<label className="form-field">
							Country
							{countriesError ? (
								<input autoComplete="country-name" aria-invalid={Boolean(fieldError("country"))} maxLength={80} onChange={(event) => updateField("country", event.target.value)} placeholder="Enter country" value={values.country} />
							) : (
								<select aria-invalid={Boolean(fieldError("country"))} className="form-select" disabled={countriesLoading} onChange={(event) => updateField("country", event.target.value)} value={countries.find((item) => item.country.toLowerCase() === values.country.toLowerCase())?.country ?? values.country}>
									<option value="">{countriesLoading ? "Loading countries…" : "Select country"}</option>
									{values.country && !countries.some((item) => item.country.toLowerCase() === values.country.toLowerCase()) && <option value={values.country}>{values.country}</option>}
									{countries.map((item) => <option key={item.id} value={item.country}>{item.country}</option>)}
								</select>
							)}
							{countriesError && <span className="field-hint">Country list unavailable; enter it manually.</span>}
							{fieldError("country") && <span className="field-error" id="country-error">{fieldError("country")}</span>}
						</label>
						<label className="form-field">
							State
							<input aria-invalid={Boolean(fieldError("state"))} maxLength={80} onChange={(event) => updateField("state", event.target.value)} placeholder="State or region" value={values.state} />
							{fieldError("state") && <span className="field-error" id="state-error">{fieldError("state")}</span>}
						</label>
						<label className="form-field form-field-full">
							District
							<input aria-invalid={Boolean(fieldError("district"))} maxLength={80} onChange={(event) => updateField("district", event.target.value)} placeholder="District" value={values.district} />
							{fieldError("district") && <span className="field-error" id="district-error">{fieldError("district")}</span>}
						</label>
					</div>
					{error && <p className="form-error" role="alert">{error}</p>}
					<div className="form-actions">
						<button className="secondary-button btn btn-outline-secondary" disabled={submitting} onClick={onCancel} type="button">
							Cancel
						</button>
						<button className="primary-button btn btn-success" disabled={submitting || countriesLoading} type="submit">
							{submitting ? "Saving…" : employee ? "Save changes" : "Add to directory"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default EmployeeForm;
