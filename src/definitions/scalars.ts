import { GraphQLInt } from 'graphql/type/scalars';
import { GraphQLScalarType, GraphQLID } from 'graphql';

import { setupNativeTypes } from './../reflection';

// ID is just a reference to GraphQLID
export const ID: GraphQLScalarType = GraphQLID;

// Int is just a reference to GraphQLInt
export const Int: GraphQLScalarType = GraphQLInt;

// We setup the native data types, so we can use
// String, Number, Boolean... as GraphQL types
setupNativeTypes();
