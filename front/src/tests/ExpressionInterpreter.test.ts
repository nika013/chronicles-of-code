// Interpreter.test.ts

import {ExpressionInterpreter} from "../Interpreter/AST/Expressions/ExpressionInterpreter.ts";
import {Literal} from "../Interpreter/AST/Expressions/ConcreteExpressions/Literal.ts";
import {Token} from "../Interpreter/Token.ts";
import {TokenType} from "../Interpreter/TokenType.ts";
import {Binary} from "../Interpreter/AST/Expressions/ConcreteExpressions/Binary.ts";
import { Grouping } from "../Interpreter/AST/Expressions/ConcreteExpressions/Grouping.ts";
import {Expression} from "../Interpreter/AST/Expressions/Expression.ts";
import {Unary} from "../Interpreter/AST/Expressions/ConcreteExpressions/Unary.ts";
import {LiteralType} from "../Interpreter/literalType.ts";

describe('Interpreter Literal Evaluations', () => {
    const interpreter = new ExpressionInterpreter(); // Assuming the interpreter doesn't require initial setup

    test('evaluates numeric literals', () => {
        const expression = new Literal(42);
        const result = interpreter.interpret(expression);
        expect(result).toBe(42);
    });

    test('evaluates string literals', () => {
        const expression = new Literal("Hello, world");
        const result = interpreter.interpret(expression);
        expect(result).toBe("Hello, world");
    });

    test('evaluates boolean literals', () => {
        const expression = new Literal(true);
        const result = interpreter.interpret(expression);
        expect(result).toBe(true);
    });
});

describe('ExpressionInterpreter easy ones', () => {
    let interpreter: ExpressionInterpreter;

    beforeEach(() => {
        interpreter = new ExpressionInterpreter();
    });

    test('Binary: adds two numbers', () => {
        const left = new Literal(3);
        const right = new Literal(7);
        const plusToken = new Token(TokenType.PLUS, "+", null);
        const expression = new Binary(left, plusToken, right);
        expect(interpreter.visitBinaryExpr(expression)).toBe(10);
        expect(interpreter.interpret(expression)).toBe(10);
    });

    test('Binary: subtracts two numbers', () => {
        const left = new Literal(10);
        const right = new Literal(4);
        const minusToken = new Token(TokenType.MINUS, "-", null);
        const expression = new Binary(left, minusToken, right);
        expect(interpreter.visitBinaryExpr(expression)).toBe(6);
        expect(interpreter.interpret(expression)).toBe(6);

    });

    test('multiplies two numbers', () => {
        const left = new Literal(5);
        const right = new Literal(6);
        const starToken = new Token(TokenType.STAR, "*", null);
        const expression = new Binary(left, starToken, right);
        expect(interpreter.visitBinaryExpr(expression)).toBe(30);
        expect(interpreter.interpret(expression)).toBe(30);

    });

    test('divides two numbers', () => {
        const left = new Literal(20);
        const right = new Literal(5);
        const slashToken = new Token(TokenType.SLASH, "/", null);
        const expression = new Binary(left, slashToken, right);
        expect(interpreter.visitBinaryExpr(expression)).toBe(4);
        expect(interpreter.interpret(expression)).toBe(4);

    });

});


describe('Interpreter Grouping Evaluations', () => {
    const interpreter = new ExpressionInterpreter(); // Assuming the interpreter doesn't require initial setup

    test('evaluates simple numeric grouping', () => {
        // Equivalent to (3)
        const innerExpr = new Literal(3);
        const expression = new Grouping(innerExpr);
        const result = interpreter.interpret(expression);
        expect(result).toBe(3);
    });

    test('evaluates nested groupings', () => {
        // Equivalent to ((3 + 2) * 4)
        const innerMostExpr = new Literal(3);
        const additionExpr = new Binary(innerMostExpr, new Token(TokenType.PLUS, '+', null), new Literal(2));
        const groupedAddition = new Grouping(additionExpr);
        const multiplyExpr = new Binary(groupedAddition, new Token(TokenType.STAR, '*', null), new Literal(4));
        const expression = new Grouping(multiplyExpr);
        const result = interpreter.interpret(expression);
        expect(result).toBe(20);
    });

    test('handles deep nesting', () => {
        // Equivalent to ((((42))))
        let expression: Expression = new Literal(42);
        for (let i = 0; i < 4; i++) {
            expression = new Grouping(expression);
        }
        const result = interpreter.interpret(expression);
        expect(result).toBe(42);
    });
});


