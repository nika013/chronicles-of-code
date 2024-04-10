import {Expression} from "../Expression";
import {Token} from "../../../Token.ts";
import {ExpressionVisitor} from "../ExpressionVisitor/ExpressionVisitor";

export class Binary extends Expression {
    constructor(left: Expression, operator: Token, right: Expression) {
        super();
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visitBinaryExpr(this)
    }
}