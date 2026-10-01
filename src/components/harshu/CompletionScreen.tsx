import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Language, Resource } from '../../types';
import { UI_TRANSLATIONS, getT } from '../../utils/translations';
import {
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Home,
  Volume2,
  FileCheck2,
  Sparkles,
  Award,
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface CompletionScreenProps {
  currentLanguage: Language;
  resource: Resource;
  onRestart: () => void;
  onHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  currentLanguage,
  resource,
  onRestart,
  onHome,
}) => {
  const congratsText = getT(UI_TRANSLATIONS.completedCongrats, currentLanguage);
  const subText = getT(UI_TRANSLATIONS.completedSub, currentLanguage);
  const resourceTitle = getT(resource.title, currentLanguage);

  // Fire gentle celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#25634a', '#3d9972', '#99d1b6', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    // Gentle speech celebration
    const message = `${congratsText}. ${subText}`;
    speakText(message, currentLanguage);
  }, [currentLanguage, congratsText, subText]);

  const handleListenCompletion = () => {
    const message = `${congratsText}. ${subText}`;
    speakText(message, currentLanguage);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-8 animate-fade-in text-center">
      {/* Celebration Icon */}
      <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-100 to-harshu-100 border-4 border-harshu-300 text-harshu-800 shadow-lg mb-4">
        <Award className="w-12 h-12 sm:w-14 sm:h-14 text-harshu-700 animate-bounce" />
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-harshu-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          ✓
        </div>
      </div>

      {/* Main Congratulations Headline */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-harshu-950 tracking-tight">
          {congratsText}
        </h1>
        <button
          type="button"
          onClick={handleListenCompletion}
          className="p-1.5 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-100 rounded-full transition-colors"
          title="Listen celebration"
          aria-label="Listen celebration"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm sm:text-base text-earth-800 max-w-md mx-auto mb-6 leading-relaxed">
        {subText}
      </p>

      {/* Completed Summary Card */}
      <div className="bg-white border-2 border-harshu-200 rounded-3xl p-6 shadow-sm text-left mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-harshu-800 uppercase tracking-wider mb-3">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>
            {currentLanguage === 'ta'
              ? 'முடிவடைந்த வழிகாட்டல் விபரம்:'
              : currentLanguage === 'hi'
              ? 'पूर्ण किए गए कार्य का विवरण:'
              : 'Completed Task Summary:'}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-harshu-950 mb-2">
          {resourceTitle}
        </h3>

        <div className="space-y-2 mt-4">
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-earth-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {currentLanguage === 'ta'
                ? 'தகுதி வரம்புகள் சரிபார்க்கப்பட்டது'
                : currentLanguage === 'hi'
                ? 'पात्रता की शर्तें जांची गईं'
                : 'Eligibility criteria verified'}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-earth-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {currentLanguage === 'ta'
                ? 'தேவையான 3 ஆவணங்கள் பட்டியலிடப்பட்டது'
                : currentLanguage === 'hi'
                ? 'जरूरी दस्तावेज सूची तैयार की गई'
                : 'Required 3 core documents listed'}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-earth-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {currentLanguage === 'ta'
                ? 'இ-சேவை மையம் அணுகும் வழிமுறை தெளிவுபடுத்தப்பட்டது'
                : currentLanguage === 'hi'
                ? 'ई-सेवा केंद्र की प्रक्रिया स्पष्ट की गई'
                : 'e-Sevai center procedure clarified'}
            </span>
          </div>
        </div>

        {/* Official External Link Warning / Transparent Handoff */}
        <div className="mt-5 pt-4 border-t border-earth-100 bg-earth-50/80 p-3.5 rounded-2xl">
          <span className="text-xs font-bold text-earth-700 block mb-1">
            {currentLanguage === 'ta'
              ? 'அதிகாரப்பூர்வ அரசு இணைப்பு:'
              : currentLanguage === 'hi'
              ? 'आधिकारिक सरकारी पोर्टल:'
              : 'Official Government Source:'}
          </span>
          <p className="text-xs text-earth-600 mb-2">
            {currentLanguage === 'ta'
              ? 'உண்மையான விண்ணப்பத்தை இ-சேவை மையம் மூலமாகவோ அல்லது கீழே உள்ள அதிகாரப்பூர்வ அரசு தளத்திலோ சமர்ப்பிக்கலாம்.'
              : currentLanguage === 'hi'
              ? 'वास्तविक आवेदन अपने नजदीकी ई-सेवा केंद्र या नीचे दिए गए सरकारी पोर्टल पर जमा किया जा सकता है।'
              : 'Official submissions are processed through certified e-Sevai centres or the state government portal directly.'}
          </p>

          <a
            href={resource.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-harshu-800 hover:text-harshu-950 underline"
          >
            <span>{resource.officialSource}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Action Buttons: Start another task or back to home */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 py-4 px-6 bg-harshu-800 hover:bg-harshu-900 active:bg-harshu-950 text-white rounded-2xl font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{getT(UI_TRANSLATIONS.startAnotherTask, currentLanguage)}</span>
        </button>

        <button
          type="button"
          onClick={onHome}
          className="py-3.5 px-6 bg-earth-100 hover:bg-earth-200 text-earth-900 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4 text-earth-700" />
          <span>{getT(UI_TRANSLATIONS.backToHome, currentLanguage)}</span>
        </button>
      </div>

      {/* Reassurance */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-harshu-800">
        <Sparkles className="w-4 h-4 text-harshu-600" />
        <span>
          {currentLanguage === 'ta'
            ? 'HARSHU எப்போதும் உங்கள் துணையாக இருக்கும்.'
            : currentLanguage === 'hi'
            ? 'HARSHU हमेशा आपकी सहायता के लिए तैयार है।'
            : 'HARSHU is always here to guide you.'}
        </span>
      </div>
    </div>
  );
};
