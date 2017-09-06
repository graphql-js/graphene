import { Field } from "./field";
import { Argument } from "./argument";

export class Mountable {
    args: any[];
    constructor(...args: any[]) {
        this.args = args;
    }
}

export interface MountableField {
    toField(): Field
}

export interface MountableArgument {
    toArgument(): Argument
}


export const isMountableField = (object: any): object is MountableField => {
    return 'toField' in object;
}

export const isMountableArgument = (object: any): object is MountableArgument => {
    return 'toArgument' in object;
}
