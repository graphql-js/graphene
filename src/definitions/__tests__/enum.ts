import { GraphQLEnumType } from "graphql";
import { getGraphQLType } from "../../reflection";
import { EnumType } from "../";

describe("Enum creation", () => {
  test(`create Enum`, () => {
    @EnumType({})
    class MyEnum {
      static FOO = "bar";
    }

    var graphqlType: GraphQLEnumType = <GraphQLEnumType>getGraphQLType(MyEnum);
    expect(graphqlType.name).toBe("MyEnum");
    expect(graphqlType.description).toBe(undefined);
  });

  test(`create Enum custom settings`, () => {
    @EnumType({
      name: "MyCustomEnum",
      description: "MyCustomEnum Description"
    })
    class MyEnum {
      static FOO = "bar";
    }

    var graphqlType: GraphQLEnumType = <GraphQLEnumType>getGraphQLType(MyEnum);
    expect(graphqlType.name).toBe("MyCustomEnum");
    expect(graphqlType.description).toBe("MyCustomEnum Description");
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
      description: "Desc"
    })
    class MyEnum {
      static VALUE1 = 1;
      static VALUE2 = 2;
    }
    var graphqlType: GraphQLEnumType = <GraphQLEnumType>getGraphQLType(MyEnum);
    expect(graphqlType).toBeInstanceOf(GraphQLEnumType);
    expect(graphqlType.name).toBe("MyEnum");
    expect(graphqlType.description).toBe("Desc");
    expect(graphqlType.getValues()).toMatchObject([
      {
        // "deprecationReason": undefined,
        // "description": "Value1 description",
        // "isDeprecated": false,
        name: "VALUE1",
        value: 1
      },
      {
        // "deprecationReason": "Value2 is deprecated",
        // "description": "Value2 description",
        // "isDeprecated": true,
        name: "VALUE2",
        value: 2
      }
    ]);
  });
});
