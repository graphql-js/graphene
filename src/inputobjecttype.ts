import { GraphQLInputObjectType } from "graphql";

import { MountableInputField } from "./mountable";
import { GraphQLClassType, getGraphQLType } from "./base";
import {
  UnmountedInputFieldMap,
  MountedInputFieldMap,
  mountInputFields,
  InputField
} from "./inputfield";

export class InputObjectType extends GraphQLClassType
  implements MountableInputField {
  static gql: GraphQLInputObjectType;
  static fields: UnmountedInputFieldMap;
  static get mountedFields(): MountedInputFieldMap {
    return mountInputFields(this.fields);
  }
  static constructType(): GraphQLInputObjectType {
    return new GraphQLInputObjectType({
      name: this.typeName,
      description: this.description,
      fields: () => {
        var graphqlFields: {[key: string]: any;} = {};
        for (let fieldName in this.mountedFields) {
          let field: InputField = this.mountedFields[fieldName];
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
}
