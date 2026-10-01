import React from 'react';
import { Language, IntentResult } from '../../types';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { Check, Edit3, Volume2, Sparkles, Shield } from 'lucide-react';
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
  const summary = intent.summaryByLanguage[currentLanguage];

  const handleListen = () => {
    speakText(`${UI_TRANSLATIONS.whatIUnderstood[currentLanguage]}. ${summary}. ${UI_TRANSLATIONS.isThisCorrect[currentLanguage]}`, currentLanguage);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="bg-white border-2 border-harshu-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 bg-harshu-100 text-harshu-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-harshu-700" />
            <span>{UI_TRANSLATIONS.whatIUnderstood[currentLanguage]}</span>
          </div>

          <button
            type="button"
            onClick={handleListen}
            className="p-2 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-100 rounded-full transition-colors"
            title="Listen aloud"
            aria-label="Listen aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* User's Original Query */}
        <div className="mb-4 bg-earth-50 p-3 rounded-xl border border-earth-200 text-xs sm:text-sm text-earth-800">
          <span className="font-semibold text-earth-600 block mb-0.5">
            {currentLanguage === 'ta' ? 'நீங்கள் சொன்னது:' : currentLanguage === 'hi' ? 'आपने जो कहा:' : 'What you said:'}
          </span>
          <p className="font-medium italic text-harshu-950">"{intent.rawInput}"</p>
        </div>

        {/* HARSHU's Plain Understanding */}
        <div className="my-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-harshu-950 leading-snug">
            "{summary}"
          </h2>
          <p className="text-sm font-semibold text-harshu-800 mt-3">
            {UI_TRANSLATIONS.isThisCorrect[currentLanguage]}
          </p>
        </div>

        {/* Big Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-harshu-800 hover:bg-harshu-900 active:bg-harshu-950 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Check className="w-5 h-5 text-harshu-300" />
            <span>{UI_TRANSLATIONS.yesCorrect[currentLanguage]}</span>
          </button>

          <button
            type="button"
            onClick={onChange}
            className="flex items-center justify-center gap-2 py-3.5 px-5 bg-earth-100 hover:bg-earth-200 text-earth-900 rounded-2xl text-sm font-semibold transition-colors"
          >
            <Edit3 className="w-4 h-4 text-earth-700" />
            <span>{UI_TRANSLATIONS.changeAnswer[currentLanguage]}</span>
          </button>
        </div>

        {/* Safety reassurance footer */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-earth-100 text-xs text-earth-600 justify-center">
          <Shield className="w-4 h-4 text-harshu-600" />
          <span>{UI_TRANSLATIONS.goBackAnytime[currentLanguage]}</span>
        </div>
      </div>
    </div>
  );
};
