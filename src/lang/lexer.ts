import { isSpace, isDigit, isAlpha, findGroupEnd } from './utils';
import { Token, TokenType, REVERSED_KEYWORDS } from './tokens';

/**
 * Représente l'état interne du Lexer à un instant T.
 * Utilisé pour le backtracking (peek) sans corrompre l'état global.
 */
interface LexerState {
  pos: number;
  current_char: string | undefined;
  isFunc: boolean;
  isID: boolean;
}

/**
 * Le Lexer est responsable de la tokenisation du code source.
 * Il transforme une chaîne de caractères brute en un flux de Tokens
 * compréhensibles par le Parser.
 */
export class Lexer {
  private text: string;
  private pos: number;
  
  /** Indique si l'on est actuellement dans la déclaration d'une fonction (@func). */
  private isFunc = false;
  
  /** Aide à distinguer les dictionnaires (paires clé:valeur) des assignations de propriétés. */
  private isID = false;
  
  /** Le caractère en cours d'analyse. `undefined` signifie la fin du fichier (EOF). */
  private current_char?: string;

  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.current_char = this.text[this.pos];
  }

  // =========================================================================
  // MÉTHODES UTILITAIRES DE BASE
  // =========================================================================

  /**
   * Lève une erreur de syntaxe et arrête l'exécution.
   */
  private error(msg = 'Invalid character'): never {
    throw new Error(`[Lexer Error] ${msg} at position ${this.pos}`);
  }

  /**
   * Regarde le caractère suivant sans avancer le curseur.
   */
  private peek(): string | undefined {
    return this.pos + 1 < this.text.length ? this.text[this.pos + 1] : undefined;
  }

  /**
   * Avance le curseur d'un certain nombre de pas.
   * @param step Nombre de caractères à sauter (par défaut 1).
   * @returns Le nouveau caractère courant après l'avancement.
   */
  private advance(step = 1): string | undefined {
    this.pos += step;
    this.current_char = this.pos < this.text.length ? this.text[this.pos] : undefined;
    return this.current_char;
  }

  /**
   * Sauvegarde l'état complet du lexer (curseur + drapeaux).
   */
  private saveState(): LexerState {
    return {
      pos: this.pos,
      current_char: this.current_char,
      isFunc: this.isFunc,
      isID: this.isID,
    };
  }

  /**
   * Restaure un état précédemment sauvegardé.
   */
  private restoreState(state: LexerState): void {
    this.pos = state.pos;
    this.current_char = state.current_char;
    this.isFunc = state.isFunc;
    this.isID = state.isID;
  }

  /**
   * Saute tous les caractères d'espacement (espaces, tabulations, retours à la ligne).
   */
  private skip_whitespace(): void {
    while (this.current_char !== undefined && isSpace(this.current_char)) {
      this.advance();
    }
  }

  // =========================================================================
  // SOUS-ROUTINES DE LEXING
  // =========================================================================

  /**
   * Décode une séquence d'échappement courante (ex: '\n' devient un vrai saut de ligne).
   */
  private decodeEscape(ch: string): string {
    switch (ch) {
      case 'n': return '\n';
      case 't': return '\t';
      case 'r': return '\r';
      case '\\': return '\\';
      case '\'': return '\'';
      case '"': return '"';
      case '`': return '`';
      default: return ch;
    }
  }

  /**
   * Traite les chaînes de caractères (simples, doubles ou templates).
   * @param quote Le type de guillemet utilisé pour fermer la chaîne.
   */
  private string(quote: '\'' | '"' | '`'): Token {
    let result = '';
    let escaped = false;

    while (this.current_char !== undefined) {
      const ch = this.current_char;

      if (escaped) {
        result += this.decodeEscape(ch);
        escaped = false;
        this.advance();
        continue;
      }

      if (ch === '\\') {
        escaped = true;
        this.advance();
        continue;
      }

      if (ch === quote) {
        this.advance(); // Consomme la quote fermante
        break;
      }

      result += ch;
      this.advance();
    }

    if (this.current_char === undefined && escaped) {
      this.error('Unterminated escape sequence in string');
    }

    if (quote === '`') {
      return new Token(TokenType.TEMPLATE, result);
    }
    this.isID = false;
    return new Token(TokenType.STRING, result);
  }

  /**
   * Lit une séquence jusqu'au prochain point-virgule (`;`) ou accolade fermante (`}`),
   * en respectant les caractères d'échappement.
   */
  private readUntilSemicolon(): string {
    let result = '';
    let escaped = false;
    while (this.current_char !== undefined) {
      const ch = this.current_char;
      if (escaped) {
        result += ch;
        escaped = false;
        this.advance();
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        this.advance();
        continue;
      }
      if (ch === ';' || ch === '}') break; // Garde-fou
      result += ch;
      this.advance();
    }
    return result;
  }

  /**
   * Traite les mots-clés précédés de `@` (ex: @js, @func, @apply, @attr).
   */
  private keyword(): Token {
    let result = '';
    while (this.current_char !== undefined && isAlpha(this.current_char)) {
      result += this.current_char;
      this.advance();
    }

    if (!(result in REVERSED_KEYWORDS)) {
      this.error(`Unknown keyword '@${result}'`);
    }

    // CORRECTION : REVERSED_KEYWORDS contient un TokenType, on crée une NOUVELLE instance de Token
    const token = new Token(REVERSED_KEYWORDS[result], `@${result}`);

    switch (result) {
      case 'js': {
        this.skip_whitespace();
        this.advance(); // Saute l'accolade ouvrante
        const end = findGroupEnd(this.text, this.pos);
        token.value = this.text.slice(this.pos, end);
        this.pos = end + 1;
        this.current_char = this.pos < this.text.length ? this.text[this.pos] : undefined;
        break;
      }

      case 'func':
        this.isFunc = true;
        break;

      case 'apply': {
        this.skip_whitespace();
        token.value = this.readUntilSemicolon();
        break;
      }

      case 'attr': {
        if (this.current_char !== '[') this.error('Expected "[" after @attr');
        this.advance(); // Consomme '['

        let meta = '';
        // Le cast "as string" évite l'erreur TS2367 sur la comparaison stricte
        while (this.current_char !== undefined && (this.current_char as string) !== ']') {
          meta += this.current_char;
          this.advance();
        }
        if (this.current_char === undefined) this.error('Unterminated @attr[...]');
        this.advance(); // Consomme ']'
        token.meta = meta;

        this.skip_whitespace();
        token.value = this.readUntilSemicolon();
        break;
      }
    }
    return token;
  }

  /**
   * Traite les nombres (entiers et flottants) ainsi que leurs unités (px, em, rem, %, s, deg).
   */
  private numeric(): Token {
    let result = '';

    while (this.current_char !== undefined && isDigit(this.current_char)) {
      result += this.current_char;
      this.advance();
    }

    if (this.current_char === '.') {
      result += '.';
      this.advance();
      while (this.current_char !== undefined && isDigit(this.current_char)) {
        result += this.current_char;
        this.advance();
      }
    }

    const value = +result;

    // Utilisation de startsWith(x, pos) pour des performances O(1)
    if (this.text.startsWith('rem', this.pos)) { this.advance(3); return new Token(TokenType.REM, value); }
    if (this.text.startsWith('px',  this.pos)) { this.advance(2); return new Token(TokenType.PIXEL, value); }
    if (this.text.startsWith('deg', this.pos)) { this.advance(3); return new Token(TokenType.DEGREE, value); }
    if (this.text.startsWith('em',  this.pos)) { this.advance(2); return new Token(TokenType.EM, value); }
    if (this.text.startsWith('%',   this.pos)) { this.advance();    return new Token(TokenType.PERCENTAGE, value); }
    if (this.text.startsWith('s',   this.pos)) { this.advance();    return new Token(TokenType.SECOND, value); }

    this.isID = false;
    return new Token(TokenType.NUMBER, value);
  }

  /**
   * Traite les couleurs hexadécimales (ex: #fff, #000000).
   */
  private color(): Token {
    let result = '';
    while (this.current_char !== undefined && isAlpha(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return new Token(TokenType.COLOR, '#' + result);
  }

  /**
   * Traite les identifiants et les mots-clés standards (and, or, in, True, etc.).
   */
  private id(): Token {
    let result = '';
    while (this.current_char !== undefined && isAlpha(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    this.isID = true;

    switch (result) {
      case 'and':  return new Token(TokenType.AND, result);
      case 'or':   return new Token(TokenType.OR, result);
      case 'not':
        if (this.peek_next_token().type === TokenType.IN) {
          return new Token(TokenType.NOTIN, 'not in');
        }
        return new Token(TokenType.NOT, result);
      case 'from':  return new Token(TokenType.FROM, result);
      case 'as':    return new Token(TokenType.AS, result);
      case 'in':    return new Token(TokenType.IN, result);
      case 'await': return new Token(TokenType.AWAIT, result);
      case 'new':   return new Token(TokenType.NEW, result);
      case 'True':  return new Token(TokenType.TRUE, 1);
      case 'False': return new Token(TokenType.FALSE, 0);
      case 'None':  return new Token(TokenType.NONE, undefined);
      default:      return new Token(TokenType.ID, result);
    }
  }

  /**
   * Traite les assignations de propriétés (ex: `color: red;`).
   */
  private property(): Token {
    const result = this.readUntilSemicolon();
    const isTemplate = /\$\{[^}]*\}/.test(result);
    return new Token(isTemplate ? TokenType.TEMPLATE : TokenType.STRING, result);
  }

  /**
   * Traite les caractères non reconnus en les groupant comme un identifiant générique (fallback).
   */
  private unknown(): Token {
    let result = '';
    let escaped = false;
    const stopChars = new Set(['{', '}', ';', '(', ')', '[', ']', '\n']);

    while (this.current_char !== undefined) {
      const ch = this.current_char;
      if (escaped) {
        result += ch;
        escaped = false;
        this.advance();
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        this.advance();
        continue;
      }
      if (stopChars.has(ch)) break;
      result += ch;
      this.advance();
    }

    this.isID = true;
    return new Token(TokenType.ID, result.trimEnd());
  }

  // =========================================================================
  // API PUBLIQUE
  // =========================================================================

  /**
   * Permet de regarder le(s) prochain(s) token(s) sans faire avancer le lexer.
   * @param count Nombre de tokens à regarder en avance (par défaut 1).
   */
  public peek_next_token(count = 1): Token {
    const state = this.saveState();
    let token: Token = new Token(TokenType.EOF, undefined);
    try {
      for (let i = 0; i < count; i++) {
        token = this.get_next_token();
      }
    } finally {
      this.restoreState(state); // Garantit la restauration même en cas d'erreur
    }
    return token;
  }

  /**
   * Récupère le prochain Token dans le flux.
   * C'est la méthode principale appelée par le Parser.
   */
  public get_next_token(): Token {
    while (this.current_char !== undefined) {
      if (isSpace(this.current_char)) {
        this.skip_whitespace();
        continue;
      }

      if (isDigit(this.current_char)) return this.numeric();
      if (isAlpha(this.current_char)) return this.id();

      switch (this.current_char) {
        case '@':
          this.advance();
          return this.keyword();

        case '$':
          this.advance();
          return new Token(TokenType.DOLLAR, '$');

        case '=': {
          this.advance();
          // Le cast `as string` résout l'erreur TS2367
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.EQUAL, '=='); }
          if ((this.current_char as string) === '>') { this.advance(); return new Token(TokenType.ARROW, '=>'); }
          return new Token(TokenType.ASSIGN, '=');
        }

        case '!': {
          this.advance();
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.NOTEQUAL, '!='); }
          return new Token(TokenType.NO, '!');
        }

        case ':': {
          this.advance();
          if (this.isFunc || !this.isID) return new Token(TokenType.COLON, ':');
          this.skip_whitespace();
          return this.property();
        }

        case ';':
          this.advance();
          this.isFunc = false;
          return new Token(TokenType.SEMI, ';');

        case '\'': this.advance(); return this.string('\'');
        case '"':  this.advance(); return this.string('"');
        case '`':  this.advance(); return this.string('`');

        case '#': this.advance(); return this.color();

        case '{':
          this.advance();
          this.isFunc = false;
          return new Token(TokenType.LCURLY, '{');

        case '}':
          this.advance();
          return new Token(TokenType.RCURLY, '}');

        case '+': {
          this.advance();
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.ADDEQUAL, '+='); }
          if ((this.current_char as string) === '+') { this.advance(); return new Token(TokenType.INCREASE, '++'); }
          return new Token(TokenType.PLUS, '+');
        }

        case '-': {
          this.advance();
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.MINUSEQUAL, '-='); }
          if ((this.current_char as string) === '-') { this.advance(); return new Token(TokenType.DECREASE, '--'); }
          return new Token(TokenType.MINUS, '-');
        }

        case '%': {
          this.advance();
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.MODEQUAL, '%='); }
          return new Token(TokenType.MOD, '%');
        }

        case '*': {
          this.advance();
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.MULEQUAL, '*='); }
          if ((this.current_char as string) === '*') {
            this.advance();
            if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.EXPEQUAL, '**='); }
            return new Token(TokenType.EXP, '**');
          }
          return new Token(TokenType.MUL, '*');
        }

        case '/':
          this.advance();
          return new Token(TokenType.DIV, '/');

        case '>': {
          this.advance();
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.GERATEREQUAL, '>='); }
          return new Token(TokenType.GERATER, '>');
        }

        case '<': {
          this.advance();
          if ((this.current_char as string) === '=') { this.advance(); return new Token(TokenType.LESSEQUAL, '<='); }
          return new Token(TokenType.LESS, '<');
        }

        case '?': this.advance(); return new Token(TokenType.TERNARY, '?');
        case '(': this.advance(); return new Token(TokenType.LPAREN, '(');
        case ')': this.advance(); return new Token(TokenType.RPAREN, ')');
        case '[': this.advance(); return new Token(TokenType.LSQUARE, '[');
        case ']': this.advance(); return new Token(TokenType.RSQUARE, ']');
        case ',': this.advance(); return new Token(TokenType.COMMA, ',');

        case '.': {
          // Vérifie si c'est un sélecteur CSS (ex: .class {) ou un simple point
          const rest = this.text.slice(this.pos);
          if (!/^\.[^;{]+{/.test(rest)) {
            this.advance();
            return new Token(TokenType.DOT, '.');
          }
          return this.unknown();
        }

        default:
          return this.unknown();
      }
    }

    // Si la boucle se termine, on est à la fin du fichier.
    return new Token(TokenType.EOF, undefined);
  }
}