/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  GraphQLResolveInfo,
  GraphQLTypeResolver,
  GraphQLObjectType,
  GraphQLInterfaceType
} from 'graphql';
import {
  UnmountedFieldMap,
  getFields,
  assertFields,
  getGraphQLType,
  setGraphQLType,
  getDescription,
  mountFields
} from './../reflection';

export type InterfaceTypeConfig = {
  name?: string;
  description?: string;
  resolveType?: (root?: any, context?: any, info?: GraphQLResolveInfo) => any;
};

export const InterfaceType = (opts: InterfaceTypeConfig = {}) => <
  T extends { new (...args: any[]): any }
>(
  target: T
): T => {
  const fields: UnmountedFieldMap = getFields(target);
  assertFields(target, fields);

  const resolveType: GraphQLTypeResolver<any, any> = (
    root?: any,
    context?: any,
    info?: GraphQLResolveInfo
  ): string | GraphQLObjectType | Promise<string | GraphQLObjectType> => {
    if (opts.resolveType) {
      root = opts.resolveType(root, context, info);
    }
    return <GraphQLObjectType>getGraphQLType(root);
  };

  setGraphQLType(
    target,
    new GraphQLInterfaceType({
      name: opts.name || target.name,
      description: opts.description || getDescription(target),
      resolveType: resolveType,
      fields: mountFields(fields)
    })
  );

  return target;
};
