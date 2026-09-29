# Lipids & Liver Research Group — Official Web Portal

Official modernized website for the **Lipids & Liver Research Group** (Grupo Consolidado del Gobierno Vasco Tipo A — IT1560-22) at the **University of the Basque Country (UPV/EHU)** and **IIS Biocruces Bizkaia** (Department of Physiology, Faculty of Medicine and Nursing, Leioa Campus).

> [!WARNING]
> ### ⚠️ Estado del Proyecto: Versión Demo en Desarrollo
> 
> Esta web se encuentra actualmente en **fase de desarrollo activo y validación (versión demo/prototipo)**. 
> 
> Por este motivo:
> - **Parte de la información que se muestra en el portal actualmente es provisional o no es correcta** (incluyendo textos de relleno, borradores de proyectos, datos simulados de noticias, colaboraciones o asignaciones de personal pendientes de validación oficial).
> - Ningún dato provisional mostrado en esta versión preliminar debe considerarse definitivo ni oficial hasta la publicación y aprobación final por parte de la Investigadora Principal (**Dra. Patricia Aspichueta**) y el equipo directivo del grupo.
> - La **web oficial y vigente** del grupo de investigación sigue estando disponible en el portal institucional de la UPV/EHU:  
>   🔗 **[https://www.ehu.eus/es/web/lipidsliver](https://www.ehu.eus/es/web/lipidsliver)**

---

## 🚀 Inicio Rápido (Desarrollo Local)

Requisitos: Node.js (v18+)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local con recarga en vivo
./iniciar_servidor.sh
# o alternativamente:
npm run dev
```

El portal estará disponible en: **`http://localhost:4321`**

---

## 📦 Compilación para Producción

Para generar el sitio web 100% estático listo para desplegar en servidores de la UPV/EHU o cualquier servidor web (Apache, Nginx, etc.):

```bash
./construir_web.sh
# o alternativamente:
npm run build
```

El resultado estático se genera en el directorio **`dist/`** (185 páginas HTML compiladas con soporte multilingüe completo en español, euskera e inglés).

---

## 📁 Estructura del Repositorio

- **`src/content/`**: Colecciones de contenido en Markdown estructurado:
  - `team/`: Fichas de los 23 miembros del equipo (PDI, seniors, postdocs, predocs, técnicos) con CVs completos en YAML.
  - `theses/`: 15 tesis doctorales (en curso y defendidas) con resúmenes, directores y descriptores.
  - `research/`: 6 líneas de investigación activas.
  - `publications/`: Artículos científicos indexados en JCR con resúmenes y DOIs.
  - `projects/`: Proyectos de investigación competitivos (Plan Nacional, Gobierno Vasco, FEDER).
  - `news/`: Noticias, notas de prensa y hitos científicos del laboratorio.
  - `templates/`: Plantillas en blanco (`_plantilla_*.md`) para añadir registros fácilmente.
- **`src/data/`**: Datasets estructurados (`alumni.json` para antiguos miembros y trayectorias profesionales, `collaborations.json` para centros hospitalarios y de investigación, `translations.json` para diccionarios i18n).
- **`src/content.config.ts`**: Esquemas de validación tipados con Zod para todo el contenido.
- **`src/layouts/Layout.astro`**: Cabecera institucional con navegación en menús desplegables optimizados, doble logotipo UPV/EHU y grupo, barra de idiomas, selector de modo oscuro/claro y pie de página.
- **`src/pages/`**: Páginas principales (`index.astro`, `/tesis`, `/curriculum`, `/lineas`, `/publicaciones`, `/proyectos`, `/noticias`, `/alumni`, `/divulgacion`, `/recursos`, `/sgiker`, `/unete`, y versiones localizadas en `/eu` y `/en`).
- **`public/assets/css/styles.css`**: Sistema de diseño institucional corporativo con paleta UPV/EHU.
- **`under-construction/` & `en-construccion/`**: Página de preestreno "En Construcción" estática e independiente con simulación de vesículas en canvas y sin accesos a desarrollo, lista para subir directamente por FTP.
- **`COMO_EDITAR.md`**: Guía paso a paso para que personal no técnico del laboratorio actualice contenidos.
- **`PROJECT_CONTEXT.md`**: Documento exhaustivo de arquitectura técnica para desarrolladores y asistentes IA.
- **`.agents/AGENTS.md`**: Reglas y directrices automáticas para el asistente IA **Antigravity**.

---

## 🎨 Identidad Corporativa

- **Azul Marino Institucional (UPV/EHU)**: `#002B49`
- **Azul Pizarra Secundario**: `#1E3A5F`
- **Verde Acento (Logotipo Lipids & Liver)**: `#689F38` / `#8AC63F`
- **Fondo Neutro**: `#F8FAFC` / `#FFFFFF` (Modo Oscuro: `#0f172a` / `#1e293b`)
