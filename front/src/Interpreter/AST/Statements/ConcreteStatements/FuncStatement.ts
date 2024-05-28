import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";

export class FuncStatement implements Statement {
    funcName: string

    constructor(funcName: string) {
        this.funcName = funcName
    }

    accept(visitor: Visitor): void {
        visitor.doFuncStatement(this)
    }
    
}