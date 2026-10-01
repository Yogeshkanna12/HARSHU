import { GoogleGenAI } from '@google/genai';
import { Language, IntentResult, IntentCategory } from '../types/index';
import { SUPPORTED_LANGUAGES } from './speech';

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
      /आहे|नाही|करायचे|शिकायचे|पाहिजे|मिळेल|का\?|होय|माहिती|योजना/.test(trimmed);
    return isMarathi ? 'mr' : 'hi';
  }

  // Transliteration / Roman script checks
  const lower = trimmed.toLowerCase();

  // Tanglish markers
  if (
    /thaiyal|thayyal|udavi|velai|enakku|ennaku|kalvi|magalir|kedaikuma|padika|kandupidika|scholarship/.test(
      lower
    ) &&
    /enakku|ennaku|udavi|thaiyal|velai|kedaikuma/.test(lower)
  ) {
    return 'ta';
  }

  // Hinglish markers
  if (
    /chahiye|karna|kaam|silai|yojana|madad|batao|kya|hoga|milega|padhai|kare|paisa/.test(
      lower
    )
  ) {
    return 'hi';
  }

  // Marathlish
  if (/mala|kam|shikayche|ahe|kahi|madat|pahije/.test(lower)) {
    return 'mr';
  }

  // Telugulish
  if (/naku|kavali|pani|nerchukovali|sahayam/.test(lower)) {
    return 'te';
  }

  // Kannadlish
  if (/nanage|beku|kelsa|sahaya/.test(lower)) {
    return 'kn';
  }

  // If mostly English alphabet
  if (/^[a-zA-Z0-9\s.,!?'"()-]+$/.test(trimmed)) {
    return 'en';
  }

  return fallbackLang;
}

// 2. Comprehensive Multilingual Knowledge Base for Direct Answers
interface DomainAnswerTemplate {
  interpretedMeaning: Record<Language, string>;
  directAnswer: Record<Language, string>;
  clarificationText?: Record<Language, string>;
  clarificationOptions?: Record<Language, string[]>;
}

