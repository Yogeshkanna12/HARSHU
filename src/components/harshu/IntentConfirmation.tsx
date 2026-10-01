import React from 'react';
import { Language, IntentResult } from '../../types';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { Check, Edit3, Volume2, Sparkles, Shield, MessageCircle, HelpCircle } from 'lucide-react';
import { speakText } from '../../utils/speech';

interface IntentConfirmationProps {
  currentLanguage: Language;
  intent: IntentResult;
  onConfirm: () => void;
  onChange: () => void;
}

export const IntentConfirmation: React.FC<IntentConfirmationProps> = ({
  currentLanguage,
  intent,
  onConfirm,
  onChange,
}) => {
  // Use the detected language for vocalizing the direct answer
  const langToUse = intent.detectedLanguage || currentLanguage;

  const handleListenAnswer = () => {
    speakText(intent.directAnswer, langToUse);
  };

  const handleListenAll = () => {
    speakText(
      `${intent.interpretedMeaning}. ${intent.directAnswer}`,
      langToUse
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top Language & Understanding Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>மொழி: {intent.detectedLanguageName || intent.detectedLanguage}</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-harshu-100 text-harshu-900 px-3 py-1 rounded-full text-xs font-bold border border-harshu-200">
            <Sparkles className="w-3.5 h-3.5 text-harshu-700" />
            <span>பொருள் புரிந்துகொள்ளப்பட்டது</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleListenAll}
          className="p-2 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-100 rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Listen complete explanation"
        >
          <Volume2 className="w-4 h-4" />
          <span>குரல் வழியே கேட்க</span>
        </button>
      </div>

      <div className="bg-white border-2 border-harshu-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* 1. What the user asked */}
        <div className="mb-4 bg-earth-50/80 p-3.5 rounded-2xl border border-earth-200 text-xs sm:text-sm">
          <span className="font-bold text-earth-700 block mb-1 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-earth-600" />
            <span>உங்கள் கேள்வி (Your Question):</span>
          </span>
          <p className="font-medium italic text-harshu-950 text-sm sm:text-base">
            "{intent.rawInput}"
          </p>
        </div>

        {/* 2. Interpreted Meaning (No parrot rephrasing, clear intent identification) */}
        <div className="mb-5 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-harshu-700 block mb-1">
            நீங்கள் அறிய விரும்பியது (Understood Intent):
          </span>
          <p className="text-sm sm:text-base font-semibold text-harshu-900">
            {intent.interpretedMeaning}
          </p>
        </div>

        {/* 3. HARSHU'S ACTUAL DIRECT ANSWER (The user's central requirement!) */}
        <div className="p-5 bg-gradient-to-br from-harshu-50 via-white to-emerald-50/60 rounded-2xl border-2 border-harshu-300 shadow-xs mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-harshu-900 font-extrabold text-sm sm:text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>HARSHU-வின் நேரடி பதில் (Direct Answer):</span>
            </div>
            <button
              type="button"
              onClick={handleListenAnswer}
              className="text-harshu-800 hover:text-harshu-950 p-1 rounded-lg hover:bg-harshu-100 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Listen answer aloud"
            >
              <Volume2 className="w-4 h-4 text-harshu-700" />
              <span className="hidden sm:inline">பதிலை கேட்க</span>
            </button>
          </div>

          <p className="text-base sm:text-lg font-medium text-harshu-950 leading-relaxed">
            {intent.directAnswer}
          </p>
        </div>

        {/* Action Buttons: Proceed to Guided Steps vs Ask/Change */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-harshu-800 hover:bg-harshu-900 active:bg-harshu-950 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Check className="w-5 h-5 text-harshu-300" />
            <span>ஆம், விவரங்களை பார்க்கலாம் (Continue) ➔</span>
          </button>

          <button
            type="button"
            onClick={onChange}
            className="flex items-center justify-center gap-2 py-3.5 px-5 bg-earth-100 hover:bg-earth-200 text-earth-900 rounded-2xl text-sm font-semibold transition-colors"
          >
            <Edit3 className="w-4 h-4 text-earth-700" />
            <span>வேறு கேள்வி கேட்க (Ask another)</span>
          </button>
        </div>

        {/* Safety reassurance footer */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-earth-100 text-xs text-earth-600 justify-center">
          <Shield className="w-4 h-4 text-harshu-600" />
          <span>{UI_TRANSLATIONS.goBackAnytime[currentLanguage] || 'You can go back anytime.'}</span>
        </div>
      </div>
    </div>
  );
};
