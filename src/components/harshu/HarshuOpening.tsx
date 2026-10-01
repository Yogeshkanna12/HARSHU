import React, { useState } from 'react';
import { GlyphPortal } from '../ui/glyph-portal';
import { HARSHU_ACRONYM, UI_TRANSLATIONS, getT } from '../../utils/translations';
import { Language } from '../../types';
import { Mic, Keyboard, ArrowRight, ShieldCheck, Heart, Sparkles, Volume2, Globe, ChevronDown } from 'lucide-react';
import { speakText, SUPPORTED_LANGUAGES } from '../../utils/speech';

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
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Annotations mapped from HARSHU acronym
  const annotations = HARSHU_ACRONYM.map((item) => ({
    char: item.letter,
    label: `${item.word} (${item.meaning[currentLanguage] || item.meaning['ta'] || item.meaning['en']})`,
    sub: item.description[currentLanguage] || item.description['ta'] || item.description['en'],
  }));

  const tagline = getT(UI_TRANSLATIONS.tagline, currentLanguage);
  const subTagline = getT(UI_TRANSLATIONS.subTagline, currentLanguage);

  const handleListenTagline = () => {
    speakText(`${tagline}. ${subTagline}`, currentLanguage);
  };

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative w-full min-h-screen opening-hero-bg text-[#1c2826] overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-saffron-50 opacity-60 blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-harshu-50 opacity-70 blur-3xl translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-earth-100 opacity-40 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Top Bar with Language Selector & Warm Brand Badge */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/92 backdrop-blur-lg border-b border-earth-200/60 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2.5">
          <div className="header-brand-dot w-8 h-8 rounded-full text-white flex items-center justify-center font-extrabold text-base">
            H
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-harshu-900 leading-none tracking-tight">
              HARSHU
            </span>
            <span className="text-[10px] text-harshu-700 font-medium hidden sm:inline">
              Digital Companion for Women
            </span>
          </div>
        </div>

        {/* Multilingual Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 bg-earth-100/90 hover:bg-earth-200 border border-earth-300 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold text-harshu-950 transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-harshu-700" />
            <span>{currentLangMeta.nativeLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-earth-600" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-earth-200 rounded-2xl shadow-2xl p-2 z-50 grid grid-cols-1 gap-1 max-h-80 overflow-y-auto animate-slide-up">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-earth-500 border-b border-earth-100 mb-1">
                Choose Language (13 Languages):
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-harshu-100 text-harshu-900 font-bold ring-1 ring-harshu-300'
                      : 'hover:bg-earth-100 text-earth-800'
                  }`}
                >
                  <span>{lang.nativeLabel}</span>
                  <span className="text-[10px] text-earth-500 font-normal">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
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
          <div className="w-full h-full bg-gradient-to-b from-saffron-50/40 via-[#faf8f5] to-harshu-50/40 opacity-90" />
        }
      >
        {/* Acronym Strip Below Big Letters */}
        <div className="w-full max-w-2xl px-4 flex flex-col items-center text-center">
          <div className="acronym-strip flex flex-wrap justify-center items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold text-harshu-800 px-4 py-2 rounded-2xl mb-4">
            <span className="text-saffron-600 font-extrabold">H</span>elp
            <span className="text-earth-300">·</span>
            <span className="text-saffron-600 font-extrabold">A</span>ccess
            <span className="text-earth-300">·</span>
            <span className="text-saffron-600 font-extrabold">R</span>esources
            <span className="text-earth-300">·</span>
            <span className="text-saffron-600 font-extrabold">S</span>imply
            <span className="text-earth-300">·</span>
            <span className="text-saffron-600 font-extrabold">H</span>er
            <span className="text-earth-300">·</span>
            <span className="text-saffron-600 font-extrabold">U</span>nderstanding
          </div>

          {/* Tagline & Listen Button */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-harshu-950 tracking-tight">
              {tagline}
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
            {subTagline}
          </p>

          {/* Action Buttons: Voice First & Text Option */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
            {/* Primary Voice Action */}
            <button
              type="button"
              onClick={onStartVoice}
              className="relative w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 mic-hero-btn text-white rounded-2xl text-base sm:text-lg font-bold transition-all transform hover:-translate-y-0.5 overflow-hidden group"
            >
              {/* Shine layer */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              <Mic className="w-6 h-6 text-harshu-200 animate-pulse relative z-10" />
              <span className="relative z-10">{getT(UI_TRANSLATIONS.startSpeaking, currentLanguage)}</span>
            </button>

            {/* Secondary Text Action */}
            <button
              type="button"
              onClick={onStartText}
              className="w-full sm:w-auto px-5 py-4 bg-white hover:bg-earth-50 text-harshu-900 border border-earth-300 hover:border-harshu-300 rounded-2xl text-sm sm:text-base font-semibold shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-2"
            >
              <Keyboard className="w-5 h-5 text-harshu-700" />
              <span>{getT(UI_TRANSLATIONS.typeInstead, currentLanguage)}</span>
            </button>
          </div>

          {/* Quick Direct Enter Companion Button */}
          <button
            type="button"
            onClick={onEnterCompanion}
            className="mt-4 text-xs sm:text-sm font-semibold text-harshu-700 hover:text-harshu-900 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-harshu-50 transition-colors"
          >
            <span>{getT(UI_TRANSLATIONS.enterHarshu, currentLanguage)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </GlyphPortal>

      {/* Explanatory Acronym & Safe Guidance Section Below Portal */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Core Philosophy Banner */}
        <div className="philosophy-banner text-white p-6 sm:p-8 rounded-3xl shadow-green mb-12 flex flex-col sm:flex-row items-center gap-6">
          {/* Decorative circle element */}
          <div className="absolute top-3 right-6 w-20 h-20 rounded-full border border-white/10 opacity-50 pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Heart className="w-8 h-8 text-saffron-300" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-harshu-300 font-bold">
              HARSHU Philosophy
            </span>
            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
              "{getT(UI_TRANSLATIONS.corePhilosophy, currentLanguage)}"
            </h2>
            <p className="text-xs sm:text-sm text-harshu-200/90 mt-1.5">
              You don't need to know technology. Just speak or touch what you need in your own language. HARSHU understands meaning and will guide you one step at a time.
            </p>
          </div>
        </div>

        {/* The 6 Letters Cards */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="section-pill text-saffron-800 bg-saffron-50 border-saffron-200">
              <Sparkles className="w-3 h-3" />
              Product Identity
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-harshu-950 mt-3">
              HARSHU — 6 Letters with Deep Meaning
            </h3>
            <p className="text-sm text-earth-700 max-w-lg mx-auto mt-1.5">
              Every letter of HARSHU represents our intentional commitment to rural and first-time women internet users.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HARSHU_ACRONYM.map((item, idx) => {
              const meaningText = item.meaning[currentLanguage] || item.meaning['ta'] || item.meaning['en'];
              const descText = item.description[currentLanguage] || item.description['ta'] || item.description['en'];
              return (
                <div
                  key={item.word}
                  onClick={() => setSelectedLetter(idx)}
                  className={`letter-card p-5 rounded-2xl border-2 cursor-pointer card-premium ${
                    selectedLetter === idx
                      ? 'active'
                      : 'bg-white border-earth-200 hover:border-harshu-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-harshu-700 to-harshu-900 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
                      {item.letter}
                    </span>
                    <div>
                      <h4 className="font-bold text-harshu-950 text-base">
                        {item.word}
                      </h4>
                      <span className="text-xs text-saffron-700 font-semibold">
                        {meaningText}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-earth-800 mt-2 leading-relaxed">
                    {descText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emotional Safety Guarantee */}
        <div className="bg-white border border-earth-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-card">
          {/* Decorative illustration: shield with warm glow */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-50 to-earth-100 flex items-center justify-center flex-shrink-0 shadow-warm">
            <ShieldCheck className="w-8 h-8 text-harshu-700" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <span className="section-pill text-harshu-800 bg-harshu-50 border-harshu-200">
                100% Safe
              </span>
            </div>
            <h4 className="font-bold text-base sm:text-lg text-harshu-950">
              Complete Safety & Easy Guidance
            </h4>
            <p className="text-xs sm:text-sm text-earth-700 mt-1">
              {getT(UI_TRANSLATIONS.privacyGuarantee, currentLanguage)}
            </p>
          </div>
          <button
            type="button"
            onClick={onStartVoice}
            className="relative px-6 py-3.5 mic-hero-btn text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 whitespace-nowrap overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            <Sparkles className="w-4 h-4 text-saffron-300 relative z-10" />
            <span className="relative z-10">{getT(UI_TRANSLATIONS.startSpeaking, currentLanguage)}</span>
          </button>
        </div>

        {/* Trust badges row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { emoji: '🌐', label: '13 Indian Languages' },
            { emoji: '🎙️', label: 'Voice First' },
            { emoji: '🔒', label: 'Private & Safe' },
            { emoji: '🆓', label: '100% Free' },
            { emoji: '📱', label: 'Works on Any Device' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-earth-200 text-xs font-semibold text-earth-800 shadow-sm"
            >
              <span className="text-sm">{badge.emoji}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
