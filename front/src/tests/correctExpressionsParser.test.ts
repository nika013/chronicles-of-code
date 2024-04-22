import {ExpressionParser} from "../Interpreter/AST/Expressions/ExpressionParser.ts";
import {Token} from "../Interpreter/Token";
import {TokenType} from "../Interpreter/TokenType";
import {LiteralType} from "../Interpreter/literalType.ts";
import {Expression} from "../Interpreter/AST/Expressions/Expression.ts";
import {Literal} from "../Interpreter/AST/Expressions/ConcreteExpressions/Literal.ts";
import {Grouping} from "../Interpreter/AST/Expressions/ConcreteExpressions/Grouping.ts";
import {Unary} from "../Interpreter/AST/Expressions/ConcreteExpressions/Unary.ts";
import {Binary} from "../Interpreter/AST/Expressions/ConcreteExpressions/Binary.ts";

function createToken(type: TokenType, lexeme: string, literal: LiteralType) {
    return new Token(type, lexeme, literal);
}

function addEOF(tokens: Token[]) {
    tokens.push(createToken(TokenType.EOF, "", ""))
}



describe('test simple literal expressions', () => {
    // first test
    test('parse a numeric literal', () => 
    {   
        const tokens: Token[] = [
            createToken(TokenType.NUMBER, "42", 42),
        ]
        addEOF(tokens)
        
        const parser = new ExpressionParser(tokens)
        const expression: Expression | null= parser.parse()
        
        expect(expression).toBeInstanceOf(Literal)
        expect((<Literal>expression).value).toBe(42)
    })

    test(' test string literal', () => {
        const tokens: Token[] = [
            createToken(TokenType.NUMBER, "Mari Rocks", "Mari Rocks"),
        ]
        addEOF(tokens)
        
        const parser = new ExpressionParser(tokens)
        const expression: Expression | null= parser.parse()
        expect(expression).toBeInstanceOf(Literal)
        expect((<Literal>expression).value).toBe("Mari Rocks")
    })

    test(' test boolean literals', () => {
        const tokens: Token[] = [
            createToken(TokenType.NUMBER, "true", true),
            createToken(TokenType.NUMBER, "false", false),
        ]
        addEOF(tokens)

        const parser = new ExpressionParser(tokens)
        let expression: Expression | null= parser.parse()
        expect(expression).toBeInstanceOf(Literal)
        expect((<Literal>expression).value).toBe(true)

        expression = parser.parse()
        expect(expression).toBeInstanceOf(Literal)
        expect((<Literal>expression).value).toBe(false)
    })
})

function parseTokens(tokens: Token[]): Expression{
    addEOF(tokens); // Ensure EOF is always added
    const parser = new ExpressionParser(tokens);
    return parser.parse();
}

describe("test simple literals in parentheses",  () => {
    
    test('test boolean in parentheses', () => {
        const tokens: Token[] = [
            createToken(TokenType.LEFT_PAREN, "(", null),
            createToken(TokenType.FALSE, "false", false),
            createToken(TokenType.RIGHT_PAREN, ")", null),
        ]
        
        let expression: Expression = parseTokens(tokens)

        expect(expression).toBeInstanceOf(Grouping)
        expect((<Literal>(<Grouping>expression).expression).value).toBe(false)

        tokens[1] = createToken(TokenType.TRUE, "true", true)
        expression = parseTokens(tokens)

        expect(expression).toBeInstanceOf(Grouping)
        expect((<Literal>(<Grouping>expression).expression).value).toBe(true)
    })
    
    test("test numbers and string in parentheses", () => {
        const tokens: Token[] = [
            createToken(TokenType.LEFT_PAREN, "(", null),
            createToken(TokenType.NUMBER, "17", 17),
            createToken(TokenType.RIGHT_PAREN, ")", null),
        ]

        let expression: Expression | null= parseTokens(tokens)

        expect(expression).toBeInstanceOf(Grouping)
        expect((<Literal>(<Grouping>expression).expression).value).toBe(17)
        
        const str: string = "Mari rocks"
        tokens[1] = createToken(TokenType.STRING, str, str)
        expression = parseTokens(tokens)
        expect(expression).toBeInstanceOf(Grouping)
        expect((<Literal>(<Grouping>expression).expression).value).toBe(str)
    })
})

