import React from 'react';
import { Language, ScreenState } from '../../types';
import { ArrowLeft, Home, Award } from 'lucide-react';

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
  const showBack =
    currentState !== 'home' &&
    currentState !== 'opening';

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-earth-200/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
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
          <div className="w-8 h-8 rounded-full bg-harshu-800 text-harshu-100 flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-harshu-900 transition-colors">
            H
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-harshu-900 tracking-tight leading-none">
                HARSHU
              </span>
              <span className="text-[10px] text-harshu-700 bg-harshu-100/80 px-1.5 py-0.5 rounded font-bold uppercase hidden md:inline">
                Digital Guide
              </span>
            </div>
            <span className="text-[10px] text-earth-700 font-medium hidden sm:inline">
              Help · Access · Resources · Simply · Her · Understanding
            </span>
          </div>
        </button>
      </div>

      {/* Right: Judge Overview + Language Switcher + Home Icon */}
      <div className="flex items-center gap-2">
        {/* Judge / Hackathon Presentation Modal Button */}
        <button
          type="button"
          onClick={onOpenJudgeModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 transition-colors"
          title="Product Architecture & Innovation Overview"
        >
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">Hackathon Story</span>
        </button>

        {/* Language Selection */}
        <div className="flex items-center gap-1 bg-earth-100 p-0.5 rounded-xl border border-earth-200">
          <button
            type="button"
            onClick={() => onSelectLanguage('ta')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              currentLanguage === 'ta'
                ? 'bg-harshu-800 text-white shadow-xs'
                : 'text-earth-800 hover:bg-earth-200/50'
            }`}
          >
            தமிழ்
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              currentLanguage === 'hi'
                ? 'bg-harshu-800 text-white shadow-xs'
                : 'text-earth-800 hover:bg-earth-200/50'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              currentLanguage === 'en'
                ? 'bg-harshu-800 text-white shadow-xs'
                : 'text-earth-800 hover:bg-earth-200/50'
            }`}
          >
            EN
          </button>
        </div>

        {/* Home Button */}
        <button
          type="button"
          onClick={onHome}
          className="p-1.5 text-harshu-800 hover:bg-earth-200/60 rounded-xl transition-colors"
          title="Home"
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
