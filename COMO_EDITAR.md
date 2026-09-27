# Guía de Edición de Contenidos - Grupo Lipids & Liver

¡Bienvenido/a! Esta web cuenta con dos formas de gestión:
1. **Panel de Edición Visual (Keystatic CMS - Recomendado)**: interfaz web amigable con formularios, sin tocar archivos ni código.
2. **Edición Manual de Archivos Markdown**: para usuarios avanzados o edición directa en texto plano.

---

## 🚀 Método Recomendado: Panel de Edición Visual (Keystatic)

No necesitas saber programar ni formatear archivos. Puedes editar todo mediante formularios interactivos en tu navegador:

1. **Inicia el panel de control:**
   ```bash
   ./iniciar_cms.sh
   # (O alternativamente: npm run dev)
   ```
2. **Abre tu navegador en:**
   👉 **`http://localhost:4321/keystatic`**
3. **Elige la sección en el menú lateral:**
   - **Contenido en Español:** Tesis Doctorales, Personal y Equipo, Líneas de Investigación, Publicaciones, Docencia, Presentación.
   - **Edukiak Euskaraz:** Doktorego Tesiak, Taldea, Ikerketa Lerroak, Argitalpenak, Prestakuntza.
   - **English Content:** PhD Theses, Personnel, Research Lines, Publications, Academic Training.
4. **Crea, edita o elimina:**
   - Rellena los campos con validación automática (título, autor, fechas, enlaces, selector de estado).
   - **Foto / Imagen**: puedes arrastrar o seleccionar una foto directamente desde tu ordenador (Keystatic la guarda y vincula automáticamente). Si no subes ninguna, se usará la silueta institucional por defecto.
   - Escribe el resumen o biografía en un editor de texto enriquecido (negritas, listas, enlaces).
   - Haz clic en **"Create"** o **"Save"**. ¡Keystatic guardará los cambios automáticamente en los archivos Markdown!
5. **Para compilar la web final estática para el servidor UPV/EHU:**
   ```bash
   ./construir_web.sh
   # Genera la carpeta dist/ 100% lista para subir por FTP
   ```

---

## 🌐 Estructura Multilingüe (Español, Euskera e Inglés)

La web da soporte completo a **Español (ES)**, **Euskera (EU)** e **Inglés (EN)**.

Toda la información se organiza en carpetas por idioma dentro de `src/content/`:
```text
src/content/
├── presentation/             # Pestañas de la Presentación del Grupo
│   ├── es/                   # Versión en Español (principal / obligatoria)
│   ├── eu/                   # Traducciones al Euskera (opcional)
│   └── en/                   # Traducciones al Inglés (opcional)
├── theses/                   # Tesis Doctorales
│   ├── es/
│   ├── eu/
│   └── en/
├── team/                     # Directorio de Personal y CVs
│   ├── es/
│   ├── eu/
│   └── en/
├── research/                 # Líneas de Investigación
│   ├── es/
│   ├── eu/
│   └── en/
├── publications/             # Publicaciones JCR
│   ├── es/
│   ├── eu/
│   └── en/
├── training/                 # Formación Académica, Másteres y Doctorados
│   ├── es/
│   ├── eu/
│   └── en/
└── templates/                # Plantillas limpias listas para copiar y rellenar
```

### 🛡️ ¿Qué pasa si un elemento no está traducido? (Fallback Inteligente)
**¡No te preocupes por tener que traducir todo a la vez!**
El sistema cuenta con un mecanismo de **reemplazo automático (fallback)**:
- Si un archivo existe en `es/` pero aún no ha sido traducido a `eu/` o `en/`, la web en euskera o inglés **mostrará automáticamente la versión en español**.
- De este modo, la web nunca dará error 404 ni se quedará en blanco.

---

## 🎓 1. Cómo añadir o editar una Tesis Doctoral

1. Ve a `src/content/theses/es/`.
2. Haz una copia de `src/content/templates/_plantilla_tesis.md`.
3. Nómbralo con el siguiente número secuencial (por ejemplo: `tesis-16.md`).
4. Abre el archivo y configura el parámetro `status`:
   - `status: "ongoing"` para tesis en curso / desarrollo.
   - `status: "completed"` para tesis defendidas / terminadas.

