import React, { useState } from 'react';
import { Language, ScreenState } from '../../types';
import { ArrowLeft, Home, Award, Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../utils/speech';

interface HeaderProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  currentState: ScreenState;
  onBack?: () => void;
  onHome: () => void;
  onOpenJudgeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onSelectLanguage,
  currentState,
  onBack,
  onHome,
  onOpenJudgeModal,
}) => {
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const showBack =
    currentState !== 'home' &&
    currentState !== 'opening';

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/96 backdrop-blur-lg border-b border-earth-200/70 px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.05)]">
      {/* Left: Back / Brand */}
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-1 text-harshu-800 hover:text-harshu-950 hover:bg-earth-200/60 rounded-xl transition-colors flex items-center gap-1.5"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold hidden sm:inline">
              {currentLanguage === 'ta' ? 'பின்னால்' : currentLanguage === 'hi' ? 'पीछे' : 'Back'}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-2 group text-left"
          title="Return to HARSHU Home"
        >
          {/* Brand mark */}
          <div className="header-brand-dot w-8 h-8 rounded-full text-white flex items-center justify-center font-extrabold text-sm group-hover:scale-105 transition-transform">
            H
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-harshu-900 tracking-tight leading-none">
                HARSHU
              </span>
              <span className="text-[10px] text-harshu-700 bg-harshu-100 px-1.5 py-0.5 rounded font-bold uppercase hidden md:inline border border-harshu-200">
                Multilingual
              </span>
            </div>
            <span className="text-[10px] text-earth-600 font-medium hidden sm:inline">
              Help · Access · Resources · Simply · Her · Understanding
            </span>
          </div>
        </button>
      </div>

      {/* Right: Description + Language Switcher + Home Icon */}
      <div className="flex items-center gap-2">
        {/* Description / Judge Overview Button */}
        <button
          type="button"
          onClick={onOpenJudgeModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-br from-amber-50 to-saffron-50 text-amber-900 border border-amber-200 hover:border-amber-300 hover:bg-amber-100 transition-colors shadow-warm"
          title="Product Architecture & Innovation Overview"
        >
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">Description</span>
        </button>

        {/* Multilingual Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAllLanguages(!showAllLanguages)}
            className="flex items-center gap-1.5 bg-earth-100 hover:bg-earth-200/70 border border-earth-300 hover:border-harshu-300 px-2.5 py-1.5 rounded-xl text-xs font-bold text-harshu-950 transition-colors shadow-sm"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-harshu-700" />
            <span>{currentLangMeta.nativeLabel}</span>
            <ChevronDown className="w-3 h-3 text-earth-600" />
          </button>

          {showAllLanguages && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-earth-200 rounded-2xl shadow-2xl p-2 z-50 grid grid-cols-1 gap-0.5 max-h-80 overflow-y-auto animate-slide-up">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-earth-500 border-b border-earth-100 mb-1">
                Select Indian Language:
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setShowAllLanguages(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-harshu-100 text-harshu-900 font-bold ring-1 ring-harshu-300'
                      : 'hover:bg-earth-50 text-earth-800'
                  }`}
                >
                  <span>{lang.nativeLabel}</span>
                  <span className="text-[10px] text-earth-500 font-normal">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Home Button */}
        <button
          type="button"
          onClick={onHome}
          className="p-1.5 text-harshu-800 hover:bg-harshu-100 hover:text-harshu-950 rounded-xl transition-colors"
          title="Home"
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
