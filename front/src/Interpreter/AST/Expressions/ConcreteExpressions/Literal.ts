import {Expression} from "../Expression";
import {ExpressionVisitor} from "../ExpressionVisitor/ExpressionVisitor";

export class Literal extends Expression {
    // value should be never but it goes red :(((
    value: never
    constructor(value: never) {
        super();
        this.value = value
    }

    accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visitLiteralExpr(this)
    }
}