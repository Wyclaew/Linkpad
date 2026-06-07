import { useState, useEffect, useMemo, useCallback } from 'react';
import { db, initializeDB } from './db/index.js';
import { importData } from './utils/export.js';
import { useI18n } from './i18n.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import { BookmarkCard, BookmarkListItem } from './components/BookmarkCard.jsx';
import AddBookmarkModal from './components/AddBookmarkModal.jsx';
import TagManagerModal from './components/TagManagerModal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import EmptyState from './components/EmptyState.jsx';
import { ToastContainer, useToast } from './components/Toast.jsx';

export default function App() {
  const { t } = useI18n();

  const [bookmarks, setBookmarks] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('lp_viewMode') || 'grid');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('lp_sortBy') || 'newest');
  const [activeView, setActiveView] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBm, setEditingBm] = useState(null);
  const [showTagMgr, setShowTagMgr] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [theme, setTheme] = useState(() => {
    const s = localStorage.getItem('lp_theme');
    if (s) return s;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const { toasts, toast } = useToast();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Theme
  useEffect(() => {
    const h = document.documentElement;
    h.classList.remove('dark','light');
    h.classList.add(theme);
    localStorage.setItem('lp_theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme==='dark'?'#09090b':'#f8f8fa');
  }, [theme]);

  useEffect(() => { localStorage.setItem('lp_viewMode', viewMode); }, [viewMode]);
  useEffect(() => { localStorage.setItem('lp_sortBy', sortBy); }, [sortBy]);

  // Load data
  async function loadData() {
    try {
      await initializeDB();
      const [bms, tgs] = await Promise.all([db.bookmarks.toArray(), db.tags.toArray()]);
      setBookmarks(bms); setTags(tgs);
    } catch { toast(t('loadFail'), 'error'); }
    finally { setIsLoading(false); }
  }
  useEffect(() => { loadData(); }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      const inInput = ['INPUT','TEXTAREA'].includes(e.target.tagName);
      if (e.key === 'Escape') { if (!showAddModal && !editingBm && !showTagMgr && !deleteTarget) { setSelectedTagIds([]); setSearchQuery(''); } }
      if (!inInput) {
        if (e.key==='n'||e.key==='N') { e.preventDefault(); setShowAddModal(true); }
        if (e.key==='/'||((e.metaKey||e.ctrlKey)&&e.key==='k')) { e.preventDefault(); document.querySelector('.search-bar input')?.focus(); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAddModal, editingBm, showTagMgr, deleteTarget]);

  // Filtered + Sorted
  const filteredBookmarks = useMemo(() => {
    let r = [...bookmarks];
    if (activeView==='pinned') r = r.filter(b => b.isPinned && !b.isArchived);
    else if (activeView==='archived') r = r.filter(b => b.isArchived);
    else r = r.filter(b => !b.isArchived);
    if (selectedTagIds.length > 0) r = r.filter(b => selectedTagIds.every(tid => b.tagIds?.includes(tid)));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(b => b.title?.toLowerCase().includes(q) || b.url?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q));
    }
    return r.sort((a,b) => {
      if (activeView!=='pinned') { if (a.isPinned&&!b.isPinned) return -1; if (!a.isPinned&&b.isPinned) return 1; }
      if (sortBy==='oldest') return a.createdAt-b.createdAt;
      if (sortBy==='alpha') return (a.title||'').localeCompare(b.title||'','tr');
      return b.createdAt-a.createdAt;
    });
  }, [bookmarks, activeView, selectedTagIds, searchQuery, sortBy]);

  // CRUD
  const addBm = useCallback(async (data) => {
    const now = Date.now();
    const id = await db.bookmarks.add({...data, isPinned:false, isArchived:false, createdAt:now, updatedAt:now});
    const bm = await db.bookmarks.get(id);
    setBookmarks(p => [...p, bm]); setShowAddModal(false); toast(t('linkAdded'),'success');
  }, [toast, t]);

  const updateBm = useCallback(async (id, data) => {
    await db.bookmarks.update(id, {...data, updatedAt:Date.now()});
    const u = await db.bookmarks.get(id);
    setBookmarks(p => p.map(b => b.id===id ? u : b)); setEditingBm(null); toast(t('linkUpdated'),'success');
  }, [toast, t]);

  const deleteBm = useCallback(async (id) => {
    await db.bookmarks.delete(id);
    setBookmarks(p => p.filter(b => b.id!==id)); setDeleteTarget(null); toast(t('linkDeleted'),'info');
  }, [toast, t]);

  const togglePin = useCallback(async (id) => {
    const bm = bookmarks.find(b => b.id===id); if(!bm) return;
    const nv = !bm.isPinned;
    await db.bookmarks.update(id, {isPinned:nv, updatedAt:Date.now()});
    setBookmarks(p => p.map(b => b.id===id ? {...b,isPinned:nv} : b));
    toast(nv ? t('pinnedToast') : t('unpinnedToast'), 'success');
  }, [bookmarks, toast, t]);

  const toggleArchive = useCallback(async (id) => {
    const bm = bookmarks.find(b => b.id===id); if(!bm) return;
    const nv = !bm.isArchived;
    await db.bookmarks.update(id, {isArchived:nv, updatedAt:Date.now()});
    setBookmarks(p => p.map(b => b.id===id ? {...b,isArchived:nv} : b));
    toast(nv ? t('archivedToast') : t('unarchivedToast'), 'success');
  }, [bookmarks, toast, t]);

  const createTag = useCallback(async (data) => {
    const id = await db.tags.add({...data, createdAt:Date.now()});
    const tag = await db.tags.get(id);
    setTags(p => [...p, tag]); return tag;
  }, []);

  const updateTag = useCallback(async (id, data) => {
    await db.tags.update(id, data);
    setTags(p => p.map(t2 => t2.id===id ? {...t2,...data} : t2));
  }, []);

  const deleteTag = useCallback(async (id) => {
    await db.tags.delete(id);
    const aff = bookmarks.filter(b => b.tagIds?.includes(id));
    for (const bm of aff) await db.bookmarks.update(bm.id, {tagIds:bm.tagIds.filter(tid=>tid!==id)});
    setBookmarks(p => p.map(b => b.tagIds?.includes(id) ? {...b,tagIds:b.tagIds.filter(tid=>tid!==id)} : b));
    setTags(p => p.filter(tg => tg.id!==id));
    setSelectedTagIds(p => p.filter(tid => tid!==id));
    toast(t('tagDeleted'),'info');
  }, [bookmarks, toast, t]);

  const handleImport = useCallback(async (file) => {
    try {
      const res = await importData(file);
      await loadData();
      toast(`${res.bookmarks} ${t('importSuccess')}`,'success');
    } catch (e) { toast(e.message||t('importFail'),'error'); }
  }, [toast, t]);

  const handleViewChange = useCallback((v) => { setActiveView(v); setSelectedTagIds([]); setSearchQuery(''); setMobileSidebar(false); }, []);
  const handleTagToggle = useCallback((id) => { setSelectedTagIds(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]); }, []);
  const emptyType = () => { if(searchQuery) return 'search'; if(activeView==='pinned') return 'pinned'; if(activeView==='archived') return 'archived'; if(selectedTagIds.length>0) return 'filtered'; return 'empty'; };

  const cardProps = { tags, onEdit:setEditingBm, onDelete:setDeleteTarget, onTogglePin:togglePin, onToggleArchive:toggleArchive, onToast:toast };

  return (
    <>
      <div className="dot-grid" />
      <div className="app-layout">
        {isMobile && mobileSidebar && <div className="sidebar-backdrop" onClick={() => setMobileSidebar(false)} />}

        <aside className={`sidebar ${isMobile ? (mobileSidebar?'mobile-open':'') : (sidebarOpen?'':'collapsed')}`}>
          <Sidebar tags={tags} bookmarks={bookmarks} selectedTagIds={selectedTagIds} activeView={activeView}
            onTagToggle={handleTagToggle} onViewChange={handleViewChange}
            onOpenTagManager={() => { setShowTagMgr(true); setMobileSidebar(false); }}
            onAdd={() => { setShowAddModal(true); setMobileSidebar(false); }} />
        </aside>

        <main className="main-content">
          <Header searchQuery={searchQuery} onSearch={setSearchQuery} viewMode={viewMode} onViewModeChange={setViewMode}
            sortBy={sortBy} onSortChange={setSortBy} onAdd={() => setShowAddModal(true)} onImport={handleImport}
            onToggleSidebar={() => isMobile ? setMobileSidebar(!mobileSidebar) : setSidebarOpen(!sidebarOpen)}
            filteredCount={filteredBookmarks.length} theme={theme}
            onThemeToggle={() => setTheme(t2 => t2==='dark'?'light':'dark')} />

          <div style={{ flex:1, overflowY:'auto' }}>
            {isLoading ? (
              <div className="empty-state"><div className="spinner" style={{width:32,height:32}}/></div>
            ) : filteredBookmarks.length === 0 ? (
              <EmptyState type={emptyType()} searchQuery={searchQuery} onAdd={() => setShowAddModal(true)} />
            ) : viewMode === 'grid' ? (
              <div className="bookmark-grid">
                {filteredBookmarks.map(bm => <BookmarkCard key={bm.id} bookmark={bm} {...cardProps} />)}
              </div>
            ) : (
              <div className="bookmark-list">
                {filteredBookmarks.map(bm => <BookmarkListItem key={bm.id} bookmark={bm} {...cardProps} />)}
              </div>
            )}
          </div>
        </main>
      </div>

      {(showAddModal||editingBm) && (
        <AddBookmarkModal bookmark={editingBm||undefined} tags={tags}
          onSave={editingBm ? (data) => updateBm(editingBm.id,data) : addBm}
          onClose={() => { setShowAddModal(false); setEditingBm(null); }}
          onCreateTag={createTag} />
      )}
      {showTagMgr && <TagManagerModal tags={tags} bookmarks={bookmarks} onClose={() => setShowTagMgr(false)} onCreate={createTag} onUpdate={updateTag} onDelete={deleteTag} />}
      {deleteTarget && <ConfirmDialog title={t('deleteLink')} message={`"${deleteTarget.title||deleteTarget.url}" ${t('deleteMsg')}`} confirmLabel={t('yesDelete')} onConfirm={() => deleteBm(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} danger />}
      <ToastContainer toasts={toasts} />
    </>
  );
}
