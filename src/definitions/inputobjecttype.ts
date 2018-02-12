/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GraphQLInputObjectType } from 'graphql';
import {
  UnmountedInputFieldMap,
  getInputFields,
  assertInputFields,
  setGraphQLType,
  getDescription,
  mountInputFields
} from './../reflection';

export type InputObjectTypeConfig = {
  name?: string;
  description?: string;
};

export const InputObjectType = (opts: InputObjectTypeConfig = {}) => <
  T extends { new (...args: any[]): any }
>(
  target: T
): T => {
  var fields: UnmountedInputFieldMap = getInputFields(target);
  assertInputFields(target, fields);

  setGraphQLType(
    target,
    new GraphQLInputObjectType({
      name: opts.name || target.name,
      description: opts.description || getDescription(target),
      fields: mountInputFields(fields)
    })
  );

  return target;
};
