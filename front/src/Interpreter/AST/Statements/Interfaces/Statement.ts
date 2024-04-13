import { Visitor } from "./Visitor"

export interface Statement {
    
    // returns true if the statement executed successfully
    execute(): boolean
    accept(visitor: Visitor): void
}
