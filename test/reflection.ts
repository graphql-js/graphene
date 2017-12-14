import { GraphQLString, GraphQLType, GraphQLList } from 'graphql';
import {
  setGraphQLType,
  getGraphQLType,
  convertArrayToGraphQLList
} from '../src/types/reflection';
import { GraphQLInt } from 'graphql/type/scalars';

describe('Reflection integration', () => {
  describe('setGraphQLType', () => {
    var type: any;
    beforeEach(() => {
      class MyType {}
      type = MyType;
    });

    test(`setGraphQLType works if provided type if GraphQLType`, () => {
      setGraphQLType(type, GraphQLString);
      expect(getGraphQLType(type)).toBe(GraphQLString);
    });

    test(`setGraphQLType fails if provided type is not a GraphQLType`, () => {
      expect(() => {
        setGraphQLType(type, <GraphQLType>{});
      }).toThrowError(/Expected .* to be a GraphQL type\./);
    });

    test(`setGraphQLType fails if it already have a type associated`, () => {
      setGraphQLType(type, GraphQLString);
      expect(() => {
        setGraphQLType(type, GraphQLInt);
      }).toThrowError(/already have a Graphene type attached\./m);
    });
  });

  describe('getGraphQLType', () => {
    var type: any;
    beforeEach(() => {
      class MyType {}
      type = MyType;
    });

    test('getGraphQLType throws if have no type attached', () => {
      expect(() => {
        getGraphQLType(type);
      }).toThrowError(/have no GraphQL type associated to it\./m);
    });

    test('getGraphQLType works if provided a GraphQLType', () => {
      expect(getGraphQLType(GraphQLString)).toBe(GraphQLString);
      var listOfString = new GraphQLList(GraphQLString);
      expect(getGraphQLType(listOfString)).toBe(listOfString);
    });

    test('getGraphQLType calls convertArrayToGraphQLList if the provided is an Array.', () => {
      jest.unmock('../src/types/reflection');
      var reflection = require('../src/types/reflection');
      var prev = reflection.convertArrayToGraphQLList;
      var funcResult = new GraphQLList(GraphQLString);
      reflection.convertArrayToGraphQLList = jest.fn(() => funcResult);
      var result = getGraphQLType([type]);
      expect(reflection.convertArrayToGraphQLList).toBeCalled();
      expect(result).toBe(funcResult);
      reflection.convertArrayToGraphQLList = prev;
    });
  });

  describe('convertArrayToGraphQLList', () => {
    var type: any;
    beforeEach(() => {
      class MyType {}
      type = MyType;
      setGraphQLType(type, GraphQLString);
    });

    test('convertArrayToGraphQLList should work if array have length 1', () => {
      var converted: GraphQLList<any> = convertArrayToGraphQLList([type]);
      expect(converted).toBeInstanceOf(GraphQLList);
      expect(converted.ofType).toBe(GraphQLString);
    });

    test('convertArrayToGraphQLList should fail if length of array is > 1', () => {
      expect(() => {
        convertArrayToGraphQLList([type, type]);
      }).toThrowError(
        /Graphene Array definitions should contain exactly one element\./m
      );
    });

    test('convertArrayToGraphQLList should fail if length of array is == 0', () => {
      expect(() => {
        convertArrayToGraphQLList([]);
      }).toThrowError(
        /Graphene Array definitions should contain exactly one element\./m
      );
    });
  });
});
