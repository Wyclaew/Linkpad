import { useI18n } from '../i18n.jsx';

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, danger=true }) {
  const { t } = useI18n();
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" style={{maxWidth:400}} onClick={e => e.stopPropagation()}>
        <div style={{padding:24}}>
          <h3 style={{ fontSize:16, fontWeight:600, color:'var(--text)', marginBottom:8 }}>{title}</h3>
          <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 }}>{message}</p>
          <div style={{ display:'flex', gap:8, marginTop:22, justifyContent:'flex-end' }}>
            <button className="btn btn-ghost" onClick={onCancel}>{t('cancel')}</button>
            <button className="btn" style={{ background: danger?'var(--danger)':'var(--accent)', color:'#fff' }} onClick={onConfirm}>
              {confirmLabel || t('yesDelete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
