# PhysioAntonia

Website für die Physiotherapie-Praxis **PhysioAntonia** in Innsbruck.

**Live:** https://pkoller.github.io/physiotoni/ (künftig: physioantonia.at)

## Tech

Statische Website ohne Framework, Build-Tools oder Dependencies — öffnet direkt im Browser.

| Datei | Inhalt |
|-------|--------|
| `index.html` | Gesamte Seitenstruktur und Inhalte |
| `style.css` | Alle Styles (Design-Tokens als CSS-Variablen in `:root`) |
| `script.js` | Sprachumschaltung, mobiles Menü, Formular-Handler |
| `impressum.html` | Impressum (§ 5 ECG / § 25 MedienG) |
| `datenschutz.html` | Datenschutzerklärung (DSGVO) |
| `img/` | Optimierte Bilder für die Website |

## Zweisprachigkeit (DE/EN)

Jeder sichtbare Text trägt beide Sprachen als Attribute:

```html
<h2 data-de="Über mich" data-en="About me">Über mich</h2>
```

`script.js` schaltet beim Klick auf den DE|EN-Button alle `[data-de]`-Elemente um. Standardsprache ist Deutsch. Neue Texte immer mit beiden Attributen anlegen.

## Lokale Vorschau

Direkt `index.html` im Browser öffnen, oder mit lokalem Server:

```bash
py -m http.server 8123
```

## Deployment

GitHub Pages deployt automatisch bei jedem Merge in `master`. Der Branch ist geschützt — Änderungen laufen über Pull Requests.

## Offene Platzhalter

Vor dem echten Livegang ergänzen:

- Telefonnummer (aktuell `+49 123 45678`)
- Impressum: Nachname, Gesundheitsberuferegister-Nummer, Aufsichtsbehörde, USt-Status
- Foto für den Bereich „Über mich" (Platzhalter-Kachel)
