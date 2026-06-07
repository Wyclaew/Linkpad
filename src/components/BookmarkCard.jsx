import { useState } from 'react';
import { getDomain, timeAgo } from '../utils/url.js';

function TagBadge({ tag, small = false }) {
  return (
    <span
      className="tag-badge"
      style={{
        background: tag.color + '22',
        color: tag.color,
        fontSize: small ? 10 : 11,
        padding: small ? '1px 6px' : '2px 8px',
      }}
    >
      {tag.name}
    </span>
  );
}

function FaviconImg({ src, title }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className="favicon"
        style={{
          background: 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 10,
          fontWeight: 600,
        }}
      >
        {title?.[0]?.toUpperCase() || '?'}
      </div>
    );
  }
  return (
    <img
      className="favicon"
      src={src}
      alt=""
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
export function BookmarkCard({ bookmark, tags, onEdit, onDelete, onTogglePin, onToggleArchive }) {
  const [showMenu, setShowMenu] = useState(false);
  const bmTags = tags.filter((t) => bookmark.tagIds?.includes(t.id));
  const domain = getDomain(bookmark.url);

  function openLink(e) {
    if (e.target.closest('button') || e.target.closest('.tag-badge')) return;
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      className={`bookmark-card ${bookmark.isPinned ? 'is-pinned' : ''}`}
      onClick={openLink}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openLink(e)}
    >
      {/* Pin indicator */}
      {bookmark.isPinned && (
        <div className="pin-indicator">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v7a1 1 0 01-.293.707L17 13.414V20a1 1 0 01-1.447.894l-4-2a1 1 0 00-.894 0l-4 2A1 1 0 016 20v-6.586l-1.707-1.707A1 1 0 014 11V4z"/>
          </svg>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <FaviconImg src={bookmark.favicon} title={bookmark.title} />
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {domain}
        </span>
        {/* Actions */}
        <div className="actions" style={{ display: 'flex', gap: 2, position: 'relative' }}>
          <button
            className="btn-icon"
            style={{ padding: '4px' }}
            title={bookmark.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(bookmark.id);
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={bookmark.isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: bookmark.isPinned ? 'var(--accent)' : undefined }}>
              <path d="M17.5 2.5h-11l-1 8h13l-1-8z"/><path d="M12 10.5v11"/><path d="M8 21.5h8"/>
            </svg>
          </button>
          <button
            className="btn-icon"
            style={{ padding: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            title="Daha fazla"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          {showMenu && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 25 }}
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
              />
              <div className="dropdown" style={{ right: 0, top: '100%', marginTop: 4 }}>
                <div
                  className="dropdown-item"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(bookmark); }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Düzenle
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); window.open(bookmark.url, '_blank', 'noopener,noreferrer'); }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Aç
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation(); setShowMenu(false);
                    navigator.clipboard.writeText(bookmark.url).catch(() => {});
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                  URL Kopyala
                </div>
                <div className="divider" style={{ margin: '4px 0' }}/>
                <div
                  className="dropdown-item"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onToggleArchive(bookmark.id); }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
                  </svg>
                  {bookmark.isArchived ? 'Arşivden Çıkar' : 'Arşivle'}
                </div>
                <div
                  className="dropdown-item danger"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(bookmark); }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                  Sil
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 6px',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {bookmark.title || domain}
      </h3>

      {/* Description */}
      {bookmark.description && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            margin: '0 0 12px',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {bookmark.description}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginTop: 'auto',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          {bmTags.slice(0, 3).map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
          {bmTags.length > 3 && (
            <span
              className="tag-badge"
              style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}
            >
              +{bmTags.length - 3}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
          {timeAgo(bookmark.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ─── List Item ────────────────────────────────────────────────────────────────
export function BookmarkListItem({ bookmark, tags, onEdit, onDelete, onTogglePin, onToggleArchive }) {
  const [showMenu, setShowMenu] = useState(false);
  const bmTags = tags.filter((t) => bookmark.tagIds?.includes(t.id));
  const domain = getDomain(bookmark.url);

  function openLink(e) {
    if (e.target.closest('button') || e.target.closest('.tag-badge')) return;
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      className="bookmark-list-item"
      onClick={openLink}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openLink(e)}
    >
      <FaviconImg src={bookmark.favicon} title={bookmark.title} />
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {bookmark.title || domain}
          </span>
          {bookmark.isPinned && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent)', flexShrink: 0 }}>
              <path d="M17.5 2.5h-11l-1 8h13l-1-8z"/><path d="M12 10.5v11"/><path d="M8 21.5h8"/>
            </svg>
          )}
        </div>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: 'var(--text-muted)' }}
        >
          {domain}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {bmTags.slice(0, 2).map((tag) => (
          <TagBadge key={tag.id} tag={tag} small />
        ))}
        {bmTags.length > 2 && (
          <span
            className="tag-badge"
            style={{ background: 'var(--surface2)', color: 'var(--text-muted)', fontSize: 10 }}
          >
            +{bmTags.length - 2}
          </span>
        )}
      </div>

      <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
        {timeAgo(bookmark.createdAt)}
      </span>

      {/* Actions */}
      <div className="actions" style={{ display: 'flex', gap: 2, position: 'relative' }}>
        <button
          className="btn-icon"
          style={{ padding: '4px' }}
          onClick={(e) => { e.stopPropagation(); onTogglePin(bookmark.id); }}
          title={bookmark.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={bookmark.isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{ color: bookmark.isPinned ? 'var(--accent)' : undefined }}>
            <path d="M17.5 2.5h-11l-1 8h13l-1-8z"/><path d="M12 10.5v11"/><path d="M8 21.5h8"/>
          </svg>
        </button>
        <button
          className="btn-icon"
          style={{ padding: '4px' }}
          onClick={(e) => { e.stopPropagation(); onEdit(bookmark); }}
          title="Düzenle"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="btn-icon"
          style={{ padding: '4px' }}
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        </button>
        {showMenu && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 25 }} onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
            <div className="dropdown" style={{ right: 0, top: '100%', marginTop: 4 }}>
              <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setShowMenu(false); onToggleArchive(bookmark.id); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
                </svg>
                {bookmark.isArchived ? 'Arşivden Çıkar' : 'Arşivle'}
              </div>
              <div className="dropdown-item danger" onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(bookmark); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
                Sil
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
