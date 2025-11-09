import type { MiWeb } from "../../types/miWeb.js";

export const validateMiWeb = (data: any): MiWeb => {
  const hero = data.hero;

  if (
    !hero ||
    typeof hero.title !== "string" ||
    typeof hero.textColor !== "string" ||
    typeof hero.textFamily !== "string" ||
    typeof hero.backgroundColor !== "string"
  ) {
    throw new Error(
      "[MODEL site] -> error -> Datos inválidos para heroSection"
    );
  }

  return data as MiWeb;
};
