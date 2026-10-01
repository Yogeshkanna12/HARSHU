import { IntentResult, Language } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { understandUserNeed, detectLanguageFromText } from './aiService';

export async function detectIntentAsync(
  rawText: string,
  preferredLang: Language
): Promise<IntentResult> {
  return await understandUserNeed(rawText, preferredLang);
}

// Synchronous wrapper for instant fallback/testing
export function detectIntent(rawText: string, preferredLang: Language): IntentResult {
  const detected = detectLanguageFromText(rawText, preferredLang);
  // Call understandUserNeed internally (synchronous fallback logic)
  const lower = rawText.toLowerCase().trim();

  const isScholarship =
    /scholarship|படிப்பு|கல்லூரி|பள்ளி|மாணவி|கல்வி|மாணவர்|மாணவர்களுக்கான|உதவித்தொகை|छात्रवृत्ति|शिक्षा|कॉलेज|स्कूल|विद्यार्थी|शिष्यवृत्ती|શિક્ષણ|શિષ્યવૃત્તિ|స్కాలర్‌షిప్|చదువు|ವಿದ್ಯಾರ್ಥಿವೇತನ|ವಿದ್ಯಾರ್ಥಿ|സ്കോളർഷിപ്പ്|പഠനം|বৃত্তি|শিক্ষার্থী|ਵਜੀਫਾ|ବୃତ୍ତି|وظیفہ|تعلیم|school|college|study|student|fees|tuition/.test(
      lower
    ) ||
    /கல்வி உதவித்தொகை|மாணவர்களுக்கான இலவசக் கல்வி|scholarship இருக்கா|scholarship kedaikuma|padhai ke liye|padikira/.test(
      lower
    );

  const isTailoring =
    /தையல்|தையல் இயந்திரம்|stitching|tailor|sewing|sew|ஆடை|துணி|सिलाई|सिलाई मशीन|शिवणकाम|સિલાઈ|కుట్టు|హొలಿಗೆ|ತையಲ್|തയ്യൽ|সেলাই|ਸਿਲਾਈ|ସିଲେଇ|চিলাই|سلائی|machine/.test(
      lower
    ) ||
    /thaiyal|thayyal|silai|machine/.test(lower);

  const isWelfare =
    /உரிமைத் தொகை|1000|ஆயிரம்|மகளிர் உரிமை|குடும்பத் தலைவி|ரேஷன்|सम्मान राशि|राशन|మహిళా సంక్షేమం|రేషన్|ರೇಷನ್|റേഷൻ|রেশন|راشن|மாதாந்திர உதவி|மாதம் 1000|urimai thogai|urimai|grant|welfare/.test(
      lower
    );

  let schemeId = 'pudhumai-penn-scholarship';
  let category: any = 'scholarship';

  if (isScholarship) {
    category = 'scholarship';
    schemeId = 'pudhumai-penn-scholarship';
  } else if (isTailoring) {
    category = 'skills';
    schemeId = 'free-sewing-machine';
  } else if (isWelfare) {
    category = 'welfare';
    schemeId = 'magalir-urimai-thittam';
  } else {
    category = 'jobs';
    schemeId = 'pm-kaushal-vikas-yojana';
  }

  const directAnswers: Record<string, Record<string, string>> = {
    'pudhumai-penn-scholarship': {
      ta: 'ஆம், நிச்சயமாக! அரசாங்கத்தின் சார்பில் பள்ளி மற்றும் கல்லூரி மாணவர்களுக்காக பல்வேறு இலவச கல்வி உதவித்தொகைகள் வழங்கப்படுகின்றன. குறிப்பாக மாணவிகளுக்கு மாதம் ₹1,000 வழங்கும் "புதுமைப் பெண் திட்டம்", போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை மற்றும் தேசிய உதவித்தொகை தளம் (NSP) மூலமாக கட்டணச் சலுகைகள் உள்ளன. இதில் நீங்கள் பயன்பெற தேவையான தகுதிகள் மற்றும் விண்ணப்பிக்கும் முறையை HARSHU உங்களுக்கு ஒரு படியாக வழிகாட்டும்.',
      hi: 'हाँ, बिल्कुल! सरकार की ओर से स्कूली और कॉलेज छात्राओं के लिए कई महत्वपूर्ण छात्रवृत्तियां उपलब्ध हैं। विशेषकर कॉलेज जाने वाली छात्राओं को प्रतिमाह ₹1,000 की वित्तीय सहायता (पुधुमै पेन योजना) तथा राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) के तहत पूरी फीस माफी व सहायता दी जाती है। HARSHU आपको इसके लिए आवेदन करने का सीधा तरीका बताएगा।',
      en: 'Yes, absolutely! The government provides several robust scholarship programs for students. In particular, college girl students receive ₹1,000 monthly direct financial support under the Pudhumai Penn Scheme, alongside post-matric and National Scholarship Portal (NSP) tuition grants. HARSHU will guide you step by step to verify eligibility and apply.',
      mr: 'होय, नक्कीच! शासनामार्फत शालेय आणि महाविद्यालयीन विद्यार्थ्यांसाठी विविध शिष्यवृत्ती योजना उपलब्ध आहेत. विशेषतः उच्च शिक्षण घेणाऱ्या मुलींना मासिक आर्थिक साहाय्य, सावित्रीबाई फुले शिष्यवृत्ती आणि महाडीबीटी पोर्टलद्वारे फी माफी दिली जाते. HARSHU तुम्हाला यासाठी पायरी-पायरीने मार्गदर्शन करेल.',
      te: 'అవును, ఖచ్చితంగా! ప్రభుత్వం విద్యార్థుల కోసం అనేక స్కాలర్‌షిప్ పథకాలను అందిస్తోంది. ముఖ్యంగా కళాశాల విద్యార్థినులకు నెలకు ₹1,000 ఆర్థిక సహాయం మరియు పూర్తి ఫీజు రీయింబర్స్‌మెంట్ అందుబాటులో ఉన్నాయి. అర్హతలు మరియు దరఖాస్తు విధానాన్ని HARSHU మీకు సులభంగా వివరిస్తుంది.',
      kn: 'ಹೌದು, ಖಂಡಿತವಾಗಿಯೂ! ಶಾಲಾ ಮತ್ತು ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸರ್ಕಾರದಿಂದ ಅನೇಕ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು ಲಭ್ಯವಿವೆ. ವಿಶೇಷವಾಗಿ ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ಮಾಸಿಕ ಸಹಾಯಧನ ಮತ್ತು ಪೂರ್ಣ ಶುಲ್ಕ ವಿನಾಯಿತಿ ಯೋಜನೆಗಳಿವೆ. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಸುಲಭ ಹಂತಗಳನ್ನು HARSHU ನಿಮಗೆ ಕಲಿಸುತ್ತದೆ.',
    },
    'free-sewing-machine': {
      ta: 'ஆம், சமூக நலத்துறை மற்றும் திறன் மேம்பாட்டுக் கழகம் (TNSDC) சார்பாக பெண்களுக்கு முற்றிலும் இலவச தையல் பயிற்சி மற்றும் சத்யவாணி முத்து அம்மையார் நினைவு திட்டத்தின் கீழ் இலவச தையல் இயந்திரம் வழங்கப்படுகிறது. 20 முதல் 45 வயதுக்குட்பட்ட பெண்கள் விண்ணப்பித்து வீட்டில் இருந்தே வருமானம் ஈட்டலாம். இதற்கு தேவையான ஆவணங்கள் மற்றும் விண்ணப்பிக்கும் முறையை நாம் சேர்ந்து செய்வோம்.',
      hi: 'हाँ, सरकार द्वारा महिलाओं को घर बैठे आत्मनिर्भर बनाने के लिए मुफ्त सिलाई प्रशिक्षण और मुफ्त सिलाई मशीन योजना चलाई जा रही है। 20 से 45 वर्ष की महिलाएं इसके लिए पात्र हैं। HARSHU आपको बताएगा कि इसके लिए कौन से 3 दस्तावेज चाहिए और आवेदन कैसे करना है।',
      en: 'Yes! The Directorate of Social Welfare and Skill Development Mission provide free tailoring certification courses along with a free sewing machine for eligible women aged 20 to 45. This enables you to earn a respectable income directly from home. HARSHU will walk you through the documents and application process.',
      mr: 'होय! महिला व बालविकास विभाग आणि कौशल्य विकास अभियानांतर्गत मोफत शिलाई प्रशिक्षण आणि गरजू महिलांना मोफत शिलाई मशीन दिली जाते. २० ते ४৫ वयोगटातील महिला यासाठी पात्र आहेत. HARSHU तुम्हाला कागदपत्रे आणि अर्ज कसा करायचा हे समजावून सांगेल.',
      te: 'అవును! మహిళలు స్వయం ఉపాధి పొందడానికి ప్రభుత్వం ఉచిత కుట్టు శిక్షణ మరియు ఉచిత కుట్టు మిషన్ పథకాన్ని అందిస్తోంది. 20 నుండి 45 సంవత్సరాల మహిళలు అర్హులు.',
      kn: 'ಹೌದು! ಮಹಿಳೆಯರು ಸ್ವಾವಲಂಬಿಗಳಾಗಲು ಸರ್ಕಾರವು ಉಚಿತ ಹೊಲಿಗೆ ತರಬೇತಿ ಮತ್ತು ಹೊಲಿಗೆ ಯಂತ್ರ ನೀಡುವ ಯೋಜನೆಗಳನ್ನು ಜಾರಿಗೆ ತಂದಿದೆ. ೨೦ ರಿಂದ ೪೫ ವರ್ಷದ ಮಹಿಳೆಯರು ಅರ್ಹರು.',
    },
    'magalir-urimai-thittam': {
      ta: 'ஆம்! குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 வாழ்வாதார உரிமைத் தொகையாக வங்கி கணக்கில் நேரடியாக செலுத்தப்படுகிறது. ஸ்மார்ட் ரேஷன் கார்டு மற்றும் ஆதார் வைத்துள்ள 21 வயது நிரம்பிய தகுதியான பெண்கள் இதற்கு விண்ணப்பிக்கலாம். விண்ணப்பிக்கும் முறையை HARSHU உங்களுக்கு மிக எளிமையாக விளக்கும்.',
      hi: 'हाँ! सरकार द्वारा महिला मुखियाओं के सम्मान और आत्मनिर्भरता के लिए प्रतिमाह ₹1,000 की सम्मान राशि सीधे बैंक खाते में दी जा रही है। 21 वर्ष या उससे अधिक आयु की राशन कार्ड धारक महिलाएं इसके लिए पात्र हैं। HARSHU आपको इसका पूरा विवरण देगा।',
      en: 'Yes! The government provides ₹1,000 per month directly into bank accounts for eligible female heads of households under the Women’s Rights Grant. Women aged 21 and above with a Smart Ration Card can enroll. HARSHU will guide you through the process.',
      mr: 'होय! महिलांच्या आर्थिक सबलीकरणासाठी दरमहा थेट बँक खात्यात आर्थिक मदत दिली जाते. २१ वर्षे पूर्ण झालेल्या राशन कार्ड धारक महिला यासाठी अर्ज करू शकतात.',
      te: 'అవును! కుటుంబ మహిళలకు నెలకు ₹1,000 నేరుగా బ్యాంక్ ఖాతాలో జమ చేసే సంక్షేమ పథకం అమలులో ఉంది. 21 ఏళ్లు నిండిన రేషన్ కార్డు కలిగిన మహిళలు అర్హులు.',
      kn: 'ಹೌದು! ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥ ಮಹಿಳೆಯರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ಜಮೆ ಮಾಡುವ ಯೋಜನೆ ಇದೆ.',
    },
    'pm-kaushal-vikas-yojana': {
      ta: 'ஆம்! பெண்களுக்கு இலவச தொழிற்கல்வி பயிற்சி, கணினி, ஆடை தயாரிப்பு மற்றும் முத்ரா (MUDRA) திட்டத்தின் கீழ் அடமானம் இல்லா சுயதொழில் கடன்கள் வழங்கப்படுகின்றன. நீங்கள் விரும்பும் துறையை தேர்வு செய்து அரசு சான்றிதழுடன் உடனடியாக தொடங்கலாம். HARSHU இதற்கான வழிகளை உங்களுக்கு காட்டும்.',
      hi: 'हाँ! महिलाओं के लिए कौशल विकास (PMKVY) के तहत मुफ्त वोकेशनल ट्रेनिंग और मुद्रा योजना के तहत बिना किसी गारंटी के आसान बिजनेस लोन उपलब्ध है। आप अपनी पसंद का काम सीखकर स्थानीय स्तर पर काम शुरू कर सकती हैं। HARSHU आपका पूरा मार्गदर्शन करेगा।',
      en: 'Yes! The government offers free vocational training across apparel, computers, and handicrafts through skill missions, along with collateral-free MUDRA loans to launch your own enterprise from home. HARSHU will help you discover the nearest center and application steps.',
      mr: 'होय! महिलांसाठी मोफत व्यावसायिक प्रशिक्षण आणि मुद्रा योजनेद्वारे विनातारण व्यवसाय कर्ज उपलब्ध आहे.',
      te: 'అవును! మహిళలకు ఉచిత వృత్తి విద్యా శిక్షణ మరియు ముద్రా పథకం కింద సులభమైన వ్యాపార రుణాలు లభిస్తాయి.',
      kn: 'ಹೌದು! ಉಚಿತ ಕೌಶಲ್ಯ ತರಬೇತಿ ಮತ್ತು ಸ್ವಂತ ಉದ್ಯಮ ಆರಂಭಿಸಲು ಮುದ್ರಾ ಸಾಲಗಳು ಸುಲಭವಾಗಿ ದೊರೆಯುತ್ತವೆ.',
    },
  };

  const meanings: Record<string, Record<string, string>> = {
    'pudhumai-penn-scholarship': {
      ta: 'மாணவர்களுக்கான இலவச அரசு கல்வி உதவித்தொகை உள்ளதா என அறிய விரும்புகிறீர்கள்.',
      hi: 'आप जानना चाहती हैं कि क्या छात्रों के लिए सरकारी छात्रवृत्ति उपलब्ध है।',
      en: 'You want to know if government scholarships are available for students.',
      mr: 'विद्यार्थ्यांसाठी सरकारी शिष्यवृत्ती उपलब्ध आहे का, हे जाणून घ्यायचे आहे.',
      te: 'విద్యార్థులకు ప్రభుత్వ స్కాలర్‌షిప్‌లు ఉన్నాయా అని తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸರ್ಕಾರಿ ವಿದ್ಯಾರ್ಥಿವೇತನ ಲಭ್ಯವಿದೆಯೇ ಎಂದು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
    },
    'free-sewing-machine': {
      ta: 'தையல் பயிற்சி மற்றும் இலவச தையல் இயந்திர உதவி பற்றி அறிய விரும்புகிறீர்கள்.',
      hi: 'आप सिलाई सीखने और मुफ्त सिलाई मशीन सहायता के बारे में जानना चाहती हैं।',
      en: 'You want to know about free tailoring skill training and sewing machine support.',
      mr: 'शिवਣकाम शिकणे आणि मोफत शिलाई मशीन योजनेबद्दल जाणून घ्यायचे आहे.',
      te: 'కుట్టు పని నేర్చుకోవడం మరియు ఉచిత కుట్టు మిషన్ సహాయం గురించి తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಹೊಲಿಗೆ ತರಬೇತಿ ಮತ್ತು ಉಚಿತ ಹೊಲಿಗೆ ಯಂತ್ರದ ಸಹಾಯದ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
    },
    'magalir-urimai-thittam': {
      ta: 'மகளிர் உரிமைத் தொகை அல்லது குடும்பத் தலைவிகளுக்கான மாதாந்திர உதவித்தொகை பற்றி அறிய விரும்புகிறீர்கள்.',
      hi: 'आप महिलाओं के लिए मासिक वित्तीय सहायता (अधिकार योजना) के बारे में जानना चाहती हैं।',
      en: 'You want to know about the monthly financial assistance grant for female heads of household.',
      mr: 'कुटुंबप्रमुख महिलांसाठी मासिक आर्थिक सन्मान योजनेबद्दल माहिती हवी आहे.',
      te: 'కుటుంబ మహిళలకు లభించే నెలవారీ ఆర్థిక సహాయ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಕುಟುಂಬದ ಮುಖ್ಯ ಮಹಿಳೆಯರಿಗೆ ಸಿಗುವ ಮಾಸಿಕ ಸಹಾಯಧನ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
    },
    'pm-kaushal-vikas-yojana': {
      ta: 'வீட்டில் இருந்தே சுயதொழில் அல்லது உள்ளூர் வேலைவாய்ப்பு மற்றும் தொழில் கடன் பற்றி அறிய விரும்புகிறீர்கள்.',
      hi: 'आप घर से काम करने, स्थानीय रोजगार अथवा स्वरोजगार ऋण के बारे में जानना चाहती हैं।',
      en: 'You want to know about home-based self-employment, local jobs, or business loans.',
      mr: 'घरी बसून स्वयंरोजगार, स्थानिक नोकरी आणि व्यवसाय कर्जाबद्दल माहिती हवी आहे.',
      te: 'ఇంటి నుంచే పని లేదా స్థానిక ఉపాధి మరియు వ్యాపార రుణాల గురించి తెలుసుకోవాలనుకుంటున్నారు.',
      kn: 'ಮನೆಯಿಂದಲೇ ಉದ್ಯೋಗ ಅಥವಾ ಸ್ಥಳೀಯ ಕೆಲಸ ಮತ್ತು ಉದ್ಯಮ ಸಾಲದ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ.',
    },
  };

  const schemeAnswers = directAnswers[schemeId] || directAnswers['pudhumai-penn-scholarship'];
  const schemeMeanings = meanings[schemeId] || meanings['pudhumai-penn-scholarship'];

  const answer =
    schemeAnswers[detected] || schemeAnswers[preferredLang] || schemeAnswers.en;
  const meaning =
    schemeMeanings[detected] || schemeMeanings[preferredLang] || schemeMeanings.en;

  return {
    category,
    rawInput: rawText,
    recognizedText: rawText,
    detectedLanguage: detected,
    detectedLanguageName: detected,
    interpretedMeaning: meaning,
    directAnswer: answer,
    summaryByLanguage: {
      ta: schemeMeanings.ta || meaning,
      hi: schemeMeanings.hi || meaning,
      en: schemeMeanings.en || meaning,
    },
    schemeId,
    isAiGenerated: false,
  };
}

export function getSchemeById(schemeId: string) {
  return VERIFIED_SCHEMES.find((s) => s.id === schemeId) || VERIFIED_SCHEMES[0];
}
