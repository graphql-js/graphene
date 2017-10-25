# ![Graphene Logo](http://graphene-python.org/favicon.png) [Graphene](http://graphene-js.org) [![Build Status](https://travis-ci.org/graphql-js/graphene.svg?branch=master)](https://travis-ci.org/graphql-js/graphene) [![PyPI version](https://badge.fury.io/py/graphene.svg)](https://badge.fury.io/py/graphene) [![Coverage Status](https://coveralls.io/repos/graphql-js/graphene/badge.svg?branch=master&service=github)](https://coveralls.io/github/graphql-js/graphene?branch=master)


[Graphene-js](http://graphene-js.org) is a Python library for building GraphQL schemas/types fast and easily.

- **Easy to use:** Graphene helps you use GraphQL in Javascript without effort.
- **Relay:** Graphene has builtin support for Relay. (*on the works*)
- **Data agnostic:** Graphene supports any kind of data source: SQL (Sequelize), NoSQL, custom objects, etc.
  We believe that by providing a complete API you could plug Graphene-JS anywhere your data lives and make your data available
  through GraphQL.


## Integrations

Graphene has multiple integrations with different frameworks:

| integration   |   Package |
|---------------|-------------------|
| Sequelize        |  *On the works!* |

Also, Graphene is fully compatible with the GraphQL spec, working seamlessly with all GraphQL clients, such as [Relay](https://github.com/facebook/relay), [Apollo](https://github.com/apollographql/apollo-client) and [gql](https://github.com/graphql-js/gql).

## Installation

For instaling graphene, just run this command in your shell

```bash
npm install --save graphene-js
```

## 2.0 Upgrade Guide

Please read [UPGRADE-v2.0.md](/UPGRADE-v2.0.md) to learn how to upgrade.


## Examples

Here is one example for you to get started:

```js
import * as graphene from "graphene";

class Query extends graphene.ObjectType {
  static fields = {
    hello: new graphene.String()
  };

  hello() {
    return "Hello world!";
  }
}

const schema = new Schema(Query);
schema.execute('query { hello }')
```

Then Querying `graphene.Schema` is as simple as:

```js
query = `
    query SayHello {
      hello
    }
`
var result = await schema.execute(query)
```

If you want to learn even more, you can also check the following [examples](examples/):

* **Basic Schema**: [Starwars example](examples/starwars)
* **Basic Schema (Typescript)**: [Starwars Relay example](examples/starwars-ts)


## Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm i
```

After developing, the full test suite can be evaluated by running:

```sh
npm test
```


### Documentation

*On the works*
