import { MountableField, isMountableField } from "./mountable";
import { NonNull } from "./structures";
import { MountedArgumentMap, UnMountedArgumentMap, mountArguments } from "./argument";
import { ResolverFunction } from "./objecttype";

type FieldOptions = {
    required?: boolean | MountableField,
    description?: string,
    args?: UnMountedArgumentMap
}

export class Field {
    type: any
    options: FieldOptions;
    args: MountedArgumentMap;
    constructor(type: any, options: FieldOptions = {}) {
        if (options.required) {
            type = new NonNull(type);
        }
        this.type = type;
        this.options = options;
        this.args = mountArguments(this.options.args || {})
    }
    getResolver<T=any>(parentResolver: ResolverFunction<T>) {
        return parentResolver;
    }
}

export type UnmountedFieldMap = {
    [key: string]: Field | MountableField
};

export type MountedFieldMap = {
    [key: string]: Field
};

export const mountFields = (fields: UnmountedFieldMap): MountedFieldMap => {
    var mountedFields: MountedFieldMap = {};
    for (let fieldName in fields) {
        let field = fields[fieldName];
        if (isMountableField(field)) {
            mountedFields[fieldName] = field.toField();
        }
        else if (field instanceof Field) {
            mountedFields[fieldName] = field;
        }
        else {
            throw new Error(`Received incompatible field: ${fieldName} ${field}.`)
        }
    }
    return mountedFields;
}
