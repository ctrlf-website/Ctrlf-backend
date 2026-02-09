import type { MiWeb } from "../../types/miWeb";
/**
 * Genera una plantilla HTML simple y ligera a partir del objeto MiWeb.
 */
export function renderHTMLTemplate(miWeb: MiWeb): string {
  const header = miWeb.header;

  if (!header) {
    throw new Error(
      "[RENDERER build] -> missing -> header section no definida",
    );
  }

  const {
    title,
    textColor,
    textFamily,
    backgroundMode,
    backgroundColor,
    logoUrl,
    backgroundImageUrl,
  } = header;

  const styleBlock = `
  <style>
    header {
      color: ${textColor};
      font-family: ${textFamily};
      background-color: ${backgroundColor};
     background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .logo {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
  </style>
  `;

  const html = `
  <!DOCTYPE html>
<html lang="es">
  <head>
    <!-- Basic -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- SEO -->
    <title>{{title}}</title>
    <meta
      name="description"
      content="{{title}} — sitio web oficial"
    />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="{{siteUrl}}" />

    <!-- Structured Data (IA + SEO) -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "{{title}}",
        "url": "{{siteUrl}}"
      }
    </script>

    <!-- Critical CSS -->
    <style>
      :root {
        --text-color: {{textColor}};
        --bg-color: {{backgroundColor}};
        --font-family: {{textFamily}};
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: var(--font-family);
        color: var(--text-color);
        background-color: #ffffff;
        line-height: 1.5;
      }

      header {
        background-color: var(--bg-color);
        background-image: {{backgroundImage}};
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        padding: 1rem 2rem;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .site-logo {
        width: 60px;
        height: 60px;
        flex-shrink: 0;
      }

      .site-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      h1 {
        font-size: 1.5rem;
        margin: 0;
      }

      main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      footer {
        padding: 1rem 2rem;
        font-size: 0.875rem;
        color: #666;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <!-- Header / Branding -->
    <header>
      <div class="header-content">
        <div class="site-logo">
          <img
            src="{{logoUrl}}"
            alt="Logo de {{title}}"
            loading="eager"
            onerror="this.src='{{placeholderLogo}}'"
          />
        </div>
        <h1>{{title}}</h1>
      </div>
    </header>

    <!-- Main content -->
    <main>
      <section>
        <p>
          Bienvenido al sitio oficial de <strong>{{title}}</strong>.
        </p>
      </section>
    </main>

    <!-- Footer -->
    <footer>
      <p>
        © {{currentYear}} {{title}}. Todos los derechos reservados.
      </p>
    </footer>
  </body>
</html>`;

  console.info(`[RENDERER build] -> success -> HTML generado correctamente`);
  return html.trim();
}
