import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";
import { VariableContainer } from "./VariableContainer";

export class StatementContainer extends VariableContainer {
    private statements: Statement[]

    constructor(statements: Statement[] = []) {
        super()
        this.statements = statements;
    }

    public addStatement(statement: Statement) {
        this.statements.push(statement)
    }

    public addStatements(newStatements: Statement[]) {
        this.statements.push(...newStatements);
    }

    public callStatements(visitor: Visitor) {
        this.statements.forEach((currentStatement: Statement) => {
            currentStatement.accept(visitor)
        });
    }
}
