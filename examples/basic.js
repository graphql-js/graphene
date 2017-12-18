import { ObjectType, Field } from '../../src';

@ObjectType()
class Query {
  @Field(String)
  hello() {
    return 'World';
  }
}

const schema = new Schema({ query: Query });

schema.execute(`query {
    hello
}`);

export default schema;
