/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GraphQLEnumValueConfigMap, GraphQLEnumType } from 'graphql';
import {
  getDescription,
  getDeprecationReason,
  setGraphQLType
} from './../reflection';
import { getStaticProperties } from './utils';

export type EnumTypeConfig = {
  name?: string;
  description?: string;
};

export const EnumType = (opts: EnumTypeConfig = {}) => <
  T extends { new (...args: any[]): {}; [key: string]: any }
>(
  target: T
): T => {
  var values: GraphQLEnumValueConfigMap = {};
  getStaticProperties(target).forEach(name => {
    values[name] = {
      value: target[name],
      description: getDescription(target, name),
      deprecationReason: getDeprecationReason(target, name)
    };
  });
  setGraphQLType(
    target,
    new GraphQLEnumType({
      name: opts.name || target.name,
      description: opts.description || getDescription(target),
      values: values
    })
  );
  return target;
};

// export type EnumValueConfig = {
//   description?: string;
// };

// export const EnumValue = (config: EnumValueConfig = {}) => (
//   target: any,
//   key: string
// ) => {
//   console.log('enumvalue', config, target, key);
// };
