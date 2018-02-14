Schema
======

A Schema is created by supplying the root types of each type of operation, query, mutation and subscription.
A schema definition is then supplied to the validator and executor.

.. code:: js

    import { Schema } from "graphene-js";

    const schema = new Schema({
        query: MyRootQuery,
        mutation: MyRootMutation,
    })

Types
-----

There are some cases where the schema cannot access all of the types that we plan to have.
For example, when a field returns an ``Interface``, the schema doesn't know about any of the
implementations.

In this case, we need to use the ``types`` argument when creating the Schema.


.. code:: js

    const schema = new Schema({
        query: MyRootQuery,
        types=[SomeExtraType, ],
    })


Querying
--------

To query a schema, call the ``execute`` method on it.


.. code:: js

    await schema.execute('{ hello }')

