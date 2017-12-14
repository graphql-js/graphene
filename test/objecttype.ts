import { getGraphQLType } from './../src/types/reflection';
import { ObjectType, Field, InterfaceType } from './../src/types/index';
import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql';

describe('ObjectType setup', () => {
  test(`create ObjectType properly`, () => {
    @ObjectType()
    class MyObjectType {
      @Field(String) hello: string;
    }

    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );
    expect(graphqlType.name).toBe('MyObjectType');
    expect(graphqlType.description).toBe(undefined);
  });
  test(`create ObjectType properly`, () => {
    @ObjectType({
      name: 'MyCustomObjectType',
      description: 'My Description'
    })
    class MyObjectType {
      @Field(String)
      hello(): string {
        return 'World';
      }
    }
    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    expect(graphqlType.name).toBe('MyCustomObjectType');
    expect(graphqlType.description).toBe('My Description');
    expect(graphqlType.getFields()).toHaveProperty('hello');

    // We preserve the function
    expect(new MyObjectType().hello()).toBe('World');
  });

  test(`create ObjectType with interfaces`, () => {
    @InterfaceType()
    class MyInterface1 {
      @Field(String)
      foo1?(): string {
        return 'Foo1';
      }
    }

    @InterfaceType()
    class MyInterface2 {
      @Field(String)
      foo2?(): string {
        return 'Foo1';
      }
    }

    @ObjectType({
      interfaces: [MyInterface1, MyInterface2]
    })
    class MyObjectType {
      @Field(String)
      bar?(): string {
        return 'Bar';
      }
    }

    var graphqlType: GraphQLObjectType = <GraphQLObjectType>getGraphQLType(
      MyObjectType
    );

    expect(graphqlType.name).toBe('MyObjectType');

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
      'foo1',
      'foo2',
      'bar'
    ]);
  });
});