```markdown
---
id: "tesis-16"
author: "Nombre y Apellidos del Doctorando"
status: "ongoing" # "ongoing" (en curso) o "completed" (defendida)
title: "Título completo de la investigación doctoral"
institution: "UPV/EHU - Departamento de Fisiología"
year: "En desarrollo (2025-2028)"
badge: "En Curso"
directors:
  - "Dra. Patricia Aspichueta Celaá"
  - "Dr. Nombre del Co-director"
program: "Programa de Doctorado en Biomedicina"
keywords:
  - "Metabolismo Lipídico"
  - "Hepatología"
  - "Biomarcadores"
order: 1 # Opcional: solo actúa como desempate entre tesis del mismo año
---

Escribe aquí el resumen (abstract) de la tesis doctoral en uno o varios párrafos.
```

> **¡Orden automático inteligente!**
> - **Las tesis en curso (`ongoing`) se muestran SIEMPRE las primeras**, ordenadas cronológicamente (las más recientes arriba). Al añadir una nueva tesis en curso (ej: 2025-2028), **aparecerá automáticamente en primer lugar (a la cabeza, nunca a la cola)**.
> - **Las tesis defendidas (`completed`) se muestran a continuación**, también ordenadas con las más recientes primero (2024 > 2023 > 2022...). Cuando un doctorando defienda su tesis, solo cambias `status: "ongoing"` por `status: "completed"` y el año de defensa, y automáticamente pasará a encabezar las defendidas.

### Para traducir la tesis al Euskera o Inglés:
Copia ese mismo archivo en `src/content/theses/eu/tesis-16.md` o `src/content/theses/en/tesis-16.md` y traduce los textos al euskera o inglés.

---

## 👥 2. Cómo añadir o modificar un Miembro del Equipo

### Para modificar a un miembro existente:
1. Ve a `src/content/team/es/`.
2. Abre el archivo correspondiente (por ejemplo: `patricia-aspichueta.md`).
3. Modifica el email, despacho o añade datos a su CV (titulaciones, proyectos, publicaciones).
4. Si quieres modificar su versión en euskera o inglés, abre el archivo con el mismo nombre en `src/content/team/eu/` o `src/content/team/en/`.

### Para añadir un nuevo miembro:
1. Ve a `src/content/templates/` y copia `_plantilla_miembro.md`.
2. Pégalo en `src/content/team/es/` con el nombre del investigador en minúsculas y guiones (ej: `laura-gonzalez.md`).
3. Rellena los datos:
```markdown
---
id: "laura-gonzalez"
name: "Dra. Laura González Martínez"
role: "Investigadora Posdoctoral"
category: "Posdoctoral" # Coordinadora | PDI | Ramón y Cajal | Posdoctoral | Predoctoral | Técnico
department: "Departamento de Fisiología, Facultad de Medicina y Enfermería"
# image: "/assets/images/team/laura-gonzalez/image.jpg" # Opcional (si usas Keystatic se sube automáticamente desde el botón de examinar)
email: "laura.gonzalez@ehu.eus"
office: "Despacho 2.10, Facultad de Medicina y Enfermería, Leioa"
orcid: "0000-0002-XXXX-XXXX"
order: 19
cv:
  title: "Investigadora Posdoctoral - Especialista en Lipidómica"
  researchSummary: "Líneas de investigación en reprogramación metabólica..."
  degrees:
    - "Doctora en Biomedicina (UPV/EHU, 2024)"
  positions:
    - "Investigadora Posdoctoral (2024 - Presente)"
  grants:
    - "Contrato Posdoctoral Gobierno Vasco"
  publications:
    - "Autora de publicación en Cancers..."
  teaching:
    - "Docencia práctica en Grado de Medicina"
---

Escribe aquí una breve presentación biográfica de la investigadora.
```

---

## 🔬 3. Cómo añadir o editar una Línea de Investigación

Cada línea de investigación cuenta con **su propia página web dedicada** (por ejemplo: `/lineas/mafld`, `/lineas/cancer`), accesible directamente desde las tarjetas de la portada.

### Para modificar una línea existente:
1. Ve a `src/content/research/es/`.
2. Abre el archivo de la línea (ej: `mafld.md`, `cancer.md`, `e2f.md`, `lipidomics.md`, `exposome.md`, `spatial-omics.md`).
3. Modifica los objetivos, descripción o textos.
4. Si quieres traducirla al euskera o inglés, edita el archivo correspondiente en `src/content/research/eu/` o `src/content/research/en/`.

### Para añadir una nueva línea:
1. Copia `src/content/templates/_plantilla_linea.md`.
2. Pégalo en `src/content/research/es/` con un nombre representativo (ej: `inmunometabolismo.md`).
3. Rellena los datos (título, descripción corta, foto, badge) y escribe el contenido detallado en el cuerpo del archivo.

---

## 📄 4. Cómo añadir una nueva Publicación Científica

