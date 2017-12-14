import { GraphQLEnumType } from 'graphql';
import { getGraphQLType } from '../src/types/reflection';
import { EnumType } from '../src/types/index';

describe('Enum creation', () => {
  test(`create Enum`, () => {
    @EnumType({})
    class MyEnum {
      static FOO = 'bar';
    }

    var graphqlType: GraphQLEnumType = <GraphQLEnumType>getGraphQLType(MyEnum);
    expect(graphqlType.name).toBe('MyEnum');
    expect(graphqlType.description).toBe(undefined);
  });

  test(`create Enum custom settings`, () => {
    @EnumType({
      name: 'MyCustomEnum',
      description: 'MyCustomEnum Description'
    })
    class MyEnum {
      static FOO = 'bar';
    }

    var graphqlType: GraphQLEnumType = <GraphQLEnumType>getGraphQLType(MyEnum);
    expect(graphqlType.name).toBe('MyCustomEnum');
    expect(graphqlType.description).toBe('MyCustomEnum Description');
  });

  test(`create Enum with Values`, () => {
    @EnumType({})
    class MyEnum {
      static VALUE1 = 1;
      static VALUE2 = 2;
    }
    expect(MyEnum.VALUE1).toBe(1);
    expect(MyEnum.VALUE2).toBe(2);
  });

  test(`create Enum graphql type`, () => {
    @EnumType({
      description: 'Desc'
    })
    class MyEnum {
      static VALUE1 = 1;
      static VALUE2 = 2;
    }
    var graphqlType: GraphQLEnumType = <GraphQLEnumType>getGraphQLType(MyEnum);
    expect(graphqlType).toBeInstanceOf(GraphQLEnumType);
    expect(graphqlType.name).toBe('MyEnum');
    expect(graphqlType.description).toBe('Desc');
    expect(graphqlType.getValues()).toMatchObject([
      {
        // "deprecationReason": undefined,
        // "description": "Value1 description",
        // "isDeprecated": false,
        name: 'VALUE1',
        value: 1
      },
      {
        // "deprecationReason": "Value2 is deprecated",
        // "description": "Value2 description",
        // "isDeprecated": true,
        name: 'VALUE2',
        value: 2
      }
    ]);
  });
});

// describe('Enum can be mounted', () => {
//   class MyEnum extends Enum {
//     static description = "Desc";
//     static values = {
//       VALUE1: {
//         description: "Value1 description",
//         value: 1
//       },
//       VALUE2: {
//         description: "Value2 description",
//         deprecationReason: "Value2 is deprecated",
//         value: 2
//       }
//     }
//   }

//   test(`as a Field`, () => {
//     let unmounted = new Enum({description: "MyEnum field"});
//     let field = unmounted.toField();
//     expect(field).toBeInstanceOf(Field);
//     expect(field.type).toBe(Enum);
//     expect(field.options).toMatchObject({description: "MyEnum field"});
//   })

//   test(`as a Argument`, () => {
//     let unmounted = new Enum({description: "MyEnum argument"});
//     let arg = unmounted.toArgument();
//     expect(arg).toBeInstanceOf(Argument);
//     expect(arg.type).toBe(Enum);
//     expect(arg.options).toMatchObject({description: "MyEnum argument"});
//   })

//   test(`as a InputField`, () => {
//     let unmounted = new Enum({description: "MyEnum input field"});
//     let inputfield = unmounted.toInputField();
//     expect(inputfield).toBeInstanceOf(InputField);
//     expect(inputfield.type).toBe(Enum);
//     expect(inputfield.options).toMatchObject({description: "MyEnum input field"});
//   })
// })
