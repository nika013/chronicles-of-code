import { Expression } from "../../Expressions/Expression";
import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";
import { Variable } from "./VariableContainer";

export class VarStatement implements Statement {
    
    private variable: Variable
    private expression: Expression

    constructor(variable: Variable, expression: Expression) {
        this.variable = variable
        this.expression = expression
    }

    public getVariable(): Variable {
        return this.variable
    }

    public accept(visitor: Visitor): void {
        visitor.doVarStatement(this)
    }
}
