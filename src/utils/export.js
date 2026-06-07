import { db } from '../db/index.js';

// ─── Export all data as JSON ──────────────────────────────────────────────────
export async function exportData() {
  const [bookmarks, tags] = await Promise.all([
    db.bookmarks.toArray(),
    db.tags.toArray(),
  ]);

  const exportObj = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'LinkPad',
    data: { bookmarks, tags },
  };

  const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `linkpad-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Import data from JSON file ───────────────────────────────────────────────
export async function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const obj = JSON.parse(e.target.result);

        if (obj.app !== 'LinkPad' || !obj.data) {
          reject(new Error('Geçersiz LinkPad yedek dosyası.'));
          return;
        }

        const { bookmarks, tags } = obj.data;

        // Build old→new ID map for tags
        const tagIdMap = {};

        for (const tag of tags) {
          const { id: oldId, ...tagData } = tag;
          const newId = await db.tags.add(tagData);
          tagIdMap[oldId] = newId;
        }

        // Import bookmarks, remapping tag IDs
        for (const bm of bookmarks) {
          const { id: _oldId, ...bmData } = bm;
          bmData.tagIds = (bmData.tagIds || [])
            .map((tid) => tagIdMap[tid])
            .filter(Boolean);
          await db.bookmarks.add(bmData);
        }

        resolve({ bookmarks: bookmarks.length, tags: tags.length });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsText(file);
  });
}
