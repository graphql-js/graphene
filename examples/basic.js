import {
  ObjectType,
  String
} from "../../src";

class Query extends ObjectType {
  static fields = {
    hello: new String(),
  };

  hello() {
    return "World";
  }
}

const schema = new Schema({ query: Query });

schema.execute(`query {
    hello
}`)

export default schema;
