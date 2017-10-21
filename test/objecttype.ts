import { GraphQLObjectType } from 'graphql';
import { ObjectType, Interface, Field, String } from '../src';

describe('ObjectType setup', () => {
  test(`create ObjectType properly`, () => {
    class MyObjectType extends ObjectType {}
    expect(MyObjectType.typeName).toBe('MyObjectType');
    expect(MyObjectType.description).toBe(undefined);
  });
  test(`create ObjectType properly`, () => {
    class MyObjectType extends ObjectType {
      static description = 'My Description';
      static typeName = 'MyCustomObjectType';
      static fields = {
        hello: new Field(String)
      };
      static resolvers = {
        hello(): string {
          return 'World';
        }
      };
    }
    expect(MyObjectType.typeName).toBe('MyCustomObjectType');
    expect(MyObjectType.description).toBe('My Description');
    expect(MyObjectType.toString()).toMatchSnapshot();
    expect(MyObjectType.resolvers.hello()).toBe('World');
  });

  test(`create ObjectType with interfaces`, () => {
    class MyInterface extends Interface {
      static fields = {
        hello: new Field(String)
      };
      static resolvers = {
        hello(): string {
          return 'World';
        }
      };
    }

    class MyObjectType extends ObjectType {
      static interfaces = [MyInterface];
    }
    expect(MyObjectType.getResolver('hello')()).toBe('World');
    expect(MyObjectType.fields).toEqual({
      ...MyInterface.fields
    });
  });

  test(`create correct GraphQL type`, () => {
    class MyInterface extends Interface {
      static fields = {
        hello: new Field(String)
      };
    }
    class MyObjectType extends ObjectType {
      static description = 'My Description';
      static interfaces = [MyInterface];
      static fields = {
        hello: new Field(String)
      };
      static resolvers = {
        hello(): string {
          return 'World';
        }
      };
    }
    const gql: GraphQLObjectType = MyObjectType.gql;
    expect(gql).toBeInstanceOf(GraphQLObjectType);
    expect(gql.name).toBe('MyObjectType');
    expect(gql.description).toBe('My Description');
    expect(Object.keys(gql.getFields())).toEqual(['hello']);
    expect(gql.getInterfaces()).toMatchObject([MyInterface.gql]);
  });
});
