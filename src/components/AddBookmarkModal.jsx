import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchUrlMetadata, getFaviconUrl, normalizeUrl, isValidUrl } from '../utils/url.js';
import { TAG_COLORS } from '../db/index.js';

export default function AddBookmarkModal({ bookmark, tags, onSave, onClose, onCreateTag }) {
  const isEditing = Boolean(bookmark);

  const [url, setUrl] = useState(bookmark?.url || '');
  const [title, setTitle] = useState(bookmark?.title || '');
  const [description, setDescription] = useState(bookmark?.description || '');
  const [selectedTagIds, setSelectedTagIds] = useState(bookmark?.tagIds || []);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]);
  const [isSaving, setIsSaving] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const urlInputRef = useRef(null);
  const fetchControllerRef = useRef(null);

  useEffect(() => {
    urlInputRef.current?.focus();
    return () => fetchControllerRef.current?.abort();
  }, []);

  const handleFetchMeta = useCallback(async (rawUrl) => {
    const normalized = normalizeUrl(rawUrl);
    if (!isValidUrl(normalized)) return;

    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    setIsFetching(true);
    setFetchError('');

    try {
      const meta = await fetchUrlMetadata(normalized, controller.signal);
      if (meta?.title && !title) setTitle(meta.title);
      if (meta?.description && !description) setDescription(meta.description);
    } catch {
      // Silent fail - user can fill manually
    } finally {
      setIsFetching(false);
    }
  }, [title, description]);

  function handleUrlBlur() {
    if (!url) return;
    const normalized = normalizeUrl(url);
    setUrl(normalized);
    if (!isValidUrl(normalized)) {
      setUrlError('Geçerli bir URL girin (örn: https://example.com)');
    } else {
      setUrlError('');
      if (!title) handleFetchMeta(normalized);
    }
  }

  function handleUrlPaste(e) {
    const pasted = e.clipboardData.getData('text').trim();
    const normalized = normalizeUrl(pasted);
    if (isValidUrl(normalized)) {
      setTimeout(() => {
        setUrl(normalized);
        setUrlError('');
        if (!title) handleFetchMeta(normalized);
      }, 0);
    }
  }

  function toggleTag(tagId) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;
    try {
      const newTag = await onCreateTag({ name: newTagName.trim(), color: newTagColor });
      setSelectedTagIds((prev) => [...prev, newTag.id]);
      setNewTagName('');
      setShowNewTagForm(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault();

    const normalizedUrl = normalizeUrl(url);
    if (!isValidUrl(normalizedUrl)) {
      setUrlError('Geçerli bir URL girin');
      urlInputRef.current?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        url: normalizedUrl,
        title: title || new URL(normalizedUrl).hostname,
        description,
        favicon: getFaviconUrl(normalizedUrl),
        tagIds: selectedTagIds,
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit();
  }

  const filteredTags = tags.filter((t) =>
    !tagSearch || t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: 0 }}>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
            {isEditing ? 'Linki Düzenle' : 'Yeni Link Ekle'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* URL */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
              URL *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={urlInputRef}
                className="input"
                style={{ paddingRight: isFetching ? 36 : 14, fontFamily: 'DM Mono, monospace', fontSize: 13 }}
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
                onBlur={handleUrlBlur}
                onPaste={handleUrlPaste}
              />
              {isFetching && (
                <div className="spinner" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14 }} />
              )}
            </div>
            {urlError && (
              <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{urlError}</p>
            )}
            {isFetching && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Sayfa başlığı alınıyor…</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Başlık
            </label>
            <input
              className="input"
              type="text"
              placeholder="Site başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Açıklama / Notlar
            </label>
            <textarea
              className="input"
              placeholder="Bu site hakkında not al…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Etiketler
            </label>

            {/* Tag search (if many tags) */}
            {tags.length > 8 && (
              <input
                className="input"
                style={{ marginBottom: 8, fontSize: 13 }}
                placeholder="Etiket ara…"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
              />
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {filteredTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    className="tag-badge"
                    style={{
                      background: isSelected ? tag.color + '30' : 'var(--surface2)',
                      color: isSelected ? tag.color : 'var(--text-secondary)',
                      border: isSelected ? `1px solid ${tag.color}50` : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                    {tag.name}
                  </button>
                );
              })}

              {/* New tag button */}
              {!showNewTagForm && (
                <button
                  className="tag-badge"
                  style={{
                    background: 'var(--surface2)',
                    color: 'var(--text-muted)',
                    border: '1px dashed var(--border-hover)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowNewTagForm(true)}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Yeni etiket
                </button>
              )}
            </div>

            {/* New tag form */}
            {showNewTagForm && (
              <div
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <input
                  className="input"
                  style={{ fontSize: 13 }}
                  placeholder="Etiket adı…"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleCreateTag(); }
                    if (e.key === 'Escape') setShowNewTagForm(false);
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-dot ${newTagColor === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setNewTagColor(color)}
                      type="button"
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowNewTagForm(false)}>
                    İptal
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                  >
                    Oluştur
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            <span className="kbd">⌘</span> <span className="kbd">↵</span> kaydet
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>
              Vazgeç
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!url || isSaving}
            >
              {isSaving ? (
                <span className="spinner" style={{ width: 14, height: 14 }} />
              ) : null}
              {isEditing ? 'Kaydet' : 'Ekle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
