import { GraphQLUnionType, GraphQLObjectType } from "graphql";
import { getGraphQLType } from "../../reflection";
import { ObjectType, Field, UnionType } from "../";

describe("UnionType creation", () => {
  @ObjectType()
  class Foo {
    @Field(String) foo: string;
  }

  @ObjectType()
  class Bar {
    @Field(String) bar: string;
  }

  const fooGraphQLType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
    Foo
  );
  const barGraphQLType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
    Bar
  );

  test(`create UnionType`, () => {
    var myUnion = new UnionType({
      name: "FooOrBar",
      description: "description",
      types: [Foo, Bar]
    });

    var graphqlType: GraphQLUnionType = <GraphQLUnionType>getGraphQLType(
      myUnion
    );
    expect(graphqlType.getTypes()).toEqual([fooGraphQLType, barGraphQLType]);
    expect(graphqlType.name).toBe("FooOrBar");
    expect(graphqlType.description).toBe("description");
  });
});
