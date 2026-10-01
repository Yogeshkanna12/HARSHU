import { IntentResult, IntentCategory, Language } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';

export function detectIntent(rawText: string, lang: Language): IntentResult {
  const lower = rawText.toLowerCase().trim();

  // Keyword clustering
  const isTailoring =
    lower.includes('தையல்') ||
    lower.includes('இயந்திரம்') ||
    lower.includes('stitching') ||
    lower.includes('tailor') ||
    lower.includes('sewing') ||
    lower.includes('सिलाई');

  const isScholarship =
    lower.includes('scholarship') ||
    lower.includes('படிப்பு') ||
    lower.includes('கல்லூரி') ||
    lower.includes('பள்ளி') ||
    lower.includes('மாணவி') ||
    lower.includes('மகள்') ||
    lower.includes('छात्रवृत्ति') ||
    lower.includes('शिक्षा') ||
    lower.includes('कॉलेज') ||
    lower.includes('school') ||
    lower.includes('college');

  const isWelfareGrant =
    lower.includes('உரிமைத் தொகை') ||
    lower.includes('1000') ||
    lower.includes('ஆயிரம்') ||
    lower.includes('ரேஷன்') ||
    lower.includes('மகளிர் உரிமை') ||
    lower.includes('குடும்பத் தலைவி') ||
    lower.includes('सम्मान राशि') ||
    lower.includes('राशन') ||
    lower.includes('grant') ||
    lower.includes('monthly assistance');

  const isJobOrSkill =
    lower.includes('வேலை') ||
    lower.includes('தொழில்') ||
    lower.includes('பயிற்சி') ||
    lower.includes('கற்க') ||
    lower.includes('job') ||
    lower.includes('work') ||
    lower.includes('skill') ||
    lower.includes('काम') ||
    lower.includes('नौकरी') ||
    lower.includes('रोजगार');

  let category: IntentCategory = 'skills';
  let schemeId = 'free-sewing-machine';

  if (isTailoring) {
    category = 'skills';
    schemeId = 'free-sewing-machine';
  } else if (isScholarship) {
    category = 'scholarship';
    schemeId = 'pudhumai-penn-scholarship';
  } else if (isWelfareGrant) {
    category = 'welfare';
    schemeId = 'magalir-urimai-thittam';
  } else if (isJobOrSkill) {
    category = 'jobs';
    schemeId = 'pm-kaushal-vikas-yojana';
  } else {
    // Default fallback to tailoring & skill training as the primary exemplar journey
    category = 'skills';
    schemeId = 'free-sewing-machine';
  }

  // Summary generation by language
  const summaries: Record<string, Record<Language, string>> = {
    'free-sewing-machine': {
      ta: 'நீங்கள் இலவச தையல் இயந்திரம் மற்றும் தையல் பயிற்சி உதவி பற்றி கேட்கிறீர்கள் என்று புரிந்துகொண்டேன்.',
      hi: 'मैंने समझा कि आप मुफ्त सिलाई मशीन और सिलाई प्रशिक्षण योजना के बारे में जानना चाहती हैं।',
      en: 'I understood that you are looking for free sewing machine assistance and tailoring skill training.',
    },
    'pudhumai-penn-scholarship': {
      ta: 'நீங்கள் அரசு கல்லூரி மாணவிகளுக்கான ₹1,000 புதுமைப் பெண் கல்வி உதவித்தொகை பற்றி கேட்கிறீர்கள் என்று புரிந்துகொண்டேன்.',
      hi: 'मैंने समझा कि आप कॉलेज छात्राओं के लिए पुधुमै पेन ₹1,000 मासिक छात्रवृत्ति के बारे में जानना चाहती हैं।',
      en: 'I understood that you are inquiring about the Pudhumai Penn ₹1,000 monthly college scholarship.',
    },
    'magalir-urimai-thittam': {
      ta: 'நீங்கள் குடும்பத் தலைவிகளுக்கான மாதம் ₹1,000 கலைஞர் மகளிர் உரிமைத் தொகை பற்றி கேட்கிறீர்கள் என்று புரிந்துகொண்டேன்.',
      hi: 'मैंने समझा कि आप महिलाओं के लिए ₹1,000 मासिक सहायता योजना के बारे में जानना चाहती हैं।',
      en: "I understood that you are looking for guidance on the Women's Monthly Rights Grant (₹1,000/month).",
    },
    'pm-kaushal-vikas-yojana': {
      ta: 'நீங்கள் இலவச தொழிற்கல்வி, வேலைவாய்ப்பு மற்றும் சுயதொழில் பயிற்சி பற்றி கேட்கிறீர்கள் என்று புரிந்துகொண்டேன்.',
      hi: 'मैंने समझा कि आप महिलाओं के लिए मुफ्त व्यावसायिक कौशल एवं रोजगार प्रशिक्षण चाहती हैं।',
      en: "I understood that you are looking for women's free vocational skill training and local job opportunities.",
    },
  };

  return {
    category,
    rawInput: rawText,
    recognizedText: rawText,
    summaryByLanguage: summaries[schemeId] || summaries['free-sewing-machine'],
    schemeId,
  };
}

export function getSchemeById(schemeId: string) {
  return VERIFIED_SCHEMES.find((s) => s.id === schemeId) || VERIFIED_SCHEMES[0];
}
