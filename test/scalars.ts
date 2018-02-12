import {
  // GraphQLScalarType,
  // GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  // GraphQLInt,
  GraphQLFloat
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { getGraphQLType } from './../src';

// import { Field, InputField, Argument } from '../src';
// import { Scalar, ID, Str, Boolean, Int, Float } from './../src/types/scalars';

// describe('Scalar creation', () => {
//   test(`create new Scalar`, () => {
//     class MyScalar extends Scalar {}
//     expect(MyScalar.typeName).toBe('MyScalar');
//     expect(MyScalar.description).toBe(undefined);
//   });

//   test(`create Scalar custom settings`, () => {
//     class MyScalar extends Scalar {
//       static typeName = 'MyCustomScalar';
//       static description = 'MyCustomScalar Description';
//     }
//     expect(MyScalar.typeName).toBe('MyCustomScalar');
//     expect(MyScalar.description).toBe('MyCustomScalar Description');
//   });

//   test(`create Scalar graphql type`, () => {
//     class MyScalar extends Scalar {
//       static description = 'Desc';
//       static serialize() {
//         return 'serialize';
//       }
//       static parseLiteral() {
//         return 'parseLiteral';
//       }
//       static parseValue() {
//         return 'parseValue';
//       }
//     }
//     const gql = <GraphQLScalarType>MyScalar.gql;
//     expect(gql).toBeInstanceOf(GraphQLScalarType);
//     expect(gql.name).toBe('MyScalar');
//     expect(gql.description).toBe('Desc');
//     expect(gql.serialize()).toBe('serialize');
//     expect(gql.parseLiteral()).toBe('parseLiteral');
//     expect(gql.parseValue()).toBe('parseValue');
//   });
// });

describe('Scalar can be mounted', () => {
  // class MyScalar extends Scalar {
  //   static description = 'Desc';
  //   static serialize(value: any) {
  //     value;
  //   }
  //   static parseLiteral(value: any) {
  //     value;
  //   }
  //   static parseValue(value: any) {
  //     value;
  //   }
  // }

  // test(`as a Field`, () => {
  //   let unmounted = new MyScalar({ description: 'MyScalar field' });
  //   let field = unmounted.toField();
  //   expect(field).toBeInstanceOf(Field);
  //   expect(field.type).toBe(MyScalar);
  //   expect(field.options).toMatchObject({ description: 'MyScalar field' });
  // });

  // test(`as a Argument`, () => {
  //   let unmounted = new MyScalar({ description: 'MyScalar argument' });
  //   let arg = unmounted.toArgument();
  //   expect(arg).toBeInstanceOf(Argument);
  //   expect(arg.type).toBe(MyScalar);
  //   expect(arg.options).toMatchObject({ description: 'MyScalar argument' });
  // });

  // test(`as a InputField`, () => {
  //   let unmounted = new MyScalar({ description: 'MyScalar input field' });
  //   let inputfield = unmounted.toInputField();
  //   expect(inputfield).toBeInstanceOf(InputField);
  //   expect(inputfield.type).toBe(MyScalar);
  //   expect(inputfield.options).toMatchObject({
  //     description: 'MyScalar input field'
  //   });
  // });

  describe('Pre-defined scalars', () => {
    test(`String`, () => {
      expect(getGraphQLType(String)).toBe(GraphQLString);
    });

    test(`Boolean`, () => {
      expect(getGraphQLType(Boolean)).toBe(GraphQLBoolean);
    });

    test(`Float`, () => {
      expect(getGraphQLType(Number)).toBe(GraphQLFloat);
    });

    test(`Date`, () => {
      expect(getGraphQLType(Date)).toBe(GraphQLDateTime);
    });
  });
});
