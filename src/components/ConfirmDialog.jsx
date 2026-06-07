export default function ConfirmDialog({ title, message, confirmLabel = 'Sil', onConfirm, onCancel, danger = true }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal"
        style={{ maxWidth: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px' }}>
          <h3 className="font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>
            {title}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {message}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={onCancel}>
              Vazgeç
            </button>
            <button
              className="btn"
              style={{
                background: danger ? 'var(--danger)' : 'var(--accent)',
                color: '#fff',
              }}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
