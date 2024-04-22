import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";


export class VarStatement implements Statement {
    execute(): boolean {
        return false;
    }
    
    accept(visitor: Visitor): void {
        visitor.doVarStatement(this)
    }
}
