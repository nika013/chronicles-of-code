import {TokenType} from "./TokenType.ts";
import {LiteralType} from "./literalType";


export class Token {
    type: TokenType;
    lexeme: string;
    literal: LiteralType;

    constructor(type: TokenType, lexeme: string, literal: LiteralType) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
    }
    
    public  toString(): string {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}
