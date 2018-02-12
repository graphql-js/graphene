/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import {
  getGraphQLType,
  UnmountedFieldMap,
  getFields,
  assertFields,
  setGraphQLType,
  getDescription,
  mountFields
} from './../reflection';

export type ObjectTypeConfig = {
  name?: string;
  description?: string;
  interfaces?: any[];
};

export const ObjectType = (opts: ObjectTypeConfig = {}) => <
  T extends { new (...args: any[]): any }
>(
  target: T
): T => {
  // save a reference to the original constructor
  var interfaces: GraphQLInterfaceType[] = (opts.interfaces || []).map(
    iface => {
      var ifaceType = getGraphQLType(iface);
      if (!(ifaceType instanceof GraphQLInterfaceType)) {
        throw new Error(`Provided interface ${ifaceType} is not valid`);
      }
      return ifaceType;
    }
  );

  var allInterfaceFields: UnmountedFieldMap = {};

  (opts.interfaces || []).forEach((_, index) => {
    var iface = (opts.interfaces || [])[index];
    var ifaceFields: UnmountedFieldMap = getFields(iface);
    allInterfaceFields = {
      ...allInterfaceFields,
      ...ifaceFields
    };
  });

  var fields: UnmountedFieldMap = {
    // First we introduce the fields from the interfaces that we inherit
    ...allInterfaceFields,
    // Then we retrieve the fields for the current type
    ...getFields(target)
  };

  assertFields(target, fields);

  setGraphQLType(
    target,
    new GraphQLObjectType({
      name: opts.name || target.name,
      description: opts.description || getDescription(target),
      interfaces: interfaces,
      fields: mountFields(fields)
    })
  );

  return target;
};
