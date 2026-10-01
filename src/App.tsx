import React, { useState } from 'react';
import { Language, ScreenState, IntentResult, Resource, ChatMessage } from './types';
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

  // Active task context & conversational history
  const [currentIntent, setCurrentIntent] = useState<IntentResult | null>(null);
  const [activeResource, setActiveResource] = useState<Resource>(VERIFIED_SCHEMES[0]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
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
      (category === 'travel'
        ? 'காஞ்சிபுரத்துக்கு பேருந்து எங்கே கிடைக்கும்?'
        : category === 'navigation'
        ? 'சென்னை சென்ட்ரலில் இருந்து பார்க் ஸ்டேஷன் போவது எப்படி?'
        : category === 'booking'
        ? 'சினிமா டிக்கெட் ஆன்லைனில் புக் செய்வது எப்படி?'
        : category === 'cooking'
        ? 'சுவையான பிரியாணி செய்வது எப்படி?'
        : category === 'technology'
        ? 'வாட்ஸ்அப் கணக்கு தொடங்குவது எப்படி?'
        : category === 'payment'
        ? 'கரண்ட் பில் ஆன்லைனில் கட்டுவது எப்படி?'
        : category === 'skills'
        ? 'எனக்கு தையல் கற்றுக்கணும், உதவி கிடைக்குமா?'
        : category === 'jobs'
        ? 'எனக்கு வேலை வேண்டும்.'
        : category === 'scholarship'
        ? 'மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை பற்றி நான் தெரிந்துகொள்ள விரும்புகிறேன்.'
        : 'எனக்கு உதவி வேண்டும்.');

    await handleInputSubmit(raw);
  };

  const handleInputSubmit = async (text: string) => {
    setIsAnalyzing(true);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);

    try {
      const intentResult = await detectIntentAsync(text, currentLanguage, updatedHistory);
      setCurrentIntent(intentResult);
      if (intentResult.detectedLanguage) {
        setCurrentLanguage(intentResult.detectedLanguage);
      }
      const res = intentResult.discoveredResource || getSchemeById(intentResult.schemeId);
      setActiveResource(res);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: intentResult.directAnswer || intentResult.interpretedMeaning,
        timestamp: Date.now(),
      };
      setChatHistory([...updatedHistory, modelMsg]);

      setScreenState('intent_confirm');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIntentConfirmed = () => {
    // If it's a direct explanation or has no questions, navigate straight to the resource/answer card
    if (activeResource.mode === 'direct_answer' || !activeResource.questions || activeResource.questions.length === 0) {
      setScreenState('resource_preview');
      return;
    }

    setScreenState('question_flow');
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
    setChatHistory([]);
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
                onFollowUp={(query) => handleInputSubmit(query)}
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