const DOMAIN_ANSWERS: Record<string, DomainAnswerTemplate> = {
  scholarship: {
    interpretedMeaning: {
      ta: 'மாணவர்களுக்கான இலவச அரசு கல்வி உதவித்தொகை உள்ளதா என அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि क्या छात्रों के लिए सरकारी छात्रवृत्ति उपलब्ध है।',
      en: 'You want to know if government scholarships are available for students.',
      mr: 'विद्यार्थ्यांसाठी सरकारी शिष्यवृत्ती उपलब्ध आहे का, हे तुम्हाला जाणून घ्यायचे आहे.',
      gu: 'તમે જાણવા માંગો છો કે વિદ્યાર્થીઓ માટે સરકારી શિષ્યવૃત્તિ ઉપલબ્ધ છે કે નહીં.',
      te: 'విద్యార్థులకు ప్రభుత్వ స్కాలర్‌షిప్‌లు అందుబాటులో ఉన్నాయా అని మీరు తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸರ್ಕಾರಿ ವಿದ್ಯಾರ್ಥಿವೇತನ ಲಭ್ಯವಿದೆಯೇ ಎಂದು ನೀವು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'വിദ്യാർത്ഥികൾക്ക് സർക്കാർ സ്കോളർഷിപ്പ് ലഭ്യമാണോ എന്ന് അറിയാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നു.',
      bn: 'আপনি জানতে চান যে শিক্ষার্থীদের জন্য কোনো সরকারি বৃত্তি পাওয়া যায় কি না।',
      pa: 'ਤੁਸੀਂ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ ਕਿ ਕੀ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਕੋਈ ਸਰਕਾਰੀ ਸਕਾਲਰਸ਼ਿਪ ਉਪਲਬਧ ਹੈ।',
      or: 'ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ସରକାରୀ ବୃତ୍ତି ଉପଲବ୍ଧ ଅଛି କି ନାହିଁ ଆପଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'ছাত্ৰ-ছাত্ৰীৰ বাবে চৰকাৰী বৃত্তি উপলব্ধ নেকি আপুনি জানিব বিচাৰিছে।',
      ur: 'آپ جاننا چاہتی ہیں کہ کیا طلبہ کے لیے سرکاری وظائف دستیاب ہیں۔',
    },
    directAnswer: {
      ta: 'ஆம், நிச்சயமாக! அரசாங்கத்தின் சார்பில் பள்ளி மற்றும் கல்லூரி மாணவர்களுக்காக பல்வேறு கல்வி உதவித்தொகைகள் வழங்கப்படுகின்றன. குறிப்பாக மாணவிகளுக்கு மாதம் ₹1,000 வழங்கும் "புதுமைப் பெண் திட்டம்", போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை மற்றும் தேசிய உதவித்தொகை தளம் (NSP) மூலமாக கட்டணச் சலுகைகள் உள்ளன. இதில் நீங்கள் பயன்பெற தேவையான தகுதிகள் மற்றும் விண்ணப்பிக்கும் முறையை HARSHU உங்களுக்கு ஒரு படியாக வழிகாட்டும்.',
      hi: 'हाँ, बिल्कुल! सरकार की ओर से स्कूली और कॉलेज छात्राओं के लिए कई महत्वपूर्ण छात्रवृत्तियां उपलब्ध हैं। विशेषकर कॉलेज जाने वाली छात्राओं को प्रतिमाह ₹1,000 की वित्तीय सहायता (पुधुमै पेन योजना) तथा राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) के तहत पूरी फीस माफी व सहायता दी जाती है। HARSHU आपको इसके लिए आवेदन करने का सीधा तरीका बताएगा।',
      en: 'Yes, absolutely! The government provides several robust scholarship programs for students. In particular, college girl students receive ₹1,000 monthly direct financial support under the Pudhumai Penn Scheme, alongside post-matric and National Scholarship Portal (NSP) tuition grants. HARSHU will guide you step by step to verify eligibility and apply.',
      mr: 'होय, नक्कीच! शासनामार्फत शालेय आणि महाविद्यालयीन विद्यार्थ्यांसाठी विविध शिष्यवृत्ती योजना उपलब्ध आहेत. विशेषतः उच्च शिक्षण घेणाऱ्या मुलींना मासिक आर्थिक साहाय्य, सावित्रीबाई फुले शिष्यवृत्ती आणि महाडीबीटी पोर्टलद्वारे फी माफी दिली जाते. HARSHU तुम्हाला यासाठी पायरी-पायरीने मार्गदर्शन करेल.',
      gu: 'હા, ચોક્કસપણે! સરકાર દ્વારા શાળા અને કોલેજના વિદ્યાર્થીઓ માટે વિવિધ શિષ્યવૃત્તિ યોજનાઓ આપવામાં આવે છે. ખાસ કરીને વિદ્યાર્થીનીઓ માટે માસિક સહાય અને ડિજિટલ ગુજરાત તથા રાષ્ટ્રીય સ્કોલરશિપ પોર્ટલ દ્વારા ફી માફી ઉપલબ્ધ છે. HARSHU તમને આમાં પૂરી સહાય કરશે.',
      te: 'అవును, ఖచ్చితంగా! ప్రభుత్వం విద్యార్థుల కోసం అనేక స్కాలర్‌షిప్ పథకాలను అందిస్తోంది. ముఖ్యంగా కళాశాల విద్యార్థినులకు నెలకు ₹1,000 ఆర్థిక సహాయం మరియు పూర్తి ఫీజు రీయింబర్స్‌మెంట్ అందుబాటులో ఉన్నాయి. అర్హతలు మరియు దరఖాస్తు విధానాన్ని HARSHU మీకు సులభంగా వివరిస్తుంది.',
      kn: 'ಹೌದು, ಖಂಡಿತವಾಗಿಯೂ! ಶಾಲಾ ಮತ್ತು ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸರ್ಕಾರದಿಂದ ಅನೇಕ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು ಲಭ್ಯವಿವೆ. ವಿಶೇಷವಾಗಿ ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ಮಾಸಿಕ ಸಹಾಯಧನ ಮತ್ತು ಪೂರ್ಣ ಶುಲ್ಕ ವಿನಾಯಿತಿ ಯೋಜನೆಗಳಿವೆ. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಸುಲಭ ಹಂತಗಳನ್ನು HARSHU ನಿಮಗೆ ಕಲಿಸುತ್ತದೆ.',
      ml: 'അതെ, തീർച്ചയായും! വിദ്യാർത്ഥികൾക്കായി സ്കൂൾ, കോളേജ് തലങ്ങളിൽ സർക്കാർ വിവിധ സ്കോളർഷിപ്പുകൾ നൽകുന്നുണ്ട്. പ്രത്യേകിച്ച് പെൺകുട്ടികൾക്ക് പ്രതിമാസ ധനസഹായവും സൗജന്യ പഠനാനുകൂല്യങ്ങളും ലഭ്യമാണ്. ഇതിനായി അപേക്ഷിക്കേണ്ട രീതി HARSHU നിങ്ങൾക്ക് പറഞ്ഞുതരും.',
      bn: 'হ্যাঁ, অবশ্যই! সরকার স্কুল এবং কলেজের শিক্ষার্থীদের জন্য একাধিক গুরুত্বপূর্ণ বৃত্তি প্রদান করে থাকে। বিশেষ করে কন্যাশ্রী প্রকল্প এবং উচ্চশিক্ষার স্কলারশিপের মাধ্যমে ছাত্রীদের প্রতি মাসে সরাসরি আর্থিক সহায়তা দেওয়া হয়। HARSHU আপনাকে ধাপে ধাপে আবেদন করতে সাহায্য করবে।',
      pa: 'ਹਾਂਜੀ, ਬਿਲਕੁਲ! ਸਰਕਾਰ ਵੱਲੋਂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਕਈ ਵਜੀਫ਼ਾ ਸਕੀਮਾਂ ਉਪਲਬਧ ਹਨ। ਖਾਸ ਕਰਕੇ ਲੜਕੀਆਂ ਦੀ ਉਚੇਰੀ ਸਿੱਖਿਆ ਲਈ ਮਹੀਨਾਵਾਰ ਸਹਾਇਤਾ ਅਤੇ ਫੀਸ ਮੁਆਫੀ ਮਿਲਦੀ ਹੈ। HARSHU ਤੁਹਾਨੂੰ ਪੂਰੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਾਏਗਾ।',
      or: 'ହଁ, ନିଶ୍ଚିତ ଭାବରେ! ସରକାରଙ୍କ ତରଫରୁ ଛାତ୍ରଛାତ୍ରୀମାନଙ୍କ ପାଇଁ ବହୁତ ଗୁଡିଏ ବୃତ୍ତି ଯୋଜନା ଉପଲବ୍ଧ ଅଛି। ବିଶେଷ କରି ଛାତ୍ରୀମାନଙ୍କ ଉଚ୍ଚଶିକ୍ଷା ପାଇଁ ମାସିକ ସହାୟତା ମିଳୁଛି। HARSHU ଆପଣଙ୍କୁ ସମ୍ପୂର୍ଣ୍ଣ ସାହାଯ୍ୟ କରିବ।',
      as: 'হয়, নিশ্চিতভাৱে! ছাত্ৰ-ছাত্ৰীৰ বাবে চৰকাৰৰ বিভিন্ন বৃত্তি আঁচনি আছে। বিশেষকৈ ছোৱালীৰ উচ্চ শিক্ষাৰ বাবে মাহেকীয়া সাহায্য উপলব্ধ। HARSHU-ৱে আপোনাক সকলো সহায় কৰিব।',
      ur: 'جی ہاں، بالکل! حکومت طالبات اور طلبہ کے لیے متعدد وظائف فراہم کرتی ہے۔ خاص طور پر اعلیٰ تعلیم کے لیے طالبات کو ماہانہ مالی امداد اور فیس میں رعایت دی جاتی ہے۔ HARSHU آپ کو اس کا آسان طریقہ سمجھائے گا۔',
    },
  },

  skills: {
    interpretedMeaning: {
      ta: 'தையல் பயிற்சி மற்றும் இலவச தையல் இயந்திர உதவி பற்றி அறிய விரும்புகிறீர்கள்.',
      hi: 'आप सिलाई सीखने और मुफ्त सिलाई मशीन सहायता के बारे में जानना चाहती हैं।',
      en: 'You want to know about free tailoring skill training and sewing machine support.',
      mr: 'शिवਣकाम शिकणे आणि मोफत शिलाई मशीन योजनेबद्दल जाणून घ्यायचे आहे.',
      gu: 'તમે સિલાઈ કામ શીખવા અને મફત સિલાઈ મશીન સહાય વિશે જાણવા માંગો છો.',
      te: 'కుట్టు పని నేర్చుకోవడం మరియు ఉచిత కుట్టు మిషన్ సహాయం గురించి తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಹೊಲಿಗೆ ತರಬೇತಿ ಮತ್ತು ಉಚಿತ ಹೊಲಿಗೆ ಯಂತ್ರದ ಸಹಾಯದ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'തയ്യൽ പരിശീലനവും സൗജന്യ തയ്യൽ മെഷീൻ സഹായവും സംബന്ധിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'আপনি সেলাই কাজ শেখা এবং বিনামূল্যে সেলাই মেশিন সহায়তা সম্পর্কে জানতে চান।',
      pa: 'ਤੁਸੀਂ ਸਿਲਾਈ ਸਿੱਖਣ ਅਤੇ ਮੁਫ਼ਤ ਸਿਲਾਈ ਮਸ਼ੀਨ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ଆପଣ ସିଲେଇ ତାଲିମ ଏବଂ ମାଗଣା ସିଲେଇ ମେସିନ୍ ସହାୟତା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'আপুনি চিলাই প্ৰশিক্ষণ আৰু বিনামূলীয়া চিলাই মেচিন সাহায্য সম্পৰ্কে জানিব বিচাৰিছে।',
      ur: 'آپ سلائی کا کام سیکھنے اور مفت سلائی مشین کی اسکیم کے بارے میں جاننا چاہتی ہیں۔',
    },
    directAnswer: {
      ta: 'ஆம், சமூக நலத்துறை மற்றும் திறன் மேம்பாட்டுக் கழகம் (TNSDC) சார்பாக பெண்களுக்கு முற்றிலும் இலவச தையல் பயிற்சி மற்றும் சத்யவாணி முத்து அம்மையார் நினைவு திட்டத்தின் கீழ் இலவச தையல் இயந்திரம் வழங்கப்படுகிறது. 20 முதல் 45 வயதுக்குட்பட்ட பெண்கள் விண்ணப்பித்து வீட்டில் இருந்தே வருமானம் ஈட்டலாம். இதற்கு தேவையான ஆவணங்கள் மற்றும் விண்ணப்பிக்கும் முறையை நாம் சேர்ந்து செய்வோம்.',
      hi: 'हाँ, सरकार द्वारा महिलाओं को घर बैठे आत्मनिर्भर बनाने के लिए मुफ्त सिलाई प्रशिक्षण और मुफ्त सिलाई मशीन योजना चलाई जा रही है। 20 से 45 वर्ष की महिलाएं इसके लिए पात्र हैं। HARSHU आपको बताएगा कि इसके लिए कौन से 3 दस्तावेज चाहिए और आवेदन कैसे करना है।',
      en: 'Yes! The Directorate of Social Welfare and Skill Development Mission provide free tailoring certification courses along with a free sewing machine for eligible women aged 20 to 45. This enables you to earn a respectable income directly from home. HARSHU will walk you through the documents and application process.',
      mr: 'होय! महिला व बालविकास विभाग आणि कौशल्य विकास अभियानांतर्गत मोफत शिलाई प्रशिक्षण आणि गरजू महिलांना मोफत शिलाई मशीन दिली जाते. २० ते ४५ वयोगटातील महिला यासाठी पात्र आहेत. HARSHU तुम्हाला कागदपत्रे आणि अर्ज कसा करायचा हे समजावून सांगेल.',
      gu: 'હા! મહિલાઓને આત્મનિર્ભર બનાવવા માટે સરકાર દ્વારા મફત સિલાઈ તાલીમ અને મફત સિલાઈ મશીન યોજના ચલાવવામાં આવે છે. ૨૦ થી ૪૫ વર્ષની મહિલાઓ આનો લાભ લઈ શકે છે. HARSHU તમને બધી માહિતી સરળ ભાષામાં આપશે.',
      te: 'అవును! మహిళలు స్వయం ఉపాధి పొందడానికి ప్రభుత్వం ఉచిత కుట్టు శిక్షణ మరియు ఉచిత కుట్టు మిషన్ పథకాన్ని అందిస్తోంది. 20 నుండి 45 సంవత్సరాల మహిళలు అర్హులు. దీనికి కావలసిన వివరాలను HARSHU మీకు తెలియజేస్తుంది.',
      kn: 'ಹೌದು! ಮಹಿಳೆಯರು ಸ್ವಾವಲಂಬಿಗಳಾಗಲು ಸರ್ಕಾರವು ಉಚಿತ ಹೊಲಿಗೆ ತರಬೇತಿ ಮತ್ತು ಹೊಲಿಗೆ ಯಂತ್ರ ನೀಡುವ ಯೋಜನೆಗಳನ್ನು ಜಾರಿಗೆ ತಂದಿದೆ. ೨೦ ರಿಂದ ೪೫ ವರ್ಷದ ಮಹಿಳೆಯರು ಅರ್ಹರು. HARSHU ನಿಮಗೆ ಎಲ್ಲ ಹಂತಗಳನ್ನು ಕಲಿಸುತ್ತದೆ.',
      ml: 'അതെ! വനിതകൾക്ക് സ്വയംതൊഴിൽ കണ്ടെത്താനായി സൗജന്യ തയ്യൽ പരിശീലനവും സൗജന്യ തയ്യൽ മെഷീൻ നൽകുന്ന പദ്ധതിയും സർക്കാരിനുണ്ട്. 20 നും 45 നും ഇടയിൽ പ്രായമുള്ളവർക്ക് അപേക്ഷിക്കാം. HARSHU ഇതിൽ നിങ്ങളെ സഹായിക്കും.',
      bn: 'হ্যাঁ! মহিলাদের স্বনির্ভর করতে সরকারের তরফ থেকে বিনামূল্যে সেলাই প্রশিক্ষণ ও বিনামূল্যে সেলাই মেশিন প্রকল্প চালু রয়েছে। ২০ থেকে ৪৫ বছর বয়সী মহিলারা আবেদন করতে পারেন। HARSHU আপনাকে পুরো পথ দেখাবে।',
      pa: 'ਹਾਂਜੀ! ਔਰਤਾਂ ਨੂੰ ਆਪਣੇ ਪੈਰਾਂ ਤੇ ਖੜ੍ਹਾ ਕਰਨ ਲਈ ਮੁਫ਼ਤ ਸਿਲਾਈ ਸਿਖਲਾਈ ਅਤੇ ਸਿਲਾਈ ਮਸ਼ੀਨ ਸਕੀਮ ਉਪਲਬਧ ਹੈ। 20 ਤੋਂ 45 ਸਾਲ ਦੀਆਂ ਔਰਤਾਂ ਅਪਲਾਈ ਕਰ ਸਕਦੀਆਂ ਹਨ।',
      or: 'ହଁ! ମହିଳାମାନଙ୍କୁ ଆତ୍ମନିର୍ଭର କରିବା ପାଇଁ ସରକାର ମାଗଣା ସିଲେଇ ତାଲିମ ଏବଂ ସିଲେଇ ମେସିନ୍ ପ୍ରଦାନ କରୁଛନ୍ତି। HARSHU ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବ।',
      as: 'হয়! মহিলাসকলৰ স্বাৱলম্বনৰ বাবে চৰকাৰৰ বিনামূলীয়া চিলাই প্ৰশিক্ষণ আৰু মেচিন প্ৰদান আঁচনি আছে।',
      ur: 'جی ہاں! خواتین کو بااختیار بنانے کے لیے مفت سلائی کورس اور مفت سلائی مشین کی اسکیم موجود ہے۔ 20 سے 45 سال کی خواتین اس سے فائدہ اٹھا سکتی ہیں۔',
    },
  },

  welfare: {
    interpretedMeaning: {
      ta: 'மகளிர் உரிமைத் தொகை அல்லது குடும்பத் தலைவிகளுக்கான மாதாந்திர உதவித்தொகை பற்றி அறிய விரும்புகிறீர்கள்.',
      hi: 'आप महिलाओं के लिए मासिक वित्तीय सहायता (अधिकार योजना) के बारे में जानना चाहती हैं।',
      en: 'You want to know about the monthly financial assistance grant for female heads of household.',
      mr: 'कुटुंबप्रमुख महिलांसाठी मासिक आर्थिक सन्मान योजनेबद्दल माहिती हवी आहे.',
      gu: 'તમે મહિલાઓ માટેની માસિક સહાય યોજના વિશે જાણવા માંગો છો.',
      te: 'కుటుంబ మహిళలకు లభించే నెలవారీ ఆర్థిక సహాయ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಕುಟುಂಬದ ಮುಖ್ಯ ಮಹಿಳೆಯರಿಗೆ ಸಿಗುವ ಮಾಸಿಕ ಸಹಾಯಧನ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'കുടുംബനാഥകളായ സ്ത്രീകൾക്ക് ലഭിക്കുന്ന പ്രതിമാസ ധനസഹాయ പദ്ധതിയെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'মহিলাদের মাসিক সরকারি আর্থিক সহায়তা প্রকল্প সম্পর্কে জানতে চান।',
      pa: 'ਤੁਸੀਂ ਮਹਿਲਾਵਾਂ ਲਈ ਮਹੀਨਾਵਾਰ ਸਰਕਾਰੀ ਸਹਾਇਤਾ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ମହିଳାମାନଙ୍କ ପାଇଁ ମାସିକ ସରକାରୀ ସହାୟତା ଯୋଜନା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'মহিলাৰ বাবে মাহেকীয়া চৰকাৰী সাহায্য আঁচনি সম্পৰ্কে জানিব বিচাৰিছে।',
      ur: 'آپ خواتین کے لیے ماہانہ مالی امداد اسکیم کے بارے میں جاننا چاہتی ہیں۔',
    },
    directAnswer: {
      ta: 'ஆம்! குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 வாழ்வாதார உரிமைத் தொகையாக வங்கி கணக்கில் நேரடியாக செலுத்தப்படுகிறது. ஸ்மார்ட் ரேஷன் கார்டு மற்றும் ஆதார் வைத்துள்ள 21 வயது நிரம்பிய தகுதியான பெண்கள் இதற்கு விண்ணப்பிக்கலாம். விண்ணப்பிக்கும் முறையை HARSHU உங்களுக்கு மிக எளிமையாக விளக்கும்.',
      hi: 'हाँ! सरकार द्वारा महिला मुखियाओं के सम्मान और आत्मनिर्भरता के लिए प्रतिमाह ₹1,000 की सम्मान राशि सीधे बैंक खाते में दी जा रही है। 21 वर्ष या उससे अधिक आयु की राशन कार्ड धारक महिलाएं इसके लिए पात्र हैं। HARSHU आपको इसका पूरा विवरण देगा।',
      en: 'Yes! The government provides ₹1,000 per month directly into bank accounts for eligible female heads of households under the Women’s Rights Grant. Women aged 21 and above with a Smart Ration Card can enroll. HARSHU will guide you through the process.',
      mr: 'होय! महिलांच्या आर्थिक सबलीकरणासाठी दरमहा थेट बँक खात्यात आर्थिक मदत दिली जाते. २१ वर्षे पूर्ण झालेल्या राशन कार्ड धारक महिला यासाठी अर्ज करू शकतात. HARSHU तुम्हाला संपूर्ण मदत करेल.',
      gu: 'હા! મહિલાઓ માટે દર મહિને સીધા બેંક ખાતામાં સહાય આપતી યોજના કાર્યરત છે. ૨૧ વર્ષથી વધુ વયની રેશનકાર્ડ ધરાવતી મહિલાઓ આનો લાભ લઈ શકે છે.',
      te: 'అవును! కుటుంబ మహిళలకు నెలకు ₹1,000 నేరుగా బ్యాంక్ ఖాతాలో జమ చేసే సంక్షేమ పథకం అమలులో ఉంది. 21 ఏళ్లు నిండిన రేషన్ కార్డు కలిగిన మహిళలు అర్హులు.',
      kn: 'ಹೌದು! ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥ ಮಹಿಳೆಯರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ಜಮೆ ಮಾಡುವ ಯೋಜನೆ ಇದೆ. ರೇಷನ್ ಕಾರ್ಡ್ ಹೊಂದಿರುವ ಮಹಿಳೆಯರು ಅರ್ಹರು.',
      ml: 'അതെ! വനിതകൾക്കായി പ്രതിമാസം ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് പണം നൽകുന്ന വിവിധ ക്ഷേമപദ്ധതികൾ സർക്കാരിനുണ്ട്.',
      bn: 'হ্যাঁ! মহিলাদের জন্য প্রতি মাসে সরাসরি ব্যাঙ্ক অ্যাকাউন্টে আর্থিক সহায়তা দেওয়ার প্রকল্প চালু আছে। রেশন কার্ড থাকা যোগ্য মহিলারা এর জন্য আবেদন করতে পারেন।',
      pa: 'ਹਾਂਜੀ! ਮਹਿਲਾਵਾਂ ਦੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਹਰ ਮਹੀਨੇ ਸਿੱਧੀ ਵਿੱਤੀ ਸਹਾਇਤਾ ਭੇਜੀ ਜਾਂਦੀ ਹੈ।',
      or: 'ହଁ! ମହିଳାମାନଙ୍କ ପାଇଁ ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାରେ ପ୍ରତି ମାସରେ ସହାୟତା ରାଶି ମିଳୁଛି।',
      as: 'হয়! মহিলাসকলৰ বেংক একাউণ্টত প্ৰতিমাহে চৰকাৰী সাহায্য প্ৰদান কৰা হয়।',
      ur: 'جی ہاں! خواتین کو ہر ماہ براہ راست بینک اکاؤنٹ میں مالی وظیفہ دیا جاتا ہے۔ راشن کارڈ رکھنے والی خواتین اس کی اہل ہیں۔',
    },
  },

  jobs: {
    interpretedMeaning: {
      ta: 'வீட்டில் இருந்தே சுயதொழில் அல்லது உள்ளூர் வேலைவாய்ப்பு மற்றும் தொழில் கடன் பற்றி அறிய விரும்புகிறீர்கள்.',
      hi: 'आप घर से काम करने, स्थानीय रोजगार अथवा स्वरोजगार ऋण के बारे में जानना चाहती हैं।',
      en: 'You want to know about home-based self-employment, local jobs, or business loans.',
      mr: 'घरी बसून स्वयंरोजगार, स्थानिक नोकरी आणि व्यवसाय कर्जाबद्दल माहिती हवी आहे.',
      gu: 'તમે ઘરે બેઠા રોજગાર અથવા વ્યવસાય માટે લોન વિશે જાણવા માંગો છો.',
      te: 'ఇంటి నుంచే పని లేదా స్థానిక ఉపాధి మరియు వ్యాపార రుణాల గురించి తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಮನೆಯಿಂದಲೇ ಉದ್ಯೋಗ ಅಥವಾ ಸ್ಥಳೀಯ ಕೆಲಸ ಮತ್ತು ಉದ್ಯಮ ಸಾಲದ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
      ml: 'വീട്ടിലിരുന്ന് ചെയ്യാവുന്ന സ്വയംതൊഴിൽ അല്ലെങ്കിൽ പ്രാദേശിക തൊഴിൽ അവസരങ്ങളെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നു.',
      bn: 'ঘরে বসে কাজ বা স্থানীয় কর্মসংস্থান এবং ব্যবসা ঋণ সম্পর্কে জানতে চান।',
      pa: 'ਤੁਸੀਂ ਘਰ ਬੈਠੇ ਕੰਮ ਜਾਂ ਸਥਾਨਕ ਰੋਜ਼ਗਾਰ ਅਤੇ ਲੋਨ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ।',
      or: 'ଘରେ ବସି ରୋଜଗାର କିମ୍ବା ବ୍ୟବସାୟ ଋଣ ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି।',
      as: 'ঘৰত বহি কৰিব পৰা স্ব-নিয়োজন বা ব্যৱসায় ঋণ সম্পৰ্কে জানিব বিচাৰিছে।',
      ur: 'آپ گھر بیٹھے روزگار یا چھوٹے کاروبار کے لیے قرض کے بارے میں جاننا چاہتی ہیں۔',
    },
    directAnswer: {
      ta: 'ஆம்! பெண்களுக்கு இலவச தொழிற்கல்வி பயிற்சி, கணினி, ஆடை தயாரிப்பு மற்றும் முத்ரா (MUDRA) திட்டத்தின் கீழ் அடமானம் இல்லா சுயதொழில் கடன்கள் வழங்கப்படுகின்றன. நீங்கள் விரும்பும் துறையை தேர்வு செய்து அரசு சான்றிதழுடன் உடனடியாக தொடங்கலாம். HARSHU இதற்கான வழிகளை உங்களுக்கு காட்டும்.',
      hi: 'हाँ! महिलाओं के लिए कौशल विकास (PMKVY) के तहत मुफ्त वोकेशनल ट्रेनिंग और मुद्रा योजना के तहत बिना किसी गारंटी के आसान बिजनेस लोन उपलब्ध है। आप अपनी पसंद का काम सीखकर स्थानीय स्तर पर काम शुरू कर सकती हैं। HARSHU आपका पूरा मार्गदर्शन करेगा।',
      en: 'Yes! The government offers free vocational training across apparel, computers, and handicrafts through skill missions, along with collateral-free MUDRA loans to launch your own enterprise from home. HARSHU will help you discover the nearest center and application steps.',
      mr: 'होय! महिलांसाठी मोफत व्यावसायिक प्रशिक्षण आणि मुद्रा योजनेद्वारे विनातारण व्यवसाय कर्ज उपलब्ध आहे. तुम्ही तुमचे काम सुरू करू शकता आणि HARSHU तुम्हाला सर्व माहिती देईल.',
      gu: 'હા! સરકાર દ્વારા કૌશલ્ય તાલીમ અને મુદ્રા યોજના હેઠળ વ્યવસાય શરૂ કરવા માટે સહેલાઈથી લોન આપવામાં આવે છે.',
      te: 'అవును! మహిళలకు ఉచిత వృత్తి విద్యా శిక్షణ మరియు ముద్రా పథకం కింద సులభమైన వ్యాపార రుణాలు లభిస్తాయి.',
      kn: 'ಹೌದು! ಉಚಿತ ಕೌಶಲ್ಯ ತರಬೇತಿ ಮತ್ತು ಸ್ವಂತ ಉದ್ಯಮ ಆರಂಭಿಸಲು ಮುದ್ರಾ ಸಾಲಗಳು ಸುಲಭವಾಗಿ ದೊರೆಯುತ್ತವೆ.',
      ml: 'അതെ! വനിതകൾക്കായി സൗജന്യ തൊഴിൽ പരിശീലനവും എളുപ്പത്തിൽ ബിസിനസ്സ് ലോണുകളും ലഭ്യമാണ്.',
      bn: 'হ্যাঁ! মহিলাদের জন্য বিনামূল্যে বৃত্তিমূলক প্রশিক্ষণ এবং ব্যবসা শুরুর জন্য মুদ্রা ঋণ প্রকল্প চালু আছে।',
      pa: 'ਹਾਂਜੀ! ਔਰਤਾਂ ਲਈ ਮੁਫ਼ਤ ਕਿੱਤਾਮੁਖੀ ਸਿਖਲਾਈ ਅਤੇ ਮੁਦਰਾ ਲੋਨ ਦੀ ਸਹੂਲਤ ਉਪਲਬਧ ਹੈ।',
      or: 'ହଁ! ମହିଳାମାନଙ୍କ ପାଇଁ ମାଗଣା ତାଲିମ ଏବଂ ମୁଦ୍ରା ଯୋଜନାରେ ବ୍ୟବସାୟ ଋଣ ଉପଲବ୍ଧ ଅଛି।',
      as: 'হয়! মহিলাসকলৰ বাবে বিনামূলীয়া প্ৰশিক্ষণ আৰু মুদ্ৰা ঋণ আঁচনি আছে।',
      ur: 'جی ہاں! خواتین کے لیے مفت ووکیشنل ٹریننگ اور اپنا کام شروع کرنے کے لیے مدرا لون اسکیم موجود ہے۔',
    },
  },
};