describe("test simple unary expressions", () => {
    test("test bang unary", () => {
        const tokens: Token[] = [
            createToken(TokenType.BANG, "!", null),
            createToken(TokenType.NUMBER, "17", 17),
        ]

        const expression: Expression = parseTokens(tokens)

        expect(expression).toBeInstanceOf(Unary)
        expect((<Unary>expression).operator.lexeme).toBe("!")
        expect((<Literal>((<Unary>expression).right)).value).toBe(17)
    })

    test("test '-' unary", () => {
        const tokens: Token[] = [
            createToken(TokenType.BANG, "-", null),
            createToken(TokenType.NUMBER, "17", 17),
        ]

        const expression: Expression = parseTokens(tokens)

        expect(expression).toBeInstanceOf(Unary)
        expect((<Unary>expression).operator.lexeme).toBe("-")
        expect((<Literal>((<Unary>expression).right)).value).toBe(17)
    })
})

describe('test simple factor ', () => {
    test("test number * number", () => {
        const tokens: Token[] = [
            createToken(TokenType.NUMBER, "4", 4),
            createToken(TokenType.STAR, "*", null),
            createToken(TokenType.NUMBER, "5", 4),
        ]

        const expression: Expression = parseTokens(tokens)

        expect(expression).toBeInstanceOf(Binary)
        expect((<Literal>(<Binary>expression).left).value).toBe(4)
        expect((<Token>((<Unary>expression).operator)).lexeme).toBe("*")
        expect((<Literal>(<Binary>expression).right).value).toBe(4)
    })

    test("test number / number", () => {
        const tokens: Token[] = [
            createToken(TokenType.NUMBER, "20", 20),
            createToken(TokenType.STAR, "/", null),
            createToken(TokenType.NUMBER, "5", 5),
        ]

        const expression: Expression = parseTokens(tokens)

        expect(expression).toBeInstanceOf(Binary)
        expect((<Literal>(<Binary>expression).left).value).toBe(20)
        expect((<Token>((<Unary>expression).operator)).lexeme).toBe("/")
        expect((<Literal>(<Binary>expression).right).value).toBe(5)
    })
})

const tokens_for_unary_times_unary: Token[] = [
    // -5 * (-10)
    createToken(TokenType.MINUS, "-", null),
    createToken(TokenType.NUMBER, "5", 5),
    createToken(TokenType.STAR, "*", null),
    createToken(TokenType.MINUS, "-", null),
    createToken(TokenType.NUMBER, "10", 10),
]

const unary_star_unary: Expression = parseTokens(tokens_for_unary_times_unary)

describe('test factor */ unary', () => {
    test("test unary * unary", () => {
        

        const expression: Expression = unary_star_unary

        expect(expression).toBeInstanceOf(Binary)
        const left: Expression = (<Literal>(<Binary>expression).left) // -5
        const operator: Token = (<Token>((<Unary>expression).operator)) // *
        const right: Expression = (<Literal>(<Binary>expression).right) // -10
        
        expect(left).toBeInstanceOf(Unary)
        expect(operator).toBeInstanceOf(Token)
        expect(right).toBeInstanceOf(Unary)

        expect((<Unary>left).operator).toBeInstanceOf(Token)
        expect((<Unary>left).operator.lexeme).toBe('-')

        expect((<Unary>left).right).toBeInstanceOf(Literal) 
        expect((<Literal>(<Unary>left).right).value).toBe(5)
    })
})


function createNumberToken(value: number): Token {
    return createToken(TokenType.NUMBER, value.toString(), value);
}

function parseExpression(tokens: Token[]): Expression | null{
    const parser = new ExpressionParser(tokens);
    return parser.parse();
}


