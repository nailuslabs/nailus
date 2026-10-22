import { Lexer } from './lexer';
import { Parser } from './parser';
import { connect } from './utils';
import { 
  TokenType, BinOp, UnaryOp, Num, Var, Assign, Update, Import, Load, JS, 
  NoOp, Str, Template, Program, Block, PropDecl, StyleDecl, Console, List, 
  Tuple, Params, Dict, Bool, None, Func, Lambda, Return, Yield, Raise, 
  Continue, Break, If, While, With, Try, Apply, Attr, Del, Instance, Await, For 
} from './tokens';
import type { Statement, Expression } from './tokens';

/**
 * Le Transformer (ou Générateur de code) parcourt l'AST généré par le Parser
 * et produit le code JavaScript équivalent sous forme de chaîne de caractères.
 */
export default class Transformer {
  private readonly parser: Parser;
  private code: string[] = [];

  constructor(parser: Parser) {
    this.parser = parser;
  }

  /**
   * Lève une erreur de transformation.
   */
  private error(msg = 'Transformer Error'): never {
    throw new Error(`[Transformer Error] ${msg}`);
  }

  /**
   * Point d'entrée pour visiter un nœud. Redirige vers la bonne méthode `visit_*`.
   * NOTE : Le retour est typé `any` car les littéraux renvoient des primitives 
   * (number, boolean) tandis que les structures renvoient du code (string).
   * La méthode `stringify` s'assure que tout finit en string.
   */
  private visit(node: Statement | Expression | null | undefined): any {
    if (!node) return '';
    if (node instanceof Program) return this.visit_Program(node);
    if (node instanceof Block) return this.visit_Block(node);
    if (node instanceof PropDecl) return this.visit_PropDecl(node);
    if (node instanceof StyleDecl) return this.visit_StyleDecl(node);
    if (node instanceof Var) return this.visit_Var(node);
    if (node instanceof Load) return this.visit_Load(node);
    if (node instanceof Import) return this.visit_Import(node);
    if (node instanceof Assign) return this.visit_Assign(node);
    if (node instanceof Update) return this.visit_Update(node);
    if (node instanceof Apply) return this.visit_Apply(node);
    if (node instanceof Attr) return this.visit_Attr(node);
    if (node instanceof JS) return this.visit_JS(node);
    if (node instanceof Console) return this.visit_Console(node);
    if (node instanceof Func) return this.visit_Func(node);
    if (node instanceof Lambda) return this.visit_Lambda(node);
    if (node instanceof Return) return this.visit_Return(node);
    if (node instanceof Yield) return this.visit_Yield(node);
    if (node instanceof Del) return this.visit_Del(node);
    if (node instanceof Raise) return this.visit_Raise(node);
    if (node instanceof Continue) return this.visit_Continue();
    if (node instanceof Break) return this.visit_Break();
    if (node instanceof Str) return this.visit_Str(node);
    if (node instanceof If) return this.visit_If(node);
    if (node instanceof For) return this.visit_For(node);
    if (node instanceof Try) return this.visit_Try(node);
    if (node instanceof While) return this.visit_While(node);
    if (node instanceof With) return this.visit_With(node);
    if (node instanceof Template) return this.visit_Template(node);
    if (node instanceof Num) return this.visit_Num(node);
    if (node instanceof Bool) return this.visit_Boolean(node);
    if (node instanceof Await) return this.visit_Await(node);
    if (node instanceof None) return this.visit_None();
    if (node instanceof List) return this.visit_List(node);
    if (node instanceof Instance) return this.visit_Instance(node);
    if (node instanceof Tuple) return this.visit_Tuple(node);
    if (node instanceof Params) return this.visit_Params(node);
    if (node instanceof Dict) return this.visit_Dict(node);
    if (node instanceof UnaryOp) return this.visit_UnaryOp(node);
    if (node instanceof BinOp) return this.visit_BinOp(node);
    if (node instanceof NoOp) return this.visit_NoOp();
    
    this.error(`Unknown node type: ${(node as any).constructor.name}`);
  }

  /**
   * Force la conversion du résultat d'un `visit` en chaîne de caractères.
   * Utile pour les littéraux (Num renvoie un number, Bool renvoie un boolean).
   */
  private stringify(node: Statement | Expression): string {
    const result = this.visit(node);
    return String(result);
  }

  // =========================================================================
  // LITTERALS & PRIMITIVES
  // =========================================================================

