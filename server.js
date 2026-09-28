require("dotenv").config();
const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");

const app = express();
const client = new OpenAI(); // OPENAI_API_KEY'i .env'den okur
const MODEL = process.env.MODEL || "gpt-4o-mini";
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.use(express.static("public"));

const PROMPTS = {
  analysis: `Bu CV'yi bir insan kaynakları uzmanı gibi analiz et. SADECE geçerli JSON döndür (açıklama, markdown yok). Türkçe yaz. Şema:
{"ozet": "3-4 cümlelik genel özet", "puan": 0-100 arası sayı, "deneyim_yili": "tahmini toplam deneyim",
"guclu_yonler": ["..."], "gelistirilecek_alanlar": ["..."], "beceriler": ["..."], "oneriler": ["CV'yi iyileştirmek için somut öneriler"]}`,
  match: (job) => `Bu CV'yi aşağıdaki iş ilanıyla karşılaştır ve uyumu değerlendir. SADECE geçerli JSON döndür (açıklama, markdown yok). Türkçe yaz. Şema:
{"ozet": "uyum hakkında 3-4 cümle", "puan": 0-100 arası uyum puanı,
"eslesen_beceriler": ["ilanla eşleşen"], "eksik_beceriler": ["ilanda istenip CV'de olmayan"],
"guclu_yonler": ["bu ilan için avantajlar"], "oneriler": ["bu ilana başvurmadan önce CV'de yapılacak somut değişiklikler"]}
İŞ İLANI:
${job}`,
};

app.post("/api/analyze", upload.single("cv"), async (req, res) => {
  try {
    const mode = req.body.mode;
    const job = (req.body.job || "").trim();
    if (!req.file) return res.status(400).json({ error: "PDF dosyası yükleyin." });
    if (req.file.mimetype !== "application/pdf")
      return res.status(400).json({ error: "Sadece PDF dosyaları kabul edilir." });
    if (!["analysis", "match"].includes(mode)) return res.status(400).json({ error: "Geçersiz seçenek." });
    if (mode === "match" && job.length < 30)
      return res.status(400).json({ error: "İş ilanı metnini yapıştırın." });

    const prompt = mode === "match" ? PROMPTS.match(job.slice(0, 8000)) : PROMPTS.analysis;
    const b64 = req.file.buffer.toString("base64");
    const completion = await client.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: [
          { type: "file", file: { filename: req.file.originalname || "cv.pdf", file_data: `data:application/pdf;base64,${b64}` } },
          { type: "text", text: prompt },
        ],
      }],
    });

    const text = completion.choices[0].message.content || "";
    const json = JSON.parse(text.replace(/```json|```/g, "").trim());
    res.json({ mode, result: json });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analiz sırasında bir hata oluştu. Tekrar deneyin." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