// term           → factor ( ( "-" | "+" ) factor )* ;
describe('test simple term', () => {
    test("literal + literal", () => {
        const tokens: Token[] = [
            createNumberToken(20),
            createToken(TokenType.PLUS, "+", null),
            createNumberToken(5),
        ];
        addEOF(tokens)


        const expression: Expression | null= parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        expect((<Binary>expression).operator.lexeme).toBe('+');
        expect((<Literal>(<Binary>expression).left).value).toBe(20);
        expect((<Literal>(<Binary>expression).right).value).toBe(5);
    })
})

describe('complex term expressions', () => {
    test('parse term with multiple operators', () => {
        // 3 + 5 * (2 - 1) / 4 - 2
        const tokens: Token[] = [
            createNumberToken(3),
            createToken(TokenType.PLUS, "+", null),
            createNumberToken(5),
            createToken(TokenType.STAR, "*", null),
            createToken(TokenType.LEFT_PAREN, "(", null),
            createNumberToken(2),
            createToken(TokenType.MINUS, "-", null),
            createNumberToken(1),
            createToken(TokenType.RIGHT_PAREN, ")", null),
            createToken(TokenType.SLASH, "/", null),
            createNumberToken(4),
            createToken(TokenType.MINUS, "-", null),
            createNumberToken(2)
        ];
        
        addEOF(tokens)
        const expression: Expression | null= parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        const topLevelBinary = expression as Binary;

        expect(topLevelBinary.right).toBeInstanceOf(Literal);
        expect((topLevelBinary.right as Literal).value).toBe(2);

        expect(topLevelBinary.left).toBeInstanceOf(Binary);
        const nestedBinary = topLevelBinary.left as Binary;

        expect(nestedBinary.operator.lexeme).toBe('+');
        expect(nestedBinary.left).toBeInstanceOf(Literal);
        expect((nestedBinary.left as Literal).value).toBe(3);

        expect(nestedBinary.right).toBeInstanceOf(Binary);
        const multiplicationOrDivision = nestedBinary.right as Binary;

        expect(multiplicationOrDivision.operator.lexeme).toBe('/');

    });
});


describe('simple comparison expressions', () => {
    test('parses greater than comparison', () => {
        const tokens = [
            createNumberToken(4),
            createToken(TokenType.GREATER, ">", null),
            createNumberToken(2),
            createToken(TokenType.EOF, "", null)
        ];

        const expression = parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        const binaryExpr = expression as Binary;
        expect(binaryExpr.operator.type).toBe(TokenType.GREATER);
        expect((binaryExpr.left as Literal).value).toBe(4);
        expect((binaryExpr.right as Literal).value).toBe(2);
    });

    test('parses greater than or equal comparison', () => {
        const tokens = [
            createNumberToken(4),
            createToken(TokenType.GREATER_EQUAL, ">=", null),
            createNumberToken(2),
            createToken(TokenType.EOF, "", null)
        ];

        const expression = parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        const binaryExpr = expression as Binary;
        expect(binaryExpr.operator.type).toBe(TokenType.GREATER_EQUAL);
        expect((binaryExpr.left as Literal).value).toBe(4);
        expect((binaryExpr.right as Literal).value).toBe(2);
    });

    test('parses less than comparison', () => {
        const tokens = [
            createNumberToken(4),
            createToken(TokenType.LESS, "<", null),
            createNumberToken(2),
            createToken(TokenType.EOF, "", null)
        ];

        const expression = parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        const binaryExpr = expression as Binary;
        expect(binaryExpr.operator.type).toBe(TokenType.LESS);
        expect((binaryExpr.left as Literal).value).toBe(4);
        expect((binaryExpr.right as Literal).value).toBe(2);
    });

    test('parses less than or equal comparison', () => {
        const tokens = [
            createNumberToken(4),
            createToken(TokenType.LESS_EQUAL, "<=", null),
            createNumberToken(2),
            createToken(TokenType.EOF, "", null)
        ];

        const expression = parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        const binaryExpr = expression as Binary;
        expect(binaryExpr.operator.type).toBe(TokenType.LESS_EQUAL);
        expect((binaryExpr.left as Literal).value).toBe(4);
        expect((binaryExpr.right as Literal).value).toBe(2);
    });
});


