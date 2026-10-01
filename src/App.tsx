import React, { useState } from 'react';
import { Language, ScreenState, IntentResult, Resource } from './types';
import { HarshuOpening } from './components/harshu/HarshuOpening';
import { Header } from './components/harshu/Header';
import { HomeView } from './components/harshu/HomeView';
import { VoiceInteraction } from './components/harshu/VoiceInteraction';
import { IntentConfirmation } from './components/harshu/IntentConfirmation';
import { QuestionFlow } from './components/harshu/QuestionFlow';
import { ResourceCard } from './components/harshu/ResourceCard';
import { GuidedTask } from './components/harshu/GuidedTask';
import { CompletionScreen } from './components/harshu/CompletionScreen';
import { JudgeModal } from './components/harshu/JudgeModal';
import { detectIntentAsync, getSchemeById } from './utils/intentEngine';
import { VERIFIED_SCHEMES } from './data/schemes';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Current app state
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ta');
  const [screenState, setScreenState] = useState<ScreenState>('opening');
  const [voiceMode, setVoiceMode] = useState<'voice' | 'text'>('voice');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Active task context
  const [currentIntent, setCurrentIntent] = useState<IntentResult | null>(null);
  const [activeResource, setActiveResource] = useState<Resource>(VERIFIED_SCHEMES[0]);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  // Transitions
  const handleStartVoice = () => {
    setVoiceMode('voice');
    setScreenState('listening');
  };

  const handleStartText = () => {
    setVoiceMode('text');
    setScreenState('typing');
  };

  const handleEnterCompanion = () => {
    setScreenState('home');
  };

  const handleHome = () => {
    setScreenState('home');
  };

  const handleSelectCategory = async (category: string, promptText?: string) => {
    const raw =
      promptText ||
      (category === 'skills'
        ? 'எனக்கு தையல் கற்றுக்கணும், உதவி கிடைக்குமா?'
        : category === 'jobs'
        ? 'எனக்கு வேலை வேண்டும்.'
        : category === 'scholarship'
        ? 'மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை பற்றி நான் தெரிந்துகொள்ள விரும்புகிறேன். அரசாங்கத்தின் சார்பில் ஏதேனும் கல்வி உதவித்தொகை வழங்கப்படுகிறதா?'
        : category === 'welfare'
        ? 'மகளிர் உரிமைத் தொகை விண்ணப்பிப்பது எப்படி?'
        : 'எனக்கு அரசு உதவி வேண்டும்.');

    setIsAnalyzing(true);
    try {
      const intentResult = await detectIntentAsync(raw, currentLanguage);
      setCurrentIntent(intentResult);
      if (intentResult.detectedLanguage) {
        setCurrentLanguage(intentResult.detectedLanguage);
      }
      setActiveResource(getSchemeById(intentResult.schemeId));
      setScreenState('intent_confirm');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputSubmit = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const intentResult = await detectIntentAsync(text, currentLanguage);
      setCurrentIntent(intentResult);
      if (intentResult.detectedLanguage) {
        setCurrentLanguage(intentResult.detectedLanguage);
      }
      setActiveResource(getSchemeById(intentResult.schemeId));
      setScreenState('intent_confirm');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIntentConfirmed = () => {
    if (activeResource.questions && activeResource.questions.length > 0) {
      setScreenState('question_flow');
    } else {
      setScreenState('resource_preview');
    }
  };

  const handleQuestionsCompleted = () => {
    setScreenState('resource_preview');
  };

  const handleStartGuidedTask = () => {
    setScreenState('do_it_with_me');
  };

  const handleGuidedTaskCompleted = () => {
    setScreenState('completion');
  };

  const handleRestartJourney = () => {
    setScreenState('home');
    setCurrentIntent(null);
  };

  // Safe Back Navigation
  const handleBack = () => {
    switch (screenState) {
      case 'listening':
      case 'typing':
        setScreenState('home');
        break;
      case 'intent_confirm':
        setScreenState('home');
        break;
      case 'question_flow':
        setScreenState('intent_confirm');
        break;
      case 'resource_preview':
        if (activeResource.questions && activeResource.questions.length > 0) {
          setScreenState('question_flow');
        } else {
          setScreenState('intent_confirm');
        }
        break;
      case 'do_it_with_me':
        setScreenState('resource_preview');
        break;
      case 'completion':
        setScreenState('do_it_with_me');
        break;
      default:
        setScreenState('home');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c2826] flex flex-col font-sans">
      {/* 1. Opening Experience with Glyph Portal */}
      {screenState === 'opening' ? (
        <HarshuOpening
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
          onStartVoice={handleStartVoice}
          onStartText={handleStartText}
          onEnterCompanion={handleEnterCompanion}
        />
      ) : (
        /* 2. Main Companion Flow */
        <div className="flex-1 flex flex-col">
          <Header
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
            currentState={screenState}
            onBack={handleBack}
            onHome={handleHome}
            onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
          />

          <main className="flex-1 flex flex-col justify-center py-4">
            {/* Loading spinner while AI understands intent and formulates direct answer */}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                <div className="w-14 h-14 rounded-full border-4 border-harshu-200 border-t-harshu-800 animate-spin mb-4" />
                <div className="flex items-center gap-2 text-harshu-900 font-bold text-base">
                  <Sparkles className="w-4 h-4 text-harshu-600 animate-pulse" />
                  <span>HARSHU உங்கள் கேள்வியை புரிந்துகொள்கிறது...</span>
                </div>
                <p className="text-xs text-earth-600 mt-1">
                  Understanding meaning and preparing factual guidance in your language
                </p>
              </div>
            )}

            {!isAnalyzing && screenState === 'home' && (
              <HomeView
                currentLanguage={currentLanguage}
                onStartVoice={handleStartVoice}
                onStartText={handleStartText}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {!isAnalyzing && (screenState === 'listening' || screenState === 'typing') && (
              <VoiceInteraction
                currentLanguage={currentLanguage}
                initialMode={voiceMode}
                onSubmit={handleInputSubmit}
                onCancel={handleBack}
              />
            )}

            {!isAnalyzing && screenState === 'intent_confirm' && currentIntent && (
              <IntentConfirmation
                currentLanguage={currentLanguage}
                intent={currentIntent}
                onConfirm={handleIntentConfirmed}
                onChange={() => setScreenState('listening')}
              />
            )}

            {!isAnalyzing && screenState === 'question_flow' && activeResource.questions && (
              <QuestionFlow
                currentLanguage={currentLanguage}
                questions={activeResource.questions}
                onCompleteQuestions={handleQuestionsCompleted}
                onBack={handleBack}
              />
            )}

            {!isAnalyzing && screenState === 'resource_preview' && (
              <ResourceCard
                currentLanguage={currentLanguage}
                resource={activeResource}
                onStartGuidedTask={handleStartGuidedTask}
                onBack={handleBack}
              />
            )}

            {!isAnalyzing && screenState === 'do_it_with_me' && (
              <GuidedTask
                currentLanguage={currentLanguage}
                resource={activeResource}
                onComplete={handleGuidedTaskCompleted}
                onBackToResource={handleBack}
              />
            )}

            {!isAnalyzing && screenState === 'completion' && (
              <CompletionScreen
                currentLanguage={currentLanguage}
                resource={activeResource}
                onRestart={handleRestartJourney}
                onHome={handleHome}
              />
            )}
          </main>

          {/* Gentle, calm, accessible footer */}
          <footer className="py-4 px-6 border-t border-earth-200/70 text-center text-xs text-earth-700 bg-[#faf8f5]">
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-semibold text-harshu-900">
                HARSHU — Help · Access · Resources · Simply · Her · Understanding
              </span>
              <button
                type="button"
                onClick={() => setIsJudgeModalOpen(true)}
                className="text-amber-800 hover:text-amber-950 underline font-medium"
              >
                ⚖️ Hackathon Story & Multilingual Architecture
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Judge & Innovation Walkthrough Modal */}
      <JudgeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />
    </div>
  );
};

export default App;
