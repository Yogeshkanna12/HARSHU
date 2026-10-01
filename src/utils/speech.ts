import { Language, SupportedLanguageMeta } from '../types';

export const SUPPORTED_LANGUAGES: SupportedLanguageMeta[] = [
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', script: 'Tamil', bcp47: 'ta-IN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', script: 'Devanagari', bcp47: 'hi-IN' },
  { code: 'en', label: 'English', nativeLabel: 'English', script: 'Latin', bcp47: 'en-IN' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', script: 'Devanagari', bcp47: 'mr-IN' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', script: 'Gujarati', bcp47: 'gu-IN' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', script: 'Telugu', bcp47: 'te-IN' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', script: 'Kannada', bcp47: 'kn-IN' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', script: 'Malayalam', bcp47: 'ml-IN' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', script: 'Bengali', bcp47: 'bn-IN' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', bcp47: 'pa-IN' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', script: 'Odia', bcp47: 'or-IN' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', script: 'Bengali', bcp47: 'as-IN' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', script: 'Arabic', bcp47: 'ur-IN' },
];

// Map Language to BCP 47 language tags
export function getLangCode(lang: Language): string {
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  return match ? match.bcp47 : 'en-IN';
}

export function getLanguageName(lang: Language): string {
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  return match ? `${match.nativeLabel} (${match.label})` : lang;
}

// Speak aloud using Web Speech Synthesis API
export function speakText(text: string, lang: Language): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    const bcp47 = getLangCode(lang);
    utterance.lang = bcp47;
    utterance.rate = 0.92; // Calm, patient pacing
    utterance.pitch = 1.0;

    // Pick best available voice for language if available
    const voices = window.speechSynthesis.getVoices();
    const prefix = bcp47.split('-')[0];
    const matchedVoice =
      voices.find((v) => v.lang === bcp47) ||
      voices.find((v) => v.lang.startsWith(prefix));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
