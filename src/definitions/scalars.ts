/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  GraphQLScalarType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString
} from "graphql";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";

import { setupNativeTypes } from "./../reflection";

// Store the basic references to GraphQL types
export const String: GraphQLScalarType = GraphQLString;
export const ID: GraphQLScalarType = GraphQLID;
export const Int: GraphQLScalarType = GraphQLInt;
export const Float: GraphQLScalarType = GraphQLFloat;
export const Boolean: GraphQLScalarType = GraphQLBoolean;

// Date/time types
export const Date: GraphQLScalarType = GraphQLDate;
export const DateTime: GraphQLScalarType = GraphQLDateTime;
export const Time: GraphQLScalarType = GraphQLTime;

// We setup the native data types, so we can use
// String, Number, Boolean... as GraphQL types
setupNativeTypes();
