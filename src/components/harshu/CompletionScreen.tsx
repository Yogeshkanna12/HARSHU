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
  ShieldCheck,
  Lock,
  ArrowUpRight,
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

  const handleOpenOfficialWebsite = () => {
    if (!resource.officialUrl || resource.officialUrl === '#' || resource.officialUrl.startsWith('javascript:')) {
      alert('Official portal URL is currently unavailable.');
      return;
    }
    window.open(resource.officialUrl, '_blank', 'noopener,noreferrer');
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
                ? 'தகுதி வரம்புகள் மற்றும் விதிமுறைகள் சரிபார்க்கப்பட்டது'
                : currentLanguage === 'hi'
                ? 'पात्रता की शर्तें व नियम सत्यापित किए गए'
                : 'Eligibility conditions and requirements verified'}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-earth-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {currentLanguage === 'ta'
                ? 'தேவையான அனைத்து முக்கிய ஆவணங்களும் பட்டியலிடப்பட்டது'
                : currentLanguage === 'hi'
                ? 'जरूरी सभी मुख्य दस्तावेजों की सूची तैयार की गई'
                : 'All essential documents identified and checked'}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-earth-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {currentLanguage === 'ta'
                ? 'அதிகாரப்பூர்வ அரசு இணையதள செயல்முறை தெளிவாக விளக்கப்பட்டது'
                : currentLanguage === 'hi'
                ? 'आधिकारिक सरकारी पोर्टल की प्रक्रिया समझाई गई'
                : 'Official government portal application steps clarified'}
            </span>
          </div>
        </div>

        {/* Real Verified Government Gateway Handoff */}
        <div className="mt-5 pt-4 border-t border-earth-100 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ அரசு தளம்:'
                : currentLanguage === 'hi'
                ? 'सत्यापित आधिकारिक सरकारी पोर्टल:'
                : 'Verified Official Government Destination:'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-emerald-800 font-mono font-semibold mb-2 break-all">
            <Lock className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>{resource.officialUrl}</span>
          </div>

          {resource.domainHierarchy && (
            <p className="text-xs text-emerald-800/90 mb-3">
              {resource.domainHierarchy}
            </p>
          )}

          {/* Prominent Visit Official Website Button */}
          <button
            type="button"
            onClick={handleOpenOfficialWebsite}
            className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {currentLanguage === 'ta'
                ? 'அதிகாரப்பூர்வ அரசு தளத்திற்குச் செல்லவும் (Visit Official Website)'
                : currentLanguage === 'hi'
                ? 'आधिकारिक सरकारी पोर्टल खोलें (Visit Official Website)'
                : 'Visit Official Government Website'}
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
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
