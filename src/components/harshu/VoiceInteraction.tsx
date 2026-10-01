import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { Mic, MicOff, Send, Volume2, ArrowLeft, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { speakText, getLangCode } from '../../utils/speech';

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

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicUnavailable(true);
      setMode('text');
      setStatusMessage(
        currentLanguage === 'ta'
          ? 'உங்கள் உலாவியில் குரல் வசதி இல்லை. நீங்கள் தட்டச்சு செய்யலாம்.'
          : currentLanguage === 'hi'
          ? 'आपके ब्राउज़र में आवाज की सुविधा उपलब्ध नहीं है। आप लिखकर बता सकती हैं।'
          : 'Microphone speech recognition is not supported in this browser. Please type below.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getLangCode(currentLanguage);

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(UI_TRANSLATIONS.listeningNow[currentLanguage]);
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
            currentLanguage === 'ta'
              ? 'மைக் அனுமதி வழங்கப்படவில்லை. கீழே உள்ள மாதிரி வாக்கியங்களை தொடலாம் அல்லது டைப் செய்யலாம்.'
              : currentLanguage === 'hi'
              ? 'माइक की अनुमति नहीं मिली। कृपया लिखकर बताएं या नीचे दिए गए वाक्य चुनें।'
              : 'Microphone permission not granted. You can choose a sample or type instead.'
          );
        } else {
          setStatusMessage(UI_TRANSLATIONS.didNotUnderstand[currentLanguage]);
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
  }, [currentLanguage, initialMode]);

  const startRecognition = () => {
    if (!recognitionRef.current) return;
    try {
      setRecognizedText('');
      recognitionRef.current.lang = getLangCode(currentLanguage);
      recognitionRef.current.start();
    } catch {
      // already started or aborted
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
      setStatusMessage(UI_TRANSLATIONS.didNotUnderstand[currentLanguage]);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      onSubmit(manualText.trim());
    }
  };

  const handleSelectSample = (sample: string) => {
    setRecognizedText(sample);
    setManualText(sample);
    speakText(sample, currentLanguage);
    setTimeout(() => {
      onSubmit(sample);
    }, 400);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-earth-800 hover:text-harshu-900 font-semibold text-sm px-3 py-1.5 rounded-xl hover:bg-earth-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLanguage === 'ta' ? 'பின்னால்' : currentLanguage === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

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
            <span>{currentLanguage === 'ta' ? 'குரல்' : currentLanguage === 'hi' ? 'आवाज' : 'Voice'}</span>
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
            <span>{currentLanguage === 'ta' ? 'டைப்' : currentLanguage === 'hi' ? 'टाइप' : 'Type'}</span>
          </button>
        </div>
      </div>

      {/* Voice Mode Content */}
      {mode === 'voice' ? (
        <div className="flex flex-col items-center text-center">
          {/* Main animated mic indicator */}
          <div className="relative my-6">
            <button
              type="button"
              onClick={isListening ? stopRecognition : startRecognition}
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-xl ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 ring-8 ring-red-200 animate-pulse'
                  : 'bg-harshu-800 hover:bg-harshu-900 ring-8 ring-harshu-100'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-14 h-14 text-white" />
                  <span className="text-xs font-bold mt-1 text-red-100">
                    {currentLanguage === 'ta' ? 'கேட்கிறது...' : currentLanguage === 'hi' ? 'सुन रही हूँ...' : 'Listening...'}
                  </span>
                </>
              ) : (
                <>
                  <MicOff className="w-14 h-14 text-harshu-200" />
                  <span className="text-xs font-bold mt-1 text-harshu-200">
                    {currentLanguage === 'ta' ? 'தொடங்க அழுத்தவும்' : currentLanguage === 'hi' ? 'शुरू करने के लिए दबाएं' : 'Tap to speak'}
                  </span>
                </>
              )}
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-harshu-950 mb-1">
            {isListening
              ? UI_TRANSLATIONS.listeningNow[currentLanguage]
              : currentLanguage === 'ta'
              ? 'பேச தயாராக உள்ளது'
              : currentLanguage === 'hi'
              ? 'बोलने के लिए तैयार'
              : 'Ready to listen'}
          </h2>

          <p className="text-xs sm:text-sm text-earth-700 max-w-md">
            {UI_TRANSLATIONS.subTagline[currentLanguage]}
          </p>

          {/* Transcript Box */}
          <div className="w-full bg-white border border-earth-300 rounded-2xl p-5 my-5 shadow-xs text-left min-h-[100px] flex flex-col justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-harshu-700 flex items-center justify-between mb-2">
              <span>{currentLanguage === 'ta' ? 'நான் கேட்ட வார்த்தைகள்:' : currentLanguage === 'hi' ? 'सुने गए शब्द:' : 'Recognized words:'}</span>
              {recognizedText && (
                <button
                  type="button"
                  onClick={() => speakText(recognizedText, currentLanguage)}
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
                <span className="text-earth-400 italic">
                  {currentLanguage === 'ta'
                    ? 'நீங்கள் பேசும்போது வார்த்தைகள் இங்கே தோன்றும்...'
                    : currentLanguage === 'hi'
                    ? 'जब आप बोलेंगी तो शब्द यहाँ दिखेंगे...'
                    : 'Your words will appear here as you speak...'}
                </span>
              )}
            </p>

            {recognizedText && (
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-earth-100">
                <button
                  type="button"
                  onClick={startRecognition}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-earth-700 hover:bg-earth-100 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{UI_TRANSLATIONS.speakAgain[currentLanguage]}</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinishVoice}
                  className="px-4 py-2 bg-harshu-800 hover:bg-harshu-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5"
                >
                  <span>{UI_TRANSLATIONS.stopListening[currentLanguage]}</span>
                </button>
              </div>
            )}
          </div>

          {statusMessage && (
            <div className="text-xs text-earth-700 bg-earth-100/90 px-3 py-2 rounded-xl mb-4 flex items-center gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 text-harshu-700 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      ) : (
        /* Text Typing Mode */
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-harshu-950">
              {UI_TRANSLATIONS.typeInstead[currentLanguage]}
            </h2>
            <p className="text-xs sm:text-sm text-earth-700 mt-1">
              {currentLanguage === 'ta'
                ? 'உங்கள் சொந்த வார்த்தைகளில் தட்டச்சு செய்யுங்கள். திட்டப் பெயர்கள் தெரிய வேண்டியதில்லை.'
                : currentLanguage === 'hi'
                ? 'अपनी भाषा में लिखें। कठिन योजना का नाम जानना जरूरी नहीं है।'
                : 'Write in your own words. No official scheme name needed.'}
            </p>
          </div>

          <div className="bg-white border-2 border-harshu-300 focus-within:border-harshu-700 rounded-2xl p-3 shadow-xs">
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={4}
              placeholder={
                currentLanguage === 'ta'
                  ? 'எ.கா: எனக்கு தையல் கற்றுக்கணும், வீட்டில் இருந்தே வேலை செய்ய உதவி வேண்டும்...'
                  : currentLanguage === 'hi'
                  ? 'उदा: मुझे सिलाई सीखनी है और घर से काम शुरू करने के लिए मदद चाहिए...'
                  : 'E.g. I want to learn tailoring and need support for a sewing machine...'
              }
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
                <span>{currentLanguage === 'ta' ? 'பேச விரும்புகிறேன்' : currentLanguage === 'hi' ? 'बोलकर बताना चाहती हूँ' : 'Speak instead'}</span>
              </button>

              <button
                type="submit"
                disabled={!manualText.trim()}
                className="px-5 py-2.5 bg-harshu-800 hover:bg-harshu-900 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-xs flex items-center gap-2"
              >
                <span>{UI_TRANSLATIONS.stopListening[currentLanguage]}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Helpful Everyday Sample Prompts (Instant click-to-try) */}
      <div className="mt-8 border-t border-earth-200 pt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-harshu-800 uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-harshu-600" />
          <span>{UI_TRANSLATIONS.trySamplePhrases[currentLanguage]}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {UI_TRANSLATIONS.sampleQuestions.map((q, idx) => {
            const text = q.text[currentLanguage];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(text)}
                className="p-3.5 bg-white border border-earth-200 hover:border-harshu-400 hover:bg-harshu-50/60 rounded-2xl text-left text-xs sm:text-sm font-medium text-harshu-950 transition-all flex items-start gap-2 shadow-2xs group"
              >
                <span className="text-harshu-600 font-bold group-hover:scale-110 transition-transform">
                  💬
                </span>
                <span className="leading-snug flex-1">"{text}"</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