describe('complex comparison expressions', () => {
    test('parses chained comparison with different operators', () => {
        // Testing for an expression like: 5 > 3 >= 2
        const tokens = [
            createNumberToken(5),
            createToken(TokenType.GREATER, ">", null),
            createNumberToken(3),
            createToken(TokenType.GREATER_EQUAL, ">=", null),
            createNumberToken(2),
            createToken(TokenType.EOF, "", null)
        ]

        const expression = parseExpression(tokens)

        expect(expression).toBeInstanceOf(Binary)
        const binaryExpr = expression as Binary
        expect(binaryExpr.operator.type).toBe(TokenType.GREATER_EQUAL)

        expect(binaryExpr.right).toBeInstanceOf(Literal)
        expect((binaryExpr.right as Literal).value).toBe(2)

        expect(binaryExpr.left).toBeInstanceOf(Binary)
        const leftBinaryExpr = binaryExpr.left as Binary
        expect(leftBinaryExpr.operator.type).toBe(TokenType.GREATER)
        expect((leftBinaryExpr.left as Literal).value).toBe(5)
        expect((leftBinaryExpr.right as Literal).value).toBe(3)
    })

    test('parses nested comparisons with grouping', () => {
        // Testing for an expression like: (5 > 3) >= 2
        const tokens = [
            createToken(TokenType.LEFT_PAREN, "(", null),
            createNumberToken(5),
            createToken(TokenType.GREATER, ">", null),
            createNumberToken(3),
            createToken(TokenType.RIGHT_PAREN, ")", null),
            createToken(TokenType.GREATER_EQUAL, ">=", null),
            createNumberToken(2),
            createToken(TokenType.EOF, "", null)
        ]

        const expression = parseExpression(tokens)

        expect(expression).toBeInstanceOf(Binary)
        const binaryExpr = expression as Binary
        expect(binaryExpr.operator.type).toBe(TokenType.GREATER_EQUAL)

        expect(binaryExpr.right).toBeInstanceOf(Literal)
        expect((binaryExpr.right as Literal).value).toBe(2)

        expect(binaryExpr.left).toBeInstanceOf(Grouping)
        const grouping = binaryExpr.left as Grouping
        expect(grouping.expression).toBeInstanceOf(Binary)
        const groupedExpr = grouping.expression as Binary
        expect(groupedExpr.operator.type).toBe(TokenType.GREATER)
        expect((groupedExpr.left as Literal).value).toBe(5)
        expect((groupedExpr.right as Literal).value).toBe(3)
    })
});


describe('equality expressions', () => {
    test('parses equality using ==', () => {
        // Testing for an expression like: 5 == 5
        const tokens = [
            createNumberToken(5),
            createToken(TokenType.EQUAL_EQUAL, "==", null),
            createNumberToken(5),
            createToken(TokenType.EOF, "", null)
        ]

        const expression = parseExpression(tokens)

        expect(expression).toBeInstanceOf(Binary)
        const binaryExpr = expression as Binary
        expect(binaryExpr.operator.type).toBe(TokenType.EQUAL_EQUAL)
        expect(binaryExpr.left).toBeInstanceOf(Literal)
        expect((binaryExpr.left as Literal).value).toBe(5)
        expect(binaryExpr.right).toBeInstanceOf(Literal)
        expect((binaryExpr.right as Literal).value).toBe(5)
    })

    test('parses inequality using !=', () => {
        // Testing for an expression like: 5 != 3
        const tokens = [
            createNumberToken(5),
            createToken(TokenType.BANG_EQUAL, "!=", null),
            createNumberToken(3),
            createToken(TokenType.EOF, "", null)
        ]

        const expression = parseExpression(tokens)

        expect(expression).toBeInstanceOf(Binary)
        const binaryExpr = expression as Binary
        expect(binaryExpr.operator.type).toBe(TokenType.BANG_EQUAL)
        expect(binaryExpr.left).toBeInstanceOf(Literal)
        expect((binaryExpr.left as Literal).value).toBe(5)
        expect(binaryExpr.right).toBeInstanceOf(Literal)
        expect((binaryExpr.right as Literal).value).toBe(3)
    })
})



