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
native data types. Is important to note that this gap makes harder the
implementation of the schema as well as it make it more prone to errors.

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

By using the type reflection API from Typescript, we can directly skip
