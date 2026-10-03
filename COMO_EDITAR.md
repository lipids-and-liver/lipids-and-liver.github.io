# Guía de Edición y Alta de Contenidos — Lipids & Liver

Esta guía explica de forma sencilla cómo añadir y modificar miembros del equipo, tesis doctorales, publicaciones y otros contenidos del grupo de investigación.

---

## 1. ¿Por qué daba error al crear un miembro en el CMS?

El error se debía a tres causas principales que ya han sido solucionadas:

1. **El campo Identificador (Slug) estaba vacío**: El CMS intentaba crear el archivo usando el campo `id`. Si se dejaba vacío, el CMS generaba una ruta inválida y bloqueaba el guardado.
   - *Solución implementada*: Ahora el sistema genera automáticamente el slug a partir del nombre completo (por ejemplo, `Jon Ander Pérez` &rarr; `jon-ander-perez`).
2. **Campos obligatorios en idiomas múltiples (i18n)**: Al ser una web trilingüe (Castellano, Euskera, Inglés), el CMS exigía rellenar campos como el cargo, la categoría y la biografía en las 3 pestañas de idioma para poder guardar.
   - *Solución implementada*: Ahora los campos no obligatorios se marcan como opcionales, la categoría y el centro se traducen automáticamente en la web, y no es necesario rellenar las 3 pestañas para poder guardar.
3. **Validación estricta de campos vacíos en el CV**: Si algún campo del currículum (titulaciones, proyectos, etc.) se dejaba sin rellenar o nulo, el sistema daba error.
   - *Solución implementada*: El esquema de datos ahora tolera campos vacíos o incompletos con valores seguros por defecto.

---

## 2. Sistema de Plantillas disponible

Dispones de tres formas muy cómodas para crear nuevos datos utilizando plantillas:

### Opción A: A través del Panel CMS (Recomendado para el día a día)

1. **Accede al CMS**: Entra en `/admin/` (o [https://lipids-and-liver.github.io/admin/](https://lipids-and-liver.github.io/admin/)).
2. **Formulario con valores por defecto**: Al pulsar sobre **"👥 El Grupo › Personal Investigador & CVs"** &rarr; **"Nuevo Miembro"**, el formulario ya vendrá precargado con valores de ejemplo y solo tendrás que escribir el nombre y los datos que tengas disponibles.
3. **Sección "📋 Modelos & Plantillas de Referencia"**: En el menú lateral izquierdo encontrarás una sección dedicada a consultar y copiar las plantillas oficiales de miembros, tesis y publicaciones.
4. **Truco de Duplicar**: Puedes abrir la ficha de cualquier miembro existente similar y pulsar el botón de opciones &rarr; **"Duplicar entrada"**. Esto creará un nuevo borrador con toda la estructura lista, donde solo tendrás que cambiar el nombre y datos personales.

---

### Opción B: Copiando los archivos de plantilla Markdown

En la carpeta `src/content/templates/` tienes a tu disposición plantillas listas para duplicar:

| Contenido | Archivo de plantilla | Destino al guardar |
| :--- | :--- | :--- |
| **Miembro del equipo** | `src/content/templates/_plantilla_miembro.md` | `src/content/team/es/nombre-apellido.md` |
| **Tesis doctoral** | `src/content/templates/_plantilla_tesis.md` | `src/content/theses/es/tesis-XX.md` |
| **Publicación científica** | `src/content/templates/_plantilla_publicacion.md` | `src/content/publications/es/pub-XX.md` |
| **Línea de investigación** | `src/content/templates/_plantilla_linea.md` | `src/content/research/es/linea.md` |
| **Actividad formativa** | `src/content/templates/_plantilla_formacion.md` | `src/content/training/es/formacion.md` |

**Pasos:**
1. Haz una copia del archivo de plantilla.
2. Renómbralo con el nombre del investigador (ej: `elena-garcia.md`) en `src/content/team/es/`.
3. Rellena los datos en el bloque superior (entre los `---`).
4. Si quieres añadir foto, coloca la imagen en `public/assets/images/team/elena-garcia.jpg` o indícala en el campo `image`. Si no pones foto, el sistema usará la silueta institucional por defecto.

---

### Opción C: Mediante el asistente rápido por consola

Si trabajas en local con la terminal, dispones del script:

```bash
./crear_miembro.sh
```

El asistente te preguntará el nombre, rol y categoría, y generará automáticamente el archivo `.md` listo para editar.

---

## 3. Campos clave para un miembro del equipo

| Campo | Obligatorio | Descripción | Ejemplo |
| :--- | :---: | :--- | :--- |
| `name` | **Sí** | Nombre completo con tratamiento | `Dra. Elena García López` |
| `id` | No | Slug web (se autogenera si se omite) | `elena-garcia` |
| `category` | No | Categoría oficial para los filtros | `Predoctoral`, `Posdoctoral`, `PDI`, `Técnico` |
| `role` | No | Puesto o cargo descriptivo | `Investigadora Predoctoral (FPI)` |
| `department` | No | Centro / Departamento UPV/EHU | Se rellena solo por defecto |
| `email` | No | Correo de contacto | `elena.garcia@ehu.eus` |
| `order` | No | Posición en el listado (menor número = más arriba) | `99` (por defecto) |
| `cv` | No | Bloque con títulos, proyectos y trayectoria | Opcional |
| `body` | No | Breve semblanza biográfica | Opcional |
