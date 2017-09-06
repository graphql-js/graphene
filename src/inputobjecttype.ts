import { GraphQLInputObjectType } from 'graphql';

import { MountableInputField, MountableArgument } from './mountable';
import { GraphQLClassType, getGraphQLType } from './base';
import {
  UnmountedInputFieldMap,
  MountedInputFieldMap,
  mountInputFields,
  InputField
} from './inputfield';
import { Argument } from './argument';

export class InputObjectType extends GraphQLClassType
  implements MountableInputField, MountableArgument {
  static gql: GraphQLInputObjectType;
  static fields: UnmountedInputFieldMap;
  static constructType(): GraphQLInputObjectType {
    return new GraphQLInputObjectType({
      name: this.typeName,
      description: this.description,
      fields: () => {
        var mountedFields = mountInputFields(this.fields);
        var graphqlFields: { [key: string]: any } = {};
        for (let fieldName in mountedFields) {
          let field: InputField = mountedFields[fieldName];
          graphqlFields[fieldName] = {
            type: getGraphQLType(field.type),
            description: field.options.description
          };
        }
        return graphqlFields;
      }
    });
  }

  args: any[];
  constructor(...args: any[]) {
    super();
    this.args = args;
  }
  toInputField(): InputField {
    return new InputField(
      <typeof InputObjectType>this.constructor,
      ...this.args
    );
  }
  toArgument(): Argument {
    return new Argument(<typeof InputObjectType>this.constructor, ...this.args);
  }
}
