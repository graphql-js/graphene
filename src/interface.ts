import {
  GraphQLInterfaceType,
  GraphQLResolveInfo,
  GraphQLObjectType
} from "graphql";
import {
  UnmountedFieldMap,
  MountedFieldMap,
  mountFields,
  Field
} from "./field";
import { constructArgs } from "./argument";
import { ObjectType, ResolverFunction } from "./objecttype";
import { GraphQLClassType, getGraphQLType } from "./base";

export class Interface<T = any> extends GraphQLClassType {
  static gql: GraphQLInterfaceType;
  static _fields: UnmountedFieldMap;
  static get fields() {
    return this._fields;
  }
  static set fields(fields: UnmountedFieldMap) {
    this._fields = fields;
  }
  static get mountedFields(): MountedFieldMap {
    return mountFields(this.fields);
  }
  static constructType(): GraphQLInterfaceType {
    return new GraphQLInterfaceType({
      name: this.typeName,
      description: this.description,
      fields: () => {
        var graphqlFields: {[key: string]: any;} = {};
        for (let fieldName in this.mountedFields) {
          graphqlFields[fieldName] = this.mountedFields[fieldName].gql;
        }
        return graphqlFields;
      },
      resolveType: (...args: any[]) => {
        const resolvedType = this.resolveType(...args);
        if (
          typeof resolvedType === "string" ||
          resolvedType instanceof GraphQLObjectType
        ) {
          return resolvedType;
        }
        if (resolvedType && resolvedType.prototype instanceof ObjectType) {
          return resolvedType.gql;
        }
        throw new Error(`Received non-processable type ${resolvedType}`);
      }
    });
  }
  static resolveType: (
    root?: any,
    context?: any,
    info?: GraphQLResolveInfo
  ) => any; // typeof ObjectType | GraphQLObjectType | string;

  static resolvers: {
    [key: string]: ResolverFunction<any>;
  } = {};
}
