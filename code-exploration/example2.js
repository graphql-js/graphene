import { ObjectType, Schema, String } from "graphene";


class Query extends ObjectType {
  hello = new String();

  helloResolver() {
    return "Hello world!";
  }
}

const schema = new Schema(Query);
