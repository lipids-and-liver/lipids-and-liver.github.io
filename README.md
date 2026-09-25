# Lipids & Liver Research Group - Web Portal

Official modernized website for the **Lipids & Liver Research Group** (Grupo Consolidado del Gobierno Vasco IT1560-22) at the **University of the Basque Country (UPV/EHU)** and **IIS Biocruces Bizkaia**.

## 🚀 Quick Start (Local Server)

Run a local development server using Python:

```bash
python3 -m http.server 8080
```

Then visit:
- **Main Portal**: `http://localhost:8080/index.html`
- **PhD Theses Portal**: `http://localhost:8080/tesis.html`
- **Personnel CV Portal**: `http://localhost:8080/curriculum.html`

## 📁 Repository Structure

- `index.html`: Main landing page with group profile, research lines, team, theses, publications, and contact.
- `tesis.html`: Dedicated PhD theses portal displaying extended abstracts, directors, and keywords.
- `curriculum.html`: Dedicated CV page for research staff with selector dropdown and URL query parameter support.
- `assets/css/styles.css`: CSS design system with institutional colors, dark/light theme support, and responsive layouts.
- `assets/js/data.js`: Centralized data store (`APP_DATA`) containing team members, theses, publications, and multi-language dictionary (ES, EU, EN).
- `assets/js/main.js`: Main interactive script handling dynamic renders, filters, language switcher, and theme toggle.
- `.agents/AGENTS.md`: Workspace rules and automatic context loader for **Antigravity AI Assistant**.
- `PROJECT_CONTEXT.md`: Comprehensive technical handover document.

## 🎨 Design Identity

- **Primary Navy Blue**: `#002B49` (UPV/EHU corporate identity)
- **Circuit Green**: `#689F38` (Lipids & Liver logo green)
- **Style**: Sober, institutional, academic, and accessible.
