#!/usr/bin/env bash
# ==============================================================================
# Asistente para crear un nuevo miembro del equipo a partir de la plantilla
# Lipids & Liver Research Group
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/src/content/templates"
TEAM_DIR="$SCRIPT_DIR/src/content/team/es"

echo "=========================================================="
echo "  🧬 Lipids & Liver — Alta de Nuevo Miembro del Equipo"
echo "=========================================================="
echo ""

read -rp "Nombre completo (ej: Ane Ortiz Mendibil): " FULL_NAME
if [ -z "$FULL_NAME" ]; then
  echo "❌ El nombre no puede estar vacío."
  exit 1
fi

# Generar slug a partir del nombre
SLUG=$(echo "$FULL_NAME" | tr '[:upper:]' '[:lower:]' | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null || echo "$FULL_NAME" | tr '[:upper:]' '[:lower:]')
SLUG=$(echo "$SLUG" | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')

read -rp "Identificador / Slug [$SLUG]: " INPUT_SLUG
if [ -n "$INPUT_SLUG" ]; then
  SLUG="$INPUT_SLUG"
fi

TARGET_FILE="$TEAM_DIR/$SLUG.md"

if [ -f "$TARGET_FILE" ]; then
  echo "⚠️ El archivo $TARGET_FILE ya existe."
  read -rp "¿Deseas sobrescribirlo? (s/N): " CONFIRM
  if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
    echo "Operación cancelada."
    exit 0
  fi
fi

echo ""
echo "Selecciona la categoría:"
echo "  1) Predoctoral"
echo "  2) Posdoctoral"
echo "  3) PDI / Investigador Senior"
echo "  4) Ramón y Cajal"
echo "  5) Técnico"
echo "  6) Coordinadora"
read -rp "Opción [1-6, por defecto 1]: " CAT_OPT

case "$CAT_OPT" in
  2) CATEGORY="Posdoctoral"; ROLE_DEFAULT="Investigador/a Posdoctoral" ;;
  3) CATEGORY="PDI"; ROLE_DEFAULT="Profesor/a Titular de Universidad" ;;
  4) CATEGORY="Ramón y Cajal"; ROLE_DEFAULT="Investigador/a Ramón y Cajal" ;;
  5) CATEGORY="Técnico"; ROLE_DEFAULT="Técnico de Laboratorio" ;;
  6) CATEGORY="Coordinadora"; ROLE_DEFAULT="Catedrática de Fisiología" ;;
  *) CATEGORY="Predoctoral"; ROLE_DEFAULT="Investigador/a Predoctoral" ;;
esac

read -rp "Puesto / Cargo [$ROLE_DEFAULT]: " ROLE
ROLE="${ROLE:-$ROLE_DEFAULT}"

read -rp "Correo electrónico UPV/EHU (opcional): " EMAIL

# Copiar plantilla y sustituir datos básicos
cat <<EOF > "$TARGET_FILE"
---
id: "$SLUG"
name: "$FULL_NAME"
role: "$ROLE"
category: "$CATEGORY"
department: "Departamento de Fisiología, Facultad de Medicina y Enfermería"
# image: "/assets/images/team/$SLUG/image.jpg"
email: "${EMAIL:-}"
office: "Facultad de Medicina y Enfermería, Leioa"
orcid: ""
x: ""
linkedin: ""
github: ""
quote: ""
order: 99
cv:
  title: "$ROLE - Grupo Lipids & Liver"
  degrees:
    - "Grado / Licenciatura (UPV/EHU)"
  otherTraining: []
  positions:
    - "$ROLE en Grupo Lipids & Liver (Presente)"
  grants: []
  publications: []
  teaching: []
---

Investigador/a en el Departamento de Fisiología de la Facultad de Medicina y Enfermería de la UPV/EHU, miembro activo del Grupo Consolidado Lipids & Liver.
EOF

chmod 644 "$TARGET_FILE"

echo ""
echo "✅ Miembro creado con éxito en:"
echo "   $TARGET_FILE"
echo ""
echo "Puedes abrir y editar este archivo para añadir publicaciones, proyectos o su semblanza biográfica."
