import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";

export class StatementContainer {
    private statements: Statement[]
    private visitor: Visitor | null

    constructor() {
        this.statements = [];
        this.visitor = null;
    }

    public addStatement(statement: Statement) {
        this.statements.push(statement)
    }

    public setVisitor(v: Visitor) {
        this.visitor = v
    }

    public callStatements() {
        this.statements.forEach((currentStatement: Statement) => {
            if (this.visitor != null) {
                currentStatement.accept(this.visitor)
            }
        });
    }
}