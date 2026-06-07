import { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n, timeAgo } from '../i18n.jsx';

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function FaviconImg({ src, title }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="favicon" style={{ display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:10,fontWeight:700 }}>
        {title?.[0]?.toUpperCase() || '?'}
      </div>
    );
  }
  return <img className="favicon" src={src} alt="" onError={() => setFailed(true)} loading="lazy" />;
}

function TagBadge({ tag, small }) {
  return (
    <span className="tag-badge" style={{
      background: tag.color + '20', color: tag.color,
      fontSize: small ? 10 : 11, padding: small ? '2px 7px' : '3px 10px',
    }}>
      {tag.name}
    </span>
  );
}

/* ── Viewport-aware fixed dropdown ───────────────────────────── */
function CardDropdown({ anchorRef, onClose, children }) {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0 });

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const menuW = 192;
    const menuH = menuRef.current?.scrollHeight || 280;
    const pad = 8;
    let top = rect.bottom + pad;
    let left = rect.right - menuW;
    if (top + menuH > window.innerHeight - pad) top = rect.top - menuH - pad;
    if (top < pad) top = pad;
    if (left < pad) left = pad;
    if (left + menuW > window.innerWidth - pad) left = window.innerWidth - menuW - pad;
    setStyle({ top, left, opacity: 1 });
  }, [anchorRef]);

  return (
    <>
      <div className="dropdown-overlay" onClick={onClose} />
      <div ref={menuRef} className="dropdown-menu" style={style}>
        {children}
      </div>
    </>
  );
}

/* ── Icon helpers ────────────────────────────────────────────── */
const IC = {
  pin: (f) => <svg width="14" height="14" viewBox="0 0 24 24" fill={f?'currentColor':'none'} stroke="currentColor" strokeWidth="2"><path d="M12 2v8l4-1V3H8v6l4 1z"/><path d="M8 9H5l-1 3h16l-1-3h-3"/><path d="M12 12v10"/></svg>,
  dots: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  open: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  copy: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  archive: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
};

