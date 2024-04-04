import {literalType, Token} from "./Token.ts";
import {TokenType} from "./TokenType.ts";
import {keywords} from "./Keywords.ts"

 
    
export class Tokenizer {
    private source: string;
    private tokens: Token[] = []
    private current: integer
    private start: integer
    
    constructor(source: string) {
        this.source = source;
        this.current = 0
        this.start = 0

        this.deleteUnnecessarySpaces()
    }

    
    scanTokens():Token[] {
        while(!this.isAtEnd()) {
            this.start = this.current
            this.scanToken()
        }

        // this.tokens.push(new Token(TokenType.EOF, "", ));
        return this.tokens
    }

    private deleteUnnecessarySpaces() {
        this.deleteWhiteSpaces()
        this.deleteComments()
    }

    private deleteWhiteSpaces()  {
        this.source = this.source.replace(/\s+/g, '');
    }
    
    private deleteComments(): string {
        return this.source.replace(/^\/\/.*$/gm, '');
    }
    
    private addToken(type: TokenType,  literal: literalType) {
        const text: string = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, literal))
}

    private scanToken() {
        const c: string = this.advance();
        switch (c) {
            case '(': this.addToken(TokenType.LEFT_PAREN, null); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN, null); break;
            case '{': this.addToken(TokenType.LEFT_BRACE, null); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE, null); break;
            case ',': this.addToken(TokenType.COMMA, null); break;
            case '.': this.addToken(TokenType.DOT, null); break;
            case '-': this.addToken(TokenType.MINUS, null); break;
            case '+': this.addToken(TokenType.PLUS, null); break;
            case ';': this.addToken(TokenType.SEMICOLON, null); break;
            case '*': this.addToken(TokenType.STAR, null); break;

            case '!':
                this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG, null);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, null);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS, null);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER, null);
                break;
            case '/':
                this.addToken(TokenType.SLASH, null);
                break;
                
            case '"':
                this.doString()
                break;
            default:
                if (this.isDigit(c)) {
                    this.doNumber();
                } else if (this.isAlpha(c)){
                    this.doIdentifier()
                } else {
                    // TO DO: error handling
                    // Lox.error(line, "Unexpected character.");
                }
        }
    }

    private isAlphaNumeric(c: string): boolean{
        return this.isAlpha(c) || this.isDigit(c);
    }


    private doIdentifier() {
        while(this.isAlphaNumeric(this.peek())){
            this.advance()
        }
        const text: string = this.source.substring(this.start, this.current);

        let type = keywords.get(text)
        if (type == undefined) {
            type = TokenType.IDENTIFIER
        }
        this.addToken(type, null)
    }
    
    private isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    }
    
    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9'
    }
    
    private doNumber() {
        // move current to the end of the number
        while (this.isDigit(this.peek())) this.advance()
        
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            // jump over the .
            this.advance()
            
            while(this.isDigit(this.peek())) {
                this.advance()
            }       
        }
        
        this.addToken(TokenType.NUMBER, 
            parseFloat(this.source.substring(this.start, this.current)))
    }

    private peekNext(): string {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source.charAt(this.current + 1);
    }

    private doString() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            // if (this.peek() == '\n') line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            // TO DO: here should be error handling
            // Lox.error(line, "Unterminated string.");
            return;
        }
        
        // this is for the closing "
        this.advance()
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value)
        
    }
    
    private match(expected: string): boolean {
        if (this.isAtEnd()) return false
        if (this.source.charAt(this.current) != expected) return false;
        
        this.current++
        return true;
    }

    private peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private isAtEnd() {
        return this.current >= this.source.length
    }
}
