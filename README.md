# Lipids & Liver Research Group — Official Web Portal

Official modernized website for the **Lipids & Liver Research Group** (Grupo Consolidado del Gobierno Vasco Tipo A — IT1560-22) at the **University of the Basque Country (UPV/EHU)** and **IIS Biocruces Bizkaia** (Department of Physiology, Faculty of Medicine and Nursing, Leioa Campus).

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

El resultado estático se genera en el directorio **`dist/`** (148 páginas HTML compiladas con soporte multilingüe completo en español, euskera e inglés).

---

## 📁 Estructura del Repositorio

- **`src/content/`**: Colecciones de contenido en Markdown estructurado:
  - `team/`: Fichas de los 23 miembros del equipo (PDI, seniors, postdocs, predocs, técnicos) con CVs completos en YAML.
  - `theses/`: 15 tesis doctorales (en curso y defendidas) con resúmenes, directores y descriptores.
  - `research/`: 6 líneas de investigación activas.
  - `publications/`: Artículos científicos indexados en JCR con resúmenes y DOIs.
  - `templates/`: Plantillas en blanco (`_plantilla_*.md`) para añadir registros fácilmente.
- **`src/content.config.ts`**: Esquemas de validación tipados con Zod para todo el contenido.
- **`src/layouts/Layout.astro`**: Cabecera institucional, doble logotipo UPV/EHU y grupo, barra de idiomas, selector de modo oscuro/claro y pie de página.
- **`src/pages/`**: Páginas principales (`index.astro`, `/tesis`, `/curriculum`, `/lineas`, `/publicaciones`, y versiones localizadas en `/eu` y `/en`).
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
