import {
  GraphQLInterfaceType,
  GraphQLResolveInfo,
  GraphQLObjectType
} from 'graphql';
import {
  nodeDefinitions,
  fromGlobalId,
  toGlobalId,
  GraphQLNodeDefinitions
} from 'graphql-relay';
// import { getGraphQLType } from './../types/base';
import { ObjectType, GrapheneObjectType } from './../types/objecttype';
import { Interface } from './../types/interface';

type ObjectType_type = typeof ObjectType;

interface NodeObjectType extends ObjectType_type {
  getNode: (id: string, context: any, info: GraphQLResolveInfo) => any;
}

export class Node extends Interface {
  static idFetcher(id: string, context: any, info: GraphQLResolveInfo) {
    var { type, id } = this.fromGlobalId(id);
    // First we check the returned type is a valid ObjectType in our schema
    var graphqlType = info.schema.getType(type);
    if (!graphqlType || !(graphqlType instanceof GrapheneObjectType)) {
      return null;
    }
    // We check that the returned ObjectType have Node as one of it's interfaces
    var interfaces = graphqlType.getInterfaces();
    if (interfaces.indexOf(this.gql) == -1) {
      return null;
    }
    // Then we retrieve the Graphene class associated to this GraphQL type
    var grapheneType = graphqlType.grapheneType;

    // And then we check if the class have a getNode method on it
    var getNode = (<NodeObjectType>grapheneType).getNode;

    if (getNode) {
      return getNode(id, context, info);
    }
  }

  static fromGlobalId = fromGlobalId;

  static toGlobalId = toGlobalId;

  private static _definitions: GraphQLNodeDefinitions;
  static getDefinitions() {
    if (!this._definitions) {
      if (!this.idFetcher) {
        throw new Error('idFetcher in node have to be defined.');
      }
      this._definitions = nodeDefinitions<any>(
        this.idFetcher,
        this.resolveType
      );
    }
    return this._definitions;
  }
  static constructType(): GraphQLInterfaceType {
    return this.getDefinitions().nodeInterface;
  }
  static get Field() {
    return this.getDefinitions().nodeField;
  }
}
