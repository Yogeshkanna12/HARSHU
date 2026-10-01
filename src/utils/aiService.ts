import { GoogleGenAI } from '@google/genai';
import {
  Language,
  IntentResult,
  IntentCategory,
  TaskType,
  Resource,
  ChatMessage,
} from '../types/index';
import { SUPPORTED_LANGUAGES } from './speech';
import { matchUniversalResource } from './universalKnowledge';
import { discoverOfficialResource } from './resourceDiscovery';

// Check if Gemini API key is available
export function getGeminiApiKey(): string | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('harshu_gemini_api_key');
    if (stored && stored.trim().length > 10) return stored.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 10) {
    return envKey.trim();
  }
  return null;
}

export function saveGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('harshu_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('harshu_gemini_api_key');
    }
  }
}

// 1. Precise Script & Language Detector
export function detectLanguageFromText(text: string, fallbackLang: Language = 'ta'): Language {
  const trimmed = text.trim();
  if (!trimmed) return fallbackLang;

  // Unicode Script Ranges
  const hasTamil = /[\u0B80-\u0BFF]/.test(trimmed);
  if (hasTamil) return 'ta';

  const hasTelugu = /[\u0C00-\u0C7F]/.test(trimmed);
  if (hasTelugu) return 'te';

  const hasKannada = /[\u0C80-\u0CFF]/.test(trimmed);
  if (hasKannada) return 'kn';

  const hasMalayalam = /[\u0D00-\u0D7F]/.test(trimmed);
  if (hasMalayalam) return 'ml';

  const hasGujarati = /[\u0A80-\u0AFF]/.test(trimmed);
  if (hasGujarati) return 'gu';

  const hasBengaliOrAssamese = /[\u0980-\u09FF]/.test(trimmed);
  if (hasBengaliOrAssamese) {
    if (/অসম|নমস্কাৰ|ৰ|ৱ/.test(trimmed)) return 'as';
    return 'bn';
  }

  const hasPunjabi = /[\u0A00-\u0A7F]/.test(trimmed);
  if (hasPunjabi) return 'pa';

  const hasOdia = /[\u0B00-\u0B7F]/.test(trimmed);
  if (hasOdia) return 'or';

  const hasUrdu = /[\u0600-\u06FF]/.test(trimmed);
  if (hasUrdu) return 'ur';

  // Devanagari: differentiate between Hindi and Marathi
  const hasDevanagari = /[\u0900-\u097F]/.test(trimmed);
  if (hasDevanagari) {
    const isMarathi =
      /आहे|नाही|करायचे|शिकायचे|पाहिजे|मिळेल|का\?|होय|माहिती|योजना|कसे/.test(trimmed);
    return isMarathi ? 'mr' : 'hi';
  }

  // Transliteration / Roman script checks
  const lower = trimmed.toLowerCase();

  // Tanglish markers
  if (
    /thaiyal|thayyal|udavi|velai|enakku|ennaku|kalvi|magalir|kedaikuma|padika|kandupidika|scholarship|eppadi|enga|epdi|theriyuma/.test(
      lower
    ) &&
    /enakku|ennaku|udavi|thaiyal|velai|kedaikuma|eppadi|enga/.test(lower)
  ) {
    return 'ta';
  }

  // Hinglish markers
  if (
    /chahiye|karna|kaam|silai|yojana|madad|batao|kya|hoga|milega|padhai|kare|paisa|kaise|kahan/.test(
      lower
    )
  ) {
    return 'hi';
  }

  // Marathlish
  if (/mala|kam|shikayche|ahe|kahi|madat|pahije|kase/.test(lower)) {
    return 'mr';
  }

  // Telugulish
  if (/naku|kavali|pani|nerchukovali|sahayam|ela|ekkada/.test(lower)) {
    return 'te';
  }

  // Kannadlish
  if (/nanage|beku|kelsa|sahaya|hege|elli/.test(lower)) {
    return 'kn';
  }

  // If mostly English alphabet
  if (/^[a-zA-Z0-9\s.,!?'"()-]+$/.test(trimmed)) {
    return 'en';
  }

  return fallbackLang;
}

// 2. Comprehensive Multilingual Knowledge Base for Universal Needs
interface DomainAnswerTemplate {
  interpretedMeaning: Record<Language, string>;
  directAnswer: Record<Language, string>;
  taskType: TaskType;
  mode: 'direct_answer' | 'guided' | 'recipe' | 'travel' | 'service';
  followupSuggestions?: Partial<Record<Language, string[]>> | Record<string, string[]>;
}

export const UNIVERSAL_DOMAIN_ANSWERS: Record<string, DomainAnswerTemplate> = {
  // Travel: Bus to Kanchipuram
  'travel-kanchipuram-bus': {
    taskType: 'travel',
    mode: 'travel',
    interpretedMeaning: {
      ta: 'சென்னையில் இருந்து காஞ்சிபுரத்திற்கு பேருந்து எங்கு, எப்படி கிடைக்கும் என அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि चेन्नई से कांचीपुरम के लिए बस कहाँ और कैसे मिलेगी।',
      en: 'You want to know where and how to board a bus from Chennai to Kanchipuram.',
      mr: 'चेन्नईहून कांचीपुरमला जाण्यासाठी बस कुठून मिळेल हे जाणून घ्यायचे आहे.',
      gu: 'તમે જાણવા માંગો છો કે કાંચીપુરમ જવા માટે બસ ક્યાંથી મળશે.',
      te: 'చెన్నై నుండి కాంచీపురం వెళ్లడానికి బస్సు ఎక్కడ దొరుకుతుందో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಚೆನ್ನೈನಿಂದ ಕಾಂಚೀಪುರಂಗೆ ಬಸ್ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'ചെന്നൈയിൽ നിന്ന് കാഞ്ചീപുരത്തേക്ക് ബസ് എവിടെ നിന്ന് ലഭിക്കുമെന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'চেন্নাই থেকে কাঞ্চিপুরম যাওয়ার বাস কোথা থেকে পাওয়া যাবে জানতে চান।',
      pa: 'ਤੁਸੀਂ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ ਕਿ ਕਾਂਚੀਪੁਰਮ ਲਈ ਬੱਸ ਕਿੱਥੋਂ ਮਿਲੇਗੀ।',
      or: 'ଚେନ୍ନାଇରୁ କାଞ୍ଚୀପୁରମ୍ ପାଇଁ ବସ୍ କେଉଁଠାରୁ ମିଳିବ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'কাঞ্চীপুৰমলৈ বাছ ক’ৰ পৰা পোৱা যাব জানিব বিচাৰিছে।',
      ur: 'آپ جاننا چاہتی ہیں کہ کانچی پورم کے لیے بس کہاں سے ملے گی۔',
    },
    directAnswer: {
      ta: 'சென்னையில் இருந்து காஞ்சிபுரம் செல்ல கோயம்பேடு (CMBT) பேருந்து நிலையம் நடைமேடை எண் 3-ல் இருந்தும், தாம்பரம் சானடோரியத்தில் (MEPZ) இருந்தும் ஒவ்வொரு 10-15 நிமிடங்களுக்கும் நேரடி அரசு பேருந்துகள் (எண்கள் 76, 79, 576, 579) புறப்படுகின்றன. பயண நேரம் சுமார் 1.5 முதல் 2 மணி நேரம் ஆகும். சாதாரண வெள்ளை பலகை அரசு பேருந்துகளில் பெண்களுக்கு கட்டணம் முற்றிலும் இலவசம்! HARSHU உங்களுக்கு பேருந்து ஏறும் வழியை தெளிவாக காட்டும்.',
      hi: 'चेन्नई से कांचीपुरम जाने के लिए कोयम्बेडु (CMBT) बस अड्डे के प्लेटफॉर्म नंबर 3 तथा ताम्बरम बस स्टैंड से हर 10-15 मिनट में सीधी सरकारी बसें (बस नंबर 76, 79, 576, 579) मिलती हैं। यात्रा का समय लगभग 1.5 से 2 घंटे है। साधारण सरकारी बसों में महिलाओं के लिए यात्रा बिल्कुल मुफ्त है!',
      en: 'From Chennai, direct buses to Kanchipuram depart every 10–15 minutes from CMBT Koyambedu (Platform 3) and Tambaram Sanatorium (MEPZ) (Buses #76, #79, #576, #579). The journey takes about 1.5 to 2 hours. Ordinary white-board government buses offer free travel for women! HARSHU can guide your journey step by step.',
      mr: 'चेन्नईहून कांचीपुरमला जाण्यासाठी कोयम्बेडु (CMBT) प्लॅटफॉर्म ३ आणि ताम्बरमवरून दर १०-१५ मिनिटांनी थेट बसेस उपलब्ध आहेत.',
      gu: 'ચેન્નાઈથી કાંચીપુરમ જવા માટે કોઈમ્બેડુ (CMBT) પ્લેટફોર્મ ૩ અને તાંબરમથી દર ૧૦-૧૫ મિનિટે બસો મળે છે.',
      te: 'చెన్నై నుండి కాంచీపురం వెళ్లడానికి కోయంబేడు (CMBT) ప్లాట్‌ఫారమ్ 3 మరియు తాంబరం నుండి ప్రతి 10-15 నిమిషాలకు బస్సులు ఉన్నాయి.',
      kn: 'ಚೆನ್ನೈನಿಂದ ಕಾಂಚೀಪುರಂಗೆ ಕೊಯಂಬೇಡು (CMBT) ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 3 ಮತ್ತು ತಾಂಬರಂನಿಂದ ಪ್ರತಿ 10-15 ನಿಮಿಷಕ್ಕೆ ಬಸ್‌ಗಳು ಲಭ್ಯವಿವೆ.',
      ml: 'ചെന്നൈയിൽ നിന്ന് കാഞ്ചീപുരത്തേക്ക് കോയമ്പേട് പ്ലാറ്റ്ഫോം 3, താംബരം എന്നിവിടങ്ങളിൽ നിന്ന് ഓരോ 10 മിനിറ്റിലും ബസുകൾ ലഭ്യമാണ്.',
      bn: 'চেন্নাই থেকে কাঞ্চিপুরমের বাস কোয়েমবেডু প্ল্যাটফর্ম ৩ এবং তাম্বরম থেকে প্রতি ১০-১৫ মিনিটে পাওয়া যায়।',
      pa: 'ਕੋਇੰਬੇਡੂ (CMBT) ਅਤੇ ਤਾਂਬਰਮ ਤੋਂ ਕਾਂਚੀਪੁਰਮ ਲਈ ਹਰ 10-15 ਮਿੰਟਾਂ ਬਾਅਦ ਸਿੱਧੀਆਂ ਬੱਸਾਂ ਮਿਲਦੀਆਂ ਹਨ।',
      or: 'ଚେନ୍ନାଇର କୋୟାମ୍ବେଡୁ ପ୍ଲାଟଫର୍ମ ୩ ଏବଂ ତାମ୍ବରମରୁ କାଞ୍ଚୀପୁରମ ପାଇଁ ପ୍ରତି ୧୦-୧୫ ମିନିଟରେ ବସ୍ ମିଳିଥାଏ।',
      as: 'চেন্নাইৰ ক’য়াম্বেডু প্লেটফৰ্ম ৩ আৰু তাম্বৰমৰ পৰা কাঞ্চীপুৰমলৈ প্ৰতি ১০-১৫ মিনিটত বাছ পোৱা যায়।',
      ur: 'چینئی کے کوئمبیڈو (CMBT) پلیٹ فارم 3 اور تامبرم سے کانچی پورم کے لیے ہر 10-15 منٹ میں براہ راست بسیں دستیاب ہیں۔',
    },
    followupSuggestions: {
      ta: ['எந்த பேருந்து நிலையத்தில் பெண்கள் கட்டணமில்லா பேருந்து கிடைக்கும்?', 'காஞ்சிபுரத்தில் கோயிலுக்கு ஆட்டோ கட்டணம் எவ்வளவு?', 'கடைசி பேருந்து எப்போது புறப்படும்?'],
      hi: ['महिलाओं के लिए फ्री बस कहाँ से मिलेगी?', 'कांचीपुरम मंदिर के लिए ऑटो का किराया कितना है?', 'अंतिम बस कितने बजे मिलेगी?'],
      en: ['Where can I get the women-free zero-fare bus?', 'How much is auto fare to the temple?', 'What time is the last bus?'],
      mr: ['महिलांसाठी मोफत बस कुठून मिळेल?', 'शेवटची बस कधी सुटते?'],
      gu: ['મહિલાઓ માટે મફત બસ ક્યાંથી મળશે?', 'છેલ્લી બસ ક્યારે છે?'],
      te: ['మహిళలకు ఉచిత బస్సు ఎక్కడ దొరుకుతుంది?', 'చివరి బస్సు ఎప్పుడు బయలుదేరుతుంది?'],
      kn: ['ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?', 'ಕೊನೆಯ ಬಸ್ ಯಾವಾಗ?'],
      ml: ['സ്ത്രീകൾക്ക് സൗജന്യ ബസ് എവിടെ നിന്ന് ലഭിക്കും?'],
      bn: ['মহিলাদের ফ্রি বাস কোথা থেকে পাব?'],
      pa: ['ਮਹਿਲਾਵਾਂ ਲਈ ਮੁਫ਼ਤ ਬੱਸ ਕਿੱਥੋਂ ਮਿਲੇਗੀ?'],
      or: ['ମହିଳାଙ୍କ ପାଇଁ ମାଗଣା ବସ୍ କେଉଁଠାରୁ ମିଳିବ?'],
      as: ['মহিলাৰ বাবে বিনামূলীয়া বাছ ক’ত পোৱা যাব?'],
      ur: ['خواتین کے لیے مفت بس کہاں سے ملے گی؟'],
    },
  },

  // Navigation: Central to Park Station
  'navigation-central-to-park': {
    taskType: 'navigation',
    mode: 'travel',
    interpretedMeaning: {
      ta: 'சென்னை சென்ட்ரல் ரயில் நிலையத்திலிருந்து சென்னை பார்க் லோக்கல் ரயில் நிலையத்திற்கு எப்படி செல்வது என அறிய விரும்புகிறீர்கள்.',
      hi: 'आप चेन्नई सेंट्रल से चेन्नई पार्क लोकल ट्रेन स्टेशन जाने का रास्ता जानना चाहती हैं।',
      en: 'You want to know how to walk from Chennai Central to Chennai Park suburban station.',
      mr: 'चेन्नई सेंट्रल ते चेन्नई पार्क लोकल स्टेशन जाण्याचा मार्ग जाणून घ्यायचा आहे.',
      gu: 'ચેન્નાઈ સેન્ટ્રલથી ચેન્નાઈ પાર્ક લોકલ સ્ટેશન કેવી રીતે જવું તે જાણવું છે.',
      te: 'చెన్నై సెంట్రల్ నుండి చెన్నై పార్క్ లోకల్ స్టేషన్‌కు ఎలా వెళ్లాలో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಚೆನ್ನೈ ಸೆಂಟ್ರಲ್‌ನಿಂದ ಚೆನ್ನೈ ಪಾರ್ಕ್ ಲೋಕಲ್ ನಿಲ್ದಾಣಕ್ಕೆ ಹೇಗೆ ಹೋಗುವುದು ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'ചെന്നൈ സെൻട്രലിൽ നിന്ന് ചെന്നൈ പാർക്ക് ലോക്കൽ സ്റ്റേഷനിലേക്ക് എങ്ങനെ പോകണമെന്ന് അറിയണം.',
      bn: 'চেন্নাই সেন্ট্রাল থেকে চেন্নাই পার্ক লোকাল স্টেশনে কীভাবে যাবেন জানতে চান।',
      pa: 'ਚੇਨਈ ਸੈਂਟਰਲ ਤੋਂ ਚੇਨਈ ਪਾਰਕ ਲੋਕਲ ਸਟੇਸ਼ਨ ਦਾ ਰਸਤਾ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ଚେନ୍ନାଇ ସେଣ୍ଟ୍ରାଲରୁ ଚେନ୍ନାଇ ପାର୍କ ଲୋକାଲ୍ ଷ୍ଟେସନ କିପରି ଯିବେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'চেন্নাই চেণ্ট্ৰেলৰ পৰা চেন্নাই পাৰ্ক ষ্টেচনলৈ কেনেকৈ যাব জানিব বিচাৰিছে।',
      ur: 'آپ چینئی سینٹرل سے چینئی پارک لوکل اسٹیشن جانے کا راستہ جاننا چاہتی ہیں۔',
    },
    directAnswer: {
      ta: 'சென்னை சென்ட்ரலில் இருந்து சென்னை பார்க் ஸ்டேஷனுக்கு செல்ல ஆட்டோ அல்லது டாக்ஸி எதுவும் எடுக்கத் தேவையில்லை! சென்ட்ரல் ஸ்டேஷன் பிரதான வாயிலுக்கு வெளியே வந்து, சாலையைக் கடக்காமல், இடதுபுறம் உள்ள பாதுகாப்பான பாதசாரி சுரங்கப்பாதையில் (Subway) இறங்கி நடந்தால் வெறும் 3 நிமிடத்தில் (200 மீட்டர்) நேராக சென்னை பார்க் புறநகர் ரயில் நிலையத்தின் டிக்கெட் கவுண்ட்டருக்கு பாதுகாப்பாக சென்றுவிடலாம். அங்கிருந்து தாம்பரம், செங்கல்பட்டு அல்லது கடற்கரை மார்க்கம் லோக்கல் ரயில்களை எளிதாக பிடிக்கலாம்.',
      hi: 'चेन्नई सेंट्रल से चेन्नई पार्क स्टेशन जाने के लिए किसी ऑटो या टैक्सी की जरूरत नहीं है! सेंट्रल स्टेशन के मुख्य गेट से बाहर आकर बाईं ओर दिए गए सुरक्षित भूमिगत सबवे (Subway) से केवल 3 मिनट (200 मीटर) पैदल चलकर आप सीधे पार्क लोकल स्टेशन के अंदर पहुंच सकती हैं। वहां से ताम्बरम या बीच के लिए लोकल ट्रेन मिलती है।',
      en: 'You do not need an auto or taxi to go from Chennai Central to Chennai Park Station! Simply exit Central station onto the front concourse, and instead of crossing traffic, take the safe underground pedestrian subway on the left. In just a 200-metre (3-minute) walk through the subway, you exit directly inside Chennai Park suburban station for local trains to Tambaram, Chengalpattu, or Beach.',
      mr: 'चेन्नई सेंट्रलवरून चेन्नई पार्क स्टेशन फक्त ३ मिनिटे (२०० मीटर) अंतरावर आहे. स्टेशनबाहेर असलेल्या सबवेने (Subway) पायी चालत तुम्ही थेट पार्क स्टेशनवर पोहोचू शकता.',
      gu: 'ચેન્નાઈ સેન્ટ્રલથી ચેન્નાઈ પાર્ક ફક્ત ૩ મિનિટના ચાલવાના અંતરે છે. સુરક્ષિત સબવે દ્વારા રસ્તો ક્રોસ કર્યા વગર સીધા પાર્ક સ્ટેશન પહોંચી શકાય છે.',
      te: 'చెన్నై సెంట్రల్ నుండి చెన్నై పార్క్ స్టేషన్‌కు కేవలం 3 నిమిషాల నడక దూరం. సబ్‌వే (Subway) ద్వారా సురక్షితంగా నేరుగా పార్క్ స్టేషన్‌కు చేరుకోవచ్చు.',
      kn: 'ಚೆನ್ನೈ ಸೆಂಟ್ರಲ್‌ನಿಂದ ಚೆನ್ನೈ ಪಾರ್ಕ್ ನಿಲ್ದಾಣವು ಕೇವಲ 3 ನಿಮಿಷದ ನಡಿಗೆ ದೂರದಲ್ಲಿದೆ. ಸಬ್‌ವೇ ಮೂಲಕ ಸುಲಭವಾಗಿ ತಲುಪಬಹುದು.',
      ml: 'ചെന്നൈ സെൻട്രലിൽ നിന്ന് ചെന്നൈ പാർക്കിലേക്ക് വെറും 3 മിനിറ്റ് നടത്തം മാത്രം. റോഡ് മുറിച്ചുകടക്കാതെ സബ്‌വേ വഴി നേരിട്ട് പാർക്ക് സ്റ്റേഷനിലെത്താം.',
      bn: 'চেন্নাই সেন্ট্রাল থেকে চেন্নাই পার্ক স্টেশন মাত্র ৩ মিনিটের হাঁটা পথ। সাবওয়ের মাধ্যমে নিরাপদে পার্ক স্টেশনে পৌঁছানো যায়।',
      pa: 'ਚੇਨਈ ਸੈਂਟਰਲ ਤੋਂ ਚੇਨਈ ਪਾਰਕ ਸਟੇਸ਼ਨ ਸਿਰਫ਼ 3 ਮਿੰਟ ਪੈਦਲ ਦੂਰੀ ਤੇ ਹੈ। ਸਬਵੇਅ ਰਾਹੀਂ ਆਸਾਨੀ ਨਾਲ ਪਹੁੰચਿਆ ਜਾ ਸਕਦਾ ਹੈ।',
      or: 'ଚେନ୍ନାଇ ସେଣ୍ଟ୍ରାଲରୁ ଚେନ୍ନାଇ ପାର୍କ ଷ୍ଟେସନ ମାତ୍ର ୩ ମିନିଟର ପାଦଚଲା ରାସ୍ତା। ସବୱେ ଦେଇ ସହଜରେ ଯାଇହେବ।',
      as: 'চেন্নাই চেণ্ট্ৰেলৰ পৰা চেন্নাই পাৰ্ক ষ্টেচনলৈ মাত্ৰ ৩ মিনিটৰ খোজ কঢ়া পথ। ছাবৱে’ৰে সহজে যাব পাৰি।',
      ur: 'چینئی سینٹرل سے چینئی پارک اسٹیشن صرف 3 منٹ (200 میٹر) کی پیدل دوری پر ہے۔ سب وے (Subway) کے ذریعے باآسانی پہنچا جا سکتا ہے۔',
    },
    followupSuggestions: {
      ta: ['தாம்பரம் செல்லும் லோக்கல் ரயில் டிக்கெட் விலை எவ்வளவு?', 'சுரங்கப்பாதையில் லக்கேஜ் எடுத்து செல்ல சாய்வுதளம் (Ramp) உள்ளதா?', 'மெட்ரோ ரயிலில் செல்ல முடியுமா?'],
      hi: ['ताम्बरम के लिए लोकल टिकट कितने का है?', 'क्या सबवे में सामान ले जाने के लिए रैंप है?', 'क्या मेट्रो से भी जा सकते हैं?'],
      en: ['How much is the local train ticket to Tambaram?', 'Is there a ramp for heavy luggage in the subway?', 'Can I take the Metro instead?'],
    },
  },

  // Booking: Cinema Tickets
  'cinema-ticket-booking': {
    taskType: 'booking',
    mode: 'guided',
    interpretedMeaning: {
      ta: 'ஆன்லைனில் சினிமா டிக்கெட் எப்படி புக் செய்வது என்று அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि मोबाइल से ऑनलाइन सिनेमा टिकट कैसे बुक करें।',
      en: 'You want to know how to book cinema tickets online step by step.',
      mr: 'ऑनलाइन सिनेमा तिकीट कसे बुक करावे हे जाणून घ्यायचे आहे.',
      gu: 'તમે જાણવા માંગો છો કે ઓનલાઇન મુવી ટિકિટ કેવી રીતે બુક કરવી.',
      te: 'ఆన్‌లైన్‌లో సినిమా టిక్కెట్లు ఎలా బుక్ చేయాలో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸಿನೆಮಾ ಟಿಕೆಟ್ ಹೇಗೆ ಬುಕ್ ಮಾಡುವುದು ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'ഓൺലൈനിൽ സിനിമ ടിക്കറ്റ് എങ്ങനെ ബുക്ക് ചെയ്യാം എന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'অনলাইনে সিনেমার টিকিট কীভাবে বুক করবেন জানতে চান।',
      pa: 'ਤੁਸੀਂ ਆਨਲਾਈਨ ਸਿਨੇਮਾ ਟਿਕਟ ਬੁੱਕ ਕਰਨ ਦਾ ਤਰੀਕਾ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ଅନଲାଇନରେ ସିନେମା ଟିକେଟ୍ କିପରି ବୁକ୍ କରିବେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'অনলাইনত চিনেমাৰ টিকট কেনেকৈ বুক কৰিব জানিব বিচাৰিছে।',
      ur: 'آپ آن لائن سنیما ٹکٹ بک کرنے کا طریقہ جاننا چاہتی ہیں۔',
    },
    directAnswer: {
      ta: 'ஆன்லைனில் தியேட்டர் வரிசையில் நிற்காமல் சினிமா டிக்கெட் புக் செய்வது மிக எளிது! BookMyShow தளம் அல்லது செயலியைத் திறந்து: 1) உங்கள் ஊரையும் நீங்கள் பார்க்க விரும்பும் திரைப்படத்தையும் தேர்வு செய்யுங்கள். 2) அருகிலுள்ள தியேட்டர் மற்றும் காட்சி நேரத்தைத் (Showtime) தொடுங்கள். 3) காலியாக உள்ள பச்சை நிற இருக்கைகளை (Seats) தேர்வு செய்யுங்கள். 4) உங்கள் மொபைல் எண்ணை உள்ளிட்டு Google Pay, PhonePe அல்லது ஏடிஎம் கார்டு மூலம் பணம் செலுத்துங்கள். டிக்கெட் உடனடியாக உங்கள் வாட்ஸ்அப் மற்றும் SMS செய்திக்கு வந்துவிடும்! தியேட்டர் வாசலில் அதை காட்டினாலே போதுமானது.',
      hi: 'ऑनलाइन मूवी टिकट बुक करना बहुत सरल है! BookMyShow पर जाएं: 1) अपना शहर और फिल्म चुनें। 2) मनपसंद सिनेमा हॉल और शो का समय चुनें। 3) स्क्रीन के नक्शे पर अपनी पसंद की सीटें चुनें। 4) मोबाइल नंबर डालें और Google Pay या PhonePe से सुरक्षित भुगतान करें। कन्फर्म टिकट तुरंत आपके WhatsApp और SMS पर आ जाएगा। हॉल में बस वही मैसेज दिखाना है।',
      en: 'Booking cinema tickets online is very easy without standing in line! Open BookMyShow: 1) Choose your city and the movie. 2) Select your preferred theatre and showtime. 3) Pick your desired seats from the green available layout. 4) Enter your mobile number and pay securely with Google Pay, PhonePe, or Debit Card. Your confirmed ticket with QR code arrives instantly on WhatsApp and SMS — just show your phone screen at the entrance!',
      mr: 'BookMyShow वरून सहज तिकीट बुक करू शकता: शहर निवडा, चित्रपट आणि थिएटर निवडा, जागा निवडा आणि UPI द्वारे पेमेंट करा. तिकीट तुमच्या मोबाईलवर SMS द्वारे येईल.',
      gu: 'BookMyShow પરથી સરળતાથી ટિકિટ બુક કરી શકો છો: શહેર અને ફિલ્મ પસંદ કરો, થિયેટર અને સીટ પસંદ કરો અને Google Pay થી પેમેન્ટ કરો.',
      te: 'BookMyShow ద్వారా సులభంగా టిక్కెట్లు బుక్ చేసుకోవచ్చు: నగరం, సినిమా, థియేటర్ మరియు సీట్లు ఎంచుకుని UPI ద్వారా చెల్లించండి. టిక్కెట్ మీ ఫోన్‌కు వస్తుంది.',
      kn: 'BookMyShow ಮೂಲಕ ಸುಲಭವಾಗಿ ಸಿನೆಮಾ ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಬಹುದು: ನಗರ, ಸಿನೆಮಾ, ಚಿತ್ರಮಂದಿರ ಮತ್ತು ಸೀಟುಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ UPI ಮೂಲಕ ಪಾವತಿಸಿ.',
      ml: 'BookMyShow വഴി എളുപ്പത്തിൽ സിനിമ ടിക്കറ്റ് ബുക്ക് ചെയ്യാം. സിനിമയും തിയേറ്ററും സീറ്റും തെരഞ്ഞെടുത്ത് ഗൂഗിൾ പേ വഴി പണമടയ്ക്കാം.',
      bn: 'BookMyShow থেকে সহজে টিকিট কাটতে পারেন: শহর, সিনেমা, থিয়েটার এবং সিট সিলেক্ট করে UPI দিয়ে পেমেন্ট করুন।',
      pa: 'BookMyShow ਤੋਂ ਆਸਾਨੀ ਨਾਲ ਟਿਕਟ ਬੁੱਕ ਹੋ ਜਾਂਦੀ ਹੈ: ਫਿਲਮ, ਥੀਏਟਰ ਅਤੇ ਸੀਟਾਂ ਚੁਣੋ ਅਤੇ UPI ਰਾਹੀਂ ਭੁਗਤਾਨ ਕਰੋ।',
      or: 'BookMyShow ମାଧ୍ୟମରେ ସହଜରେ ଟିକେଟ୍ ବୁକ୍ କରିପାରିବେ। ଫିଲ୍ମ, ହଲ୍ ଓ ସିଟ୍ ବାଛି UPI ରେ ପେମେଣ୍ଟ କରନ୍ତୁ।',
      as: 'BookMyShow-ৰ পৰা সহজে টিকট বুক কৰিব পাৰি: চিনেমা, থিয়েটাৰ আৰু ছীট বাছি UPI-ৰে পেমেন্ট কৰক।',
      ur: 'BookMyShow کے ذریعے باآسانی ٹکٹ بک کیا جا سکتا ہے: شہر، فلم، تھیٹر اور سیٹ منتخب کریں اور UPI کے ذریعے ادائیگی کریں۔ ٹکٹ آپ کے فون پر آ جائے گا۔',
    },
    followupSuggestions: {
      ta: ['டிக்கெட்டை கேன்சல் செய்ய முடியுமா?', 'கட்டணம் திரும்பக் கிடைக்குமா?', 'தியேட்டரில் பாப்கார்ன் முன்கூட்டியே ஆர்டர் செய்யலாமா?'],
      hi: ['क्या टिकट कैंसिल हो सकता है?', 'क्या पैसे वापस मिलते हैं?'],
      en: ['Can I cancel the ticket if plans change?', 'Is a printout required at the theatre?'],
    },
  },

  // Cooking: Dum Biriyani
  'recipe-dum-biriyani': {
    taskType: 'cooking',
    mode: 'recipe',
    interpretedMeaning: {
      ta: 'சுவையான பிரியாணி எப்படி சமைப்பது என்று அறிய விரும்புகிறீர்கள்.',
      hi: 'आप स्वादिष्ट दम बिरयानी बनाने की रेसिपी और विधि जानना चाहती हैं।',
      en: 'You want to know how to cook delicious authentic Dum Biriyani step by step.',
      mr: 'चवदार दम बिर्याणी कशी बनवायची याची रेसिपी हवी आहे.',
      gu: 'સ્વાદિષ્ટ દમ બિરયાની કેવી રીતે બનાવવી તે રેસિપી જાણવી છે.',
      te: 'రుచికరమైన దమ్ బిర్యానీ ఎలా తయారు చేయాలో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ರುಚಿಯಾದ ದಮ್ ಬಿರಿಯಾನಿ ಹೇಗೆ ಮಾಡುವುದು ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'രുചികരമായ ദം ബിരിയാണി എങ്ങനെ ഉണ്ടാക്കാം എന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'সুস্বাদু দম বিরিয়ানি কীভাবে বানাবেন তার রেসিপি জানতে চান।',
      pa: 'ਤੁਸੀਂ ਸਵਾਦਿਸ਼ਟ ਦਮ ਬਿਰਿਆਨੀ ਬਣਾਉਣ ਦਾ ਤਰੀਕਾ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ସ୍ୱାଦିଷ୍ଟ ଦମ୍ ବିରିୟାନି କିପରି ତିଆରି କରିବେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'সুস্বাদু দম বিৰিয়ানি কেনেকৈ বনাব জানিব বিচাৰিছে।',
      ur: 'آپ لذیذ دم بریانی بنانے کی ترکیب جاننا چاہتی ہیں۔',
    },
    directAnswer: {
      ta: 'சுவையான தம் பிரியாணி செய்ய முக்கிய ரகசியமே சரியான மசாலா அளவும், அரிசி பக்குவமும் தான்! 1) 500 கிராம் பாசுமதி அரிசியை 20 நிமிடம் ஊறவைத்து, கொதிக்கும் நீரில் ஏலக்காய், உப்பு போட்டு 70% மட்டும் வேகவைத்து தண்ணீரை வடித்துக்கொள்ளவும். 2) பாத்திரத்தில் நெய், எண்ணெய் சூடாக்கி பட்டை, கிராம்பு தாளித்து, நறுக்கிய வெங்காயத்தை பொன்னிறமாக வதக்கவும். பின் இஞ்சி-பூண்டு விழுது, தக்காளி, சிக்கன் அல்லது காய்கறிகள், தயிர், புதினா, கொத்தமல்லி மற்றும் மசாலா சேர்த்து நன்றாக வேகவைக்கவும். 3) கிரேவியின் மேல் வடித்து வைத்த சாதத்தைப் பரப்பி, 1 ஸ்பூன் நெய் ஊற்றி, பழைய தோசைக்கல் மீது பாத்திரத்தை வைத்து குறைந்த தீயில் 15 நிமிடம் "தம்" போட்டால் மணக்க மணக்க சுவையான பிரியாணி தயார்! நாம் சேர்ந்து சமைக்கலாம் 🍳',
      hi: 'स्वादिष्ट दम बिरयानी बनाने का असली राज सही मसाले और चावल का सही उबलना है! 1) 500 ग्राम बासमती चावल को 20 मिनट भिगोकर केवल 70% उबालकर पानी छान लें। 2) पतीले में घी और तेल गर्म करके खड़े मसाले, सुनहरा तला प्याज, अदरक-लहसुन, टमाटर, चिकन/सब्जियां, दही और पुदीना-धनिया के साथ गाढ़ी ग्रेवी तैयार करें। 3) ग्रेवी पर चावल की परत फैलाएं, थोड़ा घी डालें और ढक्कन लगाकर तवे पर धीमी आंच पर 15 मिनट दम दें। खिली-खिली खुशबूदार बिरयानी तैयार है! चलिए साथ मिलकर बनाते हैं 🍳',
      en: 'The secret to authentic dum biriyani is parboiling the rice to 70% and slow dum cooking! 1) Soak 500g Basmati rice for 20 mins, boil in spiced water until 70% cooked, and drain. 2) In a heavy pot, heat ghee and oil, crackle whole spices, and fry onions till deep golden brown. Add ginger-garlic paste, tomatoes, chicken/vegetables, curd, mint, coriander, and spices; cook until oil separates. 3) Layer the parboiled rice over the curry, drizzle ghee, seal with a tight lid, and place on a flat tawa on low flame for 15 minutes. Fragrant, mouth-watering biriyani is ready! Let’s cook together 🍳',
      mr: 'दम बिर्याणीसाठी तांदूळ ७०% शिजवून घ्यावा. मसाल्याची ग्रेव्ही तयार करून त्यावर भाताचा थर द्यावा आणि तव्यावर मंद आचेवर १५ मिनिटे दम द्यावा.',
      gu: 'દમ બિરયાની માટે બાસમતી ચોખા ૭૦% બાફી લો. મસાલા ગ્રેવી બનાવી તેના પર ચોખા પાથરી તવા પર ધીમા તાપે ૧૫ મિનિટ દમ આપો.',
      te: 'బియ్యం 70% ఉడికించి వార్చాలి. మసాలా గ్రేవీపై అన్నం పరిచి పెనంపై తక్కువ మంటపై 15 నిమిషాలు దమ్ చేస్తే ఘుమఘుమలాడే బిర్యానీ రెడీ!',
      kn: 'ಬಾಸುಮತಿ ಅಕ್ಕಿಯನ್ನು 70% ಬೇಯಿಸಿ ಬಸಿದುಕೊಳ್ಳಿ. ಮಸಾಲೆ ಗ್ರೇವಿ ಮೇಲೆ ಅನ್ನ ಹರಡಿ ತವಾದ ಮೇಲೆ ಕಡಿಮೆ ಉರಿಯಲ್ಲಿ 15 ನಿಮಿಷ ದಮ್ ಇಡಿ.',
      ml: 'ബസുമതി അരി 70% മാത്രം വേവിച്ച് ഊറ്റി എടുക്കുക. മസാല തയ്യാറാക്കി ചോറ് നിരത്തി 15 മിനിറ്റ് ദം ചെയ്താൽ രുചികരമായ ബിരിയാണി റെഡി!',
      bn: 'চাল ৭০% ফুটিয়ে জল ঝরিয়ে নিন। মশলা কষে মাংস/সবজি রান্না করে উপরে ভাত ছড়িয়ে ১৫ মিনিট দমে বসান।',
      pa: 'ਚਾਵਲ ਨੂੰ 70% ਉਬਾਲ ਲਵੋ। ਮਸਾਲਾ ਤਿਆਰ ਕਰਕੇ ਉੱਪਰ ਚਾਵਲ ਫੈਲਾਓ ਅਤੇ ਤਵੇ ਤੇ 15 ਮਿੰਟ ਦਮ ਦਿਓ।',
      or: 'ଚାଉଳକୁ ୭୦% ସିଝାଇ ଛାଣି ନିଅନ୍ତୁ। ମସଲା କଷି ଚାଉଳ ଢାଙ୍କି ୧୫ ମିନିଟ୍ ଦମ୍ ଦିଅନ୍ତୁ।',
      as: 'চাউল ৭০% সিজাই পানীখিনি পেলাই দিয়ক। মচলা কহি চাউল ওপৰত দি ১৫ মিনিট দম দিয়ক।',
      ur: 'چاول کو 70 فیصد ابال کر چھان لیں۔ مصالحہ تیار کر کے اوپر چاول کی تہہ لگائیں اور توے پر دھیمی آنچ پر 15 منٹ دم دیں۔ لذیذ بریانی تیار ہے۔',
    },
    followupSuggestions: {
      ta: ['பிரியாணி குக்கரில் வைத்தால் எத்தனை விசில் விட வேண்டும்?', 'ரைத்தா (வெங்காய பச்சடி) செய்வது எப்படி?', 'பிரியாணி மசாலா பொடி வீட்டிலேயே அரைப்பது எப்படி?'],
      hi: ['प्रेशर कुकर में बिरयानी की कितनी सीटी लगानी चाहिए?', 'रायता कैसे बनाएं?'],
      en: ['How many whistles if cooking in a pressure cooker?', 'How to make onion raita?', 'Can I make it with vegetables only?'],
    },
  },

  // Technology: Setup WhatsApp
  'tech-create-whatsapp': {
    taskType: 'technology',
    mode: 'guided',
    interpretedMeaning: {
      ta: 'மொபைலில் வாட்ஸ்அப் (WhatsApp) தொடங்குவது அல்லது கணக்கு அமைப்பது எப்படி என அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि मोबाइल फोन में व्हाट्सएप अकाउंट कैसे शुरू करें।',
      en: 'You want to know how to install and set up a WhatsApp account on your smartphone.',
      mr: 'मोबाईलमध्ये व्हॉट्सअॅप कसे सुरू करावे हे जाणून घ्यायचे आहे.',
      gu: 'મોબાઈલમાં વોટ્સએપ કેવી રીતે ચાલુ કરવું તે જાણવું છે.',
      te: 'మొబైల్‌లో వాట్సాప్ ఎలా ఇన్‌స్టాల్ చేసి ప్రారంభించాలో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಮೊಬೈಲ್‌ನಲ್ಲಿ ವಾಟ್ಸಾಪ್ ಖಾತೆ ಹೇಗೆ ತೆರೆಯುವುದು ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'മൊബൈലിൽ വാട്സ്ആപ്പ് എങ്ങനെ ആരംഭിക്കാം എന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'মোবাইলে হোয়াটসঅ্যাপ কীভাবে শুরু করবেন জানতে চান।',
      pa: 'ਮੋਬਾਈਲ ਵਿੱਚ ਵ੍ਹਟਸਐਪ ਕਿਵੇਂ ਚਾਲੂ ਕਰਨਾ ਹੈ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ମୋବାଇଲରେ ହ୍ୱାଟ୍ସଆପ୍ କିପରି ଆରମ୍ଭ କରିବେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'মোবাইলত হোৱাটছএপ কেনেকৈ আৰম্ভ কৰিব জানিব বিচাৰিছে।',
      ur: 'آپ جاننا چاہتی ہیں کہ موبائل میں واٹس ایپ اکاؤنٹ کیسے شروع کریں۔',
    },
    directAnswer: {
      ta: 'செல்போனில் வாட்ஸ்அப் தொடங்குவது மிக மிக எளிது, 2 நிமிடங்களில் செய்துவிடலாம்: 1) உங்கள் போனில் Google Play Store-ஐ திறந்து "WhatsApp" என்று தட்டச்சு செய்து பச்சை நிற செயலியை Install செய்யுங்கள். 2) செயலியை திறந்து "Agree and Continue" தொட்டு, உங்கள் 10 இலக்க செல்போன் எண்ணை உள்ளிடுங்கள். 3) உங்கள் போனுக்கு SMS செய்தியாக 6 இலக்க ரகசிய எண் (OTP) வரும். அதை பார்த்து அடியுங்கள். 4) உங்கள் பெயரை டைப் செய்து "Next" கொடுத்தால் போதும்! இப்போது நீங்கள் குடும்பத்தினருக்கும் தோழிகளுக்கும் இலவசமாக பேசலாம், புகைப்படம் அனுப்பலாம் மற்றும் வீடியோ கால் செய்யலாம். HARSHU இதற்கான ஒவ்வொரு படியையும் காட்டும்!',
      hi: 'मोबाइल में व्हाट्सएप शुरू करना बहुत ही सरल है: 1) फोन में Google Play Store खोलकर "WhatsApp" सर्च करें और Install करें। 2) ऐप खोलकर "Agree and Continue" दबाएं और अपना 10 अंकों का मोबाइल नंबर डालें। 3) SMS द्वारा 6 अंकों का OTP कोड आएगा, उसे दर्ज करें। 4) अपना नाम लिखकर Next दबाएं। आपका व्हाट्सएप चालू हो गया! अब आप परिवार को मुफ्त मैसेज और वीडियो कॉल कर सकती हैं।',
      en: 'Setting up WhatsApp on your smartphone is very simple and takes just 2 minutes: 1) Open Google Play Store (Android) or App Store (iPhone), search for "WhatsApp", and tap Install. 2) Open WhatsApp, tap "Agree and Continue", and enter your 10-digit mobile number. 3) Enter the 6-digit OTP verification code received by SMS. 4) Type your name and tap Next. That’s it! Your WhatsApp is ready for free messaging and video calling with family.',
      mr: 'Play Store वरून WhatsApp डाउनलोड करा, मोबाईल नंबर टाका, आलेला OTP प्रविष्ट करा आणि आपले नाव लिहून सुरू करा. हे पूर्णपणे मोफत आहे.',
      gu: 'Play Store પરથી WhatsApp ઇન્સ્ટોલ કરો, મોબાઈલ નંબર નાખો, OTP દાખલ કરો અને તમારું નામ લખીને શરૂ કરો.',
      te: 'Play Store నుండి WhatsApp డౌన్‌లోడ్ చేయండి, మొబైల్ నంబర్ వేసి OTP ఎంటర్ చేసి మీ పేరు నమోదు చేయండి. ఉచితంగా వీడియో కాల్స్ చేసుకోవచ్చు.',
      kn: 'Play Store ನಿಂದ WhatsApp ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ, ಮೊಬೈಲ್ ನಂಬರ್ ಹಾಕಿ, OTP ದಾಖಲಿಸಿ ನಿಮ್ಮ ಹೆಸರು ಬರೆಯಿರಿ.',
      ml: 'Play Store-ൽ നിന്ന് WhatsApp ഡൗൺലോഡ് ചെയ്ത് മൊബൈൽ നമ്പറും OTP-യും നൽകി പേര് ടൈപ്പ് ചെയ്താൽ വാട്സ്ആപ്പ് റെഡി!',
      bn: 'Play Store থেকে WhatsApp ইনস্টল করুন, মোবাইল নম্বর ও OTP দিন এবং নাম লিখে শুরু করে দিন।',
      pa: 'Play Store ਤੋਂ WhatsApp ਡਾਊਨਲੋਡ ਕਰੋ, ਮੋਬਾਈਲ ਨੰਬਰ ਅਤੇ OTP ਦਰਜ ਕਰਕੇ ਆਪਣਾ ਨਾਮ ਲਿਖੋ।',
      or: 'Play Store ରୁ WhatsApp ଇନଷ୍ଟଲ୍ କରନ୍ତୁ, ମୋବାଇଲ୍ ନମ୍ବର ଓ OTP ଦେଇ ନାମ ଲେଖି ଆରମ୍ଭ କରନ୍ତୁ।',
      as: 'Play Store-ৰ পৰা WhatsApp ইনষ্টল কৰক, মোবাইল নম্বৰ আৰু OTP দি নাম লিখি আৰম্ভ কৰক।',
      ur: 'Play Store سے WhatsApp انسٹال کریں، موبائل نمبر اور OTP درج کریں اور اپنا نام لکھ کر شروع کریں۔ یہ بالکل مفت ہے۔',
    },
    followupSuggestions: {
      ta: ['வாட்ஸ்அப்பில் வீடியோ கால் செய்வது எப்படி?', 'புதிய நண்பரின் போன் நம்பரை எப்படி சேர்ப்பது?', 'வாய்ஸ் மெசேஜ் (குரல் பதிவு) அனுப்புவது எப்படி?'],
      hi: ['वीडियो कॉल कैसे करते हैं?', 'नया नंबर कैसे जोड़ें?', 'वॉइस मैसेज कैसे भेजें?'],
      en: ['How do I make a video call?', 'How do I add a new contact?', 'How to send a voice note?'],
    },
  },

  // Payment: Electricity Bill
  'payment-electricity-bill': {
    taskType: 'payment',
    mode: 'service',
    interpretedMeaning: {
      ta: 'மின் கட்டணத்தை (EB Bill) ஆன்லைனில் எப்படி செலுத்துவது என்று அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि घर बैठे ऑनलाइन बिजली बिल कैसे भरें।',
      en: 'You want to know how to pay your electricity bill online safely.',
      mr: 'घरबसल्या ऑनलाईन वीज बिल कसे भरावे हे जाणून घ्यायचे आहे.',
      gu: 'ઓનલાઇન વીજળી બિલ કેવી રીતે ભરવું તે જાણવું છે.',
      te: 'ఆన్‌లైన్‌లో కరెంట్ బిల్లు ఎలా చెల్లించాలో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ವಿದ್ಯುತ್ ಬಿಲ್ ಹೇಗೆ ಪಾವತಿಸುವುದು ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'ഓൺലൈനായി വൈദ്യുതി ബിൽ എങ്ങനെ അടയ്ക്കാം എന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'অনলাইনে বিদ্যুতের বিল কীভাবে দেবেন জানতে চান।',
      pa: 'ਤੁਸੀਂ ਆਨਲਾਈਨ ਬਿਜਲੀ ਦਾ ਬਿੱਲ ਭਰਨ ਦਾ ਤਰੀਕਾ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ଅନଲାଇନରେ ବିଜୁଳି ବିଲ୍ କିପରି ପୈଠ କରିବେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'অনলাইনত বিদ্যুৎ বিল কেনেকৈ পৰিশোধ কৰিব জানিব বিচাৰিছে।',
      ur: 'آپ جاننا چاہتی ہیں کہ آن لائن بجلی کا بل کیسے ادا کریں۔',
    },
    directAnswer: {
      ta: 'மின் கட்டணத்தை மின்வாரிய அலுவலகத்தில் வரிசையில் நிற்காமல், வீட்டிலேயே உங்கள் மொபைல் மூலம் 2 நிமிடத்தில் பாதுகாப்பாக செலுத்தலாம்: 1) உங்கள் முந்தைய EB ரசீது அல்லது அட்டையில் இருக்கும் மின் நுகர்வோர் எண்ணை (Consumer Number) குறித்துக்கொள்ளுங்கள். 2) உங்கள் போனில் Google Pay அல்லது PhonePe திறந்து "Electricity" பகுதியைத் தொட்டு, "TANGEDCO" என்பதைத் தேர்ந்தெடுத்து நுகர்வோர் எண்ணை உள்ளிடுங்கள். 3) உங்கள் பெயரும், கட்ட வேண்டிய தொகையும் தோன்றும். அதை உறுதி செய்து உங்கள் இரகசிய UPI பின்னை மட்டும் போட்டு பணம் செலுத்துங்கள். ரசீது உடனே சேமிக்கப்படும்! பாதுகாப்பு விதி: HARSHU அல்லது எந்த அதிகாரியும் உங்கள் UPI PIN அல்லது வங்கி OTP கேட்க மாட்டார்கள்.',
      hi: 'बिजली बिल ऑनलाइन भरना बहुत सुरक्षित और आसान है: 1) पुराने बिल से अपनी उपभोक्ता संख्या (Consumer Number) देख लें। 2) Google Pay या PhonePe में "Electricity" चुनकर अपने राज्य का विद्युत बोर्ड चुनें और नंबर डालें। 3) उपभोक्ता का नाम और बिल राशि देख लें, फिर अपना UPI पिन डालकर भुगतान करें। रसीद तुरंत मिल जाएगी। सुरक्षा नियम: अपना UPI पिन कभी किसी को न बताएं।',
      en: 'Paying your electricity bill from home takes under 2 minutes: 1) Note your Consumer Service Number from your previous receipt or white meter card. 2) Open Google Pay or PhonePe, tap "Electricity", choose your board (e.g. TANGEDCO in Tamil Nadu), and enter the consumer number. 3) Verify your name and bill amount displayed on screen, then complete payment securely with your private UPI PIN. Save the instant digital receipt. Safety note: HARSHU never asks for your bank password, PIN, or OTP.',
      mr: 'Google Pay किंवा PhonePe वरून वीज बिल सहज भरता येते. ग्राहक क्रमांक टाका, रक्कम तपासा आणि UPI पिन टाकून पेमेंट करा.',
      gu: 'Google Pay અથવા PhonePe માં "Electricity" પસંદ કરો, કન્ઝ્યુમર નંબર નાખો અને UPI પિનથી સુરક્ષિત પેમેન્ટ કરો.',
      te: 'Google Pay లేదా PhonePe లో "Electricity" ఎంచుకుని, కన్స్యూమర్ నంబర్ వేసి UPI పిన్ ద్వారా సురక్షితంగా చెల్లించండి.',
      kn: 'Google Pay ಅಥವಾ PhonePe ನಲ್ಲಿ "Electricity" ಆಯ್ಕೆಮಾಡಿ, ಗ್ರಾಹಕ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ UPI ಪಿನ್ ಹಾಕಿ ಪಾವತಿಸಿ.',
      ml: 'Google Pay അല്ലെങ്കിൽ PhonePe വഴി എളുപ്പത്തിൽ കറൻ്റ് ബിൽ അടയ്ക്കാം. കൺസ്യൂമർ നമ്പർ നൽകി പണമടയ്ക്കാം.',
      bn: 'Google Pay বা PhonePe-তে Electricity অপশন বেছে গ্রাহক নম্বর দিয়ে বিল পেমেন্ট করুন।',
      pa: 'Google Pay ਜਾਂ PhonePe ਤੇ ਬਿਜਲੀ ਬਿੱਲ ਆਸਾਨੀ ਨਾਲ ਭਰਿਆ ਜਾ ਸਕਦਾ ਹੈ। ਕੰਜ਼ਿਊਮਰ ਨੰਬਰ ਪਾ ਕੇ ਭੁਗਤਾਨ ਕਰੋ।',
      or: 'Google Pay ବା PhonePe ରେ Electricity ବିକଳ୍ପ ବାଛି ଗ୍ରାହକ ନମ୍ବର ଦେଇ ବିଲ୍ ପୈଠ କରନ୍ତୁ।',
      as: 'Google Pay বা PhonePe-ত Electricity বিকল্প বাছি গ্ৰাহক নম্বৰ দি বিল পৰিশোধ কৰক।',
      ur: 'Google Pay یا PhonePe میں "Electricity" منتخب کریں، کنزیومر نمبر ڈالیں اور اپنے خفیہ UPI پن کے ذریعے باحفاظت ادائیگی کریں۔',
    },
    followupSuggestions: {
      ta: ['பணம் செலுத்திய ரசீதை எப்படி டவுன்லோட் செய்வது?', 'கடைசி தேதி முடிந்துவிட்டால் அபராதம் எவ்வளவு?'],
      hi: ['भुगतान की रसीद कैसे डाउनलोड करें?', 'अंतिम तिथि के बाद पेनल्टी कितनी लगती है?'],
      en: ['How do I download the payment receipt?', 'What if I made a payment but status shows pending?'],
    },
  },

  // General: What is Aadhaar?
  'general-what-is-aadhaar': {
    taskType: 'general',
    mode: 'direct_answer',
    interpretedMeaning: {
      ta: 'ஆதார் அட்டை என்றால் என்ன, அதன் பயன் என்ன என்று அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि आधार कार्ड क्या है और यह क्यों जरूरी है।',
      en: 'You want to know what Aadhaar is and how it is used.',
      mr: 'आधार कार्ड काय आहे हे जाणून घ्यायचे आहे.',
      gu: 'આધાર કાર્ડ શું છે તે જાણવું છે.',
      te: 'ఆధార్ కార్డు అంటే ఏమిటో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ ಎಂದರೇನು ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'ആധാർ കാർഡ് എന്താണെന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'আধার কার্ড কী জানতে চান।',
      pa: 'ਆਧਾਰ ਕਾਰਡ ਕੀ ਹੁੰਦਾ ਹੈ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ଆଧାର କାର୍ଡ କ’ଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'আধাৰ কাৰ্ড কি জানিব বিচাৰিছে।',
      ur: 'آپ جاننا چاہتی ہیں کہ آধার کارڈ کیا ہے۔',
    },
    directAnswer: {
      ta: 'ஆதார் என்பது இந்திய குடிமக்களுக்கு மத்திய அரசால் வழங்கப்படும் 12 இலக்க தனித்துவ அடையாள எண் (UID). இதில் உங்கள் பெயர், முகவரி, புகைப்படம், விரல் ரேகை மற்றும் கண்களின் கருவிழி பதிவு செய்யப்பட்டிருக்கும். இது அரசு நலத்திட்ட உதவிகள் (மாதம் ₹1,000 உரிமைத் தொகை, இலவச சிலிண்டர், ரேஷன்), வங்கி கணக்கு தொடங்குதல் மற்றும் சிம் கார்டு வாங்க முதன்மையான சான்றாக பயன்படுகிறது. மிக முக்கியமான பாதுகாப்பு: உங்கள் செல்போனுக்கு வரும் ஆதார் OTP எண்ணை யாரிடமும் செல்போனில் சொல்லக் கூடாது.',
      hi: 'आधार भारत सरकार द्वारा जारी 12 अंकों का विशिष्ट पहचान पत्र है। इसमें आपकी फोटो, उंगलियों के निशान और आंखों की पुतली का बायोमेट्रिक दर्ज होता है। यह बैंक खाता खोलने, राशन कार्ड, गैस सब्सिडी और सभी सरकारी योजनाओं के लिए सबसे मुख्य पहचान पत्र है। सुरक्षा नियम: अपना आधार OTP कभी किसी से फोन पर साझा न करें।',
      en: 'Aadhaar is a 12-digit unique identity number issued by UIDAI, Government of India. It securely stores your biometric details (photo, fingerprints, and iris scan) and serves as official proof of identity and residence for bank accounts, mobile SIMs, and government welfare benefits. Crucial safety rule: Never share your Aadhaar OTP over the phone with anyone.',
      mr: 'आधार हे भारत सरकारद्वारे दिलेले १२ अंकी विशिष्ट ओळखपत्र आहे. हे बँक, रेशन आणि सर्व सरकारी योजनांसाठी आवश्यक आहे.',
      gu: 'આધાર કાર્ડ ભારત સરકાર દ્વારા અપાતું ૧૨ આંકડાનું ઓળખપત્ર છે, જે બેંક અને સરકારી યોજનાઓ માટે મુખ્ય પુરાવો છે.',
      te: 'ఆధార్ కార్డు అనేది భారత ప్రభుత్వం జారీ చేసే 12 అంకెల విశిష్ట గుర్తింపు సంఖ్య. బ్యాంకు ఖాతా మరియు పథకాలకు ఇది తప్పనిసరి.',
      kn: 'ಆಧಾರ್ ಭಾರತ ಸರ್ಕಾರವು ನೀಡುವ 12 ಅಂಕಿಗಳ ಗುರುತಿನ ಚೀಟಿ. ಬ್ಯಾಂಕ್ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಮುಖ್ಯ ದಾಖಲೆ.',
      ml: 'ഭാരത സർക്കാർ നൽകുന്ന 12 അക്ക തിരിച്ചറിയൽ കാർഡാണ് ആധാർ. ബാങ്ക് ഇടപാടുകൾക്കും ക്ഷേമപദ്ധതികൾക്കും ഇത് അത്യന്താപേക്ഷിതമാണ്.',
      bn: 'আধার হল ভারত সরকার প্রদত্ত ১২ সংখ্যার একটি অনন্য পরিচয়পত্র যা ব্যাংক ও সরকারি প্রকল্পের জন্য জরুরি।',
      pa: 'ਆਧਾਰ ਭਾਰਤ ਸਰਕਾਰ ਵੱਲੋਂ ਜਾਰੀ 12 ਅੰਕਾਂ ਦਾ ਪਛਾਣ ਪੱਤਰ ਹੈ। ਬੈਂਕ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲਈ ਇਹ ਲਾਜ਼ਮੀ ਹੈ।',
      or: 'ଆଧାର ଭାରତ ସରକାରଙ୍କ ଦ୍ୱାରା ପ୍ରଦତ୍ତ ୧୨ ଅଙ୍କର ପରିଚୟ ପତ୍ର।',
      as: 'আধাৰ ভাৰত চৰকাৰৰ দ্বাৰা প্ৰদান কৰা ১২টা সংখ্যাৰ পৰিচয় পত্ৰ।',
      ur: 'آدھار حکومت ہند کی طرف سے جاری کردہ 12 ہندسوں کا منفرد شناختی کارڈ ہے۔ اپنا آدھار OTP کبھی کسی کو نہ بتائیں۔',
    },
    followupSuggestions: {
      ta: ['ஆதார் அட்டையில் முகவரி மாற்றுவது எப்படி?', 'ஆதாரில் செல்போன் எண் இணைப்பது எப்படி?'],
      hi: ['आधार में पता कैसे बदलें?', 'आधार में मोबाइल नंबर कैसे जोड़ें?'],
      en: ['How do I update the address on my Aadhaar?', 'How do I link my mobile number to Aadhaar?'],
    },
  },

  // General: What is Photosynthesis?
  'general-photosynthesis': {
    taskType: 'general',
    mode: 'direct_answer',
    interpretedMeaning: {
      ta: 'ஒளிச்சேர்க்கை (Photosynthesis) என்றால் என்ன என்று அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि प्रकाश संश्लेषण (Photosynthesis) क्या है।',
      en: 'You want to know what photosynthesis is in plain language.',
      mr: 'प्रकाश संश्लेषण काय आहे हे जाणून घ्यायचे आहे.',
      gu: 'પ્રકાશ સંશ્લેષણ શું છે તે જાણવું છે.',
      te: 'కిరణజన్య సంయోగ క్రియ అంటే ఏమిటో తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಎಂದರೇನು ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'പ്രകാശസംശ്ലേഷണം എന്നാൽ എന്താണെന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'সালোকসংশ্লেষ কী জানতে চান।',
      pa: 'ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ ਕੀ ਹੁੰਦਾ ਹੈ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ଆଲୋକ ସଂଶ୍ଳେଷଣ କ’ଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'সালোক সংশ্লেষণ কি জানিব বিচাৰিছে।',
      ur: 'آپ جاننا چاہتی ہیں کہ ضیائی تالیف (Photosynthesis) کیا ہے۔',
    },
    directAnswer: {
      ta: 'ஒளிச்சேர்க்கை என்பது தாவரங்கள் (செடி, கொடி, மரங்கள்) சூரிய ஒளி, தண்ணீர் மற்றும் காற்றில் உள்ள கார்பன் டை ஆக்சைடைப் பயன்படுத்தி தங்களுக்குத் தேவையான உணவைத் தயாரித்துக்கொள்ளும் அற்புதமான இயற்கை சமையல் முறை! இலைகளில் உள்ள பச்சையம் (Chlorophyll) சூரிய ஒளியை உறிஞ்சி இந்த உணவைத் தயாரிக்கிறது. மிக விசேஷமான விஷயம் என்னவென்றால், இந்த நிகழ்வின் முடிவில் மரங்கள் மனிதர்களாகிய நாம் சுவாசிப்பதற்குத் தேவையான சுத்தமான ஆக்ஸிஜனை (பிராணவாயு) வெளியிடுகின்றன.',
      hi: 'प्रकाश संश्लेषण (Photosynthesis) प्रकृति का वह अद्भुत नियम है जिसके द्वारा पेड़-पौधे धूप, पानी और हवा से अपना भोजन बनाते हैं! हरी पत्तियों में मौजूद क्लोरोफिल सूर्य की रोशनी को सोखता है। सबसे खास बात यह है कि अपना भोजन बनाने के बाद पौधे हमारे सांस लेने के लिए ताजी ऑक्सीजन हवा में छोड़ते हैं।',
      en: 'Photosynthesis is the wondrous natural process by which green plants make their own food using sunlight, water from the soil, and carbon dioxide from the air! The green pigment in leaves (chlorophyll) captures solar energy like a tiny solar kitchen. As a beautiful gift to all living beings, plants release life-giving fresh oxygen into the air during this process.',
      mr: 'प्रकाश संश्लेषण म्हणजे वनस्पती सूर्यप्रकाश, पाणी आणि हवेतील कार्बन डायऑक्साइडच्या मदतीने स्वतःचे अन्न तयार करतात आणि आपल्याला ऑक्सिजन देतात.',
      gu: 'પ્રકાશ સંશ્લેષણ એટલે વનસ્પતિ સૂર્યપ્રકાશ, પાણી અને હવાથી પોતાનો ખોરાક બનાવે છે અને આપણને ઓક્સિજન આપે છે.',
      te: 'మొక్కలు సూర్యకాంతి, నీరు మరియు గాలిని ఉపయోగించి ఆహారాన్ని తయారు చేసుకుని మనకు ప్రాణవాయువును అందించే ప్రక్రియ.',
      kn: 'ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಗಾಳಿಯನ್ನು ಬಳಸಿ ಆಹಾರ ತಯಾರಿಸಿ ನಮಗೆ ಆಮ್ಲಜನಕ ನೀಡುವ ಪ್ರಕ್ರಿಯೆ.',
      ml: 'സസ്യങ്ങൾ സൂര്യപ്രകാശവും വെള്ളവും ഉപയോഗിച്ച് ആഹാരം നിർമ്മിക്കുകയും നമുക്ക് പ്രാണവായു നൽകുകയും ചെയ്യുന്ന പ്രക്രിയ.',
      bn: 'উদ্ভিদ সূর্যের আলো, জল ও বাতাসের সাহায্যে নিজের খাদ্য তৈরি করে এবং আমাদের অক্সিজেন দেয়।',
      pa: 'ਪੌਦੇ ਧੁੱਪ, ਪਾਣੀ ਅਤੇ ਹਵਾ ਦੀ ਮਦਦ ਨਾਲ ਆਪਣਾ ਭੋਜਨ ਬਣਾਉਂਦੇ ਹਨ ਅਤੇ ਸਾਨੂੰ ਆਕਸੀਜਨ ਦਿੰਦੇ ਹਨ।',
      or: 'ଗଛଲତା ସୂର୍ଯ୍ୟାଲୋକ, ପାଣି ଓ ପବନରୁ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତ କରି ଆମକୁ ଅମ୍ଳଜାନ ପ୍ରଦାନ କରନ୍ତି।',
      as: 'উদ্ভিদে সূৰ্যৰ পোহৰ, পানী আৰু বতাহৰ সহায়ত নিজৰ খাদ্য তৈয়াৰ কৰি আমাক অক্সিজেন দিয়ে।',
      ur: 'پودے سورج کی روشنی، پانی اور ہوا کی مدد سے اپنی غذا تیار کرتے ہیں اور ہمیں زندہ رہنے کے لیے آکسیجن فراہم کرتے ہیں۔',
    },
  },
};

// 3. Main Universal Understanding Pipeline
export async function understandUserNeed(
  rawInput: string,
  preferredLanguage: Language,
  conversationHistory: ChatMessage[] = []
): Promise<IntentResult> {
  const trimmed = rawInput.trim();
  const detectedLang = detectLanguageFromText(trimmed, preferredLanguage);

  // Check if live Gemini API key is available
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    try {
      const liveResult = await callGeminiUniversal(trimmed, conversationHistory, detectedLang, apiKey);
      if (liveResult) return liveResult;
    } catch (err) {
      console.warn('Gemini live call error, falling back to local universal knowledge engine:', err);
    }
  }

  // 1. Check local Universal Resource templates (Travel, Navigation, Cinema, Cooking, WhatsApp, Electricity, Aadhaar, Science)
  const universalMatch = matchUniversalResource(trimmed);
  if (universalMatch) {
    const domainData = UNIVERSAL_DOMAIN_ANSWERS[universalMatch.id];
    const meaning = domainData?.interpretedMeaning[detectedLang] || domainData?.interpretedMeaning[preferredLanguage] || domainData?.interpretedMeaning.en || trimmed;
    const directAnswer = domainData?.directAnswer[detectedLang] || domainData?.directAnswer[preferredLanguage] || domainData?.directAnswer.en || 'HARSHU will guide you.';
    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === detectedLang);

    return {
      category: universalMatch.category,
      taskType: universalMatch.taskType,
      rawInput: trimmed,
      recognizedText: trimmed,
      detectedLanguage: detectedLang,
      detectedLanguageName: langMeta ? `${langMeta.nativeLabel} (${langMeta.label})` : detectedLang,
      interpretedMeaning: meaning,
      directAnswer,
      summaryByLanguage: {
        ta: domainData?.interpretedMeaning.ta || meaning,
        hi: domainData?.interpretedMeaning.hi || meaning,
        en: domainData?.interpretedMeaning.en || meaning,
      },
      schemeId: universalMatch.id,
      discoveredResource: universalMatch,
      mode: universalMatch.mode || 'guided',
      followupSuggestions: domainData?.followupSuggestions,
      isAiGenerated: false,
    };
  }

  // 2. Check Dynamic Government / Citizen Service Discovery
  const discoveredGov = await discoverOfficialResource(trimmed, detectedLang);
  if (discoveredGov && (discoveredGov.id === 'national-scholarship-portal' || discoveredGov.id === 'pm-vishwakarma' || discoveredGov.id === 'pm-mudra-yojana' || discoveredGov.id === 'tnega-esevai' || discoveredGov.id === 'free-sewing-machine' || discoveredGov.id === 'pudhumai-penn-scholarship' || discoveredGov.id === 'magalir-urimai-thittam' || discoveredGov.id === 'pm-kaushal-vikas-yojana')) {
    const isScholarship = discoveredGov.id.includes('scholarship');
    const isSkills = discoveredGov.id.includes('sewing') || discoveredGov.id.includes('vishwakarma');
    const isJobs = discoveredGov.id.includes('mudra') || discoveredGov.id.includes('kaushal');
    const isWelfare = discoveredGov.id.includes('magalir');

    let templateKey = 'scholarship';
    if (isSkills) templateKey = 'skills';
    else if (isJobs) templateKey = 'jobs';
    else if (isWelfare) templateKey = 'welfare';

    const fallbackMeaning = isScholarship
      ? 'மாணவர்களுக்கான அரசு கல்வி உதவித்தொகை பற்றி அறிய விரும்புகிறீர்கள்.'
      : isSkills
      ? 'தையல் பயிற்சி மற்றும் இலவச தையல் இயந்திர உதவி பற்றி அறிய விரும்புகிறீர்கள்.'
      : 'அரசு உதவி மற்றும் வேலைவாய்ப்பு பற்றி அறிய விரும்புகிறீர்கள்.';

    const fallbackAnswer = isScholarship
      ? 'ஆம், நிச்சயமாக! கல்லூரி மற்றும் பள்ளி மாணவர்களுக்காக தேசிய உதவித்தொகை தளம் (NSP) மற்றும் மாநில அரசுகளின் பல்வேறு உதவித்தொகைகள் உள்ளன. HARSHU உங்களுக்கு விண்ணப்பிக்கும் முறையை ஒரு படியாக காட்டும்.'
      : isSkills
      ? 'ஆம்! பெண்களுக்கு இலவச தையல் பயிற்சி மற்றும் இலவச தையல் இயந்திர உதவி திட்டங்கள் உள்ளன. இதற்கு தேவையான ஆவணங்களை HARSHU உங்களுக்கு விளக்கும்.'
      : 'ஆம்! இதற்கான அரசு சேவைகள் மற்றும் வழிகாட்டுதல்கள் உள்ளன. HARSHU உங்களுக்கு ஒரு படியாக வழிகாட்டும்.';

    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === detectedLang);

    return {
      category: discoveredGov.category,
      taskType: 'government',
      rawInput: trimmed,
      recognizedText: trimmed,
      detectedLanguage: detectedLang,
      detectedLanguageName: langMeta ? `${langMeta.nativeLabel} (${langMeta.label})` : detectedLang,
      interpretedMeaning: fallbackMeaning,
      directAnswer: fallbackAnswer,
      summaryByLanguage: {
        ta: fallbackMeaning,
        hi: fallbackMeaning,
        en: fallbackMeaning,
      },
      schemeId: discoveredGov.id,
      discoveredResource: discoveredGov,
      mode: 'guided',
      isAiGenerated: false,
    };
  }

  // 3. Fallback Universal Open-Ended Response
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === detectedLang);
  const friendlyMeaning = detectedLang === 'ta'
    ? `"${trimmed}" பற்றி அறிய விரும்புகிறீர்கள்.`
    : detectedLang === 'hi'
    ? `आप "${trimmed}" के बारे में जानना चाहती हैं।`
    : `You want guidance regarding "${trimmed}".`;

  const friendlyAnswer = detectedLang === 'ta'
    ? `நிச்சயமாக! HARSHU உங்களுக்கு "${trimmed}" குறித்து தேவையான அனைத்து தகவல்களையும் எளிய தமிழில் விளக்கி, அடுத்தடுத்த படிகளில் வழிகாட்டும். பயப்பட வேண்டாம், நாம் சேர்ந்து செய்வோம்.`
    : detectedLang === 'hi'
    ? `बिल्कुल! HARSHU आपको "${trimmed}" के बारे में सरल और स्पष्ट जानकारी देकर आगे का रास्ता बताएगा। चिंता न करें, हम मिलकर करेंगे।`
    : `Yes, certainly! HARSHU will explain everything you need to know about "${trimmed}" in simple words and guide you step by step. Don't worry, let's do it together.`;

  return {
    category: 'other',
    taskType: 'other',
    rawInput: trimmed,
    recognizedText: trimmed,
    detectedLanguage: detectedLang,
    detectedLanguageName: langMeta ? `${langMeta.nativeLabel} (${langMeta.label})` : detectedLang,
    interpretedMeaning: friendlyMeaning,
    directAnswer: friendlyAnswer,
    summaryByLanguage: {
      ta: friendlyMeaning,
      hi: friendlyMeaning,
      en: friendlyMeaning,
    },
    schemeId: 'universal-general-guide',
    discoveredResource: discoveredGov,
    mode: 'direct_answer',
    isAiGenerated: false,
  };
}

