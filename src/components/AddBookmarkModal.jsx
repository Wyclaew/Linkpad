import { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '../i18n.jsx';
import { fetchUrlMetadata, getFaviconUrl, normalizeUrl, isValidUrl } from '../utils/url.js';
import { TAG_COLORS } from '../db/index.js';

export default function AddBookmarkModal({ bookmark, tags, onSave, onClose, onCreateTag }) {
  const { t } = useI18n();
  const isEditing = Boolean(bookmark);

  const [url, setUrl] = useState(bookmark?.url || '');
  const [title, setTitle] = useState(bookmark?.title || '');
  const [description, setDescription] = useState(bookmark?.description || '');
  const [selectedTagIds, setSelectedTagIds] = useState(bookmark?.tagIds || []);
  const [isFetching, setIsFetching] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[Math.floor(Math.random()*TAG_COLORS.length)]);
  const [isSaving, setIsSaving] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const urlRef = useRef(null);
  const abortRef = useRef(null);
  useEffect(() => { urlRef.current?.focus(); return () => abortRef.current?.abort(); }, []);

  const fetchMeta = useCallback(async (rawUrl) => {
    const n = normalizeUrl(rawUrl);
    if (!isValidUrl(n)) return;
    abortRef.current?.abort();
    const ctrl = new AbortController(); abortRef.current = ctrl;
    setIsFetching(true);
    try {
      const meta = await fetchUrlMetadata(n, ctrl.signal);
      if (meta?.title && !title) setTitle(meta.title);
      if (meta?.description && !description) setDescription(meta.description);
    } catch {} finally { setIsFetching(false); }
  }, [title, description]);

  function handleUrlBlur() {
    if (!url) return;
    const n = normalizeUrl(url); setUrl(n);
    if (!isValidUrl(n)) { setUrlError(t('invalidUrl')); }
    else { setUrlError(''); if (!title) fetchMeta(n); }
  }
  function handleUrlPaste(e) {
    const p = e.clipboardData.getData('text').trim();
    const n = normalizeUrl(p);
    if (isValidUrl(n)) setTimeout(() => { setUrl(n); setUrlError(''); if(!title) fetchMeta(n); }, 0);
  }
  function toggleTag(id) { setSelectedTagIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]); }
  async function handleCreateTag() {
    if (!newTagName.trim()) return;
    const tag = await onCreateTag({ name:newTagName.trim(), color:newTagColor });
    setSelectedTagIds(prev => [...prev, tag.id]);
    setNewTagName(''); setShowNewTag(false);
  }
  async function handleSubmit(e) {
    e?.preventDefault();
    const n = normalizeUrl(url);
    if (!isValidUrl(n)) { setUrlError(t('invalidUrl')); urlRef.current?.focus(); return; }
    setIsSaving(true);
    try {
      await onSave({ url:n, title: title || new URL(n).hostname, description, favicon: getFaviconUrl(n), tagIds: selectedTagIds });
    } finally { setIsSaving(false); }
  }

  const filtered = tags.filter(tg => !tagSearch || tg.name.toLowerCase().includes(tagSearch.toLowerCase()));

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={e => { if(e.key==='Escape') onClose(); if((e.metaKey||e.ctrlKey)&&e.key==='Enter') handleSubmit(); }}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{padding:0}}>
        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:17, fontWeight:700, background:'var(--gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 }}>
            {isEditing ? t('editTitle') : t('addTitle')}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:18 }}>
          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t('urlLabel')} *</label>
            <div style={{position:'relative'}}>
              <input ref={urlRef} className="input" style={{paddingRight:isFetching?36:14, fontFamily:'"JetBrains Mono",monospace', fontSize:13}}
                type="url" placeholder={t('urlPlaceholder')} value={url} onChange={e => { setUrl(e.target.value); setUrlError(''); }}
                onBlur={handleUrlBlur} onPaste={handleUrlPaste} />
              {isFetching && <div className="spinner" style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50)',width:14,height:14}}/>}
            </div>
            {urlError && <p style={{fontSize:12,color:'var(--danger)',marginTop:4}}>{urlError}</p>}
            {isFetching && <p style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{t('fetchingTitle')}</p>}
          </div>

          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t('titleLabel')}</label>
            <input className="input" placeholder={t('titlePlaceholder')} value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t('descLabel')}</label>
            <textarea className="input" placeholder={t('descPlaceholder')} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t('tagsLabel')}</label>
            {tags.length > 8 && <input className="input" style={{marginBottom:8,fontSize:13}} placeholder={t('tagSearchPlaceholder')} value={tagSearch} onChange={e => setTagSearch(e.target.value)} />}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
              {filtered.map(tag => {
                const sel = selectedTagIds.includes(tag.id);
                return (
                  <button key={tag.id} className="tag-badge" onClick={() => toggleTag(tag.id)} style={{
                    background: sel ? tag.color+'28' : 'var(--surface)', color: sel ? tag.color : 'var(--text-secondary)',
                    border: sel ? `1px solid ${tag.color}40` : '1px solid transparent', transition:'all 0.2s ease',
                  }}>
                    {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                    {tag.name}
                  </button>
                );
              })}
              {!showNewTag && (
                <button className="tag-badge" onClick={() => setShowNewTag(true)} style={{ background:'transparent', color:'var(--text-muted)', border:'1px dashed var(--border-hover)', cursor:'pointer' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  {t('newTag')}
                </button>
              )}
            </div>

            {showNewTag && (
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:14, display:'flex', flexDirection:'column', gap:10, animation:'scaleIn 0.15s ease' }}>
                <input className="input" style={{fontSize:13}} placeholder={t('tagNamePlaceholder')} value={newTagName} onChange={e => setNewTagName(e.target.value)}
                  onKeyDown={e => { if(e.key==='Enter'){e.preventDefault();handleCreateTag()} if(e.key==='Escape')setShowNewTag(false) }} autoFocus />
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {TAG_COLORS.map(c => <button key={c} className={`color-dot ${newTagColor===c?'selected':''}`} style={{background:c}} onClick={() => setNewTagColor(c)} type="button" />)}
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn btn-ghost" style={{flex:1}} onClick={() => setShowNewTag(false)}>{t('cancel')}</button>
                  <button className="btn btn-primary" style={{flex:1}} onClick={handleCreateTag} disabled={!newTagName.trim()}>{t('create')}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{fontSize:12,color:'var(--text-muted)'}}><span className="kbd">⌘</span> <span className="kbd">↵</span> {t('saveShortcut')}</span>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!url||isSaving}>
              {isSaving && <span className="spinner" style={{width:14,height:14}}/>}
              {isEditing ? t('save') : t('add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
