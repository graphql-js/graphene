# A sound GraphQL type system.

Since I started working in Graphene/GraphQL I always wondered what would be the
framework I wish to use to write my schemas with. To accomplish this mission I
sneaked into almost all different GraphQL server implementations to see what
Graphene can learn from them.

In each of the different GraphQL server implementations there is a clear
separation between GraphQL types and the corresponding language types, including
Graphene-Python. (except on Rust!)

(example)

That means, that we need to define twice the type definitions, and the types
used in the corresponding implementation, making a gap between GraphQL and our
native data types Is important to note that this gap makes harder the
understanding and implementation of the schema and therefore make it more prone
to errors in the integrations.

After talking in the GraphQL Summit (anonuncing Graphene-JS) and watching some
different talks](https://www.youtube.com/watch?v=9czIsWUoQJY) it started to
become obvious **how important was to close the typing gap between this two
worlds**.

Not just because of the willing of a more stable long-term solution, but also
because it will lead to ease the integration and use of GraphQL.

# Graphene-JS

Today, I'm presenting a revamped version of Graphene-JS. Which would make much
easier to integrate in your current js architecture, by just... by just using
decorators. This way you can reuse the data types you were using before, in the
same fashion you do with your models on MobX or TypeORM.

Is. That. Simple.

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

Similar thing can be achieved by using a flow plugin for babel.

## Incremental adoption

Probably big bunch of the GraphQL developers already have their schemas defined
with GraphQL-js. If they want to use Graphene, there must be a way that can be
adopted incrementally.

Because of that, Graphene-JS has full interoperability with GraphQL types.

### Want to use GraphQL-js types in Graphene?

Easy, just reference the GraphQL types:

```js
@ObjectType()
class User {
  @Field(GraphQLString) // Note we are using GraphQLString instead of string
  name;
}
```

Same applies for interfaces of ObjectTypes, types of input fields, arguments...

### Want to use Graphene types in GraphQL-js?

Simple, just use `getGraphQLType`:

```js
import { getGraphQLType } from 'graphene';

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      getUser: {
        type: getGraphQLType(User),
        resolve() {
          return 'world';
        }
      }
    }
  })
});
```

## Nice side effects

Thanks for variable declarations in JS are processed before any code is
executed, we can self-reference a type very easily with Graphene-JS.

Like:

```js
@ObjectType()
class User {
  @Field([User])
  friends() {
    return getUsersFromIds(this.friendIds);
  }
}
```
