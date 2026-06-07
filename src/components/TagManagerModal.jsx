import { useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { TAG_COLORS } from '../db/index.js';

function TagRow({ tag, count, onUpdate, onDelete, t }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const [confirm, setConfirm] = useState(false);

  if (editing) return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:14, display:'flex', flexDirection:'column', gap:10, animation:'scaleIn 0.15s ease' }}>
      <input className="input" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){onUpdate(tag.id,{name:name.trim(),color});setEditing(false)} if(e.key==='Escape')setEditing(false) }} autoFocus />
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {TAG_COLORS.map(c => <button key={c} className={`color-dot ${color===c?'selected':''}`} style={{background:c}} onClick={() => setColor(c)} />)}
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="btn btn-ghost" style={{flex:1}} onClick={() => setEditing(false)}>{t('cancel')}</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={() => { onUpdate(tag.id,{name:name.trim(),color}); setEditing(false); }}>{t('save')}</button>
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:10, background:'var(--surface)', border:'1px solid var(--border)' }}>
      <span style={{ width:12, height:12, borderRadius:'50%', background:tag.color, flexShrink:0, boxShadow:`0 0 6px ${tag.color}40` }} />
      <span style={{ flex:1, fontSize:14, fontWeight:600, color:'var(--text)' }}>{tag.name}</span>
      <span style={{ fontSize:12, color:'var(--text-muted)' }}>{count} {t('linkCount')}</span>
      {!confirm ? (
        <div style={{display:'flex',gap:4}}>
          <button className="btn-icon" style={{padding:4}} onClick={() => setEditing(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button className="btn-icon" style={{padding:4,color:'var(--danger)'}} onClick={() => setConfirm(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      ) : (
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:12,color:'var(--text-muted)'}}>{t('sureDelete')}</span>
          <button className="btn" style={{background:'var(--danger)',color:'#fff',padding:'4px 10px',fontSize:12}} onClick={() => onDelete(tag.id)}>{t('delete')}</button>
          <button className="btn btn-ghost" style={{padding:'4px 10px',fontSize:12}} onClick={() => setConfirm(false)}>{t('cancel')}</button>
        </div>
      )}
    </div>
  );
}

export default function TagManagerModal({ tags, bookmarks, onClose, onCreate, onUpdate, onDelete }) {
  const { t } = useI18n();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(TAG_COLORS[0]);
  const [creating, setCreating] = useState(false);

  const getCount = id => bookmarks.filter(b => !b.isArchived && b.tagIds?.includes(id)).length;

  async function handleCreate() {
    if (!newName.trim()) return;
    await onCreate({ name:newName.trim(), color:newColor });
    setNewName(''); setNewColor(TAG_COLORS[Math.floor(Math.random()*TAG_COLORS.length)]); setCreating(false);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} onKeyDown={e => e.key==='Escape'&&onClose()}>
        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:17, fontWeight:700, background:'var(--gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 }}>{t('tagManager')}</h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{ padding:'16px 24px', maxHeight:'50vh', overflowY:'auto' }}>
          {tags.length === 0 ? (
            <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:14, padding:'24px 0' }}>{t('noTags')}</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {tags.map(tag => <TagRow key={tag.id} tag={tag} count={getCount(tag.id)} onUpdate={onUpdate} onDelete={onDelete} t={t} />)}
            </div>
          )}
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)' }}>
          {!creating ? (
            <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', border:'1px dashed var(--border-hover)' }} onClick={() => setCreating(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              {t('addNewTag')}
            </button>
          ) : (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:14, display:'flex', flexDirection:'column', gap:10, animation:'slideUp 0.2s ease' }}>
              <input className="input" placeholder={t('tagNamePlaceholder')} value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter')handleCreate(); if(e.key==='Escape')setCreating(false) }} autoFocus />
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {TAG_COLORS.map(c => <button key={c} className={`color-dot ${newColor===c?'selected':''}`} style={{background:c}} onClick={() => setNewColor(c)} />)}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-ghost" style={{flex:1}} onClick={() => setCreating(false)}>{t('cancel')}</button>
                <button className="btn btn-primary" style={{flex:1}} onClick={handleCreate} disabled={!newName.trim()}>{t('create')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
