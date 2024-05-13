import { Statement } from "../Interfaces/Statement.ts";
import { Visitor } from "../Interfaces/Visitor.ts";
import { ConditionalStatement } from "./ConditionalStatement.ts";
import { Expression } from "../../Expressions/Expression.ts";

export class IfStatement extends ConditionalStatement implements Statement {

    constructor(statements: Statement[] = [], expression: Expression) {
        super(statements, expression);
    }

    public accept(visitor: Visitor): void {
        visitor.doIfStatement(this)
    }
}
