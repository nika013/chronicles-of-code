import { ExpressionInterpreter } from "../Interpreter/AST/Expressions/ExpressionInterpreter"
import { VarType } from "../Interpreter/AST/Statements/ConcreteStatements/Environment"
import { ForStatement } from "../Interpreter/AST/Statements/ConcreteStatements/ForStatement"
import { FuncStatement } from "../Interpreter/AST/Statements/ConcreteStatements/FuncStatement"
import { IfStatement } from "../Interpreter/AST/Statements/ConcreteStatements/IfStatement"
import { VarStatement } from "../Interpreter/AST/Statements/ConcreteStatements/VarStatement"
import { WhileStatement } from "../Interpreter/AST/Statements/ConcreteStatements/WhileStatement"
import { StatementParser } from "../Interpreter/AST/Statements/StatementParser"
import { Tokenizer } from "../Interpreter/Tokenizer/Tokenizer"

describe('Parse Statements', () => {
    const exprInterpreter = new ExpressionInterpreter()
    test('var number statements', () => {
        const source = `რიცხვი ერთხელ = 1;`
        const varStatement = createStmtWithSource(source)[0] as VarStatement

        const actual = exprInterpreter.interpret(varStatement.intializer)
        expect(actual).toBe(1)
        expect(varStatement.type).toBe(VarType.NUMBER)
        expect(varStatement.name).toBe('ერთხელ')
    })

    test('var boolean statements', () => {
        const source = `ბულეანი არის_კედელი = ჭეშმარიტი;`
        const varStatement = createStmtWithSource(source)[0] as VarStatement

        const actual = exprInterpreter.interpret(varStatement.intializer)
        expect(actual).toBe(true)
        expect(varStatement.type).toBe(VarType.BOOLEAN)
        expect(varStatement.name).toBe('არის_კედელი')
    })

    test('var string statements', () => {
        const source = `სიტყვა გასაღები = "123ანანასი";`
        const varStatement = createStmtWithSource(source)[0] as VarStatement

        const actual = exprInterpreter.interpret(varStatement.intializer)
        expect(actual).toBe("123ანანასი")
        expect(varStatement.type).toBe(VarType.STRING)
        expect(varStatement.name).toBe('გასაღები')
    })

    test('if stmt with empty block', () => {
        const source = `\
        თუ (1 < 2) {
    
        }`
        const ifStmt = (createStmtWithSource(source)[0]) as IfStatement

        const actual = exprInterpreter.interpret(ifStmt.condition)
        expect(actual).toBe(true)
        expect(ifStmt.statements.length).toBe(0)
    })

    test('if stmt with var stmts in it', () => {
        const source = `\
        თუ (მცდარი) {
            რიცხვი ორჯერ = 2;
            სიტყვა გასაღები = "123ანანასი";

            ბულეანი არის_კედელი = ჭეშმარიტი;
        }`
        const ifStmt = (createStmtWithSource(source)[0]) as IfStatement

        let actual = exprInterpreter.interpret(ifStmt.condition)
        expect(actual).toBe(false)
        const firstVarStmt = ifStmt.statements[0] as VarStatement
        const childActualVal = exprInterpreter.interpret(firstVarStmt.intializer)
        expect(childActualVal).toBe(2)
        expect(firstVarStmt.type).toBe(VarType.NUMBER)
        expect(firstVarStmt.name).toBe('ორჯერ')  

        const secondVarStmt = ifStmt.statements[1] as VarStatement
        actual = exprInterpreter.interpret(secondVarStmt.intializer)
        expect(actual).toBe("123ანანასი")
        expect(secondVarStmt.type).toBe(VarType.STRING)
        expect(secondVarStmt.name).toBe('გასაღები')

        const thirdVarStmt = ifStmt.statements[2] as VarStatement
        actual = exprInterpreter.interpret(thirdVarStmt.intializer)
        expect(actual).toBe(true)
        expect(thirdVarStmt.type).toBe(VarType.BOOLEAN)
        expect(thirdVarStmt.name).toBe('არის_კედელი')
    })

    test('while stmt with var stmts in it', () => {
        const source = `\
        სანამ (მცდარი) {
            რიცხვი ორჯერ = 2;
            სიტყვა გასაღები = "123ანანასი";

            ბულეანი არის_კედელი = ჭეშმარიტი;
        }`
        const whileStmt = (createStmtWithSource(source)[0]) as WhileStatement

        let actual = exprInterpreter.interpret(whileStmt.condition)
        expect(actual).toBe(false)
        const firstVarStmt = whileStmt.statements[0] as VarStatement
        const childActualVal = exprInterpreter.interpret(firstVarStmt.intializer)
        expect(childActualVal).toBe(2)
        expect(firstVarStmt.type).toBe(VarType.NUMBER)
        expect(firstVarStmt.name).toBe('ორჯერ')  

        const secondVarStmt = whileStmt.statements[1] as VarStatement
        actual = exprInterpreter.interpret(secondVarStmt.intializer)
        expect(actual).toBe("123ანანასი")
        expect(secondVarStmt.type).toBe(VarType.STRING)
        expect(secondVarStmt.name).toBe('გასაღები')

        const thirdVarStmt = whileStmt.statements[2] as VarStatement
        actual = exprInterpreter.interpret(thirdVarStmt.intializer)
        expect(actual).toBe(true)
        expect(thirdVarStmt.type).toBe(VarType.BOOLEAN)
        expect(thirdVarStmt.name).toBe('არის_კედელი')
    })

    test('for stmt with var', () => {
        const source = `
        გაიმეორე 5 {
            რიცხვი ორჯერ = 2;
            სიტყვა გასაღები = "123ანანასი";
            ბულეანი არის_კედელი = ჭეშმარიტი;
        }
        `

        const forStmt = (createStmtWithSource(source)[0]) as ForStatement

        let actualIterCount = forStmt.iterationCount
        expect(actualIterCount).toBe(5)
        const firstVarStmt = forStmt.statements[0] as VarStatement
        const childActualVal = exprInterpreter.interpret(firstVarStmt.intializer)
        expect(childActualVal).toBe(2)
        expect(firstVarStmt.type).toBe(VarType.NUMBER)
        expect(firstVarStmt.name).toBe('ორჯერ')  

        const secondVarStmt = forStmt.statements[1] as VarStatement
        let actual = exprInterpreter.interpret(secondVarStmt.intializer)
        expect(actual).toBe("123ანანასი")
        expect(secondVarStmt.type).toBe(VarType.STRING)
        expect(secondVarStmt.name).toBe('გასაღები')

        const thirdVarStmt = forStmt.statements[2] as VarStatement
        actual = exprInterpreter.interpret(thirdVarStmt.intializer)
        expect(actual).toBe(true)
        expect(thirdVarStmt.type).toBe(VarType.BOOLEAN)
        expect(thirdVarStmt.name).toBe('არის_კედელი')
    })

    test('simple func call', () => {
        const source = `წინ()`
        const funcStmt = (createStmtWithSource(source)[0]) as FuncStatement
        expect(funcStmt.funcName).toBe('წინ')
    })
})

function createStmtWithSource(source: string) {
    const tokenizer = new Tokenizer(source)
    const tokens = tokenizer.scanTokens()

    const parser = new StatementParser(tokens)
    return parser.parse()
}