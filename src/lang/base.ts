// nailus/src/lang/base.ts

/**
 * Détecte si `fn` est une classe ES6 (constructible via `new`),
 * par opposition à une fonction classique ou fléchée.
 *
 * Stratégie :
 * 1. Rejette tout ce qui n'est pas une fonction (évite les crashs).
 * 2. Vérifie la représentation source de la fonction via
 *    `Function.prototype.toString.call` (immunisé contre un `toString` redéfini).
 * 3. En fallback, inspecte `fn.prototype.constructor` pour couvrir les cas
 *    exotiques (proxies, fonctions wrappées, etc.).
 */
export function isClass(fn: unknown): boolean {
  if (typeof fn !== 'function') return false;

  // `Function.prototype.toString.call` évite qu'un `toString` custom
  // sur l'objet ne fausse la détection.
  const source = Function.prototype.toString.call(fn);

  // Une classe ES6 commence toujours par "class" suivi d'un espace ou "{"
  // (ex: "class Foo {}", "class {}", "class extends Bar {}").
  if (/^class[\s{]/.test(source)) return true;

  // Fallback : certaines fonctions ne portent pas l'information "class"
  // dans leur propre source, mais leur prototype.constructor le fait.
  const proto = (fn as { prototype?: unknown }).prototype;
  if (proto !== null && typeof proto === 'object') {
    const ctor = (proto as { constructor?: unknown }).constructor;
    if (typeof ctor === 'function' && ctor !== fn) {
      const ctorSource = Function.prototype.toString.call(ctor);
      if (/^class[\s{]/.test(ctorSource)) return true;
    }
  }

  return false;
}

/**
 * Appelle `fn` en utilisant `new` si c'est une classe,
 * sinon en appel simple.
 *
 * @param fn   La fonction ou classe à invoquer.
 * @param args Les arguments à passer.
 * @param thisArg Contexte `this` optionnel (ignoré lors d'un `new`).
 *
 * @example
 *   callOrConstruct(class Foo {}, [])       // new Foo()
 *   callOrConstruct(function add(a, b) {}, [1, 2]) // add(1, 2)
 */
export function callOrConstruct<
  TArgs extends unknown[],
  TReturn,
>(
  fn: ((...args: TArgs) => TReturn) | (new (...args: TArgs) => TReturn),
  args: TArgs,
  thisArg?: unknown,
): TReturn {
  if (typeof fn !== 'function') {
    throw new TypeError('callOrConstruct: expected a function or class');
  }

  if (isClass(fn)) {
    // `Reflect.construct` est plus explicite et homogène que `new fn(...args)`.
    return Reflect.construct(fn as new (...a: TArgs) => TReturn, args);
  }

  // `Reflect.apply` est équivalent à `fn.apply(thisArg, args)` mais
  // évite qu'un `apply` custom sur `fn` ne soit utilisé.
  return Reflect.apply(fn as (...a: TArgs) => TReturn, thisArg, args);
}

/**
 * Alias de compatibilité avec l'ancien nom `__call__`.
 * @deprecated Utiliser `callOrConstruct` à la place.
 */
export const __call__ = callOrConstruct;