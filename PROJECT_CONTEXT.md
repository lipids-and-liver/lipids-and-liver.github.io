# Project Context & Developer Handover Document

## Grupo de Investigación Lipids & Liver (UPV/EHU & IIS Biocruces Bizkaia)

This file contains the complete technical context, architecture specifications, and data schemas required to continue development on any machine with Antigravity AI assistant.

---

### 1. Overview of the Web Portal

The web application is a modernized, multi-page, multi-lingual academic portal designed for the **Lipids & Liver** research group (IT1560-22). It reflects the group's dual affiliation with the **Department of Physiology at UPV/EHU** and **IIS Biocruces Bizkaia**.

### 2. Architecture & File Hierarchy

```
lipid_and_liver/
├── .agents/
│   └── AGENTS.md                  # Automatic Antigravity agent instructions & context
├── assets/
│   ├── css/
│   │   └── styles.css             # Main stylesheet with CSS variables, light/dark themes
│   ├── js/
│   │   ├── data.js                # Centralized APP_DATA object (all content & dictionary)
│   │   └── main.js                # Interactive logic (rendering, filters, modals, i18n)
│   └── images/
│       ├── logo/                  # Official EHU & Lipids & Liver logos (SVG, PNG)
│       └── team/                  # Professional profile photos
├── backup_v1/                     # Preserved backup version snapshot
├── curriculum.html                # Personnel CV detail page (?id=member-slug)
├── index.html                     # Main portal landing page
├── tesis.html                     # PhD theses detail page (?id=thesis-id)
├── README.md                      # General repository documentation
└── PROJECT_CONTEXT.md             # Detailed developer handover document
```

---

### 3. Key Components & Features

1. **Dual Branding & Institutional Header**:
   - Features Chillida's official UPV/EHU logo (`ehu_logo_positiboa.svg` / `ehu_logo_negatiboa.svg`) alongside the Lipids & Liver group logo (`lipid_liver_logo.png`).
   - Top utility bar linking to UPV/EHU and IIS Biocruces Bizkaia.

2. **Main Landing Page (`index.html`)**:
   - **Hero Section**: Highlights group accreditation (Gobierno Vasco IT1560-22).
   - **Institutional Stats Bar**: Key quantitative metrics (2007 accreditation, 10+ PDI, 15+ theses, SGIker Unit).
   - **About Tabs**: Tabbed interface covering group presentation, Biocruces translational network, and SGIker Lipidomics Unit.
   - **Research Lines**: Cards grid (`#lines-grid`) with "Ver Proyecto y Objetivos" modals.
   - **Personnel Grid**: Team members with profile photos and direct "Ver Currículum Completo" links.
   - **PhD Theses Section**: Segmented control buttons (`Todas las Tesis`, `En Curso`, `Defendidas`) with counters and links to `tesis.html`.
   - **Publications**: Categorized by topic (`MAFLD/NASH`, `Cáncer Hepático`, `Lipidómica SGIker`, `E2F`, `Exposoma`).
   - **Multi-language Support**: Instant language switching between ES (Spanish), EU (Basque), EN (English).
   - **Theme Toggle**: Light / Dark mode toggle with persistent `localStorage`.

3. **PhD Thesis Detail Page (`tesis.html`)**:
   - Displays full abstracts, directors, research programs, keywords, and completion status.
   - Interactive dropdown selector in the navigation bar to jump between any of the 15 theses.
   - Direct link support: `tesis.html?id=tesis-ongoing-1`.

4. **Personnel CV Detail Page (`curriculum.html`)**:
   - Complete academic CV view (degrees, positions, research summary, grants, publications, teaching).
   - Interactive dropdown selector in the header to view any team member.
   - Direct link support: `curriculum.html?id=patricia-aspichueta`.

---

### 4. Data Structure Schema (`assets/js/data.js`)

All website content is centralized in `window.APP_DATA`:

```javascript
const APP_DATA = {
  stats: [ ... ],
  leadership: { ... },
  researchLines: [
    { id, title, shortDesc, image, badge, details }
  ],
  theses: {
    ongoing: [
      { id, author, status, title, institution, year, badge, directors, program, keywords, abstract }
    ],
    completed: [ ... ]
  },
  teamMembers: [
    { id, name, role, category, department, image, email, office, orcid, bio, cv: { title, degrees, positions, researchSummary, grants, publications, teaching } }
  ],
  publications: [ ... ],
  trainings: [ ... ],
  translations: { es: { ... }, eu: { ... }, en: { ... } }
};
```

---

### 5. Development Guidelines for Future Tasks

- **Preserve Institutional Tone**: Keep styling sober, prestigious, and aligned with UPV/EHU corporate identity.
- **Maintain Data Centralization**: When adding new team members, theses, or publications, update `assets/js/data.js`.
- **CSS Variables**: Rely on variables in `assets/css/styles.css` (`--ehu-navy`, `--logo-green`, `--bg-surface`, etc.) to maintain light/dark mode compatibility.
- **Backups**: The folder `backup_v1/` contains a stable snapshot of the codebase.

---

*Generated on 2026-09-25 for Antigravity AI Agent Handover.*
