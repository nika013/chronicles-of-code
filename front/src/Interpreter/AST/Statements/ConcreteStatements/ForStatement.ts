import { Statement } from "../Interfaces/Statement";
import { StatementContainer } from "./StatementContainer";
import { Visitor } from "../Interfaces/Visitor";

export class ForStatement extends StatementContainer implements Statement {
    private iterationCount: number

    constructor(statements: Statement[] = [], iterationCount: number) {
        super();
        this.iterationCount = iterationCount;
    }

    public getIterationCount(): number {
        return this.iterationCount
    }

    public accept(visitor: Visitor): void {
        visitor.doForStatement(this)
    }
}
