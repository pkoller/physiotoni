# PhysioAntonia — Project Context

## What this is
A static homepage for a physiotherapist named Antonia, plus Impressum/Datenschutz pages. No build tools, no framework, no dependencies. Opens directly in a browser via `file://`.

## Files
```
index.html      — homepage content and structure
style.css       — all styles (imported by every page)
script.js       — language toggle, mobile nav drawer, scroll reveals,
                  nav active-section tracking, contact form handler, FAB
impressum.html  — legal notice (§ 5 ECG), German only
datenschutz.html — privacy policy (DSGVO), German only
img/            — optimized site images (hero photo etc.)
README.md       — repo overview for humans
.claude/skills/ — reference-only design skills (see "Design skills" below)
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
| `--clr-cta` | `#2563EB` | Blue — CTA buttons, FAB |
| `--clr-cta-dark` | `#1D4ED8` | CTA hover |
| `--clr-bg` | `#F2FAFC` | Page background (cyan-tinted, not plain white) |
| `--clr-bg-alt` | `#E2F1F6` | Alternate section background |
| `--clr-border` / `--clr-border-mid` | `#D2E9F0` / `#A6D3E0` | Card/input borders |
| `--clr-text` | `#134E4A` | Body text |
| `--clr-muted` | `#4E8B88` | Subtitles, descriptions |
| `--clr-dark` | `#0D3330` | Headings, footer |
| `--font-heading` | Lora, Georgia, serif | Section titles, logo |
| `--font-body` | Raleway, system-ui, sans-serif | All body text |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrances, button presses |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen movement (drawer slide) |
| `--sidebar-w` | `240px` | Fixed sidebar width (desktop) |

Responsive breakpoints: 375px / 768px / 1024px / 1440px (default).

All backgrounds and borders are shades of the teal/cyan primary — never introduce a plain gray or a hue outside this family (a past pass briefly used blue-gray neutrals and it visibly clashed; keep new surfaces cyan-tinted).

## Layout
- **Left sidebar nav** (`.sidebar`, fixed, `--sidebar-w` wide): logo + 4 links (Physiotherapie, Hausbesuche, Über mich, Kontakt). On mobile (≤768px) it becomes a slide-in drawer toggled by the hamburger, animated with `var(--ease-out)`.
- **Content is left-aligned**, not centered: `.container` has `margin: 0 0 0 5rem` on desktop (≥769px) so the left gutter matches the hero image's top spacing. Don't reintroduce `margin: 0 auto` centering on desktop.
- **Divider panels**: the Hausbesuche and Über-mich sections each have a decorative landscape image/panel (`.housecalls__panel`, `.about__photo-placeholder`) that straddles the boundary to the section above — `position: absolute`, horizontally centered on the page, `transform: translate(-50%, -50%)` vertically centers it on the divider line. They're 20:9, square corners (no `border-radius`). The neighboring sections carry extra top/bottom padding so text never collides with the panel — on mobile this padding is `calc(20.25vw + 3rem)` (scales with the panel's own height) rather than a fixed value. When editing either section, keep the panel's `.reveal` class OFF it (see Motion below) — a transform-based reveal would fight its own positioning transform.
- **Anchor scrolling**: nav links point at inner elements (`#leistungen-eyebrow`, `#hausbesuche-eyebrow`, `#ueber-uns-title`, `#kontakt-title`), each with `scroll-margin-top: 6rem` so the sticky header doesn't cover them when jumped to.

## Motion & interaction conventions
Distilled from Emil Kowalski's design-engineering principles and a taste/anti-slop audit — the deeper reference lives in `.claude/skills/` (see below); this is the everyday summary.

- **Buttons get press feedback**: `transform: scale(0.97)` on `:active`, via `var(--ease-out)` at ~160–200ms. Never `transition: all` — name the exact properties.
- **Only animate `transform` and `opacity`** (GPU-accelerated). Never animate `padding`, `width`, `height`, `top`/`left`.
- **Hover lifts are gated off touch devices**: `@media (hover: none) { .btn:hover, .fab:hover { transform: none; } }` — a tap shouldn't leave a hover state stuck.
- **Scroll reveals**: section content fades up on first view via `.reveal`/`.is-visible` classes + an `IntersectionObserver` in `script.js`, with a short per-section stagger (`--reveal-delay`, ~70ms steps). Everything is gated behind `@media (prefers-reduced-motion: no-preference)` — reduced-motion users get the static end state, not a stripped-down animation.
- **Nav active-state tracks the whole `<section>`**, not the small anchor element a link scrolls to. (A past bug watched the anchor itself, which lands right under the sticky header — outside the "currently in view" band — so it never lit up on click. Fixed by observing the `<section>` via a `WeakMap` from section → nav link.)
- **Typography**: `text-wrap: balance` on headings, `text-wrap: pretty` on body paragraphs, so lines don't end on an orphaned word.
- **Don't over-eyebrow.** A small uppercase label above a section heading (`.section__eyebrow`) is fine on sections that need one (Physiotherapie, Hausbesuche have real content in theirs), but not on every section — "Über mich" and "Kontakt" intentionally have none. Repeating the same decorative label on every section is a templated-AI-slop tell; keep it to content that earns it.
- **Keyboard-triggered or very-frequent actions get no animation.** Anything a user sees dozens of times a day (not really applicable to this small site, but keep it in mind before adding motion to something like the language toggle).

