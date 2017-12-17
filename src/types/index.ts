import { GraphQLInputObjectType } from 'graphql';
// import { getGraphQLType } from './../types_old/base';
import {
  GraphQLObjectType,
  // GraphQLArgumentConfig,
  isOutputType,
  // GraphQLInputType,
  isInputType,
  GraphQLArgumentConfig,
  graphql,
  printSchema,
  GraphQLFieldResolver,
  GraphQLResolveInfo,
  defaultFieldResolver,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLTypeResolver,
  GraphQLID,
  GraphQLEnumType,
  GraphQLEnumValueConfigMap,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import 'reflect-metadata';
import { GraphQLSchema } from 'graphql/type/schema';
import {
  getGraphQLType,
  setGraphQLType,
  setupNativeTypes,
  getDeprecationReason,
  getDescription,
  getFields,
  assertFields,
  UnmountedFieldMap,
  mountFields,
  getInputFields,
  assertInputFields,
  UnmountedInputFieldMap,
  mountInputFields
} from './reflection';

export {
  description,
  getDescription,
  deprecated,
  getDeprecationReason
} from './reflection';

export const ID = GraphQLID;

setupNativeTypes();

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

export const List = (ofType: any) => {
  return new GraphQLList(getGraphQLType(ofType));
};

export const NonNull = (ofType: any) => {
  return new GraphQLNonNull(getGraphQLType(ofType));
};

type ArgumentMap = {
  [key: string]: GraphQLArgumentConfig;
};

type InputType =
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

type FieldOptions = {
  args?: {
    [key: string]: ArgumentType | InputType;
  };
  description?: string;
  deprecationReason?: string;
};

type FieldType = (
  type?: any,
  options?: FieldOptions
) => (target: any, key: string) => void;

// type InputFieldType = (
//   type?: any,
//   options?: InputFieldOptions
// ) => (target: any, key: string) => void;

// type InputFieldOptions = {
//   description?: string;
//   defaultValue?: any;
// };

export const Field: FieldType = (type?: any, options: FieldOptions = {}) => (
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
    var args = options.args || {};
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
          `Field argument ${argKey} expected to be Input type. Received: ${
            argType
          }.`
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

type InputFieldOptions = {
  defaultValue?: any;
  description?: string;
  deprecationReason?: string;
};

type InputFieldType = (
  type?: any,
  options?: InputFieldOptions
) => (target: any, key: string) => void;

// type InputFieldType = (
//   type?: any,
//   options?: InputFieldOptions
// ) => (target: any, key: string) => void;

// type InputFieldOptions = {
//   description?: string;
//   defaultValue?: any;
// };

export const InputField: InputFieldType = (
  type?: any,
  options: InputFieldOptions = {}
) => (target: any, key: string) => {
  var _class = target.constructor;
  var fields: UnmountedInputFieldMap = getInputFields(_class);
  if (key in fields) {
    throw new Error(`Field ${key} is already defined in ${_class}.`);
  }
  fields[key] = () => {
    var _type = getGraphQLType(type);
    if (!isInputType(_type)) {
      throw new Error('Type is not input');
    }
    var defaultValue: any = target[key];
    return {
      type: _type,
      description: options.description || getDescription(target, key),
      deprecationReason:
        options.deprecationReason || getDeprecationReason(target, key),
      defaultValue: options.defaultValue || defaultValue
    };
  };
};

export type ObjectTypeOptions = {
  name?: string;
  description?: string;
  interfaces?: any[];
};

// class MYI {
//   [key: string]: any;
// }

export const ObjectType = (opts: ObjectTypeOptions = {}) => <
  T extends { new (...args: any[]): any }
>(
  target: T
): T => {
  // save a reference to the original constructor
  var interfaces: GraphQLInterfaceType[] = (opts.interfaces || []).map(
    iface => {
      var ifaceType = getGraphQLType(iface);
      if (!(ifaceType instanceof GraphQLInterfaceType)) {
        throw new Error('Provided interface is not valid');
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

export type InterfaceTypeOptions = {
  name?: string;
  description?: string;
  resolveType?: (root?: any, context?: any, info?: GraphQLResolveInfo) => any;
};

export const InterfaceType = (opts: InterfaceTypeOptions = {}) => <
  T extends { new (...args: any[]): any }
>(
  target: T
): T => {
  var fields: UnmountedFieldMap = getFields(target);
  assertFields(target, fields);

  var resolveType: GraphQLTypeResolver<any, any> = (
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

  // var MYO = class extends target {
  //   [P in keyof target]?: target[P]
  // };
  return target;
  // return class extends target implements MYI {
  //   ra: boolean = true;
  // };

  // return new constructor (will override original)
  // return target;
};

export type InputObjectTypeOptions = {
  name?: string;
  description?: string;
};

export const InputObjectType = (opts: InputObjectTypeOptions = {}) => <
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

class BaseClass {}

const BaseClassProperties = Object.getOwnPropertyNames(BaseClass);

// We remove the properties automatically included in the BaseClass
// Such as .length, .name and .prototype
const getStaticProperties = (_class: Object) => {
  return Object.getOwnPropertyNames(_class).filter(
    name => BaseClassProperties.indexOf(name) === -1
  );
};

type EnumOptions = {
  name?: string;
  description?: string;
};

export const EnumType = (opts: EnumOptions = {}) => <
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
  // // return constructor;
  // return class extends constructor {};
};

type EnumValueOptions = {
  description?: string;
};

export const EnumValue = (options: EnumValueOptions = {}) => (
  target: any,
  key: string
) => {
  console.log('enumvalue', options, target, key);
};

export type SchemaOptions = {
  query: any;
};

export class Schema extends GraphQLSchema {
  constructor(options: SchemaOptions) {
    var queryType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      options.query
    );
    super({
      query: queryType
    });
  }
  execute(query: string, ...args: any[]) {
    return graphql(this, query, ...args);
  }
  toString() {
    return printSchema(this);
  }
}
