# CV Analiz

PDF CV yükle, iki seçenekten birini seç:
1. **CV analizi**: özet, puan, güçlü yönler, eksikler, öneriler
2. **CV ve iş ilanı uyumu**: uyum puanı, eşleşen/eksik beceriler, öneriler

Backend: Node.js + Express. Analiz: OpenAI API (PDF doğrudan modele gönderilir).

## Kurulum
```bash
npm install
cp .env.example .env   # içine OPENAI_API_KEY yaz
npm start              # http://localhost:3000
```
> `.env` dosyasını asla GitHub'a yükleme (`.gitignore` bunu zaten engeller).
