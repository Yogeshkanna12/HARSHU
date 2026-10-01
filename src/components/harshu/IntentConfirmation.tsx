import React, { useState } from 'react';
import { Language, IntentResult } from '../../types';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { Check, Edit3, Volume2, Sparkles, Shield, MessageCircle, HelpCircle, MapPin, Compass, Search } from 'lucide-react';
import { speakText } from '../../utils/speech';
import { requestBrowserLocation, saveUserCoords } from '../../utils/locationService';

interface IntentConfirmationProps {
  currentLanguage: Language;
  intent: IntentResult;
  onConfirm: () => void;
  onChange: () => void;
  onQuerySubmit?: (query: string) => void;
}

export const IntentConfirmation: React.FC<IntentConfirmationProps> = ({
  currentLanguage,
  intent,
  onConfirm,
  onChange,
  onQuerySubmit,
}) => {
  const [areaInput, setAreaInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);

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

  const handleGrantLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await requestBrowserLocation();
      saveUserCoords(coords);
      if (onQuerySubmit) {
        onQuerySubmit(`Find ${intent.locationData?.queryCategory || 'places'} near me`);
      }
    } catch {
      alert('Location access was denied or not available. Please type your area name.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleAreaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (areaInput.trim() && onQuerySubmit) {
      onQuerySubmit(`Find ${intent.locationData?.queryCategory || 'places'} near ${areaInput.trim()}`);
    }
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

        {/* 4. LOCATION ENHANCEMENT: Permission Request or Verified Places Preview */}
        {intent.locationData?.status === 'needs_location_permission' && (
          <div className="mb-6 p-4 sm:p-5 bg-amber-50/95 border-2 border-amber-300 rounded-2xl shadow-xs animate-fade-in">
            <div className="flex items-center gap-2 mb-2 text-amber-950 font-bold text-sm sm:text-base">
              <Compass className="w-5 h-5 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
              <span>
                {currentLanguage === 'ta'
                  ? 'இருப்பிட அனுமதி அல்லது பகுதி பெயர்'
                  : currentLanguage === 'hi'
                  ? 'लोकेशन अनुमति या क्षेत्र का नाम'
                  : 'Location Permission or Area Name'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 mb-3.5 leading-relaxed">
              {currentLanguage === 'ta'
                ? 'உங்களுக்கு மிக அருகிலுள்ள இடங்களை சரியாக கண்டறிய கீழேயுள்ள பொத்தானை தட்டவும், அல்லது உங்கள் ஊரின் பெயரை உள்ளிடவும்.'
                : currentLanguage === 'hi'
                ? 'आपके पास के स्थानों को खोजने के लिए कृपया लोकेशन की अनुमति दें या अपने क्षेत्र का नाम लिखें।'
                : 'To find places closest to you, allow location access or type your area below.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <button
                type="button"
                onClick={handleGrantLocation}
                disabled={isLocating}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>
                  {isLocating
                    ? (currentLanguage === 'ta' ? 'அறிந்துகொள்கிறது...' : 'Detecting...')
                    : (currentLanguage === 'ta' ? '📍 இருப்பிடத்தை அனுமதி (Allow Location)' : '📍 Allow Location Access')}
                </span>
              </button>
            </div>
            <form onSubmit={handleAreaSubmit} className="flex gap-2">
              <input
                type="text"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                placeholder={
                  currentLanguage === 'ta'
                    ? 'எ.கா: Avadi, Tambaram, T Nagar...'
                    : 'e.g., Avadi, Tambaram, T Nagar...'
                }
                className="flex-1 px-3 py-2 text-xs sm:text-sm border border-amber-300 rounded-xl bg-white text-harshu-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                {currentLanguage === 'ta' ? 'தேடு' : 'Search'}
              </button>
            </form>
          </div>
        )}

        {intent.locationData?.status === 'ready' && intent.locationData.places.length > 0 && (
          <div className="mb-6 p-4 sm:p-5 bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl shadow-xs animate-fade-in">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>
                  {currentLanguage === 'ta'
                    ? `📍 ${intent.locationData.places.length} இடங்கள் கண்டறியப்பட்டன`
                    : currentLanguage === 'hi'
                    ? `📍 ${intent.locationData.places.length} स्थान मिले`
                    : `📍 ${intent.locationData.places.length} verified places found`}
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Live OpenStreetMap
              </span>
            </div>
            {intent.locationData.places[0] && (
              <div className="p-3 bg-white border border-emerald-200 rounded-xl mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    🌟 {currentLanguage === 'ta' ? 'மிக அருகில்' : 'Closest'}
                  </span>
                  {intent.locationData.places[0].distanceKm !== undefined && (
                    <span className="text-xs font-bold text-emerald-800 font-mono">
                      {intent.locationData.places[0].distanceKm} km
                    </span>
                  )}
                </div>
                <p className="font-bold text-harshu-950 text-sm mt-1">
                  {intent.locationData.places[0].name}
                </p>
                <p className="text-xs text-earth-600 line-clamp-1 mt-0.5">
                  {intent.locationData.places[0].address}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons: Proceed to Guided Steps vs Ask/Change */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-harshu-800 hover:bg-harshu-900 active:bg-harshu-950 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Check className="w-5 h-5 text-harshu-300" />
            <span>
              {intent.locationData?.status === 'ready'
                ? (currentLanguage === 'ta'
                    ? 'இடங்கள் & வரைபடத்தை பார்க்க ➔'
                    : currentLanguage === 'hi'
                    ? 'स्थान व दिशा-निर्देश देखें ➔'
                    : 'View Places & Navigation ➔')
                : (currentLanguage === 'ta'
                    ? 'ஆம், விவரங்களை பார்க்கலாம் (Continue) ➔'
                    : 'Continue ➔')}
            </span>
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
