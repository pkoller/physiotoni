# PhysioToni — Project Context

## What this is
A static homepage for a physiotherapist named Toni. Three files, no build tools, no framework, no dependencies. Opens directly in a browser via `file://`.

## Files
```
index.html   — all page content and structure
style.css    — all styles (imported by index.html)
script.js    — language toggle, mobile nav, form handler, FAB, scroll shadow
```

## Tech constraints
- **No npm, no bundler, no framework.** Keep it plain HTML/CSS/JS.
- Google Fonts loaded via a single `<link>` in `<head>` (Lora + Raleway).
- No emoji anywhere — use inline SVG icons (Lucide style: `stroke="currentColor"`, `fill="none"`, `stroke-width="1.8"–"2.5"`).

## Design system
Defined as CSS custom properties in `:root` in `style.css`:

| Token | Value | Use |
|-------|-------|-----|
| `--clr-primary` | `#0891B2` | Teal — headings, accents, borders |
| `--clr-primary-dark` | `#0E7490` | Hover states, logo |
| `--clr-primary-light` | `#22D3EE` | Subtle accents |
| `--clr-cta` | `#16A34A` | Green — all CTA buttons, FAB |
| `--clr-bg` | `#F0FDFA` | Page background |
| `--clr-bg-alt` | `#E6F7F4` | Alternate section background |
| `--clr-text` | `#134E4A` | Body text |
| `--clr-muted` | `#4E8B88` | Subtitles, descriptions |
| `--clr-dark` | `#0D3330` | Headings, footer |
| `--font-heading` | Lora, Georgia, serif | Section titles, logo |
| `--font-body` | Raleway, system-ui, sans-serif | All body text |

Responsive breakpoints: 375px / 768px / 1024px / 1440px (default).

## Bilingual system (DE/EN)
Every visible text element that differs between languages carries both:
```html
<h2 data-de="German text" data-en="English text">German text</h2>
```
`script.js` reads `html.lang` and swaps `textContent` (or `innerHTML` for elements with `<br>`) on all `[data-de]` elements when the toggle is clicked. Default language is German (`<html lang="de">`).

**Rules:**
- Always add both `data-de` and `data-en` to any new text element.
- Use `innerHTML` swap (already handled in `script.js`) only for strings that contain `<br>`.
- The language toggle button in the header (`#langToggle`) is wired up in `script.js` — no changes needed there.

## Page sections (top → bottom)
1. **Header** — sticky, logo + nav + phone number + lang toggle + hamburger
2. **Hero** — teal gradient, headline, two CTAs (call + request)
3. **Services** — 3-col grid of 6 cards with SVG icons and outcome-focused copy
4. **About** — 2-col: photo placeholder left, bio + credentials right
5. **Contact** — two large CTAs (call / form), then info + form side by side + map iframe
6. **Footer** — copyright + Impressum/Datenschutz links
7. **FAB** — floating call button, visible only on mobile (`display:none` → `display:flex` at 768px)

## Placeholder content to replace later
- Address: `Musterstraße 1, 12345 Musterstadt`
- Phone: `+49 123 45678` (appears in header, hero, contact section, FAB — search for `+49 123 45678`)
- Email: `info@physiotoni.de`
- Google Maps iframe: `<iframe src="">` in the contact section — add embed URL to `src`
- Photo: `about__photo-placeholder` div — replace with `<img src="..." alt="...">`

## GitHub & Hosting
Public repo: `https://github.com/pkoller/physiotoni` — branch `master`.
Live site: `https://pkoller.github.io/physiotoni`
Push with: `git add index.html style.css script.js && git commit -m "..." && git push`
GitHub Pages is served from the `gh-pages` branch, published by `.github/workflows/pages-deploy.yml` on every push to `master` (one-time repo setting: Settings → Pages → Build and deployment → Source → Deploy from a branch → `gh-pages` / `/ (root)`).
Every pull request also gets a live preview at `https://pkoller.github.io/physiotoni/pr-preview/pr-<number>/`, deployed by `.github/workflows/pr-preview.yml` (via `rossjrw/pr-preview-action`) and linked in a PR comment; it's torn down when the PR closes.
Don't commit the `.claude/` or `media/` folders (both in `.gitignore`).

## What NOT to do
- Don't introduce a framework or build step.
- Don't use emoji — inline SVG only.
- Don't add new CSS outside `style.css`.
- Don't change the bilingual pattern — extend it, don't replace it.
- Don't hardcode colors — use the CSS variables.
