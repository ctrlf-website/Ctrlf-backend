import type { MiWeb } from "../../types/miWeb";

/**
 * Genera una plantilla HTML simple y ligera a partir del objeto MiWeb.
 */
export function renderHTMLTemplate(miWeb: MiWeb): string {
  const header = miWeb.header;

  if (!header) {
    throw new Error(
      "[RENDERER build] -> missing -> header section no definida"
    );
  }

  const { title, textColor, textFamily, backgroundColor, logoUrl } = header;

  const styleBlock = `
  <style>
    header {
      color: ${textColor};
      font-family: ${textFamily};
      background-color: ${backgroundColor};
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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${styleBlock}
  </head>
  <body>
    <header>
      <div class="logo" data-src="${logoUrl || ""}" style="background-image: url('${logoUrl || ""}')"></div>
      <h1>${title}</h1>
    </header>
    <script>
      (function(){
        const placeholder = 'https://res.cloudinary.com/dmieiirut/image/upload/v1764709159/ctrl-f-images/knsquqbd3oqa3utddip2.png';

        function checkUrl(url, onMissing){
          if(!url){ onMissing(); return; }
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function(){};
          img.onerror = function(){ onMissing(); };
          img.src = url;
        }

        // Replace background-image logos
        document.querySelectorAll('.logo[data-src]').forEach(function(el){
          const url = el.getAttribute('data-src');
          checkUrl(url, function(){ el.style.backgroundImage = "url('" + placeholder + "')"; });
        });

        // Also handle <img data-src="..."> elements: swap to placeholder on error
        document.querySelectorAll('img[data-src]').forEach(function(img){
          const url = img.getAttribute('data-src');
          checkUrl(url, function(){ img.src = placeholder; });
        });
      })();
    </script>
  </body>
  </html>
  `;

  console.info(`[RENDERER build] -> success -> HTML generado correctamente`);
  return html.trim();
}
