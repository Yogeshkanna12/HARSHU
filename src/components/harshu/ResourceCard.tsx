import React, { useState } from 'react';
import { Language, Resource } from '../../types';
import { UI_TRANSLATIONS, getT } from '../../utils/translations';
import {
  ShieldCheck,
  FileText,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Volume2,
  ArrowRight,
  Lock,
  ArrowUpRight,
  AlertTriangle,
  X,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface ResourceCardProps {
  currentLanguage: Language;
  resource: Resource;
  onStartGuidedTask: () => void;
  onBack: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  currentLanguage,
  resource,
  onStartGuidedTask,
  onBack,
}) => {
  const [showHandoffModal, setShowHandoffModal] = useState(false);

  const title = getT(resource.title, currentLanguage);
  const dept = getT(resource.department, currentLanguage);
  const whatItHelps = getT(resource.whatItHelps, currentLanguage);
  const whoItIsFor = getT(resource.whoItIsFor, currentLanguage);
  const eligibility =
    resource.eligibility[currentLanguage] ||
    resource.eligibility['ta'] ||
    resource.eligibility['en'] ||
    Object.values(resource.eligibility)[0] ||
    [];
  const documents =
    resource.documents[currentLanguage] ||
    resource.documents['ta'] ||
    resource.documents['en'] ||
    Object.values(resource.documents)[0] ||
    [];

  const handleListenAll = () => {
    speakText(`${title}. ${whatItHelps}. ${whoItIsFor}`, currentLanguage);
  };

  const handleVisitOfficialWebsite = () => {
    if (!resource.officialUrl || resource.officialUrl === '#' || resource.officialUrl.startsWith('javascript:')) {
      alert('Official portal URL is currently unavailable.');
      return;
    }
    window.open(resource.officialUrl, '_blank', 'noopener,noreferrer');
    setShowHandoffModal(false);
  };

  const isOfficial = resource.sourceType === 'official';
  const isGovBacked = resource.sourceType === 'government-backed';
  const isVerified = resource.verified;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top verification indicators */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {isOfficial ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'அதிகாரப்பூர்வ அரசு தளம் (.gov.in)'
                : currentLanguage === 'hi'
                ? 'आधिकारिक सरकारी पोर्टल (.gov.in)'
                : 'Tier 1: Official Government Portal (.gov.in)'}
            </span>
          </span>
        ) : isGovBacked ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'அரசு அங்கீகரித்த பொது தளம்'
                : currentLanguage === 'hi'
                ? 'सरकार-समर्थित अधिकृत मंच'
                : 'Tier 2: Government-Backed Statutory Platform'}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'சரிபார்க்கப்படாத தளம்'
                : currentLanguage === 'hi'
                ? 'गैर-सरकारी स्रोत'
                : 'Tier 3: Third-Party Source'}
            </span>
          </span>
        )}

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>{getT(UI_TRANSLATIONS.harshuExplanationBadge, currentLanguage)}</span>
        </span>

        {isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{resource.lastVerified || 'Active 2026'}</span>
          </span>
        )}
      </div>

      {/* Main Resource Card */}
      <div className="bg-white border-2 border-harshu-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Title & Listen */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-semibold text-harshu-700 block mb-1">
              {dept}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-harshu-950 leading-snug">
              {title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleListenAll}
            className="p-2 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-100 rounded-full transition-colors flex-shrink-0"
            title="Listen aloud"
            aria-label="Listen aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Real Verified Destination Banner */}
        <div className="mt-3 mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                {currentLanguage === 'ta'
                  ? 'உண்மையான அதிகாரப்பூர்வ முகவரி:'
                  : currentLanguage === 'hi'
                  ? 'सत्यापित आधिकारिक वेब पता:'
                  : 'Verified Official Destination:'}
              </span>
              <a
                href={resource.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono font-bold text-emerald-800 hover:underline flex items-center gap-1 mt-0.5 break-all"
              >
                <span>{resource.officialUrl}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
              {resource.domainHierarchy && (
                <span className="text-xs text-emerald-800/80 block mt-0.5">
                  {resource.domainHierarchy}
                </span>
              )}
            </div>
          </div>

          {/* Quick Direct Open */}
          <button
            type="button"
            onClick={() => setShowHandoffModal(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <span>
              {currentLanguage === 'ta'
                ? 'அரசு தளம் ↗'
                : currentLanguage === 'hi'
                ? 'सरकारी पोर्टल ↗'
                : 'Open Portal ↗'}
            </span>
          </button>
        </div>

        {/* What It Helps */}
        <div className="my-5 p-4 bg-harshu-50 rounded-2xl border border-harshu-200/80">
          <span className="text-xs font-bold text-harshu-800 uppercase tracking-wider block mb-1">
            {currentLanguage === 'ta'
              ? 'இந்த உதவி உங்களுக்கு என்ன தரும்?'
              : currentLanguage === 'hi'
              ? 'यह योजना आपके लिए क्या करेगी?'
              : 'What this helps with:'}
          </span>
          <p className="text-sm sm:text-base font-medium text-harshu-950 leading-relaxed">
            {whatItHelps}
          </p>
        </div>

        {/* Who it is for */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-earth-600 mb-1">
            {currentLanguage === 'ta'
              ? 'யாருக்கான திட்டம்?'
              : currentLanguage === 'hi'
              ? 'यह किसके लिए है?'
              : 'Who it is for:'}
          </h3>
          <p className="text-sm font-semibold text-earth-900">
            {whoItIsFor}
          </p>
        </div>

        {/* Simple Eligibility List */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-harshu-950 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>
              {currentLanguage === 'ta'
                ? 'இந்த உதவி பெற தேவையான முக்கிய விஷயங்கள்:'
                : currentLanguage === 'hi'
                ? 'पात्रता की मुख्य शर्तें:'
                : 'Key eligibility requirements:'}
            </span>
          </h3>
          <ul className="space-y-2">
            {eligibility.map((item, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-earth-800 flex items-start gap-2 bg-earth-50/70 p-2.5 rounded-xl border border-earth-100"
              >
                <span className="text-emerald-700 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents Needed */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-harshu-950 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-harshu-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'தேவையான ஆவணங்கள் (பயப்பட வேண்டாம், எளிதானவை):'
                : currentLanguage === 'hi'
                ? 'आवश्यक दस्तावेज (चिंता न करें, बहुत सरल हैं):'
                : 'Documents needed:'}
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="text-xs sm:text-sm font-medium text-harshu-900 bg-white border border-earth-200 p-2.5 rounded-xl flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-harshu-600 flex-shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: 1. Do It With Me  &  2. Visit Official Website */}
        <div className="flex flex-col gap-3">
          {/* Primary Action: DO IT WITH ME */}
          <button
            type="button"
            onClick={onStartGuidedTask}
            className="w-full py-4 px-6 bg-gradient-to-r from-harshu-800 to-harshu-900 hover:from-harshu-900 hover:to-harshu-950 text-white rounded-2xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
          >
            <span>{getT(UI_TRANSLATIONS.doItWithMe, currentLanguage)}</span>
            <ArrowRight className="w-5 h-5 text-harshu-300" />
          </button>

          {/* Secondary Action: VISIT OFFICIAL WEBSITE (Prominent & Real) */}
          <button
            type="button"
            onClick={() => setShowHandoffModal(true)}
            className="w-full py-3.5 px-6 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'அதிகாரப்பூர்வ அரசு தளத்திற்குச் செல்லவும் (Visit Official Website)'
                : currentLanguage === 'hi'
                ? 'आधिकारिक सरकारी वेबसाइट पर जाएं (Visit Official Website)'
                : 'Visit Official Government Website'}
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Verification Source Attribution */}
          <div className="flex items-center justify-between text-xs text-earth-600 px-1 pt-2">
            <span>
              {currentLanguage === 'ta' ? 'ஆதாரம்:' : currentLanguage === 'hi' ? 'स्रोत:' : 'Source:'}{' '}
              {resource.officialSource}
            </span>
            <a
              href={resource.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 hover:text-emerald-950 font-semibold underline flex items-center gap-1"
            >
              <span>{currentLanguage === 'ta' ? 'அரசு தளம்' : currentLanguage === 'hi' ? 'सरकारी पोर्टल' : 'Official Portal'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Confirmation & Reassurance Modal Before Leaving for Government Website */}
      {showHandoffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-emerald-300 animate-slide-up relative">
            <button
              type="button"
              onClick={() => setShowHandoffModal(false)}
              className="absolute top-4 right-4 p-2 text-earth-500 hover:text-earth-800 rounded-full hover:bg-earth-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-700" />
            </div>

            {/* Modal Title */}
            <h3 className="text-xl font-extrabold text-harshu-950 text-center leading-snug">
              {currentLanguage === 'ta'
                ? 'அதிகாரப்பூர்வ அரசு இணையதளத்திற்கு செல்கிறீர்கள்'
                : currentLanguage === 'hi'
                ? 'आप आधिकारिक सरकारी पोर्टल पर जा रही हैं'
                : 'You are visiting the Official Government Portal'}
            </h3>

            <p className="text-xs sm:text-sm text-earth-700 text-center mt-2 mb-4 leading-relaxed">
              {currentLanguage === 'ta'
                ? 'நீங்கள் HARSHU-வை விட்டு வெளியேறி, உண்மையான மற்றும் பாதுகாப்பான அரசாங்க இணையதளத்திற்கு செல்ல இருக்கிறீர்கள்.'
                : currentLanguage === 'hi'
                ? 'आप HARSHU से सीधे सरकार के सुरक्षित एवं आधिकारिक पोर्टल पर जा रही हैं।'
                : 'You are now leaving HARSHU to visit the genuine, authorized government web portal.'}
            </p>

            {/* Reassurance Box */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-5 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>
                  {currentLanguage === 'ta' ? 'பாதுகாப்பான அரசு முகவரி:' : currentLanguage === 'hi' ? 'सुरक्षित सरकारी पता:' : 'Secure Official Destination:'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 font-mono text-xs sm:text-sm font-bold text-emerald-800 break-all">
                {resource.officialUrl}
              </div>

              <div className="text-xs text-emerald-900 leading-relaxed space-y-1">
                <p>
                  <strong>{currentLanguage === 'ta' ? 'அங்கு நீங்கள் என்ன காண்பீர்கள்?' : currentLanguage === 'hi' ? 'वहाँ आपको क्या मिलेगा?' : 'What will you see there?'}</strong>
                </p>
                <p>
                  {currentLanguage === 'ta'
                    ? '• அதிகாரப்பூர்வ திட்ட அறிவிப்பு மற்றும் வழிகாட்டு நெறிமுறைகள்.'
                    : currentLanguage === 'hi'
                    ? '• योजना की आधिकारिक अधिसूचना व दिशा-निर्देश।'
                    : '• Official government scheme notification and guidelines.'}
                </p>
                <p>
                  {currentLanguage === 'ta'
                    ? '• ஆன்லைன் விண்ணப்பப் பதிவு படிவம் மற்றும் உதவி எண்கள்.'
                    : currentLanguage === 'hi'
                    ? '• ऑनलाइन आवेदन पत्र और हेल्पलाइन नंबर।'
                    : '• Direct online registration form and citizen helpline numbers.'}
                </p>
                <p className="pt-1 font-semibold text-emerald-950">
                  {currentLanguage === 'ta'
                    ? '🌿 பயப்பட வேண்டாம்! எந்த உதவி அல்லது சந்தேகம் இருந்தாலும் எப்போது வேண்டுமானாலும் HARSHU-விற்கு திரும்பி வரலாம்.'
                    : currentLanguage === 'hi'
                    ? '🌿 चिंता न करें! किसी भी सहायता के लिए आप कभी भी वापस HARSHU पर आ सकती हैं।'
                    : '🌿 Do not worry! You can always switch back to HARSHU whenever you need guidance.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleVisitOfficialWebsite}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>
                  {currentLanguage === 'ta'
                    ? 'அரசு தளத்தைத் திற (Open Official Portal) ↗'
                    : currentLanguage === 'hi'
                    ? 'सरकारी पोर्टल खोलें (Open Official Portal) ↗'
                    : 'Open Official Portal ↗'}
                </span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowHandoffModal(false)}
                className="w-full py-3 bg-earth-100 hover:bg-earth-200 text-earth-800 rounded-2xl font-semibold text-sm transition-colors"
              >
                {currentLanguage === 'ta'
                  ? 'HARSHU-விலேயே இரு (Stay in HARSHU)'
                  : currentLanguage === 'hi'
                  ? 'HARSHU में ही रहें (Stay in HARSHU)'
                  : 'Stay in HARSHU'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
