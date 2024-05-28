import { Token } from "../../Tokenizer/Token";
import { TokenType } from "../../Tokenizer/TokenType";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { ParseError } from "../ParseError";
import { VarType } from "./ConcreteStatements/Environment";
import { VarStatement } from "./ConcreteStatements/VarStatement";
import { IfStatement } from "./ConcreteStatements/IfStatement";
import { Statement } from "./Interfaces/Statement";
import { Expression } from "../Expressions/Expression";
import { WhileStatement } from "./ConcreteStatements/WhileStatement";
import { ForStatement } from "./ConcreteStatements/ForStatement";
import { FuncStatement } from "./ConcreteStatements/FuncStatement";

export class StatementParser {
    private exprParser = new ExpressionParser([])
    private tokens: Token[] = []
    private current = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse(): Statement[] {
        return this.parseTill(() => this.hasNext())
    } 
    
    parseTill(tillClosure: () => boolean) {
        let statements: Statement[] = []
        while (tillClosure()) {
            const stmt = this.parseStatement()
            if (stmt) {
                statements.push(stmt)
            }
        }
        return statements
    }

    private parseStatement(): Statement | undefined {
        let currentToken = this.advance();
        
        switch (currentToken.type) {
            case TokenType.IF:
                return this.parseIfStatement();
            case TokenType.WHILE:
                return this.parseWhileStatement();
            case TokenType.VAR_TYPE:
                return this.parseVarStatement();
            case TokenType.FOR:
                return this.parseForStatement();
            case TokenType.IDENTIFIER:
                return this.parseFuncStatement();
            default:
                
        }
    }

    parseIfStatement(): Statement { 
        const [childStmts, condition] = this.getArgumentsForConditionalStmt()
        return new IfStatement(childStmts, condition)
    }

    parseWhileStatement(): Statement { 
        const [childStmts, condition] = this.getArgumentsForConditionalStmt()
        return new WhileStatement(childStmts, condition)
    }

    parseVarStatement(): Statement {
        const varTypeRawValue = this.previous().lexeme
        const varType = varTypeRawValue as VarType;
        const name = this.consume(TokenType.IDENTIFIER, 'expecting variable name').lexeme
        this.consume(TokenType.EQUAL, 'expecting = sign')

        const strIdx = this.current
        while (!this.match(TokenType.SEMICOLON)) {
        }
        const endIdx = this.current
        const exprTokens = this.tokens.slice(strIdx, endIdx - 1)
        exprTokens.push(new Token(TokenType.EOF, '', ''))
        
        this.exprParser.setTokens(exprTokens)
        const initializer = this.exprParser.parse()

        return new VarStatement(varType, name, initializer)
    }
    
    parseForStatement(): Statement {
        const iterCount = this.advance().literal as number
        if (!this.check(TokenType.LEFT_BRACE)) {
            throw new ParseError('Expecting { to start if block statements')
        }
        const childStmts = this.parseTill(() => !this.check(TokenType.RIGHT_BRACE))
        return new ForStatement(childStmts, iterCount)
    }

    parseFuncStatement(): Statement {
        const funcName = this.previous().lexeme
        this.consume(TokenType.LEFT_PAREN, 'expecting ( for function call')
        this.consume(TokenType.RIGHT_PAREN, 'expecting ) for function call')
        return new FuncStatement(funcName)
    }
    
    getArgumentsForConditionalStmt(): [Statement[], Expression] {
        this.consume(TokenType.LEFT_PAREN, 'expecting ( to start if condition')
        
        const strIdx = this.current
        while (!this.match(TokenType.RIGHT_PAREN)) {
        }
        const endIdx = this.current
        const exprTokens = this.tokens.slice(strIdx, endIdx - 1)
        exprTokens.push(new Token(TokenType.EOF, '', ''))

        this.exprParser.setTokens(exprTokens)
        const condition = this.exprParser.parse()

        if (!this.check(TokenType.LEFT_BRACE)) {
            throw new ParseError('Expecting { to start if block statements')
        }
        const childStmts = this.parseTill(() => !this.check(TokenType.RIGHT_BRACE))
        return [childStmts, condition]
    }

    private hasNext(): boolean {
        return this.current < this.tokens.length - 1
    }

    private advance(): Token {
        if (!this.hasNext()) throw new ParseError("Attempt to advance past end of input.");
        return this.tokens[this.current++];
    }

    private consume(type: TokenType, errorMessage: string): Token {
        if(this.check(type)) return this.advance()
        
        throw this.error(this.peek(), errorMessage)
    }

    private peek(): Token {
        return this.tokens[this.current]
    }

    private previous(): Token {
        return this.tokens[this.current - 1]
    }

    private check(type: TokenType): boolean {
        if (!this.hasNext()) {
            return false
        }   
        if (this.peek().type === undefined)
            throw new Error(this.peek() + " type undefined line 233")
        return this.peek().type === type
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance()
                return true
            }
            this.advance()
        }   
        return false
    }

    private error(token: Token, message: string): ParseError {
        console.error(`Error at '${token.lexeme}' (${token.line}): ${message}`);
        // this.hasError = true;
        return new ParseError(message);
    }
}