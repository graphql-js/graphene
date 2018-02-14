Enums
=====

A ``Enum`` is a special ``GraphQL`` type that represents a set of
symbolic names (members) bound to unique, constant values.

Definition
----------

You can create an ``Enum`` using classes:

.. code:: js

    import { EnumType } from "graphene";

    @EnumType()
    class Episode {
        static NEWHOPE = 4
        static EMPIRE = 5
        static JEDI = 6
    }


Graphene will automatically search for the static variables in the Enum and expose
them as the enum values.

Value descriptions
------------------

It's possible to add a description to an enum value, for that the enum value
needs to have the ``description``decorator on it.

.. code:: js

    @EnumType()
    class Episode {
        @description("New hope episode")
        static NEWHOPE = 4

        @description("Empire episode")
        static EMPIRE = 5

        @description("JEDI episode")
        static JEDI = 6
    }
