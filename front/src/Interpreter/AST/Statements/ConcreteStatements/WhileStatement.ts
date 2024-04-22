import { Statement } from "../Interfaces/Statement.ts";
import { StatementContainer } from "./StatementContainer.ts";
import { Visitor } from "../Interfaces/Visitor.ts";

export class WhileStatement extends StatementContainer implements Statement {
    
    
    accept(visitor: Visitor): void {
        visitor.doWhileStatement(this)
    }
}