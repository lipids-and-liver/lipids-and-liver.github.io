# Project Context & Developer Handover Document

## Grupo de Investigación Lipids & Liver (UPV/EHU & IIS Biocruces Bizkaia)
**Grupo Consolidado del Gobierno Vasco (Tipo A — IT1560-22)**
*Departamento de Fisiología | Facultad de Medicina y Enfermería | Campus de Leioa*

> **Propósito de este documento**: Este archivo contiene todo el contexto técnico, arquitectura, esquemas de datos, estado del repositorio y decisiones de diseño necesarias para retomar el desarrollo sin fricciones desde cualquier ordenador utilizando el asistente **Antigravity**.

---

### 1. Resumen Ejecutivo del Proyecto

El portal web del grupo de investigación **Lipids & Liver** ha sido modernizado y migrado a **Astro v5** (Arquitectura basada en componentes y colecciones de contenido estáticas), produciendo un sitio web 100% estático (`dist/`), accesible, multilingüe (**ES, EU, EN**), de alto rendimiento y alineado rigurosamente con la identidad corporativa de la **Universidad del País Vasco (UPV/EHU)** y del **Instituto de Investigación Sanitaria Biocruces Bizkaia**.

---

### 2. Estructura de Directorios del Proyecto

```
lipid_and_liver/
├── .agents/
│   └── AGENTS.md                  # Reglas del espacio de trabajo e instrucciones Antigravity
├── astro.config.mjs               # Configuración de Astro (output: 'static', sitemap, etc.)
├── package.json                   # Dependencias (astro, @astrojs/check, typescript, zod)
├── iniciar_servidor.sh            # Script de conveniencia para npm run dev (http://localhost:4321)
├── construir_web.sh              # Script de conveniencia para npm run build (-> dist/)
├── COMO_EDITAR.md                 # Guía visual para miembros no técnicos del laboratorio
├── PROJECT_CONTEXT.md             # Este documento técnico de traspaso
├── README.md                      # Información general del repositorio
│
├── src/                           # CÓDIGO FUENTE ASTRO
│   ├── content.config.ts          # Esquemas de validación Zod para todas las colecciones
│   ├── content/                   # Contenido en Markdown / YAML
│   │   ├── team/                  # 23 fichas individuales de investigadores/as (*.md)
│   │   ├── theses/                # 15 tesis doctorales en curso y defendidas (*.md)
│   │   ├── research/              # 6 líneas de investigación activas (*.md)
│   │   ├── publications/          # Publicaciones científicas JCR indexadas (*.md)
│   │   ├── presentation/          # Pestañas de presentación del grupo (ES, EU, EN)
│   │   ├── training/              # Docencia en grados, másteres y doctorado
│   │   └── templates/             # Plantillas en blanco (_plantilla_*.md) para nuevos registros
│   ├── data/                      # Datos auxiliares en JSON
│   │   ├── stats.json             # 4 cifras cuantitativas de la barra de estadísticas
│   │   ├── leadership.json        # Datos de dirección (Dra. Patricia Aspichueta)
│   │   └── translations.json      # Diccionario multilingüe (español, euskera, inglés)
│   ├── layouts/
│   │   └── Layout.astro           # Plantilla maestra institucional (cabecera, nav, footer, temas)
│   ├── pages/                     # Rutas estáticas generadas
│   │   ├── index.astro            # Portada principal en español (/)
│   │   ├── [lang]/index.astro     # Portadas en euskera (/eu) e inglés (/en)
│   │   ├── tesis/                 # Catálogo (/tesis) y detalle dinámico (/tesis/[id])
│   │   ├── curriculum/            # Directorio (/curriculum) y CVs (/curriculum/[id])
│   │   ├── lineas/                # Líneas de investigación (/lineas y /lineas/[id])
│   │   ├── publicaciones.astro    # Catálogo completo de artículos con filtros y buscador
│   │   ├── en-construccion/       # Ruta integrada /en-construccion
│   │   └── under-construction/    # Ruta integrada /under-construction
│   ├── components/                # Componentes modulares
│   │   ├── cards/                 # Tarjetas: ResearchCard, TeamCard, ThesisCard, PublicationCard
│   │   └── pages/                 # HomePage, UnderConstructionPage, CurriculumDetailPage, etc.
│   └── utils/
│       └── i18n.ts                # Helpers para i18n y rutas localizadas
│
├── public/                        # ASSETS ESTÁTICOS
│   └── assets/
│       ├── css/styles.css         # Hoja de estilos institucional principal
│       ├── images/                # Fotografías de equipo, líneas de investigación, hero
│       └── images/logo/           # Logotipos oficiales UPV/EHU y Lipids & Liver
│
├── under-construction/            # PÁGINA "EN CONSTRUCCIÓN" ESTÁTICA INDEPENDIENTE
│   ├── index.html                 # Fichero HTML autónomo listo para subir por FTP
│   └── assets/images/             # Assets embebidos para funcionamiento sin servidor
│
├── en-construccion/               # Espejo estático directo para subida rápida
│   └── index.html
│
└── dist/                          # SALIDA DE COMPILACIÓN ESTÁTICA (148 páginas HTML generadas)
```

---

### 3. Estado Actual de las Características Clave

