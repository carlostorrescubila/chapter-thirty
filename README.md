# Carlos · 30 Jahre — Website

Una web estática bilingüe (alemán/español) para la celebración de Carlos.

## Archivos
- `index.html`: portada, información de la fiesta y preguntas frecuentes.
- `wishlist.html`: página separada para la wishlist.
- `styles.css`: diseño adaptable a móvil.
- `script.js`: selector de idioma, menú móvil e integración de wishlist.
- `assets/`: banner sin texto y logotipo generados.

## Conectar Google Apps Script
1. Publica tu aplicación de Google Apps Script como aplicación web y copia su URL de despliegue.
2. Abre `script.js`.
3. Sustituye `const WISHLIST_URL = "";` por `const WISHLIST_URL = "TU_URL_PUBLICADA";`.
4. Si tu Apps Script no permite incrustación en iframe, tendremos que enlazarlo con un botón o ajustar la configuración. La URL por sí sola no garantiza que todos los scripts permitan mostrarse embebidos.

## Probar localmente
Abre `index.html` en un navegador. Para algunas funciones del navegador puede ser mejor usar un servidor local.

## Publicar gratis con GitHub Pages
1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos y la carpeta `assets`.
3. En el repositorio abre Settings → Pages.
4. Elige desplegar desde la rama principal y guarda.
5. Espera a que GitHub Pages genere la URL pública.

Antes de compartir la web, completa fecha, hora y lugar, prueba ambos idiomas y revisa el funcionamiento de la wishlist en móvil.
