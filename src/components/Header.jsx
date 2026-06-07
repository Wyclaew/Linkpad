import { useRef, useState } from 'react';
import { exportData } from '../utils/export.js';

export default function Header({
  searchQuery,
  onSearch,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onAdd,
  onImport,
  onToggleSidebar,
  isSidebarOpen,
  activeView,
  filteredCount,
  theme,
  onThemeToggle,
}) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const fileInputRef = useRef(null);
  const sortRef = useRef(null);
  const moreRef = useRef(null);

  const sortLabels = { newest: 'En yeni', oldest: 'En eski', alpha: 'A → Z' };

  const viewTitles = {
    all: 'Tüm Linkler',
    pinned: 'Sabitlendi',
    archived: 'Arşiv',
  };

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  }

  return (
    <header
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--bg)',
        flexShrink: 0,
      }}
    >
      {/* Sidebar toggle */}
      <button
        className="btn-icon"
        onClick={onToggleSidebar}
        title={isSidebarOpen ? 'Kenar çubuğunu gizle' : 'Kenar çubuğunu göster'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M9 3v18"/>
        </svg>
      </button>

      {/* Title */}
      <h1
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text)',
          margin: 0,
          flexShrink: 0,
          display: 'none',
        }}
        className="sm-show"
      >
        {viewTitles[activeView]}
      </h1>

      {/* Search */}
      <div className="search-bar" style={{ flex: 1, maxWidth: 480 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Link, başlık veya açıklamada ara…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
        {searchQuery && (
          <button
            className="btn-icon"
            style={{ padding: '3px' }}
            onClick={() => onSearch('')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Result count */}
      {(searchQuery || filteredCount !== undefined) && (
        <span style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>
          {filteredCount} link
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
        {/* View mode toggle */}
        <div style={{ display: 'flex', gap: 1 }}>
          <button
            className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Kart görünümü"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button
            className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Liste görünümü"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
          </button>
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }} ref={sortRef}>
          <button
            className="btn btn-ghost"
            style={{ gap: 4, fontSize: 13 }}
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowMoreMenu(false);
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l4-4 4 4M7 5v14M21 15l-4 4-4-4M17 19V5"/>
            </svg>
            {sortLabels[sortBy]}
          </button>
          {showSortMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 25 }} onClick={() => setShowSortMenu(false)} />
              <div className="dropdown" style={{ right: 0, top: '100%', marginTop: 6 }}>
                {Object.entries(sortLabels).map(([key, label]) => (
                  <div
                    key={key}
                    className="dropdown-item"
                    style={sortBy === key ? { color: 'var(--accent)' } : {}}
                    onClick={() => {
                      onSortChange(key);
                      setShowSortMenu(false);
                    }}
                  >
                    {sortBy === key && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                    {label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* More menu */}
        <div style={{ position: 'relative' }} ref={moreRef}>
          <button
            className="btn-icon"
            title="Daha fazla"
            onClick={() => {
              setShowMoreMenu(!showMoreMenu);
              setShowSortMenu(false);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          {showMoreMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 25 }} onClick={() => setShowMoreMenu(false)} />
              <div className="dropdown" style={{ right: 0, top: '100%', marginTop: 6 }}>
                <div className="dropdown-item" onClick={() => { onThemeToggle(); setShowMoreMenu(false); }}>
                  {theme === 'dark' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                      </svg>
                      Açık Tema
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                      </svg>
                      Koyu Tema
                    </>
                  )}
                </div>
                <div className="divider" style={{ margin: '4px 0' }}/>
                <div className="dropdown-item" onClick={() => { exportData(); setShowMoreMenu(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Dışa Aktar (JSON)
                </div>
                <div className="dropdown-item" onClick={() => { fileInputRef.current?.click(); setShowMoreMenu(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  İçe Aktar (JSON)
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add button */}
        <button className="btn btn-primary" onClick={onAdd} style={{ marginLeft: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span style={{ display: 'none' }} className="md-show">Ekle</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />
    </header>
  );
}
