
export class Environment {
    private env: Map<string, Variable>

    constructor() {
        this.env = new Map()
    }

    addOrSetVariable(variable: Variable) {
        if (this.shouldBeAdded(variable)) {
            this.env.set(variable.name, variable);
        }
    }

    shouldBeAdded(variable: Variable): boolean {
        return (!this.env.has(variable.name)) || (this.getVariable(variable.name)?.type == variable.type)
    }

    getVariable(name: string): Variable | undefined {
        if (this.env.has(name)) {
            return this.env.get(name)
        }
    }
}

export class Variable {
    type: VarType
    name: string
    value: VarValue

    constructor(type: VarType, name: string, value: VarValue) {
        this.type = type
        this.name = name
        this.value = value
    }
}

export type VarValue = string | boolean | number

export enum VarType {
    STRING = "სიტყვა",
    NUMBER = "რიცხვი",
    BOOLEAN = "ბულეანი"
}