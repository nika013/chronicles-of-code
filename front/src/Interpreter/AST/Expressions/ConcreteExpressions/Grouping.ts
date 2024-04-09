import {Expression} from "../Expression";
import {ExpressionVisitor} from "../ExpressionVisitor/ExpressionVisitor.ts";

export class Grouping extends Expression {
    expression: Expression
    constructor(expression: Expression) {
        super();
        this.expression = expression
    }

    accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }
}