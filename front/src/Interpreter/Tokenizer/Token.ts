import {TokenType} from "./TokenType.ts";

export type myNever = never | null;

export class Token {
    type: TokenType;
    lexeme: string;
    literal: myNever;

    constructor(type: TokenType, lexeme: string, literal: myNever) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        
    }
    
    public  toString(): string {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}