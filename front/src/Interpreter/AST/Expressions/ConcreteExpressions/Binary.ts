import {Expression} from "../Expression";
import {Token} from "../../Token";

export class Binary extends Expression {
    constructor(left: Expression, operator: Token, right: Expression) {
        super();
        this.left = left
        this.operator = operator
        this.right = right
    }
}