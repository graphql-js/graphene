import {
  GraphQLInterfaceType,
  GraphQLResolveInfo,
  GraphQLObjectType
} from 'graphql';
import { UnmountedFieldMap, mountFields } from './field';
import { ObjectType, ResolverFunction } from './objecttype';
import { GraphQLClassType } from './base';

export class Interface extends GraphQLClassType {
  static gql: GraphQLInterfaceType;
  static _fields: UnmountedFieldMap;
  static get fields() {
    return this._fields;
  }
  static set fields(fields: UnmountedFieldMap) {
    this._fields = fields;
  }
  static constructType(): GraphQLInterfaceType {
    return new GraphQLInterfaceType({
      name: this.typeName,
      description: this.description,
      fields: () => {
        var mountedFields = mountFields(this.fields);
        var graphqlFields: { [key: string]: any } = {};
        for (let fieldName in mountedFields) {
          graphqlFields[fieldName] = mountedFields[fieldName].gql;
        }
        return graphqlFields;
      },
      resolveType: (...args: any[]) => {
        const resolvedType = this.resolveType(...args);
        if (
          typeof resolvedType === 'string' ||
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
