import {Expression} from "../Expression";
import {Token} from "../../Token";
// import {ExpressionVisitor} from "../ExpressionVisitor/ExpressionVisitor.ts";
// import {R} from "vite/dist/node/types.d-jgA8ss1A";

export class Binary extends Expression {
    constructor(left: Expression, operator: Token, right: Expression) {
        super();
        this.left = left
        this.operator = operator
        this.right = right
    }

    // accept<R>(visitor: ExpressionVisitor<R>):  {
    //     visitor.visitBinaryExpr(this)
    // }
}