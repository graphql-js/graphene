# A sound GraphQL type system.

Since I started working in Graphene/GraphQL I always wondered what would be the
framework I wish to use to write my schemas with. To accomplish this mission I
sneaked into almost all different GraphQL server implementations to see what
Graphene can learn from them.

In each of the different GraphQL server implementations there is a clear
separation between GraphQL types and the corresponding data types, including
Graphene-Python (except on Juniper, Rust GraphQL framework).

(example)

After talking in the GraphQL Summit (anonuncing Graphene-JS) and watching some
[insightful talks](https://www.youtube.com/watch?v=9czIsWUoQJY) it started to
become obvious **how important was to close the gap between the GraphQL
and the data types**.

Not just because of the willing of a more stable long-term solution, but also
because it will lead to ease the integration and use of GraphQL.

# Graphene-JS

Today, I'm presenting a revamped version of Graphene-JS. Which would make much
easier to integrate in your current js architecture, by just... by just using
decorators. This way you can reuse the data types you were using before, in the
same fashion you do with your models on MobX or TypeORM.

Is. That. Simple.

```js
import { Schema, ObjectType, Field } from 'graphene';

@ObjectType()
class Query {
  @Field(String)
  hello() {
    return 'World';
  }
}

// Bonus: You can use the schema as any other instance of GraphQLSchema.
// That means, you can use it as you been using GraphQLSchema before.
var schema = new Schema({ query: Query });
```

Thanks to this, you will be able to use GraphQL in a much more friendly
way, with less code and improved readability.

In our examples, we moved from a [170 LOC schema](https://github.com/graphql-js/graphene/blob/master/examples/starwars-raw/schema.js) to a very easy to read [100 LOC schema](https://github.com/graphql-js/graphene/blob/master/examples/starwars-ts/schema.ts).

## Incremental adoption

For us is very important that GraphQL developers that already have their schemas
defined with GraphQL-js can adopt Graphene in a incremental way. That means,
without then need of rewriting everything at once, but slowly moving their types
into more easy-to-read Graphene types.

Because of that, Graphene-JS has **full interoperability** with GraphQL types.

### Want to use GraphQL-js types in Graphene?

Easy, just reference the GraphQL types:

```js
@ObjectType()
class User {
  @Field(GraphQLString) // Note we are using GraphQLString instead of string
  name;
}
```

Same applies for interfaces of ObjectTypes, types of InputFields, arguments...

### Want to use Graphene types in GraphQL-js?

Simple, just use `getGraphQLType`:

```js
import { getGraphQLType } from 'graphene';

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      viewer: {
        type: getGraphQLType(User)
      }
    }
  })
});
```

## Future

By using the type reflection API from Typescript, we can directly skip the need
of doing:

```typescript
@ObjectType()
class User {
  @Field(String) name: string;
}
```

To simply do:

```typescript
@ObjectType()
class User {
  @Field() name: string;
}
```

Something similar could be achieved by using a flow plugin for babel.

## Nice side effects

Thanks to [var hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting), we can self-reference a type very easily with Graphene-JS.

Like:

```js
@ObjectType()
class User {
  // Child: What kind of trickery is this one, mum?
  // Mum: is called variable hoisting, my son. Don't thank me, thank JS.
  @Field([User])
  friends() {
    return [lee, oleg, johannes, sashko];
  }
}
```

Want to try it? You are just a `npm install graphene-js` away! :)
