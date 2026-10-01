import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { UI_TRANSLATIONS } from '../../utils/translations';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Key,
  Globe,
} from 'lucide-react';
import { speakText, getLangCode, SUPPORTED_LANGUAGES } from '../../utils/speech';
import { getGeminiApiKey, saveGeminiApiKey } from '../../utils/aiService';

interface VoiceInteractionProps {
  currentLanguage: Language;
  initialMode?: 'voice' | 'text';
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export const VoiceInteraction: React.FC<VoiceInteractionProps> = ({
  currentLanguage,
  initialMode = 'voice',
  onSubmit,
  onCancel,
}) => {
  const [mode, setMode] = useState<'voice' | 'text'>(initialMode);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [manualText, setManualText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [micUnavailable, setMicUnavailable] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(getGeminiApiKey() || '');
  const [activeSpeechLang, setActiveSpeechLang] = useState<Language>(currentLanguage);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicUnavailable(true);
      setMode('text');
      setStatusMessage(
        'Speech recognition not supported in this browser. Please type below or pick a sample question.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getLangCode(activeSpeechLang);

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('I am listening... Please speak naturally in your language.');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setRecognizedText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicUnavailable(true);
          setStatusMessage(
            'Microphone access not permitted. You can type or tap a sample below.'
          );
        } else {
          setStatusMessage('Could not hear clearly. Please speak again or select a sample.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      if (initialMode === 'voice') {
        startRecognition();
      }
    } catch (e) {
      console.warn('Recognition init failed:', e);
      setMicUnavailable(true);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [activeSpeechLang, initialMode]);

  const startRecognition = () => {
    if (!recognitionRef.current) return;
    try {
      setRecognizedText('');
      recognitionRef.current.lang = getLangCode(activeSpeechLang);
      recognitionRef.current.start();
    } catch {
      // already started
    }
  };

  const stopRecognition = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
  };

  const handleFinishVoice = () => {
    stopRecognition();
    if (recognizedText.trim()) {
      onSubmit(recognizedText.trim());
    } else {
      setStatusMessage('Please speak your question or pick a sample below.');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      onSubmit(manualText.trim());
    }
  };

  const handleSelectSample = (sample: string, langHint: Language) => {
    setRecognizedText(sample);
    setManualText(sample);
    setActiveSpeechLang(langHint);
    speakText(sample, langHint);
    setTimeout(() => {
      onSubmit(sample);
    }, 450);
  };

  const handleSaveKey = () => {
    saveGeminiApiKey(apiKey);
    setShowApiKeyInput(false);
  };

  // Diverse multilingual sample questions (including user's exact scholarship prompt!)
  const multilingualSamples = [
    {
      lang: 'ta' as Language,
      langLabel: 'தமிழ் (Tamil)',
      text: 'மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை பற்றி நான் தெரிந்துகொள்ள விரும்புகிறேன். அரசாங்கத்தின் சார்பில் ஏதேனும் கல்வி உதவித்தொகை வழங்கப்படுகிறதா?',
      tag: 'கல்வி உதவித்தொகை',
    },
    {
      lang: 'ta' as Language,
      langLabel: 'தமிழ் (Tamil)',
      text: 'எனக்கு தையல் கற்றுக்கணும், அரசு சார்பில் இலவச தையல் இயந்திரம் கிடைக்குமா?',
      tag: 'தையல் இயந்திரம்',
    },
    {
      lang: 'hi' as Language,
      langLabel: 'हिन्दी (Hindi)',
      text: 'क्या छात्राओं के लिए कॉलेज की पढ़ाई हेतु सरकारी छात्रवृत्ति और मासिक सहायता मिलती है?',
      tag: 'छात्रवृत्ति',
    },
    {
      lang: 'hi' as Language,
      langLabel: 'हिन्दी (Hindi)',
      text: 'मुझे सिलाई का काम सीखना है, क्या सरकार से मुफ्त सिलाई मशीन की कोई योजना है?',
      tag: 'सिलाई मशीन',
    },
    {
      lang: 'mr' as Language,
      langLabel: 'मराठी (Marathi)',
      text: 'मुलींच्या उच्च शिक्षणासाठी सरकारकडून कोणती शिष्यवृत्ती योजना उपलब्ध आहे का?',
      tag: 'शिष्यवृत्ती',
    },
    {
      lang: 'te' as Language,
      langLabel: 'తెలుగు (Telugu)',
      text: 'కాలేజీ విద్యార్థినులకు ప్రభుత్వం అందించే ఉచిత స్కాలర్‌షిప్ పథకం వివరాలు కావాలి.',
      tag: 'స్కాలర్‌షిప్',
    },
    {
      lang: 'kn' as Language,
      langLabel: 'ಕನ್ನಡ (Kannada)',
      text: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸರ್ಕಾರದ ಉಚಿತ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅಥವಾ ಶುಲ್ಕ ಸಹಾಯಧನ ಸಿಗುತ್ತದೆಯೇ?',
      tag: 'ವಿದ್ಯಾರ್ಥಿವೇತನ',
    },
    {
      lang: 'en' as Language,
      langLabel: 'English',
      text: 'I want to know if there are free government scholarships available for college students.',
      tag: 'Scholarship',
    },
    {
      lang: 'ta' as Language,
      langLabel: 'Tanglish / Casual',
      text: 'College padikira students ku government la monthly scholarship ethavathu kedaikuma?',
      tag: 'Tanglish',
    },
    {
      lang: 'hi' as Language,
      langLabel: 'Hinglish / Casual',
      text: 'Kya students ke liye koi government scholarship hai jisme monthly paise milte hain?',
      tag: 'Hinglish',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top Navigation & Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-earth-800 hover:text-harshu-900 font-semibold text-sm px-3 py-1.5 rounded-xl hover:bg-earth-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>பின்னால் / Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Optional Gemini API Key button */}
          <button
            type="button"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="flex items-center gap-1 text-[11px] font-bold text-harshu-800 bg-harshu-100/90 px-2.5 py-1 rounded-xl border border-harshu-200 hover:bg-harshu-200 transition-colors"
            title="Optional: Configure Gemini API Key"
          >
            <Key className="w-3 h-3 text-harshu-700" />
            <span>{apiKey ? 'Gemini AI Active' : 'Gemini AI (Optional)'}</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-earth-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('voice');
                startRecognition();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'voice'
                  ? 'bg-harshu-800 text-white shadow-xs'
                  : 'text-earth-700 hover:bg-earth-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('text');
                stopRecognition();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'text'
                  ? 'bg-harshu-800 text-white shadow-xs'
                  : 'text-earth-700 hover:bg-earth-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Type</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Gemini Key Input Drawer */}
      {showApiKeyInput && (
        <div className="mb-5 p-4 bg-white rounded-2xl border border-harshu-300 shadow-sm animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-harshu-900">
              Gemini API Key (Optional for Cloud LLM, HARSHU works fully offline without it)
            </span>
            <button
              type="button"
              onClick={() => setShowApiKeyInput(false)}
              className="text-xs text-earth-600 hover:text-earth-900"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Gemini API key (optional)..."
              className="flex-1 text-xs p-2 border border-earth-300 rounded-xl focus:outline-none focus:border-harshu-600"
            />
            <button
              type="button"
              onClick={handleSaveKey}
              className="px-3 py-1 bg-harshu-800 text-white text-xs font-bold rounded-xl"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Active Speech Language Pill */}
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <span className="text-xs text-earth-700 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-harshu-700" />
          <span>Speech Recognition Language:</span>
        </span>
        <select
          value={activeSpeechLang}
          onChange={(e) => setActiveSpeechLang(e.target.value as Language)}
          className="text-xs font-bold text-harshu-900 bg-earth-100 border border-earth-300 rounded-lg px-2 py-0.5 focus:outline-none"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeLabel} ({lang.label})
            </option>
          ))}
        </select>
      </div>

      {/* Voice Mode Content */}
      {mode === 'voice' ? (
        <div className="flex flex-col items-center text-center">
          {/* Main animated mic indicator */}
          <div className="relative my-4">
            <button
              type="button"
              onClick={isListening ? stopRecognition : startRecognition}
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-xl ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 ring-8 ring-red-200 animate-pulse'
                  : 'bg-harshu-800 hover:bg-harshu-900 ring-8 ring-harshu-100'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-12 h-12 text-white" />
                  <span className="text-xs font-bold mt-1 text-red-100">Listening...</span>
                </>
              ) : (
                <>
                  <MicOff className="w-12 h-12 text-harshu-200" />
                  <span className="text-xs font-bold mt-1 text-harshu-200">Tap to speak</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-earth-800 max-w-md font-medium">
            {isListening
              ? 'நான் கேட்டுக்கொண்டிருக்கிறேன்... உங்கள் மொழியில் பேசுங்கள்'
              : 'Press the microphone and speak naturally in Tamil, Hindi, English, Marathi, Telugu, etc.'}
          </p>

          {/* Transcript Box */}
          <div className="w-full bg-white border border-earth-300 rounded-2xl p-5 my-4 shadow-xs text-left min-h-[90px] flex flex-col justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-harshu-700 flex items-center justify-between mb-1">
              <span>கேட்ட வார்த்தைகள் (Recognized Text):</span>
              {recognizedText && (
                <button
                  type="button"
                  onClick={() => speakText(recognizedText, activeSpeechLang)}
                  className="text-harshu-700 hover:text-harshu-900 p-1"
                  title="Listen transcript"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-base sm:text-lg text-harshu-950 font-medium">
              {recognizedText ? (
                `"${recognizedText}"`
              ) : (
                <span className="text-earth-400 italic text-sm">
                  நீங்கள் பேசும் வார்த்தைகள் இங்கே தோன்றும் (Words appear here as you speak)...
                </span>
              )}
            </p>

            {recognizedText && (
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-earth-100">
                <button
                  type="button"
                  onClick={startRecognition}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-earth-700 hover:bg-earth-100 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>மீண்டும் பேசு (Speak again)</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinishVoice}
                  className="px-4 py-2 bg-harshu-800 hover:bg-harshu-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5"
                >
                  <span>கேட்க / Submit ➔</span>
                </button>
              </div>
            )}
          </div>

          {statusMessage && (
            <div className="text-xs text-earth-700 bg-earth-100/90 px-3 py-2 rounded-xl mb-3 flex items-center gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 text-harshu-700 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      ) : (
        /* Text Typing Mode */
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
          <div className="text-center mb-1">
            <h2 className="text-lg sm:text-xl font-bold text-harshu-950">
              டைப் செய்து சொல்லுங்கள் (Type Your Question)
            </h2>
            <p className="text-xs text-earth-700 mt-1">
              Ask in Tamil, Hindi, English, Marathi, Telugu, Gujarati, Tanglish, Hinglish, etc.
            </p>
          </div>

          <div className="bg-white border-2 border-harshu-300 focus-within:border-harshu-700 rounded-2xl p-3 shadow-xs">
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={3}
              placeholder="எ.கா: மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை பற்றி நான் தெரிந்துகொள்ள விரும்புகிறேன். அரசாங்கத்தின் சார்பில் ஏதேனும் கல்வி உதவித்தொகை வழங்கப்படுகிறதா?"
              className="w-full resize-none p-2 text-base text-harshu-950 placeholder-earth-400 focus:outline-none bg-transparent"
              autoFocus
            />

            <div className="flex items-center justify-between pt-2 border-t border-earth-100">
              <button
                type="button"
                onClick={() => setMode('voice')}
                className="text-xs font-semibold text-harshu-700 hover:text-harshu-900 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-harshu-50"
              >
                <Mic className="w-4 h-4" />
                <span>குரல் வழியே பேச</span>
              </button>

              <button
                type="submit"
                disabled={!manualText.trim()}
                className="px-5 py-2.5 bg-harshu-800 hover:bg-harshu-900 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-xs flex items-center gap-2"
              >
                <span>கேட்க (Submit)</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Multilingual Sample Prompts (Instant test queries in Tamil, Hindi, Marathi, Telugu, etc.) */}
      <div className="mt-6 border-t border-earth-200 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-harshu-800 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-harshu-600" />
            <span>உண்மையான மாதிரி கேள்விகள் (Try Real Multilingual Questions):</span>
          </div>
          <span className="text-[11px] text-earth-600 hidden sm:inline">
            Tap any question to see HARSHU understand and answer
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {multilingualSamples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample.text, sample.lang)}
              className="p-3 bg-white border border-earth-200 hover:border-harshu-400 hover:bg-harshu-50/70 rounded-2xl text-left text-xs sm:text-sm font-medium text-harshu-950 transition-all flex items-start gap-3 shadow-2xs group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider bg-harshu-100 text-harshu-800 px-2 py-0.5 rounded-lg whitespace-nowrap mt-0.5">
                {sample.langLabel}
              </span>
              <span className="leading-snug flex-1 group-hover:text-harshu-900">
                "{sample.text}"
              </span>
              <span className="text-harshu-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                ➔
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
