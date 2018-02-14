ObjectTypes
===========

An ObjectType is the single, definitive source of information about your
data. It contains the essential fields and behaviors of the data you’re
querying.

The basics:

- Each ObjectType is a Python class that inherits from
  ``graphene.ObjectType``.
- Each attribute of the ObjectType represents a ``Field``.

Quick example
-------------

This example model defines a Person, with a first and a last name:

.. code:: js

    import { ObjectType } from "graphene";

    @ObjectType()
    class Person {
        @Field(String) firstName;
        @Field(String) lastName;
        @Field(String)
        fullName() {
            return `${this.firstName} ${this.lastName}`;
        }
    }

**firstName** and **lastName** are fields of the ObjectType. Each
field is specified as a class attribute, and each attribute maps to a
Field.

The above ``Person`` ObjectType has the following schema representation:

.. code::

    type Person {
      firstName: String
      lastName: String
      fullName: String
    }


Resolvers
---------

A resolver is a method that resolves certain fields within a
``ObjectType``. If not specififed otherwise, the resolver of a
field is the ``resolve_{field_name}`` method on the ``ObjectType``.

By default resolvers take the arguments ``args``, ``context`` and ``info``.


Quick example
~~~~~~~~~~~~~

This example model defines a ``Query`` type, which has a reverse field
that reverses the given ``word`` argument using the ``resolve_reverse``
method in the class.

.. code:: js

    import { ObjectType } from "graphene";

    @ObjectType()
    class Query {
        @Field(String, {args: {word: String}})
        reverse({word}) {
            return (word || "").split("").reverse().join("")
        }
    }


Instances as data containers
----------------------------

Graphene ``ObjectType``\ s can act as containers too. So with the
previous example you could do:

.. code:: js

    peter = new Person({firstName: "", lastName: ""})

    peter.firstName # prints "Peter"
    peter.lastName # prints "Griffin"

.. _Interface: /docs/interfaces/
