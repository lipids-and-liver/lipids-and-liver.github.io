# Workspace Context & Rules for Lipids & Liver Project

## Project Overview
This repository contains the modernized official web portal for the **Lipids & Liver Research Group** (Grupo Consolidado del Gobierno Vasco IT1560-22), affiliated with the **University of the Basque Country (UPV/EHU)** and **IIS Biocruces Bizkaia** (Department of Physiology, Faculty of Medicine and Nursing, Leioa Campus).

## Key Pages & File Structure
- `index.html`: Main portal featuring the institutional hero banner, stats bar, group presentation tabs, research lines cards with detail modals, team member grid, PhD theses with segmented control filter (`Todas`, `En Curso`, `Defendidas`), publications list with topic filters, training, and contact form.
- `tesis.html`: Dedicated PhD thesis detail page displaying full abstracts, directors, program, keywords, status badge, and an interactive dropdown selector (`?id=tesis-ongoing-1`).
- `curriculum.html`: Dedicated personnel CV page displaying full academic degrees, positions, research summaries, grants, publications, teaching, and an interactive dropdown selector (`?id=patricia-aspichueta`).
- `assets/css/styles.css`: Institutional CSS design system with light/dark theme CSS variables, segmented control bars, cards, modals, and responsive layouts.
- `assets/js/data.js`: Centralized structured dataset (`APP_DATA`) holding stats, leadership, research lines, team members, PhD theses (6 ongoing, 9 completed), publications, trainings, and multi-language translations (ES, EU, EN).
- `assets/js/main.js`: Core interaction logic for dynamic renders, search, filters, modals, tab switching, language switching, theme toggle, and URL parameters.
- `assets/images/`: Logos (`logo/lipid_liver_logo.png`, `logo/ehu_logo_positiboa.svg`, `logo/ehu_logo_negatiboa.svg`) and HD research/team photos.
- `backup_v1/`: Saved backup copy of previous snapshot.

## Design Identity & Corporate Guidelines
- **Palette**:
  - Primary Navy Blue: `#002B49` (UPV/EHU institutional blue)
  - Secondary Slate Blue: `#1E3A5F`
  - Accent Green: `#689F38` (Lipids & Liver logo green) / `#8AC63F`
  - Neutral Light Background: `#F8FAFC` / `#FFFFFF`
- **Typography**: Clean sans-serif System font stack (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Style Rules**: Sober, institutional, prestigious university lab aesthetic. High readability, clear hierarchy, structured cards with micro-animations.

## How to Run Locally
Run a local HTTP server inside this directory:
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080/index.html` in your browser.

## Current Project State & User Preferences
- **PhD Theses Filter**: Segmented control bar (`.segmented-control-bar`) with counters for `ALL` (15), `ONGOING` (6), and `COMPLETED` (9).
- **PhD Thesis Detail Page**: `tesis.html` allows viewing extended abstracts, directors, and keywords.
- **Research Lines**: Cards layout with modal popups for project goals and details.
- **Restored Snapshot**: Reverted to `backup_v1` dark hero state per user instruction.
