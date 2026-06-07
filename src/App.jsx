import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { db, initializeDB } from './db/index.js';
import { importData } from './utils/export.js';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import { BookmarkCard, BookmarkListItem } from './components/BookmarkCard.jsx';
import AddBookmarkModal from './components/AddBookmarkModal.jsx';
import TagManagerModal from './components/TagManagerModal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import EmptyState from './components/EmptyState.jsx';
import { ToastContainer, useToast } from './components/Toast.jsx';

export default function App() {
  // ─── Data state ─────────────────────────────────────────────────────────────
  const [bookmarks, setBookmarks] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── UI state ───────────────────────────────────────────────────────────────
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('lp_viewMode') || 'grid');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('lp_sortBy') || 'newest');
  const [activeView, setActiveView] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ─── Modal state ─────────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ─── Theme ───────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('lp_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const { toasts, toast } = useToast();
  const searchInputRef = useRef(null);

  // ─── Apply theme ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.remove('dark');
      html.classList.add('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
    localStorage.setItem('lp_theme', theme);
  }, [theme]);

  // ─── Persist view preferences ─────────────────────────────────────────────
  useEffect(() => { localStorage.setItem('lp_viewMode', viewMode); }, [viewMode]);
  useEffect(() => { localStorage.setItem('lp_sortBy', sortBy); }, [sortBy]);

  // ─── Load data from IndexedDB ─────────────────────────────────────────────
  async function loadData() {
    try {
      await initializeDB();
      const [bms, tgs] = await Promise.all([db.bookmarks.toArray(), db.tags.toArray()]);
      setBookmarks(bms);
      setTags(tgs);
    } catch (err) {
      console.error('DB load error:', err);
      toast('Veriler yüklenemedi', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      const tag = e.target.tagName;
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if (e.key === 'Escape') {
        if (showAddModal || editingBookmark || showTagManager || deleteTarget) return;
        setSelectedTagIds([]);
        setSearchQuery('');
      }

      if (!inInput) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          setShowAddModal(true);
        }
        if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
          e.preventDefault();
          document.querySelector('.search-bar input')?.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAddModal, editingBookmark, showTagManager, deleteTarget]);

  // ─── Computed: filtered + sorted bookmarks ────────────────────────────────
  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // View filter
    if (activeView === 'pinned') {
      result = result.filter((b) => b.isPinned && !b.isArchived);
    } else if (activeView === 'archived') {
      result = result.filter((b) => b.isArchived);
    } else {
      result = result.filter((b) => !b.isArchived);
    }

    // Tag filter (all selected tags must match)
    if (selectedTagIds.length > 0) {
      result = result.filter((b) =>
        selectedTagIds.every((tid) => b.tagIds?.includes(tid))
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.url?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    // Sort — pinned items always first within each group
    const sorted = result.sort((a, b) => {
      if (activeView !== 'pinned') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'alpha') return (a.title || '').localeCompare(b.title || '', 'tr');
      return b.createdAt - a.createdAt; // newest
    });

    return sorted;
  }, [bookmarks, activeView, selectedTagIds, searchQuery, sortBy]);

  // ─── Bookmark CRUD ────────────────────────────────────────────────────────
  const addBookmark = useCallback(async (data) => {
    const now = Date.now();
    const id = await db.bookmarks.add({
      ...data,
      isPinned: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });
    const newBm = await db.bookmarks.get(id);
    setBookmarks((prev) => [...prev, newBm]);
    setShowAddModal(false);
    toast('Link eklendi ✓', 'success');
  }, [toast]);

  const updateBookmark = useCallback(async (id, data) => {
    await db.bookmarks.update(id, { ...data, updatedAt: Date.now() });
    const updated = await db.bookmarks.get(id);
    setBookmarks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    setEditingBookmark(null);
    toast('Link güncellendi ✓', 'success');
  }, [toast]);

  const deleteBookmark = useCallback(async (id) => {
    await db.bookmarks.delete(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    setDeleteTarget(null);
    toast('Link silindi', 'info');
  }, [toast]);

  const togglePin = useCallback(async (id) => {
    const bm = bookmarks.find((b) => b.id === id);
    if (!bm) return;
    const newVal = !bm.isPinned;
    await db.bookmarks.update(id, { isPinned: newVal, updatedAt: Date.now() });
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPinned: newVal, updatedAt: Date.now() } : b))
    );
    toast(newVal ? 'Sabitlendi 📌' : 'Sabitleme kaldırıldı', 'success');
  }, [bookmarks, toast]);

  const toggleArchive = useCallback(async (id) => {
    const bm = bookmarks.find((b) => b.id === id);
    if (!bm) return;
    const newVal = !bm.isArchived;
    await db.bookmarks.update(id, { isArchived: newVal, updatedAt: Date.now() });
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isArchived: newVal, updatedAt: Date.now() } : b))
    );
    toast(newVal ? 'Arşivlendi' : 'Arşivden çıkarıldı', 'success');
  }, [bookmarks, toast]);

  // ─── Tag CRUD ──────────────────────────────────────────────────────────────
  const createTag = useCallback(async (data) => {
    const id = await db.tags.add({ ...data, createdAt: Date.now() });
    const newTag = await db.tags.get(id);
    setTags((prev) => [...prev, newTag]);
    return newTag;
  }, []);

  const updateTag = useCallback(async (id, data) => {
    await db.tags.update(id, data);
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const deleteTag = useCallback(async (id) => {
    await db.tags.delete(id);
    // Remove tag from all bookmarks
    const affected = bookmarks.filter((b) => b.tagIds?.includes(id));
    for (const bm of affected) {
      const newTagIds = bm.tagIds.filter((tid) => tid !== id);
      await db.bookmarks.update(bm.id, { tagIds: newTagIds });
    }
    setBookmarks((prev) =>
      prev.map((b) =>
        b.tagIds?.includes(id)
          ? { ...b, tagIds: b.tagIds.filter((tid) => tid !== id) }
          : b
      )
    );
    setTags((prev) => prev.filter((t) => t.id !== id));
    setSelectedTagIds((prev) => prev.filter((tid) => tid !== id));
    toast('Etiket silindi', 'info');
  }, [bookmarks, toast]);

  // ─── Import handler ────────────────────────────────────────────────────────
  const handleImport = useCallback(async (file) => {
    try {
      const result = await importData(file);
      await loadData();
      toast(`${result.bookmarks} link, ${result.tags} etiket içe aktarıldı ✓`, 'success');
    } catch (err) {
      toast(err.message || 'İçe aktarma başarısız', 'error');
    }
  }, [toast]);

  // ─── Tag toggle ────────────────────────────────────────────────────────────
  const handleTagToggle = useCallback((tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }, []);

  // ─── View change ───────────────────────────────────────────────────────────
  const handleViewChange = useCallback((view) => {
    setActiveView(view);
    setSelectedTagIds([]);
    setSearchQuery('');
    setMobileSidebarOpen(false);
  }, []);

  // ─── Empty state type ─────────────────────────────────────────────────────
  function getEmptyType() {
    if (searchQuery) return 'search';
    if (activeView === 'pinned') return 'pinned';
    if (activeView === 'archived') return 'archived';
    if (selectedTagIds.length > 0) return 'filtered';
    return 'empty';
  }

  const isMobile = window.innerWidth < 768;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="app-layout">
        {/* Mobile sidebar backdrop */}
        {isMobile && mobileSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`sidebar ${
            isMobile
              ? mobileSidebarOpen
                ? 'mobile-open'
                : ''
              : sidebarOpen
              ? ''
              : 'collapsed'
          }`}
        >
          <Sidebar
            tags={tags}
            bookmarks={bookmarks}
            selectedTagIds={selectedTagIds}
            activeView={activeView}
            onTagToggle={handleTagToggle}
            onViewChange={handleViewChange}
            onOpenTagManager={() => { setShowTagManager(true); setMobileSidebarOpen(false); }}
            onAdd={() => { setShowAddModal(true); setMobileSidebarOpen(false); }}
          />
        </aside>

        {/* Main content */}
        <main className="main-content">
          <Header
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onAdd={() => setShowAddModal(true)}
            onImport={handleImport}
            onToggleSidebar={() => {
              if (isMobile) {
                setMobileSidebarOpen(!mobileSidebarOpen);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            isSidebarOpen={isMobile ? mobileSidebarOpen : sidebarOpen}
            activeView={activeView}
            filteredCount={filteredBookmarks.length}
            theme={theme}
            onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          />

          {/* Bookmark content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {isLoading ? (
              <div className="empty-state">
                <div className="spinner" style={{ width: 32, height: 32 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Yükleniyor…</p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <EmptyState
                type={getEmptyType()}
                searchQuery={searchQuery}
                onAdd={() => setShowAddModal(true)}
              />
            ) : viewMode === 'grid' ? (
              <div className="bookmark-grid">
                {filteredBookmarks.map((bm) => (
                  <BookmarkCard
                    key={bm.id}
                    bookmark={bm}
                    tags={tags}
                    onEdit={setEditingBookmark}
                    onDelete={setDeleteTarget}
                    onTogglePin={togglePin}
                    onToggleArchive={toggleArchive}
                  />
                ))}
              </div>
            ) : (
              <div className="bookmark-list">
                {filteredBookmarks.map((bm) => (
                  <BookmarkListItem
                    key={bm.id}
                    bookmark={bm}
                    tags={tags}
                    onEdit={setEditingBookmark}
                    onDelete={setDeleteTarget}
                    onTogglePin={togglePin}
                    onToggleArchive={toggleArchive}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── Modals ──────────────────────────────────────────────────────── */}
      {(showAddModal || editingBookmark) && (
        <AddBookmarkModal
          bookmark={editingBookmark || undefined}
          tags={tags}
          onSave={
            editingBookmark
              ? (data) => updateBookmark(editingBookmark.id, data)
              : addBookmark
          }
          onClose={() => {
            setShowAddModal(false);
            setEditingBookmark(null);
          }}
          onCreateTag={createTag}
        />
      )}

      {showTagManager && (
        <TagManagerModal
          tags={tags}
          bookmarks={bookmarks}
          onClose={() => setShowTagManager(false)}
          onCreate={createTag}
          onUpdate={updateTag}
          onDelete={deleteTag}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Linki sil"
          message={`"${deleteTarget.title || deleteTarget.url}" silinecek. Bu işlem geri alınamaz.`}
          confirmLabel="Evet, Sil"
          onConfirm={() => deleteBookmark(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          danger
        />
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}
