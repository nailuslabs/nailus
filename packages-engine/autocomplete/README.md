<div align="center">

  <p align="center">
    <img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss-intellisense/main/packages/vscode-tailwindcss/.github/banner.png" alt="Nailus Autocomplete Banner" width="100%" />
  </p>
  
  <br>
  
  <h1>@nailus/autocomplete</h1>
  
  **<h3>Expérience d'autocomplétion intelligente pour Nailus. Intégré au <a href="https://nailus.cg/playground">Playground</a> et à <a href="https://github.com/nailus/nailus/tree/main/packages-integrations/vscode">l'extension VS Code</a>.</h3>**

  <p>
    <a href="https://www.npmjs.com/package/@nailus/autocomplete">
      <img src="https://img.shields.io/npm/v/@nailus/autocomplete?color=06B6D4&label=version" alt="Version npm" />
    </a>
    <a href="https://www.npmjs.com/package/@nailus/autocomplete">
      <img src="https://img.shields.io/npm/dm/@nailus/autocomplete?color=10B981" alt="Téléchargements npm" />
    </a>
    <a href="https://github.com/nailuslabs/nailus/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@nailus/autocomplete" alt="Licence MIT" />
    </a>
    <a href="https://github.com/nailuslabs/nailus">
      <img src="https://img.shields.io/github/stars/nailuslabs/nailus?style=social" alt="GitHub Stars" />
    </a>
  </p>
</div>

<br>

---

<div align="justify">

> 💡 **Recommandation** : Je vous invite à lire cet article de blog pour mieux comprendre la philosophie derrière Nailus :  
> [Réinventer le moteur atomique de génération CSS, FONTS ICONS SVG](https://nailus.blog.cg/posts/reimagine-atomic-css-fonts-icons)

</div>

---

## 📖 Introduction

**@nailus/autocomplete** fournit des utilitaires d'autocomplétion intelligents pour le framework **Nailus**, améliorant significativement l'expérience développeur (DX) en offrant :

- 🎯 **Complétion contextuelle avancée**  
  *Des suggestions pertinentes qui anticipent vos besoins pour chaque classe utilitaire*

- 🎨 **Prévisualisation visuelle en temps réel**  
  *Aperçu visuel instantané des couleurs, espacements et propriétés CSS générées*

- 🔗 **Intégration native multi-éditeurs**  
  *Fonctionne harmonieusement avec VS Code, Neovim, Zed et plus encore*

- ⚡ **Moteur de suggestions ultra-rapide**  
  *Moteur de suggestion ultra-rapide avec un temps de réponse inférieur à 10ms*

---

## ✨ Fonctionnalités

<table>
  <tr>
    <td width="50%">
      <h3>🎯 Autocomplétion de classes utilitaires</h3>
      <p>Suggestions contextuelles pour toutes les classes Nailus avec aperçu en temps réel de la valeur CSS générée.</p>
      <img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss-intellisense/main/packages/vscode-tailwindcss/.github/autocomplete.png" alt="Autocomplétion Nailus" width="100%"/>
    </td>
    <td width="50%">
      <h3>🎨 Suggestions de couleurs</h3>
      <p>Aperçu visuel des couleurs directement dans l'éditeur avec support du format hex, rgb, hsl.</p>
      <img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss-intellisense/main/packages/vscode-tailwindcss/.github/autocomplete.png" alt="Suggestions de couleurs Nailus" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📖 Documentation intégrée</h3>
      <p>Documentation détaillée au survol des classes pour une compréhension instantanée sans quitter l'IDE.</p>
      <img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss-intellisense/main/packages/vscode-tailwindcss/.github/hover.png" alt="Documentation Nailus" width="100%"/>
    </td>
    <td width="50%">
      <h3>🔍 Linting intelligent</h3>
      <p>Détection des erreurs, classes obsolètes et conflits potentiels directement dans votre code.</p>
      <img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss-intellisense/main/packages/vscode-tailwindcss/.github/linting.png" alt="Linting Nailus" width="100%"/>
    </td>
  </tr>
</table>

---

## 🚀 Installation

### Prérequis

Avant d'installer `@nailus/autocomplete`, assurez-vous d'avoir :

- **Node.js** version 16 ou supérieure
- **Nailus** configuré dans votre projet (`nailus.config.ts`)

### Choisissez votre intégration

| Intégration | Commande | Guide |
|-------------|----------|-------|
| **npm** | `npm install -D @nailus/autocomplete` | [Guide npm](https://nailus.cg/autocomplete/npm) |
| **yarn** | `yarn add -D @nailus/autocomplete` | [Guide yarn](https://nailus.cg/autocomplete/yarn) |
| **pnpm** | `pnpm add -D @nailus/autocomplete` | [Guide pnpm](https://nailus.cg/autocomplete/pnpm) |
| **bun** | `bun add -D @nailus/autocomplete` | [Guide bun](https://nailus.cg/autocomplete/bun) |
| **VS Code** | Aller sur le Marketplace | [Extension VS Code](https://marketplace.visualstudio.com/items?itemName=nailus.vscode) |
| **Neovim** | `pnpm add -D @nailus/autocomplete` | [Guide Neovim](https://nailus.cg/autocomplete/neovim) |
| **Zed** | `pnpm add -D @nailus/autocomplete` | [Guide Zed](https://nailus.cg/autocomplete/zed) |
| **JetBrains** | `pnpm add -D @nailus/autocomplete` | [Guide JetBrains](https://nailus.cg/autocomplete/jetbrains) |

### Configuration rapide

Une fois le package installé, créez ou mettez à jour votre fichier `nailus.config.ts` à la racine de votre projet :

```typescript
// nailus.config.ts
import { defineConfig } from '@nailus/autocomplete'

export default defineConfig({
  // Votre configuration Nailus existante
  presets: [
    // Vos presets ici
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06B6D4',
        secondary: '#10B981'
      }
    }
  },
  
  // Configuration de l'autocomplétion (optionnelle)
  autocomplete: {
    enabled: true,
    colorPreview: true,
    documentation: true,
    linting: true
  }
})