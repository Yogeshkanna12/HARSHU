import { Language } from '../types';

export interface SpeechRecognitionHookResult {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  startListening: (lang: Language, onResult?: (text: string) => void) => void;
  stopListening: () => void;
}

// Map Language to BCP 47 language tags
export function getLangCode(lang: Language): string {
  switch (lang) {
    case 'ta':
      return 'ta-IN';
    case 'hi':
      return 'hi-IN';
    case 'en':
    default:
      return 'en-IN';
  }
}

// Speak aloud using Web Speech Synthesis API
export function speakText(text: string, lang: Language): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLangCode(lang);
    utterance.rate = 0.9; // Calm, patient pacing
    utterance.pitch = 1.0;

    // Pick best available voice for language if available
    const voices = window.speechSynthesis.getVoices();
    const prefix = getLangCode(lang).split('-')[0];
    const matchedVoice = voices.find((v) => v.lang.startsWith(prefix));
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
