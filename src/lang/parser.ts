import { Lexer } from './lexer';
import { 
  Token, TokenType, BinOp, UnaryOp, Num, Var, Assign, Update, Import, Load, 
  JS, NoOp, Str, Block, PropDecl, StyleDecl, Program, Template, Console, 
  Tuple, Params, List, Dict, Bool, None, Func, Lambda, Return, Yield, Raise, 
  Continue, Break, DataType, If, While, With, Try, Apply, Attr, Del, 
  Instance, Await, For 
} from './tokens';
import type { Operand, Module } from './tokens';

/**
 * Opérateurs unaires supportés.
 */
const UNARYOPS: TokenType[] = [TokenType.PLUS, TokenType.MINUS, TokenType.NO];

/**
 * Opérateurs binaires groupés par ordre de priorité croissante.
 */
const BINOPS: TokenType[][] = [
  [TokenType.MUL, TokenType.DIV, TokenType.MOD],
  [TokenType.PLUS, TokenType.MINUS],
  [TokenType.EQUAL, TokenType.NOTEQUAL, TokenType.GERATER, TokenType.GERATEREQUAL, TokenType.LESS, TokenType.LESSEQUAL],
  [TokenType.IN, TokenType.NOTIN],
  [TokenType.NOT],
  [TokenType.AND],
  [TokenType.OR],
];

