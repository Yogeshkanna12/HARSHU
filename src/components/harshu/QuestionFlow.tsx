import React, { useState } from 'react';
import { Language, Question, QuestionOption } from '../../types';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { Volume2, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { speakText } from '../../utils/speech';

interface QuestionFlowProps {
  currentLanguage: Language;
  questions: Question[];
  onCompleteQuestions: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export const QuestionFlow: React.FC<QuestionFlowProps> = ({
  currentLanguage,
  questions,
  onCompleteQuestions,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleListenQuestion = () => {
    if (!currentQ) return;
    speakText(currentQ.questionText[currentLanguage], currentLanguage);
  };

  const handleSelectOption = (opt: QuestionOption) => {
    const updated = { ...answers, [currentQ.id]: opt.id };
    setAnswers(updated);

    if (isLast) {
      onCompleteQuestions(updated);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Progress pill */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevQuestion}
          className="text-xs font-semibold text-earth-700 hover:text-harshu-900 flex items-center gap-1.5 p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLanguage === 'ta' ? 'முந்தைய கேள்வி' : currentLanguage === 'hi' ? 'पिछला सवाल' : 'Previous'}</span>
        </button>

        <div className="text-xs font-bold text-harshu-800 bg-harshu-100 px-3 py-1 rounded-full border border-harshu-200">
          {UI_TRANSLATIONS.stepProgress[currentLanguage](currentIndex + 1, questions.length)}
        </div>
      </div>

      {/* Reassuring header */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-harshu-700 inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-harshu-600" />
          <span>{UI_TRANSLATIONS.oneStepAtATime[currentLanguage]}</span>
        </span>

        <div className="flex items-center justify-center gap-2 mt-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-harshu-950 leading-snug">
            {currentQ.questionText[currentLanguage]}
          </h2>
          <button
            type="button"
            onClick={handleListenQuestion}
            className="p-1.5 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-100 rounded-full transition-colors flex-shrink-0"
            title="Listen question"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {currentQ.helperText && (
          <p className="text-xs sm:text-sm text-earth-600 mt-1">
            {currentQ.helperText[currentLanguage]}
          </p>
        )}
      </div>

      {/* Options - Large touch buttons */}
      <div className="space-y-3.5 mt-6">
        {currentQ.options.map((opt) => {
          const isSelected = answers[currentQ.id] === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-harshu-50 border-harshu-600 shadow-md ring-2 ring-harshu-400'
                  : 'bg-white border-earth-200 hover:border-harshu-300 hover:bg-earth-50 shadow-xs'
              }`}
            >
              <div className="flex-1">
                <span className="text-base sm:text-lg font-bold text-harshu-950 block">
                  {opt.label[currentLanguage]}
                </span>
                {opt.description && (
                  <span className="text-xs sm:text-sm text-earth-700 mt-1 block">
                    {opt.description[currentLanguage]}
                  </span>
                )}
              </div>
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'border-harshu-700 bg-harshu-700 text-white'
                    : 'border-earth-300 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 fill-current" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Safety message */}
      <p className="text-xs text-center text-earth-600 mt-6">
        {UI_TRANSLATIONS.goBackAnytime[currentLanguage]}
      </p>
    </div>
  );
};