// 3. Main Multilingual Intent & Meaning Understanding Engine
export async function understandUserNeed(
  rawInput: string,
  preferredLanguage: Language
): Promise<IntentResult> {
  const trimmed = rawInput.trim();
  const detectedLang = detectLanguageFromText(trimmed, preferredLanguage);

  // Check if user has Gemini API Key for live LLM reasoning
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    try {
      const liveResult = await callGeminiForUnderstanding(trimmed, detectedLang, apiKey);
      if (liveResult) return liveResult;
    } catch (err) {
      console.warn('Gemini live call failed, falling back to local multilingual semantic engine:', err);
    }
  }

  // Local Semantic Parsing across all scripts and transliterations
  const lower = trimmed.toLowerCase();

  // Scholarship intents (Tamil, Hindi, Marathi, Telugu, Kannada, English, etc.)
  const isScholarship =
    /scholarship|படிப்பு|கல்லூரி|பள்ளி|மாணவி|கல்வி|மாணவர்|மாணவர்களுக்கான|உதவித்தொகை|छात्रवृत्ति|शिक्षा|कॉलेज|स्कूल|विद्यार्थी|शिष्यवृत्ती|શિક્ષણ|શિષ્યવૃત્તિ|స్కాలర్‌షిప్|చదువు|ವಿದ್ಯಾರ್ಥಿವೇತನ|ವಿದ್ಯಾರ್ಥಿ|സ്കോളർഷിപ്പ്|പഠനം|বৃত্তি|শিক্ষার্থী|ਵਜੀਫਾ|ବୃତ୍ତି|وظیفہ|تعلیم|school|college|study|student|fees|tuition/.test(
      lower
    ) ||
    /கல்வி உதவித்தொகை|மாணவர்களுக்கான இலவசக் கல்வி|scholarship இருக்கா|scholarship kedaikuma|padhai ke liye|padikira/.test(
      lower
    );

  // Tailoring & sewing machine intents
  const isTailoring =
    /தையல்|தையல் இயந்திரம்|stitching|tailor|sewing|sew|ஆடை|துணி|सिलाई|सिलाई मशीन|शिवणकाम|સિલાઈ|కుట్టు|హೊಲಿಗೆ|ತையಲ್|തയ്യൽ|সেলাই|ਸਿਲਾਈ|ସିଲେଇ|চিলাই|سلائی|machine/.test(
      lower
    ) ||
    /thaiyal|thayyal|silai|machine/.test(lower);

  // Welfare / monthly support intents
  const isWelfare =
    /உரிமைத் தொகை|1000|ஆயிரம்|மகளிர் உரிமை|குடும்பத் தலைவி|ரேஷன்|सम्मान राशि|राशन|మహిళా సంక్షేమం|రేషన్|ರೇಷನ್|റേഷൻ|রেশন|راشن|மாதாந்திர உதவி|மாதம் 1000|urimai thogai|urimai|grant|welfare/.test(
      lower
    );

  // Jobs / work / business loan intents
  const isJob =
    /வேலை|தொழில்|பயிற்சி|சுயதொழில்|வேலைவாய்ப்பு|काम|नौकरी|रोजगार|कर्ज|मुद्रा|व्यवसाय|નોકરી|રોજગાર|ఉపాధి|పని|ಕೆಲಸ|ಉದ್ಯೋಗ|തൊഴിൽ|কাজ|ਰੋਜ਼ਗਾਰ|କାମ|নিয়োগ|ملازمت|روزگار|job|work|loan|business|employment/.test(
      lower
    ) ||
    /velai|kaam|kelsa|pani/.test(lower);

  let category: IntentCategory = 'scholarship';
  let schemeId = 'pudhumai-penn-scholarship';
  let domainKey = 'scholarship';

  if (isScholarship) {
    category = 'scholarship';
    schemeId = 'pudhumai-penn-scholarship';
    domainKey = 'scholarship';
  } else if (isTailoring) {
    category = 'skills';
    schemeId = 'free-sewing-machine';
    domainKey = 'skills';
  } else if (isWelfare) {
    category = 'welfare';
    schemeId = 'magalir-urimai-thittam';
    domainKey = 'welfare';
  } else if (isJob) {
    category = 'jobs';
    schemeId = 'pm-kaushal-vikas-yojana';
    domainKey = 'jobs';
  } else {
    // Default to the user's specific scholarship query or skill
    if (lower.includes('உதவி') || lower.includes('மதத்') || lower.includes('help')) {
      category = 'scholarship';
      schemeId = 'pudhumai-penn-scholarship';
      domainKey = 'scholarship';
    } else {
      category = 'skills';
      schemeId = 'free-sewing-machine';
      domainKey = 'skills';
    }
  }

  const template = DOMAIN_ANSWERS[domainKey] || DOMAIN_ANSWERS.scholarship;
  const langForAnswer = detectedLang in template.directAnswer ? detectedLang : preferredLanguage;

  const meaning = template.interpretedMeaning[langForAnswer] || template.interpretedMeaning.en;
  const directAnswer = template.directAnswer[langForAnswer] || template.directAnswer.en;

  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === langForAnswer);
  const detectedLanguageName = langMeta ? `${langMeta.nativeLabel} (${langMeta.label})` : langForAnswer;

  return {
    category,
    rawInput: trimmed,
    recognizedText: trimmed,
    detectedLanguage: langForAnswer,
    detectedLanguageName,
    interpretedMeaning: meaning,
    directAnswer,
    summaryByLanguage: {
      ta: template.interpretedMeaning.ta,
      hi: template.interpretedMeaning.hi,
      en: template.interpretedMeaning.en,
    },
    schemeId,
    isAiGenerated: false,
  };
}

