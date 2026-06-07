import { useState } from 'react';

export default function Sidebar({
  tags,
  bookmarks,
  selectedTagIds,
  activeView,
  onTagToggle,
  onViewChange,
  onOpenTagManager,
  onAdd,
}) {
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  // Count helpers
  const allCount = bookmarks.filter((b) => !b.isArchived).length;
  const pinnedCount = bookmarks.filter((b) => b.isPinned && !b.isArchived).length;
  const archivedCount = bookmarks.filter((b) => b.isArchived).length;

  function getTagCount(tagId) {
    return bookmarks.filter(
      (b) => !b.isArchived && b.tagIds?.includes(tagId)
    ).length;
  }

  return (
    <aside className="sidebar" style={{ overflow: 'hidden' }}>
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="14" fill="var(--accent)" fillOpacity="0.15"/>
          <path
            d="M18 16 L46 16 L46 52 L32 44 L18 52 Z"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="24" y1="26" x2="40" y2="26" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="24" y1="32" x2="36" y2="32" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          LinkPad
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
        {/* Add button */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
          onClick={onAdd}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Yeni Link
        </button>

        {/* Navigation */}
        <div style={{ marginBottom: 4 }}>
          <div
            className={`nav-item ${activeView === 'all' ? 'active' : ''}`}
            onClick={() => onViewChange('all')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            Tüm Linkler
            <span className="count">{allCount}</span>
          </div>
          <div
            className={`nav-item ${activeView === 'pinned' ? 'active' : ''}`}
            onClick={() => onViewChange('pinned')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 2.5h-11l-1 8h13l-1-8z"/><path d="M12 10.5v11"/><path d="M8 21.5h8"/>
            </svg>
            Sabitlendi
            <span className="count">{pinnedCount}</span>
          </div>
          <div
            className={`nav-item ${activeView === 'archived' ? 'active' : ''}`}
            onClick={() => onViewChange('archived')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
            </svg>
            Arşiv
            <span className="count">{archivedCount}</span>
          </div>
        </div>

        <div className="divider" />

        {/* Tags section */}
        <div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '6px 14px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'inherit',
            }}
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
          >
            Etiketler
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                transform: isTagsExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {isTagsExpanded && (
            <div style={{ marginTop: 2 }}>
              {tags.length === 0 ? (
                <p
                  style={{
                    padding: '6px 14px',
                    fontSize: 13,
                    color: 'var(--text-muted)',
                  }}
                >
                  Henüz tag yok
                </p>
              ) : (
                tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  const count = getTagCount(tag.id);
                  return (
                    <div
                      key={tag.id}
                      className={`nav-item ${isSelected ? 'active' : ''}`}
                      onClick={() => onTagToggle(tag.id)}
                      style={
                        isSelected
                          ? {
                              background: tag.color + '18',
                              color: tag.color,
                            }
                          : {}
                      }
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: tag.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tag.name}
                      </span>
                      <span className="count">{count}</span>
                    </div>
                  );
                })
              )}

              {/* Manage tags button */}
              <button
                className="nav-item"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  marginTop: 2,
                }}
                onClick={onOpenTagManager}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Etiket Yönet
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        {allCount} link · {tags.length} etiket
      </div>
    </aside>
  );
}
