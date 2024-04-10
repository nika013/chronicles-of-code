import {Expression} from "../Expression";
import {Token} from "../../../Token.ts";
import {ExpressionVisitor} from "../ExpressionVisitor/ExpressionVisitor";

export class Unary extends Expression {
    operator: Token
    right: Expression
    
    constructor(operator: Token, right: Expression) {
        super();
        this.operator = operator
        this.right = right
    }

    accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visitUnaryExpr(this)
    }
}