import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql';
import { ObjectType, Interface, Field, String } from '../src';

describe('ObjectType creation', () => {
  test(`create ObjectType properly`, () => {
    class MyObjectType extends ObjectType {
      static description = "My Description";
      static fields = {
        hello: new Field(String)
      }
      static resolvers = {
        hello(): string {
          return "World";
        }
      }
    }
    expect(MyObjectType.getResolver('hello')()).toBe("World");
    expect(MyObjectType.typeName).toBe("MyObjectType");
    expect(MyObjectType.description).toBe("My Description");
    expect(MyObjectType.toString()).toBe(`# My Description
type MyObjectType {
  hello: String
}`);
  })

  test(`create ObjectType resolver call with this`, () => {
    class MyObjectType extends ObjectType {
      static fields = {
        hello: new Field(String)
      }
      val: string
      static resolvers = {
        hello(root: MyObjectType): string {
          return root.val;
        }
      }
    }
    const resolver = MyObjectType.getResolver('hello');
    const root: MyObjectType = {val: "Value"};
    expect(resolver(root)).toBe("Value")
  })

  test(`create ObjectType with interfaces`, () => {
    class MyInterface extends Interface {
      static fields = {
        hello: new Field(String)
      }
      static resolvers = {
        hello(): string {
          return "World";
        }
      }
    }

    class MyObjectType extends ObjectType {
      static interfaces = [MyInterface];
    }
    expect(MyObjectType.getResolver('hello')()).toBe("World");
    expect(MyObjectType.fields).toEqual({
      ...MyInterface.fields
    });
  })

  test(`can define custom name`, () => {
    class MyObjectType extends ObjectType {
        static typeName = "CustomType";
    }
    expect(MyObjectType.typeName).toBe("CustomType");
  })

  test(`create correct GraphQL type`, () => {
    class MyObjectType extends ObjectType {
      static description = "My Description";
      static fields = {
        hello: new Field(String)
      }
      static resolvers = {
        hello(): string {
          return "World";
        }
      }
    }
    const gql: GraphQLObjectType = MyObjectType.gql;
    expect(gql).toBeInstanceOf(GraphQLObjectType);
    expect(gql.name).toBe("MyObjectType");
    expect(gql.description).toBe("My Description");
    expect(Object.keys(gql.getFields())).toEqual(["hello"]);
    
  })


});

describe("Interface", () => {
  test(`create Interface`, () => {
    class MyInterface extends Interface {
    }
    expect(MyInterface.typeName).toBe("MyInterface");
    expect(MyInterface.description).toBe(undefined);
  })

  test(`create Interface custom settings`, () => {
    class MyInterface extends Interface {
      static typeName = "MyInterfaceType"
      static description = "MyInterfaceType Description";
    }
    expect(MyInterface.typeName).toBe("MyInterfaceType");
    expect(MyInterface.description).toBe("MyInterfaceType Description");
  })

  test(`create Interface with fields`, () => {
    class MyInterface extends Interface {
      static description = "My Description";
      static fields = {
        hello: new Field(String)
      }
    }
    expect(Object.keys(MyInterface.fields)).toEqual(["hello"]);
    const gql = MyInterface.gql;
    expect(gql).toBeInstanceOf(GraphQLInterfaceType);
    expect(gql.name).toBe("MyInterface");
    expect(gql.description).toBe("My Description");
    expect(Object.keys(gql.getFields())).toEqual(["hello"]);
  })

})