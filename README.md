# [Graphene-JS](http://graphene-js.org) [![Build Status](https://travis-ci.org/graphql-js/graphene.svg?branch=master)](https://travis-ci.org/graphql-js/graphene) [![PyPI version](https://badge.fury.io/js/graphene-js.svg)](https://badge.fury.io/js/graphene-js) [![Coverage Status](https://coveralls.io/repos/graphql-js/graphene/badge.svg?branch=master&service=github)](https://coveralls.io/github/graphql-js/graphene?branch=master)

[Graphene-JS](http://graphene-js.org) is a JS framework for building GraphQL schemas/types fast and easily.

* **Easy to use:** Graphene helps you use GraphQL in Javascript without effort.
* **Relay:** Graphene has builtin support for Relay. (_on the works_)
* **Data agnostic:** Graphene supports any kind of data source: SQL (Sequelize), NoSQL, custom objects, etc.
  We believe that by providing a complete API you could plug Graphene-JS anywhere your data lives and make your data available
  through GraphQL.

Check also the [architecture docs](https://github.com/graphql-js/graphene/blob/master/ARCHITECTURE.md) to see how Graphene-JS is architected to ease the development of GraphQL in JS.

## Integrations

Graphene has multiple integrations with different frameworks:

| integration | Package                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| Sequelize   | [graphene-sequelize](https://github.com/graphql-js/graphene-sequelize/) |
| TypeORM     | **on the works**                                                        |

Also, Graphene is fully compatible with the GraphQL spec, working seamlessly with all GraphQL clients, such as [Relay](https://github.com/facebook/relay), [Apollo](https://github.com/apollographql/apollo-client) and [urql](https://github.com/FormidableLabs/urql).

## Installation

For instaling graphene, just run this command in your shell

```bash
npm install --save graphene-js
# or
yarn add graphene-js
```

## Examples

Here is one example for you to get started:

```js
import { ObjectType, Field, Schema } from "graphene";

@ObjectType()
class Query {
  @Field(String)
  hello() {
    return "Hello world!";
  }
}

const schema = new Schema({ query: Query });
```

Then Querying `graphene.Schema` is as simple as:

```js
query = `
    query SayHello {
      hello
    }
`;

var result = schema.execute(query);
```

If you want to learn more, you can also check the [documentation](http://docs.graphene-js.org/) or check the provided [examples](examples/):

* **Basic Schema**: [Starwars example](examples/starwars)
* **Basic Schema (Typescript)**: [Starwars Relay example](examples/starwars-ts)

## Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
yarn
```

After developing, the full test suite can be evaluated by running:

```sh
yarn test
```

You can also get the coverage with:

```sh
yarn test --coverage
```

### Documentation

The documentation is generated using the excellent [Sphinx](http://www.sphinx-doc.org/) and a custom theme.

The documentation dependencies are installed by running:

```sh
cd docs
pip install -r requirements.txt
```

Then to produce a HTML version of the documentation:

```sh
make html
```
