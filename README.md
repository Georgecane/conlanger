# Conlanger

A visual-first naturalistic conlang development environment for Obsidian.

Conlanger aims to bring the design, documentation, analysis, and historical evolution of constructed languages into one coherent workspace. Development is incremental: linguistic models and workflows will be designed, verified, tested, debugged, and stabilized as implementation needs become clear.

## Development

Requirements: Node.js 22 or newer and npm.

```sh
npm install
npm run dev
```

Create a production build:

```sh
npm run build
npm test
```

The production build generates `main.js` in the repository root. Install the plugin in a test vault by copying `main.js` and `manifest.json` into:

```text
<Vault>/.obsidian/plugins/conlanger/
```

Then enable **Conlanger** under **Settings → Community plugins**.

## Project status

Conlanger is at the initial development stage. The current implementation is only a plugin bootstrap; linguistic engines and visual editors have not been implemented yet.
