import { Statement } from "../Interfaces/Statement";
import { StatementContainer } from "./StatementContainer";
import { Visitor } from "../Interfaces/Visitor";

export class ForStatement extends StatementContainer implements Statement {
    execute(): boolean {
        throw new Error("Method not implemented.");
    }
    accept(visitor: Visitor): void {
        visitor.doForStatement(this)
    }

}