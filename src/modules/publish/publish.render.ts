import type { MiWeb } from "../../types/miWeb.js";

/**
 * Genera una plantilla HTML simple y ligera a partir del objeto MiWeb.
 */
export function renderHTMLTemplate(miWeb: MiWeb): string {
  const header = miWeb.header;

  if (!header) {
    throw new Error("[RENDERER publish] -> missing -> header section no definida");
  }

  const { title, textColor, textFamily, backgroundColor } = header;

  const styleBlock = `
  <style>
    header {
      color: ${textColor};
      font-family: ${textFamily};
      background-color: ${backgroundColor};
      padding: 2rem;
      text-align: center;
    }
  </style>
  `;

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${styleBlock}
  </head>
  <body>
    <header>
      <h1>${title}</h1>
    </header>
  </body>
  </html>
  `;

  console.info(`[RENDERER publish] -> success -> HTML generado correctamente`);
  return html.trim();
}
