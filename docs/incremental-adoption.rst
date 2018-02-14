Incremental adoption
====================

Graphene-JS is designed to be adopted incrementally, that means that you will
be able to use Graphene types inside of your already existing schema and
viceversa.

Graphene-JS types in GraphQL
----------------------------

Using Graphene types with your existing GraphQL types is very easy.
The module have a utility function `getGraphQLType` that you can use to retrieve
the native GraphQL type behind a Graphene type.

For example:

.. code:: js

    import { GraphQLSchema, GraphQLObjectType } from "graphql";
    import { ObjectType, Field, getGraphQLType } from "graphene";

    // Your graphene definition
    @ObjectType()
    class User {
      @Field(String) name
    }

    // Your normal GraphLQL types
    var query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        viewer: {
          // Note getGraphQLType(User) will return a GraphQLObjectType
          // that can be safely used in GraphQL types
          type: getGraphQLType(User),
        }
      }
    });


GraphQL types in Graphene
-------------------------

Graphene can operate with native GraphQL types seamlessly, with no extra effort
for the developer. You can use GraphQL native types directly in Graphene

For example:

.. code:: js

    import { ObjectType, Field } from "graphene";

    var User = GraphQLObjectType({
      name: 'User',
      fields: {
        name: {
          type: GraphQLString,
        }
      }
    });

    @ObjectType()
    class Query {
      // User is a native GraphQL type
      @Field(User) user;
    }
