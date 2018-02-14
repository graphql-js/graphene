Interfaces
==========

An Interface contains the essential fields that will be implemented by
multiple ObjectTypes.

The basics:

- Each Interface is class decorated with ``InterfaceType``.
- Each attribute decorated with ``@Field`` represents a GraphQL Field in the
  Interface.

Quick example
-------------

This example model defines a ``Character`` interface with a name. ``Human``
and ``Droid`` are two implementations of that interface.

.. code:: js

    import { InterfaceType, ObjectType } from "graphene-js";

    @InterfaceType()
    class Character {
        @Field(String) name;
    }

    // Human is a Character implementation
    @ObjectType({
        interfaces: [Character]
    })
    class Human {
        @Field(String) bornIn;
    }

    // Droid is a Character implementation
    @ObjectType({
        interfaces: [Character]
    })
    class Human {
        @Field(String) function;
    }


``name`` is a field on the ``Character`` interface that will also exist on both
the ``Human`` and ``Droid`` ObjectTypes (as those implement the ``Character``
interface). Each ObjectType may define additional fields.

The above types have the following representation in a schema:

.. code::

    interface Character {
      name: String
    }

    type Droid implements Character {
      name: String
      function: String
    }

    type Human implements Character {
      name: String
      bornIn: String
    }
