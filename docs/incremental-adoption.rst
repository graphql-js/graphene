Incremental adoption
====================

Graphene-JS is designed to be adopted incrementally, that means that you should
be able to use Graphene types inside of your already existing schema and
viceversa.

Graphene-JS types in GraphQL
----------------------------

Using Graphene types with your existing GraphQL types should be very easy.
The module have a utility function `getGraphQL` that you can use.

For example:

.. code:: js

    import { GraphQLSchema, GraphQLObjectType } from "graphql";
    import { ObjectType, Field, getGraphQLType } from "graphene";

    // Your graphenedefinition
    @ObjectType()
    class User {
      @Field(String): name
    }

    // Your normal GraphLQL types:
    var query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        viewer: {
          // Note getGraphQLType(User) will return a GraphQLObjectType
          // that can be safely used in GraphQL types
          type: getGraphQLType(User),
          resolve() {
            return 'world';
          }
        }
      }
    });


GraphQL types in Graphene
-------------------------

Graphene can operate with native GraphQL types seamlessly, with no extra effort
for the developer. You can

For example:

.. code:: js

    import { ObjectType, Field, getGraphQLType } from "graphene";

    @ObjectType()
    class User {
      @Field(String): name
    }

    // Your normal GraphLQL Schema:

    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          viewer: {
            // Note getGraphQLType(User) will return a GraphQLObjectType
            // that can be safely used in GraphQL types
            type: getGraphQLType(User),
            resolve() {
              return 'world';
            }
          }
        }
      })
    });
