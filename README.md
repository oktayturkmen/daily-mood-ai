# DailyMoodAI

React Native CLI ile geliştirilmiş, kullanıcıların günlük duygularını ve düşüncelerini AI ile analiz eden bir mobil uygulama.

## İçindekiler
- [📱 Özellikler](#-özellikler)
- [🛠️ Teknolojiler](#%EF%B8%8F-teknolojiler)
- [🎥 Demo](#-demo)
- [📋 Gereksinimler](#-gereksinimler)
- [🚀 Kurulum & Çalıştırma](#-kurulum--çalıştırma)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🤖 AI Modeli & API Servisi](#-ai-modeli--api-servisi)
- [📊 Veri Modeli](#-veri-modeli)
- [🧪 Test & 🐛 Sorun Giderme](#-test-etme--🐛-sorun-giderme)
- [Ek Bilgiler](#ek-bilgiler)

## 📱 Özellikler

- **Günlük Giriş**: Her gün kısa bir cümle veya mood yazın
- **AI Analizi**: Metinleriniz otomatik olarak analiz edilir:
  - Duygu analizi (Pozitif / Nötr / Negatif)
  - Kısa özet
  - Kişiselleştirilmiş öneriler
- **Geçmiş Takibi**: Tüm girişlerinizi görüntüleyin
- **Haftalık Özet**: Son 7 günün duygu dağılımını görün
- **Offline Çalışma**: Geçmiş verileriniz internet olmadan da görüntülenebilir
- **Lokal Depolama**: Tüm verileriniz cihazınızda güvenle saklanır

## 🛠️ Teknolojiler

- **React Native CLI** (JavaScript)
- **React Navigation** - Ekran geçişleri
- **Context API** - Global state yönetimi
- **AsyncStorage** - Lokal veri depolama
- **React Native Paper** - UI bileşenleri
- **Google Gemini API** - Sentiment analizi (ücretsiz endpoint, API key gerekli)
- **Hugging Face API** - Fallback sentiment analizi (ücretsiz endpoint)

## 🎥 Demo

- [Uygulama ekran kaydı (Google Drive)](https://drive.google.com/file/d/1JBQtspMQMhrRZDkNpOD-wXy-NostazhG/view?t=9)

## 📋 Gereksinimler

- Node.js >= 20.19.4
- React Native CLI
- Android Studio (Android için)
- Xcode (iOS için, sadece Mac)

## 🚀 Kurulum & Çalıştırma

### 0. Ortamı Hazırlayın
- [Node.js](https://nodejs.org/) ≥ 20.19.4
- Yarn (global)
- Android Studio + en az bir cihaz/emülatör, Android SDK 34, JDK 17
- (Opsiyonel) Watchman ve Java 17 ayarlı olması build sürelerini iyileştirir
- iOS (sadece macOS): Xcode 15+, CocoaPods (`sudo gem install cocoapods`)

### 1. Depoyu İndirin
```bash
git clone <repository-url>
cd daily-mood-al
```

### 2. Bağımlılıkları Kurun
```bash
yarn install
```

### 3. .env ve API Key
1. https://aistudio.google.com/app/apikey üzerinden Google Gemini API key alın
2. Proje kökünde `.env` dosyası oluşturun ve ekleyin:
   ```env
   GEMINI_API_KEY=AIzaSy... # kendi anahtarınız
   ```
3. `.env` dosyası `.gitignore` içinde tutulduğu için repoya gönderilmez. `.env.example` yoksa aynı formatta kendiniz oluşturabilirsiniz.

> API key eklenmezse uygulama fallback analizleriyle çalışmaya devam eder.

### 4. Metro Bundler'ı Başlatın
```bash
yarn start
```
Gerekirse `yarn start --reset-cache` komutuyla cache temizlenebilir.

### 5. Android'de Çalıştırın
```bash
yarn android
```
- Android emülatörünü önceden açın veya USB ile fiziksel cihaz bağlayın  
- Metro ile bağlantı sorunu yaşarsanız `adb reverse tcp:8081 tcp:8081` çalıştırın

### 6. iOS'ta Çalıştırın (Mac)
```bash
cd ios
pod install
cd ..
yarn ios
```


### 7. Hızlı Test
1. `yarn start` ve `yarn android/ios` oturumlarını açık tutun  
2. Daily Entry ekranında test bir metin yazıp “Analiz Et” butonuna basın  
3. `History` sekmesinde kaydın göründüğünü kontrol edin  
4. Debug menüsünden (`Ctrl+M`/`Cmd+D`) gerekirse cache temizleyin veya `Reload` seçin

## 📁 Proje Yapısı

```
DailyMoodAI/
├── src/
│   ├── components/          # Yeniden kullanılabilir bileşenler
│   │   ├── EntryCard.js
│   │   └── SentimentBadge.js
│   ├── constants/          # Sabitler
│   │   └── colors.js
│   ├── context/            # Context API
│   │   └── JournalContext.js
│   ├── hooks/              # Custom hooks
│   │   └── useJournal.js
│   ├── navigation/        # Navigasyon
│   │   └── RootNavigator.js
│   ├── screens/           # Ekranlar
│   │   ├── DailyEntryScreen.js
│   │   └── HistoryScreen.js
│   ├── services/          # Servisler
│   │   ├── aiService.js
│   │   └── storageService.js
│   └── utils/             # Yardımcı fonksiyonlar
│       └── sentimentUtils.js
├── App.tsx                # Ana uygulama dosyası
└── package.json
```

## 🤖 AI Modeli & API Servisi

AI katmanı üç seviyeden oluşur:

1. **Gemini Generative Language API (Google)**  
   - Modeller: `gemini-2.0-flash` (v1beta), ardından `gemini-pro`, `gemini-1.5-flash`, `gemini-1.5-pro` (v1)  
   - İstekler `https://generativelanguage.googleapis.com/{version}/models/<model>:generateContent` uçlarına POST edilir  
   - Header: `X-goog-api-key: <GEMINI_API_KEY>` (dotenv ile aktarılır)  
   - Yanıtlar JSON olarak parse edilir; model 403/404/429 dönerse sıradaki modele geçilir

2. **Hugging Face Inference API (Fallback 1)**  
   - Modeller: `cardiffnlp/twitter-roberta-base-sentiment-latest`, `distilbert-base-uncased-finetuned-sst-2-english`  
   - Kimlik doğrulama gerekmez; ücretsiz endpoint'ler kullanılır  
   - Dönen skorlar sıralanır ve en yüksek olasılıklı sentiment seçilir

3. **Yerel Heuristik Analiz (Fallback 2)**  
   - Pozitif/negatif Türkçe-İngilizce anahtar kelimeler  
   - Özet ve öneri metinleri lokalde üretilir  
   - İnternet veya API key olmadığında bile girişlerin analiz edilmesini sağlar

### API Key Yönetimi
- `.env` → `GEMINI_API_KEY=AIzaSy...`  
- Build sırasında `babel-plugin-inline-dotenv` ile JS tarafına enjekte edilir  
- `.env` git'e gönderilmez, sadece `.env.example` paylaşılırsa format rehberi olur  
- Key'i döngüsel olarak yenileyip Google Cloud konsolundan kotaları izleyebilirsiniz

### Yanıt Formatı
Gemini'den beklenen yanıt:
```json
{
  "sentiment": "positive | neutral | negative",
  "summary": "≤50 kelimelik özet",
  "suggestion": "Türkçe kişisel öneri"
}
```
Bu alanlar UI'da sırasıyla rozet rengi, kart özeti ve öneri bileşenlerinde kullanılır.

### Güvenlik ve Gizlilik
- Günlük metinleri yalnızca seçilen API'ye gönderilir, sunucuda saklanmaz  
- Cihazdaki veriler `AsyncStorage` içinde `JOURNAL_ENTRIES` anahtarı altında tutulur  
- Tam sıfırlama için debug konsolunda `await AsyncStorage.clear()` çalıştırabilirsiniz

## 📊 Veri Modeli

Her günlük girişi şu yapıda saklanır:

```javascript
{
  id: string,              // Benzersiz ID
  text: string,            // Kullanıcının yazdığı metin
  date: string,            // ISO tarih formatı
  sentiment: "positive" | "neutral" | "negative",
  summary: string,         // AI tarafından oluşturulan özet
  suggestion: string       // AI tarafından önerilen mesaj
}
```

## 🔒 Offline Çalışma

- Tüm veriler **AsyncStorage** ile cihazda saklanır
- Yeni analiz için internet gerekir (API key varsa)
- Geçmiş veriler internet olmadan görüntülenebilir
- Veriler cihazda kalıcı olarak saklanır

## 🎨 UI/UX

- **Karanlık Tema**: Göz yormayan karanlık arayüz
- **Sentiment Renkleri**: Her duygu durumu için özel renkler
  - Pozitif: 🟢 Yeşil
  - Nötr: ⚪ Gri
  - Negatif: 🔴 Kırmızı
- **Dinamik Arka Plan**: Son girişin sentiment'ine göre arka plan rengi değişir
- **Modern Tasarım**: React Native Paper ile modern ve kullanıcı dostu arayüz

## 📝 Mimari

Uygulama **Context API** ile global state yönetimi kullanır:

- `JournalContext`: Tüm entry'leri ve işlemleri yönetir
- `useJournal()`: Context'i kullanmak için custom hook
- `storageService`: AsyncStorage işlemleri
- `aiService`: AI analiz işlemleri (Gemini API + Fallback)

Detaylı mimari bilgisi için `ARCHITECTURE.md` dosyasına bakın.

## 🧪 Test Etme & 🐛 Sorun Giderme

**Hızlı Senaryo**
1. `yarn start`
2. `yarn android` veya `yarn ios`
3. Günlük giriş ekleyip “Analiz Et” butonuna basın
4. `History` sekmesinde kaydı doğrulayın

**Sık Sorular**
- **Metro açılmıyor:** `yarn start --reset-cache`
- **Android build hatası:** Android Studio'da SDK + NDK kurulu mu, `android/gradle.properties` güncel mi kontrol edin
- **iOS pod problemi:** `cd ios && pod install && cd ..`
- **API key hatası:** Key `AIzaSy` ile başlamalı; boşsa fallback çalışır fakat Gemini yanıtı alınmaz

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## Ek Bilgiler

<details>
<summary><strong>👨‍💻 Geliştirme Günlüğü</strong></summary>

- ✅ Proje kurulumu  
- ✅ Proje yapısı  
- ✅ Navigation  
- ✅ Context ve State yönetimi  
- ✅ Lokal depolama  
- ✅ AI servisi (Gemini API + Fallback)  
- ✅ UI/UX iyileştirmeleri  

> README’nin “Kurulum & Çalıştırma” ile “AI Modeli & API Servisi” bölümleri Cursor üzerinden GPT-5.1 Codex yardımıyla düzenlenmiştir; diğer kod ve içerikler manuel olarak hazırlanmıştır.

</details>

<details>
<summary><strong>🔮 Gelecek Özellikler</strong></summary>

- [ ] İstatistikler ve grafikler  
- [ ] Arama ve filtreleme  
- [ ] Export/Import özelliği  
- [ ] Bildirimler  
- [ ] Çoklu dil desteği  
- [ ] .env dosyası ile API key yönetimi  

</details>

---

**Not:** Bu uygulama React Native CLI ile geliştirilmiştir. Expo projesi değildir.  
**Önemli:** API key olmadan da uygulama çalışır; fallback mekanizması yerel sentiment analizi kullanır.