describe('complex equality expressions', () => {
    test('parses nested equality and comparison', () => {
        // Testing for an expression like: 5 > 3 == 2 < 4
        const tokens = [
            createNumberToken(5),
            createToken(TokenType.GREATER, ">", null),
            createNumberToken(3),
            createToken(TokenType.EQUAL_EQUAL, "==", null),
            createNumberToken(2),
            createToken(TokenType.LESS, "<", null),
            createNumberToken(4),
            createToken(TokenType.EOF, "", null)
        ]

        const expression = parseExpression(tokens)

        expect(expression).toBeInstanceOf(Binary)
        const topBinaryExpr = expression as Binary
        expect(topBinaryExpr.operator.type).toBe(TokenType.EQUAL_EQUAL)

        expect(topBinaryExpr.left).toBeInstanceOf(Binary)
        const leftBinaryExpr = topBinaryExpr.left as Binary
        expect(leftBinaryExpr.operator.type).toBe(TokenType.GREATER)
        expect((leftBinaryExpr.left as Literal).value).toBe(5)
        expect((leftBinaryExpr.right as Literal).value).toBe(3)

        expect(topBinaryExpr.right).toBeInstanceOf(Binary)
        const rightBinaryExpr = topBinaryExpr.right as Binary
        expect(rightBinaryExpr.operator.type).toBe(TokenType.LESS)
        expect((rightBinaryExpr.left as Literal).value).toBe(2)
        expect((rightBinaryExpr.right as Literal).value).toBe(4)
    })

    test('parses mixed equality and grouping', () => {
        // Testing for an expression like: (5 != 3) == (2 > 1)
        const tokens = [
            createToken(TokenType.LEFT_PAREN, "(", null),
            createNumberToken(5),
            createToken(TokenType.BANG_EQUAL, "!=", null),
            createNumberToken(3),
            createToken(TokenType.RIGHT_PAREN, ")", null),
            createToken(TokenType.EQUAL_EQUAL, "==", null),
            createToken(TokenType.LEFT_PAREN, "(", null),
            createNumberToken(2),
            createToken(TokenType.GREATER, ">", null),
            createNumberToken(1),
            createToken(TokenType.RIGHT_PAREN, ")", null),
            createToken(TokenType.EOF, "", null)
        ]

        const expression = parseExpression(tokens)

        expect(expression).toBeInstanceOf(Binary)
        const topBinaryExpr = expression as Binary
        expect(topBinaryExpr.operator.type).toBe(TokenType.EQUAL_EQUAL)

        expect(topBinaryExpr.left).toBeInstanceOf(Grouping)
        const leftGroup = topBinaryExpr.left as Grouping
        expect(leftGroup.expression).toBeInstanceOf(Binary)
        const leftBinary = leftGroup.expression as Binary
        expect(leftBinary.operator.type).toBe(TokenType.BANG_EQUAL)
        expect((leftBinary.left as Literal).value).toBe(5)
        expect((leftBinary.right as Literal).value).toBe(3)

        expect(topBinaryExpr.right).toBeInstanceOf(Grouping)
        const rightGroup = topBinaryExpr.right as Grouping
        expect(rightGroup.expression).toBeInstanceOf(Binary)
        const rightBinary = rightGroup.expression as Binary
        expect(rightBinary.operator.type).toBe(TokenType.GREATER)
        expect((rightBinary.left as Literal).value).toBe(2)
        expect((rightBinary.right as Literal).value).toBe(1)
    })
});