// 4. Live Gemini API Invocation when API key is provided
async function callGeminiForUnderstanding(
  rawInput: string,
  detectedLang: Language,
  apiKey: string
): Promise<IntentResult | null> {
  const client = new GoogleGenAI({ apiKey });

  const prompt = `You are HARSHU, a compassionate, plain-language AI guide for first-time women internet users in India.
The user asked: "${rawInput}"
Detected script/language: ${detectedLang}

You must:
1. Detect the user's language accurately (e.g. Tamil, Hindi, English, Marathi, Gujarati, Telugu, Kannada, Malayalam, Bengali, Punjabi, Odia, Assamese, Urdu).
2. Understand the TRUE MEANING of what she is asking.
3. Formulate a warm, factual, plain-language DIRECT ANSWER to her actual question in her own language.
   - DO NOT just rephrase or translate her question.
   - Answer directly whether such government schemes or opportunities exist, what they give, and reassuringly state that HARSHU will guide her step by step.
4. Choose the best matching scheme from:
   - "pudhumai-penn-scholarship" (for education, student, girls college scholarship)
   - "free-sewing-machine" (for tailoring, stitching, sewing machine, home craft)
   - "magalir-urimai-thittam" (for women's monthly livelihood grant, ration card assistance)
   - "pm-kaushal-vikas-yojana" (for vocational training, jobs, business loan, self-employment)
5. Respond ONLY with valid JSON with keys:
{
  "detectedLanguage": "${detectedLang}",
  "interpretedMeaning": "Clear one-sentence summary of what she is asking in her language",
  "directAnswer": "The actual direct factual answer to her question in her language",
  "schemeId": "pudhumai-penn-scholarship" | "free-sewing-machine" | "magalir-urimai-thittam" | "pm-kaushal-vikas-yojana",
  "category": "scholarship" | "skills" | "welfare" | "jobs"
}`;

  const response = await client.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
  });

  const text = response.text?.trim() || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  const parsed = JSON.parse(jsonMatch[0]);
  const lang = (parsed.detectedLanguage as Language) || detectedLang;
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);

  return {
    category: parsed.category || 'scholarship',
    rawInput,
    recognizedText: rawInput,
    detectedLanguage: lang,
    detectedLanguageName: langMeta ? `${langMeta.nativeLabel} (${langMeta.label})` : lang,
    interpretedMeaning: parsed.interpretedMeaning,
    directAnswer: parsed.directAnswer,
    summaryByLanguage: {
      ta: parsed.interpretedMeaning,
      hi: parsed.interpretedMeaning,
      en: parsed.interpretedMeaning,
    },
    schemeId: parsed.schemeId || 'pudhumai-penn-scholarship',
    isAiGenerated: true,
  };
}
