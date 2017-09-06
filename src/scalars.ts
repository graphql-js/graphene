import {
  GraphQLScalarType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat
} from "graphql";
import { Field } from "./field";
import { InputField } from "./inputfield";
import { Argument } from "./argument";
import { MountableField, MountableInputField, MountableArgument } from "./mountable";
import { GraphQLClassType } from "./base";

export class Scalar extends GraphQLClassType
  implements MountableField, MountableArgument, MountableInputField {
  args: any[];
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
  constructor(...args: any[]) {
    super();
    this.args = args;
  }
  toField(): Field {
    var type = (<typeof Scalar>this.constructor).gql;
    return new Field(type, ...this.args);
  }
  toArgument(): Argument {
    var type = (<typeof Scalar>this.constructor).gql;
    return new Argument(type, ...this.args);
  }
  toInputField(): InputField {
    var type = (<typeof Scalar>this.constructor).gql;
    return new InputField(type, ...this.args);
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
