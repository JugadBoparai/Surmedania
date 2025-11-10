# Surmedania Dance School — Website (Vite + React + Tailwind)

This repository is a starter scaffold for the Surmedania Dance School website.

Features:
- Built with React + Vite + Tailwind CSS
- Bilingual content (English / Norwegian) via a simple language provider
- Pages: Home, About, Classes, Gallery, Performances, News, Registration, FAQ
- Smooth animations (Framer Motion)
- News and performances read from JSON files in `src/data`
- Registration form placeholders for Vipps, Google Sheets webhook, and Spond link

Getting started

1. Install dependencies

```bash
npm install
```

2. Start dev server (frontend + backend)

```bash
npm run dev
```

This will start:
- **Frontend** (Vite): http://localhost:5173
- **Backend** (Express API): http://localhost:4000

Both servers run concurrently with color-coded output.

### Alternative: Run separately

```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend
```

# Surmedania

This repo contains the Surmedania website built with React, Vite, Tailwind, and Framer Motion.

## Internationalization (i18n)

The app supports three languages: English (en), Norwegian (no), and Punjabi (pa). Static UI strings live in `src/i18n/translations.json`. Dynamic content (news, performances, classes, holidays) stores multilingual fields directly in the data files.

### Language context
- `useLang()` provides `{ lang, setLang, t }`.
- `lang` persists in `localStorage` under `surmedania-lang`.
- `t(path, fallback?)` resolves a dot-path in `translations.json`.
	- Resolution order: current `lang` → English → `fallback` (or empty).
	- In development, missing keys log a warning once per key.

### Keys and namespaces
- Prefer `namespace.category.label` structure.
- Examples:
	- `news.title`, `hero.description`, `common.upcoming`
	- `classes.todayButton`, `classes.legendAdults`, `date.months`, `date.daysShort`

### Dynamic data schema
For any user-facing text, use nested multilingual objects:

```jsonc
{
	"title": {"en": "Spring Showcase", "no": "Vårshow", "pa": "ਬਸੰਤ ਸ਼ੋਅ"},
	"description": {"en": "...", "no": "...", "pa": "..."},
	"date": "2025-03-20",
	"location": "Ravinen, Rælingen"
}
```

Use the helper `getLocalized(obj, lang)` to read these safely with fallbacks.

### Dates and labels
- Short day and month names are centralized:
	- `date.daysShort`: ["Mon", "Tue", ...]
	- `date.months`: ["January", "February", ...]
- Calendar UI labels live under `classes.*` (e.g., `todayButton`, `prevMonth`, `nextMonth`, legend labels, etc.).

### ICS generation
- ICS summaries are composed from translations:
	- `${t('classes.classLabel')} - ${t('classes.thursdayAudience')}`
	- `${t('classes.classLabel')} - ${t('classes.sundayAudience')}`
- "Add to calendar" tooltips use `news.addToCalendar`.

### Adding a new event (checklist)
1. Edit `src/data/news.json` and add an item with `title` and `description` objects containing `en`, `no`, `pa`.
2. Include `date` (YYYY-MM-DD), `location`, and any other fields.
3. The UI will render with `getLocalized(event.title, lang)` and fall back to English.

### Adding a new UI label
1. Add a key in `src/i18n/translations.json` under the proper namespace for all three languages.
2. Use it via `t('your.key.here')` in components.
3. If a key is missing in the current language, you'll see a dev-only warning and fallback to English.

### Guardrails
- Avoid inline language ternaries like `lang === 'en' ? '...' : '...'`. Prefer `t()` or `getLocalized()`.
- When creating data content, fill all three language fields to avoid mixed-language fallbacks.

### Troubleshooting
- Missing key warnings: Ensure the key exists for the target language and English.
- Date labels off: Verify `date.months` and `date.daysShort` arrays and index math in the calendar.
