import {
  GraphQLSchema,
  GraphQLObjectType,
  graphql,
  printSchema
} from 'graphql';

import { getGraphQLType } from './base';
import { ObjectType } from './objecttype';

type SchemaOptions = {
  query: typeof ObjectType | GraphQLObjectType;
  mutation?: typeof ObjectType | GraphQLObjectType;
  subscription?: typeof ObjectType | GraphQLObjectType;
};

export class Schema extends GraphQLSchema {
  constructor(options: SchemaOptions) {
    super({
      ...options,
      query: <GraphQLObjectType>getGraphQLType(options.query),
      mutation: options.mutation
        ? <GraphQLObjectType>getGraphQLType(options.mutation)
        : undefined,
      subscription: options.subscription
        ? <GraphQLObjectType>getGraphQLType(options.subscription)
        : undefined
    });
  }
  execute = graphql.bind(null, this);
  toString() {
    return printSchema(this);
  }
}
