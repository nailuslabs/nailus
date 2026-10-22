/**
 * Représente un jeton (Token) généré par le Lexer.
 */
export class Token {
  readonly type: TokenType;
  value?: string | number;
  meta?: string;

  constructor(type: TokenType, value?: string | number, meta?: string) {
    this.type = type;
    this.value = value;
    this.meta = meta;
  }
}

/**
 * Liste exhaustive des types de tokens et de nœuds du langage.
 */
export enum TokenType {
  // --- Litterals & Primitives ---
  NUMBER = 'NUMBER',
  PIXEL = 'PIXEL',
  REM = 'REM',
  EM = 'EM',
  SECOND = 'SECOND',
  DEGREE = 'DEGREE',
  PERCENTAGE = 'PERCENTAGE',
  STRING = 'STRING',
  TEMPLATE = 'TEMPLATE',
  COLOR = 'COLOR',

  // --- Arithmetic Operators ---
  PLUS = '+',
  MINUS = '-',
  MUL = '*',
  DIV = '/',
  MOD = '%',
  EXP = '**',

  // --- Assignment Operators ---
  ADDEQUAL = '+=',
  MINUSEQUAL = '-=',
  MULEQUAL = '*=',
  DIVEQUAL = '/=',
  MODEQUAL = '%=',
  EXPEQUAL = '**=',
  INCREASE = '++',
  DECREASE = '--',
  ARROW = '=>',

  // --- Comparison Operators ---
  EQUAL = '==',
  NOTEQUAL = '!=',
  GERATER = '>',
  LESS = '<',
  GERATEREQUAL = '>=',
  LESSEQUAL = '<=',
  TERNARY = '?',

  // --- Logical Operators ---
  NO = '!',
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  FROM = 'from',
  IN = 'in',
  NOTIN = 'not in',
  AS = 'as',

  // --- Keywords ---
  NONE = 'None',
  TRUE = 'True',
  FALSE = 'False',

  // --- Punctuation ---
  DOLLAR = '$',
  DOT = '.',
  COMMA = ',',
  LPAREN = '(',
  RPAREN = ')',
  LCURLY = '{',
  RCURLY = '}',
  LSQUARE = '[',
  RSQUARE = ']',
  UNKNOWN = 'UNKNOWN',
  ASSIGN = '=',
  SPACE = 'SPACE',
  SEMI = ';',
  COLON = ':',
  EOF = 'EOF',
  ID = 'ID',

  // --- Directives (@) ---
  VAR = '@var',
  APPLY = '@apply',
  ATTR = '@attr',
  MIXIN = '@mixin',
  INCLUDE = '@include',
  FUNC = '@func',
  ASYNC = '@async',
  AWAIT = '@await',
  RETURN = '@return',
  YIELD = '@yield',
  IMPORT = '@import',
  EXPORT = '@export',
  LOAD = '@load',
  IF = '@if',
  ELSE = '@else',
  ELIF = '@elif',
  WHILE = '@while',
  FOR = '@for',
  JS = '@js',
  LOG = '@log',
  WARN = '@warn',
  ERROR = '@error',
  ASSERT = '@assert',
  BREAK = '@break',
  CONTINUE = '@continue',
  TRY = '@try',
  EXCEPT = '@except',
  FINALLY = '@finally',
  WITH = '@with',
  RAISE = '@raise',
  DEL = '@del',
  NEW = 'new',
}

/**
 * Table de correspondance pour les mots-clés précédés de `@`.
 * CORRECTION : On stocke uniquement le `TokenType` (pas l'instance `Token`),
 * sinon le Lexer risque de modifier l'état global (mémoire partagée) !
 */
export const REVERSED_KEYWORDS: Record<string, TokenType> = {
  'apply': TokenType.APPLY,
  'attr': TokenType.ATTR,
  'mixin': TokenType.MIXIN,
  'include': TokenType.INCLUDE,
  'func': TokenType.FUNC,
  'async': TokenType.ASYNC,
  'return': TokenType.RETURN,
  'yield': TokenType.YIELD,
  'break': TokenType.BREAK,
  'continue': TokenType.CONTINUE,
  'try': TokenType.TRY,
  'except': TokenType.EXCEPT,
  'finally': TokenType.FINALLY,
  'raise': TokenType.RAISE,
  'with': TokenType.WITH,
  'var': TokenType.VAR,
  'load': TokenType.LOAD,
  'import': TokenType.IMPORT,
  'export': TokenType.EXPORT,
  'if': TokenType.IF,
  'else': TokenType.ELSE,
  'elif': TokenType.ELIF,
  'while': TokenType.WHILE,
  'for': TokenType.FOR,
  'js': TokenType.JS,
  'log': TokenType.LOG,
  'warn': TokenType.WARN,
  'error': TokenType.ERROR,
  'assert': TokenType.ASSERT,
  'del': TokenType.DEL,
};

