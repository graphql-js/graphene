import { MountableInputField, isMountableInputField } from './mountable';
import { NonNull } from './structures';

export type InputFieldOptions = {
  required?: boolean | MountableInputField;
  description?: string;
};

export class InputField {
  type: any;
  options: InputFieldOptions;
  constructor(type: any, options: InputFieldOptions = {}) {
    if (options.required) {
      type = new NonNull(type);
    }
    this.type = type;
    this.options = options;
  }
}

export type UnmountedInputFieldMap = {
  [key: string]: InputField | MountableInputField;
};

export type MountedInputFieldMap = {
  [key: string]: InputField;
};

export const mountInputFields = (
  fields: UnmountedInputFieldMap
): MountedInputFieldMap => {
  var mountedFields: MountedInputFieldMap = {};
  for (let fieldName in fields) {
    let field = fields[fieldName];
    if (isMountableInputField(field)) {
      mountedFields[fieldName] = field.toInputField();
    } else if (field instanceof InputField) {
      mountedFields[fieldName] = field;
    } else {
      throw new Error(
        `Received incompatible input field: ${fieldName} ${field}.`
      );
    }
  }
  return mountedFields;
};
