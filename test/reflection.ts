import { GraphQLString, GraphQLType, GraphQLList } from 'graphql';
import {
  setGraphQLType,
  getGraphQLType,
  convertArrayToGraphQLList,
  setDescription,
  getDescription,
  description,
  setDeprecationReason,
  getDeprecationReason,
  deprecated
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

  describe('description', () => {
    var type: any;
    beforeEach(() => {
      class MyType {
        myMethod() {}
      }
      type = MyType;
    });

    test('description on class', () => {
      setDescription(type, 'The description');
      expect(getDescription(type)).toBe('The description');
    });

    test('description on class method', () => {
      setDescription(type, 'myMethod', 'Method description');
      expect(getDescription(type, 'myMethod')).toBe('Method description');
    });

    test('description as class decorator', () => {
      @description('The description')
      class MyType {
        myMethod() {}
      }

      expect(getDescription(MyType)).toBe('The description');
    });

    test('description as method decorator', () => {
      class MyType {
        @description('Method description')
        myMethod() {}
      }

      expect(getDescription(MyType.prototype, 'myMethod')).toBe(
        'Method description'
      );
    });

    test('description on static value', () => {
      class MyType {
        @description('key description') static statickey = 1;
      }

      expect(getDescription(MyType, 'statickey')).toBe('key description');
    });

    test('description on value', () => {
      class MyType {
        @description('key description') key = 1;
      }

      expect(getDescription(MyType.prototype, 'key')).toBe('key description');
    });
  });

  describe('deprecated', () => {
    var type: any;
    beforeEach(() => {
      class MyType {
        myMethod() {}
      }
      type = MyType;
    });

    test('deprecated on class method', () => {
      setDeprecationReason(type, 'myMethod', 'Method deprecated');
      expect(getDeprecationReason(type, 'myMethod')).toBe('Method deprecated');
    });

    test('deprecated decorator in class', () => {
      expect(() => {
        @deprecated('is deprecated')
        class MyType {
          myMethod() {}
        }
      }).toThrowError(
        `Classes can't be decorated with the @deprecated decorator.`
      );
    });

    test('deprecated decorator in static method', () => {
      class MyType {
        @deprecated('Method deprecated')
        static myMethod() {}
      }

      expect(getDeprecationReason(MyType, 'myMethod')).toBe(
        'Method deprecated'
      );
    });
  });
});
