# NexusPulse website

[![CI](https://github.com/NexusPulseTech/NexusPulseTech.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/NexusPulseTech/NexusPulseTech.github.io/actions/workflows/ci.yml)

Source of [nexuspulsetech.github.io](https://nexuspulsetech.github.io), the NexusPulse company site.

A static site with no build step, served by GitHub Pages from `main`. Fonts, icons and styles are committed to the repository, so the site has no runtime dependency on any CDN.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Home page. English by default, Vietnamese via the language switch or `?lang=vi` |
| `404.html` | Not found page |
| `assets/css/styles.css` | Styles, light and dark mode |
| `assets/js/main.js` | Language switch, mobile menu, scroll animations |
| `assets/fonts/` | Inter, subset for Latin and Vietnamese (SIL Open Font License 1.1) |
| `assets/img/` | Logo and the social sharing image |
| `scripts/check-links.mjs` | Verifies every local link, anchor and asset reference |
| `robots.txt`, `sitemap.xml` | Search engine files |

## Local development

```bash
npm install
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Checks

```bash
npm test
```

This validates the HTML against `html-validate`, then checks that every local link, in-page anchor and asset reference resolves. The same command runs in CI on every push and pull request to `main`.

## Editing copy

Each translatable element holds the English text as its content and the Vietnamese text in a `data-vi` attribute:

```html
<h3 data-vi="Phát triển sản phẩm">Product development</h3>
```

Update both when you change wording. Page titles and meta descriptions for each language live in `meta` at the top of `assets/js/main.js`.

## Deployment

Merging to `main` publishes the site. GitHub Pages is configured to deploy from the `main` branch, root folder.
