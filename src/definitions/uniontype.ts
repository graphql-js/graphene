import {
  GraphQLUnionType,
  GraphQLUnionTypeConfig,
  GraphQLTypeResolver,
  GraphQLObjectType
} from "graphql";
import { getGraphQLType } from "..";

export interface UnionTypeConfig {
  name: string;
  types: any[];
  resolveType?: GraphQLTypeResolver<any, any>;
  description?: string;
}

export class UnionType extends GraphQLUnionType {
  constructor(config: UnionTypeConfig) {
    super({
      name: config.name,
      types: config.types.map(type => <GraphQLObjectType>getGraphQLType(type)),
      resolveType: config.resolveType,
      description: config.description
    });
  }
}