// ============================================================================
// AST NODES : LITTERALS & PRIMITIVES
// ============================================================================

export class Num {
  readonly token: Token;
  readonly value: number;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as number;
  }
}

export class Bool {
  readonly value: boolean;
  constructor(value: boolean) { this.value = value; }
}

export class None {}

export class PIXEL extends Num {}
export class REM extends Num {}

export class Str {
  readonly token: Token;
  readonly value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as string;
  }
}

export class Template {
  readonly token: Token;
  readonly value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as string;
  }
}

// ============================================================================
// AST NODES : COLLECTIONS
// ============================================================================

export class Tuple {
  readonly values: DataType[];
  constructor(values: DataType[]) { this.values = values; }
}

export class List {
  readonly values: DataType[];
  constructor(values: DataType[]) { this.values = values; }
}

export class Params {
  readonly values: DataType[];
  constructor(values: DataType[]) { this.values = values; }
}

export class Dict {
  readonly pairs: [string | number, DataType][];
  constructor(pairs: [string | number, DataType][]) { this.pairs = pairs; }
}

// ============================================================================
// AST NODES : VARIABLES & OPÉRATIONS
// ============================================================================

export class Var {
  readonly token: Token;
  readonly value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as string;
  }
}

export class Apply {
  readonly value: Str | Template;
  constructor(value: string) {
    const token = new Token(TokenType.STRING, value);
    this.value = /\${.*}/.test(value) ? new Template(token) : new Str(token);
  }
}

export class Attr {
  readonly attr: string;
  readonly value: Str | Template;
  constructor(attr: string, value: string) {
    const token = new Token(TokenType.STRING, value);
    this.attr = attr;
    this.value = /\${.*}/.test(value) ? new Template(token) : new Str(token);
  }
}

export class UnaryOp {
  readonly op: Token;
  readonly expr: Expression;
  constructor(op: Token, expr: Expression) {
    this.op = op;
    this.expr = expr;
  }
}

export class BinOp {
  readonly left: Expression;
  readonly op: Token;
  readonly right: Expression;
  constructor(left: Expression, op: Token, right: Expression) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

// ============================================================================
// AST NODES : FONCTIONS & CLASSES
// ============================================================================

export class Func {
  readonly name?: string;
  readonly params: string[];
  readonly block: Block;
  readonly async: boolean;
  constructor(params: string[], block: Block, name?: string, async = false) {
    this.name = name;
    this.params = params;
    this.block = block;
    this.async = async;
  }
}

export class Lambda {
  readonly params: string[];
  readonly expr: Expression;
  readonly name?: string;
  readonly async: boolean;
  constructor(params: string[], expr: Expression, name?: string, async = false) {
    this.params = params;
    this.expr = expr;
    this.name = name;
    this.async = async;
  }
}

export class Instance {
  readonly name: string;
  readonly params?: DataType[];
  constructor(name: string, params?: DataType[]) {
    this.name = name;
    this.params = params;
  }
}

// ============================================================================
// AST NODES : STATEMENTS (INSTRUCTIONS)
// ============================================================================

export class Assign {
  readonly left: Var;
  readonly op: Token;
  readonly right: Expression;
  constructor(left: Var, op: Token, right: Expression) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

export class Update {
  readonly left: Var;
  readonly op: Token;
  readonly right: Expression;
  constructor(left: Var, op: Token, right: Expression) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

export class Console {
  readonly type: TokenType.LOG | TokenType.WARN | TokenType.ERROR | TokenType.ASSERT;
  readonly expr: Expression;
  constructor(type: TokenType.LOG | TokenType.WARN | TokenType.ERROR | TokenType.ASSERT, expr: Expression) {
    this.type = type;
    this.expr = expr;
  }
}

export class JS {
  readonly code: string;
  constructor(code: string) { this.code = code; }
}

export class Return {
  readonly value: Expression;
  constructor(value: Expression) { this.value = value; }
}

export class Await {
  readonly value: Expression;
  constructor(value: Expression) { this.value = value; }
}

export class Yield {
  readonly value: Expression;
  constructor(value: Expression) { this.value = value; }
}

export class Del {
  readonly value: Expression;
  constructor(value: Expression) { this.value = value; }
}

export class Raise {
  readonly value: Expression;
  constructor(value: Expression) { this.value = value; }
}

export class Continue {}
export class Break {}
export class NoOp {}

export class If {
  readonly if_block: [Expression, Block];
  elif_blocks?: [Expression, Block][];
  else_block?: Block;
  
