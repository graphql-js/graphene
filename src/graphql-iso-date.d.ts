declare module 'graphql-iso-date' {
  import { GraphQLScalarType } from 'graphql';

  export const GraphQLDate: GraphQLScalarType;
  export const GraphQLDateTime: GraphQLScalarType;
  export const GraphQLTime: GraphQLScalarType;
}
