# Lion Dental Art Studio — Proje Durumu

> Saf HTML/CSS/JS premium B2B diş protez laboratuvarı vitrini.
> Build adımı yok. sahinkuruhan.com portfolyosunda sergilenir.

## Marka Kimliği (SABİT)
- **Renkler:** inci `#F8F6F0`, lacivert `#1A2744`, antrasit `#2C3040`, altın `#C9A96E`
- **Fontlar:** Cormorant Garamond (başlık), Inter (gövde), Playfair Display (display)
- **İletişim:** WhatsApp/Tel `+90 531 221 25 89` · Şehit Fethi Cad. No:102, Pendik, İstanbul
- **Instagram:** @liondentalart

## Mimari
```
lion-dental/
├── index.html              # Tek sayfa; data-tr/data-en dil sistemi
├── assets/
│   ├── favicon.svg         # Altın taç monogramı (lacivert zemin)
│   ├── og-image.svg        # OG kaynak (1200×630)
│   └── og-image.png        # OG raster (sosyal paylaşım)
├── css/
│   ├── main.css            # Token'lar, reset, global, focus, skip-link, ritim
│   ├── components.css      # Nav, hero, why, services, workflow, gallery,
│   │                       #   lightbox, contact, map, footer, WhatsApp float
│   └── animations.css      # Keyframe + scroll-reveal (prefers-reduced-motion)
└── js/
    ├── language.js         # TR/EN: textContent + aria-label + img alt + event
    ├── animations.js       # IntersectionObserver scroll-reveal
    ├── gallery.js          # Lightbox (klavye, focus-trap, kırık görsel fallback)
    └── main.js             # Nav scroll, mobil menü (inert + focus-trap), smooth scroll
```

## Son Yapılan: redesign/visual-refresh (Yön B — Cesur/Sanatsal)
Editoryal "Art Studio" refresh; marka renk/font kimliği korunarak.

### Tasarım
- **Hero:** atölye "arch" (kemerli niş) kompozisyonu + altın gem + "L" serif filigran;
  daha dramatik display tipografi, altın "gilded" ayraç (`.hero__rule`).
- **Editoryal imza:** bölüm eyebrow'larında altın hairline ayraçlar; hizmet
  kartlarında katalog indeks hairline'ı; masaüstünde bölüm ritmi (`--space-2xl`).
- **Galeri:** "galeri duvarı" — çerçeveli `<img>` (lazy + boyut → düşük CLS),
  her zaman okunur etiket; lightbox (klavye Esc/oklar, focus-trap, odak iadesi,
  kırık görsel için marka gradyan fallback).

### Backlog tamamlananlar
- ✅ Favicon (SVG) + apple-touch-icon
- ✅ OG görseli (PNG, 1200×630) + Twitter card + canonical + hreflang + theme-color
- ✅ WhatsApp floating buton (mobil öncelikli, çift dil aria, reduced-motion)
- ✅ #contact Google Maps embed (adres aramalı, API key'siz, lazy)
- ✅ `Dentist` JSON-LD structured data

### Erişilebilirlik (WCAG 2.1 AA)
- Skip-link, tutarlı `:focus-visible` halkaları (koyu zeminde açık altın)
- Mobil menü: kapalıyken `inert`, açıkken focus-trap; hamburger aria-label TR/EN aç/kapa
- Koyu bölüm kontrast artışları (workflow/contact/footer metinleri AA)
- Galeri öğeleri `<button>` (klavyeyle açılır, erişilebilir ad)

### Düzeltmeler
- `scroll-pulse` keyframe'indeki çift `0%` tanımı giderildi (+ `transform-origin`)
- Tekrarlanan/kırık galeri stok URL'leri çalışan görsellerle değiştirildi
- Google Fonts: kullanılmayan Inter 300 ağırlığı kaldırıldı

## Doğrulama
- Konsol: **0 hata / 0 uyarı**
- Lightbox aç/kapa/klavye/odak ✓ · Mobil menü inert+trap ✓ · TR/EN (metin+alt+aria) ✓
- 390px mobil + 1280px masaüstü düzen ✓ · Tüm iletişim verileri ve linkler ✓

## Sıradaki / Backlog
- Gerçek laboratuvar/çalışma fotoğraflarını galeriye yerleştir (şu an stok)
- Maps için tam Google Business yer linki (en doğru pin)
- İsteğe bağlı: testimonial / güvenen klinik logoları bölümü