1. Ve a `src/content/publications/es/`.
2. Copia la plantilla `src/content/templates/_plantilla_publicacion.md` y dale un nombre identificativo (ej: `pub-2025-hepatology.md`).
3. Rellena los campos:
```markdown
---
year: "2025"
title: "Título exacto del artículo científico"
authors: "González-Romero F, Gómez-Santos B, Aspichueta P, et al."
journal: "Journal of Hepatology"
topic: "mafld" # mafld | cancer | lipidomics | e2f | exposome | spatial-omics
doi: "10.1016/j.jhep.2025.01.001"
---

Pega aquí el abstract oficial del artículo.
```

---

## 🏛️ 5. Cómo modificar o añadir pestañas en la Presentación

La sección **Presentación** de la portada se compone de pestañas navegables cargadas dinámicamente desde `src/content/presentation/`:
- `1-presentacion.md`: Presentación general, especialidades y composición del personal.
- `2-biocruces.md`: Red traslacional e integración en IIS Biocruces Bizkaia.
- `3-sgiker.md`: Unidad de Lipidómica SGIker.

### Para modificar los textos de una pestaña:
1. Ve a `src/content/presentation/es/`.
2. Abre el archivo que deseas editar (por ejemplo, `1-presentacion.md` para actualizar el número de miembros o especialidades, o cambiar el texto).
3. Si dispones de traducciones, edita el archivo homónimo en `src/content/presentation/eu/` o `src/content/presentation/en/`.

### Para añadir una nueva pestaña:
1. Copia `src/content/templates/_plantilla_presentacion.md`.
2. Guárdalo en `src/content/presentation/es/` (ej: `4-colaboraciones.md`).
3. Define un `order: 4`, un `tabId: "tab-colaboraciones"` y el `tabTitle: "Colaboraciones"`.
4. El sistema creará automáticamente el nuevo botón y panel en la web.

---

## 🎓 6. Cómo modificar o añadir elementos en Formación Académica y Doctorado

La sección **Formación Académica y Doctorado** de la portada se gestiona mediante archivos Markdown en `src/content/training/`:
- `1-master-biologia-molecular.md`: Máster Universitario en Biología Molecular y Biomedicina (UPV/EHU & UC).
- `2-master-investigacion-biomedica.md`: Máster Universitario en Investigación Biomédica (UPV/EHU).
- `3-doctorado-biologia-molecular.md`: Programa de Doctorado en Biología Molecular y Biomedicina (DOKTUM • UPV/EHU).
- `4-grados-ciencias-salud.md`: Docencia en Grados Universitarios de Medicina, Enfermería, Odontología y Bioquímica.

### Para modificar un programa existente:
1. Ve a `src/content/training/es/`.
2. Abre el archivo que deseas editar (por ejemplo, `1-master-biologia-molecular.md` para actualizar asignaturas, créditos o enlaces).
3. Si dispones de traducciones, edita el archivo homónimo en `src/content/training/eu/` o `src/content/training/en/`.

### Para añadir un nuevo programa o máster:
1. Copia `src/content/templates/_plantilla_formacion.md`.
2. Guárdalo en `src/content/training/es/` (ej: `5-master-farmacologia.md`).
3. Rellena los datos (título, tipo, badge de créditos, institución, enlace oficial de la UPV/EHU y orden) y el texto explicativo.
4. La tarjeta aparecerá automáticamente en la sección de Formación de la web.

---

## 🚀 7. Cómo ver la web en tu ordenador

Hemos dejado comandos preparados para que sea inmediato:

### Ver cambios en directo (Modo Desarrollo):
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
npm run dev
```
O haz doble clic en el script `iniciar_servidor.sh`.
Abre tu navegador en: **`http://localhost:4321`**
- Español: `http://localhost:4321`
- Euskera: `http://localhost:4321/eu`
- Inglés: `http://localhost:4321/en`

> Cada vez que guardes un archivo `.md`, la web en el navegador se actualizará automáticamente en milisegundos.

---

## 📦 8. Cómo generar la web para producción

Cuando hayas terminado de hacer cambios y quieras publicarlos en el servidor de la universidad o hosting:
```bash
npm run build
```
O ejecuta `construir_web.sh`.

Este comando genera la carpeta:
```text
dist/
```
Esa carpeta `dist/` contiene **HTML, CSS e imágenes 100% estáticos**. Solo tienes que copiar el contenido de esa carpeta a la carpeta pública del servidor web (UPV/EHU, Apache, Nginx o GitHub Pages) y la web estará actualizada en sus 3 idiomas.
