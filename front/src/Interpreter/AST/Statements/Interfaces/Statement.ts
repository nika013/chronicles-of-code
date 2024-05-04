import { Visitor } from "./Visitor"

export interface Statement {
    accept(visitor: Visitor): void
}
