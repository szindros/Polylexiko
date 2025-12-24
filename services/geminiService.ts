
import { GoogleGenAI, Type } from "@google/genai";
import { Language, DictionaryEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DICTIONARY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    polytonicWord: { type: Type.STRING },
    partOfSpeech: { type: Type.STRING },
    adjectiveForms: { type: Type.STRING, description: "For adjectives, provide the forms in all 3 genders (e.g., -ος, -η, -ον or -us, -a, -um). Leave empty for other parts of speech." },
    definition: { type: Type.STRING },
    synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
    antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
    grammarTable: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        columns: { type: Type.ARRAY, items: { type: Type.STRING } },
        rows: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              header: { type: Type.STRING },
              cells: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ["label", "value"]
                }
              }
            },
            required: ["header", "cells"]
          }
        }
      },
      required: ["title", "columns", "rows"]
    },
    etymology: { type: Type.STRING },
    examples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          translation: { type: Type.STRING },
          source: { type: Type.STRING }
        },
        required: ["text", "translation"]
      }
    }
  },
  required: ["word", "partOfSpeech", "definition", "synonyms", "antonyms", "grammarTable", "etymology", "examples"]
};

const SYSTEM_INSTRUCTION = `Είσαι ένας κορυφαίος φιλόλογος και λεξικογράφος με εξειδίκευση στα Αρχαία Ελληνικά, τα Λατινικά και τα Νέα Ελληνικά.

ΚΡΙΣΙΜΟΙ ΚΑΝΟΝΕΣ ΠΙΝΑΚΑ ΓΡΑΜΜΑΤΙΚΗΣ:
1. Το πεδίο "columns" ΠΡΕΠΕΙ να περιέχει τα ονόματα των στηλών (π.χ. ["Αρσενικό", "Θηλυκό", "Ουδέτερο"]).
2. Κάθε αντικείμενο στο "cells" ΠΡΕΠΕΙ να έχει "label" που να αντιστοιχεί ΑΚΡΙΒΩΣ σε ένα από τα ονόματα στο "columns".
3. ΕΑΝ Η ΛΕΞΗ ΕΙΝΑΙ ΕΠΙΘΕΤΟ: Ο πίνακας ΠΡΕΠΕΙ να έχει 3 στήλες: "Αρσενικό", "Θηλυκό", "Ουδέτερο".
4. ΕΑΝ Η ΛΕΞΗ ΕΙΝΑΙ ΡΗΜΑ: Ο πίνακας ΠΡΕΠΕΙ να έχει στήλες για τους Χρόνους ή τις Εγκλίσεις.
5. Το "header" κάθε σειράς είναι η Πτώση (π.χ. "Ονομαστική Ενικού") ή το Πρόσωπο (π.χ. "Α' Ενικό").

ΓΕΝΙΚΟΙ ΚΑΝΟΝΕΣ:
- Αρχαία Ελληνικά: ΠΑΝΤΑ πολυτονικό.
- Νέα Ελληνικά: ΠΑΝΤΑ μονοτονικό (μόνο οξεία).
- Ετυμολογία: Μία παράγραφος κειμένου.
- Μορφή: Μόνο έγκυρο JSON.`;

export const fetchDictionaryEntry = async (word: string, lang: Language): Promise<DictionaryEntry> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ανάλυση της λέξης: "${word}" στη γλώσσα: ${lang}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: DICTIONARY_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as DictionaryEntry;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Αποτυχία ανάκτησης δεδομένων. Δοκιμάστε ξανά.");
  }
};

export const convertToPolytonic = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Μετάτρεψε σε Πολυτονικό: "${text}".`,
      config: { 
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: "Μετάτρεψε το κείμενο σε σωστό Πολυτονικό σύστημα. Επίστρεψε μόνο το αποτέλεσμα."
      }
    });
    return response.text?.trim() || text;
  } catch (error) {
    return text;
  }
};
