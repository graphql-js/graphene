import { GraphQLInterfaceType } from "graphql";
import { getGraphQLType } from "../../reflection";
import { InterfaceType, Field } from "../";

describe("Interface", () => {
  test(`create Interface`, () => {
    @InterfaceType()
    class MyInterface {
      @Field(String) hello: string;
    }

    var graphqlType: GraphQLInterfaceType = <GraphQLInterfaceType>getGraphQLType(
      MyInterface
    );
    expect(graphqlType.name).toBe("MyInterface");
    expect(graphqlType.description).toBe(undefined);
  });

  test(`create Interface custom settings`, () => {
    @InterfaceType({
      name: "MyInterfaceType",
      description: "MyInterfaceType Description"
    })
    class MyInterface {
      @Field(String) hello: string;
    }

    var graphqlType: GraphQLInterfaceType = <GraphQLInterfaceType>getGraphQLType(
      MyInterface
    );
    expect(graphqlType.name).toBe("MyInterfaceType");
    expect(graphqlType.description).toBe("MyInterfaceType Description");
  });

  test(`create Interface with fields`, () => {
    @InterfaceType({
      name: "MyInterfaceType",
      description: "My Description"
    })
    class MyInterface {
      @Field(String) hello: string;
    }

    var graphqlType: GraphQLInterfaceType = <GraphQLInterfaceType>getGraphQLType(
      MyInterface
    );
    expect(graphqlType).toBeInstanceOf(GraphQLInterfaceType);
    expect(graphqlType.name).toBe("MyInterfaceType");
    expect(graphqlType.description).toBe("My Description");
    expect(Object.keys(graphqlType.getFields())).toEqual(["hello"]);
  });
});
