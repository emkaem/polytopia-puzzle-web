# Techstack-keuzes: Polytopia fan-website met puzzels/scenario's

## Context
Ik bouw een fan-website voor The Battle of Polytopia. Doel: geen volledige game-kloon, maar een subset van de spelmechanica gebruiken om kleine puzzels en scenario's na te bootsen (denk: vaste startopstelling, beperkt aantal zetten, specifiek doel behalen). Moet zowel op desktop (muis) als mobiel (touch) goed speelbaar zijn. Nog in experimentele fase, gratis gehost zonder eigen domein.

## Gekozen stack

**Frontend:** React + TypeScript + Vite

**Hex-grid rendering:** SVG (niet Canvas)
- Reden: klik/touch-detectie op een hexagon krijg je "gratis" via de browser (DOM hit-detection), i.p.v. zelf x/y-coördinaten naar hex-cellen moeten omrekenen.
- Alternatief overwogen: Canvas — performanter bij zeer veel tegels/animaties, maar complexer voor input-handling en debuggen. Niet nodig bij een puzzel-schaal van naar schatting <150-200 tegels.

**Grid-wiskunde:** `honeycomb-grid` library
- Regelt buren, afstanden, paden, coördinatensysteem. Rendering (SVG) blijft losstaand hiervan.

**Input (muis + touch):** Pointer Events API (`onPointerDown/Move/Up`)
- Eén uniforme API voor muis, touch én stylus, i.p.v. losse `onClick`/`onTouchStart`-logica.
- Aandachtspunten: `touch-action: none` in CSS op het spelbord (anders scrollt de pagina i.p.v. dat de tap/drag wordt afgehandeld), tegels minimaal ~44×44px tikgebied, geen puur hover-afhankelijke UI (touch heeft geen hover-state).

**State management:** React `useState`/`useReducer`, evt. Zustand als het complexer wordt (meerdere scenario's, save states, undo)

**Styling:** Tailwind CSS

**Bewust niet gekozen (nu):** Phaser / PixiJS (game-engines)
- Overwogen omdat "HTML5 game engines" hier historisch onder vallen (Flash-opvolgers, nog steeds actief onderhouden, Phaser 3 heeft ingebouwde Pointer-support).
- Reden om nu niet te kiezen: overkill voor puzzels zonder zware animatie/physics-behoefte. Blijft een optie voor later als er meer "game feel" nodig is.

**Hosting (experimenteerfase):** Vercel of Cloudflare Pages
- Gratis subdomein (`projectnaam.vercel.app` / `.pages.dev`), auto-deploy vanuit GitHub-repo, geen domeinaankoop nodig. Later eenvoudig over te zetten naar eigen domein.

**Overweging voor later:** PWA (manifest + service worker) zodat spelers de site op hun homescreen kunnen zetten.

## Vraag aan Copilot
Graag kritisch laten meekijken op:
1. Klopt de aanname dat SVG hier de betere keuze is dan Canvas, gegeven de schaal (puzzels, niet open-wereld)?
2. Zijn er addertjes onder het gras bij `honeycomb-grid` in combinatie met React/TypeScript (types, performance, onderhoud van de library)?
3. Mis ik iets belangrijks in de Pointer Events aanpak voor cross-device input?
4. Is Zustand een logische volgende stap, of is er iets beters gegeven een puzzel-georiënteerde state (scenario's, undo, save states)?