describe('complex expressions integration tests', () => {
    test('parses mixed binary, unary, comparison, and equality expressions', () => {
        // Testing for an expression like: !(5 + 3) * 2 == 16 / (4 - 2)
        const tokens = [
            createToken(TokenType.BANG, "!", null),
            createToken(TokenType.LEFT_PAREN, "(", null),
            createNumberToken(5),
            createToken(TokenType.PLUS, "+", null),
            createNumberToken(3),
            createToken(TokenType.RIGHT_PAREN, ")", null),
            createToken(TokenType.STAR, "*", null),
            createNumberToken(2),
            createToken(TokenType.EQUAL_EQUAL, "==", null),
            createNumberToken(16),
            createToken(TokenType.SLASH, "/", null),
            createToken(TokenType.LEFT_PAREN, "(", null),
            createNumberToken(4),
            createToken(TokenType.MINUS, "-", null),
            createNumberToken(2),
            createToken(TokenType.RIGHT_PAREN, ")", null),
            createToken(TokenType.EOF, "", null)
        ]

        const expression = parseExpression(tokens)

        expect(expression).toBeInstanceOf(Binary)
        const equalityExpr = expression as Binary
        expect(equalityExpr.operator.type).toBe(TokenType.EQUAL_EQUAL)

        expect(equalityExpr.left).toBeInstanceOf(Binary)
        const leftExpr = equalityExpr.left as Binary
        expect(leftExpr.operator.type).toBe(TokenType.STAR)

        expect(leftExpr.left).toBeInstanceOf(Unary)
        const unaryExpr = leftExpr.left as Unary
        expect(unaryExpr.operator.type).toBe(TokenType.BANG)

        expect(leftExpr.right).toBeInstanceOf(Literal)
        expect((leftExpr.right as Literal).value).toBe(2)

        expect(equalityExpr.right).toBeInstanceOf(Binary)
        const rightExpr = equalityExpr.right as Binary
        expect(rightExpr.operator.type).toBe(TokenType.SLASH)

        expect((rightExpr.left as Literal).value).toBe(16)
        expect(rightExpr.right).toBeInstanceOf(Grouping)
    })

    test('parses nested arithmetic, logical, and unary operations with grouping', () => {
        const tokens = [
            new Token(TokenType.NUMBER, "3", 3),
            new Token(TokenType.PLUS, "+", null),
            new Token(TokenType.NUMBER, "5", 5),
            new Token(TokenType.STAR, "*", null),
            new Token(TokenType.LEFT_PAREN, "(", null),
            new Token(TokenType.NUMBER, "2", 2),
            new Token(TokenType.MINUS, "-", null),
            new Token(TokenType.LEFT_PAREN, "(", null),
            new Token(TokenType.NUMBER, "1", 1),
            new Token(TokenType.PLUS, "+", null),
            new Token(TokenType.NUMBER, "1", 1),
            new Token(TokenType.RIGHT_PAREN, ")", null),
            new Token(TokenType.RIGHT_PAREN, ")", null),
            new Token(TokenType.GREATER_EQUAL, ">=", null),
            new Token(TokenType.BANG, "!", null),
            new Token(TokenType.NUMBER, "4", 4),
            new Token(TokenType.EOF, "", null)
        ];

        const parser = new ExpressionParser(tokens);
        const expression = parser.parse();

        expect(expression).toBeInstanceOf(Binary);
        const binaryExpr = expression as Binary;
        expect(binaryExpr.operator.type).toBe(TokenType.GREATER_EQUAL);

        const leftSide = binaryExpr.left as Binary;
        expect(leftSide.operator.type).toBe(TokenType.PLUS);

        const rightSide = binaryExpr.right as Unary;
        expect(rightSide.operator.type).toBe(TokenType.BANG);
        expect((rightSide.right as Literal).value).toBe(4);

        const multiplicationExpr = leftSide.right as Binary;
        expect(multiplicationExpr.operator.type).toBe(TokenType.STAR);

        const groupingExpr = multiplicationExpr.right as Grouping;
        const innerExpression = (groupingExpr.expression as Binary);
        expect(innerExpression.operator.type).toBe(TokenType.MINUS);
    });
})


