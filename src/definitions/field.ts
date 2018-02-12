/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  GraphQLArgumentConfig,
  GraphQLInputType,
  isOutputType,
  isInputType,
  GraphQLFieldResolver,
  defaultFieldResolver,
  GraphQLResolveInfo
} from 'graphql';

import {
  UnmountedFieldMap,
  getFields,
  getGraphQLType,
  getDescription,
  getDeprecationReason
} from './../reflection';

// Helper function that ease the creation of Arguments
// This:
//   Argument(String, "The description", "value")
// Will be converted to:
//   {
//     type: String,
//     description: "The description",
//     defaultValue: "value"
//   }
export const Argument = (
  type: InputType,
  description?: string,
  defaultValue?: any
): ArgumentType => {
  return {
    type,
    description,
    defaultValue
  };
};

type ArgumentMap = {
  [key: string]: GraphQLArgumentConfig;
};

export type InputType =
  | GraphQLInputType
  | any
  | typeof String
  | typeof Number
  | typeof Boolean;

export type ArgumentType = {
  type: InputType;
  description?: string;
  defaultValue?: any;
};

// The provided configuration type when creating a Field.
export type FieldConfig = {
  args?: {
    [key: string]: ArgumentType | InputType;
  };
  description?: string;
  deprecationReason?: string;
};

export const Field = (type?: any, config: FieldConfig = {}) => (
  target: any,
  key: string
) => {
  const _class = target.constructor;
  let fields: UnmountedFieldMap = getFields(_class);
  if (key in fields) {
    throw new Error(`Field ${key} is already defined in ${_class}.`);
  }
  fields[key] = () => {
    const _type = getGraphQLType(type);
    if (!isOutputType(_type)) {
      throw new Error('Type is not output');
    }
    let args = config.args || {};
    let fieldArgs: ArgumentMap = {};
    for (let argKey in args) {
      let arg: ArgumentType | InputType = args[argKey];
      let extra: {};
      let argType: any;
      if (
        typeof (<ArgumentType>arg).type !== 'undefined' &&
        !isInputType(<GraphQLInputType>arg)
      ) {
        extra = {
          description: (<ArgumentType>arg).description
        };
        argType = (<ArgumentType>arg).type;
      } else {
        extra = {};
        argType = arg;
      }

      const newType = getGraphQLType(argType);
      if (!isInputType(newType)) {
        throw new Error(
          `Field argument ${argKey} expected to be Input type. Received: ${argType}.`
        );
      }
      fieldArgs[argKey] = {
        type: newType,
        ...extra
      };
    }
    const targetResolver = target[key];
    let resolver: GraphQLFieldResolver<any, any> = defaultFieldResolver;
    if (typeof targetResolver === 'function') {
      resolver = (
        root: any,
        args: { [argName: string]: any },
        context: any,
        info: GraphQLResolveInfo
      ) => {
        return targetResolver.call(root, args, context, info);
      };
    }
    return {
      args: fieldArgs,
      type: _type,
      description: getDescription(target, key),
      deprecationReason: getDeprecationReason(target, key),
      resolve: resolver
    };
  };
};
