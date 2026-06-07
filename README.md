# 🔖 LinkPad

**LinkPad**, Instagram'da, GitHub'da ya da herhangi bir yerde gördüğün linkleri kaybetmemek için tasarlanmış kişisel bir link yöneticisidir. Tag'leyerek kaydet, filtrele, anında bul.

> **iOS + Windows + macOS + Android** üzerinde çalışır — kurulum gerektirmez, tüm veriler **cihazında** saklanır.

---

## ✨ Özellikler

| | |
|---|---|
| 🏷️ **Tag sistemi** | Her linke birden fazla renkli etiket ekle |
| 🔍 **Anlık arama** | Başlık, URL ve açıklamada aynı anda ara |
| 🎛️ **Filtrele** | Tek tıkla tag'e göre filtrele, birden fazla tag seç |
| 📌 **Sabitle** | Önemli linkleri üstte sabitle |
| 🗂️ **Arşiv** | Eski linkleri arşivle, silme |
| 🌗 **Tema** | Koyu / Açık tema desteği |
| ⚡ **PWA** | iOS'ta Ana Ekrana Ekle, Windows/Mac'te uygulama olarak kur |
| 💾 **Yerel depolama** | Tüm veriler IndexedDB'de, cihazında saklı |
| 📤 **Dışa / İçe Aktar** | JSON yedekleme ve geri yükleme |
| 🤖 **Başlık otomatik çek** | URL yapıştırınca sayfa başlığını otomatik getirir |
| ⌨️ **Klavye kısayolları** | Hızlı kullanım için kısayollar |

---

## 📸 Ekran Görüntüleri

> *Uygulamayı kurduktan sonra buraya ekran görüntüsü ekleyebilirsin.*

---

## ⌨️ Klavye Kısayolları

| Kısayol | Eylem |
|---|---|
| `N` | Yeni link ekle |
| `/` veya `Ctrl+K` | Aramaya odaklan |
| `Esc` | Filtre / aramayı temizle, modal kapat |
| `Ctrl+Enter` | Modal'da formu kaydet |

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler
- [Node.js](https://nodejs.org/) v18 veya üzeri
- npm (Node.js ile gelir)

### Yerel Geliştirme

```bash
# 1. Repoyu klonla
git clone https://github.com/KULLANICI_ADIN/linkpad.git
cd linkpad

# 2. Bağımlılıkları kur
npm install

# 3. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcında `http://localhost:5173` adresine git.

### Production Build

```bash
npm run build
# dist/ klasörü oluşur, istediğin statik sunucuya at
```

---

## 🌐 GitHub Pages'e Deploy

> Push ettiğinde otomatik olarak deploy edilir. Bir kez ayarla, unut.

### Adım 1 — Repo adını `vite.config.js`'de güncelle

```js
// vite.config.js
export default defineConfig({
  base: '/REPO_ADIN/', // ← kendi repo adını yaz
  // ...
})
```

### Adım 2 — GitHub'da Pages'i aktif et

1. Repo → **Settings** → **Pages**
2. **Source**: `GitHub Actions` seç
3. **Save** tıkla

### Adım 3 — Main branch'e push et

```bash
git add .
git commit -m "init linkpad"
git push origin main
```

Actions sekmesinden deploy sürecini izleyebilirsin. 2-3 dakika içinde `https://KULLANICI_ADIN.github.io/REPO_ADIN/` adresinde yayında olur.

---

## 📱 iOS'ta Uygulama Olarak Kullan (PWA)

1. **Safari**'de uygulama adresini aç
2. Alttaki **Paylaş** butonuna dokun (📤)
3. **"Ana Ekrana Ekle"** seç
4. Artık iPhone'unda tam ekran uygulama gibi açılır ✅

> **Not:** iOS'ta yerel depolama Safari'ye bağlıdır. Safari'nin "Site Verilerini Sil" seçeneğini kullanırsan veriler silinir — düzenli JSON yedek al!

---

## 💻 Windows'ta Uygulama Olarak Kur (PWA)

### Chrome / Edge ile:
1. Uygulamayı Chrome veya Edge'de aç
2. Adres çubuğunun sağındaki **"Uygulamayı Yükle"** ikonuna tıkla (⊕)
3. Ya da: `⋮` menü → **Uygulamalar** → **Bu siteyi uygulama olarak yükle**
4. Masaüstü ve Başlat Menüsü'ne kısayol eklenir ✅

---

## 💾 Veri Yedekleme

Veriler tarayıcının IndexedDB'sinde saklanır. Yedek almak için:

1. **Sağ üst köşe** → `⋮` menü → **Dışa Aktar (JSON)**
2. `linkpad-backup-YYYY-MM-DD.json` dosyası indirilir

Geri yüklemek için:
1. `⋮` menü → **İçe Aktar (JSON)**
2. Yedek dosyayı seç

> ⚠️ İçe aktarma mevcut verilerin **üzerine ekler**, silmez.

---

## 🛠️ Tech Stack

| | |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| **Stil** | [Tailwind CSS 3](https://tailwindcss.com/) + özel CSS değişkenleri |
| **Veritabanı** | [Dexie.js](https://dexie.org/) (IndexedDB wrapper) |
| **İkonlar** | [Lucide](https://lucide.dev/) + inline SVG |
| **PWA** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + Workbox |
| **CI/CD** | GitHub Actions → GitHub Pages |
| **Font** | Plus Jakarta Sans + DM Mono (Google Fonts) |

---

## 📁 Proje Yapısı

```
linkpad/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Otomatik GitHub Pages deploy
├── public/
│   ├── favicon.svg
│   ├── icon-192.png          # PWA ikonu
│   └── icon-512.png          # PWA ikonu
├── src/
│   ├── components/
│   │   ├── AddBookmarkModal.jsx   # Link ekleme/düzenleme modalı
│   │   ├── BookmarkCard.jsx       # Kart ve liste görünümü
│   │   ├── ConfirmDialog.jsx      # Silme onay dialogu
│   │   ├── EmptyState.jsx         # Boş durum görselleri
│   │   ├── Header.jsx             # Üst bar (arama, sıralama, tema)
│   │   ├── Sidebar.jsx            # Sol panel (tag filtreler)
│   │   ├── TagManagerModal.jsx    # Tag yönetimi
│   │   └── Toast.jsx              # Bildirimler
│   ├── db/
│   │   └── index.js              # Dexie veritabanı şeması
│   ├── utils/
│   │   ├── export.js             # JSON export/import
│   │   └── url.js                # URL yardımcıları, metadata çekme
│   ├── App.jsx                   # Ana bileşen, tüm state
│   ├── index.css                 # Global stiller, CSS değişkenleri
│   └── main.jsx                  # React giriş noktası
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🤝 Katkı

Pull request açabilirsin. Büyük değişiklikler için önce bir issue aç.

---

## 📄 Lisans

[MIT](./LICENSE) — İstediğin gibi kullan, değiştir, dağıt.
