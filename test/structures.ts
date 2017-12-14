// import { List, NonNull } from './../src/types/structures';
// import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
// import { Field, InputField, Argument } from '../src';
// import { ID } from './../src/types/scalars';

// describe('List structure', () => {
//   test(`create new List`, () => {
//     var myList = new List(ID);
//     expect(myList.ofType).toBe(ID);
//   });

//   test(`create List correct graphql type`, () => {
//     var myList = new List(ID);
//     expect(myList.gql).toBeInstanceOf(GraphQLList);
//     expect(myList.gql.ofType).toBe(GraphQLID);
//     expect(myList.ofType).toBe(ID);
//   });

//   test(`create List gql fails if have arguments`, () => {
//     var myList = new List(ID, { required: true });
//     var error;
//     try {
//       myList.gql;
//     } catch (e) {
//       error = e;
//     }
//     expect(error.toString()).toBe(
//       `Error: The List options: [object Object] will be dismissed.` +
//         `You will need to mount as a Field with using INSTANCE.toField()`
//     );
//   });

//   test(`as a Field`, () => {
//     let unmounted = new List(ID, { description: 'List ID field' });
//     let field = unmounted.toField();
//     expect(field).toBeInstanceOf(Field);
//     expect(field.type).toBeInstanceOf(List);
//     expect(field.type.ofType).toBe(ID);
//     expect(field.options).toMatchObject({ description: 'List ID field' });
//   });

//   test(`as a Argument`, () => {
//     let unmounted = new List(ID, { description: 'List ID argument' });
//     let arg = unmounted.toArgument();
//     expect(arg).toBeInstanceOf(Argument);
//     expect(arg.type).toBeInstanceOf(List);
//     expect(arg.type.ofType).toBe(ID);
//     expect(arg.options).toMatchObject({ description: 'List ID argument' });
//   });

//   test(`as a InputField`, () => {
//     let unmounted = new List(ID, { description: 'List ID input field' });
//     let inputfield = unmounted.toInputField();
//     expect(inputfield).toBeInstanceOf(InputField);
//     expect(inputfield.type).toBeInstanceOf(List);
//     expect(inputfield.type.ofType).toBe(ID);
//     expect(inputfield.options).toMatchObject({
//       description: 'List ID input field'
//     });
//   });
// });

// describe('NonNull structure', () => {
//   test(`create new NonNull`, () => {
//     var myList = new NonNull(ID);
//     expect(myList.ofType).toBe(ID);
//   });

//   test(`create NonNull correct graphql type`, () => {
//     var myList = new NonNull(ID);
//     expect(myList.gql).toBeInstanceOf(GraphQLNonNull);
//     expect(myList.gql.ofType).toBe(GraphQLID);
//     expect(myList.ofType).toBe(ID);
//   });

//   test(`create NonNull gql fails if have arguments`, () => {
//     var myList = new NonNull(ID, { required: true });
//     var error;
//     try {
//       myList.gql;
//     } catch (e) {
//       error = e;
//     }
//     expect(error.toString()).toBe(
//       `Error: The NonNull options: [object Object] will be dismissed.` +
//         `You will need to mount as a Field with using INSTANCE.toField()`
//     );
//   });

//   test(`as a Field`, () => {
//     let unmounted = new NonNull(ID, { description: 'NonNull ID field' });
//     let field = unmounted.toField();
//     expect(field).toBeInstanceOf(Field);
//     expect(field.type).toBeInstanceOf(NonNull);
//     expect(field.type.ofType).toBe(ID);
//     expect(field.options).toMatchObject({ description: 'NonNull ID field' });
//   });

//   test(`as a Argument`, () => {
//     let unmounted = new NonNull(ID, { description: 'NonNull ID argument' });
//     let arg = unmounted.toArgument();
//     expect(arg).toBeInstanceOf(Argument);
//     expect(arg.type).toBeInstanceOf(NonNull);
//     expect(arg.type.ofType).toBe(ID);
//     expect(arg.options).toMatchObject({ description: 'NonNull ID argument' });
//   });

//   test(`as a InputField`, () => {
//     let unmounted = new NonNull(ID, { description: 'NonNull ID input field' });
//     let inputfield = unmounted.toInputField();
//     expect(inputfield).toBeInstanceOf(InputField);
//     expect(inputfield.type).toBeInstanceOf(NonNull);
//     expect(inputfield.type.ofType).toBe(ID);
//     expect(inputfield.options).toMatchObject({
//       description: 'NonNull ID input field'
//     });
//   });
// });
