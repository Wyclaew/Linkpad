import { useState } from 'react';
import { TAG_COLORS } from '../db/index.js';

function TagRow({ tag, bookmarkCount, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    await onUpdate(tag.id, { name: name.trim(), color });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          animation: 'scaleIn 0.15s ease-out',
        }}
      >
        <input
          className="input"
          style={{ fontSize: 14 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TAG_COLORS.map((c) => (
            <button
              key={c}
              className={`color-dot ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>
            İptal
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>
            Kaydet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 8,
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: tag.color, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>
        {tag.name}
      </span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {bookmarkCount} link
      </span>

      {!showDeleteConfirm ? (
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn-icon" style={{ padding: '4px' }} onClick={() => setIsEditing(true)} title="Düzenle">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            className="btn-icon"
            style={{ padding: '4px', color: 'var(--danger)' }}
            onClick={() => setShowDeleteConfirm(true)}
            title="Sil"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Emin misin?</span>
          <button
            className="btn"
            style={{ background: 'var(--danger)', color: '#fff', padding: '4px 10px', fontSize: 12 }}
            onClick={() => onDelete(tag.id)}
          >
            Sil
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: '4px 10px', fontSize: 12 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            Vazgeç
          </button>
        </div>
      )}
    </div>
  );
}

export default function TagManagerModal({ tags, bookmarks, onClose, onCreate, onUpdate, onDelete }) {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(TAG_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  function getCount(tagId) {
    return bookmarks.filter((b) => !b.isArchived && b.tagIds?.includes(tagId)).length;
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    await onCreate({ name: newName.trim(), color: newColor });
    setNewName('');
    setNewColor(TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]);
    setIsCreating(false);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
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
            Etiket Yönetimi
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tag list */}
        <div style={{ padding: '16px 24px', maxHeight: '50vh', overflowY: 'auto' }}>
          {tags.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, padding: '24px 0' }}>
              Henüz etiket yok. Aşağıdan oluşturabilirsin.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tags.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  bookmarkCount={getCount(tag.id)}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* New tag section */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          {!isCreating ? (
            <button
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', border: '1px dashed var(--border-hover)' }}
              onClick={() => setIsCreating(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Yeni Etiket Ekle
            </button>
          ) : (
            <div
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                animation: 'slideUp 0.2s ease-out',
              }}
            >
              <input
                className="input"
                placeholder="Etiket adı…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    className={`color-dot ${newColor === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setNewColor(c)}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsCreating(false)}>
                  İptal
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                >
                  Oluştur
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
