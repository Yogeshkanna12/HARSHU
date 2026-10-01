import React from 'react';
import { Language, Resource } from '../../types';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { ShieldCheck, FileText, CheckCircle, ExternalLink, Sparkles, Volume2, ArrowRight } from 'lucide-react';
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
  const title = resource.title[currentLanguage];
  const dept = resource.department[currentLanguage];
  const whatItHelps = resource.whatItHelps[currentLanguage];
  const whoItIsFor = resource.whoItIsFor[currentLanguage];
  const eligibility = resource.eligibility[currentLanguage];
  const documents = resource.documents[currentLanguage];

  const handleListenAll = () => {
    speakText(`${title}. ${whatItHelps}. ${whoItIsFor}`, currentLanguage);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top badges: Official verification & AI explanation */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>{UI_TRANSLATIONS.officialSourceBadge[currentLanguage]}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>{UI_TRANSLATIONS.harshuExplanationBadge[currentLanguage]}</span>
        </span>
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

        {/* What It Helps */}
        <div className="my-5 p-4 bg-harshu-50 rounded-2xl border border-harshu-200/80">
          <span className="text-xs font-bold text-harshu-800 uppercase tracking-wider block mb-1">
            {currentLanguage === 'ta' ? 'இந்த உதவி உங்களுக்கு என்ன தரும்?' : currentLanguage === 'hi' ? 'यह योजना आपके लिए क्या करेगी?' : 'What this helps with:'}
          </span>
          <p className="text-sm sm:text-base font-medium text-harshu-950 leading-relaxed">
            {whatItHelps}
          </p>
        </div>

        {/* Who it is for */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-earth-600 mb-1">
            {currentLanguage === 'ta' ? 'யாருக்கான திட்டம்?' : currentLanguage === 'hi' ? 'यह किसके लिए है?' : 'Who it is for:'}
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

        {/* Primary Innovation Call To Action: DO IT WITH ME */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onStartGuidedTask}
            className="w-full py-4 px-6 bg-gradient-to-r from-harshu-800 to-harshu-900 hover:from-harshu-900 hover:to-harshu-950 text-white rounded-2xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
          >
            <span>{UI_TRANSLATIONS.doItWithMe[currentLanguage]}</span>
            <ArrowRight className="w-5 h-5 text-harshu-300" />
          </button>

          <div className="flex items-center justify-between text-xs text-earth-600 px-1 pt-2">
            <span>
              {currentLanguage === 'ta' ? 'ஆதாரம்:' : currentLanguage === 'hi' ? 'स्रोत:' : 'Source:'}{' '}
              {resource.officialSource}
            </span>
            <a
              href={resource.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-harshu-700 hover:text-harshu-900 underline flex items-center gap-1"
            >
              <span>{currentLanguage === 'ta' ? 'அரசு தளம்' : currentLanguage === 'hi' ? 'सरकारी पोर्टल' : 'Official Portal'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
