// import { getGraphQLType } from './../types_old/base';
import {
  GraphQLFieldConfig,
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
import { getGraphQLType, setGraphQLType, setupNativeTypes } from './reflection';

export const GRAPHENE_FIELDS_METADATA_KEY = 'graphene:fields';
import { getDeprecationReason, getDescription } from './reflection';

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

export type ArgumentType = {
  type: InputType;
  description?: string;
  defaultValue?: any;
};

type InputType =
  | GraphQLInputType
  | any
  | typeof String
  | typeof Number
  | typeof Boolean;
type FieldOptions = {
  args?: {
    [key: string]: ArgumentType | InputType;
  };
  description?: string;
  deprecationReason?: string;
};

type ArgumentMap = {
  [key: string]: GraphQLArgumentConfig;
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
  // property value
  // console.log('Field', target, key);
  // console.log(type, target, key, target.constructor);

  // var _val = target[key];
  var _class = target.constructor;
  var fields: {
    [key: string]: () => GraphQLFieldConfig<any, any>;
  };
  if (!Reflect.hasMetadata(GRAPHENE_FIELDS_METADATA_KEY, _class)) {
    fields = {};
    Reflect.defineMetadata(GRAPHENE_FIELDS_METADATA_KEY, fields, _class);
  } else {
    fields = Reflect.getMetadata(GRAPHENE_FIELDS_METADATA_KEY, _class);
  }
  if (key in fields) {
    throw new Error(`Field ${key} is already defined.`);
  }
  fields[key] = () => {
    var _type = getGraphQLType(type);
    if (!isOutputType(_type)) {
      throw new Error('Type is not output');
    }
    // Arg construction
    // var decoratedArguments: ArgumentMap | null = null;
    // if (target[key]) {
    //   decoratedArguments = Reflect.getMetadata(
    //     GRAPHENE_ARGUMENTS_METADATA_KEY,
    //     target[key]
    //   );
    // }
    // console.log('FIELD', target, key, decoratedArguments);
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
      resolve: resolver
    };
  };
  // console.log('TYPE', Reflect.getMetadata('design:type', target, key));
  // console.log(
  //   'RETURN TYPE',
  //   Reflect.getMetadata('design:returntype', target, key)
  // );
};

// export const argument = (type?: any, options?: ArgumentOptions) => (
//   target: any,
//   key: string
//   // index: number
// ) => {
//   // console.log('argument', type, 'x', target, 'o', key, 'fin');
//   var baseArguments: ArgumentMap;
//   if (!Reflect.hasMetadata(GRAPHENE_ARGUMENTS_METADATA_KEY, target[key])) {
//     baseArguments = {};
//     Reflect.defineMetadata(
//       GRAPHENE_ARGUMENTS_METADATA_KEY,
//       baseArguments,
//       target[key]
//     );
//   } else {
//     baseArguments = Reflect.getMetadata(
//       GRAPHENE_ARGUMENTS_METADATA_KEY,
//       target[key]
//     );
//   }
//   baseArguments[key] = new Argument(type, options);
// };

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
  type FieldsMap = {
    [key: string]: () => GraphQLFieldConfig<any, any>;
  };

  var interfaces: GraphQLInterfaceType[] = (opts.interfaces || []).map(
    iface => {
      var ifaceType = getGraphQLType(iface);
      if (!(ifaceType instanceof GraphQLInterfaceType)) {
        throw new Error('Provided interface is not valid');
      }
      return ifaceType;
    }
  );

  var allInterfaceFields: {
    [key: string]: () => GraphQLFieldConfig<any, any>;
  } = {};
  (opts.interfaces || []).forEach((_, index) => {
    var iface = (opts.interfaces || [])[index];
    var ifaceFields: FieldsMap = Reflect.getMetadata(
      GRAPHENE_FIELDS_METADATA_KEY,
      iface
    );
    if (!ifaceFields) {
      throw new Error(`Type ${target} must have at least one field.`);
    }
    allInterfaceFields = {
      ...allInterfaceFields,
      ...ifaceFields
    };
    // return ifaceFields;
  });

  var fields: {
    [key: string]: () => GraphQLFieldConfig<any, any>;
  } = {
    ...allInterfaceFields,
    ...(Reflect.getMetadata(GRAPHENE_FIELDS_METADATA_KEY, target) || {})
  };

  if (!Object.keys(fields).length) {
    throw new Error(`Type ${target} must have at least one field.`);
  }

  setGraphQLType(
    target,
    new GraphQLObjectType({
      name: opts.name || target.name,
      description: opts.description || getDescription(target),
      interfaces: interfaces,
      fields: () => {
        var key: string;
        var finalFields: {
          [key: string]: GraphQLFieldConfig<any, any>;
        } = {};
        // var ifaceFields: FieldsMap;
        // for (ifaceFields of interfacesFields) {
        //   for (key in ifaceFields) {
        //     finalFields[key] = ifaceFields[key]();
        //   }
        // }
        for (key in fields) {
          finalFields[key] = fields[key]();
        }
        return finalFields;
      }
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
  var fields: {
    [key: string]: () => GraphQLFieldConfig<any, any>;
  } = Reflect.getMetadata(GRAPHENE_FIELDS_METADATA_KEY, target);
  if (!fields) {
    throw new Error(`Type ${target} must have at least one field.`);
  }

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
      fields: () => {
        var key: string;
        var finalFields: {
          [key: string]: GraphQLFieldConfig<any, any>;
        } = {};
        for (key in fields) {
          finalFields[key] = fields[key]();
        }
        return finalFields;
      }
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
      value: target[name]
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
