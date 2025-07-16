// Shared interfaces for Patient Chart App

export interface Remedy {
  name: string;
  possible_treatment: string;
  link: string;
  expectation: string;
  reason: string;
}

export interface AISuggestions {
  [symptom: string]: Remedy[];
}

export interface CyberVisit {
  summary: string;
  pain_map: string;
  stool_notes: string;
  foods: string;
}

export interface IntakeForm {
  height: string;
  weight: string;
}

export interface SuggestionFeedback {
  name: string;
  expectation: string;
  reason: string;
  link: string;
  tried: string;
  why_not?: string;
  result?: string;
  comment_patient?: string;
}

export interface DetailItem {
  symptom: string;
  diagnosis: string;
  treatment: string;
  rules: string;
  expectations: string;
  reference: string;
  product_reason: string;
  product_link: string;
}
