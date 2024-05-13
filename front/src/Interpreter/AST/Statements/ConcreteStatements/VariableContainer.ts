export type VariableValue = string | null

export class Variable {
    private name: string
    private value: VariableValue

    constructor(name: string, value: VariableValue) {
        this.name = name;
        this.value = value;
    }

    public getName(): string {
        return this.name
    }

    public getValue(): VariableValue {
        return this.value
    }

    public setValue(newValue: VariableValue) {
        if (typeof newValue == typeof this.value) {
            this.value = newValue
        } else {
            throw new Error('Type mismatch: Cannot assign a value of different type.');
        }
    }
}

export class VariableContainer {
    private variables: Map<string, Variable>;

    constructor() {
        this.variables = new Map<string, Variable>();
    }

    public addVariable(variable: Variable): void {
        this.variables.set(variable.getName(), variable);
    }

    public getVariable(name: string): Variable | undefined {
        return this.variables.get(name);
    }

    /**
     * TODO check if types matches of prev variable and new
     * @param variableName 
     * @param newValue 
     */
    public setValue(variableName: string, newValue: VariableValue): void {
        const variable = this.variables.get(variableName);
        if (variable) {
            variable.setValue(newValue);
        } else {
            throw new Error(`Variable '${variableName}' does not exist.`);
        }
    }
}
