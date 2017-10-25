import { getGraphQLType } from './../types/base';
import { GraphQLObjectType } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { ObjectType, ResolverFunction } from './../types/objecttype';

export class Connection extends ObjectType {
  static nodeType: typeof ObjectType;
  static resolveNode: ResolverFunction<any>;
  static resolveCursor: ResolverFunction<any>;
  static get gql(): GraphQLObjectType {
    if (this.interfaces) {
      throw new Error("Connection types can't have interfaces.");
    }
    return connectionDefinitions({
      name: this.typeName,
      nodeType: <GraphQLObjectType>getGraphQLType(this.nodeType),
      resolveNode: this.resolveNode,
      resolveCursor: this.resolveCursor,
      edgeFields: {},
      connectionFields: this.getGraphQLFields.bind(this)
    }).connectionType;
  }
}
