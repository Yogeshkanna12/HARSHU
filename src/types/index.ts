export type Language = 'ta' | 'hi' | 'en';

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

export interface IntentResult {
  category: IntentCategory;
  rawInput: string;
  recognizedText: string;
  summaryByLanguage: Record<Language, string>;
  schemeId: string;
}

export interface QuestionOption {
  id: string;
  label: Record<Language, string>;
  icon?: string;
  description?: Record<Language, string>;
}

export interface Question {
  id: string;
  questionText: Record<Language, string>;
  helperText?: Record<Language, string>;
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

export interface Resource {
  id: string;
  title: Record<Language, string>;
  department: Record<Language, string>;
  whatItHelps: Record<Language, string>;
  whoItIsFor: Record<Language, string>;
  eligibility: Record<Language, string[]>;
  documents: Record<Language, string[]>;
  officialSource: string;
  officialUrl: string;
  category: IntentCategory;
  questions?: Question[];
  steps: Record<Language, GuidedStep[]>;
}

export interface AcronymInfo {
  letter: string;
  word: string;
  meaning: Record<Language, string>;
  description: Record<Language, string>;
}
