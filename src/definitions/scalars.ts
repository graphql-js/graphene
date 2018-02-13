/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GraphQLInt } from "graphql/type/scalars";
import { GraphQLScalarType, GraphQLID } from "graphql";

import { setupNativeTypes } from "./../reflection";

// ID is just a reference to GraphQLID
export const ID: GraphQLScalarType = GraphQLID;

// Int is just a reference to GraphQLInt
export const Int: GraphQLScalarType = GraphQLInt;

// We setup the native data types, so we can use
// String, Number, Boolean... as GraphQL types
setupNativeTypes();
