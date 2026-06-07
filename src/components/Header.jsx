import { useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { exportData } from '../utils/export.js';

export default function Header({ searchQuery, onSearch, viewMode, onViewModeChange, sortBy, onSortChange, onAdd, onImport, onToggleSidebar, filteredCount, theme, onThemeToggle }) {
  const { t, toggleLang } = useI18n();
  const [showSort, setShowSort] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const fileRef = useRef(null);
  const sortRef = useRef(null);
  const moreRef = useRef(null);

  const sortLabels = { newest: t('newest'), oldest: t('oldest'), alpha: t('alphaSort') };

  function calcPos(ref, width=160) {
    if(!ref.current) return {};
    const r = ref.current.getBoundingClientRect();
    let top = r.bottom + 6, left = r.right - width;
    if (top + 200 > window.innerHeight) top = r.top - 200;
    if (left < 8) left = 8;
    return { top, left };
  }

  return (
    <header style={{ padding:'12px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10, background:'var(--bg)', flexShrink:0, position:'relative', zIndex:10 }}>
      <button className="btn-icon" onClick={onToggleSidebar} title="Toggle sidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18"/></svg>
      </button>

      <div className="search-bar" style={{ flex:1, maxWidth:480 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={e => onSearch(e.target.value)} />
        {searchQuery && (
          <button className="btn-icon" style={{padding:3}} onClick={() => onSearch('')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      <span style={{ fontSize:12, color:'var(--text-muted)', flexShrink:0 }} className="hide-mobile">{filteredCount} {t('linkCount')}</span>

      <div style={{ display:'flex', alignItems:'center', gap:3, marginLeft:'auto' }}>
        <div style={{ display:'flex', gap:1 }} className="hide-mobile">
          <button className={`btn-icon ${viewMode==='grid'?'active':''}`} onClick={() => onViewModeChange('grid')} title={t('gridView')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </button>
          <button className={`btn-icon ${viewMode==='list'?'active':''}`} onClick={() => onViewModeChange('list')} title={t('listView')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          </button>
        </div>

        {/* Sort */}
        <div style={{position:'relative'}} ref={sortRef}>
          <button className="btn btn-ghost" style={{gap:5,fontSize:12}} onClick={() => { setShowSort(!showSort); setShowMore(false); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l4-4 4 4M7 5v14M21 15l-4 4-4-4M17 19V5"/></svg>
            <span className="hide-mobile">{sortLabels[sortBy]}</span>
          </button>
          {showSort && (
            <>
              <div className="dropdown-overlay" onClick={() => setShowSort(false)} />
              <div className="dropdown-menu" style={{...calcPos(sortRef)}}>
                {Object.entries(sortLabels).map(([k,v]) => (
                  <div key={k} className="dropdown-item" style={sortBy===k ? {color:'var(--accent)'} : {}}
                    onClick={() => { onSortChange(k); setShowSort(false); }}>
                    {sortBy===k && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                    {v}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* More */}
        <div style={{position:'relative'}} ref={moreRef}>
          <button className="btn-icon" onClick={() => { setShowMore(!showMore); setShowSort(false); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </button>
          {showMore && (
            <>
              <div className="dropdown-overlay" onClick={() => setShowMore(false)} />
              <div className="dropdown-menu" style={{...calcPos(moreRef,192)}}>
                <div className="dropdown-item" onClick={() => { toggleLang(); setShowMore(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/></svg>
                  {t('language')}
                </div>
                <div className="dropdown-item" onClick={() => { onThemeToggle(); setShowMore(false); }}>
                  {theme==='dark' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                  )}
                  {theme==='dark' ? t('lightTheme') : t('darkTheme')}
                </div>
                <div className="divider" style={{margin:'3px 0'}}/>
                <div className="dropdown-item" onClick={() => { exportData(); setShowMore(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  {t('exportJSON')}
                </div>
                <div className="dropdown-item" onClick={() => { fileRef.current?.click(); setShowMore(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  {t('importJSON')}
                </div>
              </div>
            </>
          )}
        </div>

        <button className="btn btn-primary" onClick={onAdd} style={{marginLeft:4}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          <span className="hide-mobile">{t('add')}</span>
        </button>
      </div>

      <input ref={fileRef} type="file" accept=".json" style={{display:'none'}} onChange={e => { e.target.files[0] && onImport(e.target.files[0]); e.target.value=''; }} />
    </header>
  );
}
