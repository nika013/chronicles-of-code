import {Expression} from "../Expression";

export class Literal extends Expression {
    value: never
    constructor(value: never) {
        super();
        this.value = value
    }
}