export type Language =
  | 'ta' // Tamil
  | 'hi' // Hindi
  | 'en' // English
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'bn' // Bengali
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'as' // Assamese
  | 'ur'; // Urdu

export type ScreenState =
  | 'opening'
  | 'home'
  | 'listening'
  | 'typing'
  | 'intent_confirm'
  | 'question_flow'
  | 'resource_preview'
  | 'do_it_with_me'
  | 'completion';

export type IntentCategory = 'jobs' | 'skills' | 'services' | 'welfare' | 'scholarship' | 'other';

export interface ClarificationQuestion {
  text: string;
  options: string[];
}

export interface IntentResult {
  category: IntentCategory;
  rawInput: string;
  recognizedText: string;
  detectedLanguage: Language;
  detectedLanguageName: string;
  interpretedMeaning: string; // What the user is actually asking
  directAnswer: string; // HARSHU's direct, factual, helpful answer to the user's question
  summaryByLanguage: Record<string, string>;
  schemeId: string;
  discoveredResource?: Resource;
  clarificationQuestion?: ClarificationQuestion;
  isAiGenerated?: boolean;
}

export interface QuestionOption {
  id: string;
  label: Record<string, string>;
  icon?: string;
  description?: Record<string, string>;
}

export interface Question {
  id: string;
  questionText: Record<string, string>;
  helperText?: Record<string, string>;
  options: QuestionOption[];
}

export interface GuidedStep {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  simplifiedInstruction: string;
  example: string;
  actionType: 'read' | 'select' | 'input' | 'upload_photo' | 'confirm_details' | 'external_handoff';
  options?: string[];
  mockInputLabel?: string;
  mockInputPlaceholder?: string;
  badge?: string;
}

export type SourceType = 'official' | 'government-backed' | 'other';

export interface Resource {
  id: string;
  title: Record<string, string>;
  department: Record<string, string>;
  whatItHelps: Record<string, string>;
  whoItIsFor: Record<string, string>;
  eligibility: Record<string, string[]>;
  documents: Record<string, string[]>;
  officialSource: string;
  officialSourceName?: string;
  officialUrl: string; // The real, verified destination URL (MUST NOT BE FAKE)
  sourceType: SourceType;
  verified: boolean;
  domainHierarchy?: string;
  lastVerified?: string;
  category: IntentCategory;
  questions?: Question[];
  steps: Record<string, GuidedStep[]>;
}

export interface AcronymInfo {
  letter: string;
  word: string;
  meaning: Record<string, string>;
  description: Record<string, string>;
}

export interface SupportedLanguageMeta {
  code: Language;
  label: string;
  nativeLabel: string;
  script: string;
  bcp47: string;
}