#### A. Portada Principal (`src/components/pages/HomePage.astro`)
- **Hero Institucional**:
  - Disposición en **2 columnas**: a la izquierda el bloque de texto institucional y a la derecha la fotografía del equipo (`hero_outdoor_group.jpg`) en un marco estructurado (`hero-banner-img-box`).
  - **Efectos dinámicos sutiles**:
    1. **Canvas Interactivo (`#hero-particles-canvas`)**: Red molecular y vesículas lipídicas que flotan suavemente, con filamentos reactivos al movimiento del ratón. Se pausa de forma automática al hacer scroll abajo (mediante `IntersectionObserver`) y respeta `prefers-reduced-motion`.
    2. **Orbes Ambientales Radiantes**: Gradientes flotantes en tonos cian y verde institucional que respiran en el fondo sobre el azul marino.
    3. **Insignia de Acreditación**: Indicador verde de pulso activo (`IT1560-22`) y destello sutil (*shimmer*) que pasa cada 14 segundos con opacidad suave (`0.12`).
- **Barra de Métricas Cuantitativas**: Estadísticas fijas (`2007`, `10+`, `15+`, `SGIker`).
- **Sección de Presentación**: Pestañas accesibles (Perfil, Red Traslacional Biocruces, Unidad SGIker, Instalaciones).
- **Líneas de Investigación**: Tarjetas de proyectos con modales y páginas completas de detalle.
- **Directorio de Personal**: Filtros por categoría (Todos, PDI & Seniors, Posdoctoral, Predoctoral, Técnicos).
  - Incluye los perfiles predoctorales incorporados recientemente: **Paul Gómez Jáuregui**, **Ane Ortiz Palma** y **Kendall Alonso Alfaro Jiménez**.
- **Tesis Doctorales**: Filtro segmentado (Todas, En Curso, Defendidas) con enlace al catálogo completo.
- **Publicaciones Destacadas**: Últimos artículos JCR y enlace al catálogo completo con buscador.

#### B. Portal de Currículums (`/curriculum` y `/curriculum/[id]`)
- Directorio de todo el personal científico y docente.
- Página de CV individual con selector desplegable superior para cambiar de investigador al instante.
- Datos estructurados en YAML: titulaciones, cargos, resumen de línea, proyectos financiados, publicaciones seleccionadas y docencia.

#### C. Catálogo de Tesis Doctorales (`/tesis` y `/tesis/[id]`)
- Listado de tesis doctorales tutorizadas en el departamento.
- Página individual con selector interactivo en la barra superior, resumen completo, directores, programa de doctorado y palabras clave.
- **Ordenación Automática Inteligente (`src/utils/theses.ts`)**:
  - Las tesis en curso (`status: 'ongoing'`) se muestran **siempre antes** que las defendidas (`status: 'completed'`).
  - Dentro de cada grupo, se ordenan cronológicamente en orden descendente (las más recientes primero).
  - Al añadir una nueva tesis (ej: iniciada en 2025 o 2026), se posiciona **automáticamente a la cabeza (en primer lugar)**, nunca a la cola.
  - Al defender una tesis y cambiar su estado a `completed` con el año de defensa, pasa automáticamente a encabezar la lista de defendidas.

#### D. Página "En Construcción" (`under-construction/` y `en-construccion/`)
- Diseñada con la estética **Prototipo 5 (Cinematic Storytelling / Fluid Deck)**:
  - Fondo oscuro deep dark (`#07090e`), orbes luminosos y simulación de vesículas lipídicas en Canvas.
  - Tipografía display **Space Grotesk** y cuerpo en **Plus Jakarta Sans**.
  - **Regla estricta**: No contiene ningún enlace ni botón que dé acceso a la versión de desarrollo (`/`).
  - Contiene modales de cristal para *Contacto Directo* (Dra. Patricia Aspichueta) y *Dossier Institucional* (IT1560-22).
  - Disponible tanto como ruta compilada en Astro (`/en-construccion`) como en carpeta estática independiente (`under-construction/index.html` y `en-construccion/index.html`) para subir por FTP si se desea activar inmediatamente en un hosting Apache/Nginx.

---

### 4. Guía de Ejecución y Flujo de Trabajo

#### Instalación inicial (en un equipo nuevo):
```bash
git clone git@github.com:smzlogoj/lipid_and_liver.git
cd lipid_and_liver
npm install
```

#### Modo desarrollo (con recarga en vivo):
```bash
./iniciar_servidor.sh
# o directamente:
npm run dev
# -> Disponible en http://localhost:4321
```

#### Compilación estática para producción:
```bash
./construir_web.sh
# o directamente:
npm run build
# -> Salida generada en dist/
```

---

### 5. Guía de Edición de Contenidos

Para miembros del grupo que deseen añadir o modificar información, consultar la guía amigable [`COMO_EDITAR.md`](COMO_EDITAR.md).
- **Nuevo Miembro**: Duplicar `src/content/templates/_plantilla_miembro.md` en `src/content/team/nombre-apellido.md`.
- **Nueva Tesis**: Duplicar `src/content/templates/_plantilla_tesis.md` en `src/content/theses/tesis-XX.md`.
- **Nueva Publicación**: Duplicar `src/content/templates/_plantilla_publicacion.md` en `src/content/publications/pub-XX.md`.
- **Textos de Interfaz / Idiomas**: Editar `src/data/translations.json`.

---

### 6. Identidad de Diseño y Estilos Corporativos

- **Azul Marino Institucional (UPV/EHU)**: `#002B49`
- **Azul Pizarra Secundario**: `#1E3A5F`
- **Verde Acento (Logotipo Lipids & Liver)**: `#689F38` / `#8AC63F`
- **Superficie Clara**: `#FFFFFF` / Fondo neutro: `#F8FAFC`
- **Modo Oscuro**: Fondo `#0f172a` / Superficie `#1e293b`
- **Estilo visual**: Prestigio universitario, claridad biomédica, alta legibilidad tipográfica y micro-animaciones sobrias.
