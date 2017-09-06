import { Field } from './field';
import { Argument } from './argument';
import { InputField } from './inputfield';

export class Mountable {
  args: any[];
  constructor(...args: any[]) {
    this.args = args;
  }
}

export interface MountableField {
  toField(): Field;
}

export interface MountableArgument {
  toArgument(): Argument;
}

export interface MountableInputField {
  toInputField(): InputField;
}

export const isMountableField = (object: any): object is MountableField => {
  return 'toField' in object;
};

export const isMountableArgument = (
  object: any
): object is MountableArgument => {
  return 'toArgument' in object;
};

export const isMountableInputField = (
  object: any
): object is MountableInputField => {
  return 'toInputField' in object;
};
