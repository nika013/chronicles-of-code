import {Expression} from "../Expression";

export class Literal extends Expression {
    // value should be never but it goes red :(((
    value: never
    constructor(value: never) {
        super();
        this.value = value
    }
}