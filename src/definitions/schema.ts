/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  GraphQLObjectType,
  ExecutionResult,
  GraphQLDirective,
  GraphQLSchema,
  GraphQLNamedType,
  graphql,
  printSchema
} from 'graphql';

import { getGraphQLType } from '../reflection';

// The provided configuration type when creating a new Schema.
export type SchemaConfig = {
  query: any;
  mutation?: any;
  subscription?: any;
  directives?: GraphQLDirective[];
  types?: any[];
};

type GraphQLSchemaConfig = {
  query: GraphQLObjectType;
  mutation?: GraphQLObjectType;
  subscription?: GraphQLObjectType;
  directives?: GraphQLDirective[];
  types?: GraphQLNamedType[];
};

export class Schema extends GraphQLSchema {
  constructor(config: SchemaConfig) {
    let schemaConfig: GraphQLSchemaConfig = {
      query: <GraphQLObjectType>getGraphQLType(config.query),
      directives: config.directives
    };
    if (config.mutation) {
      schemaConfig.mutation = <GraphQLObjectType>getGraphQLType(
        config.mutation
      );
    }
    if (config.subscription) {
      schemaConfig.subscription = <GraphQLObjectType>getGraphQLType(
        config.subscription
      );
    }
    if (config.types) {
      schemaConfig.types = config.types.map(
        type => <GraphQLObjectType>getGraphQLType(type)
      );
    }
    super(schemaConfig);
  }
  public execute(query: string, ...args: any[]): Promise<ExecutionResult> {
    return graphql(this, query, ...args);
  }
  public toString() {
    return printSchema(this);
  }
}
