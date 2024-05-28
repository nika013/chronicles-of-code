import {Expression} from "../Expression";
import {Token} from "../../../Tokenizer/Token.ts";
import {ExpressionVisitor} from "../ExpressionVisitor/ExpressionVisitor";

export class VarExpr extends Expression {
    name: Token
    
    constructor(name: Token) {
        super()
        this.name = name
    }

    accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visitVarExpr(this)
    }
}
