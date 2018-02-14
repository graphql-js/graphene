Scalars
=======

All Scalar types accept the following arguments. All are optional:


Base scalars
------------

``String``

    Represents textual data, represented as UTF-8
    character sequences. The String type is most often used by GraphQL to
    represent free-form human-readable text.

``Int``

    Represents non-fractional signed whole numeric
    values. Int can represent values between `-(2^53 - 1)` and `2^53 - 1` since
    represented in JSON as double-precision floating point numbers specified
    by `IEEE 754 <http://en.wikipedia.org/wiki/IEEE_floating_point>`_.

``Float``

    Represents signed double-precision fractional
    values as specified by
    `IEEE 754 <http://en.wikipedia.org/wiki/IEEE_floating_point>`_.

``Boolean``

    Represents `true` or `false`.

``ID``

    Represents a unique identifier, often used to
    refetch an object or as key for a cache. The ID type appears in a JSON
    response as a String; however, it is not intended to be human-readable.
    When expected as an input type, any string (such as `"4"`) or integer
    (such as `4`) input value will be accepted as an ID.

Graphene also provides custom scalars for Dates, Times, and JSON:

``graphene.Date``

    Represents a Date value as specified by `iso8601 <https://en.wikipedia.org/wiki/ISO_8601>`_.

``graphene.DateTime``

    Represents a DateTime value as specified by `iso8601 <https://en.wikipedia.org/wiki/ISO_8601>`_.

``graphene.Time``

    Represents a Time value as specified by `iso8601 <https://en.wikipedia.org/wiki/ISO_8601>`_.


Custom scalars
--------------

You can create custom scalars for your schema.
The following is an example for creating a DateTime scalar:

.. code:: js

    import { GraphQLScalarType } from "graphql";

    const Date = new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
  });
