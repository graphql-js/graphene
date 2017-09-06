import { GraphQLInterfaceType } from 'graphql';
import { Interface, Field, String } from '../src';

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
