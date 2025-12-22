

export enum Language {
  ANCIENT_GREEK = 'Ancient Greek',
  LATIN = 'Latin',
  MODERN_GREEK = 'Modern Greek'
}

export interface GrammarCell {
  label: string;
  value: string;
}

export interface GrammarRow {
  header: string;
  cells: GrammarCell[];
}

export interface GrammarTable {
  title: string;
  columns: string[];
  rows: GrammarRow[];
}

export interface ExampleSentence {
  text: string;
  translation: string;
  source?: string;
}

// Fixed: Added missing EtymologyStep interface used by EtymologyVisualizer
export interface EtymologyStep {
  period: string;
  form: string;
  description: string;
}

export interface DictionaryEntry {
  word: string;
  polytonicWord?: string;
  partOfSpeech: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  grammarTable: GrammarTable;
  etymology: string;
  examples: ExampleSentence[];
}

export interface SavedEntry {
  word: string;
  displayWord: string;
  language: Language;
  definition: string;
  timestamp: number;
}

export interface SearchState {
  loading: boolean;
  entry: DictionaryEntry | null;
  error: string | null;
}
