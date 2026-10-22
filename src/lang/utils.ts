/**
 * Vérifie si un caractère est un espace (espace, tabulation, retour à la ligne).
 */
export function isSpace(str: string): boolean {
  return /^\s$/.test(str);
}

/**
 * Vérifie si un caractère est un chiffre (0-9).
 * CORRECTION : Utilisation de ^\d$ pour s'assurer qu'il n'y a qu'un seul caractère.
 */
export function isDigit(str: string): boolean {
  return /^[0-9]$/.test(str);
}

/**
 * Vérifie si un caractère est une lettre (a-z, A-Z) ou un underscore.
 * CORRECTION MAJEURE : /\w/ matchait aussi les chiffres ! Un identifiant 
 * comme "foo" ne doit pas être confondu avec "foo1".
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z_]$/.test(str);
}

/**
 * Assemble une liste de chaînes de caractères avec des points-virgules.
 * CORRECTION : Ne retourne pas de point-virgule si le tableau est vide.
 */
export function connect(strings: string[]): string {
  if (strings.length === 0) return '';
  const joined = strings.join(';\n');
  // Ajoute un point-virgule final seulement si ce n'est pas déjà fait
  return joined.endsWith(';') ? joined : joined + ';';
}

/**
 * Trouve l'index de l'accolade fermante correspondante à un bloc `{ ... }`.
 * Remplace l'ancienne logique complexe par une simple boucle de comptage (O(n)).
 * 
 * @param text Le code source complet.
 * @param startIndex L'index juste APRÈS l'accolade ouvrante `{`.
 * @returns L'index de l'accolade fermante, ou -1 si non trouvée.
 */
export function findGroupEnd(text: string, startIndex = 0): number {
  let level = 1;
  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];
    if (char === '{') {
      level++;
    } else if (char === '}') {
      level--;
      if (level === 0) return i;
    }
  }
  return -1;
}

/**
 * Recherche une chaîne cible dans le texte à partir d'un index donné.
 * CORRECTION : Utilise `indexOf` natif (très rapide) au lieu de recréer une 
 * sous-chaîne avec `substring()`.
 * 
 * @param text La chaîne de caractères globale.
 * @param target La chaîne à rechercher.
 * @param startIndex L'index de départ.
 * @param endIndex (Optionnel) L'index de fin.
 * @returns L'index absolu de la cible, ou -1 si introuvable.
 */
export function searchFrom(
  text: string,
  target: string,
  startIndex = 0,
  endIndex?: number
): number {
  const limit = endIndex !== undefined ? Math.min(endIndex, text.length) : text.length;
  
  for (let i = startIndex; i < limit; i++) {
    if (text.startsWith(target, i)) {
      return i;
    }
  }
  return -1;
}