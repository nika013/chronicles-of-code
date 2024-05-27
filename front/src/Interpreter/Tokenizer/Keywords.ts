import {TokenType} from "./TokenType.ts";
 
export const keywords: Map<string, TokenType> = new Map([
    // TO DO: add else here, could not guess its georgian name
    ["და", TokenType.AND],
    ["გაიმეორე", TokenType.FOR],
    ["ჭეშმარიტი", TokenType.TRUE],
    ["მცდარი", TokenType.FALSE],
    ["სანამ", TokenType.WHILE],
    ["თუ", TokenType.IF],
    ["ან", TokenType.OR],
    ["რიცხვი", TokenType.VAR_TYPE],
    ["სიტყვა", TokenType.VAR_TYPE],
    // TO DO: change its name
    ["ბულეანი", TokenType.VAR_TYPE],
]);