export class Parser {
  private readonly lexer: Lexer;
  private current_token: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.current_token = lexer.get_next_token();
  }

  /**
   * parseExp
   */
  public parseExp(): DataType {
    return this.exp();
  }

  // =========================================================================
  // MÉTHODES UTILITAIRES
  // =========================================================================

  private error(msg?: string): never {
    const detail = msg ?? `Unexpected token ${this.current_token.type} (value: ${this.current_token.value})`;
    throw new Error(`[Parser Error] ${detail}`);
  }

  /**
   * Consomme le token courant s'il correspond au type attendu.
   */
  private eat(token_type: TokenType): Token {
    if (this.current_token.type !== token_type) {
      this.error(`Expected ${token_type}, but got ${this.current_token.type}`);
    }
    const consumed = this.current_token;
    this.current_token = this.lexer.get_next_token();
    return consumed;
  }

  /**
   * Vérifie le type du token courant SANS déclencher le resserrement de type de TypeScript (Type Narrowing).
   * CORRECTION TS2367 : Le "as TokenType" force TypeScript à comparer le type générique 
   * et non le type littéral auquel il s'attendait après un "eat()".
   */
  private check(type: TokenType): boolean {
    return (this.current_token.type as TokenType) === type;
  }

  /**
   * Regarde le prochain token sans le consommer.
   */
  private peek(): Token {
    return this.lexer.peek_next_token();
  }

  // =========================================================================
  // EXPRESSIONS ET DONNÉES (DATA)
  // =========================================================================

  private list(): List {
    const values: Operand[] = [];
    this.eat(TokenType.LSQUARE);
    while (!this.check(TokenType.RSQUARE)) {
      values.push(this.expr());
      if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.RSQUARE);
    return new List(values);
  }

  private tuple(): DataType {
    const values: DataType[] = [];
    this.eat(TokenType.LPAREN);

    if (this.check(TokenType.RPAREN)) {
      this.eat(TokenType.RPAREN);
      return new Tuple(values);
    }

    const first = this.expr();

    if (this.check(TokenType.RPAREN)) {
      this.eat(TokenType.RPAREN);
      return first;
    }

    values.push(first);
    while (this.check(TokenType.COMMA)) {
      this.eat(TokenType.COMMA);
      if (this.check(TokenType.RPAREN)) break;
      values.push(this.expr());
    }
    this.eat(TokenType.RPAREN);

    if (this.check(TokenType.ARROW)) {
      this.eat(TokenType.ARROW);
      const params = values.map((v) => {
        if (v instanceof Var) return v.value as string;
        this.error('Lambda parameters must be identifiers');
      });
      if (this.check(TokenType.LCURLY)) {
        this.eat(TokenType.LCURLY);
        const block = this.block();
        this.eat(TokenType.RCURLY);
        return new Func(params, block);
      }
      return new Lambda(params, this.expr());
    }
    return new Tuple(values);
  }

  private dict(): Dict {
    const pairs: [string | number, DataType][] = [];
    this.eat(TokenType.LCURLY);
    while (!this.check(TokenType.RCURLY)) {
      const token = this.current_token;
      if (token.type !== TokenType.NUMBER && token.type !== TokenType.STRING) {
        this.error('Dict keys must be NUMBER or STRING');
      }
      if (token.value === undefined) this.error('Dict key has no value');
      this.eat(token.type);
      this.eat(TokenType.COLON);
      pairs.push([token.value as string | number, this.expr()]);
      if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.RCURLY);
    return new Dict(pairs);
  }

  private instance(): Instance {
    this.eat(TokenType.NEW);
    const name = this.eat(TokenType.ID).value as string;
    const params: DataType[] = [];
    if (this.check(TokenType.LPAREN)) {
      this.eat(TokenType.LPAREN);
      while (!this.check(TokenType.RPAREN)) {
        params.push(this.expr());
        if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
      }
      this.eat(TokenType.RPAREN);
    }
    return new Instance(name, params);
  }

  private data(): DataType {
    const token = this.current_token;
    switch (token.type) {
      case TokenType.NUMBER:
        this.eat(TokenType.NUMBER);
        return new Num(token);
      case TokenType.TRUE:
        this.eat(TokenType.TRUE);
        return new Bool(true);
      case TokenType.FALSE:
        this.eat(TokenType.FALSE);
        return new Bool(false);
      case TokenType.NONE:
        this.eat(TokenType.NONE);
        return new None();
      case TokenType.LPAREN:
        return this.tuple();
      case TokenType.STRING:
        this.eat(TokenType.STRING);
        return new Str(token);
      case TokenType.TEMPLATE:
        this.eat(TokenType.TEMPLATE);
        return new Template(token);
      case TokenType.LSQUARE:
        return this.list();
      case TokenType.LCURLY:
        return this.dict();
      case TokenType.NEW:
        return this.instance();
      case TokenType.AWAIT:
        this.eat(TokenType.AWAIT);
        return new Await(this.expr());
      case TokenType.ID: {
        this.eat(TokenType.ID);
        if (this.check(TokenType.ARROW)) {
          this.eat(TokenType.ARROW);
          if (token.value === undefined) this.error('Lambda parameter has no value');
          return new Lambda([token.value as string], this.expr());
        }
        return new Var(token);
      }
      default:
        this.error(`Unexpected token in data expression: ${token.type}`);
    }
  }

  private sub(): DataType {
    let node = this.data();
    while ([TokenType.LSQUARE, TokenType.DOT, TokenType.LPAREN].includes(this.current_token.type as TokenType)) {
      const token = this.current_token;
      if (this.check(TokenType.LSQUARE)) {
        this.eat(TokenType.LSQUARE);
        const index = this.expr();
        this.eat(TokenType.RSQUARE);
        node = new BinOp(node, token, index);
      } else if (this.check(TokenType.LPAREN)) {
        this.eat(TokenType.LPAREN);
        const params: DataType[] = [];
        while (!this.check(TokenType.RPAREN)) {
          params.push(this.expr());
          if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
        }
        this.eat(TokenType.RPAREN);
        node = new BinOp(node, token, new Params(params));
      } else {
        this.eat(TokenType.DOT);
        const id = this.eat(TokenType.ID);
        node = new BinOp(node, token, new Var(id));
      }
    }
    return node;
  }

  private exp(): DataType {
    let node = this.sub();
    while (this.check(TokenType.EXP)) {
      const token = this.eat(TokenType.EXP);
      node = new BinOp(node, token, this.sub());
    }
    return node;
  }

  private unary(): DataType {
    if (UNARYOPS.includes(this.current_token.type as TokenType)) {
      const token = this.eat(this.current_token.type);
      return new UnaryOp(token, this.unary());
    }
    return this.exp();
  }

  private binop(index: number): Operand {
    if (index === 4 && this.check(TokenType.NOT)) {
      const token = this.eat(TokenType.NOT);
      return new UnaryOp(token, this.binop(3));
    }
    let node: Operand = index === 0 ? this.unary() : this.binop(index - 1);
    while (BINOPS[index].includes(this.current_token.type as TokenType)) {
      const token = this.eat(this.current_token.type);
      const right = index === 0 ? this.unary() : this.binop(index - 1);
      node = new BinOp(node, token, right);
    }
    return node;
  }

  private expr(): DataType {
    return this.binop(BINOPS.length - 1) as DataType;
  }

  private exprs(): DataType {
    let node = this.expr();
    while (this.check(TokenType.COMMA)) {
      const token = this.eat(TokenType.COMMA);
      node = new BinOp(node, token, this.exprs());
    }
    return node;
  }

  // =========================================================================
  // STATEMENTS (INSTRUCTIONS)
  // =========================================================================

  private empty(): NoOp {
    return new NoOp();
  }

  private console_statement(type: TokenType.LOG | TokenType.WARN | TokenType.ERROR | TokenType.ASSERT): Console {
    this.eat(type);
    const expr = this.exprs();
    return new Console(type, expr);
  }

  private assignment_statement(): Assign {
    this.eat(TokenType.VAR);
    const id = this.eat(TokenType.ID);
    const op = this.eat(TokenType.ASSIGN);
    const right = this.exprs();
    return new Assign(new Var(id), op, right);
  }

  private update_statement(): Update {
    const id = this.eat(TokenType.ID);
    const op = this.eat(TokenType.ASSIGN);
    const right = this.exprs();
    return new Update(new Var(id), op, right);
  }

  private javascript_statement(): JS {
    const token = this.eat(TokenType.JS);
    return new JS(token.value as string);
  }

  private function_statement(async = false): Func | Lambda {
    let name: string | undefined;
    if (async) this.eat(TokenType.ASYNC);
    this.eat(TokenType.FUNC);
    
    if (this.check(TokenType.ID)) {
      name = this.eat(TokenType.ID).value as string;
    }
    this.eat(TokenType.LPAREN);
    
    const params: string[] = [];
    while (!this.check(TokenType.RPAREN)) {
      params.push(this.eat(TokenType.ID).value as string);
      if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.RPAREN);

    if (this.check(TokenType.ARROW)) {
      this.eat(TokenType.ARROW);
      return new Lambda(params, this.expr(), name, async);
    }
    
    if (this.check(TokenType.LCURLY)) {
      this.eat(TokenType.LCURLY);
      const block = this.block();
      this.eat(TokenType.RCURLY);
      return new Func(params, block, name, async);
    }
    
    return this.error('Expected "=>" or "{" after function params');
  }

  private if_statement(): If {
    this.eat(TokenType.IF);
    const cond = this.expr();
    this.eat(TokenType.LCURLY);
    const node = new If(cond, this.block());
    this.eat(TokenType.RCURLY);

    while (this.check(TokenType.ELIF)) {
      this.eat(TokenType.ELIF);
      const cond = this.expr();
      this.eat(TokenType.LCURLY);
      node.add_elif(cond, this.block());
      this.eat(TokenType.RCURLY);
    }
    
    if (this.check(TokenType.ELSE)) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      node.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    return node;
  }

  private try_statement(): Try {
    this.eat(TokenType.TRY);
    this.eat(TokenType.LCURLY);
    const node = new Try(this.block());
    this.eat(TokenType.RCURLY);

    while (this.check(TokenType.EXCEPT)) {
      this.eat(TokenType.EXCEPT);
      
      if (this.check(TokenType.LCURLY)) {
        this.eat(TokenType.LCURLY);
        node.add_finally_except(this.block());
        this.eat(TokenType.RCURLY);
        break;
      }
      
      const error_name = this.eat(TokenType.ID).value as string;
      let alias: string | undefined;
      
      if (this.check(TokenType.AS)) {
        this.eat(TokenType.AS);
        alias = this.eat(TokenType.ID).value as string;
      }
      
      this.eat(TokenType.LCURLY);
      node.add_except(error_name, this.block(), alias);
      this.eat(TokenType.RCURLY);
    }
    
    if (this.check(TokenType.ELSE)) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      node.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    
    if (this.check(TokenType.FINALLY)) {
      this.eat(TokenType.FINALLY);
      this.eat(TokenType.LCURLY);
      node.add_finally(this.block());
      this.eat(TokenType.RCURLY);
    }
    
    return node;
  }

  private while_statement(): While {
    this.eat(TokenType.WHILE);
    const cond = this.expr();
    this.eat(TokenType.LCURLY);
    const node = new While(cond, this.block());
    this.eat(TokenType.RCURLY);

    if (this.check(TokenType.ELSE)) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      node.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    return node;
  }

  private for_statement(): For {
    this.eat(TokenType.FOR);
    const variables: string[] = [];
    while (this.check(TokenType.ID)) {
      variables.push(this.eat(TokenType.ID).value as string);
      if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.IN);
    
    const iterable = this.expr();
    this.eat(TokenType.LCURLY);
    const node = new For(variables, iterable, this.block());
    this.eat(TokenType.RCURLY);
    
    if (this.check(TokenType.ELSE)) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      node.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    return node;
  }

  private with_statement(): With {
    this.eat(TokenType.WITH);
    const expr = this.expr();
    this.eat(TokenType.AS);
    const name = this.eat(TokenType.ID).value as string;
    this.eat(TokenType.LCURLY);
    const block = this.block();
    this.eat(TokenType.RCURLY);
    return new With(expr, name, block);
  }

  private import_statement(): Import {
    this.eat(TokenType.IMPORT);
    const urls: string[] = [];
    while (this.check(TokenType.STRING)) {
      urls.push(this.eat(TokenType.STRING).value as string);
      if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
    }
    return new Import(urls);
  }

  private import_path(): string {
    this.eat(TokenType.FROM);
    return this.eat(TokenType.STRING).value as string;
  }

  private import_all(): Module {
    this.eat(TokenType.MUL);
    if (this.check(TokenType.FROM)) {
      return { url: this.import_path(), exports: { '*': '*' } };
    }
    if (this.check(TokenType.AS)) {
      this.eat(TokenType.AS);
      const name = this.eat(TokenType.ID).value as string;
      return { url: this.import_path(), exports: { [name]: '*' } };
    }
    return this.error('Expected "from" or "as" after "*"');
  }

  private import_exports(): Module {
    const exportsMap: Record<string, string> = {};
    this.eat(TokenType.LCURLY);
    
    while (!this.check(TokenType.RCURLY)) {
      const local = this.eat(TokenType.ID).value as string;
      if (this.check(TokenType.AS)) {
        this.eat(TokenType.AS);
        const exported = this.eat(TokenType.ID).value as string;
        exportsMap[local] = exported;
      } else {
        exportsMap[local] = local;
      }
      if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
    }
    
    this.eat(TokenType.RCURLY);
    return { url: this.import_path(), exports: exportsMap };
  }

  private import_default(): Module {
    const defaultExport = this.eat(TokenType.ID).value as string;
    
    if (this.check(TokenType.FROM)) {
      return { url: this.import_path(), default: defaultExport };
    }
    
    this.eat(TokenType.COMMA);
    if (this.check(TokenType.LCURLY)) {
      return { default: defaultExport, ...this.import_exports() };
    }
    if (this.check(TokenType.MUL)) {
      return { default: defaultExport, ...this.import_all() };
    }
    
    return this.error('Expected "from", "{", or "*" after default import');
  }

  private load_statement(): Load {
    const modules: Module[] = [];
    this.eat(TokenType.LOAD);
    
    switch (this.current_token.type) {
      case TokenType.STRING:
        while (this.check(TokenType.STRING)) {
          modules.push({ url: this.eat(TokenType.STRING).value as string });
          if (this.check(TokenType.COMMA)) this.eat(TokenType.COMMA);
        }
        break;
      case TokenType.LCURLY:
        modules.push(this.import_exports());
        break;
      case TokenType.MUL:
        modules.push(this.import_all());
        break;
      case TokenType.ID:
        modules.push(this.import_default());
        break;
      default:
        this.error('Invalid @load syntax');
    }
    
    return new Load(modules);
  }

  private statement(): Operand {
    switch (this.current_token.type) {
      case TokenType.VAR:
        return this.assignment_statement();
      case TokenType.FUNC:
        return this.function_statement(false);
      case TokenType.ASYNC:
        return this.function_statement(true);
      case TokenType.RETURN:
        this.eat(TokenType.RETURN);
        return new Return(this.expr());
      case TokenType.APPLY: {
        const token = this.eat(TokenType.APPLY);
        return new Apply(token.value as string);
      }
      case TokenType.ATTR: {
        const token = this.eat(TokenType.ATTR);
        return new Attr(token.meta as string, token.value as string);
      }
      case TokenType.YIELD:
        this.eat(TokenType.YIELD);
        return new Yield(this.expr());
      case TokenType.RAISE:
        this.eat(TokenType.RAISE);
        return new Raise(this.expr());
      case TokenType.DEL:
        this.eat(TokenType.DEL);
        return new Del(this.expr());
      case TokenType.CONTINUE:
        this.eat(TokenType.CONTINUE);
        return new Continue();
      case TokenType.BREAK:
        this.eat(TokenType.BREAK);
        return new Break();
      case TokenType.IMPORT:
        return this.import_statement();
      case TokenType.LOAD:
        return this.load_statement();
      case TokenType.LOG:
        return this.console_statement(TokenType.LOG);
      case TokenType.WARN:
        return this.console_statement(TokenType.WARN);
      case TokenType.ERROR:
        return this.console_statement(TokenType.ERROR);
      case TokenType.ASSERT:
        return this.console_statement(TokenType.ASSERT);
      case TokenType.IF:
        return this.if_statement();
      case TokenType.WHILE:
        return this.while_statement();
      case TokenType.FOR:
        return this.for_statement();
      case TokenType.WITH:
        return this.with_statement();
      case TokenType.TRY:
        return this.try_statement();
      case TokenType.JS:
        return this.javascript_statement();
      case TokenType.LPAREN:
      case TokenType.LCURLY:
      case TokenType.LSQUARE:
        return this.exprs();
      case TokenType.ID: {
        const next = this.peek().type;
        if (next === TokenType.ASSIGN) return this.update_statement();
        if (next === TokenType.LCURLY || next === TokenType.STRING || next === TokenType.TEMPLATE) {
          return this.empty();
        }
        return this.exprs();
      }
      default:
        return this.empty();
    }
  }

  private statement_list(): Operand[] {
    const results: Operand[] = [this.statement()];
    
    while (this.check(TokenType.SEMI)) {
      this.eat(TokenType.SEMI);
      results.push(this.statement());
    }
    
    if (this.check(TokenType.VAR)) {
      this.error('Missing ";" before "@var"');
    }
    
    return results;
  }

  private style_declaration(): StyleDecl | PropDecl | NoOp {
    if (!this.check(TokenType.ID)) return this.empty();

    const name = this.current_token.value?.toString() ?? '';
    this.eat(TokenType.ID);
    const next = this.current_token;

    if (next.type === TokenType.LCURLY) {
      this.eat(TokenType.LCURLY);
      const node = new StyleDecl(name, this.block());
      this.eat(TokenType.RCURLY);
      return node;
    }
    
    if (next.type === TokenType.STRING) {
      const tok = this.eat(TokenType.STRING);
      this.eat(TokenType.SEMI);
      return new PropDecl(name, new Str(tok));
    }
    
    if (next.type === TokenType.TEMPLATE) {
      const tok = this.eat(TokenType.TEMPLATE);
      this.eat(TokenType.SEMI);
      return new PropDecl(name, new Template(tok));
    }
    
    return this.error(`Unexpected token after identifier "${name}"`);
  }

  private style_list(): (StyleDecl | PropDecl | NoOp)[] {
    const results: (StyleDecl | PropDecl | NoOp)[] = [];
    while (this.check(TokenType.ID)) {
      results.push(this.style_declaration());
    }
    return results;
  }

  private block(): Block {
    return new Block(this.statement_list(), this.style_list());
  }

  private program(): Program {
    return new Program(this.block());
  }

  public parse(): Program {
    const node = this.program();
    if (!this.check(TokenType.EOF)) {
      this.error('Unexpected tokens remaining after end of program');
    }
    return node;
  }
}