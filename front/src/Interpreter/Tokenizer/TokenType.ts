export enum TokenType {
    // keywords
    IF, ELSE, FOR, WHILE, AND, NOT, OR, 
    TRUE, FALSE,

    EOF,
    // I think its anything else other than these
    IDENTIFIER,
    // literals
    NUMBER, STRING, BOOLEAN,

    // One or two character tokens.
    BANG, BANG_EQUAL, EQUAL, EQUAL_EQUAL, GREATER, 
    GREATER_EQUAL, LESS, LESS_EQUAL,

    // Single-character tokens.
    LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN,
    COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR
}