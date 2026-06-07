import { useState } from 'react';
import { useI18n } from '../i18n.jsx';

export default function Sidebar({ tags, bookmarks, selectedTagIds, activeView, onTagToggle, onViewChange, onOpenTagManager, onAdd }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(true);

  const allCount = bookmarks.filter(b => !b.isArchived).length;
  const pinnedCount = bookmarks.filter(b => b.isPinned && !b.isArchived).length;
  const archivedCount = bookmarks.filter(b => b.isArchived).length;
  const tagCount = (id) => bookmarks.filter(b => !b.isArchived && b.tagIds?.includes(id)).length;

  return (
    <>
      {/* Logo */}
      <div style={{ padding:'22px 18px 18px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid var(--border)' }}>
        <div style={{ width:32, height:32, borderRadius:10, background:'var(--gradient)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round">
            <path d="M5 4h14v16l-7-4-7 4z"/>
          </svg>
        </div>
        <span style={{ fontSize:17, fontWeight:700, letterSpacing:'-0.02em', background:'var(--gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          LinkPad
        </span>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'12px 10px' }}>
        <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginBottom:14 }} onClick={onAdd}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          {t('newLink')}
        </button>

        {[
          { key:'all', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>, label: t('allLinks'), count: allCount },
          { key:'pinned', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></svg>, label: t('pinned'), count: pinnedCount },
          { key:'archived', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>, label: t('archived'), count: archivedCount },
        ].map(v => (
          <div key={v.key} className={`nav-item ${activeView === v.key ? 'active' : ''}`} onClick={() => onViewChange(v.key)}>
            {v.icon} {v.label} <span className="count">{v.count}</span>
          </div>
        ))}

        <div className="divider" style={{ margin:'10px 0' }} />

        <button onClick={() => setExpanded(!expanded)} style={{
          display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',
          padding:'6px 14px', background:'transparent', border:'none', cursor:'pointer',
          color:'var(--text-muted)', fontSize:11, fontWeight:700, letterSpacing:'0.08em',
          textTransform:'uppercase', fontFamily:'inherit',
        }}>
          {t('tags')}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: expanded ? 'rotate(0)' : 'rotate(-90deg)', transition:'transform 0.2s ease' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {expanded && (
          <div style={{ marginTop:4 }}>
            {tags.length === 0 && <p style={{ padding:'6px 14px', fontSize:13, color:'var(--text-muted)' }}>{t('noTags')}</p>}
            {tags.map(tag => {
              const isSel = selectedTagIds.includes(tag.id);
              return (
                <div key={tag.id} className={`nav-item ${isSel ? 'active' : ''}`} onClick={() => onTagToggle(tag.id)}
                  style={isSel ? { background: tag.color+'15', color: tag.color } : {}}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:tag.color, flexShrink:0, boxShadow: isSel ? `0 0 8px ${tag.color}` : 'none' }} />
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tag.name}</span>
                  <span className="count">{tagCount(tag.id)}</span>
                </div>
              );
            })}
            <button className="nav-item" style={{ width:'100%', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', marginTop:4 }}
              onClick={onOpenTagManager}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              {t('manageTags')}
            </button>
          </div>
        )}
      </div>

      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)', fontSize:11, color:'var(--text-muted)', textAlign:'center' }}>
        {allCount} {t('linkCount')} · {tags.length} {t('tagCount')}
      </div>
    </>
  );
}
