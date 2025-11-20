/**
 * AI servisi - Google Gemini API sentiment analizi
 */

// Google Gemini API
// API Key: https://aistudio.google.com/app/apikey adresinden alabilirsiniz
// ÖNEMLİ: API key'inizi .env dosyasına ekleyin!
// API key olmadan da uygulama çalışır (fallback mekanizması devreye girer)

// .env dosyasından oku (babel-plugin-inline-dotenv ile)
let GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';


// Not: API key header'da gönderilmeli (X-goog-api-key), query parameter değil!
// v1beta'da sadece gemini-2.0-flash çalışıyor, diğerleri v1'de
const GEMINI_MODELS_V1BETA = [
  'gemini-2.0-flash',     
];

const GEMINI_MODELS_V1 = [
  'gemini-pro',           
  'gemini-1.5-flash',     
  'gemini-1.5-pro',       
];

const getGeminiApiConfigs = () => {
  if (!GEMINI_API_KEY) {
    return [];
  }
  
  // API key formatını kontrol et
  if (!GEMINI_API_KEY.startsWith('AIza')) {
    console.warn('Gemini API key formatı yanlış görünüyor. AIza ile başlamalı.');
  }
  
  // API key header'da gönderilecek
  const configs = [];
  
  // Önce v1beta'daki modelleri dene (gemini-2.0-flash)
  for (const model of GEMINI_MODELS_V1BETA) {
    configs.push({
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      model: model,
      version: 'v1beta'
    });
  }
  
  // Sonra v1 sürümündeki modelleri dene
  for (const model of GEMINI_MODELS_V1) {
    configs.push({
      url: `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
      model: model,
      version: 'v1'
    });
  }
  
  return configs;
};

// Fallback için Hugging Face endpoint'leri (opsiyonel)
const HUGGING_FACE_API_URLS = [
  'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
  'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
];

/**
 * Metni analiz eder ve sentiment, özet, öneri döndürür
 * 
 * @param {string} text - Analiz edilecek metin
 * @returns {Promise<{sentiment: string, summary: string, suggestion: string}>}
 */
export const analyzeText = async (text) => {
  // Önce Gemini API'yi dene - farklı modelleri dene
  const geminiConfigs = getGeminiApiConfigs();
  if (geminiConfigs.length > 0) {
    for (const config of geminiConfigs) {
      try {
        const prompt = `Aşağıdaki metni analiz et ve JSON formatında yanıt ver. Metin Türkçe veya İngilizce olabilir.

Metin: "${text}"

Lütfen şu formatta JSON yanıt ver:
{
  "sentiment": "positive" veya "negative" veya "neutral",
  "summary": "Metnin kısa özeti (maksimum 50 kelime)",
  "suggestion": "Kullanıcıya duygu durumuna göre kısa bir öneri (Türkçe)"
}

Sadece JSON yanıt ver, başka açıklama yapma.`;

        const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,  // API key header'da gönderiliyor!
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || response.statusText;
        
        // 404 veya 403 hatası - bir sonraki modeli dene
        if (response.status === 404 || response.status === 403) {
          console.warn(`Gemini model ${config.model} (${config.version}) not available (${response.status}): ${errorMsg}`);
          continue; // Bir sonraki modeli dene
        }
        
        // 429 Rate limit hatası - bir sonraki modeli dene (veya fallback'e geç)
        if (response.status === 429) {
          console.warn(`Gemini model ${config.model} (${config.version}) rate limit (429): ${errorMsg}`);
          continue; // Bir sonraki modeli dene
        }
        
        // Diğer hatalar için detaylı log
        console.error('Gemini API error details:', {
          model: config.model,
          version: config.version,
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Gemini API error: ${response.status} - ${errorMsg}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Gemini API error');
      }

      // Gemini yanıtını parse et
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // JSON'u extract et (markdown code block içinde olabilir)
      let jsonText = responseText.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }
      
      // JSON'u parse et
      const result = JSON.parse(jsonText);
      
      // Sentiment'i normalize et
      let sentiment = 'neutral';
      const sentimentLower = (result.sentiment || '').toLowerCase();
      if (sentimentLower.includes('positive') || sentimentLower.includes('pozitif')) {
        sentiment = 'positive';
      } else if (sentimentLower.includes('negative') || sentimentLower.includes('negatif')) {
        sentiment = 'negative';
      }

        return {
          sentiment,
          summary: result.summary || text.substring(0, 50) + '...',
          suggestion: result.suggestion || 'Bugününüzü değerlendirin ve kendinize iyi bakın.',
        };
      } catch (error) {
        // Bu model başarısız oldu, bir sonraki modeli dene
        console.warn(`Gemini model ${config.model} (${config.version}) failed: ${error.message}`);
        continue;
      }
    }
    // Tüm Gemini modelleri başarısız oldu
    console.warn('All Gemini models failed, trying fallback');
  }

  // Gemini yoksa veya başarısız olduysa Hugging Face'i dene
  for (const apiUrl of HUGGING_FACE_API_URLS) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
        }),
      });

      if (!response.ok) {
        if (response.status === 410 || response.status >= 500) {
          continue;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let sentiment = 'neutral';
      
      if (data.error) {
        throw new Error('Model is loading, using fallback');
      }
      
      if (Array.isArray(data) && data.length > 0) {
        const sortedResults = data.sort((a, b) => b.score - a.score);
        const topResult = sortedResults[0];
        const label = topResult.label?.toUpperCase() || '';
        
        if (label.includes('POSITIVE') || label.includes('POS') || label === 'LABEL_2') {
          sentiment = 'positive';
        } else if (label.includes('NEGATIVE') || label.includes('NEG') || label === 'LABEL_0') {
          sentiment = 'negative';
        } else if (label.includes('NEUTRAL') || label === 'LABEL_1') {
          sentiment = 'neutral';
        }
      }

      const summary = text.length > 50 
        ? text.substring(0, 50) + '...' 
        : text;

      let suggestion = 'Bugününüzü değerlendirin ve kendinize iyi bakın.';
      if (sentiment === 'positive') {
        suggestion = 'Harika! Bu pozitif enerjiyi korumaya devam edin.';
      } else if (sentiment === 'negative') {
        suggestion = 'Zor bir gün geçirmişsiniz. Kendinize zaman ayırın ve dinlenin.';
      }

      return {
        sentiment,
        summary,
        suggestion,
      };
    } catch (error) {
      continue;
    }
  }
  
  // Tüm endpoint'ler başarısız oldu, fallback kullan
  console.warn('All Hugging Face API endpoints failed, using fallback');
  
  // Fallback: Basit sentiment analizi
  const lowerText = text.toLowerCase();
  let sentiment = 'neutral';
  
  if (lowerText.includes('iyi') || lowerText.includes('güzel') || 
      lowerText.includes('mutlu') || lowerText.includes('harika') ||
      lowerText.includes('good') || lowerText.includes('great') ||
      lowerText.includes('happy') || lowerText.includes('wonderful')) {
    sentiment = 'positive';
  } else if (lowerText.includes('kötü') || lowerText.includes('üzgün') || 
             lowerText.includes('yorgun') || lowerText.includes('stres') ||
             lowerText.includes('bad') || lowerText.includes('sad') ||
             lowerText.includes('tired') || lowerText.includes('stress')) {
    sentiment = 'negative';
  }
  
  const summary = text.length > 50 
    ? text.substring(0, 50) + '...' 
    : text;
  
  let suggestion = 'Bugününüzü değerlendirin ve kendinize iyi bakın.';
  if (sentiment === 'positive') {
    suggestion = 'Harika! Bu pozitif enerjiyi korumaya devam edin.';
  } else if (sentiment === 'negative') {
    suggestion = 'Zor bir gün geçirmişsiniz. Kendinize zaman ayırın ve dinlenin.';
  }
  
  return {
    sentiment,
    summary,
    suggestion,
  };
};

