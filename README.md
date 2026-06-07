<div align="center">

# 🔖 LinkPad

**Kişisel link yöneticisi — kaydet, tag'le, filtrele, bul.**

Instagram'da, GitHub'da ya da herhangi bir yerde gördüğün linkleri kaybetmemek için tasarlandı.

**[🌐 Web Demo](#)** · **[📦 Desktop İndir](#-masaüstü-uygulaması)** · **[📱 iOS Kur](#-iosta-pwa-olarak-kur)**

---

</div>

## ✨ Özellikler

**Temel** — Link ekle, düzenle, sil · Renkli etiketlerle kategorize et · Tek tıkla filtrele · Anlık arama · Sabitle / Arşivle · Grid & Liste görünümü

**Tasarım** — Glass morphism arayüz · Gradient vurgular · Animasyonlu kartlar · Koyu / Açık tema · Responsive (mobil uyumlu)

**Teknik** — 🌍 Türkçe / English dil desteği · 💾 Local veritabanı (IndexedDB) · 📤 JSON yedekleme · ⚡ PWA (offline çalışır) · 🖥️ Electron masaüstü uygulaması · ⌨️ Klavye kısayolları

---

## 🖥️ Masaüstü Uygulaması

### Windows (.exe)

```bash
# Repoyu klonla
git clone https://github.com/KULLANICI_ADIN/linkpad.git
cd linkpad

# Bağımlılıkları kur
npm install

# Windows .exe oluştur
npm run electron:build:win
```

`release/` klasöründe `LinkPad Setup.exe` dosyasını bulacaksın. Çift tıkla, kur, kullan.

### macOS (.dmg)

```bash
npm run electron:build:mac
```

### Geliştirme Modu

```bash
# 1. Web'i çalıştır
npm run dev

# 2. Başka bir terminalde Electron'u başlat
npm run electron:dev
```

---

## 📱 iOS'ta PWA Olarak Kur

1. **Safari**'de web adresini aç (GitHub Pages veya kendi sunucun)
2. Alttaki **Paylaş** butonuna dokun (📤)
3. **"Ana Ekrana Ekle"** seç
4. Tam ekran uygulama olarak açılır ✅

---

## 🌐 GitHub Pages'e Deploy

### 1. `vite.config.js`'de repo adını güncelle

```js
base: process.env.BASE_URL || '/REPO_ADIN/',
```

### 2. GitHub Pages'i aktif et

Repo → **Settings** → **Pages** → Source: **GitHub Actions** → **Save**

### 3. Push et

```bash
git add . && git commit -m "deploy" && git push origin main
```

2-3 dakika içinde `https://KULLANICI_ADIN.github.io/REPO_ADIN/` adresinde yayında.

---

## ⌨️ Klavye Kısayolları

| Kısayol | Eylem |
|---|---|
| `N` | Yeni link ekle |
| `/` veya `Ctrl+K` | Aramaya odaklan |
| `Esc` | Filtre / aramayı temizle |
| `Ctrl+Enter` | Formu kaydet |

---

## 🌍 Dil Desteği

Tarayıcı dili otomatik algılanır. Sağ üst menüden (⋮) **English** / **Türkçe** arası geçiş yapabilirsin.

---

## 💾 Veri Yedekleme

Tüm veriler cihazında saklanır (IndexedDB). Yedek almak için:

1. Sağ üst → ⋮ → **Dışa Aktar (JSON)**
2. `linkpad-backup-YYYY-MM-DD.json` indirilir

Geri yüklemek: ⋮ → **İçe Aktar (JSON)** → dosyayı seç

> İçe aktarma mevcut verilerin üzerine ekler, silmez.

---

## 🛠️ Tech Stack

| | |
|---|---|
| **UI** | React 18 + Vite 5 |
| **Stil** | Tailwind CSS + Glass Morphism |
| **DB** | Dexie.js (IndexedDB) |
| **Desktop** | Electron |
| **PWA** | vite-plugin-pwa + Workbox |
| **CI/CD** | GitHub Actions → GitHub Pages |
| **Font** | Outfit + JetBrains Mono |
| **i18n** | React Context (TR / EN) |

---

## 📁 Proje Yapısı

```
linkpad/
├── electron/
│   ├── main.cjs            # Electron ana süreç
│   └── preload.cjs          # Electron preload
├── src/
│   ├── components/
│   │   ├── AddBookmarkModal.jsx
│   │   ├── BookmarkCard.jsx   # Kart + Liste + Dropdown
│   │   ├── ConfirmDialog.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TagManagerModal.jsx
│   │   └── Toast.jsx
│   ├── db/index.js            # Dexie veritabanı
│   ├── utils/
│   │   ├── export.js          # JSON import/export
│   │   └── url.js             # URL helpers
│   ├── i18n.jsx               # Türkçe / English
│   ├── App.jsx
│   ├── index.css              # Glass design system
│   └── main.jsx
├── .github/workflows/deploy.yml
├── electron-builder.json      # Electron build config
├── package.json
└── README.md
```

---

## 📄 Lisans

[MIT](./LICENSE)
