# Guía de Uso: Versión Web HTML Inline (Envío por Correo)

Esta carpeta (`version_inline/`) contiene la versión del portal del **Grupo de Investigación Lipids & Liver** preparada específicamente para **compartirse por correo electrónico sin que el destinatario tenga que descargar carpetas de imágenes ni montar ningún servidor**.

---

## Contenido de la Carpeta

| Archivo | Tamaño | Propósito principal | Cómo se utiliza |
| :--- | :--- | :--- | :--- |
| **`web_completa_inline.html`** *(o `index.html`)* | ~3.3 MB | **Web oficial completa 100% autocontenida** con toda la interactividad, estilos e imágenes incrustadas en Base64. | Se adjunta al correo. El destinatario hace doble clic y se abre directamente en su navegador web. |
| **`email_boletin_inline.html`** | ~15 KB | **Plantilla para el cuerpo del mensaje de correo** (HTML Email con estilos inline compatibles con Outlook, Gmail y Thunderbird). | Se inserta directamente en el cuerpo del correo para que se vea nada más abrir el mensaje. |

---

## Opción 1: Enviar la Web Completa Autocontenida (`web_completa_inline.html`)

Esta es la opción recomendada si quieres que vean **el diseño exacto de la web con toda su experiencia visual e interactiva**.

### ¿Cómo funciona?
- **Cero dependencias externas:** Todo el código CSS (`styles.css`), los iconos vectoriales de FontAwesome, los scripts de interactividad y las **28 imágenes** (fotografías de exteriores, instalaciones, líneas de investigación, fotos del equipo y logotipos oficiales de la UPV/EHU y del grupo) están **codificados dentro del propio archivo HTML**.
- **Ventanas modales interactivas integradas:** Al hacer clic en *"Ver Línea de Investigación"*, *"CV"* o *"Ver Información Ampliada"* de una tesis, se abre una elegante ventana modal con la información detallada sin salir de la página ni requerir archivos secundarios.
- **Selector de tema:** Permite alternar entre **Modo Claro** y **Modo Oscuro** (intercambiando al instante los logotipos correspondientes en tiempo real).
- **Filtros interactivos:** Filtro de miembros del equipo por categoría (*Todos*, *PDI & Seniors*, *Posdoctoral*, *Predoctoral*, *Técnico*) y control segmentado de tesis (*Todas*, *En Curso*, *Defendidas*).
- **Canvas de partículas flotantes:** Fondo interactivo dinámico que reacciona suavemente al cursor del ratón.

### Instrucciones de envío:
1. Redacta tu correo habitual a los destinatarios.
2. Adjunta el archivo `version_inline/web_completa_inline.html` (o renómbralo a `Lipids_and_Liver_Web.html` si lo prefieres).
3. Añade en el mensaje:
   > *"Adjunto la propuesta de diseño de la nueva página web oficial del Grupo de Investigación Lipids & Liver (UPV/EHU & IIS Biocruces Bizkaia). Solo tenéis que hacer doble clic en el archivo adjunto para explorarla directamente en vuestro navegador habitual (Chrome, Edge, Safari o Firefox), sin necesidad de instalar nada."*

---

## Opción 2: Enviar en el Cuerpo del Correo (`email_boletin_inline.html`)

Esta opción es idónea si quieres que **al abrir el correo en su cliente (Outlook, Gmail, etc.) el diseño aparezca directamente en el cuerpo del mensaje**, sin necesidad de que abran un archivo adjunto.

### Características:
- Ancho estándar adaptable (máximo 640px).
- Estructura en tablas HTML con estilos inline `style="..."` en cada elemento para máxima compatibilidad con clientes de correo que no admiten hojas de estilo complejas.
- Cabecera con identidad corporativa de la UPV/EHU y Biocruces Bizkaia, insignia de acreditación del Gobierno Vasco (`IT1560-22`), cifras clave de impacto, resumen de líneas de investigación, coordinación y datos de contacto oficiales.

### Cómo insertarlo en el correo:
- **En Outlook (Escritorio):** Redactar nuevo correo &rarr; Pestaña *Insertar* &rarr; *Adjuntar archivo* &rarr; Seleccionar `email_boletin_inline.html` &rarr; En la flecha del botón *Insertar*, elegir **"Insertar como texto"**.
- **En Thunderbird:** *Redactar* &rarr; Menú *Insertar* &rarr; *HTML...* &rarr; Pegar el contenido del archivo.
- **En Gmail / Navegador:** Abrir `email_boletin_inline.html` en el navegador, presionar `Ctrl + A` (seleccionar todo), `Ctrl + C` (copiar), y en la ventana de redacción de Gmail presionar `Ctrl + V` (pegar).

---

## ¿Cómo regenerar estos archivos si se actualizan contenidos?

Si en el futuro modificas algún miembro, tesis o publicación en `src/content/`, puedes volver a compilar el sitio y actualizar la versión inline ejecutando en la terminal:

```bash
# 1. Compilar el proyecto en dist/
npm run build

# 2. Generar los archivos inline
python3 scripts/generate_inline_web.py
```
Los archivos en `version_inline/` se actualizarán automáticamente con todos los cambios y nuevas imágenes incrustadas.
