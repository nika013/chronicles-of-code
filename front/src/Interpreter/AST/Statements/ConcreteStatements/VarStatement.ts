import { Expression } from "../../Expressions/Expression";
import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";
import { VarType } from "./Environment";

export class VarStatement implements Statement {
    type: VarType
    name: string
    intializer: Expression

    constructor(type: VarType, name: string, initalizer: Expression) {
        this.type = type 
        this.name = name
        this.intializer = initalizer
    }
    
    accept(visitor: Visitor): void {
        visitor.doVarStatement(this)
    }
}
