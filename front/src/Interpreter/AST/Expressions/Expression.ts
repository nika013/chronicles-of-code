/*
Context Free Grammar

expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")" ;

 */

import {Token} from "../Token";
import {ExpressionVisitor} from "./ExpressionVisitor/ExpressionVisitor";
 
export abstract class Expression {
    left: Expression 
    operator: Token
    right: Expression
    
    abstract accept<R>(visitor: ExpressionVisitor<R>) : R
}
