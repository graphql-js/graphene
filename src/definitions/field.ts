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
  GraphQLFieldConfig,
  GraphQLResolveInfo
} from "graphql";

import {
  UnmountedFieldMap,
  getFields,
  getGraphQLType,
  getDescription,
  getDeprecationReason
} from "./../reflection";

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
  resolver?: GraphQLFieldResolver<any, any>;
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

const isFunction = (thunk: any): boolean => {
  return typeof thunk === "function";
};

const resolveThunk = <T>(thunk: Thunk<T>): T => {
  return typeof thunk === "function" ? thunk() : thunk;
};

const isObject = (o: any) => {
  return o instanceof Object && o.constructor === Object;
};

const generateField = (config: FieldConfig): GraphQLFieldConfig<any, any> => {
  let {
    type,
    description,
    deprecationReason,
    resolver,
    ...extraFieldConfig
  } = config;
  const _type = getGraphQLType(type);
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
      let { type, ...extraOpts } = <ArgumentType>arg;
      argType = type;
      extra = extraOpts;
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
  return {
    ...extraFieldConfig,
    args: fieldArgs,
    type: _type,
    description: description,
    deprecationReason: deprecationReason,
    resolve: resolver
  };
};

const transformResolverWithThis = (resolver: Function) => (
  root: any,
  args: { [argName: string]: any },
  context: any,
  info: GraphQLResolveInfo
) => {
  return resolver.call(root, args, context, info);
};

const configFromTargetField = (target: any, key: string): FieldConfig => {
  const targetResolver = target[key];
  const resolver =
    typeof targetResolver === "function"
      ? transformResolverWithThis(targetResolver)
      : defaultFieldResolver;

  return {
    description: getDescription(target, key),
    deprecationReason: getDeprecationReason(target, key),
    resolver: resolver
  };
};

export const Field: FieldSignatures = (
  typeOrConfig: any,
  baseConfig?: FieldPartialConfig
) => (target: any, key: string) => {
  let config: FieldConfig;
  // First, we normalize the arguments into fieldConfig
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
  // We check if we can get any description, deprecationReason or
  // resolver from the target[key]
  const extendedConfig: FieldConfig = {
    ...configFromTargetField(target, key),
    ...config
  };
  const _class = target.constructor;
  let fields: UnmountedFieldMap = getFields(_class);
  if (key in fields) {
    throw new Error(`Field ${key} is already defined in ${_class}.`);
  }
  fields[key] = (): GraphQLFieldConfig<any, any> => {
    return generateField(extendedConfig);
  };
};

export const DynamicField = (thunkConfig: () => FieldConfig | null) => (
  target: any,
  key: string
) => {
  const _class = target.constructor;
  let fields: UnmountedFieldMap = getFields(_class);
  if (key in fields) {
    throw new Error(`Field ${key} is already defined in ${_class}.`);
  }
  fields[key] = (): GraphQLFieldConfig<any, any> | null => {
    const config: FieldConfig | null = thunkConfig();
    if (config === null) {
      return null;
    }
    const extendedConfig: FieldConfig = {
      ...configFromTargetField(target, key),
      ...config
    };
    return generateField(extendedConfig);
  };
};
