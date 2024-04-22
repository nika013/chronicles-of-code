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

import {TokenType} from "../../TokenType.ts";
import {Token} from "../../Token.ts";
import {Expression} from "./Expression";
import {Binary} from "./ConcreteExpressions/Binary.ts";
import {Unary} from "./ConcreteExpressions/Unary.ts";
import {Literal} from "./ConcreteExpressions/Literal.ts";
import {Grouping} from "./ConcreteExpressions/Grouping.ts";
import {ParseError} from "../ParseError.ts";
import {ExpressionVisitor} from "./ExpressionVisitor/ExpressionVisitor.ts";

/*
    // equality       → comparison ( ( "!=" | "==" ) comparison )* ;

SOME INFO:
    Context-Free Grammar:
    expression     → equality ;
    equality       → logical_or ( ( "!=" | "==" ) logical_or )* ;
    logical_or     → logical_and ( "||" logical_and )* ;
    logical_and    → comparison ( "&&" comparison )* ;
    comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
    term           → factor ( ( "-" | "+" ) factor )* ;
    factor         → unary ( ( "/" | "*" ) unary )* ;
    unary          → ( "!" | "-" ) unary | primary ;
    primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" ;


       **Precedence Management**
        -Arithmetic operations
        -Comparison operations
        -Logical AND operations
        -Logical OR operations
        -equality operations

 */
export class ErrorExpression implements Expression {
    constructor(public message: string, public line: number) {}

    left: Expression;
    operator: Token;
    right: Expression;

    // ! this is wrong, temporary implementation
    accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }
}

export class ExpressionParser {
    private tokens: Token[]
    private current: number = 0
    // private hasError: boolean = false

    constructor(tokens: Token[]) {
        console.log(tokens)
        this.tokens = tokens
        // tokens.pop()
        // this.tokens = tokens
        // console.log(this.tokens)
    }

    public parse(): Expression {
        try {
            return this.expression();
        } catch (error) {
            if (error instanceof ParseError) {
                this.handleError(error);
                // this.synchronize()
                // Return an error-specific expression with error details
                return new ErrorExpression(error.message, this.previous().line);
            } else {
                throw error;
            }
        }
    }

    private handleError(error: ParseError): void {
        console.error("Error parsing at token", this.previous().lexeme, "on line", this.previous().line, ":", error.message);
        // Additional error handling or logging can be implemented here
    }

    //
    // private synchronize(): void {
    //     this.advance(); // Skip the erroneous token that caused the error
    //
    //     while (!this.isAtEnd()) {
    //         if (this.previous().type === TokenType.SEMICOLON) {
    //             // A semicolon usually means the end of a statement.
    //             return; // Safe point to continue parsing
    //         }
    //
    //         // Check if the next token starts a new statement or structure.
    //         switch (this.peek().type) {
    //             case TokenType.IF:
    //             case TokenType.ELSE:
    //             case TokenType.FOR:
    //             case TokenType.WHILE:
    //             case TokenType.TRUE:   // Considering control keywords and booleans might not be ideal for recovery points,
    //             case TokenType.FALSE:  // but depending on your language's structure, these might imply logical starts or breaks.
    //                 // These keywords start new blocks or statements, making them good recovery points.
    //                 return;
    //             default:
    //                 // If the current token is not a starting point for a new block or a semicolon,
    //                 // continue to the next token.
    //                 this.advance();
    //                 break;
    //         }
    //     }
    // }


    private error(token: Token, message: string): ParseError {
        console.error(`Error at '${token.lexeme}' (${token.line}): ${message}`);
        // this.hasError = true;
        return new ParseError(message);
    }
    
    // expression     → equality ;
    private expression(): Expression{
        return this.equality()
    }

    // equality       → logical_or ( ( "!=" | "==" ) logical_or )* ;
    private equality(): Expression {
        let expression: Expression = this.logical_or()
        console.log("in parser: expression left: " + expression)
        while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            // previous because when checking the match, we consumed the operator
            const operator: Token = this.previous()
            const right: Expression = this.logical_or()
            expression = new Binary(expression, operator, right)
        }
        
        return expression;
    }
//
//     **Precedence Management**
// -Arithmetic operations
// -Comparison operations
// -Logical AND operations
// -Logical OR operations
// -equality operations

    // logical_or     → logical_and ( "||" logical_and )* ;
    private logical_or(): Expression {
        let expr = this.logical_and();
        while (this.match(TokenType.OR)) {
            const operator = this.previous();
            const right = this.logical_and();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    // logical_and    → comparison ( "&&" comparison )* ;
    private logical_and(): Expression {
        let expr = this.comparison();
        while (this.match(TokenType.AND)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }
    
    private comparison(): Expression {
        let expression: Expression = this.term()
        
        while(this.match(TokenType.GREATER, TokenType.GREATER_EQUAL,
            TokenType.LESS, TokenType.LESS_EQUAL,  )) {
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
        
        throw new Error( " we're here: TokenType.SOMETHINGS_WRONG")
        //never should come here, hopefully :D
        return new Literal(TokenType.SOMETHINGS_WRONG)
    }
    
    private consume(type: TokenType, errorMessage: string): Token {
        if(this.check(type)) return this.advance()
        
        throw this.error(this.peek(), errorMessage)
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
 
    // doesn't move the current
    private check(type: TokenType): boolean {
        if (this.isAtEnd()) {
            return false
        }   
        if (this.peek().type === undefined)
            throw new Error(this.peek() + " type undefined line 233")
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
        if (this.isAtEnd()) throw new ParseError("Attempt to advance past end of input.");
        return this.tokens[this.current++];

        // const nextToken: Token = this.peek()
        // this.current++
        // return nextToken
    }
}

