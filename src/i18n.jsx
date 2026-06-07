import { createContext, useContext, useState, useCallback } from 'react';

const tr = {
  // Nav
  allLinks: 'Tüm Linkler',
  pinned: 'Sabitlendi',
  archived: 'Arşiv',
  tags: 'Etiketler',
  manageTags: 'Etiket Yönet',
  newLink: 'Yeni Link',
  linkCount: 'link',
  tagCount: 'etiket',
  
  // Header
  searchPlaceholder: 'Link, başlık veya açıklamada ara…',
  newest: 'En yeni',
  oldest: 'En eski',
  alphaSort: 'A → Z',
  gridView: 'Kart görünümü',
  listView: 'Liste görünümü',
  lightTheme: 'Açık Tema',
  darkTheme: 'Koyu Tema',
  exportJSON: 'Dışa Aktar (JSON)',
  importJSON: 'İçe Aktar (JSON)',
  add: 'Ekle',
  language: 'English',
  
  // Card
  edit: 'Düzenle',
  open: 'Aç',
  copyUrl: 'URL Kopyala',
  archive: 'Arşivle',
  unarchive: 'Arşivden Çıkar',
  delete: 'Sil',
  pin: 'Sabitle',
  unpin: 'Sabitlemeyi Kaldır',
  
  // Add modal
  addTitle: 'Yeni Link Ekle',
  editTitle: 'Linki Düzenle',
  urlLabel: 'URL',
  titleLabel: 'Başlık',
  descLabel: 'Açıklama / Notlar',
  tagsLabel: 'Etiketler',
  urlPlaceholder: 'https://...',
  titlePlaceholder: 'Site başlığı',
  descPlaceholder: 'Bu site hakkında not al…',
  tagSearchPlaceholder: 'Etiket ara…',
  newTag: 'Yeni etiket',
  tagNamePlaceholder: 'Etiket adı…',
  create: 'Oluştur',
  cancel: 'Vazgeç',
  save: 'Kaydet',
  fetchingTitle: 'Sayfa başlığı alınıyor…',
  invalidUrl: 'Geçerli bir URL girin',
  saveShortcut: 'kaydet',
  
  // Tag manager
  tagManager: 'Etiket Yönetimi',
  noTags: 'Henüz etiket yok. Aşağıdan oluşturabilirsin.',
  addNewTag: 'Yeni Etiket Ekle',
  sureDelete: 'Emin misin?',
  
  // Confirm
  deleteLink: 'Linki sil',
  deleteMsg: 'silinecek. Bu işlem geri alınamaz.',
  yesDelete: 'Evet, Sil',
  
  // Empty states
  noResults: 'için sonuç bulunamadı',
  tryDifferent: 'Farklı anahtar kelimeler deneyin',
  noLinksTag: 'Bu tag\'e ait link yok',
  addLinkForTag: 'Yeni link ekleyip bu tag\'i atayabilirsiniz',
  noPinned: 'Sabitlenmiş link yok',
  pinDesc: 'Önemli linkleri sabitleyin, her zaman üstte görün',
  emptyArchive: 'Arşiv boş',
  archiveDesc: 'Eski linkleri arşivleyerek buraya taşıyabilirsiniz',
  firstLink: 'İlk linkini ekle',
  firstLinkDesc: 'Instagram\'da gördüğün siteleri, GitHub repolarını ya da herhangi bir linki tag\'leyerek kaydet.',
  shortcutHint: 'Klavye kısayolu:',
  
  // Toasts
  linkAdded: 'Link eklendi ✓',
  linkUpdated: 'Link güncellendi ✓',
  linkDeleted: 'Link silindi',
  pinnedToast: 'Sabitlendi 📌',
  unpinnedToast: 'Sabitleme kaldırıldı',
  archivedToast: 'Arşivlendi',
  unarchivedToast: 'Arşivden çıkarıldı',
  tagDeleted: 'Etiket silindi',
  importSuccess: 'link ve etiket içe aktarıldı ✓',
  importFail: 'İçe aktarma başarısız',
  loadFail: 'Veriler yüklenemedi',
  urlCopied: 'URL kopyalandı ✓',
  
  // Time
  justNow: 'az önce',
  minAgo: 'd önce',
  hourAgo: 's önce',
  dayAgo: 'g önce',
  weekAgo: 'h önce',
  monthAgo: 'ay önce',
  yearAgo: 'y önce',
  
  // Demo
  demoDesign: 'tasarım',
  demoDev: 'geliştirme',
  demoTools: 'araçlar',
  demoInspo: 'ilham',
  demoReading: 'okuma',
};