## Design skills
`.claude/skills/` carries reference-only design skills, invoked deliberately (not auto-loaded) when doing a deeper design pass:
- **emil-design-eng** — full animation-timing tables, easing curves, spring-physics guidance beyond the summary above.
- **design-taste-frontend** / **redesign-existing-projects** — anti-slop / de-templating audit checklists (this is where the eyebrow rule and the divider-panel visual variety came from).

These are large reference docs — read the everyday summary above first; reach for the skills themselves only when doing a substantial redesign pass, not for routine edits.

## Bilingual system (DE/EN)
Every visible text element on `index.html` that differs between languages carries both:
```html
<h2 data-de="German text" data-en="English text">German text</h2>
```
`script.js` reads `html.lang` and swaps `textContent` (or `innerHTML` for elements with `<br>`) on all `[data-de]` elements when the toggle is clicked. Default language is German (`<html lang="de">`).

**Rules:**
- Always add both `data-de` and `data-en` to any new text element on `index.html`.
- Use `innerHTML` swap (already handled in `script.js`) only for strings that contain `<br>`.
- The language toggle button in the header (`#langToggle`) is wired up in `script.js` — no changes needed there.
- `impressum.html` and `datenschutz.html` are **German-only by design** — legal text isn't bilingual, don't add `data-de`/`data-en` there.

## Page sections (top → bottom, index.html)
1. **Sidebar** — fixed left nav: logo + Physiotherapie / Hausbesuche / Über mich / Kontakt (drawer on mobile)
2. **Header** — sticky top bar: hamburger + mobile logo, phone, email, lang toggle
3. **Hero** — photo left / headline + 2 CTAs right on desktop; photo shrinks and stacks on top on mobile
4. **Physiotherapie** (`#leistungen`) — eyebrow + heading + one intro paragraph (no service cards — removed)
5. **Hausbesuche** — intro text + bullet list + landscape divider panel straddling the section above
6. **Über mich** (`#ueber-uns`) — heading + bio + credentials list, full width (no eyebrow, no 2-col photo — photo is now the divider panel from Hausbesuche's boundary above)
7. **Kontakt** (`#kontakt`) — heading + contact info (address/phone/email/website) in the left column, contact form top-aligned with it in the right column, Google Maps embed full-width below
8. **Footer** — copyright + Impressum/Datenschutz links
9. **FAB** — floating call button, mobile only

## Placeholder content still to replace
- Phone: `+49 123 45678` (placeholder — appears in header, hero, contact section, FAB; search for it)
- About-me photo: `about__photo-placeholder`-style treatment no longer applies here — the About section is now text-only; if a photo is wanted, add it as a proper `<img>` similar to the hero pattern
- Address (Anichstraße 34, 6020 Innsbruck), email (`hallo@physioantonia.at`), and the Google Maps embed are already real
- `impressum.html` has bracketed placeholders (`[Nachname]`, register number, Aufsichtsbehörde, VAT status) that need real values before the legal pages go live for real

## GitHub & Hosting
Public repo: `https://github.com/pkoller/physiotoni`. **`master` is protected — no direct pushes.** Always work on a branch and open a PR:
```bash
git checkout -b my-change
git add <files>
git commit -m "..."
git push -u origin my-change
gh pr create --base master --head my-change --title "..." --body "..."
```
Live site: `https://pkoller.github.io/physiotoni`. GitHub Pages is served from the `gh-pages` branch, published by `.github/workflows/pages-deploy.yml` on every push to `master` (that workflow needs `permissions: contents: write` — without it the push silently 403s and the branch is never updated; this has broken production before).
Every pull request also gets a live preview at `https://pkoller.github.io/physiotoni/pr-preview/pr-<number>/`, deployed by `.github/workflows/pr-preview.yml` via `rossjrw/pr-preview-action`, and torn down when the PR closes. That workflow stages files into an isolated `_pr-preview-src/` directory before deploying — don't change it back to `source-dir: ./` (repo root), that previously caused the deploy action's own temp worktree to get recursively copied into itself on every run.
`.gitignore`: `media/`, `.agents/`, `skills-lock.json`, and `_pr-preview-src/` are ignored; `.claude/` is ignored except `.claude/skills/{emil-design-eng,design-taste-frontend,redesign-existing-projects}`, which are tracked on purpose (see "Design skills" above).

## What NOT to do
- Don't introduce a framework or build step.
- Don't use emoji — inline SVG only.
- Don't add new CSS outside `style.css`.
- Don't change the bilingual pattern — extend it, don't replace it.
- Don't hardcode colors or easing curves — use the CSS variables.
- Don't push directly to `master` — it's protected; use a branch + PR.
- Don't center `.container` on desktop or remove the sidebar's fixed-left layout.
