import { GraphQLList, GraphQLNonNull } from 'graphql';
import { GraphQLClassType, getGraphQLType } from './base';
import {
  MountableField,
  MountableArgument,
  MountableInputField,
  Mountable
} from './mountable';
import { Field, FieldOptions } from './field';
import { Argument, ArgumentOptions } from './argument';
import { InputField, InputFieldOptions } from './inputfield';

type AllOptions = FieldOptions<any> | ArgumentOptions | InputFieldOptions;

export class List extends Mountable
  implements MountableField, MountableArgument, MountableInputField {
  ofType: GraphQLClassType;
  options: AllOptions;
  constructor(ofType: GraphQLClassType, ...args: any[]) {
    super(...args);
    this.ofType = ofType;
  }
  get gql() {
    if (this.options) {
      throw new Error(
        `The List options: ${this.options} will be dismissed.` +
          `You will need to mount as a Field with using INSTANCE.toField()`
      );
    }
    return new GraphQLList(getGraphQLType(this.ofType));
  }
  toField(): Field {
    return new Field(new List(this.ofType), <FieldOptions<any>>this.options);
  }
  toArgument(): Argument {
    return new Argument(new List(this.ofType), <ArgumentOptions>this.options);
  }
  toInputField(): InputField {
    return new InputField(new List(this.ofType), <InputFieldOptions>this
      .options);
  }
}

export class NonNull extends Mountable
  implements MountableField, MountableArgument {
  ofType: GraphQLClassType;
  options: AllOptions;
  constructor(ofType: GraphQLClassType, ...args: any[]) {
    super(...args);
    this.ofType = ofType;
  }
  get gql() {
    if (this.options) {
      throw new Error(
        `The NonNull options: ${this.options} will be dismissed.` +
          `You will need to mount as a Field with using INSTANCE.toField()`
      );
    }
    return new GraphQLNonNull(getGraphQLType(this.ofType));
  }
  toField(): Field {
    return new Field(new NonNull(this.ofType), <FieldOptions<any>>this.options);
  }
  toArgument(): Argument {
    return new Argument(new NonNull(this.ofType), <ArgumentOptions>this
      .options);
  }
  toInputField(): InputField {
    return new InputField(new NonNull(this.ofType), <InputFieldOptions>this
      .options);
  }
}
