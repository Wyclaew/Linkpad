export default function EmptyState({ type = 'empty', onAdd, searchQuery, selectedTags }) {
  if (type === 'search') {
    return (
      <div className="empty-state" style={{ color: 'var(--text-secondary)' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="16" stroke="var(--border-hover)" strokeWidth="2.5"/>
          <path d="M40 40L52 52" stroke="var(--border-hover)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M23 28H33" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M28 23V33" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="font-medium" style={{ color: 'var(--text)' }}>
            "{searchQuery}" için sonuç bulunamadı
          </p>
          <p className="text-sm mt-1">Farklı anahtar kelimeler deneyin</p>
        </div>
      </div>
    );
  }

  if (type === 'filtered') {
    return (
      <div className="empty-state" style={{ color: 'var(--text-secondary)' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="16" width="40" height="6" rx="3" fill="var(--border-hover)"/>
          <rect x="18" y="28" width="28" height="6" rx="3" fill="var(--border)"/>
          <rect x="24" y="40" width="16" height="6" rx="3" fill="var(--surface2)"/>
        </svg>
        <div>
          <p className="font-medium" style={{ color: 'var(--text)' }}>
            Bu tag'e ait link yok
          </p>
          <p className="text-sm mt-1">Yeni link ekleyip bu tag'i atayabilirsiniz</p>
        </div>
        {onAdd && (
          <button className="btn btn-primary mt-2" onClick={onAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Link Ekle
          </button>
        )}
      </div>
    );
  }

  if (type === 'pinned') {
    return (
      <div className="empty-state" style={{ color: 'var(--text-secondary)' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 14 L44 14 L44 52 L32 44 L20 52 Z" stroke="var(--border-hover)" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        </svg>
        <div>
          <p className="font-medium" style={{ color: 'var(--text)' }}>Sabitlenmiş link yok</p>
          <p className="text-sm mt-1">Önemli linkleri sabitleyin, her zaman üstte görün</p>
        </div>
      </div>
    );
  }

  if (type === 'archived') {
    return (
      <div className="empty-state" style={{ color: 'var(--text-secondary)' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="44" height="34" rx="4" stroke="var(--border-hover)" strokeWidth="2.5" fill="none"/>
          <path d="M10 14h44" stroke="var(--border-hover)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M26 34h12" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="font-medium" style={{ color: 'var(--text)' }}>Arşiv boş</p>
          <p className="text-sm mt-1">Eski linkleri arşivleyerek buraya taşıyabilirsiniz</p>
        </div>
      </div>
    );
  }

  // Default: completely empty
  return (
    <div className="empty-state" style={{ color: 'var(--text-secondary)' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="10" width="52" height="64" rx="6" stroke="var(--border-hover)" strokeWidth="2.5" fill="none"/>
        <path d="M26 28h28" stroke="var(--border-hover)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 38h20" stroke="var(--border)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 48h14" stroke="var(--border)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="60" cy="62" r="12" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5"/>
        <path d="M60 57v10M55 62h10" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div>
        <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          İlk linkini ekle
        </p>
        <p className="text-sm mt-1" style={{ maxWidth: 280 }}>
          Instagram'da gördüğün siteleri, GitHub repolarını ya da herhangi bir linki tag'leyerek kaydet.
        </p>
      </div>
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Link Ekle
        </button>
      )}
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Klavye kısayolu: <span className="kbd">N</span>
      </p>
    </div>
  );
}