  constructor(expr: Expression, block: Block, elif_blocks?: [Expression, Block][], else_block?: Block) {
    this.if_block = [expr, block];
    this.elif_blocks = elif_blocks;
    this.else_block = else_block;
  }
  add_elif(expr: Expression, block: Block): void {
    this.elif_blocks = [...(this.elif_blocks ?? []), [expr, block]];
  }
  add_else(block: Block): void {
    this.else_block = block;
  }
}

export class Try {
  readonly try_block: Block;
  except_blocks?: [string, Block, string | undefined][];
  finally_except_block?: Block;
  else_block?: Block;
  finally_block?: Block;

  constructor(block: Block) { this.try_block = block; }
  add_except(error: string, block: Block, alias?: string): void {
    this.except_blocks = [...(this.except_blocks ?? []), [error, block, alias]];
  }
  add_else(block: Block): void { this.else_block = block; }
  add_finally(block: Block): void { this.finally_block = block; }
  add_finally_except(block: Block): void { this.finally_except_block = block; }
}

export class While {
  readonly if_block: [Expression, Block];
  else_block?: Block;
  constructor(expr: Expression, block: Block, else_block?: Block) {
    this.if_block = [expr, block];
    this.else_block = else_block;
  }
  add_else(block: Block): void { this.else_block = block; }
}

export class For {
  readonly variables: string[];
  readonly iterable: Expression;
  readonly for_block: Block;
  else_block?: Block;
  constructor(variables: string[], iterable: Expression, for_block: Block, else_block?: Block) {
    this.variables = variables;
    this.iterable = iterable;
    this.for_block = for_block;
    this.else_block = else_block;
  }
  add_else(block: Block): void { this.else_block = block; }
}

export class With {
  readonly expr: Expression;
  readonly name: string;
  readonly block: Block;
  constructor(expr: Expression, name: string, block: Block) {
    this.expr = expr;
    this.name = name;
    this.block = block;
  }
}

export class Import {
  readonly urls: string[];
  constructor(urls: string[]) { this.urls = urls; }
}

export type Module = {
  url: string;
  default?: string;
  exports?: { [key: string]: string };
};

export class Load {
  readonly modules: Module[];
  constructor(modules: Module[]) { this.modules = modules; }
}

// ============================================================================
// AST NODES : STRUCTURES DE DONNÉES & STYLES
// ============================================================================

export class PropDecl {
  readonly name: string;
  readonly value: DataType; // CORRECTION : Accepte Str, Template, Num, etc.
  constructor(name: string, value: DataType) {
    this.name = name;
    this.value = value;
  }
}

export class StyleDecl {
  readonly selector: string;
  readonly children: Block;
  constructor(selector: string, children: Block) {
    this.selector = selector;
    this.children = children;
  }
}

export class Program {
  readonly block: Block;
  constructor(block: Block) { this.block = block; }
}

// ============================================================================
// UNIONS DE TYPES (LE CŒUR DE L'AST)
// ============================================================================

/**
 * Toute expression qui peut être évaluée et retourner une valeur.
 * (Utile pour les arguments de fonctions, les calculs, etc.)
 */
export type Expression =
  | Num | Str | Template | Bool | None | Var | List | Dict | Tuple | Params
  | Instance | Lambda | Await | Yield | BinOp | UnaryOp | NoOp;

/**
 * Alias de compatibilité (utilisé massivement dans ton Parser).
 */
export type DataType = Expression;

/**
 * Un Operand est une sous-catégorie d'Expression utilisée pour les opérations.
 * (On l'aligne sur Expression pour éviter les erreurs de typage).
 */
export type Operand = Expression;

/**
 * Toute instruction (statement) qui peut exister dans un bloc.
 */
export type Statement =
  | Assign | Update | Console | If | While | For | Try | With
  | Func | Return | Raise | Del | Break | Continue | Import | Load
  | Apply | Attr | JS | Expression;

/**
 * Un bloc de code contenant des instructions et des déclarations de style.
 */
export class Block {
  readonly statement_list: Statement[];
  readonly style_list: (StyleDecl | PropDecl | NoOp)[];
  
  constructor(statement_list: Statement[], style_list: (StyleDecl | PropDecl | NoOp)[]) {
    this.statement_list = statement_list;
    this.style_list = style_list;
  }
}