import { Expression } from "../../Expressions/Expression";
import { Statement } from "../Interfaces/Statement";
import { StatementContainer } from "./StatementContainer";

export class ConditionalStatement extends StatementContainer {
    condition: Expression

    constructor(statements: Statement[] = [], condition: Expression) {
        super(statements);
        this.condition = condition
    }
}
