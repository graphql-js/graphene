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
// Argument(String, "The description", "value")
// Will be converted to:
// {type: String, description: "The description", defaultValue: "value"}
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
  var _class = target.constructor;
  var fields: UnmountedFieldMap = getFields(_class);
  if (key in fields) {
    throw new Error(`Field ${key} is already defined in ${_class}.`);
  }
  fields[key] = () => {
    var _type = getGraphQLType(type);
    if (!isOutputType(_type)) {
      throw new Error('Type is not output');
    }
    var argKey: string;
    var args = config.args || {};
    var fieldArgs: ArgumentMap = {};
    for (argKey in args) {
      var arg: ArgumentType | InputType = args[argKey];
      var extra: {};
      var argType: any;
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

      var newType = getGraphQLType(argType);
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
    var targetResolver = target[key];
    var resolver: GraphQLFieldResolver<any, any> = defaultFieldResolver;
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
