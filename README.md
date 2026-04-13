# ✂️ Bilal Er Hair Workshop — Randevu Sistemi

Instagram üzerinden erişilebilen, mobil uyumlu online randevu sistemi.

🔗 **[Canlı Site](https://bilaler-randevu-app.vercel.app)** · 📸 **[@bilalerhairworkshop](https://instagram.com/bilalerhairworkshop)**

---

## Özellikler

### Müşteri Tarafı
- Hizmet seçimi ve fiyat görüntüleme
- Takvimden tarih, saat seçimi
- Öğle molası ve geçmiş saatler otomatik pasif
- Aynı saate çift randevu engeli
- Randevu sonrası mail bildirimi

### Admin Paneli
- PIN korumalı giriş (SHA-256 hash)
- Gerçek zamanlı randevu takibi
- Onay / Red / Silme işlemleri
- Müşteriye otomatik mail bildirimi

---

## Teknolojiler

| Teknoloji | Kullanım |
|-----------|----------|
| HTML / CSS / JS | Frontend (Vanilla SPA) |
| Firebase Firestore | Veritabanı & gerçek zamanlı sync |
| EmailJS | Mail bildirimleri |
| Vercel | Hosting & otomatik deploy |

---

## Hizmetler & Fiyatlar

| Hizmet | Fiyat |
|--------|-------|
| Saç | 400₺ |
| Sakal | 200₺ |
| Yıkama | 200₺ |
| Fön | 200₺ |
| Ağda | 200₺ |
| Kaş Tasarımı | 200₺ |
| Yüz Maskesi | 200₺ |
| Saç Maskesi | 200₺ |
| Detaylı Cilt Bakımı | 1000₺ |
| Çocuk | 300₺ |
| Damat Traşı | 3000₺ |

---

## Kurulum

```bash
git clone https://github.com/Atalaydurmaz/bilaler-randevu-app.git
```

`firebase-config.js` ve `emailjs-config.js` dosyalarını kendi API bilgilerinle doldur.

---

> Geliştirici: [@Atalaydurmaz](https://github.com/Atalaydurmaz)
