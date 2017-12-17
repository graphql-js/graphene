import { getGraphQLType } from './../src/types/reflection';
import { GraphQLInputObjectType } from 'graphql';
import { InputObjectType, InputField } from '../src';

describe('Interface', () => {
  test(`create Interface`, () => {
    @InputObjectType()
    class MyInputObject {
      @InputField(String) hello: string;
    }

    var graphqlType: GraphQLInputObjectType = <GraphQLInputObjectType>getGraphQLType(
      MyInputObject
    );
    expect(graphqlType.name).toBe('MyInputObject');
    expect(graphqlType.description).toBe(undefined);
  });

  test(`create Interface custom settings`, () => {
    @InputObjectType({
      name: 'MyInputObjectType',
      description: 'MyInputObjectType description'
    })
    class MyInputObject {
      @InputField(String) hello: string;
    }

    var graphqlType: GraphQLInputObjectType = <GraphQLInputObjectType>getGraphQLType(
      MyInputObject
    );
    expect(graphqlType.name).toBe('MyInputObjectType');
    expect(graphqlType.description).toBe('MyInputObjectType description');
  });

  test(`create Interface with fields`, () => {
    @InputObjectType({
      name: 'MyInputObjectType',
      description: 'MyInputObjectType description'
    })
    class MyInputObject {
      @InputField(String) hello: string;
    }

    var graphqlType: GraphQLInputObjectType = <GraphQLInputObjectType>getGraphQLType(
      MyInputObject
    );
    expect(graphqlType.name).toBe('MyInputObjectType');
    expect(graphqlType.description).toBe('MyInputObjectType description');
    expect(Object.keys(graphqlType.getFields())).toEqual(['hello']);
  });
});

//   describe('InputObjectType can be mounted', () => {
//     class MyInputObjectType extends InputObjectType {
//       static description = 'Desc';
//     }

//     test(`as a Argument`, () => {
//       let unmounted = new MyInputObjectType({
//         description: 'MyInputObjectType argument'
//       });
//       let arg = unmounted.toArgument();
//       expect(arg).toBeInstanceOf(Argument);
//       expect(arg.type).toBe(MyInputObjectType);
//       expect(arg.options).toMatchObject({
//         description: 'MyInputObjectType argument'
//       });
//     });

//     test(`as a InputField`, () => {
//       let unmounted = new MyInputObjectType({
//         description: 'MyInputObjectType input field'
//       });
//       let inputfield = unmounted.toInputField();
//       expect(inputfield).toBeInstanceOf(InputField);
//       expect(inputfield.type).toBe(MyInputObjectType);
//       expect(inputfield.options).toMatchObject({
//         description: 'MyInputObjectType input field'
//       });
//     });
//   });
// });
