Getting started
===============

For an introduction to GraphQL and an overview of its concepts, please refer
to `the official introduction <http://graphql.org/learn/>`_.

Let’s build a basic GraphQL schema from scratch.

Requirements
------------

-  Node.js
-  Graphene-JS

Project setup
-------------

.. code:: bash

    npm install graphene-js
    # or
    yarn add graphene-js


Creating a basic Schema
-----------------------

A GraphQL schema describes your data model, and provides a GraphQL
server with an associated set of resolve methods that know how to fetch
data.

We are going to create a very simple schema, with a ``Query`` with only
one field: ``hello`` and an input name. And when we query it, it should return ``"Hello {name}"``.

.. code:: js

    import { ObjectType, Field, Schema } from "graphene-js";

    @ObjectType()
    class Query {
        @Field(String, {args: {name: String}})
        hello({name}) {
            return `Hello ${name || "stranger"}`;
        }
    }

    schema = new Schema({query: Query})


Querying
--------

Then we can start querying our schema:

.. code:: js

    var result = await schema.execute('{ hello }')
    console.log(result.data.hello) # "Hello stranger"

Congrats! You got your first graphene schema working!
