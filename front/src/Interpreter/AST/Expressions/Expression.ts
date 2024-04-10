

import {Token} from "../../Token.ts";
import {ExpressionVisitor} from "./ExpressionVisitor/ExpressionVisitor";
 
export abstract class Expression {
    left: Expression 
    operator: Token
    right: Expression
    
    abstract accept<R>(visitor: ExpressionVisitor<R>) : R
}