  private visit_Num(node: Num): number {
    return node.value;
  }

  private visit_Boolean(node: Bool): boolean {
    return node.value;
  }

  private visit_None(): string {
    // En JS, l'équivalent de Python's None est null (ou undefined)
    return 'null';
  }

  private visit_Str(node: Str): string {
    return `"${node.value}"`;
  }

  private visit_JS(node: JS): string {
    return node.code;
  }

  // =========================================================================
  // COLLECTIONS
  // =========================================================================

  private visit_List(node: List): string {
    return `[${node.values.map(i => this.stringify(i)).join(', ')}]`;
  }

  private visit_Tuple(node: Tuple): string {
    // En JS, on simule les tuples avec des tableaux
    return `[${node.values.map(i => this.stringify(i)).join(', ')}]`;
  }

  private visit_Params(node: Params): string {
    return node.values.map(i => this.stringify(i)).join(', ');
  }

  private visit_Dict(node: Dict): string {
    const output: string[] = [];
    for (const [key, value] of node.pairs) {
      const keyStr = typeof key === 'number' ? key : `"${key}"`;
      output.push(`${keyStr}: ${this.stringify(value)}`);
    }
    return `{\n  ${output.join(',\n  ')}\n}`;
  }

  // =========================================================================
  // VARIABLES & OPÉRATIONS
  // =========================================================================

  private visit_Var(node: Var): string {
    return node.value;
  }

  private visit_Assign(node: Assign): string {
    return `let ${node.left.value} = ${this.stringify(node.right)}`;
  }

  private visit_Update(node: Update): string {
    return `${node.left.value} = ${this.stringify(node.right)}`;
  }

  private visit_Apply(node: Apply): string {
    return `__interpret__(${this.stringify(node.value)})`;
  }

  private visit_Attr(node: Attr): string {
    return `__attributify__("${node.attr}", ${this.stringify(node.value)})`;
  }

  private visit_BinOp(node: BinOp): string {
    const left = this.stringify(node.left);
    const right = this.stringify(node.right);

    switch (node.op.type) {
      case TokenType.PLUS: return `__add__(${left}, ${right})`;
      case TokenType.MINUS: return `__minus__(${left}, ${right})`;
      case TokenType.MUL: return `__mul__(${left}, ${right})`;
      case TokenType.DIV: return `__div__(${left}, ${right})`;
      case TokenType.MOD: return `__mod__(${left}, ${right})`;
      case TokenType.EXP: return `__exp__(${left}, ${right})`;
      case TokenType.EQUAL: return `${left} === ${right}`;
      case TokenType.NOTEQUAL: return `${left} !== ${right}`;
      case TokenType.GERATER: return `${left} > ${right}`;
      case TokenType.GERATEREQUAL: return `${left} >= ${right}`;
      case TokenType.LESS: return `${left} < ${right}`;
      case TokenType.LESSEQUAL: return `${left} <= ${right}`;
      case TokenType.OR: return `${left} || ${right}`;
      case TokenType.AND: return `${left} && ${right}`;
      case TokenType.IN: return `__in__(${left}, ${right})`;
      case TokenType.NOTIN: return `!(__in__(${left}, ${right}))`;
      case TokenType.LPAREN: return `${left}(${right})`;
      case TokenType.LSQUARE: return `${left}[${right}]`;
      case TokenType.DOT: return `${left}.${right}`;
      case TokenType.COMMA: return `${left}, ${right}`;
    }
    this.error(`Unknown binary operator: ${node.op.type}`);
  }

  private visit_UnaryOp(node: UnaryOp): string {
    const value = this.stringify(node.expr);
    switch (node.op.type) {
      case TokenType.PLUS: return `__positive__(${value})`;
      case TokenType.MINUS: return `__negative__(${value})`;
      case TokenType.NO:
      case TokenType.NOT: return `!(${value})`;
    }
    this.error(`Unknown unary operator: ${node.op.type}`);
  }

  // =========================================================================
  // FONCTIONS & CLASSES
  // =========================================================================

  private visit_Func(node: Func): string {
    const asyncKw = node.async ? 'async ' : '';
    const body = connect(this.visit_Block(node.block));
    
    if (node.name) {
      return `${asyncKw}function ${node.name}(${node.params.join(', ')}) {\n${body}\n}`;
    }
    return `(${asyncKw}function (${node.params.join(', ')}) {\n${body}\n})`;
  }

