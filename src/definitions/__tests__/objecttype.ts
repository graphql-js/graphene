import { FieldConfig } from "./../field";
import { GraphQLObjectType, GraphQLInterfaceType } from "graphql";
import { getGraphQLType, description } from "../../reflection";
import { ObjectType, Field, DynamicField, InterfaceType } from "./../";

describe("ObjectType setup", () => {
  test(`create ObjectType properly`, () => {
    @ObjectType()
    class MyObjectType {
      @Field(String) hello: string;
    }

    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );
    expect(graphqlType.name).toBe("MyObjectType");
    expect(graphqlType.description).toBe(undefined);
  });

  test(`create ObjectType field config`, () => {
    @ObjectType()
    class MyObjectType {
      @Field({ type: String })
      hello: string;
    }

    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );
    expect(graphqlType.name).toBe("MyObjectType");
    expect(graphqlType.description).toBe(undefined);
    expect(graphqlType.getFields()).toHaveProperty("hello");
  });

  test(`create ObjectType description decorator`, () => {
    @ObjectType()
    @description("My Description")
    class MyObjectType {
      @Field(String) hello: string;
    }
    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    expect(graphqlType.description).toBe("My Description");
  });

  test(`create ObjectType properly`, () => {
    @ObjectType({
      name: "MyCustomObjectType",
      description: "My Description"
    })
    class MyObjectType {
      @Field(String)
      hello(): string {
        return "World";
      }
    }
    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    expect(graphqlType.name).toBe("MyCustomObjectType");
    expect(graphqlType.description).toBe("My Description");
    expect(graphqlType.getFields()).toHaveProperty("hello");

    // We preserve the function
    expect(new MyObjectType().hello()).toBe("World");
  });

  test(`create ObjectType with no fields`, () => {
    expect(() => {
      @ObjectType()
      class MyObject {}
    }).toThrowErrorMatchingSnapshot();
  });

  test(`create ObjectType with wrong interfaces`, () => {
    expect(() => {
      @ObjectType({
        interfaces: [String]
      })
      class MyObjectType {
        @Field(String)
        bar?(): string {
          return "Bar";
        }
      }
    }).toThrowErrorMatchingSnapshot();
  });

  test(`create ObjectType with interfaces`, () => {
    @InterfaceType()
    class MyInterface1 {
      @Field(String)
      foo1?(): string {
        return "Foo1";
      }
    }

    @InterfaceType()
    class MyInterface2 {
      @Field(String)
      foo2?(): string {
        return "Foo1";
      }
    }

    @ObjectType({
      interfaces: [MyInterface1, MyInterface2]
    })
    class MyObjectType {
      @Field(String)
      bar?(): string {
        return "Bar";
      }
    }

    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    expect(graphqlType.name).toBe("MyObjectType");

    var graphqlInterfaceType1: GraphQLInterfaceType = <GraphQLInterfaceType>getGraphQLType(
      MyInterface1
    );
    var graphqlInterfaceType2: GraphQLInterfaceType = <GraphQLInterfaceType>getGraphQLType(
      MyInterface2
    );

    expect(graphqlType.getInterfaces()).toEqual([
      graphqlInterfaceType1,
      graphqlInterfaceType2
    ]);

    expect(Object.keys(graphqlType.getFields())).toEqual([
      "foo1",
      "foo2",
      "bar"
    ]);
  });

  test(`create ObjectType with dynamic field (skip)`, () => {
    @ObjectType()
    class MyObjectType {
      @DynamicField(() => null)
      skip: any;

      @Field(String)
      hello(): string {
        return "World";
      }
    }
    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    const fields = graphqlType.getFields();
    expect(fields).toHaveProperty("hello");
    expect(fields).not.toHaveProperty("skip");
  });

  test(`create ObjectType with dynamic field (include)`, () => {
    @ObjectType()
    class MyObjectType {
      @DynamicField((): FieldConfig => ({ type: String }))
      skip(): string {
        return "World";
      }

      @Field(String) hello: string;
    }
    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    const fields = graphqlType.getFields();
    expect(fields).toHaveProperty("hello");
    expect(fields).toHaveProperty("skip");

    // We preserve the function
    expect(new MyObjectType().skip()).toBe("World");
  });

  test(`create ObjectType with field with extra config`, () => {
    @ObjectType()
    class MyObjectType {
      @Field(String, { complexity: 10 } as any)
      hello: string;
    }
    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    const fields = graphqlType.getFields();
    expect(fields).toHaveProperty("hello");
    expect((fields["hello"] as any).complexity).toBe(10);
  });
});
