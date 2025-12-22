
import { GoogleGenAI, Type } from "@google/genai";
import { Language, DictionaryEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DICTIONARY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    polytonicWord: { type: Type.STRING },
    partOfSpeech: { type: Type.STRING },
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

ΚΡΙΣΙΜΟΙ ΚΑΝΟΝΕΣ:
1. Αρχαία Ελληνικά: Χρησιμοποίησε ΠΑΝΤΑ πολυτονικό σύστημα.
2. Λατινικά: Χρησιμοποίησε την κλασική λατινική ορθογραφία.
3. Νέα Ελληνικά: Χρησιμοποίησε ΑΠΟΚΛΕΙΣΤΙΚΑ το μονοτονικό σύστημα (μόνο οξεία, όχι πνεύματα).
4. ΕΠΙΘΕΤΑ: Εάν η λέξη είναι επίθετο, ο πίνακας γραμματικής (grammarTable) ΠΡΕΠΕΙ να περιλαμβάνει την κλίση και στα ΤΡΙΑ ΓΕΝΗ.
   - Στήλες: "Αρσενικό", "Θηλυκό", "Ουδέτερο" (ή "Masculinum", "Femininum", "Neutrum" για Λατινικά).
   - Γραμμές: Πτώσεις (Ονομαστική, Γενική κ.λπ.) για Ενικό και Πληθυντικό.
5. ΡΗΜΑΤΑ: Ο πίνακας πρέπει να δείχνει την κλίση στους βασικούς χρόνους ή πρόσωπα.
6. Γλώσσα: Οι ορισμοί, η ετυμολογία και οι επεξηγήσεις πρέπει να είναι στα Νέα Ελληνικά (Δημοτική). Παρέχετε μια συνοπτική αλλά περιεκτική ετυμολογία στο πεδίο "etymology".
7. Format: Επίστρεψε ΜΟΝΟ έγκυρο JSON σύμφωνα με το schema.`;

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