  private visit_Lambda(node: Lambda): string {
    const asyncKw = node.async ? 'async ' : '';
    const params = node.params.join(', ');
    const expr = this.stringify(node.expr);
    
    if (node.name) {
      return `const ${node.name} = ${asyncKw}(${params}) => ${expr}`;
    }
    return `(${asyncKw}(${params}) => ${expr})`;
  }

  private visit_Instance(node: Instance): string {
    const params = node.params ? `(${node.params.map(i => this.stringify(i)).join(', ')})` : '';
    return `new ${node.name}${params}`;
  }

  // =========================================================================
  // STRUCTURES DE CONTRÔLE
  // =========================================================================

  private visit_If(node: If): string {
    const cond = this.stringify(node.if_block[0]);
    const body = connect(this.visit_Block(node.if_block[1]));
    
    let state = `if (${cond}) {\n${body}\n}`;
    
    if (node.elif_blocks) {
      for (const [elifCond, elifBlock] of node.elif_blocks) {
        state += ` else if (${this.stringify(elifCond)}) {\n${connect(this.visit_Block(elifBlock))}\n}`;
      }
    }
    
    if (node.else_block) {
      state += ` else {\n${connect(this.visit_Block(node.else_block))}\n}`;
    }
    
    return state;
  }

  private visit_For(node: For): string {
    const vars = node.variables.length === 1 ? node.variables[0] : `[${node.variables.join(', ')}]`;
    const iterable = this.stringify(node.iterable);
    const body = connect(this.visit_Block(node.for_block));
    
    // NOTE : Le `else` d'une boucle Python s'exécute seulement si aucun `break` n'est survenu.
    // Ici, on simule cela avec une variable booléenne (si le parser gère les breaks correctement).
    // Pour rester compatible avec ton implémentation d'origine, on utilise la structure actuelle.
    let state = `for (let ${vars} of ${iterable}) {\n${body}\n}`;
    
    if (node.else_block) {
      // Simulation approximative d'un for-else : on l'exécute après la boucle.
      state += `;\nif (true) {\n${connect(this.visit_Block(node.else_block))}\n}`;
    }
    
    return state;
  }

  private visit_While(node: While): string {
    const cond = this.stringify(node.if_block[0]);
    const body = connect(this.visit_Block(node.if_block[1]));
    
    let state = `while (${cond}) {\n${body}\n}`;
    
    if (node.else_block) {
      // Même remarque que pour le For
      state += `;\nif (!(${cond})) {\n${connect(this.visit_Block(node.else_block))}\n}`;
    }
    
    return state;
  }

  private visit_Try(node: Try): string {
    const tryBody = connect([
      ...this.visit_Block(node.try_block), 
      ...(node.else_block ? this.visit_Block(node.else_block) : [])
    ]);
    let state = `try {\n${tryBody}\n}`;

    let excepts: string[] | undefined;
    if (node.except_blocks) {
      excepts = node.except_blocks.map(([expr, block, alias], index) => {
        const kw = index === 0 ? 'if' : 'else if';
        const condition = expr === 'Exception' ? '' : ` (e instanceof ${expr})`;
        const aliasCode = alias ? `let ${alias} = e;\n  ` : '';
        return `${kw}${condition} {\n  ${aliasCode}${connect(this.visit_Block(block))}\n}`;
      });
    }

    if (node.finally_except_block) {
      if (excepts) {
        excepts.push(`else {\n  ${connect(this.visit_Block(node.finally_except_block))}\n}`);
      } else {
        excepts = [`  ${connect(this.visit_Block(node.finally_except_block))}`];
      }
    }

    if (excepts) {
      state += ` catch(e) {\n  ${excepts.join(' ')}\n}`;
    }
    
    if (node.finally_block) {
      state += ` finally {\n${connect(this.visit_Block(node.finally_block))}\n}`;
    }
    
    return state;
  }

  private visit_With(node: With): string {
    return `(() => {\n  let ${node.name} = ${this.stringify(node.expr)};\n  ${connect(this.visit_Block(node.block))}\n})()`;
  }

  // =========================================================================
  // INSTRUCTIONS DIVERSES
  // =========================================================================

  private visit_Return(node: Return): string {
    return `return ${this.stringify(node.value)}`;
  }

  private visit_Await(node: Await): string {
    return `await ${this.stringify(node.value)}`;
  }

  private visit_Yield(node: Yield): string {
    return `yield ${this.stringify(node.value)}`;
  }

