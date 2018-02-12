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

``graphene.types.datetime.Date``

    Represents a Date value as specified by `iso8601 <https://en.wikipedia.org/wiki/ISO_8601>`_.

``graphene.types.datetime.DateTime``

    Represents a DateTime value as specified by `iso8601 <https://en.wikipedia.org/wiki/ISO_8601>`_.

``graphene.types.datetime.Time``

    Represents a Time value as specified by `iso8601 <https://en.wikipedia.org/wiki/ISO_8601>`_.

``graphene.types.json.JSONString``

    Represents a JSON string.


Custom scalars
--------------

You can create custom scalars for your schema.
The following is an example for creating a DateTime scalar:

.. code:: js

    import datetime
    from graphene.types import Scalar
    from graphql.language import ast

    class DateTime(Scalar):
        '''DateTime Scalar Description'''

        @staticmethod
        def serialize(dt):
            return dt.isoformat()

        @staticmethod
        def parse_literal(node):
            if isinstance(node, ast.StringValue):
                return datetime.datetime.strptime(
                    node.value, "%Y-%m-%dT%H:%M:%S.%f")

        @staticmethod
        def parse_value(value):
            return datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%f")

Mounting Scalars
----------------

Scalars mounted in a ``ObjectType``, ``Interface`` or ``Mutation`` act as
``Field``\ s.

.. code:: js

    class Person(graphene.ObjectType):
        name = graphene.String()

    # Is equivalent to:
    class Person(graphene.ObjectType):
        name = graphene.Field(graphene.String)


**Note:** when using the ``Field`` constructor directly, pass the type and
not an instance.

Types mounted in a ``Field`` act as ``Argument``\ s.


.. code:: js

    graphene.Field(graphene.String, to=graphene.String())

    # Is equivalent to:
    graphene.Field(graphene.String, to=graphene.Argument(graphene.String))
