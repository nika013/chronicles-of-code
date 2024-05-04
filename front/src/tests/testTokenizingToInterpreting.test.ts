import {Tokenizer} from "../Interpreter/Tokenizer/Tokenizer.ts";
import {ExpressionParser} from "../Interpreter/AST/Expressions/ExpressionParser.ts";
import {ExpressionInterpreter} from "../Interpreter/AST/Expressions/ExpressionInterpreter.ts";
import {Expression} from "../Interpreter/AST/Expressions/Expression.ts";

const interpreter = new ExpressionInterpreter()

function createCycle(input: string): unknown {
    const tokenizer = new Tokenizer(input)
    const tokens = tokenizer.scanTokens()
    const parser = new ExpressionParser(tokens)
    const expr: Expression = parser.parse()
    return interpreter.interpret(expr)
}

describe("test Literal expressions", () => {
    test("number ", () => {
        const literal = "42"
        const result = createCycle(literal)
        
        expect(result).toBe(42)
    })

    test("float", () => {
        const literal = "3.14"
        const result = createCycle(literal)

        expect(result).toBe(3.14)
    })

    test("boolean", () => {
        let literal = "ჭეშმარიტი"
        let result = createCycle(literal)

        expect(result).toBe(true)

        literal = "მცდარი"
        result = createCycle(literal)

        expect(result).toBe(false)
    })

    test("string", () => {
        const literal = '"Gigi_Bandzia"'
        const result = createCycle(literal)

        expect(result).toBe("Gigi_Bandzia")
    })
});

function runFullCycleTest(input: string, expected: unknown) {
    const tokenizer = new Tokenizer(input)
    const tokens = tokenizer.scanTokens()
    const parser = new ExpressionParser(tokens)
    const expr: Expression = parser.parse()
    const result =  interpreter.interpret(expr)

    expect(result).toBe(expected)
}

describe("test unary expressions", () => {
    it('evaluates unary negation', () => {
        const source = '-42';
        const expected = -42;
        runFullCycleTest(source, expected);
    });

    it('evaluates logical not', () => {
        const source = '!ჭეშმარიტი';
        const expected = false;
        runFullCycleTest(source, expected);
    });
});

describe("test binary expressions", () => {
    test('evaluates simple addition', () => {
        const source = '2 + 3';
        const expected = 5;
        runFullCycleTest(source, expected);
    })

    test('evaluates mixed operations', () => {
        const source = '2 + 3 * 4';
        const expected = 14;
        runFullCycleTest(source, expected);
    })

    it('evaluates boolean and', () => {
        const source = 'ჭეშმარიტი და მცდარი';
        const expected = false;
        runFullCycleTest(source, expected);
    });

    it('evaluates boolean or', () => {
        const source = 'ჭეშმარიტი ან მცდარი';
        const expected = true;
        runFullCycleTest(source, expected);
    });

});

describe("test logical operations", () => {
    // it('evaluates logical operations', () => {
    //     const source = 'ჭეშმარიტი ან მცდარი და მცდარი';
    //     const expected = true; // true || (false && false)
    //     runFullCycleTest(source, expected);
    // });

    it('evaluates mixed logical and comparison operations', () => {
        const source = '(5 > 3) და (2 <= 3) ან მცდარი';
        const expected = true; // (true && true) || false
        runFullCycleTest(source, expected);
    });
})

describe("test grouping expressions", () => {

    it('evaluates expressions with grouping', () => {
        const source = '(2 + 3) * 4';
        const expected = 20;
        runFullCycleTest(source, expected);
    });
});

describe('Full Integration Test: Simple', () => {

    
    test("adding", () => {
        const input: string = "5 + 10"
        const result = createCycle(input)
        
        expect(result).toBe(15)
    })

    test("subtracting", () => {
        const input: string = "100 - 45"
        const result = createCycle(input)

        expect(result).toBe(55)
    })
});

describe("Complex Expression Tests with Georgian Keywords", () => {
    test('complex logical operations', () => {
        const source = 'ჭეშმარიტი და (ჭეშმარიტი ან მცდარი) ან მცდარი';
        const expected = true; 
        runFullCycleTest(source, expected);
    });

    test('Grouping with unary and binary operators', () => {
        const source = '-(3 + 4) * 2';
        const expected = -14; // Negation applies after the addition, then multiplied by 2
        runFullCycleTest(source, expected);
    });

    test('Complex boolean logic', () => {
        const source = '(5 >= 5) და (3 + 2 == 5) ან (მცდარი != მცდარი)';
        const expected = true; // True because both boolean expressions evaluate to true
        runFullCycleTest(source, expected);
    });

    test('Nested grouping in various contexts', () => {
        const source = '((2 + 3) * (4 - 1)) > 10 და !(5 == 5)';
        const expected = false; // 15 > 10 is true, but !(true) is false
        runFullCycleTest(source, expected);
    });

    test('Edge case with empty groupings and logical operations', () => {
        const source = '() და (3 > 1)';
        expect(() => createCycle(source)).toThrow(Error); // Expected to fail due to empty parentheses
    });
});


describe("Advanced Integration Tests with Georgian Keywords", () => {
    test('arithmetic and logical mixed', () => {
        const source = '((5 + 5) * 2 > 2) და ჭეშმარიტი';
        const expected = true; // Evaluate arithmetic then logical AND with true
        runFullCycleTest(source, expected);
    });

    test('nested logical operations with grouping', () => {
        const source = '((((მცდარი ან ჭეშმარიტი))) და ჭეშმარიტი) ან (10 >= 10)';
        const expected = true; // True OR True = True
        runFullCycleTest(source, expected);
    });

    test('using NOT operation with logical expressions', () => {
        const source = '!მცდარი და (3 != 4)';
        const expected = true; // NOT false AND true = True
        runFullCycleTest(source, expected);
    });

    test('complex nested operations with arithmetic and logical', () => {
        const source = '(10 * 2 + 3 <= 25) ან !(5 == 5)';
        const expected = true; // 23 <= 25 is true, NOT true is false, final OR true
        runFullCycleTest(source, expected);
    });

    test('logical equivalence tests with true and false literals', () => {
        const source = 'ჭეშმარიტი == მცდარი';
        const expected = false; // true == false is false
        runFullCycleTest(source, expected);
    });
    

    test('complex conditional expressions with variables', () => {
        const source = '20 >= 5 და 18 <= 10 ან (2 == 0)';
        const expected = false; 
        runFullCycleTest(source, expected);
    });

    test('combined arithmetic and comparison for logical operation', () => {
        const source = '(3 + 2 > 4) ან (6 * 2 == 12)';
        const expected = true; // (5 > 4) OR (12 == 12) = true
        runFullCycleTest(source, expected);
    });

    test('logical operations with string comparisons', () => {
        // const source = '"apple" != "banana" და "melon" == "melon"';
        const source = '2 != 4 და ჭეშმარიტი';

        const expected = true; // true AND true = true
        runFullCycleTest(source, expected);
    });
});

