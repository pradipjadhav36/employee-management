interface SearchEmployeeProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	loading: boolean;
}

function SearchEmployee({ value, onChange, onSubmit, loading }: SearchEmployeeProps) {
	return (
		<form className="search-control" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
			<input
				aria-label="Search employee by ID"
				className="form-control"
				type="search"
				placeholder="Employee ID"
				value={value}
				onChange={(event) => onChange(event.target.value)}
			/>
			{value && (
				<button
					aria-label="Clear search"
					className="clear-search"
					onClick={() => onChange("")}
					type="button"
				>
					×
				</button>
			)}
			<button className="search-submit btn btn-outline-success" disabled={!value.trim() || loading} type="submit">{loading ? "Searching…" : "Search ID"}</button>
		</form>
	);
}

export default SearchEmployee;
