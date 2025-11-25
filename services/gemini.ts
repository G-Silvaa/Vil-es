import { Villain } from "../types";

export const generateVillain = async (description: string): Promise<Villain> => {
  const response = await fetch("/api/generate-villain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao gerar vilão");
  }

  return response.json() as Promise<Villain>;
};
