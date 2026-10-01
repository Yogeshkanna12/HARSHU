import React, { useState } from 'react';
import { Language, Resource } from '../../types';
import { UI_TRANSLATIONS, getT } from '../../utils/translations';
import {
  Volume2,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface GuidedTaskProps {
  currentLanguage: Language;
  resource: Resource;
  onComplete: () => void;
  onBackToResource: () => void;
}

export const GuidedTask: React.FC<GuidedTaskProps> = ({
  currentLanguage,
  resource,
  onComplete,
  onBackToResource,
}) => {
  const steps =
    resource.steps[currentLanguage] ||
    resource.steps['ta'] ||
    resource.steps['en'] ||
    Object.values(resource.steps)[0] ||
    [];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSimplified, setShowSimplified] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showStepConfirmModal, setShowStepConfirmModal] = useState(false);

  const step = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;
  const currentStepNumber = currentStepIndex + 1;
  const remainingSteps = totalSteps - currentStepNumber;

  const handleListenStep = (isSimplified: boolean) => {
    if (!step) return;
    const textToSpeak = isSimplified
      ? `${step.simplifiedInstruction} ${step.example}`
      : `${step.title}. ${step.instruction}`;
    speakText(textToSpeak, currentLanguage);
  };

  const handleDontUnderstand = () => {
    setShowSimplified(true);
    handleListenStep(true);
  };

  const handleNextStepClick = () => {
    setShowStepConfirmModal(true);
  };

  const handleConfirmAdvance = () => {
    setShowStepConfirmModal(false);
    setShowSimplified(false);
    setSelectedOption(null);

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    setShowSimplified(false);
    setSelectedOption(null);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      onBackToResource();
    }
  };

  if (!step) return null;

  const stepProgressFn =
    UI_TRANSLATIONS.stepProgress[currentLanguage] ||
    UI_TRANSLATIONS.stepProgress['ta'] ||
    UI_TRANSLATIONS.stepProgress['en'];

  const stepsRemainingFn =
    UI_TRANSLATIONS.stepsRemaining[currentLanguage] ||
    UI_TRANSLATIONS.stepsRemaining['ta'] ||
    UI_TRANSLATIONS.stepsRemaining['en'];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top Banner: Do It With Me + Remaining steps */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="text-xs font-semibold text-earth-700 hover:text-harshu-900 flex items-center gap-1.5 p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getT(UI_TRANSLATIONS.previousStep, currentLanguage)}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-harshu-800 bg-harshu-100 px-3 py-1 rounded-full border border-harshu-200">
            {stepProgressFn ? stepProgressFn(currentStepNumber, totalSteps) : `Step ${currentStepNumber} of ${totalSteps}`}
          </span>
          <span className="text-xs font-medium text-earth-700 hidden sm:inline">
            ({stepsRemainingFn ? stepsRemainingFn(remainingSteps) : `${remainingSteps} steps left`})
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full bg-earth-200 h-2.5 rounded-full overflow-hidden mb-6 shadow-inner">
        <div
          className="bg-gradient-to-r from-harshu-600 to-harshu-800 h-full transition-all duration-500 rounded-full"
          style={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Guided Step Card */}
      <div className="bg-white border-2 border-harshu-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Step Badge & Listen button */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-harshu-700 bg-harshu-50 px-3 py-1 rounded-full border border-harshu-200">
            <Sparkles className="w-3.5 h-3.5 text-harshu-600" />
            <span>{step.badge || `Step ${currentStepNumber}`}</span>
          </span>

          <button
            type="button"
            onClick={() => handleListenStep(showSimplified)}
            className="p-2 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-100 rounded-full transition-colors flex items-center gap-1 text-xs font-bold"
            title="Listen step aloud"
          >
            <Volume2 className="w-5 h-5" />
            <span>{getT(UI_TRANSLATIONS.listenAloud, currentLanguage)}</span>
          </button>
        </div>

        {/* Step Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-harshu-950 mb-3 leading-snug">
          {step.title}
        </h2>

        {/* Regular Instruction */}
        <div className="p-4 bg-earth-50 rounded-2xl border border-earth-200 mb-5">
          <p className="text-base sm:text-lg font-medium text-harshu-950 leading-relaxed">
            {step.instruction}
          </p>
        </div>

        {/* "I DON'T UNDERSTAND" Feature - First Class Citizen */}
        {showSimplified ? (
          <div className="p-5 bg-amber-50/90 border-2 border-amber-300 rounded-2xl mb-6 animate-slide-up">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>
                {currentLanguage === 'ta'
                  ? 'HARSHU-வின் இன்னும் எளிய விளக்கம்:'
                  : currentLanguage === 'hi'
                  ? 'HARSHU की और भी सरल व्याख्या:'
                  : 'HARSHU’s Super-Simple Explanation:'}
              </span>
            </div>

            <p className="text-base font-semibold text-amber-950 leading-relaxed mb-3">
              "{step.simplifiedInstruction}"
            </p>

            <div className="text-xs sm:text-sm text-amber-900 bg-white/80 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>{step.example}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-amber-800 font-medium">
                {currentLanguage === 'ta'
                  ? '🌿 அமைதியாக இருங்கள், உங்களால் முடியும்!'
                  : currentLanguage === 'hi'
                  ? '🌿 चिंता न करें, आप आराम से कर सकती हैं!'
                  : '🌿 Take your time, you can do this!'}
              </span>
              <button
                type="button"
                onClick={() => handleListenStep(true)}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{getT(UI_TRANSLATIONS.listenAloud, currentLanguage)}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleDontUnderstand}
              className="text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>{getT(UI_TRANSLATIONS.iDontUnderstand, currentLanguage)}</span>
            </button>
          </div>
        )}

        {/* Step Action Options / Simulation */}
        {step.options && step.options.length > 0 && (
          <div className="space-y-2.5 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-earth-600 block mb-1">
              {currentLanguage === 'ta'
                ? 'கீழே உள்ளதை தேர்வு செய்யவும்:'
                : currentLanguage === 'hi'
                ? 'नीचे दिए गए विकल्प पर टैप करें:'
                : 'Choose option to proceed:'}
            </span>
            {step.options.map((optionText, idx) => {
              const isSelected = selectedOption === optionText || step.options?.length === 1;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(optionText)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-harshu-50 border-harshu-600 shadow-sm ring-1 ring-harshu-500'
                      : 'bg-white border-earth-200 hover:border-harshu-300'
                  }`}
                >
                  <span className="text-sm sm:text-base font-semibold text-harshu-950">
                    {optionText}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-harshu-700 bg-harshu-700 text-white'
                        : 'border-earth-300 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Primary Proceed Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleNextStepClick}
            className="w-full py-4 px-6 bg-harshu-800 hover:bg-harshu-900 active:bg-harshu-950 text-white rounded-2xl text-base sm:text-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>
              {currentStepIndex === totalSteps - 1
                ? currentLanguage === 'ta'
                  ? 'பணியை நிறைவு செய் 🎉'
                  : currentLanguage === 'hi'
                  ? 'कार्य पूरा करें 🎉'
                  : 'Complete Task 🎉'
                : getT(UI_TRANSLATIONS.markDone, currentLanguage)}
            </span>
            <ArrowRight className="w-5 h-5 text-harshu-300" />
          </button>

          {currentStepIndex === totalSteps - 1 && resource.officialUrl && (
            <div className="mt-3 text-center">
              <a
                href={resource.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{resource.officialSource} ({resource.officialUrl}) ↗</span>
              </a>
            </div>
          )}
        </div>

        {/* Safety Microcopy */}
        <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-earth-600">
          <ShieldCheck className="w-4 h-4 text-harshu-600" />
          <span>{getT(UI_TRANSLATIONS.goBackAnytime, currentLanguage)}</span>
        </div>
      </div>

      {/* Confirmation Modal Before Important Steps */}
      {showStepConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-earth-200 animate-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-harshu-100 text-harshu-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-harshu-700" />
            </div>

            <h3 className="text-lg font-bold text-harshu-950 text-center">
              {currentLanguage === 'ta'
                ? 'அடுத்த படிக்கு செல்லலாமா?'
                : currentLanguage === 'hi'
                ? 'क्या अगले कदम पर चलें?'
                : 'Ready for the next step?'}
            </h3>

            <p className="text-xs sm:text-sm text-earth-700 text-center mt-1 mb-6">
              {currentLanguage === 'ta'
                ? 'நீங்கள் இந்த படியை பூர்த்தி செய்துவிட்டீர்கள் என்றால் தொடரலாம். சந்தேகம் இருந்தால் மீண்டும் பார்க்கலாம்.'
                : currentLanguage === 'hi'
                ? 'यदि आपने यह चरण समझ लिया है तो आगे बढ़ें। आप कभी भी वापस आ सकती हैं।'
                : 'If you are comfortable with this step, let us move forward together.'}
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmAdvance}
                className="w-full py-3 bg-harshu-800 hover:bg-harshu-900 text-white rounded-xl font-bold text-sm shadow-xs"
              >
                {currentLanguage === 'ta' ? 'ஆம், தொடரலாம் ➔' : currentLanguage === 'hi' ? 'हाँ, आगे बढ़ें ➔' : 'Yes, continue ➔'}
              </button>
              <button
                type="button"
                onClick={() => setShowStepConfirmModal(false)}
                className="w-full py-2.5 bg-earth-100 hover:bg-earth-200 text-earth-800 rounded-xl font-semibold text-xs"
              >
                {currentLanguage === 'ta'
                  ? 'இல்லை, இன்னொரு முறை பார்க்கிறேன்'
                  : currentLanguage === 'hi'
                  ? 'नहीं, एक बार फिर देखना है'
                  : 'Check this step again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
