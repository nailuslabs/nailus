import { Parser } from './parser';
import { TokenType, BinOp, UnaryOp, Num, Var, Assign, NoOp } from './tokens';
import type { Operand } from './tokens';

type Scope = Record<string, unknown>;

export default class Interpreter {
  private readonly parser: Parser;
  private readonly globalScope: Scope = Object.create(null);

  constructor(parser: Parser) {
    this.parser = parser;
  }

  private error(msg = 'Interpreter Error'): never {
    throw new Error(msg);
  }

  interpret(): unknown {
    return this.visit(this.parser.parse());
  }

  private visit(node: Operand): unknown {
    switch (true) {
      case node instanceof Var:
        return this.visitVar(node);
      case node instanceof Assign:
        return this.visitAssign(node);
      case node instanceof Num:
        return this.visitNum(node);
      case node instanceof UnaryOp:
        return this.visitUnaryOp(node);
      case node instanceof BinOp:
        return this.visitBinOp(node);
      case node instanceof NoOp:
        return this.visitNoOp();
      default:
        return this.error(
          `Unknown node type: ${(node as { constructor?: { name?: string } }).constructor?.name ?? 'unknown'}`,
        );
    }
  }

  private visitNum(node: Num): number {
    return node.value;
  }

  private visitBinOp(node: BinOp): number {
    const left = this.visit(node.left);
    const right = this.visit(node.right);

    if (typeof left !== 'number' || typeof right !== 'number') {
      this.error(`BinOp requires numbers, got ${typeof left} and ${typeof right}`);
    }

    switch (node.op.type) {
      case TokenType.PLUS:
        return left + right;
      case TokenType.MINUS:
        return left - right;
      case TokenType.MUL:
        return left * right;
      case TokenType.DIV:
        return left / right;
      default:
        return this.error(`Unknown binary operator: ${node.op.type}`);
    }
  }

  private visitUnaryOp(node: UnaryOp): number {
    const value = this.visit(node.expr);

    if (typeof value !== 'number') {
      this.error(`UnaryOp requires a number, got ${typeof value}`);
    }

    switch (node.op.type) {
      case TokenType.PLUS:
        return value;
      case TokenType.MINUS:
        return -value;
      default:
        return this.error(`Unknown unary operator: ${node.op.type}`);
    }
  }

  private visitAssign(node: Assign): unknown {
    // On suppose que la cible est un Var — à adapter si d'autres
    // cibles (index, attribut, etc.) sont ajoutées plus tard.
    if (!(node.left instanceof Var)) {
      this.error('Invalid assignment target');
    }
    const value = this.visit(node.right);
    this.globalScope[node.left.value] = value;
    return value;
  }

  private visitVar(node: Var): unknown {
    const name = node.value;
    if (Object.prototype.hasOwnProperty.call(this.globalScope, name)) {
      return this.globalScope[name];
    }
    return this.error(`Unknown variable '${name}'`);
  }

  private visitNoOp(): void {
    // no-op
  }

  /** Réinitialise l'état de l'interpréteur (variables globales). */
  reset(): void {
    for (const key of Object.keys(this.globalScope)) {
      delete this.globalScope[key];
    }
  }
}