import {Expression} from "./Expression.ts";
import {RuntimeError} from "./RuntimeError.ts";
import {ExpressionVisitor} from "./ExpressionVisitor/ExpressionVisitor.ts";
import {Literal} from "./ConcreteExpressions/Literal.ts";
import {Binary} from "./ConcreteExpressions/Binary.ts";
import {Grouping} from "./ConcreteExpressions/Grouping.ts";
import {Unary} from "./ConcreteExpressions/Unary.ts";
import {TokenType} from "../../Tokenizer/TokenType.ts";
import {Token} from "../../Tokenizer/Token.ts";
import { VarExpr } from "./ConcreteExpressions/VarExpr.ts";
import { Environment } from "../Statements/ConcreteStatements/Environment.ts";

export class ExpressionInterpreter implements ExpressionVisitor<unknown>  {
    private globalEnvironment: Environment
    private localEnvironments: Environment[] = []

    setGlobalEnvironment(env: Environment) {
        this.globalEnvironment = env
    }

    setLocalEnvironments(envs: Environment[]) {
        this.localEnvironments = envs
    }

    addLocalEnvironment(env: Environment) {
        this.localEnvironments.push(env)
    }

    interpret(expression: Expression): unknown {
        try {
            return this.evaluate(expression);
            // console.log(this.stringify(value));
        } catch (error) {
            if (error instanceof RuntimeError) {
                console.error(`${error.message} [line ${error.token.line}]`);
                // Additional error handling...
            } else {
                throw error; // Re-throw unexpected errors
            }
        }
    }
    
    private evaluate(expr: Expression): unknown {
        // console.log(`Evaluating: ${expr.constructor.name}`, expr);
        return expr.accept(this)
    }
    
    protected stringify(object: unknown): string {
        if (object === null) return 'nil';
        // Logic to convert Lox value to string representation
        if (typeof object != "undefined")
        {
            return object.toString();
        }else {
            throw new Error("object is undefined")
        }
    }

    visitLiteralExpr(expr: Literal): unknown {
        return expr.value;
    }
    
    private isOfType(type: string, left: unknown, right: unknown) {
        return (typeof left === type && typeof right === type)
    }

    visitBinaryExpr(binaryExpr: Binary): unknown {
        const left = this.evaluate(binaryExpr.left);
        const right = this.evaluate(binaryExpr.right);

        switch (binaryExpr.operator.type) {
            case TokenType.PLUS:
                if (this.isOfType('number', left, right)) {
                    return <number>left + <number>right;
                } else if (this.isOfType('string', left, right)) {
                    return <string>left + <string>right;
                } else {
                    throw new Error("Both operands must be numbers or strings for '+' operation.");
                }
            case TokenType.MINUS:
                if (this.isOfType('number', left, right)) {
                    return <number>left - <number>right;
                } else {
                    throw new Error("Both operands must be numbers for '-' operation.");
                }
            case TokenType.STAR:
                if (this.isOfType('number', left, right)) {
                    return <number>left * <number>right;
                } else {
                    throw new Error("Both operands must be numbers for '*' operation.");
                }
            case TokenType.SLASH:
                if (this.isOfType('number', left, right)) {
                    return <number>left / <number>right;
                } else {
                    throw new Error("Both operands must be numbers for '/' operation.");
                }  
            case TokenType.GREATER:
                if (this.isOfType('number', left, right)) {
                    return <number>left > <number>right;
                } else {
                    throw new Error("Both operands must be numbers for '>' operation.");
                }
            case TokenType.GREATER_EQUAL:
                if (this.isOfType('number', left, right)) {
                    return <number>left >= <number>right;
                } else {
                    throw new Error("Both operands must be numbers for '>=' operation.");
                }
            case TokenType.LESS:
                if (this.isOfType('number', left, right)) {
                    return <number>left < <number>right;
                } else {
                    throw new Error("Both operands must be numbers for '<' operation.");
                }
            case TokenType.LESS_EQUAL:
                if (typeof left === 'number' && typeof right === 'number') {
                    return left <= right;
                } else {
                    throw new Error("Both operands must be numbers for '<=' operation.");
                }
            case TokenType.EQUAL_EQUAL:
                if (this.isOfType('number', left, right) ||
                    this.isOfType('string', left, right) ||
                    this.isOfType('boolean', left, right)) {
                    return left === right;
                } else {
                    throw new Error("Both operands must be numbers for '==' operation.");
                }
            case TokenType.EQUAL:
                if ((this.isOfType('number', left, right)) ||
                    this.isOfType('string', left, right) ||
                    this.isOfType('boolean', left, right)) {
                    return left === right;
                } else {
                    throw new Error("Both operands must be numbers for '==' operation.");
                }
            case TokenType.AND:
                if (this.isOfType('boolean', left, right)) {
                    return left && right;
                } else {
                    // console.log("და -> left: " + left + "  right:  " + right)
                    throw new Error("Both operands must be booleans for 'და' operation.");
                }
            case TokenType.OR:
                if (this.isOfType('boolean', left, right)) {
                    return left || right;
                } else {
                    throw new Error("Both operands must be boolean for 'ან' operation.");
                }
            case TokenType.BANG_EQUAL:
                if (this.isOfType('boolean', left, right)  ||
                    this.isOfType('number', left, right) ||
                    this.isOfType('string', left, right)) {
                    return left != right;
                } else {
                    throw new Error("Both operands must be numbers/booleans for '!=' operation.");
                }    
            default:
                throw new Error("Unhandled binary operator " + binaryExpr.left + " "  + 
                    binaryExpr.operator +  " "  + binaryExpr.right);
        }
    }
    
    visitGroupingExpr(groupingExpr: Grouping): unknown {
        // To evaluate a grouping expression, simply evaluate the expression inside the group.
        return this.evaluate(groupingExpr.expression);
    }

    visitUnaryExpr(unaryExpr: Unary): unknown {
        const right = this.evaluate(unaryExpr.right);

        switch (unaryExpr.operator.type) {
            case TokenType.MINUS:
                this.checkNumberOperand(unaryExpr.operator, right);
                return (-1)*(<number>right);
            case TokenType.BANG:
                return !(<boolean>this.isTruthy(right));
            // ... other cases for different unary operators
                // add if something else is needed
            default:
                throw new Error(`Unknown unary operator: ${unaryExpr.operator.lexeme}`);
        }
    }

    visitVarExpr(varExpr: VarExpr): unknown {
        let variable = this.globalEnvironment.getVariable(varExpr.name.lexeme);
        if (!variable) {
            for (const env of this.localEnvironments) {
                variable = env.getVariable(varExpr.name.lexeme);
                if (variable) {
                    break;
                }
            }
        }
        return variable?.value;
    }
    
    private checkNumberOperand(operator: Token, operand: unknown): void {
        if (typeof operand !== 'number') {
            throw new Error(`Operand must be a number. Found ${operand} for operator ${operator.lexeme}.`);
        }
    }

    private isTruthy(object: unknown): boolean {
        if (object === null) return false;
        if (typeof object === 'boolean') return object as boolean;
        return true;
    }
}
