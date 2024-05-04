import { Statement } from "../Interfaces/Statement.ts";
import { Visitor } from "../Interfaces/Visitor.ts";
import { Expression } from "../../Expressions/Expression.ts";
import { ConditionalStatement } from "./ConditionalStatement.ts";

export class WhileStatement extends ConditionalStatement implements Statement {

    constructor(statements: Statement[] = [], expression: Expression) {
        super(statements, expression);
    }

    public accept(visitor: Visitor): void {
        visitor.doWhileStatement(this)
    }
}
