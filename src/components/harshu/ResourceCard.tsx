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
  Phone,
  Globe,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { speakText } from '../../utils/speech';
import { requestBrowserLocation, saveUserCoords } from '../../utils/locationService';

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
    resource.eligibility['en'] ||
    resource.eligibility['ta'] ||
    Object.values(resource.eligibility)[0] ||
    [];

  const documents =
    resource.documents[currentLanguage] ||
    resource.documents['en'] ||
    resource.documents['ta'] ||
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

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-saffron-50 to-amber-50 text-amber-900 border border-amber-200 shadow-warm">
          <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
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
      <div className="card-premium relative bg-white border-2 border-harshu-200 rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-shadow">
        {/* Title & Listen */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-semibold text-saffron-700 uppercase tracking-wide block mb-1">
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

        {/* UNIVERSAL LOCATION DOMAIN: Nearby Real Places, Distances & Navigation */}
        {resource.locationData && (
          <div className="my-5 space-y-4">
            {/* If Permission is needed */}
            {resource.locationData.status === 'needs_location_permission' && (
              <div className="p-5 sm:p-6 bg-amber-50/90 border-2 border-amber-300 rounded-3xl shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-amber-950 mb-2">
                  {currentLanguage === 'ta'
                    ? 'இருப்பிட அனுமதி தேவை (Location Permission)'
                    : currentLanguage === 'hi'
                    ? 'लोकेशन की अनुमति चाहिए'
                    : 'Location Permission Needed'}
                </h3>
                <p className="text-xs sm:text-sm text-amber-900 mb-5 leading-relaxed max-w-md mx-auto">
                  {currentLanguage === 'ta'
                    ? 'உங்களுக்கு மிக அருகிலுள்ள இடங்களை சரியாகக் கண்டறிய உங்கள் இருப்பிடத்தை பகிரவும் அல்லது உங்கள் ஊரின் பெயரை உள்ளிடவும்.'
                    : currentLanguage === 'hi'
                    ? 'आपके सबसे नजदीकी स्थानों को खोजने के लिए कृपया अपनी लोकेशन शेयर करें या अपने क्षेत्र का नाम दर्ज करें।'
                    : 'I need your location to find places near you. You can allow location access or tell me your area.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const coords = await requestBrowserLocation();
                        saveUserCoords(coords);
                        if (onFollowUp) {
                          onFollowUp(`Find ${resource.locationData?.queryCategory || 'places'} near me`);
                        }
                      } catch {
                        alert(
                          currentLanguage === 'ta'
                            ? 'இருப்பிட அனுமதி கிடைக்கவில்லை. தயவுசெய்து உங்கள் ஊரின் பெயரை தட்டச்சு செய்யவும்.'
                            : 'Could not access location. Please type your area name below.'
                        );
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-harshu-800 hover:bg-harshu-900 text-white text-sm font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <MapPin className="w-4 h-4 text-harshu-300" />
                    <span>
                      {currentLanguage === 'ta'
                        ? 'இருப்பிட அனுமதி வழங்க 📍'
                        : currentLanguage === 'hi'
                        ? 'लोकेशन की अनुमति दें 📍'
                        : 'Allow Location Access 📍'}
                    </span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-amber-200/80 max-w-md mx-auto">
                  <span className="text-xs font-semibold text-amber-900 block mb-2">
                    {currentLanguage === 'ta'
                      ? 'அல்லது உங்கள் ஊர்/பகுதி பெயரை தட்டச்சு செய்யவும்:'
                      : currentLanguage === 'hi'
                      ? 'या अपने शहर / क्षेत्र का नाम लिखें:'
                      : 'Or enter your area/city name:'}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={currentLanguage === 'ta' ? 'எ.கா: Avadi, Tambaram' : 'e.g. Avadi, Tambaram'}
                      id="manual-area-input"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-harshu-600"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && onFollowUp) {
                            onFollowUp(`Find ${resource.locationData?.queryCategory || 'places'} in ${val}`);
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('manual-area-input') as HTMLInputElement;
                        const val = input?.value.trim();
                        if (val && onFollowUp) {
                          onFollowUp(`Find ${resource.locationData?.queryCategory || 'places'} in ${val}`);
                        }
                      }}
                      className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs"
                    >
                      {currentLanguage === 'ta' ? 'தேடு' : 'Search'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* If Results are available */}
            {resource.locationData.status === 'ready' && resource.locationData.places.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs sm:text-sm font-bold text-earth-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>
                      {currentLanguage === 'ta'
                        ? `கிடைத்த இடங்கள் (${resource.locationData.places.length}):`
                        : `Verified Places Nearby (${resource.locationData.places.length}):`}
                    </span>
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    {currentLanguage === 'ta' ? 'உண்மையான இடங்கள்' : 'Real Places'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {resource.locationData.places.map((place, idx) => {
                    const isSelected =
                      place.id === resource.locationData?.selectedPlace?.id ||
                      (idx === 0 && !resource.locationData?.selectedPlace);

                    return (
                      <div
                        key={place.id || idx}
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xs ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/80 border-emerald-400 ring-2 ring-emerald-200'
                            : 'bg-white border-earth-200/90 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-bold text-sm sm:text-base text-earth-950 leading-snug">
                                {place.name}
                              </h4>
                              {idx === 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-950 rounded-full text-[10px] font-bold">
                                  🌟 {currentLanguage === 'ta' ? 'மிக அருகில்' : 'Closest'}
                                </span>
                              )}
                              {place.openNow === true && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-full text-[10px] font-bold">
                                  🟢 {currentLanguage === 'ta' ? 'திறந்துள்ளது' : 'Open'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-earth-700 leading-relaxed flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-earth-500 flex-shrink-0 mt-0.5" />
                              <span>{place.address}</span>
                            </p>
                          </div>

                          {place.distanceKm !== undefined && (
                            <span className="flex-shrink-0 px-2.5 py-1 bg-teal-100 border border-teal-300 text-teal-950 text-xs font-bold rounded-xl whitespace-nowrap">
                              {place.distanceKm} km
                            </span>
                          )}
                        </div>

                        {/* Extra contact tags if available */}
                        {(place.phone || place.website) && (
                          <div className="flex flex-wrap gap-2 my-2.5 pt-2 border-t border-earth-100 text-xs text-earth-700">
                            {place.phone && (
                              <a
                                href={`tel:${place.phone}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-earth-50 hover:bg-earth-100 text-earth-900 border border-earth-200 rounded-lg font-medium"
                              >
                                <Phone className="w-3 h-3 text-emerald-700" />
                                <span>{place.phone}</span>
                              </a>
                            )}
                            {place.website && (
                              <a
                                href={place.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-earth-50 hover:bg-earth-100 text-earth-900 border border-earth-200 rounded-lg font-medium"
                              >
                                <Globe className="w-3 h-3 text-teal-700" />
                                <span>{currentLanguage === 'ta' ? 'இணையதளம்' : 'Website'}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Actions: Directions | Call | Website/More Details */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-earth-100">
                          {/* 1. Directions Button */}
                          <a
                            href={place.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
                          >
                            <Navigation className="w-4 h-4 text-emerald-200" />
                            <span>{currentLanguage === 'ta' ? 'வழிகாட்டு (Directions)' : 'Directions ➔'}</span>
                          </a>

                          {/* 2. Call Button if phone available */}
                          {place.phone && (
                            <a
                              href={`tel:${place.phone}`}
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-earth-100 text-earth-900 border border-earth-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{currentLanguage === 'ta' ? 'அழைக்க' : 'Call'}</span>
                            </a>
                          )}

                          {/* 3. Website / More Details */}
                          <a
                            href={place.website || place.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-earth-100 text-earth-900 border border-earth-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-earth-600" />
                            <span>{currentLanguage === 'ta' ? 'கூடுதல் விவரம்' : 'Details'}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* If 0 results found */}
            {resource.locationData.status === 'no_results' && (
              <div className="p-5 bg-earth-50 border border-earth-200 rounded-2xl text-center">
                <AlertCircle className="w-8 h-8 text-earth-500 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-earth-800 font-medium mb-3">
                  {currentLanguage === 'ta'
                    ? 'மன்னிக்கவும், இந்த இடத்தில் உடனடியாக தகுதியான முடிவுகள் கிடைக்கவில்லை.'
                    : "I couldn't find a suitable place nearby."}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (onFollowUp) {
                        onFollowUp(`Find ${resource.locationData?.queryCategory || 'places'} in Chennai`);
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-earth-300 text-earth-900 text-xs font-semibold rounded-lg hover:bg-earth-100"
                  >
                    {currentLanguage === 'ta' ? 'சென்னை பகுதியில் தேடுக' : 'Search wider area (10 km)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const area = prompt(
                        currentLanguage === 'ta' ? 'உங்கள் ஊரின் பெயரை உள்ளிடவும்:' : 'Enter area name:'
                      );
                      if (area && onFollowUp) {
                        onFollowUp(`Find ${resource.locationData?.queryCategory || 'places'} in ${area}`);
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-earth-300 text-earth-900 text-xs font-semibold rounded-lg hover:bg-earth-100"
                  >
                    {currentLanguage === 'ta' ? 'வேறு ஊரில் தேட' : 'Choose another location'}
                  </button>
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
              className="relative w-full py-4 px-6 mic-hero-btn text-white rounded-2xl text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              <span className="relative z-10">{primaryBtnLabel}</span>
              <ArrowRight className="w-5 h-5 text-harshu-200 relative z-10" />
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

          {/* External Portal Language Advisory */}
          {resource.officialUrl && resource.officialUrl !== '#' && (
            <div className="flex items-start gap-2 bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950">
              <Globe className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                {currentLanguage === 'ta'
                  ? 'குறிப்பு: இந்த அதிகாரப்பூர்வ தளம் ஆங்கிலம் அல்லது மாநில அரசு இணையதள மொழியில் இருக்கலாம். ஆனால் HARSHU அனைத்து தகவல்கள் மற்றும் வழிகாட்டல்களை உங்கள் தாய்மொழியிலேயே தொடர்ந்து வழங்கும்.'
                  : currentLanguage === 'hi'
                  ? 'सूचना: यह आधिकारिक सरकारी वेबसाइट अंग्रेजी या राज्य पोर्टल भाषा में हो सकती है। लेकिन HARSHU के सभी निर्देश आपकी चुनी हुई भाषा में ही रहेंगे।'
                  : 'Note: This official external website may be in English or portal language. HARSHU provides all instructions and guidance in your selected language.'}
              </p>
            </div>
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
      <div className="mt-6 bg-white border-2 border-harshu-200 rounded-3xl p-5 sm:p-6 shadow-card">
        <h3 className="text-sm font-bold text-harshu-950 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron-500" />
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

              <div className="text-xs text-emerald-900 leading-relaxed space-y-1.5">
                <p className="flex items-start gap-1.5 text-emerald-900">
                  <Globe className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {currentLanguage === 'ta'
                      ? 'அதிகாரப்பூர்வ தளம் ஆங்கிலம் அல்லது மாநில மொழியில் இருக்கலாம். ஆனால் வழிகாட்டல் அனைத்தும் HARSHU-வில் உங்கள் மொழியிலேயே இருக்கும்.'
                      : currentLanguage === 'hi'
                      ? 'आधिकारिक पोर्टल अंग्रेजी में हो सकता है, लेकिन HARSHU पर सभी दिशा-निर्देश आपकी चुनी हुई भाषा में ही रहेंगे।'
                      : 'The external website may be in English or portal language. HARSHU will keep all guidance in your selected language.'}
                  </span>
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
