/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'reflect-metadata';
import {
  GraphQLType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  assertType,
  isType
} from 'graphql';

export const GRAPHENE_TYPE_METADATA_KEY = 'graphene:type';
export const GRAPHENE_FIELDS_METADATA_KEY = 'graphene:fields';
export const GRAPHENE_DESCRIPTION_KEY = 'graphene:description';
export const GRAPHENE_DEPRECATED_KEY = 'graphene:deprecated';
// export const GRAPHENE_ARGUMENTS_METADATA_KEY = 'graphene:arguments';

// A utility funciton to convert values like:
// [String]
// To:
// GraphQLList(GraphQLString)
export const convertArrayToGraphQLList = (
  target: Array<any>
): GraphQLList<GraphQLType> => {
  if (target.length !== 1) {
    throw new Error(
      `Graphene Array definitions should contain exactly one element. Received ${
        target.length
      } elements.`
    );
  }
  var innerType = getGraphQLType(target[0]);
  return new GraphQLList(innerType);
};

// A utility funciton to convert values like:
// String
// To:
// GraphQLString
// Note: for String -> GraphQLString conversion to work we have to call
// setupNativeTypes
export const getGraphQLType = (target: any): GraphQLType => {
  if (Array.isArray(target)) {
    return convertArrayToGraphQLList(target);
  }
  if (isType(target)) {
    return target;
  }
  var metadataType: GraphQLType = Reflect.getMetadata(
    GRAPHENE_TYPE_METADATA_KEY,
    target
  );
  if (metadataType) {
    return metadataType;
  }
  throw new Error(
    `The target ${target} have no GraphQL type associated to it.`
  );
};

// An utility function to associate a GraphQL type
// with the specified target.
// This method takes full advantage of the Reflection API.
export const setGraphQLType = (target: any, type: GraphQLType): void => {
  // Is the provided type a GraphQLType?
  // Will fail if not.
  assertType(type);

  // First we check this type have no other type associated with it.
  if (Reflect.hasMetadata(GRAPHENE_TYPE_METADATA_KEY, target)) {
    throw new Error(
      `Type ${String(target)} already have a Graphene type attached.`
    );
  }
  // We define the type metadata through reflection
  Reflect.defineMetadata(GRAPHENE_TYPE_METADATA_KEY, type, target);
};

// The setup function that permit us to use
// the native String and Number types.
export const setupNativeTypes = () => {
  setGraphQLType(String, GraphQLString);
  setGraphQLType(Number, GraphQLFloat);
};

// Description setter
// Usage:
//   setDescription(MyClass, 'the description')
// Or:
//   setDescription(MyClass, 'methodName', 'the description')
export const setDescription = (
  target: any,
  keyOrDescription: string,
  description?: string
) => {
  if (typeof description === 'undefined') {
    Reflect.defineMetadata(GRAPHENE_DESCRIPTION_KEY, keyOrDescription, target);
  } else {
    Reflect.defineMetadata(
      GRAPHENE_DESCRIPTION_KEY,
      description,
      target,
      keyOrDescription
    );
  }
};

// Description getter
// Usage:
//   getDescription(MyClass)
// Or:
//   setDescription(MyClass, 'methodName')
export const getDescription = (target: any, key?: string) => {
  if (key) {
    return Reflect.getMetadata(GRAPHENE_DESCRIPTION_KEY, target, key);
  }
  return Reflect.getMetadata(GRAPHENE_DESCRIPTION_KEY, target);
};

// Deprecation reason setter
// Usage:
//   setDeprecationReason(MyClass, 'methodName', 'this method is now deprecated')
export const setDeprecationReason = (
  target: any,
  key: string,
  reason: string
) => {
  Reflect.defineMetadata(GRAPHENE_DEPRECATED_KEY, reason, target, key);
};

// Deprecation reason getter
// Usage:
//   getDeprecationReason(MyClass, 'methodName')
export const getDeprecationReason = (target: any, key: string) => {
  return Reflect.getMetadata(GRAPHENE_DEPRECATED_KEY, target, key);
};

// Setup the decorators

// Description decorator.
// This decorator permits us to decorate classes, like:
//
//   @description('The class description')
//   class X {}
//
// Or the class methods, like:
//
//   class X{
//     @description('The method description')
//     myMethod() {}
//   }
export const description = (description: string) => (
  target: any,
  key?: string,
  descriptor?: PropertyDescriptor
) => {
  if (typeof key !== 'undefined') {
    // It's a decorated method
    setDescription(target, key, description);
    return descriptor;
  }
  // It's a decorated class
  setDescription(target, description);
  return target;
};

// This decorator permits us to mark fields as deprecated, like:
//
//   class X{
//     @deprecated('This method is deprecated')
//     myMethod() {}
//   }
export const deprecated = (reason: string) => (
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) => {
  if (typeof key !== 'undefined') {
    // It's a decorated method
    // console.log(reason, target, key);
    setDeprecationReason(target, key, reason);
    return descriptor;
  }
  // It's a decorated class
  throw new Error(
    `Classes can't be decorated with the @deprecated decorator. Received ${
      target
    }.`
  );
};
