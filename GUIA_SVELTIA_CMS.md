# 🛠️ Guía de Uso de Sveltia CMS en GitHub Pages

Este repositorio cuenta con **Sveltia CMS** integrado, un gestor de contenidos ligero, moderno y basado en Git (*Git-based headless CMS*) que funciona 100% en el navegador como una aplicación estática (SPA), ideal para sitios alojados en **GitHub Pages**.

---

## 🌐 1. ¿Cómo acceder al panel de administración?

- **En Producción (GitHub Pages)**:  
  👉 **`https://lipids-and-liver.github.io/admin/`**

- **En Desarrollo Local**:  
  👉 **`http://localhost:4321/admin/`**

---

## 🔑 2. Autenticación en GitHub Pages

Dado que GitHub Pages es un alojamiento estático sin servidor de backend, Sveltia CMS permite autenticarse directamente mediante un **Personal Access Token (PAT)** de GitHub, sin necesidad de configurar ningún servidor intermedio.

### Paso a paso para obtener tu token de acceso (solo la primera vez):

1. Inicia sesión en tu cuenta de GitHub con permisos de colaboración en el repositorio `lipids-and-liver/lipids-and-liver.github.io`.
2. Ve a: **[GitHub Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)**.
3. Elige una de estas dos opciones:
   - **Opción A (Recomendada - Fine-grained token)**:
     - Nombre: `Sveltia CMS - Lipids & Liver`
     - Repository access: Selecciona *Only select repositories* y elige `lipids-and-liver/lipids-and-liver.github.io`.
     - Repository permissions: Busca **Contents** y selecciona **Read and write**.
   - **Opción B (Tokens classic)**:
     - Genera un token clásico y marca la casilla **`repo`** (Full control of private/public repositories).
4. Copia el token generado (empieza por `github_pat_` o `ghp_`).
5. Abre **`https://lipids-and-liver.github.io/admin/`**, introduce tu token y pulsa **Iniciar sesión**.

> [!TIP]
> El token se guarda en el almacenamiento local (`localStorage`) de tu navegador. No tendrás que volver a introducirlo en visitas posteriores desde el mismo equipo.

---

## 🚀 3. ¿Cómo funciona la publicación?

1. Al editar o crear una entrada en Sveltia CMS y pulsar **Guardar / Publicar**:
   - Sveltia realiza automáticamente un **commit** en la rama `main` del repositorio con los archivos Markdown/JSON modificados.
2. Inmediatamente, la acción automatizada de **GitHub Actions** (`.github/workflows/deploy.yml`) detecta el cambio, ejecuta `npm run build` y despliega la versión actualizada en GitHub Pages.
3. Los cambios aparecen publicados en la web en aproximadamente **60-90 segundos**.

---

## 📂 4. Secciones gestionables desde el CMS

Desde el menú lateral de Sveltia CMS puedes gestionar:

| Colección | Ubicación en el repositorio | Descripción |
| :--- | :--- | :--- |
| **Tesis Doctorales** | `src/content/theses/{es,eu,en}/` | Tesis en curso y defendidas, directores, resúmenes y palabras clave. Soporta traducción en ES, EU y EN. |
| **Personal del Grupo** | `src/content/team/{es,eu,en}/` | Fichas de miembros, categorías (PDI, postdocs, predocs, técnicos), fotos y CV estructurado en YAML. |
| **Líneas de Investigación** | `src/content/research/{es,eu,en}/` | Proyectos científicos, imágenes representativas, memoria y objetivos. |
| **Proyectos Competitivos** | `src/content/projects/` | Proyectos del Plan Nacional, Gobierno Vasco, FEDER y Fundaciones con periodos y estado. |
| **Noticias y Novedades** | `src/content/news/` | Notas de prensa, congresos, premios, resúmenes y destacados de portada. |
| **Publicaciones JCR** | `src/content/publications/es/` | Catálogo de artículos con DOI, resúmenes, revista y filtros temáticos. |
| **Formación Universitaria** | `src/content/training/{es,eu,en}/` | Grados, Másteres Oficiales y Doctorado. |
| **Presentación** | `src/content/presentation/{es,eu,en}/` | Pestañas institucionales (Perfil, Biocruces, SGIker, Instalaciones). |
| **Datasets JSON** | `src/data/alumni.json` y `collaborations.json` | Lista de antiguos miembros con puestos actuales y centros colaboradores. |

---

## 🖼️ 5. Subida de Imágenes y Archivos

Cuando subes una imagen desde el editor de Sveltia CMS (por ejemplo para una noticia o un nuevo miembro), se almacena automáticamente en:
- Directorio de subida: `public/assets/images/uploads/`
- Ruta pública accesible: `/assets/images/uploads/nombre-de-imagen.jpg`

---

## 💻 6. Edición Local sin conexión a GitHub (Opcional para desarrolladores)

Si estás trabajando en local (`npm run dev`) y prefieres probar el panel de administración contra tus archivos locales en lugar de hacer commits directos a GitHub:

1. En una terminal, inicia el servidor proxy local:
   ```bash
   npx decap-server
   ```
2. En otra terminal, inicia el servidor de desarrollo de Astro:
   ```bash
   npm run dev
   ```
3. Accede a `http://localhost:4321/admin/`. Sveltia CMS detectará el servidor local y guardará los cambios directamente en tu disco duro.