describe('Logical Operator Parsing Tests', () => {
    test('parses logical AND (და)', () => {
        const tokens: Token[] = [
            new Token(TokenType.TRUE, "ჭეშმარიტი", true),
            new Token(TokenType.AND, "და", null),
            new Token(TokenType.FALSE, "მცდარი", false),
            new Token(TokenType.EOF, "", null)
        ];

        const expression = parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        const binaryExpr = expression as Binary;
        expect(binaryExpr.operator.type).toBe(TokenType.AND);
        expect((binaryExpr.left as Literal).value).toBe(true);
        expect((binaryExpr.right as Literal).value).toBe(false);
    });

    test('parses logical OR (ან)', () => {
        const tokens: Token[] = [
            new Token(TokenType.TRUE, "ჭეშმარიტი", true),
            new Token(TokenType.OR, "ან", null),
            new Token(TokenType.TRUE, "ჭეშმარიტი", true),
            new Token(TokenType.EOF, "", null)
        ];

        const expression = parseExpression(tokens);

        expect(expression).toBeInstanceOf(Binary);
        const binaryExpr = expression as Binary;
        expect(binaryExpr.operator.type).toBe(TokenType.OR);
        expect((binaryExpr.left as Literal).value).toBe(true);
        expect((binaryExpr.right as Literal).value).toBe(true);
    });
});


//
// describe('test ExpressionParser for logical expressions', () => {
//     test('parse complex logical and comparison expression', () => {
//         const tokens = [
//             new Token(TokenType.LEFT_PAREN, '(', null),
//             new Token(TokenType.NUMBER, '5', 5),
//             new Token(TokenType.GREATER_EQUAL, '>=', null),
//             new Token(TokenType.NUMBER, '5', 5),
//             new Token(TokenType.RIGHT_PAREN, ')', null),
//             new Token(TokenType.IDENTIFIER, 'და', null),
//             new Token(TokenType.LEFT_PAREN, '(', null),
//             new Token(TokenType.NUMBER, '3', 3),
//             new Token(TokenType.PLUS, '+', null),
//             new Token(TokenType.NUMBER, '2', 2),
//             new Token(TokenType.EQUAL_EQUAL, '==', null),
//             new Token(TokenType.NUMBER, '5', 5),
//             new Token(TokenType.RIGHT_PAREN, ')', null),
//             new Token(TokenType.IDENTIFIER, 'ან', null),
//             new Token(TokenType.LEFT_PAREN, '(', null),
//             new Token(TokenType.NUMBER, '10', 10),
//             new Token(TokenType.BANG_EQUAL, '!=', null),
//             new Token(TokenType.NUMBER, '2', 2),
//             new Token(TokenType.STAR, '*', null),
//             new Token(TokenType.NUMBER, '5', 5),
//             new Token(TokenType.RIGHT_PAREN, ')', null),
//             new Token(TokenType.EOF, '', null)
//         ];
//
//         const parser = new ExpressionParser(tokens);
//         const expression = parser.parse();
//
//         // expect(expression).toBeInstanceOf(Binary);
//         const topLevelOr = expression as Binary;
//         expect(topLevelOr.operator.type).toBe(TokenType.IDENTIFIER);
//         expect(topLevelOr.operator.lexeme).toBe('ან');
//
//         // Test the left-hand side (AND operation)
//         const leftAnd = topLevelOr.left as Binary;
//         expect(leftAnd.operator.lexeme).toBe('და');
//         expect(leftAnd.left).toBeInstanceOf(Grouping);
//         expect(leftAnd.right).toBeInstanceOf(Grouping);
//
//         // Test the right-hand side, simple comparison
//         const rightComparison = topLevelOr.right as Grouping;
//         expect(rightComparison.expression).toBeInstanceOf(Binary);
//
//         // Dive into the groups to assert their internal structures
//         const leftGroupExpression = (leftAnd.left as Grouping).expression as Binary;
//         expect(leftGroupExpression.left).toBeInstanceOf(Literal);
//         expect(leftGroupExpression.right).toBeInstanceOf(Literal);
//         expect(leftGroupExpression.operator.type).toBe(TokenType.GREATER_EQUAL);
//
//         const rightGroupExpression = (leftAnd.right as Grouping).expression as Binary;
//         expect(rightGroupExpression.left).toBeInstanceOf(Binary);
//         expect(rightGroupExpression.right).toBeInstanceOf(Literal);
//         expect(rightGroupExpression.operator.type).toBe(TokenType.EQUAL_EQUAL);
//
//         // Optionally continue to assert on nested Binary structures...
//     });
// });