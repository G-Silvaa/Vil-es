import { GoogleGenAI, Type, Schema } from "@google/genai";
import type { Villain } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const villainSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    identity: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        race: { type: Type.STRING },
        class: { type: Type.STRING },
        alignment: { type: Type.STRING },
        cr: { type: Type.STRING, description: "Challenge Rating or Level" },
        role: { type: Type.STRING, description: "e.g., Big Bad, Manipulator, Mini-boss" },
      },
      required: ["name", "race", "class", "alignment", "cr", "role"],
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        str: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, mod: { type: Type.INTEGER } } },
        dex: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, mod: { type: Type.INTEGER } } },
        con: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, mod: { type: Type.INTEGER } } },
        int: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, mod: { type: Type.INTEGER } } },
        wis: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, mod: { type: Type.INTEGER } } },
        cha: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, mod: { type: Type.INTEGER } } },
        hp: { type: Type.STRING, description: "e.g., 120 (16d8 + 48)" },
        ac: { type: Type.STRING, description: "e.g., 18 (Plate Armor)" },
        proficiencies: { type: Type.ARRAY, items: { type: Type.STRING } },
        senses: { type: Type.ARRAY, items: { type: Type.STRING } },
        languages: { type: Type.ARRAY, items: { type: Type.STRING } },
        resistances: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Damage resistances and immunities combined" },
      },
      required: ["str", "dex", "con", "int", "wis", "cha", "hp", "ac", "proficiencies", "senses", "languages"],
    },
    actions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          desc: { type: Type.STRING },
          isAttack: { type: Type.BOOLEAN },
          attackBonus: { type: Type.STRING, description: "e.g., +9" },
          damage: { type: Type.STRING, description: "e.g., 2d6 + 5 slashing" },
        },
        required: ["name", "desc"],
      },
    },
    legendaryActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { name: { type: Type.STRING }, desc: { type: Type.STRING } },
      },
    },
    lairActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { name: { type: Type.STRING }, desc: { type: Type.STRING } },
      },
    },
    uniqueAbilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { name: { type: Type.STRING }, desc: { type: Type.STRING } },
        required: ["name", "desc"],
      },
    },
    spells: {
      type: Type.OBJECT,
      properties: {
        castingAbility: { type: Type.STRING },
        dc: { type: Type.INTEGER },
        attackBonus: { type: Type.INTEGER },
        spellList: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              slots: { type: Type.INTEGER },
              list: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      },
    },
    personality: {
      type: Type.OBJECT,
      properties: {
        behavior: { type: Type.STRING },
        mannerisms: { type: Type.STRING },
        combatStyle: { type: Type.STRING },
        interaction: { type: Type.STRING },
        appearance: { type: Type.STRING },
        voice: { type: Type.STRING },
      },
      required: ["behavior", "mannerisms", "combatStyle", "interaction", "appearance", "voice"],
    },
    hooks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    variants: {
      type: Type.OBJECT,
      properties: {
        weaker: { type: Type.STRING },
        stronger: { type: Type.STRING },
      },
      required: ["weaker", "stronger"],
    },
  },
  required: ["identity", "stats", "actions", "uniqueAbilities", "personality", "hooks", "variants"],
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!ai) {
    return res.status(500).json({ error: "GEMINI_API_KEY não configurada." });
  }

  const description = (req.body?.description || "").toString().trim();

  if (!description) {
    return res.status(400).json({ error: "Descrição é obrigatória." });
  }

  const prompt = `
    Você é um gerador especializado de vilões para D&D 5e.
    Crie uma ficha de vilão completa baseada nesta descrição: "${description}".
    
    REGRAS CRÍTICAS:
    1. O resultado deve estar estritamente em Português do Brasil.
    2. Siga as regras oficiais da 5ª Edição (SRD) para cálculo de atributos, bônus de ataque e CDs.
    3. Seja criativo nas habilidades únicas, conectando-as ao tema do vilão.
    4. Balanceie o Nível/CR para fazer sentido com a descrição.
    5. Se a descrição não especificar nível, escolha um apropriado para a magnitude do conceito.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: villainSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Nenhum conteúdo retornado");

    const payload = JSON.parse(jsonText) as Villain;
    return res.status(200).json(payload);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Falha ao gerar vilão." });
  }
}
