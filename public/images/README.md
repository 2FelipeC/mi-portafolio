# Imágenes del portafolio

Coloca aquí las imágenes finales. Se aceptan `.webp`, `.png`, `.jpg` y `.jpeg` (en ese orden de prioridad). Los nombres deben coincidir exactamente.

## Portada

- `hero/background.webp`: imagen de fondo a pantalla completa, recomendada a partir de 1920 × 1080 px. Esta capa cubre toda la portada.
- `hero/portrait.png`: retrato o figura en primer plano. Se recomienda PNG transparente en vertical, de unos 1400 × 1800 px; la persona debe estar recortada alrededor del cuerpo. Esta capa se superpone sobre el fondo.

La portada conserva el texto y el logo de la marca por encima de ambas imágenes. El recorte y la posición se pueden ajustar a las imágenes finales cuando las compartas.

## Proyectos

Hay tres imágenes editoriales para acompañar el recorrido horizontal completo. No están asociadas a un proyecto concreto. Coloca los archivos en `public/images/projects/` con estos nombres (también se aceptan `.png`, `.jpg` y `.jpeg`):

- `editorial-01.webp`
- `editorial-02.webp`
- `editorial-03.webp`

Se recomiendan imágenes de al menos 1200 px en su lado más largo. Se presentan como pequeños acentos independientes (entre 180 y 240 px de ancho máximo en escritorio), con distintas alturas e inclinaciones. Mientras falten, se muestran espacios blancos con esas proporciones. Las imágenes transparentes se muestran completas y sin recorte. Cada logo se presenta junto al texto de su proyecto.

Después de añadir una imagen, reinicia `npm run dev` y recarga la página. En producción se incorporan al ejecutar el build. Los datos y el CV siguen gestionándose desde `src/data/portfolio.ts`.
