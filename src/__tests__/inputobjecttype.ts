import { GraphQLInputObjectType } from "graphql";
import { getGraphQLType, InputObjectType, InputField } from "../";

describe("InputObjectType", () => {
  test(`create InputObjectType`, () => {
    @InputObjectType()
    class MyInputObject {
      @InputField(String) hello: string;
    }

    var graphqlType: GraphQLInputObjectType = <GraphQLInputObjectType>getGraphQLType(
      MyInputObject
    );
    expect(graphqlType.name).toBe("MyInputObject");
    expect(graphqlType.description).toBe(undefined);
  });

  test(`create InputObjectType custom settings`, () => {
    @InputObjectType({
      name: "MyInputObjectType",
      description: "MyInputObjectType description"
    })
    class MyInputObject {
      @InputField(String) hello: string;
    }

    var graphqlType: GraphQLInputObjectType = <GraphQLInputObjectType>getGraphQLType(
      MyInputObject
    );
    expect(graphqlType.name).toBe("MyInputObjectType");
    expect(graphqlType.description).toBe("MyInputObjectType description");
  });

  test(`create InputObjectType with fields`, () => {
    @InputObjectType({
      name: "MyInputObjectType",
      description: "MyInputObjectType description"
    })
    class MyInputObject {
      @InputField(String) hello: string;
    }

    var graphqlType: GraphQLInputObjectType = <GraphQLInputObjectType>getGraphQLType(
      MyInputObject
    );
    expect(graphqlType.name).toBe("MyInputObjectType");
    expect(graphqlType.description).toBe("MyInputObjectType description");
    expect(Object.keys(graphqlType.getFields())).toEqual(["hello"]);
  });

  test(`create InputObjectType with no fields`, () => {
    expect(() => {
      @InputObjectType()
      class MyInputObject {}
    }).toThrowErrorMatchingSnapshot();
  });
});
