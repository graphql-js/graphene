import { FieldConfig } from "./field";
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
} from "graphql";

import {
  UnmountedFieldMap,
  getFields,
  getGraphQLType,
  getDescription,
  getDeprecationReason
} from "./../reflection";
import { isFunction } from "util";

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
export type FieldPartialConfig = {
  args?: {
    [key: string]: ArgumentType | InputType;
  };
  description?: string;
  deprecationReason?: string;
};

export type FieldConfig = FieldPartialConfig & {
  type?: any;
};

export type FieldDecorator = (target: any, key: string) => void;

export interface FieldSignatures {
  // Signature 1
  (fullConfig: FieldConfig): FieldDecorator;
  // Signature 2
  (type: any, config?: FieldPartialConfig): FieldDecorator;
  // (thunkConfig: () => FieldConfig): FieldDecorator;
}

export type Thunk<T> = (() => T) | T;

const isFunction = (arg: any) => {
  return typeof arg === "function";
};

const resolveThunk = <T>(thunk: Thunk<T>): T => {
  return isFunction(thunk) ? thunk() : thunk;
};

const isObject = (o: any) => {
  return o instanceof Object && o.constructor === Object;
};

export const Field: FieldSignatures = (
  typeOrConfig: any,
  baseConfig?: FieldPartialConfig
) => (target: any, key: string) => {
  let config: FieldConfig;
  if (baseConfig) {
    // Signature 2
    config = {
      ...baseConfig,
      type: typeOrConfig
    };
  } else {
    if (isObject(typeOrConfig)) {
      // Signature 1
      config = typeOrConfig;
    } else {
      // Signature 2
      config = {
        type: typeOrConfig
      };
    }
  }
  const _class = target.constructor;
  let fields: UnmountedFieldMap = getFields(_class);
  if (key in fields) {
    throw new Error(`Field ${key} is already defined in ${_class}.`);
  }
  fields[key] = () => {
    const _type = getGraphQLType(config.type);
    if (!isOutputType(_type)) {
      throw new Error("Type is not output");
    }
    let args = config.args || {};
    let fieldArgs: ArgumentMap = {};
    for (let argKey in args) {
      let arg: ArgumentType | InputType = args[argKey];
      let extra: {};
      let argType: any;
      if (
        typeof (<ArgumentType>arg).type !== "undefined" &&
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
    if (typeof targetResolver === "function") {
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
      description: getDescription(target, key) || config.description,
      deprecationReason:
        getDeprecationReason(target, key) || config.deprecationReason,
      resolve: resolver
    };
  };
};