describe('ExpressionInterpreter Unary Evaluations', () => {
    const interpreter = new ExpressionInterpreter(); // Assuming no initial setup needed

    test('evaluates unary minus', () => {
        // This test simulates the evaluation of the expression: -42
        const literal = new Literal(42);
        const unaryExpr = new Unary(new Token(TokenType.MINUS, '-', null), literal);
        const result = interpreter.interpret(unaryExpr);
        expect(result).toBe(-42);
    });

    test('evaluates nested unary minus', () => {
        // This simulates: -(-42)
        const literal = new Literal(42);
        const innerUnary = new Unary(new Token(TokenType.MINUS, '-', null), literal);
        const outerUnary = new Unary(new Token(TokenType.MINUS, '-', null), innerUnary);
        const result = interpreter.interpret(outerUnary);
        expect(result).toBe(42);
    });

    test('evaluates logical negation', () => {
        // This simulates: !true
        const literal = new Literal(true);
        const unaryExpr = new Unary(new Token(TokenType.BANG, '!', null), literal);
        const result = interpreter.interpret(unaryExpr);
        expect(result).toBe(false);
    });

    test('evaluates double negation', () => {
        // This simulates: !!true
        const literal = new Literal(true);
        const innerNegation = new Unary(new Token(TokenType.BANG, '!', null), literal);
        const outerNegation = new Unary(new Token(TokenType.BANG, '!', null), innerNegation);
        const result = interpreter.interpret(outerNegation);
        expect(result).toBe(true);
    });
});


function token(type: TokenType, lexeme: string, literal: LiteralType): Token {
    return new Token(type, lexeme, literal); // Assuming a placeholder for line number
}

describe('Complex Expression Interpretation', () => {
    const interpreter = new ExpressionInterpreter();

    test('Arithmetic with negatives and grouping', () => {
        // -(10 + (5*2))
        const expr = new Unary(
            token(TokenType.MINUS, "-", null),
            new Grouping(
                new Binary(
                    new Literal(10),
                    token(TokenType.PLUS, "+", null),
                    new Binary(
                        new Literal(5),
                        token(TokenType.STAR, "*", null),
                        new Literal(2)
                    )
                )
            )
        );

        const result = interpreter.interpret(expr);
        expect(result).toEqual(-20);
    });

    test('Logical NOT with arithmetic', () => {
        // Represents the expression: !(10 > 5)  
        // 10 > 5
        const expr: Binary
            = new Unary(
            token(TokenType.BANG, "!", null),
            new Grouping( 
             new Binary(
                new Literal(10),
                token(TokenType.GREATER, ">", null),
                new Literal(5)
            )
        ));

        const result = interpreter.interpret(expr);
        expect(result).toEqual(false);
    });

    test('Nested groupings with arithmetic and logical operators', () => {
        // Represents the expression: !((5 + 3) == 8)
        // !((5 + 3) == 8)
        const expr = new Unary(
            token(TokenType.BANG, "!", null),
            new Grouping(
                new Binary(
                    new Binary(
                        new Literal(5),
                        token(TokenType.PLUS, "+", null),
                        new Literal(3)
                    ),
                    token(TokenType.EQUAL_EQUAL, "==", null),
                    new Literal(8)
                )
            )
        );


        const result = interpreter.interpret(expr);
        expect(result).toEqual(false);
    });

    test('Mixed types with comparisons', () => {
        // Represents the expression: ("test" + "ing") == "testing"
        const expr = new Binary(
            new Binary(
                new Literal("test"),
                token(TokenType.PLUS, "+", null),
                new Literal("ing")
            ),
            token(TokenType.EQUAL_EQUAL, "==", null),
            new Literal("testing")
        );

        const result = interpreter.interpret(expr);
        expect(result).toEqual(true);
    });

    test('Unary negation with arithmetic operations', () => {
        // Represents the expression: -(5 + 3) * 2
        const expr = new Binary(
            new Unary(
                new Token(TokenType.MINUS, "-", null),
                new Binary(
                    new Literal(5),
                    new Token(TokenType.PLUS, "+", null),
                    new Literal(3)
                )
            ),
            new Token(TokenType.STAR, "*", null),
            new Literal(2)
        );

        const result = interpreter.interpret(expr);
        expect(result).toEqual(-16);
    });

    test('Implicit type conversion in arithmetic', () => {
        // Represents the expression: "5" + "3"
        const expr = new Binary(
            new Literal("5"),
            token(TokenType.PLUS, "+", null),
            new Literal("3")
        );

        const result = interpreter.interpret(expr);
        expect(result).toEqual("53"); // Assuming your language handles implicit conversion like JavaScript
    });

});


