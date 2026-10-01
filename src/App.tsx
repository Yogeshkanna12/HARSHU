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
import { detectIntent, getSchemeById } from './utils/intentEngine';
import { VERIFIED_SCHEMES } from './data/schemes';

export const App: React.FC = () => {
  // Current app state
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ta');
  const [screenState, setScreenState] = useState<ScreenState>('opening');
  const [voiceMode, setVoiceMode] = useState<'voice' | 'text'>('voice');

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

  const handleSelectCategory = (category: string, promptText?: string) => {
    const raw = promptText || (
      category === 'skills'
        ? 'எனக்கு தையல் கற்றுக்கணும், உதவி கிடைக்குமா?'
        : category === 'jobs'
        ? 'எனக்கு வேலை வேண்டும்.'
        : category === 'scholarship'
        ? 'என் மகளுக்கு கல்லூரி உதவித்தொகை இருக்கா?'
        : category === 'welfare'
        ? 'மகளிர் உரிமைத் தொகை விண்ணப்பிப்பது எப்படி?'
        : 'எனக்கு அரசு உதவி வேண்டும்.'
    );
    const intentResult = detectIntent(raw, currentLanguage);
    setCurrentIntent(intentResult);
    setActiveResource(getSchemeById(intentResult.schemeId));
    setScreenState('intent_confirm');
  };

  const handleInputSubmit = (text: string) => {
    const intentResult = detectIntent(text, currentLanguage);
    setCurrentIntent(intentResult);
    setActiveResource(getSchemeById(intentResult.schemeId));
    setScreenState('intent_confirm');
  };

  const handleIntentConfirmed = () => {
    // If the scheme has specific one-at-a-time follow up questions, go to question flow;
    // Otherwise go directly to resource card
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
            {screenState === 'home' && (
              <HomeView
                currentLanguage={currentLanguage}
                onStartVoice={handleStartVoice}
                onStartText={handleStartText}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {(screenState === 'listening' || screenState === 'typing') && (
              <VoiceInteraction
                currentLanguage={currentLanguage}
                initialMode={voiceMode}
                onSubmit={handleInputSubmit}
                onCancel={handleBack}
              />
            )}

            {screenState === 'intent_confirm' && currentIntent && (
              <IntentConfirmation
                currentLanguage={currentLanguage}
                intent={currentIntent}
                onConfirm={handleIntentConfirmed}
                onChange={() => setScreenState('listening')}
              />
            )}

            {screenState === 'question_flow' && activeResource.questions && (
              <QuestionFlow
                currentLanguage={currentLanguage}
                questions={activeResource.questions}
                onCompleteQuestions={handleQuestionsCompleted}
                onBack={handleBack}
              />
            )}

            {screenState === 'resource_preview' && (
              <ResourceCard
                currentLanguage={currentLanguage}
                resource={activeResource}
                onStartGuidedTask={handleStartGuidedTask}
                onBack={handleBack}
              />
            )}

            {screenState === 'do_it_with_me' && (
              <GuidedTask
                currentLanguage={currentLanguage}
                resource={activeResource}
                onComplete={handleGuidedTaskCompleted}
                onBackToResource={handleBack}
              />
            )}

            {screenState === 'completion' && (
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
                ⚖️ Hackathon Story & Architecture
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
