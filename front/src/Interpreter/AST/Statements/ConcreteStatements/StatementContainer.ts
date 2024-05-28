import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";

/**
 * This class holds child statements. You can add statements and then 
 * call for each one its execution logic. How to execute each statement 
 * is responsibility of visitor property. 
 * this class can be subclassed by the Statement classes which hold can 
 * have more statements in their scope. For exmaple IfStatement, ForStatement.
 * This class also should be used for implementing Root node of the tree.
 */
export class StatementContainer {
    statements: Statement[]

    constructor(statements: Statement[] = []) {
        this.statements = statements;
    }

    public addStatement(statement: Statement) {
        this.statements.push(statement)
    }

    public callStatements(visitor: Visitor) {
        this.statements.forEach((currentStatement: Statement) => {
            currentStatement.accept(visitor)
        });
    }
}