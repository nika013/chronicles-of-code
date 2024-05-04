// import {ErrorExpression, ExpressionParser} from "../Interpreter/AST/Expressions/ExpressionParser.ts";
// import { Token } from "../Interpreter/Token";
// import { TokenType } from "../Interpreter/TokenType";
// import {LiteralType} from "../Interpreter/literalType.ts";
//
// function createToken(type: TokenType, lexeme: string, literal: LiteralType): Token {
//     return new Token(type, lexeme, literal);  // Assuming line number is passed as 1 for simplicity
// }
//
// // function addEOF(tokens: Token[]): void {
// //     tokens.push(createToken(TokenType.EOF, "", null));
// // }
//
//
// describe('Error Handling in Expression Parsing', () => {
//     test('handles unmatched parentheses', () => {
//         const tokens = [
//             createToken(TokenType.LEFT_PAREN, "(", null),
//             createToken(TokenType.NUMBER, "42", 42),
//             createToken(TokenType.EOF, "", null)  // Missing a closing parenthesis
//         ];
//
//         const parser = new ExpressionParser(tokens);
//         const expression = parser.parse();
//
//         expect(expression).toBeInstanceOf(ErrorExpression);
//         // expect(expression.message).toContain("Expected ')'");
//     });
//
//     test('handles unexpected token', () => {
//         const tokens = [
//             createToken(TokenType.NUMBER, "42", 42),
//             createToken(TokenType.STAR, "*", null),
//             createToken(TokenType.RIGHT_BRACE, "}", null),  // Right brace is unexpected here
//             createToken(TokenType.NUMBER, "3", 3),
//             createToken(TokenType.EOF, "", null)
//         ];
//
//         const parser = new ExpressionParser(tokens);
//         const expression = parser.parse();
//
//         expect(expression).toBeInstanceOf(ErrorExpression);
//         // expect(expression.message).toContain("unexpected token");
//     });
// });
