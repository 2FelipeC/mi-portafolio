# Portafolio de Steban Felipe

Portafolio profesional de Steban Felipe Cuasquer Rosero, enfocado en desarrollo full-stack, aplicaciones web, Python, automatización y productos digitales basados en datos e inteligencia artificial. Destaca proyectos como NEVORA, la plataforma web de SOLENER-CM y software registrado para análisis de baterías.

El sitio incluye versión bilingüe:

- Español: `/mi-portafolio/`
- Inglés: `/mi-portafolio/en/`

## Tecnologías

- Astro
- Tailwind CSS
- TypeScript
- GitHub Pages y GitHub Actions

## Desarrollo local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Astro mostrará la URL local, habitualmente `http://localhost:4321/mi-portafolio/`.

## Build de producción

```bash
npm run build
npm run preview
```

Antes del build se genera automáticamente el CV en PDF. El resultado estático se genera en `dist/`.

## CV generado automáticamente

El CV se genera desde la información centralizada en `src/data/portfolio.ts`; no hace falta subir manualmente un PDF.

Para generarlo localmente:

```bash
npm run generate:cv
```

El archivo generado queda en:

```text
public/cv/cv-steban-felipe-cuasquer.pdf
```

Para actualizar el contenido del CV, edita `src/data/portfolio.ts` y vuelve a ejecutar `npm run generate:cv` o `npm run build`.

## Despliegue en GitHub Pages

1. Crea en GitHub el repositorio `mi-portafolio`.
2. Vincula este proyecto local con el repositorio remoto.
3. En GitHub, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente.
4. Sube la rama `main`. El workflow `.github/workflows/deploy.yml` construirá y publicará el sitio.
5. La URL prevista es `https://2felipec.github.io/mi-portafolio/`.

## Contenido editable

La información profesional, las traducciones y los datos usados para generar el CV están centralizados en `src/data/portfolio.ts`. Los componentes visuales están en `src/components/`.

## Próximos pasos

- Sustituir los enlaces temporales de LinkedIn, demos y repositorios de proyectos.
- Incorporar imágenes reales de proyectos en `public/images/projects/` si están disponibles.
- Revisar los metadatos de publicaciones y añadir sus enlaces públicos o DOI.
