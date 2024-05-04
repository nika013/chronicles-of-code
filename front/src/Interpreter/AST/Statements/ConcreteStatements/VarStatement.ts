import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";
import { Variable } from "./VariableContainer";

export class VarStatement implements Statement {
    
    private variable: Variable

    constructor(variable: Variable) {
        this.variable = variable
    }

    public getVariable(): Variable {
        return this.variable
    }

    public accept(visitor: Visitor): void {
        visitor.doVarStatement(this)
    }
}
