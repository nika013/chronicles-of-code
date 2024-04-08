import {TokenType} from "./TokenType.ts";

export type literalType = string | number | boolean | null;

export class Token {
    type: TokenType;
    lexeme: string;
    literal: literalType;

    constructor(type: TokenType, lexeme: string, literal: literalType) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        
    }
    
    public  toString(): string {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}
