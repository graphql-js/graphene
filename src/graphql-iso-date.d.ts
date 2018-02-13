/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// We add the missing type definitions to the graphql-iso-date package.
declare module "graphql-iso-date" {
  import { GraphQLScalarType } from "graphql";

  export const GraphQLDate: GraphQLScalarType;
  export const GraphQLDateTime: GraphQLScalarType;
  export const GraphQLTime: GraphQLScalarType;
}
