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

import {TokenType} from "../TokenType";
import {Token} from "../Token";
import {Expression} from "./Expression";
import {Binary} from "./ConcreteExpressions/Binary.ts";
import {Unary} from "./ConcreteExpressions/Unary.ts";
import {Literal} from "./ConcreteExpressions/Literal.ts";
import {Grouping} from "./ConcreteExpressions/Grouping.ts";

export class ExpressionParser {
    private tokens: Token[]
    private current: number = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }
    
    // expression     → equality ;
    private expression(): Expression{
        return this.equality()
    }

    // equality       → comparison ( ( "!=" | "==" ) comparison )* ;
    private equality(): Expression {
        let expression: Expression = this.comparison()
        
        while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            // previous because when checking the match, we consumed the operator
            const operator: Token = this.previous()
            const right: Expression = this.comparison()
            expression = new Binary(expression, operator, right)
        }
        
        return expression;
    }
    
    private comparison(): Expression {
        let expression: Expression = this.term()
        
        while(this.match(TokenType.GREATER, TokenType.GREATER_EQUAL,
            TokenType.LESS, TokenType.LESS_EQUAL )) {
            // previous used because when checking the match, we consumed the operator
            const operator: Token = this.previous()
            const term: Expression = this.term()
            expression = new Binary(expression, operator, term)
        }
        return expression
    }

    // term           → factor ( ( "-" | "+" ) factor )* ;
    private term(): Expression {
        let expression: Expression = this.factor()
        
        while(this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator: Token = this.previous()
            const right: Expression = this.factor()
            expression = new Binary(expression, operator, right)
        }
        
        return expression
    }

    // factor         → unary ( ( "/" | "*" ) unary )* ;
    private factor(): Expression {
        let expression: Expression = this.unary()
        
        while(this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator: Token = this.previous()
            const rightExpression: Expression = this.unary()
            expression = new Binary(expression, operator, rightExpression)
        }
        
        return expression
    }
    
//     unary          → ( "!" | "-" ) unary
// | primary ;
    private unary(): Expression {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator: Token = this.previous()
            const rightExpression: Expression = this.unary()
            return new Unary(operator, rightExpression)
        }
        
        return this.primary();
    }

//     primary        → NUMBER | STRING | "true" | "false" | (we don't have nill) "nil"
// | "(" expression ")" ;
    private primary(): Expression {
        if(this.match(TokenType.NUMBER, TokenType.STRING)) {
            const expr: Token = this.previous()
            return new Literal(expr.literal)
        }
        
        if(this.match(TokenType.FALSE)) {
            return new Literal(false)
        }

        if(this.match(TokenType.TRUE)) {
            return new Literal(true)
        }
        
        if(this.match(TokenType.LEFT_PAREN)) {
            const expression: Expression = this.expression()
            this.consume(TokenType.RIGHT_PAREN, ") აკლია")
            return new Grouping(expression)
        }
        
        //never should come here, hopefully :D
        return new Literal(TokenType.SOMETHINGS_WRONG)
    }
    
    private consume(type: TokenType, errorMessage: string): Token {
        if(this.check(type)) return this.advance()
        
        throw new Error(errorMessage)
    }

        // checks if next Token matches any of the TokenType that is given to it
    // if it does, current increments
    private match(...types: TokenType[]): boolean {
     for (const type of types) {
         if (this.check(type)) {
             this.advance()
             return true
         }
     }   
     return false
    }
 
    private check(type: TokenType): boolean {
        if (this.isAtEnd()) {
            return false
        }   
        return this.peek().type === type
    }
    
    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF
    }  
    
    // returns next token that is not consumed yet
    private peek(): Token {
        return this.tokens[this.current]
    }

    // returns already consumed token
    private previous(): Token {
        return this.tokens[this.current - 1]
    }
    
    // consumes the current token and returns it
    private advance(): Token {
        // TO DO: what should happen, when next is EOF?
        const nextToken: Token = this.peek()
        this.current++
        return nextToken
    }
}

