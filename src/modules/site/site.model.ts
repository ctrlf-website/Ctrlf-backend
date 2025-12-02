import type { MiWeb } from "../../types/miWeb";

export const validateMiWeb = (data: any): MiWeb => {
  const header = data.header;

  if (
    !header ||
    typeof header.title !== "string" ||
    typeof header.textColor !== "string" ||
    typeof header.textFamily !== "string" ||
    typeof header.backgroundColor !== "string"
  ) {
    throw new Error(
      "[MODEL site] -> error -> Datos inválidos para headerSection"
    );
  }

  if (header.logoUrl && typeof header.logoUrl !== "string") {
    throw new Error("logoUrl debe ser string");
  }

  return data as MiWeb;
};
