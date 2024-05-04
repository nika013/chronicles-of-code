import {Expression} from "../Expression";
import {ExpressionVisitor} from "../ExpressionVisitor/ExpressionVisitor";
import {LiteralType} from "../../../literalType.ts";

export class Literal extends Expression {
    value: LiteralType
    constructor(value: LiteralType) {
        super();
        this.value = value
    }

    accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visitLiteralExpr(this)
    }
}