/* ═══ GRID CARD ═══════════════════════════════════════════════ */
export function BookmarkCard({ bookmark, tags, onEdit, onDelete, onTogglePin, onToggleArchive, onToast }) {
  const { t } = useI18n();
  const [showMenu, setShowMenu] = useState(false);
  const menuBtnRef = useRef(null);
  const bmTags = tags.filter(tg => bookmark.tagIds?.includes(tg.id));
  const domain = getDomain(bookmark.url);

  const openLink = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('.dropdown-menu') || e.target.closest('.tag-badge')) return;
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  }, [bookmark.url]);

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(bookmark.url).then(() => onToast?.(t('urlCopied'), 'success')).catch(()=>{});
  }, [bookmark.url, onToast, t]);

  return (
    <div className={`bookmark-card ${bookmark.isPinned ? 'is-pinned' : ''}`} onClick={openLink} tabIndex={0}>
      {bookmark.isPinned && (
        <div style={{ position:'absolute',top:12,right:12,color:'var(--accent)',opacity:0.7 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></svg>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <FaviconImg src={bookmark.favicon} title={bookmark.title} />
        <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'"JetBrains Mono",monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
          {domain}
        </span>
        <div className="card-actions" style={{ display:'flex', gap:2 }}>
          <button className="btn-icon" style={{padding:4}} title={bookmark.isPinned ? t('unpin') : t('pin')}
            onClick={e => { e.stopPropagation(); onTogglePin(bookmark.id); }}>
            {IC.pin(bookmark.isPinned)}
          </button>
          <button ref={menuBtnRef} className="btn-icon" style={{padding:4}}
            onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}>
            {IC.dots}
          </button>
        </div>
      </div>

      <h3 style={{ fontSize:15, fontWeight:600, color:'var(--text)', marginBottom:6, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {bookmark.title || domain}
      </h3>

      {bookmark.description && (
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14, lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {bookmark.description}
        </p>
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', flex:1, minWidth:0 }}>
          {bmTags.slice(0,3).map(tg => <TagBadge key={tg.id} tag={tg} />)}
          {bmTags.length > 3 && <span className="tag-badge" style={{background:'var(--surface)',color:'var(--text-muted)'}}>+{bmTags.length-3}</span>}
        </div>
        <span style={{ fontSize:11, color:'var(--text-muted)', flexShrink:0 }}>{timeAgo(bookmark.createdAt, t)}</span>
      </div>

      {/* FIXED DROPDOWN */}
      {showMenu && (
        <CardDropdown anchorRef={menuBtnRef} onClose={() => setShowMenu(false)}>
          <div className="dropdown-item" onClick={e => { e.stopPropagation(); setShowMenu(false); onEdit(bookmark); }}>
            {IC.edit} {t('edit')}
          </div>
          <div className="dropdown-item" onClick={e => { e.stopPropagation(); setShowMenu(false); window.open(bookmark.url,'_blank','noopener,noreferrer'); }}>
            {IC.open} {t('open')}
          </div>
          <div className="dropdown-item" onClick={e => { e.stopPropagation(); setShowMenu(false); copyUrl(); }}>
            {IC.copy} {t('copyUrl')}
          </div>
          <div className="divider" style={{margin:'3px 0'}}/>
          <div className="dropdown-item" onClick={e => { e.stopPropagation(); setShowMenu(false); onToggleArchive(bookmark.id); }}>
            {IC.archive} {bookmark.isArchived ? t('unarchive') : t('archive')}
          </div>
          <div className="dropdown-item danger" onClick={e => { e.stopPropagation(); setShowMenu(false); onDelete(bookmark); }}>
            {IC.trash} {t('delete')}
          </div>
        </CardDropdown>
      )}
    </div>
  );
}

/* ═══ LIST ITEM ═══════════════════════════════════════════════ */
export function BookmarkListItem({ bookmark, tags, onEdit, onDelete, onTogglePin, onToggleArchive, onToast }) {
  const { t } = useI18n();
  const [showMenu, setShowMenu] = useState(false);
  const menuBtnRef = useRef(null);
  const bmTags = tags.filter(tg => bookmark.tagIds?.includes(tg.id));
  const domain = getDomain(bookmark.url);

  const openLink = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('.dropdown-menu')) return;
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  }, [bookmark.url]);

  return (
    <div className="bookmark-list-item" onClick={openLink} tabIndex={0}>
      <FaviconImg src={bookmark.favicon} title={bookmark.title} />
      <div style={{ flex:1, minWidth:0 }}>
        <span style={{ fontSize:14, fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block' }}>
          {bookmark.title || domain}
          {bookmark.isPinned && <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--accent)" style={{marginLeft:6,verticalAlign:'middle'}}><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></svg>}
        </span>
        <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'"JetBrains Mono",monospace' }}>{domain}</span>
      </div>
      <div style={{ display:'flex', gap:4, flexShrink:0 }} className="hide-mobile">
        {bmTags.slice(0,2).map(tg => <TagBadge key={tg.id} tag={tg} small />)}
        {bmTags.length > 2 && <span className="tag-badge" style={{background:'var(--surface)',color:'var(--text-muted)',fontSize:10}}>+{bmTags.length-2}</span>}
      </div>
      <span style={{ fontSize:11, color:'var(--text-muted)', flexShrink:0 }} className="hide-mobile">{timeAgo(bookmark.createdAt, t)}</span>
      <div className="card-actions" style={{ display:'flex', gap:2 }}>
        <button className="btn-icon" style={{padding:4}} onClick={e => { e.stopPropagation(); onEdit(bookmark); }}>{IC.edit}</button>
        <button ref={menuBtnRef} className="btn-icon" style={{padding:4}} onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}>{IC.dots}</button>
      </div>
      {showMenu && (
        <CardDropdown anchorRef={menuBtnRef} onClose={() => setShowMenu(false)}>
          <div className="dropdown-item" onClick={e => { e.stopPropagation(); setShowMenu(false); onTogglePin(bookmark.id); }}>
            {IC.pin(bookmark.isPinned)} {bookmark.isPinned ? t('unpin') : t('pin')}
          </div>
          <div className="dropdown-item" onClick={e => { e.stopPropagation(); setShowMenu(false); onToggleArchive(bookmark.id); }}>
            {IC.archive} {bookmark.isArchived ? t('unarchive') : t('archive')}
          </div>
          <div className="divider" style={{margin:'3px 0'}}/>
          <div className="dropdown-item danger" onClick={e => { e.stopPropagation(); setShowMenu(false); onDelete(bookmark); }}>
            {IC.trash} {t('delete')}
          </div>
        </CardDropdown>
      )}
    </div>
  );
}
