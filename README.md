# Conlanger

A visual-first naturalistic conlang development environment for Obsidian.

Conlanger brings the design, documentation, analysis, and historical evolution of constructed languages into one coherent workspace. Its data is stored in ordinary Markdown files inside the user's vault.

## Current functionality

Use the **Create language** command from Obsidian's Command Palette. Conlanger creates a folder under `Conlanger/` and a `Language.md` note containing versioned metadata and an initial overview section. Existing language folders are never overwritten; duplicate names receive a numeric suffix.

The language note is the starting point for the language's future linguistic systems. Detailed phonological, morphological, syntactic, semantic, and historical models will be introduced incrementally.

## Development

Requirements: Node.js 22 or newer and npm.

```sh
npm install
npm run dev
```

Create a production build and run the test suite:

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

Conlanger is in active early development. The language creation workflow is the first implemented vertical slice; linguistic engines and visual editors are not implemented yet.
