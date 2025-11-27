import { GoogleGenAI, Type } from "@google/genai";
import { BiblePassage, SongLyrics, DailyDevotional } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

// --- Bible Service ---

export const fetchBiblePassage = async (
  query: string,
  language: string = 'English',
  translation: string = 'NIV'
): Promise<BiblePassage> => {
  const prompt = `
    Retrieve the Bible passage for: "${query}".
    Language: ${language}.
    Preferred Translation/Version: ${translation}.
    
    Special Instructions:
    - If the language is "Nepali (Romanized)", output the Nepali translation transliterated into the Roman/English script. This is VERY important. Do NOT output Devanagari script for "Nepali (Romanized)".
    - If the language is "Nepali", output standard Devanagari script (NNRV).
    - If the user enters a topic (e.g., "Love"), find a relevant passage.
    - Ensure the text is accurate to the requested translation.
    - Provide a brief 1-sentence summary/context.
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING, description: "e.g., John 3:16" },
          text: { type: Type.STRING, description: "The full scripture text" },
          translation: { type: Type.STRING, description: "The abbreviation of the translation used" },
          language: { type: Type.STRING },
          summary: { type: Type.STRING, description: "Brief context or summary" }
        },
        required: ["reference", "text", "translation", "language"]
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as BiblePassage;
};

// --- Lyrics Service ---

export const fetchSongLyrics = async (query: string): Promise<SongLyrics> => {
  const prompt = `
    Search for the lyrics for the Christian/Worship song: "${query}".
    
    Instructions:
    1. Search the web for the accurate lyrics. Prioritize sources like nepalichristiansongs.com for Nepali songs.
    2. If the song is Nepali but the query is in English script (Romanized), return the lyrics in Romanized Nepali.
    3. Return the response strictly as a JSON object. Do not include any other text (like markdown backticks) before or after the JSON.
    
    JSON Structure:
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "lyrics": "Full lyrics with newlines...",
      "themes": ["Theme 1", "Theme 2"]
    }
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      // responseMimeType and responseSchema are NOT allowed with tools
    }
  });

  // Extract JSON from text (it might be wrapped in markdown code blocks)
  const text = response.text || "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : "{}";
  
  let data: SongLyrics;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse lyrics JSON", e);
    // Fallback if JSON fails
    data = { title: "Not Found", artist: "Unknown", lyrics: "Could not retrieve lyrics from search results.", themes: [] };
  }

  // Extract Sources from Grounding Metadata
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources: string[] = chunks
    ? chunks
        .map((chunk: any) => chunk.web?.uri)
        .filter((uri: any): uri is string => typeof uri === "string")
    : [];
    
  // Filter unique sources
  data.sources = [...new Set(sources)];

  return data;
};

// --- Daily Devotional Service ---

export const generateDailyDevotional = async (): Promise<DailyDevotional> => {
  const today = new Date().toLocaleDateString();
  const prompt = `
    Generate a short, inspiring Christian daily devotional for today (${today}).
    Include a title, a key scripture verse (text and reference), a 1-paragraph reflection, and a short closing prayer.
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          title: { type: Type.STRING },
          scripture: { type: Type.STRING },
          content: { type: Type.STRING },
          prayer: { type: Type.STRING }
        },
        required: ["title", "scripture", "content", "prayer"]
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as DailyDevotional;
};

// --- Chat Service ---

export const streamChatResponse = async function* (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string
) {
  const chat = ai.chats.create({
    model: modelName,
    history: history,
    config: {
      systemInstruction: "You are a wise, compassionate, and knowledgeable theological assistant for Anugrah Church. You answer questions about the Bible, faith, and church life with grace and accuracy. Stick to orthodox Christian theology."
    }
  });

  const result = await chat.sendMessageStream({ message });
  
  for await (const chunk of result) {
    yield chunk.text;
  }
};