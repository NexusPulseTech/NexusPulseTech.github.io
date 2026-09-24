# nexuspulsetech.github.io

Source of the NexusPulse website: https://nexuspulsetech.github.io

A static site served by GitHub Pages from the `main` branch. No build step.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Home page (English by default, Vietnamese via the language switch or `?lang=vi`) |
| `404.html` | Not found page |
| `assets/css/styles.css` | Styles, light and dark mode |
| `assets/js/main.js` | Language switch, mobile menu, scroll animations |
| `assets/img/` | Logo and social sharing image |
| `assets/fonts/` | Inter font files (SIL Open Font License 1.1) |
| `robots.txt`, `sitemap.xml` | Search engine files |

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing text

Each translatable element holds the English text as content and the Vietnamese text in its `data-vi` attribute. Update both when you change copy.
