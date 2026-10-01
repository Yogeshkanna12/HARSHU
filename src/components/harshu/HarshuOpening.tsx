import React, { useState } from 'react';
import { GlyphPortal } from '../ui/glyph-portal';
import { HARSHU_ACRONYM, UI_TRANSLATIONS } from '../../utils/translations';
import { Language } from '../../types';
import { Mic, Keyboard, ArrowRight, ShieldCheck, Heart, Sparkles, Volume2 } from 'lucide-react';
import { speakText } from '../../utils/speech';

interface HarshuOpeningProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onStartVoice: () => void;
  onStartText: () => void;
  onEnterCompanion: () => void;
}

export const HarshuOpening: React.FC<HarshuOpeningProps> = ({
  currentLanguage,
  onSelectLanguage,
  onStartVoice,
  onStartText,
  onEnterCompanion,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  // Annotations mapped from HARSHU acronym
  const annotations = HARSHU_ACRONYM.map((item) => ({
    char: item.letter,
    label: `${item.word} (${item.meaning[currentLanguage]})`,
    sub: item.description[currentLanguage],
  }));

  const handleListenTagline = () => {
    speakText(
      `${UI_TRANSLATIONS.tagline[currentLanguage]}. ${UI_TRANSLATIONS.subTagline[currentLanguage]}`,
      currentLanguage
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-[#faf8f5] text-[#1c2826] overflow-x-hidden">
      {/* Top Bar with Language Selector & Warm Brand Badge */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-earth-200/70 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-harshu-800 text-harshu-100 flex items-center justify-center font-bold text-base shadow-sm">
            H
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-harshu-900 leading-none tracking-tight">
              HARSHU
            </span>
            <span className="text-[10px] text-harshu-700 font-medium hidden sm:inline">
              Digital Companion for Women
            </span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-earth-100/90 p-1 rounded-2xl border border-earth-200">
          <button
            type="button"
            onClick={() => onSelectLanguage('ta')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentLanguage === 'ta'
                ? 'bg-harshu-800 text-white shadow-sm'
                : 'text-earth-800 hover:bg-earth-200/60'
            }`}
          >
            தமிழ்
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('hi')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentLanguage === 'hi'
                ? 'bg-harshu-800 text-white shadow-sm'
                : 'text-earth-800 hover:bg-earth-200/60'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('en')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentLanguage === 'en'
                ? 'bg-harshu-800 text-white shadow-sm'
                : 'text-earth-800 hover:bg-earth-200/60'
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* The Glyph Portal Section */}
      <GlyphPortal
        word="HARSHU"
        focusChar="R"
        scrollLength={1200}
        annotations={annotations}
        interactive={true}
        onLetterClick={(idx) => setSelectedLetter(idx)}
        background={
          <div className="w-full h-full bg-gradient-to-b from-[#f2f9f5] via-[#faf8f5] to-[#f4f0e8] opacity-80" />
        }
      >
        {/* Acronym Strip Below Big Letters */}
        <div className="w-full max-w-2xl px-4 flex flex-col items-center text-center">
          <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold text-harshu-800 bg-white/80 backdrop-blur-sm border border-harshu-200/80 px-4 py-2 rounded-2xl shadow-sm mb-4">
            <span className="text-harshu-900 font-extrabold">H</span>elp
            <span className="text-earth-300">·</span>
            <span className="text-harshu-900 font-extrabold">A</span>ccess
            <span className="text-earth-300">·</span>
            <span className="text-harshu-900 font-extrabold">R</span>esources
            <span className="text-earth-300">·</span>
            <span className="text-harshu-900 font-extrabold">S</span>imply
            <span className="text-earth-300">·</span>
            <span className="text-harshu-900 font-extrabold">H</span>er
            <span className="text-earth-300">·</span>
            <span className="text-harshu-900 font-extrabold">U</span>nderstanding
          </div>

          {/* Tagline & Listen Button */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-harshu-950 tracking-tight">
              {UI_TRANSLATIONS.tagline[currentLanguage]}
            </h1>
            <button
              type="button"
              onClick={handleListenTagline}
              className="p-2 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-100 rounded-full transition-colors"
              title="Listen aloud"
              aria-label="Listen tagline aloud"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-earth-800 max-w-xl font-normal leading-relaxed mb-6">
            {UI_TRANSLATIONS.subTagline[currentLanguage]}
          </p>

          {/* Action Buttons: Voice First & Text Option */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
            {/* Primary Voice Action */}
            <button
              type="button"
              onClick={onStartVoice}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-harshu-800 hover:bg-harshu-900 active:bg-harshu-950 text-white rounded-2xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Mic className="w-6 h-6 text-harshu-300 animate-pulse" />
              <span>{UI_TRANSLATIONS.startSpeaking[currentLanguage]}</span>
            </button>

            {/* Secondary Text Action */}
            <button
              type="button"
              onClick={onStartText}
              className="w-full sm:w-auto px-5 py-4 bg-white hover:bg-earth-100 text-harshu-900 border border-earth-300 rounded-2xl text-sm sm:text-base font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Keyboard className="w-5 h-5 text-harshu-700" />
              <span>{UI_TRANSLATIONS.typeInstead[currentLanguage]}</span>
            </button>
          </div>

          {/* Quick Direct Enter Companion Button */}
          <button
            type="button"
            onClick={onEnterCompanion}
            className="mt-4 text-xs sm:text-sm font-semibold text-harshu-700 hover:text-harshu-900 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-harshu-50 transition-colors"
          >
            <span>{UI_TRANSLATIONS.enterHarshu[currentLanguage]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </GlyphPortal>

      {/* Explanatory Acronym & Safe Guidance Section Below Portal */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Core Philosophy Banner */}
        <div className="bg-gradient-to-r from-harshu-900 to-harshu-800 text-white p-6 sm:p-8 rounded-3xl shadow-md mb-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-harshu-700/60 border border-harshu-500/30 flex items-center justify-center flex-shrink-0">
            <Heart className="w-8 h-8 text-harshu-200" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-harshu-300 font-bold">
              HARSHU Philosophy
            </span>
            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
              "{UI_TRANSLATIONS.corePhilosophy[currentLanguage]}"
            </h2>
            <p className="text-xs sm:text-sm text-harshu-200/90 mt-1.5">
              You don't need to know technology. Just speak or touch what you need. HARSHU will guide you one step at a time.
            </p>
          </div>
        </div>

        {/* The 6 Letters Cards */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-harshu-700 uppercase tracking-wider bg-harshu-100 px-3 py-1 rounded-full">
              Product Identity
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-harshu-950 mt-2">
              HARSHU — 6 Letters with Deep Meaning
            </h3>
            <p className="text-sm text-earth-700 max-w-lg mx-auto mt-1">
              Every letter of HARSHU represents our intentional commitment to rural and first-time women internet users.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HARSHU_ACRONYM.map((item, idx) => (
              <div
                key={item.word}
                onClick={() => setSelectedLetter(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedLetter === idx
                    ? 'bg-harshu-50 border-harshu-500 shadow-md ring-2 ring-harshu-400'
                    : 'bg-white border-earth-200 hover:border-harshu-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-xl bg-harshu-800 text-white font-extrabold text-xl flex items-center justify-center">
                    {item.letter}
                  </span>
                  <div>
                    <h4 className="font-bold text-harshu-950 text-base">
                      {item.word}
                    </h4>
                    <span className="text-xs text-harshu-700 font-medium">
                      {item.meaning[currentLanguage]}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-earth-800 mt-2 leading-relaxed">
                  {item.description[currentLanguage]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Safety Guarantee */}
        <div className="bg-white border border-earth-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-earth-100 flex items-center justify-center flex-shrink-0 text-harshu-800">
            <ShieldCheck className="w-7 h-7 text-harshu-700" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-bold text-base sm:text-lg text-harshu-950">
              {currentLanguage === 'ta'
                ? 'முழுமையான பாதுகாப்பு மற்றும் எளிய வழிகாட்டல்'
                : currentLanguage === 'hi'
                ? 'पूर्ण सुरक्षा एवं सरल मार्गदर्शन'
                : '100% Emotional & Digital Safety Guarantee'}
            </h4>
            <p className="text-xs sm:text-sm text-earth-700 mt-1">
              {UI_TRANSLATIONS.privacyGuarantee[currentLanguage]}
            </p>
          </div>
          <button
            type="button"
            onClick={onStartVoice}
            className="px-6 py-3.5 bg-harshu-800 hover:bg-harshu-900 text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-harshu-300" />
            <span>{UI_TRANSLATIONS.startSpeaking[currentLanguage]}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
