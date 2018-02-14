# A sound GraphQL type system.

Since I started working in Graphene/GraphQL I always wondered what would be the
framework I wish to use to write my schemas with. To accomplish this mission I
sneaked into almost all different GraphQL server implementations to see what
Graphene can learn from them.

In each of the different GraphQL server implementations there is a clear
separation between GraphQL types and the corresponding data types, including
Graphene-Python (except on Juniper, Rust GraphQL framework).

```js
// The data type
type User = {
  name: string
};

// The GraphQL type
var UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    name: {
      type: GraphQLString
    }
  }
});
```

After talking in the GraphQL Summit (anonuncing Graphene-JS) and watching some
[insightful talks](https://www.youtube.com/watch?v=9czIsWUoQJY) it started to
become obvious **how important was to close the gap between the GraphQL
and the data types**.

Not just because of the willing of a more stable long-term solution, but also
because it will lead to ease the integration and use of GraphQL.

# Introducing Graphene-JS

Today, I'm presenting a revamped version of Graphene-JS.
Designed to ease the integration of GraphQL in your current js architecture,
by just... **by just using decorators**.

This way you can **reuse the data types** you were using before, in the
same fashion you do with your models on MobX or TypeORM.

Is. That. Simple.

```js
import { Schema, ObjectType, Field } from "graphene-js";

@ObjectType()
class Query {
  @Field(String)
  hello() {
    return "World";
  }
}

// Bonus: You can use the schema as any other instance of GraphQLSchema.
var schema = new Schema({ query: Query });
```

Thanks to this, you will be able to use GraphQL in a much more friendly
way, with less code and improved readability.

In our examples, we moved from a [170 LOC schema](https://github.com/graphql-js/graphene/blob/master/examples/starwars-raw/schema.js) to a very easy to read [100 LOC schema](https://github.com/graphql-js/graphene/blob/master/examples/starwars-ts/schema.ts).

## Incremental adoption

For us is very important that GraphQL developers can adopt Graphene in a
incremental way.

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
import { getGraphQLType } from "graphene-js";

var QueryType = new GraphQLObjectType({
  name: "QueryType",
  fields: {
    viewer: {
      type: getGraphQLType(User)
    }
  }
});
```

## Future improvements

Graphene-JS is designed with types in mind.
We foresee using the type reflection API from Typescript in the future,
so we we can directly skip the need of indicating the Field types manually
to let Graphene detect them automatically.

So instead of typing:

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

Something similar could be achieved in Flow by using a babel plugin.

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