const en = {
  allLinks: 'All Links',
  pinned: 'Pinned',
  archived: 'Archive',
  tags: 'Tags',
  manageTags: 'Manage Tags',
  newLink: 'New Link',
  linkCount: 'links',
  tagCount: 'tags',
  
  searchPlaceholder: 'Search links, titles, descriptions…',
  newest: 'Newest',
  oldest: 'Oldest',
  alphaSort: 'A → Z',
  gridView: 'Grid view',
  listView: 'List view',
  lightTheme: 'Light Theme',
  darkTheme: 'Dark Theme',
  exportJSON: 'Export (JSON)',
  importJSON: 'Import (JSON)',
  add: 'Add',
  language: 'Türkçe',
  
  edit: 'Edit',
  open: 'Open',
  copyUrl: 'Copy URL',
  archive: 'Archive',
  unarchive: 'Unarchive',
  delete: 'Delete',
  pin: 'Pin',
  unpin: 'Unpin',
  
  addTitle: 'Add New Link',
  editTitle: 'Edit Link',
  urlLabel: 'URL',
  titleLabel: 'Title',
  descLabel: 'Description / Notes',
  tagsLabel: 'Tags',
  urlPlaceholder: 'https://...',
  titlePlaceholder: 'Site title',
  descPlaceholder: 'Write a note about this site…',
  tagSearchPlaceholder: 'Search tags…',
  newTag: 'New tag',
  tagNamePlaceholder: 'Tag name…',
  create: 'Create',
  cancel: 'Cancel',
  save: 'Save',
  fetchingTitle: 'Fetching page title…',
  invalidUrl: 'Enter a valid URL',
  saveShortcut: 'save',
  
  tagManager: 'Tag Manager',
  noTags: 'No tags yet. Create one below.',
  addNewTag: 'Add New Tag',
  sureDelete: 'Are you sure?',
  
  deleteLink: 'Delete link',
  deleteMsg: 'will be deleted. This cannot be undone.',
  yesDelete: 'Yes, Delete',
  
  noResults: 'no results found',
  tryDifferent: 'Try different keywords',
  noLinksTag: 'No links with this tag',
  addLinkForTag: 'Add a new link and assign this tag',
  noPinned: 'No pinned links',
  pinDesc: 'Pin important links to keep them on top',
  emptyArchive: 'Archive is empty',
  archiveDesc: 'Move old links here by archiving them',
  firstLink: 'Add your first link',
  firstLinkDesc: 'Save websites you find on Instagram, GitHub repos, or any link — organized with tags.',
  shortcutHint: 'Shortcut:',
  
  linkAdded: 'Link added ✓',
  linkUpdated: 'Link updated ✓',
  linkDeleted: 'Link deleted',
  pinnedToast: 'Pinned 📌',
  unpinnedToast: 'Unpinned',
  archivedToast: 'Archived',
  unarchivedToast: 'Unarchived',
  tagDeleted: 'Tag deleted',
  importSuccess: 'links & tags imported ✓',
  importFail: 'Import failed',
  loadFail: 'Failed to load data',
  urlCopied: 'URL copied ✓',
  
  justNow: 'just now',
  minAgo: 'm ago',
  hourAgo: 'h ago',
  dayAgo: 'd ago',
  weekAgo: 'w ago',
  monthAgo: 'mo ago',
  yearAgo: 'y ago',
  
  demoDesign: 'design',
  demoDev: 'development',
  demoTools: 'tools',
  demoInspo: 'inspiration',
  demoReading: 'reading',
};

const langs = { tr, en };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lp_lang');
    if (saved) return saved;
    return navigator.language.startsWith('tr') ? 'tr' : 'en';
  });

  const t = useCallback((key) => langs[lang]?.[key] || langs.en[key] || key, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'tr' ? 'en' : 'tr';
      localStorage.setItem('lp_lang', next);
      return next;
    });
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function timeAgo(timestamp, t) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return t('justNow');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}${t('minAgo')}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}${t('hourAgo')}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}${t('dayAgo')}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}${t('weekAgo')}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}${t('monthAgo')}`;
  return `${Math.floor(months / 12)}${t('yearAgo')}`;
}
