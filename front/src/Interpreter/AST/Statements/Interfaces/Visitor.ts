import { ForStatement } from "../ConcreteStatements/ForStatement"
import { FuncStatement } from "../ConcreteStatements/FuncStatement"
import { IfStatement } from "../ConcreteStatements/IfStatement"
import { VarStatement } from "../ConcreteStatements/VarStatement"
import { WhileStatement } from "../ConcreteStatements/WhileStatement"

export interface Visitor {
    doWhileStatement(statement: WhileStatement): boolean
    doIfStatement(statement: IfStatement): boolean
    doFuncStatement(statement: FuncStatement): boolean
    doVarStatement(statement: VarStatement): boolean
    doForStatement(statement: ForStatement): boolean
}
