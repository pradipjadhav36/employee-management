interface ConfirmDialogProps {
	title: string;
	message: string;
	confirmLabel: string;
	error: string | null;
	pending: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

function ConfirmDialog({ title, message, confirmLabel, error, pending, onConfirm, onCancel }: ConfirmDialogProps) {
	return (
		<div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !pending) onCancel(); }}>
			<section aria-labelledby="confirm-title" aria-modal="true" className="employee-modal confirm-modal" role="alertdialog">
				<div className="modal-heading">
					<div>
						<h2 id="confirm-title">{title}</h2>
						<p>{message}</p>
					</div>
				</div>
				{error && <p className="form-error" role="alert">{error}</p>}
				<div className="form-actions">
					<button className="secondary-button btn btn-outline-secondary" disabled={pending} onClick={onCancel} type="button">Cancel</button>
					<button className="danger-button btn btn-danger" disabled={pending} onClick={onConfirm} type="button">{pending ? "Deleting…" : confirmLabel}</button>
				</div>
			</section>
		</div>
	);
}

export default ConfirmDialog;
