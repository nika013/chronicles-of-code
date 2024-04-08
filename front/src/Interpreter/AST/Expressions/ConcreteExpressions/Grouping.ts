import {Expression} from "../Expression";

export class Grouping extends Expression {
    expression: Expression
    constructor(expression: Expression) {
        super();
        this.expression = expression
    }
}