<div align="center">

  <p align="center">
    <img src="https://community.esri.com/t5/image/serverpage/image-id/144748i8555D48F05F3D95C?v=v2" alt="cli init" width="100%" alt="Nailus CLI Banner" width="100%" />
  </p>
  
  <br>
  
  <h1>@nailus/cli</h1>
  
  **<h3>Interface de ligne de commande pour nailus. <a href="https://nailus.cg/createProject">Créer</a>, <a href="https://nailus.cg/Integration/">construisez et optimisez</a> vos projets CSS, UI, ou application ou site web en toute simplicité..</h3>**

  <p>
    <a href="https://www.npmjs.com/package/@nailus/cli">
      <img src="https://img.shields.io/npm/v/@nailus/cli?color=06B6D4&label=version" alt="Version npm" />
    </a>
    <a href="https://www.npmjs.com/package/@nailus/cli">
      <img src="https://img.shields.io/npm/dm/@nailus/cli?color=10B981" alt="Téléchargements npm" />
    </a>
    <a href="https://github.com/nailuslabs/nailus/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@nailus/cli" alt="Licence MIT" />
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

**@nailus/cli** est l'outil en ligne de commande officiel du framework **Nailus**. Il vous offre un contrôle total sur votre workflow CSS, UI..., de la création à l'optimisation

- 🎯 **Scaffolding de projet**  
  *Initialisez un projet Nailus complet en une seule commande*

- 🎨 **Gestion de thème interactive**  
  *Configurez vos couleurs, typographies et breakpoints sans effort*

- 🔗 **Build ultra-rapide**  
  *Compilez et optimisez votre CSS, vos Composantes UI avec des performances natives*

- ⚡ **Analyse intelligente**  
  *Auditez vos classes utilitaires et optimisez votre bundle automatiquement*

- ⚡ **Mode watch réactif**  
  *Rebuild incrémental en moins de 50ms à chaque modification*

- ⚡ **Diagnostic intégré**  
  *Détectez et corrigez les problèmes de configuration automatiquement*

---

## ✨ Fonctionnalités

<table>
  <tr>
    <td width="50%">
      <h3><code>nailus init</code></h3>
      <p>Initialisez un nouveau projet Nailus avec templates, dépendances et configuration prête à l'emploi.</p>
      <img src="https://community.esri.com/t5/image/serverpage/image-id/144748i8555D48F05F3D95C?v=v2" alt="cli init" width="100%"/>
    </td>
    <td width="50%">
      <h3><code>nailus build</code></h3>
      <p>Compilez votre CSS avec purge des classes inutilisées, minification et sourcemaps.</p>
      <img src="https://community.esri.com/t5/image/serverpage/image-id/144748i8555D48F05F3D95C?v=v2" alt="build cli Nailus" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3><code>nailus theme</code></h3>
      <p>Analysez l'utilisation des classes, détectez les redondances et optimisez votre bundle.</p>
      <img src="https://community.esri.com/t5/image/serverpage/image-id/144748i8555D48F05F3D95C?v=v2" alt="Documentation Nailus" width="100%"/>
    </td>
    <td width="50%">
      <h3><code>nailus config</code></h3>
      <p>Gérez votre configuration Nailus directement depuis le terminal.</p>
      <img src="https://community.esri.com/t5/image/serverpage/image-id/144748i8555D48F05F3D95C?v=v2" alt="Linting Nailus" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3><code>nailus doctor</code></h3>
      <p>Diagnostiquez et réparez automatiquement les problèmes de votre environnement.</p>
      <img src="https://community.esri.com/t5/image/serverpage/image-id/144748i8555D48F05F3D95C?v=v2" alt="Linting Nailus" width="100%"/>
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
| **npm** | `npm install -D @nailus/cli` | [Guide npm](https://nailus.cg/autocomplete/npm) |
| **yarn** | `yarn add -D @nailus/cli` | [Guide yarn](https://nailus.cg/autocomplete/yarn) |
| **pnpm** | `pnpm add -D @nailus/cli` | [Guide pnpm](https://nailus.cg/autocomplete/pnpm) |
| **bun** | `bun add -D @nailus/bun` | [Guide bun](https://nailus.cg/autocomplete/bun) |