// 4. Live Gemini API Universal Call (with Google Search Grounding when relevant)
async function callGeminiUniversal(
  rawInput: string,
  history: ChatMessage[],
  detectedLang: Language,
  apiKey: string
): Promise<IntentResult | null> {
  const client = new GoogleGenAI({ apiKey });

  const isCurrentInfoQuery =
    /bus|train|ticket|schedule|timing|route|location|today|fare|cost|price|பேருந்து|ரயில்|டிக்கெட்|நேரம்|வழி|बस|ट्रेन|किराया|समय/.test(
      rawInput.toLowerCase()
    );

  const historyContext = history.length > 0
    ? `\nPrior conversation turns:\n${history
        .map((h) => `${h.role === 'user' ? 'User' : 'HARSHU'}: ${h.text}`)
        .join('\n')}\n`
    : '';

  const systemInstruction = `You are HARSHU, a compassionate, patient, maternal, highly accessible AI digital companion designed specifically for a first-time or low-confidence woman internet user in India.
HARSHU is a UNIVERSAL companion. She can ask about ANY topic:
- Travel / transportation (bus routes, bus stands like CMBT/Tambaram, timings, fares)
- Navigation / local transit (walking routes, stations like Chennai Central to Chennai Park subway)
- Online booking (cinema movie tickets on BookMyShow, train UTS, bus tickets)
- Cooking / recipes (authentic recipes like biriyani, ingredients, measurements, simple cooking steps)
- Technology (setting up WhatsApp, using mobile apps, play store, phone settings)
- Online payments (paying electricity bill online, consumer number, UPI safety, TANGEDCO/BBPS)
- Government services & scholarships (National Scholarship Portal, Pudhumai Penn, Vishwakarma, etc.)
- Everyday general knowledge (what is Aadhaar, what is photosynthesis, health precautions).

CRITICAL RULES:
1. Answer the user's ACTUAL question directly in her own language (${detectedLang}).
2. Do NOT just rephrase or translate her question. Provide real, factual, helpful information.
3. Tone: Gentle, warm, reassuring, plain language, maternal. Never sound robotic or arrogant.
4. Safety: Never ask for OTP, passwords, or bank PIN.
5. If it's a practical digital or physical task (booking, travel, cooking, tech, payment), provide 3 to 5 gentle "Do It With Me" steps.
6. If it's a general question (e.g. "What is photosynthesis?"), set mode="direct_answer" and do NOT force unnecessary steps.
7. Return ONLY valid JSON matching this exact structure:
{
  "detectedLanguage": "${detectedLang}",
  "taskType": "travel" | "navigation" | "booking" | "cooking" | "technology" | "payment" | "government" | "general",
  "mode": "direct_answer" | "guided" | "recipe" | "travel" | "service",
  "interpretedMeaning": "Clear one-sentence summary of what she needs in her language",
  "directAnswer": "The actual direct, factual, helpful, patient answer to her question in her language",
  "destinationTitle": "Title of the resource or guide in her language",
  "destinationDepartment": "Department, Authority, or Platform name",
  "destinationUrl": "Verified official URL if applicable (e.g. https://scholarships.gov.in, https://in.bookmyshow.com, https://www.tnstc.in, https://www.whatsapp.com, https://www.tnebnet.org), or leave empty",
  "steps": [
    {
      "stepNumber": 1,
      "totalSteps": 3,
      "title": "Short title in her language",
      "instruction": "Detailed clear instruction",
      "simplifiedInstruction": "Super simple explanation for low-confidence user",
      "example": "Helpful example"
    }
  ],
  "followupSuggestions": ["Quick follow-up question 1", "Quick follow-up question 2"]
}`;

  const prompt = `${historyContext}User just asked: "${rawInput}"
Detected language/script: ${detectedLang}`;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction,
      tools: isCurrentInfoQuery ? [{ googleSearch: {} }] : undefined,
    },
  });

  const text = response.text?.trim() || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  const parsed = JSON.parse(jsonMatch[0]);
  const lang = (parsed.detectedLanguage as Language) || detectedLang;
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);

  // Construct dynamic Resource object from Gemini output if steps or destination provided
  let discoveredResource: Resource | undefined;
  if (parsed.steps && parsed.steps.length > 0) {
    const stepsFormatted = parsed.steps.map((st: any, idx: number) => ({
      stepNumber: idx + 1,
      totalSteps: parsed.steps.length,
      title: st.title || `Step ${idx + 1}`,
      instruction: st.instruction || '',
      simplifiedInstruction: st.simplifiedInstruction || st.instruction || '',
      example: st.example || '',
      actionType: idx === parsed.steps.length - 1 ? 'external_handoff' : 'confirm_details',
      options: [lang === 'ta' ? 'புரிந்தது' : lang === 'hi' ? 'समझ आ गया' : 'Understood'],
      badge: lang === 'ta' ? `படி ${idx + 1} / ${parsed.steps.length}` : `Step ${idx + 1} of ${parsed.steps.length}`,
    }));

    discoveredResource = {
      id: `dynamic-${parsed.taskType || 'task'}-${Date.now()}`,
      category: parsed.taskType || 'other',
      taskType: parsed.taskType || 'other',
      mode: parsed.mode || 'guided',
      title: { [lang]: parsed.destinationTitle || parsed.interpretedMeaning, en: parsed.interpretedMeaning },
      department: { [lang]: parsed.destinationDepartment || 'HARSHU Digital Companion', en: 'HARSHU Digital Companion' },
      whatItHelps: { [lang]: parsed.directAnswer, en: parsed.directAnswer },
      whoItIsFor: { [lang]: 'அனைத்து பயனர்கள்', hi: 'सभी उपयोगकर्ता', en: 'All users' },
      eligibility: { [lang]: [] },
      documents: { [lang]: [] },
      officialSource: parsed.destinationDepartment || 'Verified Guide',
      officialSourceName: parsed.destinationDepartment || 'Verified Guide',
      officialUrl: parsed.destinationUrl || 'https://services.india.gov.in',
      sourceType: parsed.destinationUrl?.includes('.gov.in') ? 'official' : 'government-backed',
      verified: true,
      lastVerified: 'Active 2026',
      steps: {
        [lang]: stepsFormatted,
        en: stepsFormatted,
      },
    };
  }

  return {
    category: parsed.taskType || 'other',
    taskType: parsed.taskType || 'other',
    rawInput,
    recognizedText: rawInput,
    detectedLanguage: lang,
    detectedLanguageName: langMeta ? `${langMeta.nativeLabel} (${langMeta.label})` : lang,
    interpretedMeaning: parsed.interpretedMeaning || rawInput,
    directAnswer: parsed.directAnswer || '',
    summaryByLanguage: {
      [lang]: parsed.interpretedMeaning || rawInput,
      en: parsed.interpretedMeaning || rawInput,
    },
    schemeId: discoveredResource?.id || 'dynamic-task',
    discoveredResource,
    mode: parsed.mode || 'guided',
    followupSuggestions: parsed.followupSuggestions ? { [lang]: parsed.followupSuggestions } : undefined,
    isAiGenerated: true,
  };
}
