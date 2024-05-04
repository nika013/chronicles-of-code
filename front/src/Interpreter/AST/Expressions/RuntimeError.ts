import {Token} from "../../Token.ts";

export class RuntimeError extends Error {
    constructor(public token: Token, message: string) {
        super(message);
        this.name = 'RuntimeError';
        // Additional logic...
    }
}
