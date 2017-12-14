// import { Argument } from './../src/types/argument';
// import { InputField } from './../src/types/inputfield';
// import { InputObjectType } from './../src/types/inputobjecttype';
// import { GraphQLInputObjectType } from 'graphql';
// import { String } from '../src';

// describe('InputObjectType setup', () => {
//   test(`create InputObjectType properly`, () => {
//     class MyInputObjectType extends InputObjectType {}
//     expect(MyInputObjectType.typeName).toBe('MyInputObjectType');
//     expect(MyInputObjectType.description).toBe(undefined);
//   });
//   test(`create InputObjectType properly`, () => {
//     class MyInputObjectType extends InputObjectType {
//       static description = 'My Description';
//       static typeName = 'MyCustomInputObjectType';
//       static fields = {
//         hello: new InputField(String)
//       };
//     }
//     expect(MyInputObjectType.typeName).toBe('MyCustomInputObjectType');
//     expect(MyInputObjectType.description).toBe('My Description');
//     expect(MyInputObjectType.toString()).toMatchSnapshot();
//   });

//   test(`create correct GraphQL type`, () => {
//     class MyInputObjectType extends InputObjectType {
//       static description = 'My Description';
//       static fields = {
//         hello: new InputField(String)
//       };
//     }

//     const gql: GraphQLInputObjectType = MyInputObjectType.gql;
//     expect(gql).toBeInstanceOf(GraphQLInputObjectType);
//     expect(gql.name).toBe('MyInputObjectType');
//     expect(gql.description).toBe('My Description');
//     expect(Object.keys(gql.getFields())).toEqual(['hello']);
//   });

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
