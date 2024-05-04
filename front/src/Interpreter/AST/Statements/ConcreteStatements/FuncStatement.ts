import { Statement } from "../Interfaces/Statement";
import { Visitor } from "../Interfaces/Visitor";

export class FuncStatement implements Statement {
    private funcName: string

    constructor(funcName: string) {
        this.funcName = funcName
    }

    public getFuncName(): string {
        return this.funcName
    }

    public accept(visitor: Visitor): void {
        visitor.doFuncStatement(this)
    }
}
