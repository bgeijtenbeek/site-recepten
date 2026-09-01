# Fam. Geijtenbeek - Recepten

Een compacte, Nederlandstalige receptenwebsite voor de familie. Astro bouwt alle recepten, categorieën en afbeeldingen vooraf tot een volledig statische website. Er is geen CMS, database of account nodig.

## Lokaal starten

Dit project gebruikt Node.js 24 en npm 11.

```powershell
npm install
npm run dev
```

Open daarna de URL die Astro in de terminal toont. Handige opdrachten:

- `npm run dev` start de lokale ontwikkelserver.
- `npm run check` controleert Astro, TypeScript en alle receptbestanden.
- `npm run test:unit` test hoeveelheden, zoeken, sorteren en URL's.
- `npm run build` maakt de statische website in `dist/`.
- `npm run test:e2e` bouwt de website vanaf `/` en test deze in echte browsers.
- `npm run validate` voert alle controles achter elkaar uit.

## Een recept toevoegen

Maak voor ieder recept één Markdown-bestand in `src/data/recipes/`. De bestandsnaam wordt het blijvende webadres. Gebruik daarom alleen kleine letters, cijfers en streepjes, bijvoorbeeld `pompoensoep.md`. Een titel kan later zonder URL-wijziging worden aangepast.

```yaml
---
title: Pompoensoep
description: Zachte soep met geroosterde pompoen en tijm.
mealType: Voorgerechten
kenmerken: [Vega]
totalTime: 50
servings: 4
ingredients:
  - { name: pompoen, quantity: "800", unit: g }
  - { name: ui, quantity: "1" }
  - { name: peper en zout, amount: naar smaak }
steps:
  - Snijd de pompoen en ui in stukken.
  - Rooster de groenten in de oven.
  - Voeg bouillon toe en pureer de soep.
notes: De soep kan twee dagen in de koelkast worden bewaard.
---
```

Alle velden tussen `---` worden tijdens de bouw gecontroleerd. De basis is altijd vier personen. `totalTime` is de totale kooktijd in minuten.

### Hoeveelheden die meeschalen

Gebruik `quantity` voor een hoeveelheid die moet veranderen met het aantal personen. Geldige vormen zijn:

- hele getallen: `"2"`
- decimalen met punt of komma: `"1.5"` of `"1,5"`
- breuken: `"1/3"`
- gemengde breuken: `"1 1/2"`

`unit` is optioneel, bijvoorbeeld `g`, `ml`, `el` of `tl`. Gebruik `amount` voor tekst die niet mag veranderen, zoals `naar smaak` of `een handvol`. Zet nooit `quantity` en `amount` bij hetzelfde ingrediënt.

## Een foto toevoegen

Zet lokale afbeeldingen in `src/assets/recipes/` en verwijs er vanuit het recept relatief naar:

```yaml
image: ../../assets/recipes/pompoensoep.jpg
imageAlt: Een kom romige pompoensoep met tijm
```

Een afbeelding is optioneel. Zonder `image` toont de website automatisch dezelfde rustige illustratie als tijdelijke vervanging. Voeg bij een echte afbeelding altijd een korte, beschrijvende `imageAlt` toe. Astro maakt bij het bouwen passende formaten voor verschillende schermbreedtes.

## Categorieën beheren

Ieder recept heeft precies één `mealType` en mag meerdere `kenmerken` hebben. De toegestane waarden en URL-slugs staan centraal in `src/data/taxonomies.ts`. Voeg een nieuwe categorie daar één keer toe; Astro maakt de categoriepagina vervolgens automatisch. Voer daarna `npm run check` uit om alle recepten te controleren.

## Publiceren op GitHub Pages

1. Maak een GitHub-repository en push deze map naar de branch `main`.
2. Open in GitHub **Settings → Pages**.
3. Kies bij **Build and deployment** als bron **GitHub Actions**.
4. De workflow `.github/workflows/deploy.yml` controleert en bouwt de site en publiceert daarna `dist/`.

De Astro-configuratie gebruikt `https://recepten.famgeijtenbeek.nl` als publiek domein en publiceert alle interne links vanaf `/`. De bestaande GitHub Pages-workflow bouwt en publiceert de statische uitvoer.

Voer voor iedere publicatie bij voorkeur lokaal uit:

```powershell
npm run validate
```