  private visit_Del(node: Del): string {
    return `delete ${this.stringify(node.value)}`;
  }

  private visit_Raise(node: Raise): string {
    return `throw ${this.stringify(node.value)}`;
  }

  private visit_Continue(): string {
    return 'continue';
  }

  private visit_Break(): string {
    return 'break';
  }

  private visit_Console(node: Console): string {
    const expr = this.stringify(node.expr);
    switch (node.type) {
      case TokenType.LOG: return `console.log(${expr})`;
      case TokenType.WARN: return `console.warn(${expr})`;
      case TokenType.ERROR: return `console.error(${expr})`;
      case TokenType.ASSERT: return `console.assert(${expr})`;
    }
    this.error(`Unknown console method: ${node.type}`);
  }

  // =========================================================================
  // TEMPLATES & IMPORTS
  // =========================================================================

  private visit_Template(node: Template): string {
    const value = node.value;
    const len = value.length;
    let index = 0;
    const output: string[] = [];

    while (index < len) {
      const char = value.charAt(index);
      if (char === '$' && value.charAt(index + 1) === '{') {
        index += 2;
        let exp = '';
        
        // CORRECTION : Ajout de la vérification `index < len` pour éviter le dépassement de tableau
        while (index < len && (value.charAt(index) !== '}' || value.charAt(index - 1) === '\\')) {
          exp += value.charAt(index);
          index++;
        }
        
        // Parse l'expression interne et la génère
        const parsedExpr = new Parser(new Lexer(exp)).parseExp();
        output.push(`\${${this.stringify(parsedExpr)}}`);
        index++; // Saute le '}'
      } else {
        output.push(char);
        index++;
      }
    }
    return `\`${output.join('')}\``;
  }

  private visit_Import(node: Import): string {
    return node.urls.map(i => `__import__("${i}")`).join(';\n');
  }

  private visit_Load(node: Load): string {
    const make_exports = (exports: Record<string, string>): string => {
      const output: string[] = [];
      for (const [key, value] of Object.entries(exports)) {
        output.push(key === value ? key : `${value} as ${key}`);
      }
      const items = output.join(', ');
      return items.startsWith('*') ? items : `{ ${items} }`;
    };

    return node.modules.map(i => {
      if (i.default && i.exports) return `import ${i.default}, ${make_exports(i.exports)} from "${i.url}"`;
      if (i.default) return `import ${i.default} from "${i.url}"`; // Correction : guillemet manquant
      if (i.exports) return `import ${make_exports(i.exports)} from "${i.url}"`;
      return `import "${i.url}"`;
    }).join(';\n');
  }

  // =========================================================================
  // STYLES & BLOCS
  // =========================================================================

  private visit_PropDecl(node: PropDecl): string {
    return `new Property("${node.name}", ${this.stringify(node.value)})`;
  }

  private visit_StyleDecl(node: StyleDecl): string {
    const output: string[] = [];
    output.push(`(() => {`);
    output.push(`  const style = new Style("${node.selector}");`);

    // Traitement des instructions à l'intérieur du bloc style
    node.children.statement_list.forEach(i => {
      if (!(i instanceof NoOp)) {
        output.push(`  ${this.stringify(i)};`);
      }
    });

    // Traitement des propriétés de style
    node.children.style_list.forEach(i => {
      const styleCode = this.visit(i);
      if (styleCode) {
        // CORRECTION : On utilise "styleCode" au lieu d'écraser la variable "style"
        output.push(`  style.add(${styleCode});`);
      }
    });

    output.push(`  return style;`);
    output.push(`})()`);
    
    return output.join('\n');
  }

  // =========================================================================
  // BLOCS & PROGRAMME
  // =========================================================================

  private visit_Block(node: Block): string[] {
    const output: string[] = [];
    
    // On visite d'abord les instructions, puis les styles
    const nodes = [...node.statement_list, ...node.style_list];
    for (const n of nodes) {
      const result = this.visit(n);
      if (result !== undefined && result !== '') {
        output.push(String(result));
      }
    }
    
    return output;
  }

  private visit_Program(node: Program): void {
    this.code = this.visit_Block(node.block);
  }

  private visit_NoOp(): void {
    return;
  }

  /**
   * Lance la transformation et retourne le code JavaScript final.
   */
  public transform(): string {
    this.visit(this.parser.parse());
    return connect(this.code);
  }
}