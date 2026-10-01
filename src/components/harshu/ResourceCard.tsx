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
  MapPin,
  Clock,
  Users,
  ChefHat,
  Send,
  Navigation,
  Bus,
  Film,
  Smartphone,
  CreditCard,
  Mic,
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface ResourceCardProps {
  currentLanguage: Language;
  resource: Resource;
  onStartGuidedTask: () => void;
  onBack: () => void;
  onFollowUp?: (query: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  currentLanguage,
  resource,
  onStartGuidedTask,
  onBack,
  onFollowUp,
}) => {
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

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
    if (
      !resource.officialUrl ||
      resource.officialUrl === '#' ||
      resource.officialUrl.startsWith('javascript:')
    ) {
      alert('Official portal URL is currently unavailable.');
      return;
    }
    window.open(resource.officialUrl, '_blank', 'noopener,noreferrer');
    setShowHandoffModal(false);
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUpText.trim() && onFollowUp) {
      onFollowUp(followUpText.trim());
      setFollowUpText('');
    }
  };

  const handleFollowUpSuggestion = (suggestion: string) => {
    if (onFollowUp) {
      onFollowUp(suggestion);
    }
  };

  const isOfficial = resource.sourceType === 'official';
  const isGovBacked = resource.sourceType === 'government-backed';
  const isVerified = resource.verified;

  const primaryBtnLabel =
    resource.primaryActionLabel?.[currentLanguage] ||
    resource.primaryActionLabel?.ta ||
    resource.primaryActionLabel?.en ||
    getT(UI_TRANSLATIONS.doItWithMe, currentLanguage);

  const defaultFollowups = [
    currentLanguage === 'ta'
      ? 'இதற்கு கட்டணம் ஏதும் செலுத்த வேண்டுமா?'
      : 'Is there any fee for this?',
    currentLanguage === 'ta'
      ? 'எனக்கு படிவம் நிரப்ப பயமாக இருக்கிறது, உதவுங்கள்'
      : 'I am nervous about forms, please help',
    currentLanguage === 'ta'
      ? 'இதன் அடுத்த கட்டம் என்ன?'
      : 'What is the next step?',
  ];

  const followups =
    resource.followupSuggestions?.[currentLanguage] ||
    resource.followupSuggestions?.ta ||
    resource.followupSuggestions?.en ||
    defaultFollowups;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top verification & domain indicators */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {resource.taskType === 'travel' || resource.taskType === 'navigation' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300 shadow-2xs">
            <Bus className="w-3.5 h-3.5 text-teal-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'பயண வழிகாட்டி (Travel Guide)'
                : 'Transit & Navigation Guide'}
            </span>
          </span>
        ) : resource.taskType === 'cooking' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300 shadow-2xs">
            <ChefHat className="w-3.5 h-3.5 text-orange-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'சமையல் வழிகாட்டி (Cooking Companion)'
                : "Let's Cook Together"}
            </span>
          </span>
        ) : resource.taskType === 'booking' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Film className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'சினிமா முன்பதிவு (Cinema Booking)'
                : 'Cinema & Ticket Booking'}
            </span>
          </span>
        ) : resource.taskType === 'technology' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300 shadow-2xs">
            <Smartphone className="w-3.5 h-3.5 text-sky-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'செல்போன் & ஆப் உதவி (Phone & Apps)'
                : 'App & Phone Guide'}
            </span>
          </span>
        ) : resource.taskType === 'payment' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
            <CreditCard className="w-3.5 h-3.5 text-rose-700" />
            <span>
              {currentLanguage === 'ta'
                ? 'பாதுகாப்பான கட்டணம் (Safe Payment)'
                : 'Utility & Bill Payment'}
            </span>
          </span>
        ) : isOfficial ? (
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-900 border border-stone-300">
            <CheckCircle className="w-3.5 h-3.5 text-stone-700" />
            <span>
              {currentLanguage === 'ta' ? 'சரிபார்க்கப்பட்ட தகவல்' : 'Verified Knowledge'}
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

        {/* Real Verified Destination Banner (Official web URL / Map link) */}
        {resource.officialUrl && resource.officialUrl !== '#' && (
          <div className="mt-3 mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  {resource.taskType === 'travel' || resource.taskType === 'navigation'
                    ? currentLanguage === 'ta'
                      ? 'அதிகாரப்பூர்வ தளம் / மேப்:'
                      : 'Official Portal / Map Destination:'
                    : currentLanguage === 'ta'
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
                {resource.taskType === 'travel' || resource.taskType === 'navigation'
                  ? currentLanguage === 'ta'
                    ? 'இணையதளம் திற ↗'
                    : 'Open Portal ↗'
                  : currentLanguage === 'ta'
                  ? 'அரசு தளம் ↗'
                  : currentLanguage === 'hi'
                  ? 'सरकारी पोर्टल ↗'
                  : 'Open Portal ↗'}
              </span>
            </button>
          </div>
        )}

        {/* RECIPE DOMAIN: Ingredients & Cooking Meta */}
        {resource.recipeData && (
          <div className="my-5 p-4 sm:p-5 bg-orange-50/70 border border-orange-200 rounded-2xl">
            <div className="flex flex-wrap items-center gap-4 mb-4 pb-3 border-b border-orange-200/80 text-xs sm:text-sm font-semibold text-orange-950">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>
                  {currentLanguage === 'ta' ? 'ஊறும் நேரம்:' : 'Prep:'}{' '}
                  {resource.recipeData.prepTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-orange-600" />
                <span>
                  {currentLanguage === 'ta' ? 'சமைக்கும் நேரம்:' : 'Cook:'}{' '}
                  {resource.recipeData.cookTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-600" />
                <span>
                  {currentLanguage === 'ta' ? 'அளவு:' : 'Servings:'}{' '}
                  {resource.recipeData.servings}
                </span>
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-900 mb-2">
              {currentLanguage === 'ta'
                ? 'தேவையான பொருட்கள் (Ingredients):'
                : 'Ingredients Needed:'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(
                resource.recipeData.ingredients[currentLanguage] ||
                resource.recipeData.ingredients.ta ||
                resource.recipeData.ingredients.en ||
                []
              ).map((ing: string, idx: number) => {
                const parts = ing.split(':');
                const item = parts[0]?.trim() || ing;
                const amount = parts[1]?.trim() || '';
                return (
                  <div
                    key={idx}
                    className="bg-white/90 p-2.5 rounded-xl border border-orange-200 text-xs sm:text-sm font-medium text-orange-950 flex items-center justify-between"
                  >
                    <span>{item}</span>
                    {amount && <span className="font-bold text-orange-800">{amount}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRAVEL / NAVIGATION DOMAIN: Route & Station Details */}
        {resource.travelData && (
          <div className="my-5 p-4 sm:p-5 bg-teal-50/70 border border-teal-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-teal-200">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-950">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>
                  {typeof resource.travelData.origin === 'string'
                    ? resource.travelData.origin
                    : resource.travelData.origin?.[currentLanguage] ||
                      resource.travelData.origin?.en ||
                      ''}
                </span>
                <span className="text-teal-600 font-extrabold">➔</span>
                <span>
                  {typeof resource.travelData.destination === 'string'
                    ? resource.travelData.destination
                    : resource.travelData.destination?.[currentLanguage] ||
                      resource.travelData.destination?.en ||
                      ''}
                </span>
              </div>
              {resource.travelData.duration && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-teal-900 border border-teal-300 self-start sm:self-auto">
                  ⏱️{' '}
                  {typeof resource.travelData.duration === 'string'
                    ? resource.travelData.duration
                    : resource.travelData.duration?.[currentLanguage] ||
                      resource.travelData.duration?.en ||
                      ''}
                </span>
              )}
            </div>

            {resource.travelData.routeNumbers && resource.travelData.routeNumbers.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-bold text-teal-900 block mb-1">
                  {currentLanguage === 'ta' ? 'பேருந்து எண்கள்:' : 'Bus Route Numbers:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resource.travelData.routeNumbers.map((r: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-teal-300 text-teal-950 text-xs font-mono font-bold rounded-lg"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* What It Helps / Explanation */}
        <div className="my-5 p-4 bg-harshu-50 rounded-2xl border border-harshu-200/80">
          <span className="text-xs font-bold text-harshu-800 uppercase tracking-wider block mb-1">
            {currentLanguage === 'ta'
              ? 'முக்கிய விளக்கம் & உதவி:'
              : currentLanguage === 'hi'
              ? 'मुख्य जानकारी व सहायता:'
              : 'What this helps with:'}
          </span>
          <p className="text-sm sm:text-base font-medium text-harshu-950 leading-relaxed">
            {whatItHelps}
          </p>
        </div>

        {/* Who it is for */}
        {whoItIsFor && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-earth-600 mb-1">
              {currentLanguage === 'ta'
                ? 'யாருக்கானது?'
                : currentLanguage === 'hi'
                ? 'यह किसके लिए है?'
                : 'Who it is for:'}
            </h3>
            <p className="text-sm font-semibold text-earth-900">{whoItIsFor}</p>
          </div>
        )}

        {/* Simple Eligibility List (if present) */}
        {eligibility && eligibility.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-harshu-950 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>
                {resource.taskType === 'travel' || resource.taskType === 'navigation'
                  ? currentLanguage === 'ta'
                    ? 'பயண வழி குறிப்புகள்:'
                    : 'Key Route Instructions:'
                  : currentLanguage === 'ta'
                  ? 'முக்கிய விவரங்கள் & வழிகாட்டல்:'
                  : currentLanguage === 'hi'
                  ? 'महत्वपूर्ण बातें:'
                  : 'Key requirements:'}
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
        )}

        {/* Documents or Steps Needed (if present) */}
        {documents && documents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-harshu-950 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-harshu-700" />
              <span>
                {resource.taskType === 'travel' || resource.taskType === 'booking'
                  ? currentLanguage === 'ta'
                    ? 'முக்கியமாக தேவைப்படுபவை:'
                    : 'Things you need:'
                  : currentLanguage === 'ta'
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
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {/* Primary Action: Tailored to Domain */}
          {resource.steps && resource.steps[currentLanguage]?.length > 0 && (
            <button
              type="button"
              onClick={onStartGuidedTask}
              className="w-full py-4 px-6 bg-gradient-to-r from-harshu-800 to-harshu-900 hover:from-harshu-900 hover:to-harshu-950 text-white rounded-2xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
            >
              <span>{primaryBtnLabel}</span>
              <ArrowRight className="w-5 h-5 text-harshu-300" />
            </button>
          )}

          {/* Secondary Action: Visit Web / Map / Official Link */}
          {resource.officialUrl && resource.officialUrl !== '#' && (
            <button
              type="button"
              onClick={() => setShowHandoffModal(true)}
              className="w-full py-3.5 px-6 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <ExternalLink className="w-5 h-5 text-emerald-700" />
              <span>
                {resource.taskType === 'travel' || resource.taskType === 'navigation'
                  ? currentLanguage === 'ta'
                    ? 'இணையதளம் / வரைபடம் பார்க்க (Open Website/Map) ↗'
                    : 'Open Website / Navigation Map ↗'
                  : currentLanguage === 'ta'
                  ? 'அதிகாரப்பூர்வ அரசு தளத்திற்குச் செல்லவும் (Visit Official Website)'
                  : currentLanguage === 'hi'
                  ? 'आधिकारिक सरकारी वेबसाइट पर जाएं (Visit Official Website)'
                  : 'Visit Official Website'}
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-700" />
            </button>
          )}

          {/* Verification Source Attribution */}
          {resource.officialSource && (
            <div className="flex items-center justify-between text-xs text-earth-600 px-1 pt-2">
              <span>
                {currentLanguage === 'ta'
                  ? 'ஆதாரம்:'
                  : currentLanguage === 'hi'
                  ? 'स्रोत:'
                  : 'Source:'}{' '}
                {resource.officialSource}
              </span>
              {resource.officialUrl && resource.officialUrl !== '#' && (
                <a
                  href={resource.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-800 hover:text-emerald-950 font-semibold underline flex items-center gap-1"
                >
                  <span>
                    {currentLanguage === 'ta' ? 'அதிகாரப்பூர்வ பக்கம்' : 'Official Page'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONVERSATIONAL FOLLOW-UP SECTION: Ask anything else with full context */}
      <div className="mt-6 bg-white border-2 border-harshu-200 rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-harshu-950 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-harshu-600" />
          <span>
            {currentLanguage === 'ta'
              ? 'அடுத்த சந்தேகம் அல்லது கேள்வி உள்ளதா?'
              : currentLanguage === 'hi'
              ? 'कोई और सवाल या शंका है?'
              : 'Have another question? Ask HARSHU:'}
          </span>
        </h3>

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {followups.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleFollowUpSuggestion(s)}
              className="text-xs bg-harshu-50 hover:bg-harshu-100 text-harshu-900 border border-harshu-200 px-3 py-1.5 rounded-full transition-colors font-medium text-left"
            >
              💬 {s}
            </button>
          ))}
        </div>

        {/* Follow-up input form */}
        <form onSubmit={handleFollowUpSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            placeholder={
              currentLanguage === 'ta'
                ? 'எ.கா: "இதற்கு கட்டணம் எவ்வளவு?" அல்லது உங்கள் சந்தேகம்...'
                : currentLanguage === 'hi'
                ? 'जैसे: "क्या कोई फीस लगेगी?" या अपना प्रश्न लिखें...'
                : 'e.g., "Is there any fee?" or ask anything...'
            }
            className="flex-1 px-4 py-3 bg-earth-50 border border-earth-300 rounded-2xl text-xs sm:text-sm text-earth-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-harshu-500"
          />
          <button
            type="submit"
            disabled={!followUpText.trim()}
            className="p-3 bg-harshu-800 hover:bg-harshu-900 disabled:opacity-40 text-white rounded-2xl transition-all flex items-center justify-center shadow-xs"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation & Reassurance Modal Before Leaving for Web / Portal */}
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
                ? 'அதிகாரப்பூர்வ இணையதளத்திற்கு செல்கிறீர்கள்'
                : currentLanguage === 'hi'
                ? 'आप आधिकारिक पोर्टल पर जा रही हैं'
                : 'You are visiting the Verified Destination'}
            </h3>

            <p className="text-xs sm:text-sm text-earth-700 text-center mt-2 mb-4 leading-relaxed">
              {currentLanguage === 'ta'
                ? 'நீங்கள் HARSHU-வை விட்டு வெளியேறி, உண்மையான இணையதளத்திற்கு செல்ல இருக்கிறீர்கள்.'
                : currentLanguage === 'hi'
                ? 'आप HARSHU से सीधे सुरक्षित पोर्टल पर जा रही हैं।'
                : 'You are now leaving HARSHU to visit the genuine web destination.'}
            </p>

            {/* Reassurance Box */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-5 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>
                  {currentLanguage === 'ta'
                    ? 'பாதுகாப்பான முகவரி:'
                    : currentLanguage === 'hi'
                    ? 'सुरक्षित वेब पता:'
                    : 'Secure Destination:'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 font-mono text-xs sm:text-sm font-bold text-emerald-800 break-all">
                {resource.officialUrl}
              </div>

              <div className="text-xs text-emerald-900 leading-relaxed space-y-1">
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
                    ? 'தளத்தைத் திற (Open Website) ↗'
                    : currentLanguage === 'hi'
                    ? 'वेबसाइट खोलें (Open Website) ↗'
                    : 'Open Website ↗'}
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
