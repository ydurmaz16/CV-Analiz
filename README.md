# CV Analiz

PDF formatındaki bir CV'yi yapay zekâ ile analiz eden web uygulaması. Kullanıcı önce ne yapmak istediğini seçer, ardından CV'sini yükler ve sonucu anında görür.

## Özellikler

- **CV analizi:** Genel özet, CV puanı, tahmini deneyim süresi, güçlü yönler, geliştirilecek alanlar, beceri listesi ve iyileştirme önerileri
- **CV ve iş ilanı uyumu:** Uyum puanı, ilanla eşleşen beceriler, ilanda istenip CV'de bulunmayan beceriler, avantajlı yönler ve başvurudan önce yapılacak somut düzenlemeler
- PDF'i sürükle-bırak veya dosya seçerek yükleme
- Açık ve koyu tema desteği (sistem ayarına göre otomatik)
- Mobil uyumlu arayüz
- Yüklenen dosya diske kaydedilmez, yalnızca bellekte işlenir

## Nasıl Çalışır

1. Kullanıcı "CV analizi" veya "CV ve iş ilanı uyumu" seçeneğinden birini seçer.
2. PDF formatındaki CV'yi yükler. Uyum analizinde iş ilanı metnini de yapıştırır.
3. Sunucu PDF'i base64'e çevirip OpenAI API'ye gönderir.
4. Model, istenen JSON şemasında bir yanıt döndürür.
5. Arayüz yanıtı puan, etiket ve listeler halinde gösterir.

## Teknolojiler

| Katman | Teknoloji |
| --- | --- |
| Sunucu | Node.js, Express |
| Dosya yükleme | Multer (bellek depolama) |
| Yapay zekâ | OpenAI API |
| Arayüz | HTML, CSS, JavaScript (framework yok) |

## Proje Yapısı

```
cv-analiz/
├── public/
│   └── index.html       # Arayüz (HTML, CSS ve JS tek dosyada)
├── server.js            # Express sunucusu ve analiz endpoint'i
├── package.json
├── .env.example         # Ortam değişkenleri şablonu
├── .gitignore
└── README.md
```

