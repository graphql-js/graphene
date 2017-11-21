import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql';
import { Field, FieldOptions } from './field';
import { InputField, InputFieldOptions } from './inputfield';
import { Argument, ArgumentOptions } from './argument';
import {
  MountableField,
  MountableInputField,
  MountableArgument
} from './mountable';
import { GraphQLClassType } from './base';

export type ScalarOptions = FieldOptions<any> | InputFieldOptions | ArgumentOptions;

export class Scalar<T = ScalarOptions> extends GraphQLClassType
  implements MountableField, MountableArgument, MountableInputField {
  options?: T;
  static gql: GraphQLScalarType;
  static serialize: (value: any) => any;
  static parseLiteral: (value: any) => any;
  static parseValue: (value: any) => any;
  static constructType() {
    return new GraphQLScalarType({
      name: this.typeName,
      description: this.description,
      serialize: this.serialize,
      parseLiteral: this.parseLiteral,
      parseValue: this.parseValue
    });
  }
  constructor(options?: T) {
    super();
    this.options = options;
  }
  toField(): Field {
    var type = <typeof Scalar>this.constructor;
    return new Field(type, <FieldOptions<any>>this.options);
  }
  toArgument(): Argument {
    var type = <typeof Scalar>this.constructor;
    return new Argument(type, <ArgumentOptions>this.options);
  }
  toInputField(): InputField {
    var type = <typeof Scalar>this.constructor;
    return new InputField(type, <InputFieldOptions>this.options);
  }
}
export class Str extends Scalar {
  static constructType() {
    return GraphQLString;
  }
}

export const String = Str;

export class Boolean extends Scalar {
  static constructType() {
    return GraphQLBoolean;
  }
}

export class ID extends Scalar {
  static constructType() {
    return GraphQLID;
  }
}

export class Int extends Scalar {
  static constructType() {
    return GraphQLInt;
  }
}

export class Float extends Scalar {
  static constructType() {
    return GraphQLFloat;
  }
}
