import Dexie from 'dexie';

export const db = new Dexie('LinkPad');

db.version(1).stores({
  bookmarks: '++id, createdAt, isPinned, isArchived',
  tags: '++id, name, createdAt',
  settings: 'key',
});

// ─── Tag color palette ───────────────────────────────────────────────────────
export const TAG_COLORS = [
  '#e05555', // red
  '#e8834a', // orange (accent)
  '#d4a843', // amber
  '#6bcb77', // green
  '#4ec9c4', // teal
  '#45b7f5', // sky
  '#6b9ef5', // blue
  '#a29bfe', // lavender
  '#c084fc', // purple
  '#f78fb3', // pink
  '#c4a882', // warm tan
  '#8a7d6e', // warm gray
];

// ─── Seed / Initialize ───────────────────────────────────────────────────────
export async function initializeDB() {
  const tagCount = await db.tags.count();
  if (tagCount > 0) return; // Already initialized

  const now = Date.now();

  const tagIds = await db.tags.bulkAdd(
    [
      { name: 'tasarım', color: '#a29bfe', createdAt: now - 6000 },
      { name: 'geliştirme', color: '#6bcb77', createdAt: now - 5000 },
      { name: 'araçlar', color: '#45b7f5', createdAt: now - 4000 },
      { name: 'ilham', color: '#e8834a', createdAt: now - 3000 },
      { name: 'okuma', color: '#f78fb3', createdAt: now - 2000 },
    ],
    { allKeys: true }
  );

  const [design, dev, tools, inspo, reading] = tagIds;

  await db.bookmarks.bulkAdd([
    {
      url: 'https://dribbble.com',
      title: 'Dribbble — Design Portfolyoları',
      description: 'UI/UX tasarımcıların iş portfolyolarını keşfetmek için harika kaynak.',
      favicon: 'https://www.google.com/s2/favicons?domain=dribbble.com&sz=64',
      tagIds: [design, inspo],
      isPinned: true,
      isArchived: false,
      createdAt: now - 5 * 86400000,
      updatedAt: now - 5 * 86400000,
    },
    {
      url: 'https://github.com/sindresorhus/awesome',
      title: 'Awesome Lists — GitHub',
      description: 'Her konu için küratörlü listeler. Geliştirmeden tasarıma.',
      favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64',
      tagIds: [dev, tools],
      isPinned: false,
      isArchived: false,
      createdAt: now - 4 * 86400000,
      updatedAt: now - 4 * 86400000,
    },
    {
      url: 'https://www.figma.com',
      title: 'Figma — UI Tasarım Aracı',
      description: 'Tarayıcı tabanlı, işbirlikçi UI tasarım aracı.',
      favicon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=64',
      tagIds: [design, tools],
      isPinned: false,
      isArchived: false,
      createdAt: now - 3 * 86400000,
      updatedAt: now - 3 * 86400000,
    },
    {
      url: 'https://css-tricks.com',
      title: 'CSS-Tricks',
      description: 'CSS ve web geliştirme ipuçları, teknikler ve öğreticiler.',
      favicon: 'https://www.google.com/s2/favicons?domain=css-tricks.com&sz=64',
      tagIds: [dev, reading],
      isPinned: false,
      isArchived: false,
      createdAt: now - 2 * 86400000,
      updatedAt: now - 2 * 86400000,
    },
    {
      url: 'https://unsplash.com',
      title: 'Unsplash — Ücretsiz Fotoğraflar',
      description: 'Yüksek kaliteli ücretsiz fotoğraf kaynağı.',
      favicon: 'https://www.google.com/s2/favicons?domain=unsplash.com&sz=64',
      tagIds: [design, inspo],
      isPinned: false,
      isArchived: false,
      createdAt: now - 1 * 86400000,
      updatedAt: now - 1 * 86400000,
    },
  ]);
}
