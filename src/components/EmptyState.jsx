import { useI18n } from '../i18n.jsx';

export default function EmptyState({ type='empty', onAdd, searchQuery }) {
  const { t } = useI18n();

  const emptyIcon = (
    <div style={{ width:72, height:72, borderRadius:20, background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4 }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {type==='search' && <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>}
        {type==='filtered' && <><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></>}
        {type==='pinned' && <><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></>}
        {type==='archived' && <><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></>}
        {type==='empty' && <><path d="M5 4h14v16l-7-4-7 4z"/></>}
      </svg>
    </div>
  );

  const titles = {
    search: `"${searchQuery}" ${t('noResults')}`,
    filtered: t('noLinksTag'),
    pinned: t('noPinned'),
    archived: t('emptyArchive'),
    empty: t('firstLink'),
  };
  const descs = {
    search: t('tryDifferent'),
    filtered: t('addLinkForTag'),
    pinned: t('pinDesc'),
    archived: t('archiveDesc'),
    empty: t('firstLinkDesc'),
  };

  return (
    <div className="empty-state">
      {emptyIcon}
      <div>
        <p style={{ fontSize:16, fontWeight:600, color:'var(--text)', marginBottom:4 }}>{titles[type]}</p>
        <p style={{ fontSize:14, color:'var(--text-secondary)', maxWidth:320, margin:'0 auto', lineHeight:1.6 }}>{descs[type]}</p>
      </div>
      {(type==='empty'||type==='filtered') && onAdd && (
        <button className="btn btn-primary" onClick={onAdd} style={{marginTop:4}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          {t('newLink')}
        </button>
      )}
      {type==='empty' && <p style={{fontSize:12,color:'var(--text-muted)'}}>{t('shortcutHint')} <span className="kbd">N</span></p>}
    </div>
  );
}
