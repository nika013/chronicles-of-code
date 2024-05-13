import { Expression } from "../../Expressions/Expression";
import { Statement } from "../Interfaces/Statement";
import { StatementContainer } from "./StatementContainer";

export class ConditionalStatement extends StatementContainer {
    private expression: Expression

    constructor(statements: Statement[] = [], expression: Expression) {
        super(statements);
        this.expression = expression
    }

    public getExpression(): Expression {
        return this.expression
    }
}
